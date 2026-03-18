export const common = {
  nav: {
    categories: [
      {
        label: 'Sobre',
        items: [
          { label: 'Bio', href: '/#about', description: 'Quem sou e minha trajetória' },
          { label: 'Expertise', href: '/#pillars', description: 'Pilares de atuação' },
          { label: 'Trajetória', href: '/#trajectory', description: 'Linha do tempo profissional' },
        ],
      },
      {
        label: 'Publicações',
        items: [
          { label: 'Research', href: '/research', description: 'IA, Economia e Sistemas Complexos' },
          { label: 'Whitepapers', href: '/whitepapers', description: 'Engenharia, IoT e Segurança' },
          { label: 'Projeto Ψ (PSI)', href: '/whitepapers/projeto-psi', description: 'Whitepaper técnico: Hardware Soberano' },
          { label: 'PSI — Demonstração', href: '/projeto-psi', description: 'Landing comercial: investimento e licenciamento' },
          { label: 'Essays', href: '/essays', description: 'Teologia, Humanidades e História' },
        ],
      },
      {
        label: 'Acervo',
        items: [
          { label: 'Acervo Teológico', href: '/acervo-teologico', description: 'Sermões por cluster temático' },
          { label: 'Clube Santo', href: '/clube-santo', description: 'Avivamento para a era digital' },
          { label: 'Mundo Político', href: '/mundo-politico', description: 'Artigos e análises políticas' },
        ],
      },
      {
        label: 'Ferramentas',
        items: [
          { label: 'Simulações', href: '/simulacoes', description: 'Laboratório de cenários prospectivos' },
          { label: 'Identidade', href: '/identidade', description: 'Hub canônico de identidade soberana' },
          { label: 'Certificações', href: '/certifications', description: 'Credenciais e verificações' },
        ],
      },
    ],
  },
  cta: 'FALE COMIGO',
  mobileMenu: {
    open: 'Abrir menu',
    close: 'Fechar menu',
  },
  footer: {
    tagline: 'Ulisses Flores · Ground Truth Knowledge Hub',
    identityLink: 'Sovereign Identity Graph',
  },
  faqSection: {
    defaultTitle: 'Perguntas Frequentes',
  },
  authorHubCard: {
    defaultLabel: 'Autor',
    defaultDescription: 'Fonte canônica de autoria e identidade semântica deste conteúdo.',
  },
  breadcrumb: {
    home: 'Home',
  },
  actions: {
    verify: 'Verificar',
    open: 'Abrir',
    explore: 'Explorar',
    contact: 'Falar com Ulisses Flores →',
  },
  notFound: {
    title: 'Pagina nao encontrada',
    description: 'A pagina que voce procura pode ter sido movida, renomeada ou nao existe mais. Explore as secoes principais abaixo.',
    searchHint: 'Ou use a navegacao no topo para encontrar o que procura.',
    links: {
      home: { label: 'Home', description: 'Pagina principal' },
      publications: { label: 'Publicacoes', description: 'Research, Whitepapers e Essays' },
      identity: { label: 'Identidade', description: 'Hub canonico de identidade' },
      simulations: { label: 'Simulacoes', description: 'Laboratorio de cenarios' },
    },
  },
  languageSwitcher: {
    label: 'Idioma',
  },
  articleDetail: {
    notFound: 'Artigo não encontrado',
    backTo: 'Voltar para',
    goHome: 'Ir para Home',
    downloadPdf: 'Baixar PDF Final',
    legacyPdf: 'PDF Legado',
    scientificContext: 'Contexto Científico da Landing',
    abstractPtBr: 'Abstract (PT-BR)',
    abstractEn: 'Abstract (EN)',
    introduction: 'Introdução',
    methodology: 'Metodologia',
    developmentResults: 'Desenvolvimento e Resultados',
    discussion: 'Discussão',
    recommendations: 'Recomendações',
    conclusion: 'Conclusão',
    referencesHarvard: 'Referências (Harvard)',
    source: 'Fonte',
    howToCite: 'Como citar:',
    availableAt: 'Disponível em:',
    publishedOn: 'Publicado em',
  },
  mundoPoliticoDetail: {
    backTo: 'Voltar para Mundo Político',
    sectionLabel: 'Mundo Político',
    publishedOn: 'Publicado em',
    canonicalContext: 'Contexto da Página Canônica',
    canonicalDescription: 'Esta página existe para consolidar metadados, vínculo de autoria e índice semântico. O conteúdo editorial completo permanece na publicação original.',
    originalSource: 'Fonte Original',
    authorPage: 'Página de Autor',
  },
  error: {
    title: 'Algo deu errado',
    description: 'Um erro inesperado ocorreu ao renderizar esta página.',
    retry: 'Tentar novamente',
    home: 'Início',
    criticalTitle: 'Erro Crítico',
    criticalDescription: 'O layout principal falhou. Isto não deveria acontecer.',
    reload: 'Recarregar',
  },
} as const;
