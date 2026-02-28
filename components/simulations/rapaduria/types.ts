export type CapabilityMetric = [label: string, score: number];
export type ComputeMetric = [label: string, flops: number];

export type AgentPopulation = {
  copies: number;
  speed: number;
};

export type SimulationChartExtra = {
  date: string;
  agentPopulation?: AgentPopulation;
  capabilities: CapabilityMetric[];
  approval: number;
  revenue: number;
  valuation?: number;
  aiImportance?: number;
  datacenterSpending?: number;
  agiTimelines?: number;
  rdMultiple?: [number, number, number];
  compute?: ComputeMetric[];
};

export type NarrativeSection = {
  id: string;
  navLabel: string;
  title: string;
  storyHtml: string;
  chartExtra: SimulationChartExtra;
};
