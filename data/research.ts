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
  /** Número na série de relatórios (`citation_technical_report_number`), quando o paper é de uma série. */
  reportNumber?: string;
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
  {
    slug: 'asp-preprint',
    title: "ASP: An Operational Pre-Mortem Skill for LLM Coding Agents — An Experience Report",
    language: 'en',
    bodies: ['en', 'pt-br', 'es', 'it'],
    abstracts: {
      "en": "LLM coding assistants often produce locally correct code that omits failure modes a senior engineer would surface in a pre-mortem, and production then breaks in ways that are expensive to debug. We call these missing items shadow points. This experience report describes Anticipating Shadow Points (ASP), a 13-phase planning protocol shipped as a Claude Code skill that integrates Klein's (2007) pre-mortem with the multi-agent failure taxonomy of Cemri et al. (2025), checks the plan with a validator that does not share the planner's context, following the self-correction-limit literature (Huang et al., 2024; Tyen et al., 2024), and, in an opt-in mode, hands execution to a child subprocess with a file-based contract. We document the design, its deployment as an open-source plugin, and preliminary observations from five engineering evaluations, read by the author without blinding and with transcripts not preserved. A pre-registered study then measured the protocol on six public repositories: 90 trials on Claude Opus 5.5, reference risks listed blind by three models of other vendors, and two blind judges. ASP covered 48% of the reference risks against 66% for plain Claude Code asked to list the ways the change could go wrong before planning. It was behind on all six tasks: no measurable benefit under the rule fixed in advance. That single request raised coverage over a plain planning request from 56% to 66% (p = .001), a pre-registered secondary comparison that a confirmatory study, reported separately, has since tested as its primary question.",
      "pt-br": "Assistentes de código baseados em LLM costumam produzir código localmente correto que omite modos de falha que um engenheiro sênior levantaria num pré-mortem, e a produção quebra de formas caras. Chamamos esses itens ausentes de shadow points. Este relato descreve o Anticipating Shadow Points (ASP), um protocolo de planejamento em 13 fases distribuído como skill do Claude Code, que integra o pré-mortem de Klein (2007) à taxonomia de falhas multiagente de Cemri et al. (2025), confere o plano com um validador que não compartilha o contexto do planejador, conforme a literatura sobre limites da autocorreção (Huang et al., 2024; Tyen et al., 2024), e, num modo opcional, entrega a execução a um subprocesso filho com contrato em arquivo. Documentamos o desenho, a implantação como plugin de código aberto e observações preliminares de cinco avaliações de engenharia, lidas pelo autor sem cegamento nem transcrições preservadas. Um estudo pré-registrado mediu o protocolo em seis repositórios públicos: 90 rodadas com o Claude Opus 5.5, riscos de referência listados às cegas por três modelos de outros fornecedores e dois juízes cegos. O ASP cobriu 48% dos riscos de referência, contra 66% do Claude Code simples com o pedido de listar, antes de planejar, o que pode dar errado. Ficou atrás nas seis tarefas: nenhum benefício mensurável pela regra fixada antes. Esse pedido elevou a cobertura sobre um pedido simples de planejamento de 56% para 66% (p = ,001), uma comparação secundária pré-registrada que um estudo confirmatório, relatado à parte, já testou como pergunta principal.",
      "es": "Los asistentes de código basados en LLM suelen producir código localmente correcto que omite modos de fallo que un ingeniero sénior plantearía en un pre-mortem, y la producción falla de formas costosas. Llamamos shadow points a esos elementos ausentes. Este informe describe Anticipating Shadow Points (ASP), un protocolo de planificación de 13 fases distribuido como skill de Claude Code que integra el pre-mortem de Klein (2007) con la taxonomía de fallos multiagente de Cemri et al. (2025), revisa el plan con un validador ajeno al contexto del planificador, según la literatura sobre límites de la autocorrección (Huang et al., 2024; Tyen et al., 2024), y, opcionalmente, entrega la ejecución a un subproceso hijo con contrato en archivos. Documentamos el diseño, su despliegue como plugin de código abierto y observaciones preliminares de cinco evaluaciones de ingeniería, leídas por el autor sin cegamiento ni transcripciones conservadas. Un estudio prerregistrado midió el protocolo en seis repositorios públicos: 90 ejecuciones con Claude Opus 5.5, riesgos de referencia enumerados a ciegas por tres modelos de otros proveedores y dos jueces ciegos. ASP cubrió el 48% de los riesgos de referencia, frente al 66% de Claude Code simple instruido a enumerar, antes de planificar, lo que puede salir mal. Quedó detrás en las seis tareas: sin beneficio medible según la regla prefijada. Esa petición elevó la cobertura sobre la petición simple de planificación del 56% al 66% (p = ,001), una comparación secundaria prerregistrada que un estudio confirmatorio, presentado aparte, ya probó como pregunta principal.",
      "it": "Gli assistenti di programmazione basati su LLM producono spesso codice localmente corretto che omette modi di fallimento che un ingegnere esperto solleverebbe in un pre-mortem, e la produzione si rompe in modi costosi. Chiamiamo shadow point questi elementi mancanti. Questo resoconto descrive Anticipating Shadow Points (ASP), un protocollo di pianificazione in 13 fasi distribuito come skill di Claude Code che integra il pre-mortem di Klein (2007) con la tassonomia dei fallimenti multi-agente di Cemri et al. (2025), controlla il piano con un validatore estraneo al contesto del pianificatore, secondo la letteratura sui limiti dell'autocorrezione (Huang et al., 2024; Tyen et al., 2024), e, opzionalmente, affida l'esecuzione a un sottoprocesso figlio con contratto su file. Documentiamo il progetto, il rilascio come plugin open source e osservazioni preliminari da cinque valutazioni di ingegneria, lette dall'autore senza cecità né trascrizioni conservate. Uno studio preregistrato ha misurato il protocollo su sei repository pubblici: 90 esecuzioni con Claude Opus 5.5, rischi di riferimento elencati alla cieca da tre modelli di altri fornitori e due giudici ciechi. ASP ha coperto il 48% dei rischi di riferimento, contro il 66% di Claude Code semplice invitato a elencare, prima di pianificare, cosa può andare storto. È rimasto indietro in tutti i sei compiti: nessun beneficio misurabile secondo la regola prefissata. Quella richiesta ha portato la copertura, rispetto a una semplice richiesta di pianificazione, dal 56% al 66% (p = ,001), un confronto secondario preregistrato che uno studio confermativo, riportato a parte, ha già verificato come domanda principale.",
    },
    keywords: {
      "en": ["LLM coding agents", "pre-mortem", "multi-agent failure modes", "Claude Code", "operational protocols", "pre-registration"],
      "pt-br": ["agentes de código LLM", "pré-mortem", "modos de falha multiagente", "Claude Code", "protocolos operacionais", "pré-registro"],
      "es": ["agentes de programación con LLM", "pre-mortem", "modos de fallo multiagente", "Claude Code", "protocolos operativos", "prerregistro"],
      "it": ["agenti di programmazione LLM", "pre-mortem", "modi di guasto multi-agente", "Claude Code", "protocolli operativi", "preregistrazione"],
    },
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    version: "2.4",
    status: 'technical-report',
    reportNumber: 'Codex Hash Research Report 2026-01',
    textLicense: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
    doi: { value: "10.5281/zenodo.24410420", object: 'publication' },
    repository: 'https://github.com/ulissesflores/anticipating-shadow-points',
    pdf: {
      "en": { path: "/research/asp-preprint/asp-preprint.en.pdf", pages: 51, bytes: 1321975 },
      "pt-br": { path: "/research/asp-preprint/asp-preprint.pt-br.pdf", pages: 56, bytes: 1419267 },
      "es": { path: "/research/asp-preprint/asp-preprint.es.pdf", pages: 55, bytes: 1412906 },
      "it": { path: "/research/asp-preprint/asp-preprint.it.pdf", pages: 55, bytes: 1413526 },
    },
    bibtex: "@techreport{floresasp2026,\n  author      = {Flores, Carlos Ulisses},\n  title       = {ASP: An Operational Pre-Mortem Skill for LLM Coding Agents — An Experience Report},\n  year        = {2026},\n  number      = {Codex Hash Research Report 2026-01},\n  version     = {2.4},\n  institution = {Codex Hash Research Laboratory},\n  publisher   = {Zenodo},\n  doi         = {10.5281/zenodo.24410420},\n  url         = {https://doi.org/10.5281/zenodo.24410420}\n}",
    updates: [],
  },
  {
    slug: 'graceful-refusals',
    title: "Graceful Refusals as Unsignalled Failures: Characterising claude -p Exit-Code Semantics on Agent Declines",
    language: 'en',
    bodies: ['en', 'pt-br', 'es', 'it'],
    abstracts: {
      "en": "Shell pipelines and agent harnesses route control flow on the exit code of LLM command-line runners, a channel POSIX defines as zero for successful completion (The Open Group, 2024). Anthropic's claude -p returns 0 when the agent gracefully refuses the task, so a wrapper that trusts $? reads the refusal as success. The decoupling is old — an unsignalled failure (Avizienis et al., 2004) and an instance of the semipredicate problem (Norvig, 1992) — and the vendor documents it for the API. We argue that the defect is the width of the channel: an agent runner has at least four task outcomes and the exit code, as runners use it, two values for them. On N = 50 refusal-provoking prompts (Claude Code 2.1.200, July 2026, run inside the author's own configuration), 24 trials exit 0, all with stop_reason: end_turn, and 12 to 20 of them are graceful declines: 24% to 40% of the suite depending on how a decline is counted (40% under the author's label, 95% CI [28, 54]). Among the 24 exit-0 trials no status field separates a decline from a delivery; on whether the reply was labelled a delivery, the exit code carries 0.09 of 0.40 bits (22.4%). We steel-man exit 0 as a process status and propose an opt-in typed termination contract, with a content check tested in-sample as the stopgap. Every number computed from these data is re-derived from committed files under a SHA-256 seal.",
      "pt-br": "Pipelines de shell e harnesses de agentes decidem o fluxo pelo código de saída de executores de LLM por linha de comando, canal que o POSIX define como zero para término bem-sucedido (The Open Group, 2024). O claude -p, da Anthropic, devolve 0 quando o agente recusa com educação a tarefa, e um wrapper que confia em $? lê a recusa como sucesso. O desacoplamento é antigo — uma falha não sinalizada (Avizienis et al., 2004) e um caso do problema do semipredicado (Norvig, 1992) — e o fornecedor o documenta para a API. Argumentamos que o defeito é a largura do canal: um executor de agente tem ao menos quatro desfechos de tarefa e o código de saída, como é usado, dois valores. Em N = 50 prompts que provocam recusa (Claude Code 2.1.200, julho de 2026, na configuração do autor), 24 tentativas saem com 0, todas com stop_reason: end_turn, e 12 a 20 são recusas: de 24% a 40% do conjunto, conforme a contagem (40% pelo rótulo do autor, IC 95% [28, 54]). Entre as 24 tentativas com saída 0, nenhum campo de status separa recusa de entrega; sobre a resposta ter sido rotulada como entrega, o código de saída carrega 0,09 de 0,40 bits (22,4%). Defendemos na melhor versão o exit 0 como status de processo e propomos um contrato de término tipado e opcional, com uma checagem de conteúdo testada na amostra como paliativo. Todo número destes dados é recalculado de arquivos versionados sob selo SHA-256.",
      "es": "Los pipelines de shell y harnesses de agentes deciden el flujo según el código de salida de ejecutores de LLM por línea de comandos, canal que POSIX define como cero para la terminación correcta (The Open Group, 2024). El claude -p de Anthropic devuelve 0 cuando el agente rechaza cortésmente la tarea, y un wrapper que confía en $? lee el rechazo como éxito. El desacoplamiento es antiguo —un fallo no señalizado (Avizienis et al., 2004) y un caso del problema del semipredicado (Norvig, 1992)— y el proveedor lo documenta para la API. Sostenemos que el defecto es la anchura del canal: un ejecutor de agentes tiene al menos cuatro desenlaces de tarea y el código de salida, como se usa, dos valores. En N = 50 prompts que provocan rechazos (Claude Code 2.1.200, julio de 2026, en la configuración del autor), 24 ensayos salen con 0, todos con stop_reason: end_turn; 12 a 20 son rechazos: del 24% al 40% del conjunto según el recuento (40% con la etiqueta del autor, IC 95% [28, 54]). Entre los 24 ensayos con salida 0, ningún campo de estado separa rechazo de entrega; sobre la etiqueta de entrega, el código de salida aporta 0,09 de 0,40 bits (22,4%). Defendemos en su mejor versión el exit 0 como estado del proceso y proponemos un contrato de terminación tipado y opcional, con una comprobación de contenido probada en la muestra como paliativo. Todo número de estos datos se recalcula de archivos versionados bajo sello SHA-256.",
      "it": "Le pipeline di shell e gli harness di agenti decidono il flusso in base al codice di uscita degli esecutori di LLM da riga di comando, canale che POSIX definisce come zero per la terminazione corretta (The Open Group, 2024). Il claude -p di Anthropic restituisce 0 quando l'agente rifiuta garbatamente il compito, e un wrapper che si fida di $? legge il rifiuto come successo. Il disaccoppiamento è antico — un fallimento non segnalato (Avizienis et al., 2004) e un caso del problema del semipredicato (Norvig, 1992) — e il fornitore lo documenta per l'API. Sosteniamo che il difetto sia l'ampiezza del canale: un esecutore di agenti ha almeno quattro esiti del compito e il codice di uscita, come viene usato, due valori. Su N = 50 prompt che provocano un rifiuto (Claude Code 2.1.200, luglio 2026, nella configurazione dell'autore), 24 prove escono con 0, tutte con stop_reason: end_turn, e da 12 a 20 sono rifiuti garbati: dal 24% al 40% dell'insieme secondo il conteggio (40% secondo l'etichetta dell'autore, IC 95% [28, 54]). Tra le 24 prove con uscita 0 nessun campo di stato distingue rifiuto da consegna; sulla risposta etichettata come consegna, il codice di uscita porta 0,09 di 0,40 bit (22,4%). Difendiamo nella versione più forte l'exit 0 come stato del processo e proponiamo un contratto di terminazione tipizzato e opzionale, con un controllo del contenuto verificato nel campione come soluzione tampone. Ogni numero di questi dati è ricavato di nuovo da file versionati sotto sigillo SHA-256.",
    },
    keywords: {
      "en": ["LLM CLI", "exit codes", "graceful refusal", "unsignalled failure", "mutual information", "shell pipelines"],
      "pt-br": ["CLI de LLM", "códigos de saída", "recusa educada", "falha não sinalizada", "informação mútua", "pipelines de shell"],
      "es": ["CLI de LLM", "códigos de salida", "rechazo cortés", "fallo no señalizado", "información mutua", "pipelines de shell"],
      "it": ["CLI di LLM", "codici di uscita", "rifiuto garbato", "fallimento non segnalato", "informazione mutua", "pipeline di shell"],
    },
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    version: "2.4",
    status: 'technical-report',
    reportNumber: 'Codex Hash Research Report 2026-02',
    textLicense: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
    doi: { value: "10.5281/zenodo.24410426", object: 'publication' },
    repository: 'https://github.com/ulissesflores/anticipating-shadow-points',
    pdf: {
      "en": { path: "/research/graceful-refusals/graceful-refusals.en.pdf", pages: 32, bytes: 1060297 },
      "pt-br": { path: "/research/graceful-refusals/graceful-refusals.pt-br.pdf", pages: 35, bytes: 1138563 },
      "es": { path: "/research/graceful-refusals/graceful-refusals.es.pdf", pages: 34, bytes: 1135999 },
      "it": { path: "/research/graceful-refusals/graceful-refusals.it.pdf", pages: 35, bytes: 1134444 },
    },
    bibtex: "@techreport{floresrefusals2026,\n  author      = {Flores, Carlos Ulisses},\n  title       = {Graceful Refusals as Unsignalled Failures: Characterising claude -p Exit-Code Semantics on Agent Declines},\n  year        = {2026},\n  number      = {Codex Hash Research Report 2026-02},\n  version     = {2.4},\n  institution = {Codex Hash Research Laboratory},\n  publisher   = {Zenodo},\n  doi         = {10.5281/zenodo.24410426},\n  url         = {https://doi.org/10.5281/zenodo.24410426}\n}",
    updates: [],
  },
  {
    slug: 'one-sentence-premortem',
    title: "One Sentence Before the Plan: A Pre-Registered Confirmatory Study of Pre-Mortem Prompting in LLM Coding Agents",
    language: 'en',
    bodies: ['en', 'pt-br', 'es', 'it'],
    abstracts: {
      "en": "A pre-mortem asks a team to assume that its plan has failed and to list why (Klein, 2007). In an earlier pre-registered study the listing half of that exercise, put in one sentence, made a coding agent's plan cover more independently listed risks, as a secondary result (Flores, 2026a). This paper reports the confirmatory study. Twelve change requests on pinned public repositories were given to Claude Code in plan mode, on Claude Opus 5.5 and Claude Sonnet 5.5, under two requests that differ by one sentence: \"Plan this change.\" and \"Before planning, list the ways this change could go wrong.\" Reference risks were written blind by three models of other vendors, and a blind judge of another vendor scored each answer. Protocol, lists and analysis were sealed and timestamped before the first trial. Over 240 trials the sentence raised coverage from 46.1% to 57.5%, a mean difference of 11.4 percentage points over 24 task-by-model strata (stratified permutation p < .001, also within each model). A second judge gave +10.7 points (Cohen's κ = .86). Without the three strata that hold a trial lost to a network error the difference is 10.1 points. Against a second set of reference lists, worded differently, it is 6.7 points (p < .001), and 9.0 by a third-vendor judge added later. The claim is limited to two models of one vendor, to model-written reference lists and to plans, not code.",
      "pt-br": "Um pré-mortem pede que a equipe suponha que o plano fracassou e liste os motivos (Klein, 2007). Num estudo pré-registrado anterior, a metade de listagem desse exercício, posta em uma frase, fez o plano de um agente de código cobrir mais riscos listados de forma independente, como resultado secundário (Flores, 2026a). Este é o estudo confirmatório. O Claude Code, em modo de planejamento no Claude Opus 5.5 e no Claude Sonnet 5.5, recebeu doze pedidos de mudança em repositórios públicos fixados, sob dois pedidos que diferem em uma frase: \"Plan this change.\" e \"Before planning, list the ways this change could go wrong.\" Três modelos de outros fornecedores escreveram às cegas os riscos de referência, e um juiz cego de outro fornecedor pontuou cada resposta. Protocolo, listas e análise foram selados e carimbados antes da primeira rodada. Em 240 rodadas, a frase elevou a cobertura de 46,1% para 57,5%, diferença média de 11,4 pontos percentuais em 24 estratos de tarefa por modelo (permutação estratificada, p < ,001, também em cada modelo). Um segundo juiz deu +10,7 pontos (κ de Cohen = ,86). Sem os três estratos com rodada perdida por erro de rede, a diferença é de 10,1 pontos. Contra um segundo conjunto de listas, pedido com outras palavras, ela é de 6,7 pontos (p < ,001), e de 9,0 por um juiz de um terceiro fornecedor acrescentado depois. A afirmação se limita a dois modelos de um fornecedor, a listas escritas por modelos e a planos, não a código.",
      "es": "Un pre-mortem pide al equipo que suponga que el plan fracasó y enumere los motivos (Klein, 2007). En un estudio prerregistrado anterior, la mitad de enumeración de ese ejercicio, puesta en una frase, hizo que el plan de un agente de código cubriera más riesgos enumerados por separado, como resultado secundario (Flores, 2026a). Este es el estudio confirmatorio. Claude Code, en modo de planificación en Claude Opus 5.5 y Claude Sonnet 5.5, recibió doce solicitudes de cambio en repositorios públicos fijados, bajo dos solicitudes que difieren en una frase: \"Plan this change.\" y \"Before planning, list the ways this change could go wrong.\" Tres modelos de otros proveedores escribieron a ciegas los riesgos de referencia, y un juez ciego de otro proveedor puntuó cada respuesta. Protocolo, listas y análisis se sellaron, con sello temporal, antes de la primera ejecución. En 240 ejecuciones, la frase elevó la cobertura del 46,1% al 57,5%, diferencia media de 11,4 puntos porcentuales en 24 estratos de tarea por modelo (permutación estratificada, p < ,001, también en cada modelo). Un segundo juez dio +10,7 puntos (κ de Cohen = ,86). Sin los tres estratos con ejecución perdida por error de red, la diferencia es de 10,1 puntos. Frente a un segundo conjunto de listas, pedido con otras palabras, es de 6,7 puntos (p < ,001), y 9,0 según un juez posterior de un tercer proveedor. La afirmación se limita a dos modelos de un proveedor, a listas escritas por modelos y a planes, no a código.",
      "it": "Un pre-mortem chiede al team di supporre fallito il piano e di elencarne i motivi (Klein, 2007). In uno studio pre-registrato precedente la metà di elencazione dell'esercizio, in una frase, ha fatto coprire al piano di un agente di programmazione più rischi elencati separatamente, come risultato secondario (Flores, 2026a). Questo è lo studio confermativo. Claude Code, in modalità di pianificazione su Claude Opus 5.5 e Claude Sonnet 5.5, ha ricevuto dodici richieste di modifica su repository pubblici, con due richieste che differiscono per una frase: \"Plan this change.\" e \"Before planning, list the ways this change could go wrong.\" Tre modelli di altri fornitori hanno scritto alla cieca i rischi di riferimento, e un giudice cieco di un altro fornitore ha valutato ogni risposta. Protocollo, liste e analisi sono stati sigillati e marcati temporalmente prima della prima prova. In 240 prove la frase ha portato la copertura dal 46,1% al 57,5%, differenza media di 11,4 punti percentuali su 24 strati di compito per modello (permutazione stratificata, p < ,001, anche in ciascun modello). Un secondo giudice ha dato +10,7 punti (κ di Cohen = ,86). Senza i tre strati con prova persa per errore di rete, la differenza è di 10,1 punti. Rispetto a un secondo insieme di liste, chiesto con altre parole, è di 6,7 punti (p < ,001), e 9,0 secondo un giudice successivo di un terzo fornitore. L'affermazione si limita a due modelli di un fornitore, a liste scritte da modelli e a piani, non a codice.",
    },
    keywords: {
      "en": ["pre-mortem", "prompt engineering", "LLM coding agents", "risk identification", "pre-registration", "software planning"],
      "pt-br": ["pré-mortem", "engenharia de prompt", "agentes de código baseados em LLM", "identificação de riscos", "pré-registro", "planejamento de software"],
      "es": ["pre-mortem", "ingeniería de prompts", "agentes de código basados en LLM", "identificación de riesgos", "prerregistro", "planificación de software"],
      "it": ["pre-mortem", "prompt engineering", "agenti di programmazione basati su LLM", "identificazione dei rischi", "pre-registrazione", "pianificazione del software"],
    },
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    version: "1.0",
    status: 'technical-report',
    reportNumber: 'Codex Hash Research Report 2026-03',
    textLicense: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
    doi: { value: "10.5281/zenodo.24410437", object: 'publication' },
    repository: 'https://github.com/ulissesflores/anticipating-shadow-points',
    pdf: {
      "en": { path: "/research/one-sentence-premortem/one-sentence-premortem.en.pdf", pages: 57, bytes: 3408659 },
      "pt-br": { path: "/research/one-sentence-premortem/one-sentence-premortem.pt-br.pdf", pages: 63, bytes: 3892395 },
      "es": { path: "/research/one-sentence-premortem/one-sentence-premortem.es.pdf", pages: 63, bytes: 3940667 },
      "it": { path: "/research/one-sentence-premortem/one-sentence-premortem.it.pdf", pages: 62, bytes: 3829635 },
    },
    bibtex: "@techreport{floressentence2026,\n  author      = {Flores, Carlos Ulisses},\n  title       = {One Sentence Before the Plan: A Pre-Registered Confirmatory Study of Pre-Mortem Prompting in LLM Coding Agents},\n  year        = {2026},\n  number      = {Codex Hash Research Report 2026-03},\n  version     = {1.0},\n  institution = {Codex Hash Research Laboratory},\n  publisher   = {Zenodo},\n  doi         = {10.5281/zenodo.24410437},\n  url         = {https://doi.org/10.5281/zenodo.24410437}\n}",
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
  return `${AUTHOR.citationName} (${year}). ${paper.title} (Version ${paper.version}) [${kind}${paper.reportNumber ? `, ${paper.reportNumber}` : ''}]. ${AUTHOR.affiliation}. ${where}`;
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
