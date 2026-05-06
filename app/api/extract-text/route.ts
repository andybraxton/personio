import { NextRequest, NextResponse } from 'next/server';

async function extractDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth');

  // xmldom emits noisy warnings to console.error for some valid DOCX files — suppress them
  const originalConsoleError = console.error;
  console.error = () => {};
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } finally {
    console.error = originalConsoleError;
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const name = file.name.toLowerCase();
    let text = '';

    if (name.endsWith('.pdf')) {
      const { PDFParse } = await import('pdf-parse');
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      const result = await parser.getText();
      text = result.text;
    } else if (name.endsWith('.docx')) {
      text = await extractDocx(buffer);
    } else {
      text = buffer.toString('utf-8');
    }

    text = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

    return NextResponse.json({ text, filename: file.name });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Extraction failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
