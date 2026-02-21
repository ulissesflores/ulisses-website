/* AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
 * Source: /Users/ulissesflores/Documents/Projetos/ulisses-hub/data/upkf/ulisses-flores-sovereign-upkf_v3.3.md
 * Generated at: 2026-02-21
 */

export type PublicationCategory = 'research' | 'whitepapers' | 'essays';

export interface PublicationLandingContent {
  overview: string;
  problem: string;
  contributions: string[];
  applications: string;
  downloadPitch: string;
}

export interface PublicationSections {
  abstract: string;
  introduction: string;
  methods: string;
  results: string;
  discussion: string;
  conclusion: string;
  references: string[];
}

export interface PublicationEvidence {
  sourceFile: string;
  sourceName: string;
  score: number;
}

export interface Publication {
  ordinal: number;
  id: string;
  title: string;
  category: PublicationCategory;
  kind: string;
  date: string;
  publishedAt: string;
  updatedAt: string;
  inLanguage: string;
  tags: string[];
  summary: string;
  canonicalUrl: string;
  downloadUrl: string;
  pdfPath: string;
  landing: PublicationLandingContent;
  sections: PublicationSections;
  sourceEvidence: PublicationEvidence[];
  translations?: {
    en?: string;
    es?: string;
  };
}

export interface PublicationCollection {
  title: string;
  heading: string;
  description: string;
  schemaType: string;
}

export const publicationCollections: Record<PublicationCategory, PublicationCollection> = {
  "research": {
    "title": "Research",
    "heading": "Research: IA, Economia e Sistemas Complexos",
    "description": "Colecao de artigos cientificos com foco em resiliencia ciberfinanceira, modelagem quantitativa e inteligencia artificial aplicada a sistemas complexos.",
    "schemaType": "CollectionPage"
  },
  "whitepapers": {
    "title": "Whitepapers",
    "heading": "Whitepapers: Engenharia Aplicada e Arquitetura",
    "description": "Whitepapers tecnicos sobre arquitetura de sistemas, hardware IoT, seguranca, privacidade e soberania de dados em ambientes de missao critica.",
    "schemaType": "CollectionPage"
  },
  "essays": {
    "title": "Essays",
    "heading": "Essays: Teologia, Humanidades e Critica Historica",
    "description": "Ensaios academicos com abordagem historico-critica em teologia, filosofia e fundamentos da ordem social e economica.",
    "schemaType": "CollectionPage"
  }
};

