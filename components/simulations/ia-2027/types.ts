export type SimulationPath = 'main' | 'slowdown' | 'race';

export type CapabilityMetric = [label: string, score: number];

export type AgentPopulation = {
  copies: number;
  speed: number;
};

export type SimulationChartExtra = {
  date: string;
  agentPopulation?: AgentPopulation;
  capabilities?: CapabilityMetric[];
  approval?: number;
  revenue?: number;
  capex?: number;
  [key: string]: unknown;
};

export type NarrativeSection = {
  id: string;
  navLabel: string;
  title: string;
  storyHtml: string;
  chartExtra: SimulationChartExtra;
};

export type Footnote = {
  id: string;
  context: SimulationPath;
  num: number;
  html: string;
};
