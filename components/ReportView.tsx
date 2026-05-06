'use client';

import { useState } from 'react';
import { CROReport, ScrapedPage } from '@/types';

function ScannedPages({ pages }: { pages: ScrapedPage[] }) {
  if (pages.length === 0) {
    return <p className="text-sm text-slate-500 text-center py-8">No pages were scanned in this report.</p>;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-cyan-400" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300">Scanned Journey Pages</h3>
        <span className="ml-auto text-xs text-slate-500">{pages.length} pages</span>
      </div>
      {pages.map((p) => (
        <div key={p.url} className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/50 bg-cyan-950/20">
            <span className="w-6 h-6 rounded-full bg-cyan-800/50 text-cyan-200 text-xs font-bold flex items-center justify-center shrink-0">
              {p.step}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-cyan-200 truncate">{p.title}</p>
              <p className="text-xs text-slate-500 truncate">{p.url}</p>
            </div>
            {p.error && (
              <span className="text-xs text-red-400 bg-red-900/20 border border-red-800/40 px-2 py-0.5 rounded-full">
                {p.error}
              </span>
            )}
          </div>
          {p.text ? (
            <p className="px-4 py-3 text-xs text-slate-400 leading-relaxed line-clamp-6">{p.text}</p>
          ) : (
            <p className="px-4 py-3 text-xs text-slate-600 italic">No content extracted.</p>
          )}
        </div>
      ))}
    </div>
  );
}
import SignalsList from './SignalsList';
import OpportunitiesList from './OpportunitiesList';
import ExperimentsList from './ExperimentsList';

interface Props {
  report: CROReport;
  onBack: () => void;
}

type Tab = 'signals' | 'opportunities' | 'experiments' | 'pages';

const TABS: { id: Tab; label: string; color: string; activeColor: string }[] = [
  { id: 'signals', label: 'Signals', color: 'text-slate-400', activeColor: 'text-slate-200 border-b-2 border-slate-400' },
  { id: 'opportunities', label: 'Opportunities', color: 'text-slate-400', activeColor: 'text-teal-300 border-b-2 border-teal-400' },
  { id: 'experiments', label: 'Experiments', color: 'text-slate-400', activeColor: 'text-orange-300 border-b-2 border-orange-400' },
  { id: 'pages', label: 'Scanned Pages', color: 'text-slate-400', activeColor: 'text-cyan-300 border-b-2 border-cyan-400' },
];

export default function ReportView({ report, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('signals');

  const secs = Math.round(report.processingTimeMs / 1000);

  return (
    <div>
      {/* Report header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to inputs
        </button>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h2 className="text-xl font-bold text-white mb-1">{report.title}</h2>
          <p className="text-sm text-slate-400">
            {new Date(report.createdAt).toLocaleString('en-GB', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}{' '}
            · Processed in {secs}s
          </p>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <button
              onClick={() => setActiveTab('signals')}
              className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-3 text-center hover:border-slate-500 transition-colors"
            >
              <p className="text-2xl font-black text-slate-200">{(report.signals ?? []).length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Signals</p>
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-3 text-center hover:border-teal-600 transition-colors"
            >
              <p className="text-2xl font-black text-teal-300">{(report.opportunities ?? []).length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Opportunities</p>
            </button>
            <button
              onClick={() => setActiveTab('experiments')}
              className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-3 text-center hover:border-orange-600 transition-colors"
            >
              <p className="text-2xl font-black text-orange-300">{(report.experiments ?? []).length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Experiments</p>
            </button>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex border-b border-slate-700/50 mb-6">
        {TABS.filter((t) => t.id !== 'pages' || (report.scrapedPages ?? []).length > 0).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === tab.id ? tab.activeColor : `${tab.color} hover:text-slate-300`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'signals' && <SignalsList signals={report.signals ?? []} />}
      {activeTab === 'opportunities' && <OpportunitiesList opportunities={report.opportunities ?? []} />}
      {activeTab === 'experiments' && <ExperimentsList experiments={report.experiments ?? []} />}
      {activeTab === 'pages' && <ScannedPages pages={report.scrapedPages ?? []} />}
    </div>
  );
}
