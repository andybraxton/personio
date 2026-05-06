import { NextRequest, NextResponse } from 'next/server';

async function extractDocxFallback(buffer: Buffer): Promise<string> {
  const AdmZip = (await import('adm-zip')).default;
  const zip = new AdmZip(buffer);
  const entry = zip.getEntry('word/document.xml');
  if (!entry) return '';
  const xml = entry.getData().toString('utf-8');
  return xml
    .replace(/<w:p[ >][^>]*>/g, '\n')  // paragraph tags → newlines
    .replace(/<[^>]+>/g, '')            // strip all remaining tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth');
  const originalConsoleError = console.error;
  console.error = () => {};
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch {
    // Fallback: unzip the DOCX and parse the raw XML directly
    return extractDocxFallback(buffer);
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
