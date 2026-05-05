import fs from 'fs';
import path from 'path';
import { CROReport, ReportSummary } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data', 'reports');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function saveReport(report: CROReport): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${report.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
}

export function getReport(id: string): CROReport | null {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as CROReport;
}

export function listReports(): ReportSummary[] {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
  return files
    .map((file) => {
      const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
      const report = JSON.parse(content) as CROReport;
      return {
        id: report.id,
        title: report.title,
        createdAt: report.createdAt,
        signalCount: report.signals.length,
        opportunityCount: report.opportunities.length,
        experimentCount: report.experiments.length,
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function deleteReport(id: string): boolean {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return false;
  fs.unlinkSync(filePath);
  return true;
}
