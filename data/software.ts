/**
 * Registro dos trabalhos técnicos (software) com DOI — a seção `/software`.
 *
 * Manual e medido, fora do gerador UPKF. Cada campo veio de uma fonte que dá para reabrir:
 * `name`, `version`, `releasedAt`, `conceptDoi` e `versionDoi` da API do Zenodo (records/<id>),
 * `description`, `language`, `license` e `pushedAt` da API do GitHub, todos colhidos em
 * 2026-09-21 pelo script `colher_software.py` do pedido de publicação. Os 15 DOIs
 * de versão e os 4 de conceito foram resolvidos com CSL-JSON e todos devolvem
 * `author.family = Flores` (evidência 10 e 12 do projeto publicacoes-recuperacao).
 *
 * Software NUNCA entra na lista de publicações (regra do docs/07 do mesmo projeto):
 * tem versão e estado de manutenção; artigo tem data e texto. Por isso este registro
 * é separado de `data/research.ts` e de `data/artigos.ts`.
 *
 * Estado de manutenção é REGRA, não opinião: `archived` se o GitHub marca o repositório
 * como arquivado; `active` se o último push tem até 183 dias na data da medição;
 * `minimal` no resto. Muda quando alguém remede, não quando alguém acha.
 */

export const softwareCanonicalPath = '/software';
/** Data em que os campos abaixo foram medidos. */
export const softwareMeasuredAt = '2026-09-21';

export type Maintenance = 'active' | 'minimal' | 'archived';

export interface SoftwareItem {
  repo: string;
  /** Título do depósito no Zenodo, no idioma original. */
  name: string;
  url: string;
  description: string;
  language: string;
  license: string;
  /** Versão mais recente depositada. */
  version: string;
  releasedAt: string;
  pushedAt: string;
  /** DOI de conceito: todas as versões; resolve para a mais recente. */
  conceptDoi: string;
  /** DOI da versão mais recente: a que rodou. */
  versionDoi: string;
  maintenance: Maintenance;
  /** Relação declarada pelo próprio repositório (`.zenodo.json`), nunca inferida pelo nome. */
  companion?: { label: string; url: string };
}

