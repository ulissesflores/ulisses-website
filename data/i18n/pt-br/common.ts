export const common = {
  nav: {
    categories: {
      sobre: {
        label: 'Sobre',
        items: {
          bio: { label: 'Bio', href: '/#about', description: 'Quem sou e minha trajetória' },
          expertise: { label: 'Expertise', href: '/#pillars', description: 'Pilares de atuação' },
          trajetoria: { label: 'Trajetória', href: '/#trajectory', description: 'Linha do tempo profissional' },
        },
      },
      publicacoes: {
        label: 'Publicações',
        items: {
          research: { label: 'Research', href: '/research', description: 'IA, Economia e Sistemas Complexos' },
          whitepapers: { label: 'Whitepapers', href: '/whitepapers', description: 'Engenharia, IoT e Segurança' },
          projetoPsi: { label: 'Projeto Ψ (PSI)', href: '/whitepapers/projeto-psi', description: 'Whitepaper técnico: Hardware Soberano' },
          psiDemo: { label: 'PSI — Demonstração', href: '/projeto-psi', description: 'Landing comercial: investimento e licenciamento' },
          essays: { label: 'Essays', href: '/essays', description: 'Teologia, Humanidades e História' },
        },
      },
      acervo: {
        label: 'Acervo',
        items: {
          acervoTeologico: { label: 'Acervo Teológico', href: '/acervo-teologico', description: 'Sermões por cluster temático' },
          clubeSanto: { label: 'Clube Santo', href: '/clube-santo', description: 'Avivamento para a era digital' },
          mundoPolitico: { label: 'Mundo Político', href: '/mundo-politico', description: 'Artigos e análises políticas' },
        },
      },
      ferramentas: {
        label: 'Ferramentas',
        items: {
          simulacoes: { label: 'Simulações', href: '/simulacoes', description: 'Laboratório de cenários prospectivos' },
          identidade: { label: 'Identidade', href: '/identidade', description: 'Hub canônico de identidade soberana' },
          certificacoes: { label: 'Certificações', href: '/certifications', description: 'Credenciais e verificações' },
        },
      },
    },
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
} as const;
