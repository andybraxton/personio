import { ScrapedPage } from '@/types';

function extractText(html: string): { title: string; text: string } {
  // Pull <title>
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Remove blocks that contain no readable content
  let cleaned = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  // Strip all remaining tags
  cleaned = cleaned.replace(/<[^>]+>/g, ' ');

  // Decode common HTML entities
  cleaned = cleaned
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, ' ');

  // Collapse whitespace and trim
  const text = cleaned.replace(/\s+/g, ' ').trim();

  // Cap at ~6000 chars per page to keep prompt size manageable
  return { title, text: text.slice(0, 6000) };
}

const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function scrapeJourneyPages(urls: string[]): Promise<ScrapedPage[]> {
  const results: ScrapedPage[] = [];
  const validUrls = urls.filter((u) => u.trim().length > 0);

  for (let i = 0; i < validUrls.length; i++) {
    const url = validUrls[i].trim();

    // Polite delay between requests (skip before the first one)
    if (i > 0) await sleep(1200);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': BROWSER_UA,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-GB,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
        },
        redirect: 'follow',
      });

      clearTimeout(timeout);

      if (res.status === 429) {
        // Rate-limited by the target site — record and continue, don't crash the report
        results.push({ url, step: i + 1, title: url, text: '', error: 'Rate limited (429) — page skipped' });
        // Back off before the next request
        await sleep(3000);
        continue;
      }

      if (!res.ok) {
        results.push({ url, step: i + 1, title: url, text: '', error: `HTTP ${res.status}` });
        continue;
      }

      const html = await res.text();
      const { title, text } = extractText(html);

      results.push({ url, step: i + 1, title: title || url, text });
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
