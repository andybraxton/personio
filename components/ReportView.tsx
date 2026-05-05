'use client';

import { useState } from 'react';
import { CROReport } from '@/types';
import SignalsList from './SignalsList';
import OpportunitiesList from './OpportunitiesList';
import ExperimentsList from './ExperimentsList';

interface Props {
  report: CROReport;
  onBack: () => void;
}

type Tab = 'signals' | 'opportunities' | 'experiments';

const TABS: { id: Tab; label: string; color: string; activeColor: string }[] = [
  { id: 'signals', label: 'Signals', color: 'text-slate-400', activeColor: 'text-slate-200 border-b-2 border-slate-400' },
  { id: 'opportunities', label: 'Opportunities', color: 'text-slate-400', activeColor: 'text-teal-300 border-b-2 border-teal-400' },
  { id: 'experiments', label: 'Experiments', color: 'text-slate-400', activeColor: 'text-orange-300 border-b-2 border-orange-400' },
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
              <p className="text-2xl font-black text-slate-200">{report.signals.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Signals</p>
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-3 text-center hover:border-teal-600 transition-colors"
            >
              <p className="text-2xl font-black text-teal-300">{report.opportunities.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Opportunities</p>
            </button>
            <button
              onClick={() => setActiveTab('experiments')}
              className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-3 text-center hover:border-orange-600 transition-colors"
            >
              <p className="text-2xl font-black text-orange-300">{report.experiments.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Experiments</p>
            </button>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex border-b border-slate-700/50 mb-6">
        {TABS.map((tab) => (
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
      {activeTab === 'signals' && <SignalsList signals={report.signals} />}
      {activeTab === 'opportunities' && <OpportunitiesList opportunities={report.opportunities} />}
      {activeTab === 'experiments' && <ExperimentsList experiments={report.experiments} />}
    </div>
  );
}
