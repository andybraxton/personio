import { Experiment, ExperimentPriority, KeyEvidence } from '@/types';

interface Props {
  experiments: Experiment[];
}

const priorityConfig: Record<ExperimentPriority, { label: string; color: string; ring: string; bg: string }> = {
  high: { label: 'HIGH', color: 'text-emerald-400', ring: 'ring-emerald-500/40', bg: 'bg-emerald-900/20' },
  medium: { label: 'MEDIUM', color: 'text-amber-400', ring: 'ring-amber-500/40', bg: 'bg-amber-900/20' },
  low: { label: 'LOW', color: 'text-slate-400', ring: 'ring-slate-500/40', bg: 'bg-slate-800/30' },
};

const evidenceTypeConfig: Record<KeyEvidence['type'], { color: string; dot: string }> = {
  strong_funnel: { color: 'text-blue-300 bg-blue-900/30 border-blue-700/40', dot: 'bg-blue-400' },
  strong_research: { color: 'text-emerald-300 bg-emerald-900/30 border-emerald-700/40', dot: 'bg-emerald-400' },
  moderate_heuristic: { color: 'text-purple-300 bg-purple-900/30 border-purple-700/40', dot: 'bg-purple-400' },
  weak_competitor: { color: 'text-amber-300 bg-amber-900/30 border-amber-700/40', dot: 'bg-amber-400' },
  high_agreement: { color: 'text-teal-300 bg-teal-900/30 border-teal-700/40', dot: 'bg-teal-400' },
};

const riceFields: { key: keyof Experiment['riceScores']; label: string; max: number; color: string }[] = [
  { key: 'reach', label: 'Reach', max: 25, color: 'bg-orange-500' },
  { key: 'impact', label: 'Impact', max: 25, color: 'bg-orange-500' },
  { key: 'confidence', label: 'Confidence', max: 25, color: 'bg-orange-500' },
  { key: 'effort', label: 'Effort', max: 25, color: 'bg-orange-500' },
];

export default function ExperimentsList({ experiments }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-orange-400" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300">
          Experiments — RICE Prioritised
        </h3>
        <span className="ml-auto text-xs text-slate-500">{experiments.length} experiments</span>
      </div>

      {experiments.map((exp, idx) => {
        const pc = priorityConfig[exp.priority];
        return (
          <div
            key={exp.id}
            className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-orange-950/30 border-b border-slate-700/50 px-4 py-3 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-orange-800/50 text-orange-200 text-xs font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-orange-400 uppercase tracking-widest font-semibold mb-0.5">Experiment</p>
                <h4 className="text-base font-bold text-orange-100 truncate">{exp.title}</h4>
              </div>
              {/* RICE score */}
              <div className={`shrink-0 flex flex-col items-center rounded-xl px-3 py-2 ring-1 ${pc.ring} ${pc.bg}`}>
                <span className={`text-2xl font-black tabular-nums ${pc.color}`}>{exp.riceTotal}</span>
                <span className="text-slate-500 text-xs leading-none">/100</span>
                <span className={`text-xs font-bold mt-0.5 ${pc.color}`}>{pc.label}</span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* RICE breakdown */}
              <div className="grid grid-cols-2 gap-2">
                {riceFields.map((f) => (
                  <div key={f.key} className="bg-slate-800/40 rounded-lg px-3 py-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">{f.label}</span>
                      <span className="text-xs font-semibold text-slate-300 tabular-nums">
                        {exp.riceScores[f.key]}/{f.max}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${f.color} rounded-full`}
                        style={{ width: `${(exp.riceScores[f.key] / f.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Hypothesis */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Hypothesis</p>
                <p className="text-sm text-slate-300 leading-relaxed">{exp.hypothesis}</p>
              </div>

              {/* Recommended test */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Recommended Test</p>
                <p className="text-sm text-orange-200 leading-relaxed">{exp.recommendedTest}</p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Primary Metric</p>
                  <p className="text-sm text-slate-300">{exp.primaryMetric}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Secondary Metrics</p>
                  <ul className="space-y-1">
                    {(exp.secondaryMetrics ?? []).map((m, i) => (
                      <li key={i} className="text-sm text-slate-400 flex items-start gap-1.5">
                        <span className="text-slate-600 mt-0.5">•</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key evidence */}
              {exp.keyEvidence.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Key Evidence</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(exp.keyEvidence ?? []).map((ev, i) => {
                      const ec = evidenceTypeConfig[ev.type];
                      return (
                        <span
                          key={i}
                          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${ec.color}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ec.dot}`} />
                          {ev.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Confidence rationale */}
              <div className="bg-slate-800/30 rounded-lg p-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Confidence Rationale</p>
                <p className="text-xs text-slate-400 leading-relaxed">{exp.confidenceRationale}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
