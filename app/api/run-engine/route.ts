import { NextRequest, NextResponse } from 'next/server';
import { runCROEngine } from '@/lib/cro-engine';
import { saveReport } from '@/lib/storage';
import { CROInputs } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const inputs: CROInputs = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not set' }, { status: 500 });
    }

    const report = await runCROEngine(inputs);
    saveReport(report);

    return NextResponse.json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
