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

export async function scrapeJourneyPages(urls: string[]): Promise<ScrapedPage[]> {
  const results: ScrapedPage[] = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i].trim();
    if (!url) continue;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; CRO-Engine/1.0)',
          Accept: 'text/html',
        },
      });

      clearTimeout(timeout);

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
