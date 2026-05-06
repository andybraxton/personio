import { parse } from 'node-html-parser';
import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import { ScrapedPage } from '@/types';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getVenvPython(): string {
  const scriptsDir = path.join(process.cwd(), 'scripts');
  const venvDir = path.join(scriptsDir, '.venv');
  const venvPython = path.join(venvDir, 'bin', 'python3');

  if (!existsSync(venvPython)) {
    // Create venv
    const create = spawnSync('python3', ['-m', 'venv', venvDir], { encoding: 'utf8' });
    if (create.status !== 0) throw new Error(`Failed to create venv: ${create.stderr}`);

    // Install requests into venv
    const install = spawnSync(venvPython, ['-m', 'pip', 'install', 'requests', '-q'], { encoding: 'utf8' });
    if (install.status !== 0) throw new Error(`Failed to install requests: ${install.stderr}`);
  }

  return venvPython;
}

function fetchWithPython(url: string): { status: number; html: string; finalUrl: string } {
  const python = getVenvPython();
  const scriptPath = path.join(process.cwd(), 'scripts', 'scrape_url.py');
  const result = spawnSync(python, [scriptPath, url], {
    timeout: 20000,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });

  if (result.error) throw result.error;
  if (!result.stdout?.trim()) {
    throw new Error(result.stderr?.trim() || 'Python scraper returned no output');
  }

  const data = JSON.parse(result.stdout);
  if (data.error && !data.html) throw new Error(data.error);
  return { status: data.status, html: data.html ?? '', finalUrl: data.url ?? url };
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

  for (let i = 0; i < validUrls.length; i++) {
    const url = validUrls[i].trim();

    if (i > 0) await sleep(1000);

    try {
      const { status, html, finalUrl } = fetchWithPython(url);

      if (status === 429) {
        results.push({ url, step: i + 1, title: url, text: '', error: 'Rate limited (429)' });
        continue;
      }
      if (status < 200 || status >= 300) {
        results.push({ url, step: i + 1, title: url, text: '', error: `HTTP ${status}` });
        continue;
      }

      const data = extractPageData(html);
      results.push({ url: finalUrl, step: i + 1, title: data.title || url, text: formatPageData(data) });
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
