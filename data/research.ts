/**
 * Registro dos papers de pesquisa com corpo na própria página — a coleção `/research`.
 *
 * Manual e medido, fora do gerador UPKF (que reescreve `publications.generated.ts` a cada
 * build e sintetiza prosa num template). Cada entrada aqui é um paper REAL: o corpo vive em
 * `content/research/<slug>/index.<locale>.mdx`, transportado verbatim do manuscrito publicado,
 * e o PDF em `public/research/<slug>/` é espelho, nunca o objeto primário (modelo Distill,
 * docs/05 do projeto publicacoes-recuperacao).
 *
 * Regras que este arquivo carrega e o teste `research.test.ts` trava:
 * - `title` é o original e NÃO se traduz; só resumo e corpo se traduzem (docs/05 §14).
 * - `bodies` lista só os locales com corpo real. `hreflang` sai só para eles: anunciar cinco
 *   idiomas com um corpo é metadado que afirma o que a página não mostra (docs/07, sinal 1).
 * - `doi` só entra se resolve E é do autor (CSL-JSON, `author.family = Flores`), e diz QUAL
 *   objeto identifica: `publication` quando o depósito é o próprio texto; `replication-package`
 *   quando o depósito é o pacote de replicação que o `CITATION.cff` designa como citação do
 *   artigo (`preferred-citation`). Sem DOI, cita-se pela URL canônica. HTTP 200 não prova posse.
 * - `status` é rótulo por tipo de depósito; nenhum dos itens passou por revisão de venue, e a
 *   página não exibe selo de peer review.
 */

import { localeToHreflang, type Locale } from './i18n';
import { upkfMeta } from './generated/upkf.generated';
import { hreflangLocalePrefix } from './seo';

export const researchCanonicalPath = '/research';

export const AUTHOR = {
  name: 'Carlos Ulisses Flores',
  /** Forma indexável: uma tag `citation_author` por autor, "Sobrenome, Nome" (Google Scholar). */
  citationName: 'Flores, Carlos Ulisses',
  orcid: 'https://orcid.org/0000-0002-6034-7765',
  affiliation: 'Codex Hash Research Laboratory',
} as const;

export type PaperStatus = 'self-published' | 'technical-report';

export interface PaperPdf {
  /** Caminho servido, no MESMO subdiretório da página (`/research/<slug>/…`), exigência do Scholar. */
  path: string;
  pages: number;
  bytes: number;
}

export interface ResearchPaper {
  slug: string;
  /** Título original, no idioma do paper. Nunca se traduz. */
  title: string;
  /** Idioma do original. */
  language: Locale;
  /** Locales com corpo real em `content/research/<slug>/`. Inclui `language`. */
  bodies: readonly Locale[];
  /** Resumo verbatim do paper (pode trazer `**negrito**` e quebras de linha do original), só nos idiomas em que o paper o traz. */
  abstracts: Partial<Record<Locale, string>>;
  /** Palavras-chave do paper, por idioma em que o paper as traz. */
  keywords: Partial<Record<Locale, readonly string[]>>;
  /** ISO `YYYY-MM-DD`. */
  publishedAt: string;
  updatedAt: string;
  version: string;
  status: PaperStatus;
  /** Licença do TEXTO (a do código fica no repositório). */
  textLicense: { name: string; url: string };
  doi?: { value: string; object: 'publication' | 'replication-package' };
  repository: string;
  /** Identificadores relacionados declarados no metadado do repositório, nunca inferidos. */
  related?: readonly { relation: string; url: string; label: string }[];
  /** PDF espelho por locale; ausente = a página é o único artefato (como no Distill). */
  pdf?: Partial<Record<Locale, PaperPdf>>;
  /** Frase do próprio paper sobre a origem (ex.: trabalho de disciplina), quando ele a declara. */
  origin?: string;
  bibtex: string;
  /** Log datado de correções. Vazio no começo é o sinal invertido que compra confiança. */
  updates: readonly { date: string; note: string }[];
}