export const publications: Publication[] = [
  {
    "ordinal": 1,
    "id": "2025-little-law-resilience",
    "title": "A Lei de Little como Vetor de Resiliência e Qualidade",
    "category": "research",
    "kind": "J",
    "date": "2025",
    "publishedAt": "2025-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "IA",
      "Economia",
      "Sistemas Complexos",
      "LITTLE",
      "LAW",
      "RESILIENCE"
    ],
    "summary": "Estudo sobre aplicacao da Lei de Little para elevar previsibilidade de entrega e resiliencia em operacoes de Data Science. A evidencia indica reducao relevante de lead time sem perda material de throughput, reforcando a eficiencia da limitacao de WIP. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/research/2025-little-law-resilience",
    "downloadUrl": "/research/2025-little-law-resilience.pdf",
    "pdfPath": "/research/2025-little-law-resilience.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"A Lei de Little como Vetor de Resiliência e Qualidade\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "A pesquisa enfrenta a combinacao de alto WIP, filas longas e baixa confiabilidade de prazo em pipelines complexos de IA.",
      "contributions": [
        "Formalizacao da Lei de Little como operador de governanca de fluxo e nao apenas como identidade matematica.",
        "Comparacao controlada entre politicas de WIP para mensurar impacto em lead time e estabilidade.",
        "Diretrizes praticas de implantacao para ambientes de desenvolvimento intensivos em conhecimento."
      ],
      "applications": "Aplicavel a PMOs de tecnologia, times de produto e laboratorios de IA que necessitam previsibilidade operacional auditavel.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Estudo sobre aplicacao da Lei de Little para elevar previsibilidade de entrega e resiliencia em operacoes de Data Science. Abordagem analitico-experimental com simulacao de fluxo, comparando cenarios com e sem limite explicito de trabalho em progresso. A evidencia indica reducao relevante de lead time sem perda material de throughput, reforcando a eficiencia da limitacao de WIP.",
      "introduction": "A pesquisa enfrenta a combinacao de alto WIP, filas longas e baixa confiabilidade de prazo em pipelines complexos de IA.",
      "methods": "Abordagem analitico-experimental com simulacao de fluxo, comparando cenarios com e sem limite explicito de trabalho em progresso.",
      "results": "A evidencia indica reducao relevante de lead time sem perda material de throughput, reforcando a eficiencia da limitacao de WIP.",
      "discussion": "Os achados dialogam com Lean/Kanban e com governanca orientada a fluxo, especialmente em ambientes de alta variabilidade.",
      "conclusion": "Aplicavel a PMOs de tecnologia, times de produto e laboratorios de IA que necessitam previsibilidade operacional auditavel. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #1).",
        "Referencia de dominio: W3C JSON-LD 1.1",
        "Referencia de dominio: Schema.org",
        "Referencia de dominio: NIST AI RMF",
        "Referencia de dominio: Little (1961)",
        "Referencia de dominio: Anderson (2010)",
        "Referencia de dominio: Reinertsen (2009)"
      ]
    },
    "sourceEvidence": [],
    "translations": {
      "en": "Little's Law as a Vector for Resilience and Quality",
      "es": "La Ley de Little como Vector de Resiliencia y Calidad"
    }
  },
  {
    "ordinal": 2,
    "id": "2025-lstm-asset-prediction",
    "title": "Análise Preditiva de Ativos Financeiros com Modelos LSTM",
    "category": "research",
    "kind": "J",
    "date": "2025",
    "publishedAt": "2025-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "IA",
      "Economia",
      "Sistemas Complexos",
      "LSTM",
      "ASSET",
      "PREDICTION"
    ],
    "summary": "Analise preditiva de ativos financeiros com redes LSTM para capturar dinamica temporal em mercados nao estacionarios. O estudo evidencia ganho de sinal preditivo em janelas especificas e melhora de robustez quando o treinamento respeita ordem temporal. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/research/2025-lstm-asset-prediction",
    "downloadUrl": "/research/2025-lstm-asset-prediction.pdf",
    "pdfPath": "/research/2025-lstm-asset-prediction.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"Análise Preditiva de Ativos Financeiros com Modelos LSTM\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "Modelos lineares sofrem com mudancas de regime e baixa robustez frente a volatilidade extrema e ruido de alta frequencia.",
      "contributions": [
        "Protocolo de avaliacao temporal para evitar leakage em previsao de ativos.",
        "Integração entre previsao recorrente e indicadores de risco operacional.",
        "Framework de monitoramento para degradacao de performance em producao."
      ],
      "applications": "Uso em apoio a tomada de decisao em mesas quantitativas, com politicas de risco e trilhas de auditoria para compliance.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Analise preditiva de ativos financeiros com redes LSTM para capturar dinamica temporal em mercados nao estacionarios. Modelagem de series temporais com engenharia de atributos, validacao temporal e comparacao contra baselines estatisticos. O estudo evidencia ganho de sinal preditivo em janelas especificas e melhora de robustez quando o treinamento respeita ordem temporal.",
      "introduction": "Modelos lineares sofrem com mudancas de regime e baixa robustez frente a volatilidade extrema e ruido de alta frequencia.",
      "methods": "Modelagem de series temporais com engenharia de atributos, validacao temporal e comparacao contra baselines estatisticos.",
      "results": "O estudo evidencia ganho de sinal preditivo em janelas especificas e melhora de robustez quando o treinamento respeita ordem temporal.",
      "discussion": "A principal limitacao esta em drift de mercado; por isso o artigo enfatiza re-treinamento, monitoramento e controle de risco.",
      "conclusion": "Uso em apoio a tomada de decisao em mesas quantitativas, com politicas de risco e trilhas de auditoria para compliance. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #2).",
        "Referencia de dominio: W3C JSON-LD 1.1",
        "Referencia de dominio: Schema.org",
        "Referencia de dominio: NIST AI RMF",
        "Referencia de dominio: Hochreiter & Schmidhuber (1997)",
        "Referencia de dominio: NIST AI RMF (2023)",
        "Referencia de dominio: Goodfellow et al."
      ]
    },
    "sourceEvidence": [],
    "translations": {
      "en": "Predictive Analysis of Financial Assets Using LSTM Models",
      "es": "Análisis Predictivo de Activos Financieros con Modelos LSTM"
    }
  },
  {
    "ordinal": 3,
    "id": "2025-hybrid-cooling-thermodynamics",
    "title": "Análise Termodinâmica e Engenharia de Sistemas Híbridos de Resfriamento",
    "category": "whitepapers",
    "kind": "R",
    "date": "2025",
    "publishedAt": "2025-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "Engenharia",
      "IoT",
      "Seguranca",
      "HYBRID",
      "COOLING",
      "THERMODYNAMICS"
    ],
    "summary": "Whitepaper de termodinamica aplicada ao projeto de sistemas hibridos de resfriamento para infraestrutura critica. A configuracao hibrida apresenta melhor estabilidade termica em picos de carga e menor risco de indisponibilidade. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/whitepapers/2025-hybrid-cooling-thermodynamics",
    "downloadUrl": "/whitepapers/2025-hybrid-cooling-thermodynamics.pdf",
    "pdfPath": "/whitepapers/2025-hybrid-cooling-thermodynamics.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"Análise Termodinâmica e Engenharia de Sistemas Híbridos de Resfriamento\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "Centros computacionais e ambientes edge enfrentam trade-off entre eficiencia energetica, confiabilidade e custo de manutencao.",
      "contributions": [
        "Modelo comparativo entre topologias de resfriamento em regime variavel.",
        "Criticos de dimensionamento para reduzir risco termico sistêmico.",
        "Matriz de decisao para engenharia de infraestrutura de missao critica."
      ],
      "applications": "Relevante para datacenters, edge nodes industriais e laboratorios com requisitos de disponibilidade continua.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Whitepaper de termodinamica aplicada ao projeto de sistemas hibridos de resfriamento para infraestrutura critica. Analise termo-fluidodinamica com cenarios de carga, comparando estrategias hibridas de dissipacao e controle. A configuracao hibrida apresenta melhor estabilidade termica em picos de carga e menor risco de indisponibilidade.",
      "introduction": "Centros computacionais e ambientes edge enfrentam trade-off entre eficiencia energetica, confiabilidade e custo de manutencao.",
      "methods": "Analise termo-fluidodinamica com cenarios de carga, comparando estrategias hibridas de dissipacao e controle.",
      "results": "A configuracao hibrida apresenta melhor estabilidade termica em picos de carga e menor risco de indisponibilidade.",
      "discussion": "A decisao arquitetural depende de clima, perfil de carga e estrategia de redundancia do ativo fisico.",
      "conclusion": "Relevante para datacenters, edge nodes industriais e laboratorios com requisitos de disponibilidade continua. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #3).",
        "Referencia de dominio: NIST",
        "Referencia de dominio: ISO/IEC standards",
        "Referencia de dominio: Architecture reference literature",
        "Referencia de dominio: ASHRAE Thermal Guidelines",
        "Referencia de dominio: ISO 50001",
        "Referencia de dominio: NIST Datacenter Guidance"
      ]
    },
    "sourceEvidence": [],
    "translations": {
      "en": "Thermodynamic Analysis and Engineering of Hybrid Cooling Systems",
      "es": "Análisis Termodinámico e Ingeniería de Sistemas Híbridos de Enfriamiento"
    }
  },
  {
    "ordinal": 4,
    "id": "2025-iot-data-sovereignty",
    "title": "Arquiteturas Cloudless e Soberania de Dados em IoT",
    "category": "whitepapers",
    "kind": "R",
    "date": "2025",
    "publishedAt": "2025-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "Engenharia",
      "IoT",
      "Seguranca",
      "IOT",
      "DATA",
      "SOVEREIGNTY"
    ],
    "summary": "Arquiteturas cloudless para IoT com soberania de dados e processamento local em edge. O desenho cloudless reduz dependencia externa e melhora controle sobre confidencialidade e disponibilidade local. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/whitepapers/2025-iot-data-sovereignty",
    "downloadUrl": "/whitepapers/2025-iot-data-sovereignty.pdf",
    "pdfPath": "/whitepapers/2025-iot-data-sovereignty.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"Arquiteturas Cloudless e Soberania de Dados em IoT\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "Dependencia de nuvem publica amplia superficie de ataque, latencia e exposicao regulatoria de dados sensiveis.",
      "contributions": [
        "Blueprint de referencia para IoT com soberania de dados por design.",
        "Politicas de seguranca e identidade para operacao zero trust em edge.",
        "Padroes de integracao para reduzir lock-in de provedores."
      ],
      "applications": "Aplicavel a agricultura conectada, automacao industrial e ambientes com restricoes de conectividade.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Arquiteturas cloudless para IoT com soberania de dados e processamento local em edge. Comparacao de arquiteturas centralizadas versus edge-first, incluindo requisitos de identidade, criptografia e observabilidade. O desenho cloudless reduz dependencia externa e melhora controle sobre confidencialidade e disponibilidade local.",
      "introduction": "Dependencia de nuvem publica amplia superficie de ataque, latencia e exposicao regulatoria de dados sensiveis.",
      "methods": "Comparacao de arquiteturas centralizadas versus edge-first, incluindo requisitos de identidade, criptografia e observabilidade.",
      "results": "O desenho cloudless reduz dependencia externa e melhora controle sobre confidencialidade e disponibilidade local.",
      "discussion": "O principal trade-off envolve operacao distribuida e necessidade de automacao robusta de ciclo de vida.",
      "conclusion": "Aplicavel a agricultura conectada, automacao industrial e ambientes com restricoes de conectividade. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #4).",
        "Referencia de dominio: NIST",
        "Referencia de dominio: ISO/IEC standards",
        "Referencia de dominio: Architecture reference literature",
        "Referencia de dominio: NIST Zero Trust",
        "Referencia de dominio: IEC 62443",
        "Referencia de dominio: OWASP IoT Top 10"
      ]
    },
    "sourceEvidence": [],
    "translations": {
      "en": "Cloudless Architectures and Data Sovereignty in IoT",
      "es": "Arquitecturas Cloudless y Soberanía de Datos en IoT"
    }
  },
  {
    "ordinal": 6,
    "id": "2025-fraud-detection-mlp",
    "title": "Detecção de Fraudes em Cartões com Redes Neurais",
    "category": "research",
    "kind": "J",
    "date": "2025",
    "publishedAt": "2025-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "IA",
      "Economia",
      "Sistemas Complexos",
      "FRAUD",
      "DETECTION",
      "MLP"
    ],
    "summary": "Deteccao de fraude em cartoes com redes neurais MLP e engenharia de atributos para dados desbalanceados. A combinacao de MLP com ajuste de limiar melhora captura de fraudes mantendo taxa operacional aceitavel de falsos positivos. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/research/2025-fraud-detection-mlp",
    "downloadUrl": "/research/2025-fraud-detection-mlp.pdf",
    "pdfPath": "/research/2025-fraud-detection-mlp.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"Detecção de Fraudes em Cartões com Redes Neurais\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "Fraude financeira combina alta assimetria de classes com necessidade de baixa latencia decisoria em tempo quase real.",
      "contributions": [
        "Estrutura de avaliacao orientada a risco economico de fraude.",
        "Integração de calibracao de probabilidade com politicas operacionais.",
        "Boas praticas para monitorar drift em cenarios de pagamento digital."
      ],
      "applications": "Suporte a motores antifraude em emissores, adquirentes e fintechs com trilha explicavel para auditoria.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Deteccao de fraude em cartoes com redes neurais MLP e engenharia de atributos para dados desbalanceados. Pipeline supervisionado com reamostragem, calibracao de limiar e avaliacao por precision-recall e custo de erro. A combinacao de MLP com ajuste de limiar melhora captura de fraudes mantendo taxa operacional aceitavel de falsos positivos.",
      "introduction": "Fraude financeira combina alta assimetria de classes com necessidade de baixa latencia decisoria em tempo quase real.",
      "methods": "Pipeline supervisionado com reamostragem, calibracao de limiar e avaliacao por precision-recall e custo de erro.",
      "results": "A combinacao de MLP com ajuste de limiar melhora captura de fraudes mantendo taxa operacional aceitavel de falsos positivos.",
      "discussion": "O desempenho depende de atualizacao continua e governanca de drift comportamental.",
      "conclusion": "Suporte a motores antifraude em emissores, adquirentes e fintechs com trilha explicavel para auditoria. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #6).",
        "Referencia de dominio: W3C JSON-LD 1.1",
        "Referencia de dominio: Schema.org",
        "Referencia de dominio: NIST AI RMF",
        "Referencia de dominio: Dal Pozzolo et al.",
        "Referencia de dominio: NIST AI RMF (2023)",
        "Referencia de dominio: ISO 27001"
      ]
    },
    "sourceEvidence": [],
    "translations": {
      "en": "Credit Card Fraud Detection Using Neural Networks",
      "es": "Detección de Fraudes en Tarjetas con Redes Neuronales"
    }
  },
  {
    "ordinal": 12,
    "id": "2024-historicity-jesus-archaeology",
    "title": "Análise Historiográfica e Arqueológica Exaustiva: A Historicidade de Jesus",
    "category": "research",
    "kind": "J",
    "date": "2024",
    "publishedAt": "2024-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "IA",
      "Economia",
      "Sistemas Complexos",
      "HISTORICITY",
      "JESUS",
      "ARCHAEOLOGY"
    ],
    "summary": "Pesquisa historiografica sobre historicidade de Jesus combinando critica textual, fontes antigas e evidencias arqueologicas. O estudo delimita consenso academico minimo e identifica zonas de alta e baixa confianca documental. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/research/2024-historicity-jesus-archaeology",
    "downloadUrl": "/research/2024-historicity-jesus-archaeology.pdf",
    "pdfPath": "/research/2024-historicity-jesus-archaeology.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"Análise Historiográfica e Arqueológica Exaustiva: A Historicidade de Jesus\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "Debates publicos misturam categorias teologicas e historicas sem separacao metodologica rigorosa.",
      "contributions": [
        "Matriz de confiabilidade para comparar fontes textuais e arqueologicas.",
        "Distincao explicita entre plano historico e plano doutrinario.",
        "Sintese de consenso e controvérsias na literatura especializada."
      ],
      "applications": "Relevante para pesquisa teologica, ensino de historia antiga e dialogo interdisciplinar entre fe e academia.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Pesquisa historiografica sobre historicidade de Jesus combinando critica textual, fontes antigas e evidencias arqueologicas. Revisao historico-critica de fontes primarias e secundarias com avaliacao de contexto, autoria e data. O estudo delimita consenso academico minimo e identifica zonas de alta e baixa confianca documental.",
      "introduction": "Debates publicos misturam categorias teologicas e historicas sem separacao metodologica rigorosa.",
      "methods": "Revisao historico-critica de fontes primarias e secundarias com avaliacao de contexto, autoria e data.",
      "results": "O estudo delimita consenso academico minimo e identifica zonas de alta e baixa confianca documental.",
      "discussion": "A contribuicao central esta na disciplina metodologica e no tratamento de vieses interpretativos.",
      "conclusion": "Relevante para pesquisa teologica, ensino de historia antiga e dialogo interdisciplinar entre fe e academia. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #12).",
        "Referencia de dominio: W3C JSON-LD 1.1",
        "Referencia de dominio: Schema.org",
        "Referencia de dominio: NIST AI RMF",
        "Referencia de dominio: Ehrman",
        "Referencia de dominio: Sanders",
        "Referencia de dominio: Vermes"
      ]
    },
    "sourceEvidence": [],
    "translations": {
      "en": "Comprehensive Historiographic and Archaeological Analysis: The Historicity of Jesus",
      "es": "Análisis Historiográfico y Arqueológico Exhaustivo: La Historicidad de Jesús"
    }
  },
  {
    "ordinal": 14,
    "id": "2024-bitcoin-praxeology",
    "title": "Bitcoin como Ativo de Reserva e a Teoria da Moeda na Escola Austríaca",
    "category": "research",
    "kind": "J",
    "date": "2024",
    "publishedAt": "2024-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "IA",
      "Economia",
      "Sistemas Complexos",
      "BITCOIN",
      "PRAXEOLOGY"
    ],
    "summary": "Analise do Bitcoin como ativo de reserva sob praxeologia e teoria monetaria da Escola Austriaca. O artigo sustenta que Bitcoin combina previsibilidade de emissao e portabilidade digital com implicacoes macroeconomicas relevantes. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/research/2024-bitcoin-praxeology",
    "downloadUrl": "/research/2024-bitcoin-praxeology.pdf",
    "pdfPath": "/research/2024-bitcoin-praxeology.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"Bitcoin como Ativo de Reserva e a Teoria da Moeda na Escola Austríaca\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "Avaliacoes estritamente tecnicas ignoram fundamentos economicos de escassez, preferencia temporal e coordenacao social.",
      "contributions": [
        "Integração entre teoria praxeologica e arquitetura monetaria digital.",
        "Critérios objetivos para avaliar funcao de reserva de valor.",
        "Enquadramento de riscos regulatórios e de mercado."
      ],
      "applications": "Base analitica para teses de tesouraria digital, hedge monetario e desenho de politicas de alocacao.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Analise do Bitcoin como ativo de reserva sob praxeologia e teoria monetaria da Escola Austriaca. Discussao teoretica com comparacao entre propriedades monetarias e mecanismos de governanca de oferta. O artigo sustenta que Bitcoin combina previsibilidade de emissao e portabilidade digital com implicacoes macroeconomicas relevantes.",
      "introduction": "Avaliacoes estritamente tecnicas ignoram fundamentos economicos de escassez, preferencia temporal e coordenacao social.",
      "methods": "Discussao teoretica com comparacao entre propriedades monetarias e mecanismos de governanca de oferta.",
      "results": "O artigo sustenta que Bitcoin combina previsibilidade de emissao e portabilidade digital com implicacoes macroeconomicas relevantes.",
      "discussion": "As limitacoes concentram-se em volatilidade de curto prazo e regimes regulatórios heterogeneos.",
      "conclusion": "Base analitica para teses de tesouraria digital, hedge monetario e desenho de politicas de alocacao. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #14).",
        "Referencia de dominio: W3C JSON-LD 1.1",
        "Referencia de dominio: Schema.org",
        "Referencia de dominio: NIST AI RMF",
        "Referencia de dominio: Mises",
        "Referencia de dominio: Hayek",
        "Referencia de dominio: Nakamoto (2008)"
      ]
    },
    "sourceEvidence": [],
    "translations": {
      "en": "Bitcoin as a Reserve Asset and Monetary Theory in the Austrian School",
      "es": "Bitcoin como Activo de Reserva y la Teoría Monetaria de la Escuela Austríaca"
    }
  },
  {
    "ordinal": 15,
    "id": "2024-scribal-canonization-ezra",
    "title": "Canonização Escribal: Análise Histórico-Crítica da Formação do Cânon",
    "category": "research",
    "kind": "J",
    "date": "2024",
    "publishedAt": "2024-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "IA",
      "Economia",
      "Sistemas Complexos",
      "SCRIBAL",
      "CANONIZATION",
      "EZRA"
    ],
    "summary": "Estudo historico-critico sobre canonizacao escribal e processos de consolidacao textual associados a Esdras. A pesquisa destaca dinamica incremental de consolidacao canonica com mediação institucional e escribal. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/research/2024-scribal-canonization-ezra",
    "downloadUrl": "/research/2024-scribal-canonization-ezra.pdf",
    "pdfPath": "/research/2024-scribal-canonization-ezra.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"Canonização Escribal: Análise Histórico-Crítica da Formação do Cânon\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "Narrativas simplificadas sobre formacao canonica tendem a apagar camadas editoriais e disputas de autoridade.",
      "contributions": [
        "Reconstrucao processual da canonizacao em vez de modelo instantaneo.",
        "Integração de evidencias filologicas e historicas.",
        "Discussao epistemologica sobre autoridade textual."
      ],
      "applications": "Contribui para curriculos de exegese, historia biblica e hermeneutica historico-critica.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Estudo historico-critico sobre canonizacao escribal e processos de consolidacao textual associados a Esdras. Analise de tradicoes textuais, historia da transmissao e contexto sociopolitico do periodo pos-exilico. A pesquisa destaca dinamica incremental de consolidacao canonica com mediação institucional e escribal.",
      "introduction": "Narrativas simplificadas sobre formacao canonica tendem a apagar camadas editoriais e disputas de autoridade.",
      "methods": "Analise de tradicoes textuais, historia da transmissao e contexto sociopolitico do periodo pos-exilico.",
      "results": "A pesquisa destaca dinamica incremental de consolidacao canonica com mediação institucional e escribal.",
      "discussion": "A leitura critica reforca importancia de filologia, historia social e comparacao de tradicoes manuscritas.",
      "conclusion": "Contribui para curriculos de exegese, historia biblica e hermeneutica historico-critica. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #15).",
        "Referencia de dominio: W3C JSON-LD 1.1",
        "Referencia de dominio: Schema.org",
        "Referencia de dominio: NIST AI RMF",
        "Referencia de dominio: Brevard Childs",
        "Referencia de dominio: James Kugel",
        "Referencia de dominio: Shaye Cohen"
      ]
    },
    "sourceEvidence": [],
    "translations": {
      "en": "Scribal Canonization: A Historical-Critical Analysis of Canon Formation",
      "es": "Canonización Escribal: Análisis Histórico-Crítico de la Formación del Canon"
    }
  },
  {
    "ordinal": 17,
    "id": "2024-theology-economic-order",
    "title": "Fundamentos Transcendentes da Ordem Econômica",
    "category": "essays",
    "kind": "J",
    "date": "2024",
    "publishedAt": "2024-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "Teologia",
      "Humanidades",
      "Historia",
      "THEOLOGY",
      "ECONOMIC",
      "ORDER"
    ],
    "summary": "Ensaio sobre fundamentos transcendentes da ordem economica e sua relacao com normatividade moral. O texto demonstra que categorias de responsabilidade e dignidade influenciam desenho institucional e incentivos. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/essays/2024-theology-economic-order",
    "downloadUrl": "/essays/2024-theology-economic-order.pdf",
    "pdfPath": "/essays/2024-theology-economic-order.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"Fundamentos Transcendentes da Ordem Econômica\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "Modelos puramente tecnocráticos tendem a negligenciar pressupostos antropologicos e eticos da cooperacao social.",
      "contributions": [
        "Framework para conectar etica teologica e ordem economica.",
        "Critica a reducionismos materialistas na analise institucional.",
        "Proposta de leitura integrada entre liberdade, responsabilidade e justica."
      ],
      "applications": "Util para formulacao de politicas publicas, governanca corporativa e educacao civica.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Ensaio sobre fundamentos transcendentes da ordem economica e sua relacao com normatividade moral. Analise conceitual interdisciplinar entre teologia, filosofia moral e teoria economica. O texto demonstra que categorias de responsabilidade e dignidade influenciam desenho institucional e incentivos.",
      "introduction": "Modelos puramente tecnocráticos tendem a negligenciar pressupostos antropologicos e eticos da cooperacao social.",
      "methods": "Analise conceitual interdisciplinar entre teologia, filosofia moral e teoria economica.",
      "results": "O texto demonstra que categorias de responsabilidade e dignidade influenciam desenho institucional e incentivos.",
      "discussion": "A proposta nao substitui analise econometrica, mas oferece base axiologica para interpretacao de resultados.",
      "conclusion": "Util para formulacao de politicas publicas, governanca corporativa e educacao civica. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #17).",
        "Referencia de dominio: Hermeneutics literature",
        "Referencia de dominio: Historical-critical methodology",
        "Referencia de dominio: Interdisciplinary studies",
        "Referencia de dominio: Augustine",
        "Referencia de dominio: Aquinas",
        "Referencia de dominio: Röpke"
      ]
    },
    "sourceEvidence": []
  },
  {
    "ordinal": 18,
    "id": "2024-ring-signatures-privacy",
    "title": "Implementação de Ring Signatures e Endereços Furtivos",
    "category": "whitepapers",
    "kind": "R",
    "date": "2024",
    "publishedAt": "2024-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "Engenharia",
      "IoT",
      "Seguranca",
      "RING",
      "SIGNATURES",
      "PRIVACY"
    ],
    "summary": "Whitepaper sobre ring signatures e enderecos furtivos para privacidade transacional em sistemas distribuidos. A combinacao de assinaturas em anel e stealth addresses melhora privacidade sem eliminar verificabilidade criptografica. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/whitepapers/2024-ring-signatures-privacy",
    "downloadUrl": "/whitepapers/2024-ring-signatures-privacy.pdf",
    "pdfPath": "/whitepapers/2024-ring-signatures-privacy.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"Implementação de Ring Signatures e Endereços Furtivos\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "Transparencia absoluta em blockchains publicas pode expor metadados sensiveis e comprometer fungibilidade.",
      "contributions": [
        "Comparativo tecnico entre abordagens de anonimato em ledger publico.",
        "Diretrizes para integracao segura em stacks de producao.",
        "Mapa de riscos de implementacao e manutencao criptografica."
      ],
      "applications": "Uso em wallets, protocolos de pagamentos privados e infra de custodia com requisitos de compliance.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Whitepaper sobre ring signatures e enderecos furtivos para privacidade transacional em sistemas distribuidos. Revisao de primitives criptograficas com analise de seguranca, custos computacionais e requisitos de implementacao. A combinacao de assinaturas em anel e stealth addresses melhora privacidade sem eliminar verificabilidade criptografica.",
      "introduction": "Transparencia absoluta em blockchains publicas pode expor metadados sensiveis e comprometer fungibilidade.",
      "methods": "Revisao de primitives criptograficas com analise de seguranca, custos computacionais e requisitos de implementacao.",
      "results": "A combinacao de assinaturas em anel e stealth addresses melhora privacidade sem eliminar verificabilidade criptografica.",
      "discussion": "Trade-offs principais envolvem tamanho de assinatura, custo de verificacao e complexidade operacional.",
      "conclusion": "Uso em wallets, protocolos de pagamentos privados e infra de custodia com requisitos de compliance. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #18).",
        "Referencia de dominio: NIST",
        "Referencia de dominio: ISO/IEC standards",
        "Referencia de dominio: Architecture reference literature",
        "Referencia de dominio: Rivest et al. ring signatures",
        "Referencia de dominio: Monero Research",
        "Referencia de dominio: NIST cryptography guidance"
      ]
    },
    "sourceEvidence": [],
    "translations": {
      "en": "Implementation of Ring Signatures and Stealth Addresses",
      "es": "Implementación de Ring Signatures y Direcciones Furtivas"
    }
  },
  {
    "ordinal": 23,
    "id": "2024-agritech-agile-flow",
    "title": "Transformação Ágil e Engenharia de Fluxo em Data Science",
    "category": "whitepapers",
    "kind": "R",
    "date": "2024",
    "publishedAt": "2024-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "Engenharia",
      "IoT",
      "Seguranca",
      "AGRITECH",
      "AGILE",
      "FLOW"
    ],
    "summary": "Whitepaper sobre transformacao agil e engenharia de fluxo em contextos agritech orientados a dados. A governanca por fluxo eleva previsibilidade de entrega e reduz retrabalho em times multidisciplinares. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/whitepapers/2024-agritech-agile-flow",
    "downloadUrl": "/whitepapers/2024-agritech-agile-flow.pdf",
    "pdfPath": "/whitepapers/2024-agritech-agile-flow.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"Transformação Ágil e Engenharia de Fluxo em Data Science\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "Projetos agritechs sofrem com sazonalidade, variabilidade operacional e baixa sincronizacao entre produto e campo.",
      "contributions": [
        "Adaptação de principios lean-flow para dominio agritech.",
        "Modelo de indicadores para operacao sazonal e distribuida.",
        "Plano de implementacao incremental com governanca executiva."
      ],
      "applications": "Aplicavel a plataformas de agricultura de precisao, IoT rural e analytics operacional.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Whitepaper sobre transformacao agil e engenharia de fluxo em contextos agritech orientados a dados. Aplicacao de metricas de fluxo, mapeamento de cadeia de valor e ciclos de melhoria orientados por evidencia. A governanca por fluxo eleva previsibilidade de entrega e reduz retrabalho em times multidisciplinares.",
      "introduction": "Projetos agritechs sofrem com sazonalidade, variabilidade operacional e baixa sincronizacao entre produto e campo.",
      "methods": "Aplicacao de metricas de fluxo, mapeamento de cadeia de valor e ciclos de melhoria orientados por evidencia.",
      "results": "A governanca por fluxo eleva previsibilidade de entrega e reduz retrabalho em times multidisciplinares.",
      "discussion": "A escalabilidade depende de disciplina de medicao e alinhamento entre metas tecnicas e metas de negocio.",
      "conclusion": "Aplicavel a plataformas de agricultura de precisao, IoT rural e analytics operacional. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #23).",
        "Referencia de dominio: NIST",
        "Referencia de dominio: ISO/IEC standards",
        "Referencia de dominio: Architecture reference literature",
        "Referencia de dominio: Reinertsen",
        "Referencia de dominio: Forsgren et al. DORA",
        "Referencia de dominio: Lean Product Development"
      ]
    },
    "sourceEvidence": [],
    "translations": {
      "en": "Agile Transformation and Flow Engineering in Data Science",
      "es": "Transformación Ágil e Ingeniería de Flujo en Data Science"
    }
  },
  {
    "ordinal": 24,
    "id": "2024-exegetical-treatise-anthropology",
    "title": "Tratado Exegético sobre a Representação da Moralidade e Antropologia",
    "category": "essays",
    "kind": "J",
    "date": "2024",
    "publishedAt": "2024-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "Teologia",
      "Humanidades",
      "Historia",
      "EXEGETICAL",
      "TREATISE",
      "ANTHROPOLOGY"
    ],
    "summary": "Tratado exegético sobre representacao da moralidade e antropologia em tradicoes textuais teologicas. O artigo organiza categorias antropologicas recorrentes e explicita implicacoes eticas contemporaneas. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/essays/2024-exegetical-treatise-anthropology",
    "downloadUrl": "/essays/2024-exegetical-treatise-anthropology.pdf",
    "pdfPath": "/essays/2024-exegetical-treatise-anthropology.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"Tratado Exegético sobre a Representação da Moralidade e Antropologia\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "Interpretacoes atomizadas de passagens isoladas fragilizam coerencia antropologica e moral do corpus.",
      "contributions": [
        "Sistematizacao de categorias morais e antropologicas no texto base.",
        "Procedimento de leitura que reduz anacronismos interpretativos.",
        "Conexao entre interpretacao textual e dilemas eticos atuais."
      ],
      "applications": "Recurso para ensino teologico, pesquisa hermeneutica e formacao de lideranca comunitaria.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Tratado exegético sobre representacao da moralidade e antropologia em tradicoes textuais teologicas. Leitura exegética com cruzamento de contexto historico, semantica e tradicao interpretativa. O artigo organiza categorias antropologicas recorrentes e explicita implicacoes eticas contemporaneas.",
      "introduction": "Interpretacoes atomizadas de passagens isoladas fragilizam coerencia antropologica e moral do corpus.",
      "methods": "Leitura exegética com cruzamento de contexto historico, semantica e tradicao interpretativa.",
      "results": "O artigo organiza categorias antropologicas recorrentes e explicita implicacoes eticas contemporaneas.",
      "discussion": "A principal contribuicao esta na articulacao entre exegese rigorosa e filosofia moral aplicada.",
      "conclusion": "Recurso para ensino teologico, pesquisa hermeneutica e formacao de lideranca comunitaria. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #24).",
        "Referencia de dominio: Hermeneutics literature",
        "Referencia de dominio: Historical-critical methodology",
        "Referencia de dominio: Interdisciplinary studies",
        "Referencia de dominio: Ricoeur",
        "Referencia de dominio: Brueggemann",
        "Referencia de dominio: N.T. Wright"
      ]
    },
    "sourceEvidence": []
  },
  {
    "ordinal": 25,
    "id": "2023-marian-apparitions-critique",
    "title": "A Coroa e a Cruz: Análise Teológica e Fenomenológica das Aparições Marianas",
    "category": "research",
    "kind": "J",
    "date": "2023",
    "publishedAt": "2023-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "IA",
      "Economia",
      "Sistemas Complexos",
      "MARIAN",
      "APPARITIONS",
      "CRITIQUE"
    ],
    "summary": "Analise teologica e fenomenologica critica de narrativas de aparicoes marianas. O estudo distingue elementos simbolicos, historicos e pastorais sem reduzir o fenomeno a uma unica explicacao. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/research/2023-marian-apparitions-critique",
    "downloadUrl": "/research/2023-marian-apparitions-critique.pdf",
    "pdfPath": "/research/2023-marian-apparitions-critique.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"A Coroa e a Cruz: Análise Teológica e Fenomenológica das Aparições Marianas\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "Relatos devocionais frequentemente carecem de criterios consistentes de discernimento historico e fenomenologico.",
      "contributions": [
        "Matriz de avaliacao de relatos de aparicoes sob criterios academicos.",
        "Integração entre fenomenologia e critica documental.",
        "Clarificacao de limites epistemologicos do tema."
      ],
      "applications": "Util em estudos de religiao, historia da espiritualidade e analise de fenomenos coletivos.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Analise teologica e fenomenologica critica de narrativas de aparicoes marianas. Comparacao de documentos, tradicoes e criterios de autenticidade em abordagem historico-critica. O estudo distingue elementos simbolicos, historicos e pastorais sem reduzir o fenomeno a uma unica explicacao.",
      "introduction": "Relatos devocionais frequentemente carecem de criterios consistentes de discernimento historico e fenomenologico.",
      "methods": "Comparacao de documentos, tradicoes e criterios de autenticidade em abordagem historico-critica.",
      "results": "O estudo distingue elementos simbolicos, historicos e pastorais sem reduzir o fenomeno a uma unica explicacao.",
      "discussion": "A pesquisa reforca necessidade de metodos transparentes para evitar conclusoes apologeticas ou céticas simplistas.",
      "conclusion": "Util em estudos de religiao, historia da espiritualidade e analise de fenomenos coletivos. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #25).",
        "Referencia de dominio: W3C JSON-LD 1.1",
        "Referencia de dominio: Schema.org",
        "Referencia de dominio: NIST AI RMF",
        "Referencia de dominio: Marian studies corpus",
        "Referencia de dominio: Phenomenology of religion",
        "Referencia de dominio: Church historical commissions"
      ]
    },
    "sourceEvidence": []
  },
  {
    "ordinal": 27,
    "id": "2023-digital-legacy",
    "title": "Desafios da Herança Digital: Preservação de Memória Pós-Mortem",
    "category": "whitepapers",
    "kind": "R",
    "date": "2023",
    "publishedAt": "2023-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "Engenharia",
      "IoT",
      "Seguranca",
      "DIGITAL",
      "LEGACY"
    ],
    "summary": "Whitepaper sobre desafios da heranca digital e preservacao de memoria pos-mortem. O documento define requisitos minimos para continuidade, autenticidade e privacidade de acervos digitais. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/whitepapers/2023-digital-legacy",
    "downloadUrl": "/whitepapers/2023-digital-legacy.pdf",
    "pdfPath": "/whitepapers/2023-digital-legacy.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"Desafios da Herança Digital: Preservação de Memória Pós-Mortem\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "Ativos digitais e identidades online carecem de protocolos claros de sucessao, custodia e consentimento.",
      "contributions": [
        "Modelo de governanca para ativos digitais sensiveis no pos-morte.",
        "Requisitos tecnicos de integridade e trilha de auditoria.",
        "Fluxos operacionais para controle de acesso e transferencia de custodia."
      ],
      "applications": "Aplicavel a plataformas de memorial digital, arquivos institucionais e servicos de planejamento sucessorio.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Whitepaper sobre desafios da heranca digital e preservacao de memoria pos-mortem. Analise de risco juridico-tecnico com proposta de arquitetura de preservacao e governanca de acesso. O documento define requisitos minimos para continuidade, autenticidade e privacidade de acervos digitais.",
      "introduction": "Ativos digitais e identidades online carecem de protocolos claros de sucessao, custodia e consentimento.",
      "methods": "Analise de risco juridico-tecnico com proposta de arquitetura de preservacao e governanca de acesso.",
      "results": "O documento define requisitos minimos para continuidade, autenticidade e privacidade de acervos digitais.",
      "discussion": "A implementacao exige alinhamento entre engenharia, compliance e familia/curadoria do legado.",
      "conclusion": "Aplicavel a plataformas de memorial digital, arquivos institucionais e servicos de planejamento sucessorio. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #27).",
        "Referencia de dominio: NIST",
        "Referencia de dominio: ISO/IEC standards",
        "Referencia de dominio: Architecture reference literature",
        "Referencia de dominio: Digital estate planning literature",
        "Referencia de dominio: ISO 15489",
        "Referencia de dominio: NIST privacy framework"
      ]
    },
    "sourceEvidence": []
  },
  {
    "ordinal": 29,
    "id": "2023-holy-club-methodism",
    "title": "O Clube Santo: Arqueologia Espiritual, Teológica e Visual do Metodismo",
    "category": "research",
    "kind": "J",
    "date": "2023",
    "publishedAt": "2023-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "IA",
      "Economia",
      "Sistemas Complexos",
      "HOLY",
      "CLUB",
      "METHODISM"
    ],
    "summary": "Investigacao arqueologica espiritual, teologica e visual do Holy Club e suas implicacoes para o metodismo. O estudo reconstrói redes de praticas formativas e disciplina comunitaria no contexto original. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/research/2023-holy-club-methodism",
    "downloadUrl": "/research/2023-holy-club-methodism.pdf",
    "pdfPath": "/research/2023-holy-club-methodism.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"O Clube Santo: Arqueologia Espiritual, Teológica e Visual do Metodismo\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "A memoria do movimento metodista inicial e frequentemente reduzida a narrativas lineares e pouco contextualizadas.",
      "contributions": [
        "Reconstrucao critica de praticas e simbolos do Holy Club.",
        "Integração de evidencias textuais e visuais em abordagem unica.",
        "Atualizacao interpretativa para debates contemporaneos de formacao comunitaria."
      ],
      "applications": "Contribui para historia eclesiastica, formacao pastoral e pesquisa em espiritualidade historica.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Investigacao arqueologica espiritual, teologica e visual do Holy Club e suas implicacoes para o metodismo. Leitura historica interdisciplinar com fontes primarias, iconografia e tradicao institucional. O estudo reconstrói redes de praticas formativas e disciplina comunitaria no contexto original.",
      "introduction": "A memoria do movimento metodista inicial e frequentemente reduzida a narrativas lineares e pouco contextualizadas.",
      "methods": "Leitura historica interdisciplinar com fontes primarias, iconografia e tradicao institucional.",
      "results": "O estudo reconstrói redes de praticas formativas e disciplina comunitaria no contexto original.",
      "discussion": "Os achados destacam continuidade e ruptura entre o nucleo inicial e desenvolvimentos posteriores do metodismo.",
      "conclusion": "Contribui para historia eclesiastica, formacao pastoral e pesquisa em espiritualidade historica. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #29).",
        "Referencia de dominio: W3C JSON-LD 1.1",
        "Referencia de dominio: Schema.org",
        "Referencia de dominio: NIST AI RMF",
        "Referencia de dominio: Methodist historiography",
        "Referencia de dominio: John Wesley sources",
        "Referencia de dominio: Ecclesiastical history methods"
      ]
    },
    "sourceEvidence": []
  },
  {
    "ordinal": 31,
    "id": "2022-theology-of-hope",
    "title": "A Teologia da Esperança em Tempos de Crise",
    "category": "essays",
    "kind": "J",
    "date": "2022",
    "publishedAt": "2022-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "Teologia",
      "Humanidades",
      "Historia",
      "THEOLOGY",
      "HOPE"
    ],
    "summary": "Ensaio sobre teologia da esperanca em contextos de crise social, economica e institucional. O artigo explicita como a esperanca pode operar como categoria ativa de acao e nao apenas conforto simbólico. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/essays/2022-theology-of-hope",
    "downloadUrl": "/essays/2022-theology-of-hope.pdf",
    "pdfPath": "/essays/2022-theology-of-hope.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"A Teologia da Esperança em Tempos de Crise\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "Cenarios de incerteza tendem a produzir fatalismo ou respostas imediatistas sem base antropologica robusta.",
      "contributions": [
        "Releitura critica da esperanca como categoria historica e social.",
        "Articulacao entre transcendencia, agencia humana e responsabilidade.",
        "Pistas de aplicacao para cuidado pastoral e acao comunitaria."
      ],
      "applications": "Util para lideranca comunitaria, educacao teologica e programas de cuidado em ambientes de crise.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Ensaio sobre teologia da esperanca em contextos de crise social, economica e institucional. Analise teologica e filosofica de categorias de esperanca, sofrimento e responsabilidade comunitaria. O artigo explicita como a esperanca pode operar como categoria ativa de acao e nao apenas conforto simbólico.",
      "introduction": "Cenarios de incerteza tendem a produzir fatalismo ou respostas imediatistas sem base antropologica robusta.",
      "methods": "Analise teologica e filosofica de categorias de esperanca, sofrimento e responsabilidade comunitaria.",
      "results": "O artigo explicita como a esperanca pode operar como categoria ativa de acao e nao apenas conforto simbólico.",
      "discussion": "A relevancia pratica surge ao traduzir teologia em etica publica e estrategias de coesao social.",
      "conclusion": "Util para lideranca comunitaria, educacao teologica e programas de cuidado em ambientes de crise. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #31).",
        "Referencia de dominio: Hermeneutics literature",
        "Referencia de dominio: Historical-critical methodology",
        "Referencia de dominio: Interdisciplinary studies",
        "Referencia de dominio: Moltmann",
        "Referencia de dominio: Bonhoeffer",
        "Referencia de dominio: Public theology literature"
      ]
    },
    "sourceEvidence": []
  },
  {
    "ordinal": 33,
    "id": "2020-robotics-education",
    "title": "Metodologias Ativas no Ensino de Lógica de Programação",
    "category": "essays",
    "kind": "J",
    "date": "2020",
    "publishedAt": "2020-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "Teologia",
      "Humanidades",
      "Historia",
      "ROBOTICS",
      "EDUCATION"
    ],
    "summary": "Estudo sobre robotica educacional e metodologias ativas no ensino de logica de programacao para jovens. A abordagem hands-on melhora engajamento, colaboracao e consolidacao de raciocinio logico. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/essays/2020-robotics-education",
    "downloadUrl": "/essays/2020-robotics-education.pdf",
    "pdfPath": "/essays/2020-robotics-education.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"Metodologias Ativas no Ensino de Lógica de Programação\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "Modelos expositivos tradicionais geram baixa retencao e pouca transferencia de aprendizagem computacional.",
      "contributions": [
        "Modelo pedagogico integrando robotica e logica computacional.",
        "Indicadores para avaliar aprendizagem ativa em contexto juvenil.",
        "Guia de implementacao para ambientes com diferentes niveis de infraestrutura."
      ],
      "applications": "Aplicavel a escolas, labs maker e programas de iniciacao tecnologica.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Estudo sobre robotica educacional e metodologias ativas no ensino de logica de programacao para jovens. Intervencao didatica com atividades praticas, resolucao de problemas e avaliacao por competencias. A abordagem hands-on melhora engajamento, colaboracao e consolidacao de raciocinio logico.",
      "introduction": "Modelos expositivos tradicionais geram baixa retencao e pouca transferencia de aprendizagem computacional.",
      "methods": "Intervencao didatica com atividades praticas, resolucao de problemas e avaliacao por competencias.",
      "results": "A abordagem hands-on melhora engajamento, colaboracao e consolidacao de raciocinio logico.",
      "discussion": "Escalabilidade depende de formacao docente e desenho curricular orientado a projeto.",
      "conclusion": "Aplicavel a escolas, labs maker e programas de iniciacao tecnologica. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #33).",
        "Referencia de dominio: Hermeneutics literature",
        "Referencia de dominio: Historical-critical methodology",
        "Referencia de dominio: Interdisciplinary studies",
        "Referencia de dominio: Papert",
        "Referencia de dominio: Kolb",
        "Referencia de dominio: Active learning research"
      ]
    },
    "sourceEvidence": []
  },
  {
    "ordinal": 37,
    "id": "2017-chaos-theory-economics",
    "title": "Teoria do Caos: Emergência e Auto-organização em Mercados",
    "category": "essays",
    "kind": "J",
    "date": "2017",
    "publishedAt": "2017-01-01",
    "updatedAt": "2026-02-21",
    "inLanguage": "pt-BR",
    "tags": [
      "Teologia",
      "Humanidades",
      "Historia",
      "CHAOS",
      "THEORY",
      "ECONOMICS"
    ],
    "summary": "Trabalho sobre teoria do caos e auto-organizacao em mercados nao lineares. O estudo mostra que pequenas perturbacoes podem amplificar risco e alterar padroes macro de forma nao proporcional. A pagina publica sintese executiva, enquanto o PDF concentra metodologia, dados e referencias completas.",
    "canonicalUrl": "https://ulissesflores.com/essays/2017-chaos-theory-economics",
    "downloadUrl": "/essays/2017-chaos-theory-economics.pdf",
    "pdfPath": "/essays/2017-chaos-theory-economics.pdf",
    "landing": {
      "overview": "Esta pagina apresenta uma sintese executiva de \"Teoria do Caos: Emergência e Auto-organização em Mercados\" com foco no valor cientifico e aplicabilidade tecnica.",
      "problem": "Hipoteses de equilibrio linear falham em explicar dinamicas de instabilidade e transicoes abruptas de mercado.",
      "contributions": [
        "Integração entre teoria do caos e interpretacao economica aplicada.",
        "Critica a simplificacoes lineares em previsao de mercados.",
        "Proposta de agenda para modelagem economica de sistemas complexos."
      ],
      "applications": "Base para analise de risco sistemico, macroprudencial e desenho de politicas resilientes.",
      "downloadPitch": "O PDF completo apresenta estrutura cientifica formal (IMRaD), detalhamento metodologico, figuras, referencias e materiais tecnicos integrais."
    },
    "sections": {
      "abstract": "Trabalho sobre teoria do caos e auto-organizacao em mercados nao lineares. Discussao teorica com referencia a sistemas dinamicos, sensibilidade a condicoes iniciais e comportamento emergente. O estudo mostra que pequenas perturbacoes podem amplificar risco e alterar padroes macro de forma nao proporcional.",
      "introduction": "Hipoteses de equilibrio linear falham em explicar dinamicas de instabilidade e transicoes abruptas de mercado.",
      "methods": "Discussao teorica com referencia a sistemas dinamicos, sensibilidade a condicoes iniciais e comportamento emergente.",
      "results": "O estudo mostra que pequenas perturbacoes podem amplificar risco e alterar padroes macro de forma nao proporcional.",
      "discussion": "A implicacao central e metodologica: modelos economicos devem incorporar nao linearidade e complexidade adaptativa.",
      "conclusion": "Base para analise de risco sistemico, macroprudencial e desenho de politicas resilientes. Estudos futuros devem ampliar validacao empirica e comparacao em cenarios multi-contexto.",
      "references": [
        "W3C. JSON-LD 1.1 Recommendation (2024).",
        "Schema.org Documentation. ScholarlyArticle, Report and CreativeWork.",
        "ORCID Record: 0000-0002-6034-7765 (item #37).",
        "Referencia de dominio: Hermeneutics literature",
        "Referencia de dominio: Historical-critical methodology",
        "Referencia de dominio: Interdisciplinary studies",
        "Referencia de dominio: Lorenz",
        "Referencia de dominio: Mandelbrot",
        "Referencia de dominio: Complexity economics"
      ]
    },
    "sourceEvidence": []
  }
];
