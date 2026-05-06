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
    placeholder: 'e.g. We are a B2B SaaS HR platform targeting mid-market companies (200-2000 employees). Primary goal is to increase demo bookings by 30% this quarter...',
  },
  {
    key: 'user',
    label: 'User Context',
    sublabel: 'ICP, personas & intent',
    color: 'border-purple-400 focus:ring-purple-400',
    placeholder: 'e.g. Primary ICP: HR Directors at companies with 500+ employees. Key jobs-to-be-done: reduce compliance risk, save HR team time...',
  },
  {
    key: 'experience',
    label: 'Experience Context',
    sublabel: 'Manual notes on pages, journey, funnel & expected behaviour',
    color: 'border-purple-400 focus:ring-purple-400',
    placeholder: 'Optional — add notes here, or paste journey URLs below to scan pages automatically. e.g. Expected journey: visitor reads features, checks pricing, books demo...',
  },
  {
    key: 'evidence',
    label: 'Evidence',
    sublabel: 'High strength — quant data, qual research, user feedback',
    color: 'border-emerald-500 focus:ring-emerald-500',
    placeholder: 'e.g. Analytics: Pricing page 38% exit rate. User testing (n=8): 5/8 users confused by enterprise pricing. Surveys: "I couldn\'t figure out which plan was right for us"...',
  },
  {
    key: 'supportingInput',
    label: 'Supporting Input',
    sublabel: 'Lower strength — heuristics, competitor analysis',
    color: 'border-amber-500 focus:ring-amber-500',
    placeholder: 'e.g. Heuristic review: pricing page lacks social proof near CTA. Competitor analysis: Competitor A uses guided plan selector...',
  },
];

export default function InputForm({ onSubmit, loading }: Props) {
  const [inputs, setInputs] = useState<Omit<CROInputs, 'journeyUrls'>>({
    business: '',
    user: '',
    experience: '',
    evidence: '',
    supportingInput: '',
  });
  const [journeyUrls, setJourneyUrls] = useState<string[]>(['']);
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'pending'>('idle');

  function addUrl() {
    setJourneyUrls((prev) => [...prev, '']);
  }

  function removeUrl(i: number) {
    setJourneyUrls((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateUrl(i: number, value: string) {
    setJourneyUrls((prev) => prev.map((u, idx) => (idx === i ? value : u)));
  }

  function handlePasteMultiple(e: React.ClipboardEvent<HTMLInputElement>, i: number) {
    const pasted = e.clipboardData.getData('text');
    const lines = pasted
      .split(/[\n\r]+/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length > 1) {
      e.preventDefault();
      setJourneyUrls((prev) => {
        const updated = [...prev];
        updated.splice(i, 1, ...lines);
        return updated;
      });
    }
  }

  const validUrls = journeyUrls.filter((u) => u.trim().length > 0);
  const hasContent =
    Object.values(inputs).some((v) => v.trim().length > 0) || validUrls.length > 0;

  function handleSubmit() {
    if (validUrls.length > 0) setFetchStatus('pending');
    onSubmit({ ...inputs, journeyUrls: validUrls });
  }

  return (
    <div className="space-y-6">
      <div className="bg-purple-950/30 border border-purple-800/40 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-purple-200 mb-1">New CRO Analysis</h2>
        <p className="text-sm text-slate-400">
          Paste your research docs into the fields below, and/or add journey URLs to scan automatically.
          The AI engine processes everything through all 5 stages.
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
            {FIELDS.slice(0, 2).map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {field.label}
                  <span className="ml-2 text-xs text-slate-500 font-normal">{field.sublabel}</span>
                </label>
                <textarea
                  className={`w-full bg-slate-900/60 border rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 resize-none transition-colors ${field.color}`}
                  rows={4}
                  placeholder={field.placeholder}
                  value={inputs[field.key as keyof typeof inputs] as string}
                  onChange={(e) => setInputs((prev) => ({ ...prev, [field.key]: e.target.value }))}
                />
              </div>
            ))}

            {/* Experience context + journey URL scanner */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Experience Context
                <span className="ml-2 text-xs text-slate-500 font-normal">
                  Pages, journey, funnel & expected behaviour
                </span>
              </label>
              <textarea
                className="w-full bg-slate-900/60 border border-purple-400 focus:ring-purple-400 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 resize-none transition-colors"
                rows={3}
                placeholder="Optional manual notes — or scan pages automatically using journey URLs below..."
                value={inputs.experience}
                onChange={(e) => setInputs((prev) => ({ ...prev, experience: e.target.value }))}
              />

              {/* Journey URL scanner */}
              <div className="mt-3 bg-slate-900/40 border border-slate-700/60 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-sm font-semibold text-teal-300">Journey URL Scanner</span>
                  <span className="text-xs text-slate-500">— one URL per step, in funnel order</span>
                </div>

                <div className="space-y-2">
                  {journeyUrls.map((url, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-700/60 text-slate-400 text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <input
                        type="url"
                        className="flex-1 bg-slate-800/60 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        placeholder={`https://yoursite.com/${i === 0 ? '' : i === 1 ? 'pricing' : i === 2 ? 'signup' : 'step-' + (i + 1)}`}
                        value={url}
                        onChange={(e) => updateUrl(i, e.target.value)}
                        onPaste={(e) => handlePasteMultiple(e, i)}
                      />
                      {journeyUrls.length > 1 && (
                        <button
                          onClick={() => removeUrl(i)}
                          className="text-slate-600 hover:text-red-400 transition-colors shrink-0"
                          aria-label="Remove URL"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={addUrl}
                    className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors font-medium"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add step
                  </button>
                  {validUrls.length > 0 && (
                    <span className="text-xs text-slate-500">
                      {validUrls.length} page{validUrls.length !== 1 ? 's' : ''} will be scanned
                    </span>
                  )}
                  {loading && fetchStatus === 'pending' && (
                    <span className="text-xs text-teal-400 flex items-center gap-1">
                      <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Scanning pages…
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-2">
                  Tip: paste multiple URLs at once and they&apos;ll fill in as separate steps. Only public pages can be scanned.
                </p>
              </div>
            </div>
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
                  value={inputs[field.key as keyof typeof inputs] as string}
                  onChange={(e) => setInputs((prev) => ({ ...prev, [field.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !hasContent}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {fetchStatus === 'pending' ? 'Scanning pages & running engine…' : 'Running CRO Engine…'}
          </span>
        ) : (
          'Run CRO Engine'
        )}
      </button>
    </div>
  );
}
