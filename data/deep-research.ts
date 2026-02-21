export interface DeepResearchArtifact {
  slug: string;
  title: string;
  abstract: string;
  polymathicIndex: number;
  qualityScore: number;
  citation: string;
  files: {
    md: string;
    pdf: string;
    docx: string;
  };
}

export const deepResearchArtifacts: Record<string, DeepResearchArtifact> = {
  '2017-chaos-theory-economics': {
    slug: '2017-chaos-theory-economics',
    title:
      'Bio-Cryptoeconomic Antifragility: A Chaos-Informed Cell-Based Architecture for Sovereign Financial Infrastructure',
    abstract:
      'This deep research article integrates chaos theory, resilience science, swarm intelligence, cryptographic protocol engineering, and AI governance into a single operational architecture for decentralized financial infrastructure.',
    polymathicIndex: 972,
    qualityScore: 968,
    citation:
      'Flores, C.U. (2026) Bio-Cryptoeconomic Antifragility: A Chaos-Informed Cell-Based Architecture for Sovereign Financial Infrastructure. Codex Hash Research Lab.',
    files: {
      md: '/deep-research/2017-chaos-theory-economics/deep-research.md',
      pdf: '/deep-research/2017-chaos-theory-economics/deep-research.pdf',
      docx: '/deep-research/2017-chaos-theory-economics/deep-research.docx',
    },
  },
};

