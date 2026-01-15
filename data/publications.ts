export interface Publication {
  id: string;
  title: string;
  category: 'research' | 'whitepapers' | 'essays';
  date: string;
  tags: string[];
  summary: string;
  downloadUrl: string;
}

export const publications: Publication[] = [
  // ===========================================================================
  // RESEARCH (IA, ECONOMIA, MATEMÁTICA) -> URL: /research/...
  // ===========================================================================
  {
    id: "2025-little-law-resilience",
    title: "A Lei de Little como Vetor de Resiliência em Data Science",
    category: "research",
    date: "2025",
    tags: ["IA", "Lei de Little", "LSTM", "Resiliência Cibernética"],
    summary: "Investigação sobre arquiteturas híbridas que acoplam Redes Neurais Recorrentes (LSTM) com modelos estocásticos de fluxo (Lei de Little). A pesquisa propõe um framework para criação de agentes autônomos antifrágeis em mercados de alta volatilidade.",
    downloadUrl: "/research/2025-little-law-resilience.pdf"
  },
  {
    id: "2025-lstm-asset-prediction",
    title: "Previsão de Ativos Financeiros com Arquiteturas LSTM Avançadas",
    category: "research",
    date: "2025",
    tags: ["Deep Learning", "Séries Temporais", "Finanças Quantitativas"],
    summary: "Estudo comparativo da eficácia de redes Long Short-Term Memory (LSTM) versus modelos econométricos tradicionais (ARIMA/GARCH) na previsão de ativos de alta volatilidade.",
    downloadUrl: "/research/2025-lstm-asset-prediction.pdf"
  },
  {
    id: "2025-fraud-detection-mlp",
    title: "Detecção de Anomalias em Transações Financeiras usando MLP",
    category: "research",
    date: "2025",
    tags: ["Machine Learning", "Fraude", "Perceptron Multicamadas"],
    summary: "Implementação de um Perceptron Multicamadas (MLP) para detecção de fraudes em tempo real, focando no pré-processamento de dados desbalanceados.",
    downloadUrl: "/research/2025-fraud-detection-mlp.pdf"
  },
  {
    id: "2024-bitcoin-praxeology",
    title: "Bitcoin como Ativo de Reserva: Uma Abordagem Praxeológica",
    category: "research",
    date: "2024",
    tags: ["Economia Austríaca", "Bitcoin", "Praxeologia", "Mises"],
    summary: "Uma análise da criptoeconomia sob a ótica da Escola Austríaca de Economia, validando o Bitcoin como reserva de valor fundamental.",
    downloadUrl: "/research/2024-bitcoin-praxeology.pdf"
  },
  {
    id: "2017-chaos-theory-economics",
    title: "Teoria do Caos e a Não-Linearidade nos Mercados",
    category: "research",
    date: "2017",
    tags: ["Economia", "Teoria do Caos", "Sistemas Complexos"],
    summary: "Monografia que revisita a Teoria do Caos aplicada aos mercados financeiros e a imprevisibilidade de sistemas econômicos complexos.",
    downloadUrl: "/research/2017-chaos-theory-economics.pdf"
  },

  // ===========================================================================
  // WHITEPAPERS (ENGENHARIA, IOT) -> URL: /whitepapers/...
  // ===========================================================================
  {
    id: "2025-iot-data-sovereignty",
    title: "Arquiteturas Cloudless e Soberania de Dados em IoT",
    category: "whitepapers",
    date: "2025",
    tags: ["Edge Computing", "ESP32", "Zero Trust", "Soberania"],
    summary: "Defesa técnica de arquiteturas 'Cloudless' (sem nuvem) para IoT industrial e agrícola, detalhando o uso de microcontroladores ESP32 em Edge Computing.",
    downloadUrl: "/whitepapers/2025-iot-data-sovereignty.pdf"
  },
  {
    id: "2025-hybrid-cooling-thermodynamics",
    title: "Termodinâmica Aplicada: Sistemas de Resfriamento Híbrido",
    category: "whitepapers",
    date: "2025",
    tags: ["Hardware", "Termodinâmica", "HPC", "Eficiência Energética"],
    summary: "Análise de eficiência energética em data centers de alta densidade, propondo um sistema híbrido de resfriamento (Imersão + Ar).",
    downloadUrl: "/whitepapers/2025-hybrid-cooling-thermodynamics.pdf"
  },
  {
    id: "2024-ring-signatures-privacy",
    title: "Privacidade On-Chain: Implementação de Ring Signatures",
    category: "whitepapers",
    date: "2024",
    tags: ["Criptografia", "Monero", "Privacidade", "Blockchain"],
    summary: "Estudo aprofundado sobre a criptografia de 'Ring Signatures' utilizada no protocolo Monero para ofuscação de remetentes.",
    downloadUrl: "/whitepapers/2024-ring-signatures-privacy.pdf"
  },
  {
    id: "2024-agritech-agile-flow",
    title: "Agritech e Fluxo Ágil: Automação de Precisão no Campo",
    category: "whitepapers",
    date: "2024",
    tags: ["Agritech", "Automação", "IoT", "GoldenLeaf"],
    summary: "Apresentação do ecossistema GoldenLeaf de automação agrícola com lógica fuzzy embarcada para otimizar recursos hídricos.",
    downloadUrl: "/whitepapers/2024-agritech-agile-flow.pdf"
  },
  {
    id: "2023-digital-legacy",
    title: "Legado Digital: Protocolos de Herança de Criptoativos",
    category: "whitepapers",
    date: "2023",
    tags: ["Segurança", "Herança", "Dead Man Switch", "Custódia"],
    summary: "Proposta de protocolos técnicos e jurídicos para a transmissão segura de ativos digitais pós-morte (Dead Man Switch).",
    downloadUrl: "/whitepapers/2023-digital-legacy.pdf"
  },

  // ===========================================================================
  // ESSAYS (HUMANIDADES, TEOLOGIA) -> URL: /essays/...
  // ===========================================================================
  {
    id: "2024-historicity-jesus-archaeology",
    title: "A Historicidade de Jesus em Fontes Extrabíblicas",
    category: "essays", // CORRIGIDO: Agora está na categoria certa
    date: "2024",
    tags: ["História", "Arqueologia", "Crítica Textual"],
    summary: "Análise historiográfica baseada em fontes romanas (Tácito, Suetônio) e judaicas (Flávio Josefo), aplicando critérios de autenticidade histórica.",
    downloadUrl: "/research/2024-historicity-jesus-archaeology.pdf"
  },
  {
    id: "2024-scribal-canonization-ezra",
    title: "A Canonização Escribal e a Figura de Esdras",
    category: "essays", // CORRIGIDO
    date: "2024",
    tags: ["Teologia", "Antigo Testamento", "Esdras", "Cânon"],
    summary: "Investigação sobre o processo de formação do cânon hebraico e o papel fundamental de Esdras como escriba e restaurador da Lei.",
    downloadUrl: "/research/2024-scribal-canonization-ezra.pdf"
  },
  {
    id: "2024-theology-economic-order",
    title: "Influência da Teologia Sistemática na Ética Econômica",
    category: "essays",
    date: "2024",
    tags: ["Teologia", "Economia", "Ética Protestante"],
    summary: "Estudo interdisciplinar conectando a teologia sistemática com a formação da ética econômica ocidental e o capitalismo.",
    downloadUrl: "/essays/2024-theology-economic-order.pdf"
  },
  {
    id: "2024-exegetical-treatise-anthropology",
    title: "Tratado Exegético e Antropologia Bíblica",
    category: "essays",
    date: "2024",
    tags: ["Exegese", "Antropologia", "Hermenêutica"],
    summary: "Exame profundo da antropologia bíblica (imago Dei, queda e redenção) e suas implicações filosóficas.",
    downloadUrl: "/essays/2024-exegetical-treatise-anthropology.pdf"
  },
  {
    id: "2023-marian-apparitions-critique",
    title: "Crítica às Aparições Marianas: Uma Análise Teológica",
    category: "essays", // CORRIGIDO
    date: "2023",
    tags: ["Teologia Comparada", "Fenomenologia", "Crítica"],
    summary: "Análise crítica e fenomenológica das aparições marianas sob a luz das Escrituras e da tradição cristã primitiva.",
    downloadUrl: "/research/2023-marian-apparitions-critique.pdf"
  },
  {
    id: "2023-holy-club-methodism",
    title: "O 'Clube Santo' e a Gênese do Metodismo Wesleyano",
    category: "essays", // CORRIGIDO
    date: "2023",
    tags: ["História da Igreja", "Metodismo", "John Wesley"],
    summary: "Retrospectiva histórica sobre o 'Clube Santo' de Oxford e o surgimento do movimento metodista.",
    downloadUrl: "/research/2023-holy-club-methodism.pdf"
  },
  {
    id: "2022-theology-of-hope",
    title: "Teologia da Esperança: Escatologia e Ética",
    category: "essays",
    date: "2022",
    tags: ["Teologia", "Escatologia", "Ética"],
    summary: "Reflexão sobre a 'Teologia da Esperança' e suas implicações para a ética cristã no mundo moderno.",
    downloadUrl: "/essays/2022-theology-of-hope.pdf"
  },
  {
    id: "2020-robotics-education",
    title: "Robótica Educacional e Lógica de Programação",
    category: "essays",
    date: "2020",
    tags: ["Educação", "Robótica", "Lógica", "Metodologia"],
    summary: "Metodologia de ensino de lógica de programação através da robótica física baseado no construcionismo de Papert.",
    downloadUrl: "/essays/2020-robotics-education.pdf"
  }
];