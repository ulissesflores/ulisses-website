export const common = {
  nav: {
    categories: [
      {
        label: 'Sobre',
        items: [
          {
            label: 'Bio',
            href: '/#about',
            description: 'Quem sou e minha trajetória'
          },
          {
            label: 'Expertise',
            href: '/#pillars',
            description: 'Pilares de atuação'
          },
          {
            label: 'Trajetória',
            href: '/#trajectory',
            description: 'Linha do tempo profissional'
          }
        ]
      },
      {
        label: 'Publicações',
        items: [
          {
            label: 'Research',
            href: '/research',
            description: 'IA, Economia e Sistemas Complexos'
          },
          {
            label: 'Whitepapers',
            href: '/whitepapers',
            description: 'Engenharia, IoT e Segurança'
          },
          {
            label: 'Projeto Ψ (PSI)',
            href: '/whitepapers/projeto-psi',
            description: 'Whitepaper técnico: Hardware Soberano'
          },
          {
            label: 'PSI — Demonstração',
            href: '/projeto-psi',
            description: 'Landing comercial: investimento e licenciamento'
          },
          {
            label: 'Essays',
            href: '/essays',
            description: 'Teologia, Humanidades e História'
          }
        ]
      },
      {
        label: 'Acervo',
        items: [
          {
            label: 'Acervo Teológico',
            href: '/acervo-teologico',
            description: 'Sermões por cluster temático'
          },
          {
            label: 'Clube Santo',
            href: '/clube-santo',
            description: 'Avivamento para a era digital'
          },
          {
            label: 'Mundo Político',
            href: '/mundo-politico',
            description: 'Artigos e análises políticas'
          }
        ]
      },
      {
        label: 'Ferramentas',
        items: [
          {
            label: 'Simulações',
            href: '/simulacoes',
            description: 'Laboratório de cenários prospectivos'
          },
          {
            label: 'Identidade',
            href: '/identidade',
            description: 'Hub canônico de identidade soberana'
          },
          {
            label: 'Certificações',
            href: '/certifications',
            description: 'Credenciais e verificações'
          }
        ]
      }
    ]
  },
  cta: 'FALE COMIGO',
  mobileMenu: {
    open: 'Abrir menu',
    close: 'Fechar menu'
  },
  footer: {
    tagline: 'Ulisses Flores · Ground Truth Knowledge Hub',
    identityLink: 'Sovereign Identity Graph'
  },
  faqSection: {
    defaultTitle: 'Perguntas Frequentes'
  },
  authorHubCard: {
    defaultLabel: 'Autor',
    defaultDescription: 'Fonte canônica de autoria e identidade semântica deste conteúdo.'
  },
  breadcrumb: {
    home: 'Home'
  },
  actions: {
    verify: 'Verificar',
    open: 'Abrir',
    explore: 'Explorar',
    contact: 'Falar com Ulisses Flores →'
  },
  languageSwitcher: {
    label: 'Idioma'
  }
} as const;
