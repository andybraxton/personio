import { NextRequest, NextResponse } from 'next/server';
import { runCROEngine } from '@/lib/cro-engine';
import { saveReport } from '@/lib/storage';
import { scrapeJourneyPages, formatScrapedPages } from '@/lib/url-fetcher';
import { CROInputs } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const inputs: CROInputs = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not set' }, { status: 500 });
    }

    // Scrape journey URLs and inject into experience context
    let scrapedPages = undefined;
    const urls = (inputs.journeyUrls ?? []).filter((u) => u.trim().length > 0);

    if (urls.length > 0) {
      scrapedPages = await scrapeJourneyPages(urls);
      const scraped = formatScrapedPages(scrapedPages);
      inputs.experience = [
        inputs.experience ? `Manual notes:\n${inputs.experience}` : '',
        `Scraped journey pages (${urls.length} steps):\n${scraped}`,
      ]
        .filter(Boolean)
        .join('\n\n');
    }

    const report = await runCROEngine(inputs);
    report.scrapedPages = scrapedPages;
    saveReport(report);

    return NextResponse.json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
