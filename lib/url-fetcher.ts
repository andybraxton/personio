import { parse } from 'node-html-parser';
import https from 'node:https';
import http, { IncomingMessage } from 'node:http';
import { ScrapedPage } from '@/types';

const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface FetchResult {
  status: number;
  text: string;
  headers: Record<string, string | string[]>;
}

// Use Node's native http/https module (avoids undici's TLS fingerprint which WAFs detect)
function nodeFetch(
  url: string,
  reqHeaders: Record<string, string>,
  redirectsLeft = 5
): Promise<FetchResult> {
  return new Promise((resolve, reject) => {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return reject(new Error(`Invalid URL: ${url}`));
    }

    const isHttps = parsed.protocol === 'https:';
    const lib = isHttps ? https : http;
    const port = parsed.port ? parseInt(parsed.port) : isHttps ? 443 : 80;

    const options = {
      hostname: parsed.hostname,
      port,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        'User-Agent': BROWSER_UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.9',
        'Accept-Encoding': 'identity', // skip compression to simplify response handling
        Connection: 'keep-alive',
        ...reqHeaders,
      },
    };

    const req = lib.request(options, (res: IncomingMessage) => {
      // Follow redirects
      if (
        redirectsLeft > 0 &&
        res.statusCode &&
        [301, 302, 303, 307, 308].includes(res.statusCode) &&
        res.headers.location
      ) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : `${parsed.protocol}//${parsed.host}${res.headers.location}`;
        res.resume();
        return resolve(nodeFetch(next, reqHeaders, redirectsLeft - 1));
      }

      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode ?? 0,
          text: Buffer.concat(chunks).toString('utf-8'),
          headers: res.headers as Record<string, string | string[]>,
        });
      });
      res.on('error', reject);
    });

    req.setTimeout(15000, () => {
      req.destroy(new Error('Request timeout'));
    });

    req.on('error', reject);
    req.end();
  });
}

// Cookie jar: domain → array of "name=value" strings
type CookieJar = Record<string, string[]>;

function updateCookieJar(
  setCookieHeader: string | string[] | undefined,
  domain: string,
  jar: CookieJar
) {
  const values = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : setCookieHeader
    ? [setCookieHeader]
    : [];

  jar[domain] ??= [];
  for (const cookie of values) {
    const nameVal = cookie.split(';')[0].trim();
    const name = nameVal.split('=')[0];
    const idx = jar[domain].findIndex((c) => c.startsWith(`${name}=`));
    if (idx >= 0) jar[domain][idx] = nameVal;
    else jar[domain].push(nameVal);
  }
}

function cookieHeader(domain: string, jar: CookieJar): string {
  return (jar[domain] ?? []).join('; ');
}

interface PageData {
  title: string;
  metaDescription: string;
  headings: Record<string, string[]>;
  bodyText: string;
  wordCount: number;
  ctaTexts: string[];
  navLinks: string[];
  buttonTexts: string[];
  forms: { fieldCount: number; hasLabels: boolean; action: string }[];
  imageCount: number;
  missingAlt: number;
  socialLinks: string[];
}

function extractPageData(html: string): PageData {
  const root = parse(html);

  const title = root.querySelector('title')?.text?.trim() ?? '';
  const metaDescription =
    root.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ??
    root.querySelector('meta[property="og:description"]')?.getAttribute('content')?.trim() ??
    '';

  const headings: Record<string, string[]> = {};
  for (let i = 1; i <= 4; i++) {
    headings[`h${i}`] = root
      .querySelectorAll(`h${i}`)
      .map((el) => el.text.trim())
      .filter(Boolean)
      .slice(0, 10);
  }

  const nav = root.querySelector('nav') ?? root.querySelector('[role="navigation"]');
  const navLinks = nav
    ? nav.querySelectorAll('a').map((a) => a.text.trim()).filter(Boolean).slice(0, 20)
    : [];

  const ctaTexts = root
    .querySelectorAll('a')
    .map((a) => a.text.trim())
    .filter((t) => t && t.length < 60)
    .slice(0, 30);

  const buttonTexts = root
    .querySelectorAll('button, input[type="submit"], a[class*="btn"], a[class*="button"], a[class*="cta"]')
    .map((el) => (el.getAttribute('value') ?? el.text).trim())
    .filter(Boolean)
    .slice(0, 15);

  const textTypes = new Set(['text', 'email', 'tel', 'number', 'url', 'search', 'password']);
  const forms = root.querySelectorAll('form').map((form) => {
    const fieldCount = form.querySelectorAll('input, textarea, select').filter((el) => {
      if (el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return true;
      return textTypes.has((el.getAttribute('type') ?? 'text').toLowerCase());
    }).length;
    return {
      fieldCount,
      hasLabels: form.querySelectorAll('label').length > 0,
      action: form.getAttribute('action') ?? '',
    };
  });

  const images = root.querySelectorAll('img');
  const imageCount = images.length;
  const missingAlt = images.filter((img) => !img.getAttribute('alt')).length;

  const socialDomains = ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'youtube.com', 'x.com'];
  const socialLinks = root
    .querySelectorAll('a[href]')
    .map((a) => a.getAttribute('href') ?? '')
    .filter((href) => socialDomains.some((d) => href.includes(d)))
    .slice(0, 6);

  const clone = parse(html);
  clone.querySelectorAll('script, style, noscript').forEach((el) => el.remove());
  const bodyText = clone.text.replace(/\s+/g, ' ').trim().slice(0, 5000);
  const wordCount = bodyText.split(/\s+/).length;

  return {
    title, metaDescription, headings, bodyText, wordCount,
    ctaTexts, navLinks, buttonTexts, forms, imageCount, missingAlt, socialLinks,
  };
}

