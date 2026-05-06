import { Opportunity, ConfidenceLevel } from '@/types';

interface Props {
  opportunities: Opportunity[];
}

const confidenceConfig: Record<ConfidenceLevel, { label: string; color: string; ring: string; bg: string }> = {
  high: { label: 'HIGH', color: 'text-emerald-400', ring: 'ring-emerald-500/40', bg: 'bg-emerald-900/20' },
  medium: { label: 'MEDIUM', color: 'text-amber-400', ring: 'ring-amber-500/40', bg: 'bg-amber-900/20' },
  low: { label: 'LOW', color: 'text-slate-400', ring: 'ring-slate-500/40', bg: 'bg-slate-900/20' },
};

const scoreFields: { key: keyof Opportunity['confidenceScores']; label: string; max: number }[] = [
  { key: 'evidence', label: 'Evidence', max: 40 },
  { key: 'supportingInput', label: 'Supporting input', max: 20 },
  { key: 'experimentHistory', label: 'Experiment history', max: 20 },
  { key: 'strategicFit', label: 'Strategic fit', max: 20 },
];

export default function OpportunitiesList({ opportunities }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-teal-400" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300">
          Opportunities — Ranked
        </h3>
        <span className="ml-auto text-xs text-slate-500">{opportunities.length} opportunities</span>
      </div>

      {opportunities.map((opp, idx) => {
        const cc = confidenceConfig[opp.confidenceLevel];
        return (
          <div
            key={opp.id}
            className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-indigo-900/30 border-b border-slate-700/50 px-4 py-3 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-700/60 text-indigo-200 text-xs font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-indigo-400 uppercase tracking-widest font-semibold mb-0.5">Opportunity</p>
                <h4 className="text-base font-bold text-indigo-200 truncate">{opp.title}</h4>
              </div>
              {/* Confidence dial */}
              <div className={`shrink-0 flex flex-col items-center rounded-xl px-3 py-2 ring-1 ${cc.ring} ${cc.bg}`}>
                <span className={`text-2xl font-black tabular-nums ${cc.color}`}>{opp.confidenceTotal}</span>
                <span className="text-slate-500 text-xs leading-none">/100</span>
                <span className={`text-xs font-bold mt-0.5 ${cc.color}`}>{cc.label}</span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Confidence breakdown */}
              <div className="grid grid-cols-2 gap-2">
                {scoreFields.map((f) => (
                  <div key={f.key} className="bg-slate-800/40 rounded-lg px-3 py-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">{f.label}</span>
                      <span className="text-xs font-semibold text-slate-300 tabular-nums">
                        {opp.confidenceScores[f.key]}/{f.max}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(opp.confidenceScores[f.key] / f.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Hypothesis */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Hypothesis</p>
                <p className="text-sm text-slate-300 leading-relaxed">{opp.hypothesis}</p>
              </div>

              {/* Ideas */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Test Ideas</p>
                <ol className="space-y-1.5">
                  {opp.ideas.map((idea) => (
                    <li key={idea.number} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-800/50 text-indigo-300 text-xs font-bold flex items-center justify-center mt-0.5">
                        {idea.number}
                      </span>
                      {idea.description}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