export const researchPapers: readonly ResearchPaper[] = [
  {
    slug: 'rebec-search-fidelity',
    title: "When a trial registry outsources its own search: measured defects in the public search of ReBEC",
    language: 'en',
    bodies: ['en', 'pt-br'],
    abstracts: {
      'en': "**Background.** The Brazilian Registry of Clinical Trials (ReBEC) is a World Health Organization\n(WHO) International Clinical Trials Registry Platform (ICTRP) primary registry. Systematic\nreviewers, journalists, clinicians and patients search it and act on what it returns — including on\nwhat it does *not* return. This report measures that interface and finds that it does not query the\nregistry's database.\n\n**Methods.** We measured the public search interface of ReBEC on 25 August 2026 (UTC) by five\nindependent routes: (i) the served HTML of the search endpoint; (ii) the live search performed in an ordinary\ndesktop browser; (iii) DNS and TLS of the hosts involved; (iv) the published configuration of the\nsearch widget; and (v) independent third-party captures held by the Internet Archive. Recall was\nmeasured by comparing sets of trial identifiers, never by the result estimate the interface\ndisplays. Every search used a positive control.\n\n**Results.** The public search of ReBEC does not query the registry database. It is a Google Custom\nSearch over the pages of the website, executed in the visitor's browser. The defects below are not\nthree independent faults of the registry: **(2)** and **(3)** are what that single decision\nproduces, and **(1)** is where the decision meets a separate certificate configuration.\n**(1)** The search box on the registry's own home page sends the visitor to a hostname\n(`www.ensaiosclinicos.gov.br`) that the site's TLS certificate does not cover; in current Chrome the\nsearch therefore ended, on the date measured, on a browser security interstitial; this defect was\nrepaired later the same day and the repair is recorded, dated and measured, in §5.1. **(2)** The served response does not vary\nwith the query string: six different query terms returned HTTP 200 with a single, byte-identical body\n(69,877 bytes, one SHA-256). Filtering happens only in client-side JavaScript, so every non-JavaScript\nclient — scripts, harvesters, and web archives — receives a search page that never filters. **(3)**\nFor the term `dengue`, the registry database returns 17 trials while the public search surfaces 14 of\nthem (recall 14/17), of which two omissions are attributable index failures: the trial pages exist,\ncontain the search term, and are still not returned. Internet Archive captures show the\nquery-insensitive behaviour of defect 2 already present on 23 September 2025, eleven months before\nour measurement — two measured points, not a continuous series.\n\n**Conclusions.** A WHO ICTRP primary registry can present a search interface that looks like a\ndatabase query, is in fact a third-party web index of incomplete coverage, and fails in ways that are\ninvisible to the person searching. We report this as an observable property of a public system, with\nno claim about intent, and we release the instruments so the finding expires the day it is fixed.",
      'pt-br': "**Contexto.** O Registro Brasileiro de Ensaios Clínicos (ReBEC) é um registro primário da Plataforma\nInternacional de Registros de Ensaios Clínicos (ICTRP) da Organização Mundial da Saúde. Revisores\nsistemáticos, jornalistas, profissionais de saúde e pacientes buscam nele e agem com base no que ele\ndevolve — inclusive com base no que ele **não** devolve. Este relato mede essa interface e conclui\nque ela não consulta o banco do registro.\n\n**Método.** Medimos a busca pública do ReBEC em 25 de agosto de 2026 (UTC) por cinco rotas\nindependentes:\n(i) o HTML servido pelo endpoint de busca; (ii) a busca feita ao vivo num navegador comum;\n(iii) DNS e TLS dos hosts envolvidos; (iv) a configuração publicada do buscador; e (v) capturas\nindependentes de terceiro, feitas pelo Internet Archive. O recall foi medido comparando **conjuntos\nde identificadores** de ensaios, nunca pela estimativa de resultados que a interface exibe. Toda\nbusca usou controle positivo.\n\n**Resultados.** A busca pública do ReBEC **não consulta o banco do registro**. Ela é um Google Custom\nSearch sobre as páginas do site, executado no navegador do visitante. Os defeitos abaixo não são três\nfaltas independentes do registro: **(2)** e **(3)** são o que essa decisão única produz, e **(1)** é\nonde ela encontra uma configuração de certificado à parte.\n**(1)** A caixa de busca da própria página inicial envia o visitante a um nome de host\n(`www.ensaiosclinicos.gov.br`) que o certificado TLS do site não cobre; no Chrome atual, a busca\nterminava, na data medida, num aviso de segurança do navegador; este defeito foi consertado ainda no\nmesmo dia, e o conserto está registrado, datado e medido, na §5.1. **(2)** A resposta servida não\nvaria com a consulta:\nseis termos diferentes devolveram HTTP 200 com um corpo byte a byte idêntico (69.877 bytes, um único\nSHA-256). A filtragem ocorre apenas em JavaScript no cliente — logo, todo cliente sem JavaScript\n(scripts, coletores e arquivos da web) recebe uma página de busca que nunca filtra. **(3)** Para o\ntermo `dengue`, o banco devolve 17 ensaios e a busca pública entrega 14 deles (recall 14/17); duas\ndas ausências são falhas de índice atribuíveis: a página do ensaio existe, contém o termo buscado, e\nainda assim não é devolvida. Capturas do Internet Archive mostram o comportamento do defeito 2 já\npresente em 23 de setembro de 2025, onze meses antes da nossa medição — dois pontos medidos, não\numa série contínua.\n\n**Conclusões.** Um registro primário do ICTRP pode apresentar uma busca que parece consulta a banco de\ndados, é na verdade um índice de terceiro com cobertura incompleta, e falha de maneiras invisíveis a\nquem busca. Relatamos isso como propriedade observável de um sistema público, sem nenhuma afirmação\nsobre intenção, e liberamos os instrumentos para que o achado expire no dia em que for corrigido.",
    },
    keywords: {
      'en': ["clinical trial registries", "ReBEC", "WHO ICTRP", "search interfaces", "silent failure", "research infrastructure"],
      'pt-br': ["registros de ensaios clínicos", "ReBEC", "ICTRP/OMS", "interfaces de busca", "falha silenciosa", "infraestrutura de pesquisa"],
    },
    publishedAt: '2026-09-04',
    updatedAt: '2026-09-04',
    version: '1.1.1',
    status: 'technical-report',
    // NOTICE do repositório + registro Zenodo 22311110 (cc-by-4.0)
    textLicense: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
    doi: { value: '10.5281/zenodo.22102596', object: 'publication' },
    repository: 'https://github.com/ulissesflores/rebec-search-fidelity',
    bibtex: "@techreport{flores2026rebec,\n  author      = {Flores, Carlos Ulisses},\n  title       = {When a trial registry outsources its own search: measured defects in the public search of ReBEC},\n  year        = {2026},\n  version     = {1.1.1},\n  institution = {Codex Hash Research Laboratory},\n  publisher   = {Zenodo},\n  doi         = {10.5281/zenodo.22102596},\n  url         = {https://doi.org/10.5281/zenodo.22102596}\n}",
    updates: [],
  },
  {
    slug: 'noisy-tv-measurement-channel',
    title: "The Noisy TV in the Measurement Channel: Unbudgeted Instrument Noise in the Intrinsic-Motivation Instrumentation of LLM Agents",
    language: 'en',
    bodies: ['en'],
    abstracts: {
      'en': "Curiosity-driven agents can be captured by irreducible stochasticity in their environment — the noisy-TV problem (Burda et al., 2019a). Reinforcement learning located that failure in the reward channel and fixed it there. We argue that in LLM agents the same failure can re-emerge one step earlier, in the measurement channel: the embedder, the displacement or coverage metric, and the sampling temperature that together turn generated text into a novelty number. That instrument carries a noise floor, so a motivational trigger computed on it can fire on measurement noise before any reward exists. This is a metrological statement, and we treat it with metrology’s own tools, imported rather than invented: measure the floor under a repetition null, publish it, and state the trigger threshold in units of it. We demonstrate the protocol in a clean-room harness whose corpus, code, pre-registration and results are sealed in a hash-chained provenance spine, with a post-data amendment — declared as such — that corrects the measurand to the perturbation of the retrieval score term, |Δcos(q, m)|, after an external review. Every headline number below is computed under that amendment and is exploratory rather than pre-registered; of the pre-registered break conditions, only one arm could break in practice, and it did not. In the configuration of a real deployed instance (feature hashing at d = 32), the resampling floor of the score term is 0.2507 RMS: 2.211 times one day of recency decay (nominal 95% CI, reported as the envelope of two disjoint pair partitions, [2.163; 2.260]) and 2.507 times one importance point — a floor that is analytically predictable at ‖δ‖/√d — ≈ √(2/d) here — and that no audited system had predicted or budgeted. Even a well-dimensioned semantic encoder spends 0.576 of one day of decay on pure resampling noise, and a bare novelty threshold numerically equal to one importance point of the score fires on pure resampling at a rate incompatible with zero in this vault and encoder: the two disjoint partitions give 15.3% and 8.1% (parity p = 0.028, printed rather than averaged away), the semantic encoder gives 5.7%, and the 384-dimensional hash control gives 0%. An audit of eight deployed agent-memory systems finds none that expresses its gate threshold in units of its own instrument’s floor. What this paper demonstrates is the floor and the false triggers it produces under a fixed stimulus; that a deployed agent is captured by them in closed loop is the hypothesis this measurement makes testable, not a result it shows. We ship the audit, the sealed harness, and a calibration tool that emits the floor, the floor in signal units, and the threshold in floor units for any (embedder, vault, stimulus) triple — shipped sealed, with its five-item fix queue published rather than patched silently, then executed at the dated 2026-08-13 re-seal.",
    },
    keywords: {
      'en': ["noisy TV", "intrinsic motivation", "measurement channel", "noise floor", "LLM agent", "embedder", "repetition null", "anisotropy", "calibration", "pre-registration", "metrology", "Goodhart"],
    },
    publishedAt: '2026-08-26',
    updatedAt: '2026-08-26',
    version: '1.0.0',
    status: 'self-published',
    // `.zenodo.json` notes: "paper text and figures CC BY 4.0"
    textLicense: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
    doi: { value: '10.5281/zenodo.22112679', object: 'replication-package' },
    repository: 'https://github.com/ulissesflores/noisy-tv-measurement-channel',
    pdf: {
      'en': { path: '/research/noisy-tv-measurement-channel/noisy-tv-measurement-channel.pdf', pages: 46, bytes: 719555 },
    },
    bibtex: "@article{flores2026noisytv,\n  author  = {Flores, Carlos Ulisses},\n  title   = {The Noisy TV in the Measurement Channel: Unbudgeted Instrument Noise in the Intrinsic-Motivation Instrumentation of LLM Agents},\n  year    = {2026},\n  doi     = {10.5281/zenodo.22112679},\n  url     = {https://doi.org/10.5281/zenodo.22112679},\n  note    = {Codex Hash Research Laboratory. ORCID 0000-0002-6034-7765}\n}",
    updates: [],
  },
  {
    slug: 'operating-point-dominance',
    title: "O limiar importa mais que o modelo: dominância do ponto de operação na detecção de fraude em cartões",
    language: 'pt-br',
    bodies: ['pt-br', 'en'],
    abstracts: {
      'pt-br': "Detectar fraude em cartões de crédito é um problema de classe rara — no benchmark público ULB/Worldline, apenas 0,173% das 284.807 transações são fraudulentas — e a literatura disputa há anos qual arquitetura de modelo detecta melhor. Este artigo mede uma pergunta anterior e mais prática: quanto do desempenho operacional vem da escolha da arquitetura, e quanto vem de um único escalar, o limiar de decisão (o ponto de operação) selecionado em validação sob reponderação de custo. Quatro famílias — Perceptron de Múltiplas Camadas (MLP), Regressão Logística (LR), Autoencoder e Isolation Forest — são comparadas sob protocolo auditável, sem vazamento de pré-processamento, com dados ancorados por SHA-256 e determinismo verificado por reexecução idêntica. A assimetria encontrada é de duas ordens de magnitude: deslocar o limiar do MLP do valor-padrão 0,5 para o ótimo de validação (0,9994) eleva o F1 de teste de 0,267 para 0,812, enquanto trocar a arquitetura desloca −0,007, com intervalo bootstrap pareado de 95% [−0,055; +0,042] — indistinguível de zero e menor que o desvio-padrão de treino do próprio MLP sob 20 sementes (0,016). Uma aparente vitória do MLP (ΔF1 = +0,053, intervalo excluindo zero) é demonstrada como artefato de protocolo: a grade de limiares herdada do material precedente, truncada em 0,99, fabricava a diferença. Conclui-se que a alavanca dominante de engenharia e de governança é o acoplamento entre reponderação de custo e limiar auditável, não a família do modelo — e que micro-decisões de protocolo bastam para inverter conclusões de comparações de arquitetura.",
      'en': "Credit-card fraud detection is a rare-class problem — in the public ULB/Worldline benchmark, only 0.173% of the 284,807 transactions are fraudulent — and the literature has long disputed which model architecture detects fraud best. This paper measures a prior and more practical question: how much of operational performance comes from architecture choice, and how much comes from a single scalar, the decision threshold (the operating point) selected on validation under cost reweighting. Four families — Multi-Layer Perceptron (MLP), Logistic Regression (LR), Autoencoder, and Isolation Forest — are compared under an auditable protocol, free of preprocessing leakage, with SHA-256-anchored data and determinism verified by identical re-execution. The asymmetry found spans two orders of magnitude: moving the MLP threshold from the 0.5 default to the validation optimum (0.9994) raises test F1 from 0.267 to 0.812, while switching architectures moves −0.007, with a 95% paired-bootstrap interval of [−0.055; +0.042] — indistinguishable from zero and smaller than the training standard deviation of the MLP itself under 20 seeds (0.016). An apparent MLP win (ΔF1 = +0.053, interval excluding zero) is shown to be a protocol artifact: the threshold grid inherited from the precedent material, truncated at 0.99, manufactured the difference. We conclude that the dominant engineering and governance lever is the coupling between cost reweighting and an auditable threshold, not the model family — and that protocol micro-decisions suffice to flip the conclusions of architecture comparisons.",
    },
    keywords: {
      'pt-br': ["detecção de fraude", "classe rara", "ponto de operação", "aprendizado sensível a custo", "vazamento de dados", "reprodutibilidade"],
      'en': ["fraud detection", "rare class", "operating point", "cost-sensitive learning", "data leakage", "reproducibility"],
    },
    publishedAt: '2026-08-02',
    updatedAt: '2026-08-02',
    version: '1.1.0',
    status: 'self-published',
    // §8 do paper: "Apache-2.0 para o código, CC BY 4.0 para o conteúdo"
    textLicense: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
    doi: { value: '10.5281/zenodo.21708708', object: 'replication-package' },
    repository: 'https://github.com/ulissesflores/operating-point-dominance',
    pdf: {
      'pt-br': { path: '/research/operating-point-dominance/operating-point-dominance.pdf', pages: 31, bytes: 541285 },
      'en': { path: '/research/operating-point-dominance/operating-point-dominance-en.pdf', pages: 29, bytes: 522493 },
    },
    origin: "Nota de proveniência: este artigo reanalisa material precedente não publicado do próprio autor (relatório técnico e caderno computacional de agosto de 2025; Flores, 2025).",
    bibtex: "@article{flores2026limiar,\n  author  = {Flores, Carlos Ulisses},\n  title   = {O limiar importa mais que o modelo: dominância do ponto de operação na detecção de fraude em cartões: um estudo de caso confirmatório e auditável no benchmark ULB/Worldline},\n  year    = {2026},\n  doi     = {10.5281/zenodo.21708708},\n  url     = {https://doi.org/10.5281/zenodo.21708708},\n  note    = {replication package on Zenodo}\n}",
    updates: [],
  },
  {
    slug: 'grounding-doesnt-pay',
    title: "Grounding Doesn't Pay: A Token-Matched Negative Result on Creative Diversity",
    language: 'en',
    bodies: ['en'],
    abstracts: {
      'en': "Multi-agent creative generation is widely argued to gain semantic diversity from heterogeneous agents — distinct personas, roles, or domain grounding (Wang L. et al., 2024; Ueda et al., 2025). We ask a budget-aware version of that question: does grounding a generator in a real, in-context domain specification buy more token-efficient diversity than plain repeated sampling or a cheap style-persona label, when the token budget is matched? We run a small ($0.26), pre-registered, judge-free pilot — three arms under one model, one temperature, and a fixed idea count, over two creative queries — scoring diversity as distinct domain-blind embedding clusters. Grounding is not inert: on the agglomerative view it adds real per-proposal diversity over plain repeated sampling (+0.19 to +0.26 clusters per idea), a gain that is itself algorithm-scoped (it reverses under HDBSCAN). But it is never the token-efficient frontier. A distinct-cluster count is bounded above by the fixed idea count, so a specification that costs 6.8× the input tokens for at most 1.8× the achievable clusters cannot be the per-token frontier for any outcome; grounding loses to plain repeated sampling per token under both clustering algorithms and both embedding encoders, and stays below the cheap frontier under any prompt-caching regime constructible from these tokens. The efficient frontier is a cheap arm, and the conclusion about agent heterogeneity depends on the budget accounting: grounding wins per proposal and loses per token. We scope the result to one model family (Grok-4.20, non-reasoning), two creative queries, and in-context specifications, leaving targeted retrieval open.",
    },
    keywords: {
      'en': ["token-efficient diversity", "multi-agent generation", "negative result", "pre-registration", "embedding clustering", "budget-matched accounting", "encoder robustness"],
    },
    publishedAt: '2026-07-19',
    updatedAt: '2026-07-19',
    version: '0.1.1',
    status: 'self-published',
    // `.zenodo.json` notes: "paper text and figures under CC BY 4.0"
    textLicense: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
    doi: { value: '10.5281/zenodo.21445129', object: 'replication-package' },
    repository: 'https://github.com/ulissesflores/grounding-doesnt-pay',
    pdf: {
      'en': { path: '/research/grounding-doesnt-pay/grounding-doesnt-pay.pdf', pages: 27, bytes: 502266 },
    },
    bibtex: "@article{flores2026grounding,\n  author = {Flores, Carlos Ulisses},\n  title  = {Grounding Doesn't Pay: A Token-Matched Negative Result on Creative Diversity},\n  year   = {2026},\n  doi    = {10.5281/zenodo.21445129},\n  url    = {https://doi.org/10.5281/zenodo.21445129}\n}",
    updates: [],
  },
];

