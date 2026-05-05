'use client';

import { useState } from 'react';
import { CROInputs } from '@/types';

interface Props {
  onSubmit: (inputs: CROInputs) => void;
  loading: boolean;
}

const FIELDS: { key: keyof CROInputs; label: string; sublabel: string; color: string; placeholder: string }[] = [
  {
    key: 'business',
    label: 'Business Context',
    sublabel: 'Goals & strategy',
    color: 'border-purple-400 focus:ring-purple-400',
    placeholder: 'e.g. We are a B2B SaaS HR platform targeting mid-market companies (200-2000 employees). Primary goal is to increase demo bookings by 30% this quarter. Key differentiator is automated compliance reporting...',
  },
  {
    key: 'user',
    label: 'User Context',
    sublabel: 'ICP, personas & intent',
    color: 'border-purple-400 focus:ring-purple-400',
    placeholder: 'e.g. Primary ICP: HR Directors at companies with 500+ employees. Secondary: VP People at high-growth startups. Key jobs-to-be-done: reduce compliance risk, save HR team time, improve employee experience...',
  },
  {
    key: 'experience',
    label: 'Experience Context',
    sublabel: 'Pages, journey, funnel & expected behaviour',
    color: 'border-purple-400 focus:ring-purple-400',
    placeholder: 'e.g. Funnel: Homepage → Pricing → Demo request. Key pages: pricing page, features comparison, customer stories. Expected journey: visitor reads features, checks pricing, books demo...',
  },
  {
    key: 'evidence',
    label: 'Evidence',
    sublabel: 'High strength — quant data, qual research, user feedback',
    color: 'border-emerald-500 focus:ring-emerald-500',
    placeholder: 'e.g. Analytics: Pricing page 38% exit rate, 12% scroll depth below fold. Heatmaps: 67% of clicks go to plan comparison table. User testing (n=8): 5/8 users confused by enterprise pricing. Surveys: "I couldn\'t figure out which plan was right for us" (repeated 3x)...',
  },
  {
    key: 'supportingInput',
    label: 'Supporting Input',
    sublabel: 'Lower strength — heuristics, competitor analysis',
    color: 'border-amber-500 focus:ring-amber-500',
    placeholder: 'e.g. Heuristic review: pricing page lacks social proof near CTA, no plan recommendation logic, mobile layout breaks comparison table. Competitor analysis: Competitor A uses guided plan selector, Competitor B shows ROI calculator inline...',
  },
];

export default function InputForm({ onSubmit, loading }: Props) {
  const [inputs, setInputs] = useState<CROInputs>({
    business: '',
    user: '',
    experience: '',
    evidence: '',
    supportingInput: '',
  });

  const hasContent = Object.values(inputs).some((v) => v.trim().length > 0);

  return (
    <div className="space-y-6">
      <div className="bg-purple-950/30 border border-purple-800/40 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-purple-200 mb-1">New CRO Analysis</h2>
        <p className="text-sm text-slate-400">
          Paste your research docs into the fields below. The AI engine will process them through all 5 stages and
          produce a prioritised list of signals, opportunities, and experiments.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {/* Context inputs */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Context</span>
            <div className="flex-1 h-px bg-purple-800/30" />
          </div>
          <div className="space-y-4">
            {FIELDS.slice(0, 3).map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {field.label}
                  <span className="ml-2 text-xs text-slate-500 font-normal">{field.sublabel}</span>
                </label>
                <textarea
                  className={`w-full bg-slate-900/60 border rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 resize-none transition-colors ${field.color}`}
                  rows={4}
                  placeholder={field.placeholder}
                  value={inputs[field.key]}
                  onChange={(e) => setInputs((prev) => ({ ...prev, [field.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Data inputs */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Data</span>
            <div className="flex-1 h-px bg-slate-700/40" />
          </div>
          <div className="space-y-4">
            {FIELDS.slice(3).map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {field.label}
                  <span className="ml-2 text-xs text-slate-500 font-normal">{field.sublabel}</span>
                </label>
                <textarea
                  className={`w-full bg-slate-900/60 border rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 resize-none transition-colors ${field.color}`}
                  rows={5}
                  placeholder={field.placeholder}
                  value={inputs[field.key]}
                  onChange={(e) => setInputs((prev) => ({ ...prev, [field.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => onSubmit(inputs)}
        disabled={loading || !hasContent}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Running CRO Engine…
          </span>
        ) : (
          'Run CRO Engine'
        )}
      </button>
    </div>
  );
}
