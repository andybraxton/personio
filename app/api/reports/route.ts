import { NextResponse } from 'next/server';
import { listReports } from '@/lib/storage';

export async function GET() {
  try {
    const reports = listReports();
    return NextResponse.json(reports);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
