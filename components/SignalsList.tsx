import { Signal, SignalSource, SignalStrength } from '@/types';

interface Props {
  signals: Signal[];
}

const sourceConfig: Record<SignalSource, { label: string; color: string; dot: string }> = {
  quantitative: { label: 'Quant', color: 'text-emerald-400 bg-emerald-900/30 border-emerald-700/50', dot: 'bg-emerald-400' },
  qualitative: { label: 'Qual', color: 'text-blue-400 bg-blue-900/30 border-blue-700/50', dot: 'bg-blue-400' },
  heuristic: { label: 'Heuristic', color: 'text-purple-400 bg-purple-900/30 border-purple-700/50', dot: 'bg-purple-400' },
  competitor: { label: 'Competitor', color: 'text-amber-400 bg-amber-900/30 border-amber-700/50', dot: 'bg-amber-400' },
};

const strengthConfig: Record<SignalStrength, { label: string; bar: string; text: string; border: string }> = {
  strong: { label: 'Strong Signal', bar: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-l-emerald-500' },
  moderate: { label: 'Moderate Signal', bar: 'bg-amber-500', text: 'text-amber-400', border: 'border-l-amber-500' },
  weak: { label: 'Weak Signal', bar: 'bg-slate-500', text: 'text-slate-400', border: 'border-l-slate-500' },
};

const SCORE_FIELDS: { key: keyof Signal['scores']; label: string; max: number }[] = [
  { key: 'evidenceStrength', label: 'Evidence Strength', max: 25 },
  { key: 'relevance', label: 'Relevance', max: 20 },
  { key: 'specificity', label: 'Specificity', max: 20 },
  { key: 'recency', label: 'Recency', max: 15 },
  { key: 'agreement', label: 'Agreement', max: 10 },
  { key: 'businessImpact', label: 'Business Impact', max: 10 },
];

function ScoreBar({ value, max }: { value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex-1 h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
        <div className="h-full bg-slate-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-slate-500 w-8 text-right tabular-nums">
        {value}/{max}
      </span>
    </div>
  );
}

export default function SignalsList({ signals }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-slate-400" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300">
          Signals by Strength
        </h3>
        <span className="ml-auto text-xs text-slate-500">{signals.length} signals</span>
      </div>

      {signals.map((signal) => {
        const sc = strengthConfig[signal.strength];
        const src = sourceConfig[signal.source];
        return (
          <div
            key={signal.id}
            className={`bg-slate-900/50 border border-slate-700/50 border-l-4 ${sc.border} rounded-lg p-4`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="text-sm text-slate-200 leading-snug flex-1">{signal.description}</p>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <div className={`flex items-center gap-1 text-xs font-semibold ${sc.text}`}>
                  <span>{signal.totalScore}</span>
                  <span className="text-slate-600">/100</span>
                </div>
                <span className={`text-xs font-medium ${sc.text}`}>{sc.label}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${src.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${src.dot}`} />
                {src.label}
              </span>
              <span className="text-xs text-slate-500">{signal.theme}</span>
            </div>

            <div className="space-y-1.5">
              {SCORE_FIELDS.map((f) => (
                <div key={f.key} className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <span className="text-xs text-slate-500 truncate">{f.label}</span>
                  <ScoreBar value={signal.scores[f.key]} max={f.max} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