export function findResearchPaper(slug: string): ResearchPaper | undefined {
  return researchPapers.find((p) => p.slug === slug);
}

export function researchPapersByDateDesc(): ResearchPaper[] {
  return [...researchPapers].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function hasBody(paper: ResearchPaper, locale: Locale): boolean {
  return paper.bodies.includes(locale);
}

/** O locale cujo corpo a página vai servir: o pedido, se existe; senão o original. */
export function bodyLocaleFor(paper: ResearchPaper, locale: Locale): Locale {
  return hasBody(paper, locale) ? locale : paper.language;
}

export function paperPath(paper: ResearchPaper): string {
  return `${researchCanonicalPath}/${paper.slug}`;
}

/** URL absoluta da página no locale dado (pt-BR sem prefixo, como o resto do site). */
export function paperUrl(paper: ResearchPaper, locale: Locale): string {
  const prefix = hreflangLocalePrefix[localeToHreflang[locale] as keyof typeof hreflangLocalePrefix];
  const base = prefix ? `${upkfMeta.primaryWebsite}/${prefix}` : upkfMeta.primaryWebsite;
  return `${base}${paperPath(paper)}`;
}

/**
 * `hreflang` só entre as versões que existem, conjunto idêntico em todas (regra do Google:
 * páginas que não apontam uma para a outra são ignoradas). `x-default` é o original.
 */
export function paperLanguageAlternates(paper: ResearchPaper): Record<string, string> {
  const out: Record<string, string> = {};
  for (const locale of paper.bodies) {
    out[localeToHreflang[locale]] = paperUrl(paper, locale);
  }
  out['x-default'] = paperUrl(paper, paper.language);
  return out;
}

/** `citation_publication_date` no formato que o Scholar documenta: `2010/5/12`, sem zero à esquerda. */
export function scholarDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${y}/${m}/${d}`;
}

/** Citação em texto, pela URL canônica; o DOI entra quando existe e é do objeto certo. */
export function formatCitation(paper: ResearchPaper): string {
  const year = paper.publishedAt.slice(0, 4);
  const where = paper.doi ? `https://doi.org/${paper.doi.value}` : paperUrl(paper, paper.language);
  const kind = paper.status === 'technical-report' ? 'Technical report' : 'Self-published';
  return `${AUTHOR.citationName} (${year}). ${paper.title} (Version ${paper.version}) [${kind}]. ${AUTHOR.affiliation}. ${where}`;
}

/** Resumo e palavras-chave no locale pedido, senão no original — o par anda junto. */
export function abstractFor(paper: ResearchPaper, locale: Locale): { locale: Locale; text: string; keywords: readonly string[] } {
  const l = paper.abstracts[locale] ? locale : paper.language;
  return { locale: l, text: paper.abstracts[l] ?? '', keywords: paper.keywords[l] ?? paper.keywords[paper.language] ?? [] };
}

/** O resumo sem marcação, para `<meta>` e JSON-LD: só o texto, um parágrafo por linha. */
export function plainAbstract(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(?<!\n)\n(?!\n)/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}
