import Anthropic from '@anthropic-ai/sdk';
import {
  CROInputs,
  CROReport,
  Signal,
  SignalScores,
  SignalStrength,
  SignalSource,
  Opportunity,
  ConfidenceLevel,
  Experiment,
  ExperimentPriority,
  KeyEvidence,
} from '@/types';

const client = new Anthropic({
  maxRetries: 0,    // we handle retries manually below to respect Retry-After
  timeout: 180_000,
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createMessageWithRetry(
  params: Parameters<typeof client.messages.create>[0]
): ReturnType<typeof client.messages.create> {
  const maxAttempts = 4;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await client.messages.create(params);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      const headers = (err as { headers?: Record<string, string> })?.headers;
      if (status === 429 && attempt < maxAttempts - 1) {
        const retryAfter = headers?.['retry-after'];
        // Respect the server's Retry-After, or wait 30s / 60s / 90s progressively
        const waitMs = retryAfter ? parseInt(retryAfter) * 1000 : (attempt + 1) * 30_000;
        await sleep(waitMs);
        continue;
      }
      throw err;
    }
  }
  throw new Error('Max retries exceeded');
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function calcSignalStrength(total: number): SignalStrength {
  if (total >= 70) return 'strong';
  if (total >= 40) return 'moderate';
  return 'weak';
}

function calcConfidenceLevel(total: number): ConfidenceLevel {
  if (total >= 70) return 'high';
  if (total >= 40) return 'medium';
  return 'low';
}

function calcPriority(total: number): ExperimentPriority {
  if (total >= 70) return 'high';
  if (total >= 40) return 'medium';
  return 'low';
}

function evidenceTypeToKey(label: string): KeyEvidence['type'] {
  const l = label.toLowerCase();
  if (l.includes('funnel')) return 'strong_funnel';
  if (l.includes('research') || l.includes('qual')) return 'strong_research';
  if (l.includes('heuristic') || l.includes('ux')) return 'moderate_heuristic';
  if (l.includes('competitor')) return 'weak_competitor';
  return 'high_agreement';
}

const ENGINE_TOOL = {
  name: 'output_cro_analysis',
  description: 'Output the complete CRO analysis in structured JSON format',
  input_schema: {
    type: 'object' as const,
    properties: {
      signals: {
        type: 'array',
        description: 'All extracted signals from the input data, sorted by total score descending',
        items: {
          type: 'object',
          properties: {
            description: { type: 'string', description: 'Specific, concrete signal observation' },
            source: {
              type: 'string',
              enum: ['quantitative', 'qualitative', 'heuristic', 'competitor'],
              description: 'Origin type of the signal',
            },
            theme: { type: 'string', description: 'Opportunity theme this signal belongs to' },
            scores: {
              type: 'object',
              properties: {
                evidenceStrength: { type: 'number', description: '0-25: robustness of underlying evidence' },
                relevance: { type: 'number', description: '0-20: direct relevance to conversion outcomes' },
                specificity: { type: 'number', description: '0-20: how specific and precise' },
                recency: { type: 'number', description: '0-15: how recent or current' },
                agreement: { type: 'number', description: '0-10: agreement across multiple data sources' },
                businessImpact: { type: 'number', description: '0-10: potential business impact if addressed' },
              },
              required: ['evidenceStrength', 'relevance', 'specificity', 'recency', 'agreement', 'businessImpact'],
            },
          },
          required: ['description', 'source', 'theme', 'scores'],
        },
      },
      opportunities: {
        type: 'array',
        description: 'Clustered opportunity themes, sorted by confidence score descending',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Short name for the opportunity theme (2-4 words)' },
            theme: { type: 'string', description: 'Longer description of the theme' },
            signalDescriptions: {
              type: 'array',
              items: { type: 'string' },
              description: 'Exact signal descriptions that support this opportunity',
            },
            hypothesis: {
              type: 'string',
              description: 'Full hypothesis: "Because [observation], we believe [user state]. If we [change], [metric] will improve because [reason]."',
            },
            ideas: {
              type: 'array',
              items: { type: 'string' },
              description: '4-6 specific, actionable test ideas',
            },
            confidenceScores: {
              type: 'object',
              properties: {
                evidence: { type: 'number', description: '0-40: quality and strength of evidence' },
                supportingInput: { type: 'number', description: '0-20: supporting qualitative/heuristic input' },
                experimentHistory: { type: 'number', description: '0-20: relevance of past experiments or industry data' },
                strategicFit: { type: 'number', description: '0-20: alignment with business goals and strategy' },
              },
              required: ['evidence', 'supportingInput', 'experimentHistory', 'strategicFit'],
            },
          },
          required: ['title', 'theme', 'signalDescriptions', 'hypothesis', 'ideas', 'confidenceScores'],
        },
      },
      experiments: {
        type: 'array',
        description: 'Prioritised experiments (one per opportunity), sorted by RICE total descending',
        items: {
          type: 'object',
          properties: {
            opportunityTitle: { type: 'string', description: 'Must match an opportunity title exactly' },
            title: { type: 'string', description: 'Short experiment name' },
            hypothesis: { type: 'string', description: 'Concise experiment hypothesis' },
            recommendedTest: { type: 'string', description: 'Specific test description (what to build/change)' },
            primaryMetric: { type: 'string', description: 'Single primary success metric with direction (e.g. "Pricing page → Demo request conversion rate")' },
            secondaryMetrics: {
              type: 'array',
              items: { type: 'string' },
              description: '2-4 secondary metrics to monitor',
            },
            riceScores: {
              type: 'object',
              properties: {
                reach: { type: 'number', description: '0-25: proportion of users/visitors affected' },
                impact: { type: 'number', description: '0-25: magnitude of impact per user' },
                confidence: { type: 'number', description: '0-25: confidence in reach and impact estimates' },
                effort: { type: 'number', description: '0-25: inverse effort score (25 = very low effort, 0 = massive effort)' },
              },
              required: ['reach', 'impact', 'confidence', 'effort'],
            },
            keyEvidenceLabels: {
              type: 'array',
              items: { type: 'string' },
              description: 'Short evidence labels e.g. "Strong funnel signal", "Strong research signal", "Moderate heuristic support", "Weak competitor signal", "High agreement across sources"',
            },
            confidenceRationale: {
              type: 'string',
              description: 'Concise paragraph explaining confidence level and key evidence sources',
            },
          },
          required: [
            'opportunityTitle',
            'title',
            'hypothesis',
            'recommendedTest',
            'primaryMetric',
            'secondaryMetrics',
            'riceScores',
            'keyEvidenceLabels',
            'confidenceRationale',
          ],
        },
      },
    },
    required: ['signals', 'opportunities', 'experiments'],
  },
};

