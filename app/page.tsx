'use client';

import { useState, useEffect, useCallback } from 'react';
import { CROInputs, CROReport, ReportSummary } from '@/types';
import InputForm from '@/components/InputForm';
import ReportView from '@/components/ReportView';

type View = { type: 'input' } | { type: 'report'; report: CROReport };

export default function Home() {
  const [view, setView] = useState<View>({ type: 'input' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const loadReports = useCallback(async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  async function handleRun(inputs: CROInputs) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/run-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Engine failed');
      setView({ type: 'report', report: data });
      await loadReports();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadReport(id: string) {
    try {
      const res = await fetch(`/api/reports/${id}`);
      if (!res.ok) throw new Error('Report not found');
      const report: CROReport = await res.json();
      setView({ type: 'report', report });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load report');
    }
  }

  async function handleDeleteReport(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('Delete this report?')) return;
    await fetch(`/api/reports/${id}`, { method: 'DELETE' });
    await loadReports();
    if (view.type === 'report' && view.report.id === id) {
      setView({ type: 'input' });
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top nav */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-white tracking-tight">CRO Engine</span>
            <span className="text-slate-600 text-sm">Admin</span>
            <span className="text-xs font-mono text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">v2.3</span>
          </div>

          <div className="ml-auto">
            <button
              onClick={() => setView({ type: 'input' })}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-purple-700/20 border border-purple-600/30 text-purple-300 hover:bg-purple-700/30 transition-colors font-medium"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Analysis
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 shrink-0 border-r border-slate-800/60 flex flex-col">
            <div className="p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Report History</p>
              {reports.length === 0 ? (
                <p className="text-xs text-slate-600 text-center py-6">
                  No reports yet. Run your first analysis.
                </p>
              ) : (
                <div className="space-y-1">
                  {reports.map((r) => (
                    <div
                      key={r.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleLoadReport(r.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLoadReport(r.id)}
                      className={`w-full text-left rounded-lg px-3 py-2.5 group transition-colors cursor-pointer ${
                        view.type === 'report' && view.report.id === r.id
                          ? 'bg-slate-700/60 border border-slate-600/50'
                          : 'hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-medium text-slate-300 leading-snug line-clamp-2 flex-1">
                          {r.title}
                        </p>
                        <button
                          onClick={(e) => handleDeleteReport(r.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all shrink-0 mt-0.5"
                          aria-label="Delete report"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs text-slate-600 tabular-nums">
                          {new Date(r.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                        <span className="text-slate-700">·</span>
                        <span className="text-xs text-slate-600">{r.signalCount}S</span>
                        <span className="text-slate-700">·</span>
                        <span className="text-xs text-slate-600">{r.opportunityCount}O</span>
                        <span className="text-slate-700">·</span>
                        <span className="text-xs text-slate-600">{r.experimentCount}E</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3 text-sm text-red-300 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
              <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            {view.type === 'input' ? (
              <InputForm onSubmit={handleRun} loading={loading} />
            ) : (
              <ReportView
                report={view.report}
                onBack={() => setView({ type: 'input' })}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
