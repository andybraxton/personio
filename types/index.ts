export interface CROInputs {
  business: string;
  user: string;
  experience: string;
  evidence: string;
  supportingInput: string;
}

export interface SignalScores {
  evidenceStrength: number; // /25
  relevance: number; // /20
  specificity: number; // /20
  recency: number; // /15
  agreement: number; // /10
  businessImpact: number; // /10
}

export type SignalSource = 'quantitative' | 'qualitative' | 'heuristic' | 'competitor';
export type SignalStrength = 'strong' | 'moderate' | 'weak';

export interface Signal {
  id: string;
  description: string;
  source: SignalSource;
  scores: SignalScores;
  totalScore: number;
  theme: string;
  strength: SignalStrength;
}

export interface Idea {
  number: number;
  description: string;
}

export interface ConfidenceScores {
  evidence: number; // /40
  supportingInput: number; // /20
  experimentHistory: number; // /20
  strategicFit: number; // /20
}

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface Opportunity {
  id: string;
  title: string;
  theme: string;
  relatedSignalIds: string[];
  hypothesis: string;
  ideas: Idea[];
  confidenceScores: ConfidenceScores;
  confidenceTotal: number;
  confidenceLevel: ConfidenceLevel;
}

export interface RICEScores {
  reach: number; // /25
  impact: number; // /25
  confidence: number; // /25
  effort: number; // /25 (higher = less effort = better)
}

export type ExperimentPriority = 'high' | 'medium' | 'low';

export interface KeyEvidence {
  label: string;
  type: 'strong_funnel' | 'strong_research' | 'moderate_heuristic' | 'weak_competitor' | 'high_agreement';
}

export interface Experiment {
  id: string;
  opportunityId: string;
  title: string;
  hypothesis: string;
  recommendedTest: string;
  primaryMetric: string;
  secondaryMetrics: string[];
  riceScores: RICEScores;
  riceTotal: number;
  priority: ExperimentPriority;
  keyEvidence: KeyEvidence[];
  confidenceRationale: string;
}

export interface CROReport {
  id: string;
  createdAt: string;
  title: string;
  inputs: CROInputs;
  signals: Signal[];
  opportunities: Opportunity[];
  experiments: Experiment[];
  processingTimeMs: number;
}

export interface ReportSummary {
  id: string;
  title: string;
  createdAt: string;
  signalCount: number;
  opportunityCount: number;
  experimentCount: number;
}