function buildPrompt(inputs: CROInputs): string {
  return `You are an expert CRO (Conversion Rate Optimisation) strategist and analyst. Your task is to process the provided business inputs through a systematic 5-stage CRO analysis framework and produce structured, actionable outputs.

# CRO Analysis Framework

## Stage 1 — Understand Inputs
Parse the business context, user data, experience mapping, hard evidence, and supporting inputs provided below.

## Stage 2 — Extract & Score Signals
Extract 8–15 discrete, specific signals from the data. Each signal is a single, concrete observation (not a theme). Score each:
- Evidence Strength (0-25): How robust is the underlying evidence?
- Relevance (0-20): How directly does this relate to conversion outcomes?
- Specificity (0-20): How specific and actionable is the signal?
- Recency (0-15): How recent or current is this data?
- Agreement (0-10): Does this appear across multiple data sources?
- Business Impact (0-10): What is the potential business impact?

Total score 70-100 = Strong Signal | 40-69 = Moderate Signal | 0-39 = Weak/Competitor Insight

## Stage 3 — Triangulate
Group signals into 3–5 coherent opportunity themes. Each theme should be supported by multiple signals. The title should be concise (2-4 words, e.g., "Pricing Clarity", "Onboarding Flow", "Trust Signals").

## Stage 4 — Hypotheses & Ideas
For each opportunity:
- Write a full hypothesis: "Because [observation], we believe [user state]. If we [intervention], [metric] will improve because [reason]."
- Generate 4-6 specific, actionable test ideas.

## Stage 5 — Score Confidence & RICE
For each opportunity, produce one primary experiment:
- Confidence: Evidence (0-40), Supporting Input (0-20), Experiment History (0-20), Strategic Fit (0-20) → Total /100
- RICE: Reach (0-25), Impact (0-25), Confidence (0-25), Effort/25 where 25=trivial, 0=massive → Total /100

---

# Input Data

## Business Context (Goals & Strategy)
${inputs.business || '(not provided)'}

## User Context (ICP, Personas & Intent)
${inputs.user || '(not provided)'}

## Experience Context (Pages, Journey, Funnel & Expected Behaviour)
${inputs.experience || '(not provided)'}

## Evidence — High Strength (Quant data, qual research, user feedback)
${inputs.evidence || '(not provided)'}

## Supporting Input — Lower Strength (Heuristics, competitor analysis)
${inputs.supportingInput || '(not provided)'}

---

Now analyse all inputs and call the output_cro_analysis tool with your complete structured analysis. Be specific, concrete and commercially sharp. Prioritise the most impactful opportunities based on the evidence provided.`;
}