export const software: readonly SoftwareItem[] = [
  {
    repo: 'block-storage-tco',
    name: 'Block storage decides the bill: audited public-cloud price capture and a deterministic 36-month TCO model',
    url: 'https://github.com/ulissesflores/block-storage-tco',
    description: 'Audited public-cloud price capture (IBM Cloud br-sao, AWS sa-east-1, 2026-08-13) and a deterministic 36-month TCO model: block storage alone is USD 110,507 apart over the horizon.',
    language: 'HTML',
    license: 'Apache-2.0',
    version: '1.7.1',
    releasedAt: '2026-08-16',
    pushedAt: '2026-08-16',
    conceptDoi: '10.5281/zenodo.21955051',
    versionDoi: '10.5281/zenodo.21968989',
    maintenance: 'active',
  },
  {
    repo: 'llm-memory-meter',
    name: 'llm-memory-meter: measuring the real memory footprint of a local LLM from its official configuration',
    url: 'https://github.com/ulissesflores/llm-memory-meter',
    description: 'Measure the real memory footprint of a local LLM from its official config.json — the viral one-line KV-cache formula overestimates a 2026 hybrid model by up to 20x. Zero dependencies, every published number locked by tests.',
    language: 'Python',
    license: 'Apache-2.0',
    version: '1.0.0',
    releasedAt: '2026-08-15',
    pushedAt: '2026-08-15',
    conceptDoi: '10.5281/zenodo.21941274',
    versionDoi: '10.5281/zenodo.21941290',
    maintenance: 'active',
    companion: { label: 'isSupplementTo', url: 'https://ulissesflores.com/artigos/memoria-llm-local' },
  },
  {
    repo: 'claude-bootstrap',
    name: 'claude-bootstrap — opinionated Claude Code project scaffolder',
    url: 'https://github.com/ulissesflores/claude-bootstrap',
    description: 'Detection-first, profile-based scaffolder for Claude Code projects — emits a full .claude/ tree with license-audited, provenance-pinned skill bundles',
    language: 'Python',
    license: 'MIT',
    version: '1.0.0',
    releasedAt: '2026-08-11',
    pushedAt: '2026-08-11',
    conceptDoi: '10.5281/zenodo.21894809',
    versionDoi: '10.5281/zenodo.21894824',
    maintenance: 'active',
  },
  {
    repo: 'noisy-tv-instrumentation',
    name: 'noisy-tv-instrumentation: measurement-noise capture in the intrinsic-motivation instrumentation of LLM agents',
    url: 'https://github.com/ulissesflores/noisy-tv-instrumentation',
    description: 'Execution-verified companion for \'Noisy-TV em agentes LLM\': the noisy-TV problem reborn in the measurement channel of LLM-agent intrinsic motivation',
    language: 'Python',
    license: 'Apache-2.0',
    version: '1.0.0',
    releasedAt: '2026-08-03',
    pushedAt: '2026-08-26',
    conceptDoi: '10.5281/zenodo.21764607',
    versionDoi: '10.5281/zenodo.21764625',
    maintenance: 'active',
  },
  {
    repo: 'blast-radius-containment',
    name: 'Blast-Radius Containment: a reproducible Monte Carlo model of ransomware lateral propagation under Zero Trust microsegmentation',
    url: 'https://github.com/ulissesflores/blast-radius-containment',
    description: 'Reproducible Monte Carlo model of ransomware lateral propagation and its containment by Zero Trust microsegmentation and behavioral detection.',
    language: 'Python',
    license: 'Apache-2.0',
    version: '1.0.0',
    releasedAt: '2026-06-20',
    pushedAt: '2026-06-20',
    conceptDoi: '10.5281/zenodo.20769939',
    versionDoi: '10.5281/zenodo.20769940',
    maintenance: 'active',
  },
  {
    repo: 'anticipating-shadow-points',
    name: 'ASP — Anticipating Shadow Points',
    url: 'https://github.com/ulissesflores/anticipating-shadow-points',
    description: 'Claude Code skill: Ant-Shadow-Point planning protocol with claude -p /goal subprocess execution kernel. Pre-mortem + Berkeley MAST 14-mode + validator subagent + non-violation TaskCreate contract. Multilingual docs (EN/ES/PT/IT/HE), MIT.',
    language: 'Python',
    license: 'MIT',
    version: '1.0.3',
    releasedAt: '2026-05-18',
    pushedAt: '2026-05-18',
    conceptDoi: '10.5281/zenodo.20276631',
    versionDoi: '10.5281/zenodo.20277015',
    maintenance: 'active',
  },
  {
    repo: 'cellular-inference-mesh',
    name: 'Cellular Inference Mesh: Salabim DES of edge-cloud LLM inference under PACELC saturation',
    url: 'https://github.com/ulissesflores/cellular-inference-mesh',
    description: '',
    language: 'Python',
    license: 'Apache-2.0',
    version: '0.3.2',
    releasedAt: '2026-05-10',
    pushedAt: '2026-05-10',
    conceptDoi: '10.5281/zenodo.20108648',
    versionDoi: '10.5281/zenodo.20109260',
    maintenance: 'active',
  },
  {
    repo: 'mit508-techgrowth-des',
    name: 'TechGrowth DES: Stochastic Simulation of Kafka-Flink-Iceberg Pipeline with PACELC Network Partition Injection',
    url: 'https://github.com/ulissesflores/mit508-techgrowth-des',
    description: 'Discrete-event simulation of Kafka-Flink-Iceberg pipelines under PACELC and network-partition stress.',
    language: 'Python',
    license: 'Apache-2.0',
    version: '1.0.0',
    releasedAt: '2026-03-27',
    pushedAt: '2026-04-02',
    conceptDoi: '10.5281/zenodo.19244058',
    versionDoi: '10.5281/zenodo.19244059',
    maintenance: 'active',
  },
  {
    repo: 'mit507-yape-architecture-sim',
    name: 'Yape Architecture Simulation: Monolith vs. Cell-Based Resilience',
    url: 'https://github.com/ulissesflores/mit507-yape-architecture-sim',
    description: '',
    language: 'Jupyter Notebook',
    license: 'Apache-2.0',
    version: '2.0.0',
    releasedAt: '2026-02-15',
    pushedAt: '2026-02-15',
    conceptDoi: '10.5281/zenodo.18641335',
    versionDoi: '10.5281/zenodo.18645894',
    maintenance: 'minimal',
  },
  {
    repo: 'repo2llm',
    name: 'LLM Contextizer',
    url: 'https://github.com/ulissesflores/repo2llm',
    description: 'Zero-dependency Python CLI for turning codebases into token-efficient contexts for LLMs and research workflows.',
    language: 'Python',
    license: 'Apache-2.0',
    version: '0.1.1',
    releasedAt: '2026-01-22',
    pushedAt: '2026-05-11',
    conceptDoi: '10.5281/zenodo.18343437',
    versionDoi: '10.5281/zenodo.18343438',
    maintenance: 'active',
  },
  {
    repo: 'cyberfinancial-resilience-lrblstm',
    name: 'Cyber-Financial Resilience via Little\'s Law and Bayesian LSTM (LR-BLSTM)',
    url: 'https://github.com/ulissesflores/cyberfinancial-resilience-lrblstm',
    description: 'Research software for cyber-financial resilience modeling with stochastic systems, Little\\\'s Law, and LSTM forecasting.',
    language: 'Python',
    license: 'Apache-2.0',
    version: '0.1.1',
    releasedAt: '2026-01-17',
    pushedAt: '2026-04-02',
    conceptDoi: '10.5281/zenodo.18275034',
    versionDoi: '10.5281/zenodo.18275035',
    maintenance: 'active',
  },
];

export function softwareCounts() {
  return {
    total: software.length,
    withDoi: software.filter((s) => s.conceptDoi).length,
    active: software.filter((s) => s.maintenance === 'active').length,
  };
}
