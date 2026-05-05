import { NextRequest, NextResponse } from 'next/server';
import { getReport, deleteReport } from '@/lib/storage';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = getReport(id);
  if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(report);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = deleteReport(id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