function formatPageData(data: PageData): string {
  const lines: string[] = [];
  if (data.title) lines.push(`Title: ${data.title}`);
  if (data.metaDescription) lines.push(`Meta description: ${data.metaDescription}`);
  for (const [level, texts] of Object.entries(data.headings)) {
    if (texts.length > 0) lines.push(`${level.toUpperCase()}: ${texts.join(' | ')}`);
  }
  if (data.navLinks.length > 0) lines.push(`Navigation: ${data.navLinks.join(', ')}`);
  if (data.buttonTexts.length > 0) lines.push(`Buttons/CTAs: ${data.buttonTexts.join(', ')}`);
  if (data.ctaTexts.length > 0) lines.push(`Link texts: ${data.ctaTexts.slice(0, 20).join(', ')}`);
  if (data.forms.length > 0) {
    lines.push(`Forms: ${data.forms.map((f, i) => `Form ${i + 1}: ${f.fieldCount} fields, labels=${f.hasLabels}`).join('; ')}`);
  }
  lines.push(`Images: ${data.imageCount} total, ${data.missingAlt} missing alt`);
  lines.push(`Word count: ${data.wordCount}`);
  if (data.socialLinks.length > 0) lines.push(`Social: ${data.socialLinks.join(', ')}`);
  lines.push('');
  lines.push('Page text (first 5000 chars):');
  lines.push(data.bodyText);
  return lines.join('\n');
}

export async function scrapeJourneyPages(urls: string[]): Promise<ScrapedPage[]> {
  const results: ScrapedPage[] = [];
  const validUrls = urls.filter((u) => u.trim().length > 0);
  const cookieJar: CookieJar = {};

  for (let i = 0; i < validUrls.length; i++) {
    const url = validUrls[i].trim();
    const domain = new URL(url).hostname;
    const prevUrl = i > 0 ? validUrls[i - 1].trim() : undefined;

    if (i > 0) await sleep(1500);

    try {
      const cookies = cookieHeader(domain, cookieJar);
      const extraHeaders: Record<string, string> = {};
      if (cookies) extraHeaders['Cookie'] = cookies;
      if (prevUrl) extraHeaders['Referer'] = prevUrl;

      const res = await nodeFetch(url, extraHeaders);

      updateCookieJar(res.headers['set-cookie'], domain, cookieJar);

      if (res.status === 429) {
        results.push({ url, step: i + 1, title: url, text: '', error: 'Rate limited (429) — page skipped' });
        await sleep(4000);
        continue;
      }

      if (res.status < 200 || res.status >= 300) {
        results.push({ url, step: i + 1, title: url, text: '', error: `HTTP ${res.status}` });
        continue;
      }

      const data = extractPageData(res.text);
      const text = formatPageData(data);
      results.push({ url, step: i + 1, title: data.title || url, text });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fetch failed';
      results.push({ url, step: i + 1, title: url, text: '', error: message });
    }
  }

  return results;
}

export function formatScrapedPages(pages: ScrapedPage[]): string {
  return pages
    .map((p) => {
      if (p.error) {
        return `--- Step ${p.step}: ${p.url} (Error: ${p.error}) ---\n(Could not fetch this page)`;
      }
      return `--- Step ${p.step}: ${p.title}\nURL: ${p.url}\n\n${p.text}`;
    })
    .join('\n\n');
}