export async function runCROEngine(inputs: CROInputs): Promise<CROReport> {
  const startTime = Date.now();
  const now = new Date();

  const message = await createMessageWithRetry({
    model: 'claude-opus-4-7',
    max_tokens: 8000,
    tools: [ENGINE_TOOL],
    tool_choice: { type: 'tool', name: 'output_cro_analysis' },
    messages: [{ role: 'user', content: buildPrompt(inputs) }],
  });

  const toolUse = message.content.find((b) => b.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('CRO engine did not return structured output');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = toolUse.input as any;

  // Build signal index
  const signalMap = new Map<string, string>();
  const signals: Signal[] = (raw.signals ?? []).map((s: any, i: number) => {
    const scores: SignalScores = {
      evidenceStrength: Math.min(25, Math.max(0, s.scores.evidenceStrength)),
      relevance: Math.min(20, Math.max(0, s.scores.relevance)),
      specificity: Math.min(20, Math.max(0, s.scores.specificity)),
      recency: Math.min(15, Math.max(0, s.scores.recency)),
      agreement: Math.min(10, Math.max(0, s.scores.agreement)),
      businessImpact: Math.min(10, Math.max(0, s.scores.businessImpact)),
    };
    const totalScore =
      scores.evidenceStrength +
      scores.relevance +
      scores.specificity +
      scores.recency +
      scores.agreement +
      scores.businessImpact;

    const id = `sig-${i + 1}`;
    signalMap.set(s.description, id);

    return {
      id,
      description: s.description,
      source: s.source as SignalSource,
      scores,
      totalScore,
      theme: s.theme,
      strength: calcSignalStrength(totalScore),
    } satisfies Signal;
  });

  // Sort signals by score descending
  signals.sort((a, b) => b.totalScore - a.totalScore);

  const opportunities: Opportunity[] = (raw.opportunities ?? []).map((o: any, i: number) => {
    const cs = {
      evidence: Math.min(40, Math.max(0, o.confidenceScores.evidence)),
      supportingInput: Math.min(20, Math.max(0, o.confidenceScores.supportingInput)),
      experimentHistory: Math.min(20, Math.max(0, o.confidenceScores.experimentHistory)),
      strategicFit: Math.min(20, Math.max(0, o.confidenceScores.strategicFit)),
    };
    const confidenceTotal = cs.evidence + cs.supportingInput + cs.experimentHistory + cs.strategicFit;

    const relatedSignalIds = ((o.signalDescriptions ?? []) as string[]).map(
      (desc: string) => signalMap.get(desc) ?? desc
    );

    return {
      id: `opp-${i + 1}`,
      title: o.title,
      theme: o.theme,
      relatedSignalIds,
      hypothesis: o.hypothesis,
      ideas: ((o.ideas ?? []) as string[]).map((desc, j) => ({ number: j + 1, description: desc })),
      confidenceScores: cs,
      confidenceTotal,
      confidenceLevel: calcConfidenceLevel(confidenceTotal),
    } satisfies Opportunity;
  });

  // Sort by confidence total descending
  opportunities.sort((a, b) => b.confidenceTotal - a.confidenceTotal);

  const opportunityMap = new Map(opportunities.map((o) => [o.title, o.id]));

  const experiments: Experiment[] = (raw.experiments ?? []).map((e: any, i: number) => {
    const rs = {
      reach: Math.min(25, Math.max(0, e.riceScores.reach)),
      impact: Math.min(25, Math.max(0, e.riceScores.impact)),
      confidence: Math.min(25, Math.max(0, e.riceScores.confidence)),
      effort: Math.min(25, Math.max(0, e.riceScores.effort)),
    };
    const riceTotal = rs.reach + rs.impact + rs.confidence + rs.effort;

    const keyEvidence: KeyEvidence[] = ((e.keyEvidenceLabels ?? []) as string[]).map((label: string) => ({
      label,
      type: evidenceTypeToKey(label),
    }));

    return {
      id: `exp-${i + 1}`,
      opportunityId: opportunityMap.get(e.opportunityTitle) ?? `opp-${i + 1}`,
      title: e.title,
      hypothesis: e.hypothesis,
      recommendedTest: e.recommendedTest,
      primaryMetric: e.primaryMetric,
      secondaryMetrics: e.secondaryMetrics ?? [],
      riceScores: rs,
      riceTotal,
      priority: calcPriority(riceTotal),
      keyEvidence,
      confidenceRationale: e.confidenceRationale,
    } satisfies Experiment;
  });

  // Sort by RICE total descending
  experiments.sort((a, b) => b.riceTotal - a.riceTotal);

  return {
    id: `report-${now.getTime()}`,
    createdAt: now.toISOString(),
    title: `CRO Analysis — ${formatDate(now)}`,
    inputs,
    signals,
    opportunities,
    experiments,
    processingTimeMs: Date.now() - startTime,
  };
}
