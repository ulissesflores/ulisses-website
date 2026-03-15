export const common = {
  nav: {
    categories: [
      {
        label: 'Chi sono',
        items: [
          {
            label: 'Bio',
            href: '/#about',
            description: 'Chi sono e il mio percorso'
          },
          {
            label: 'Competenze',
            href: '/#pillars',
            description: 'Pilastri di attività'
          },
          {
            label: 'Percorso',
            href: '/#trajectory',
            description: 'Cronologia professionale'
          }
        ]
      },
      {
        label: 'Pubblicazioni',
        items: [
          {
            label: 'Research',
            href: '/research',
            description: 'IA, Economia e Sistemi Complessi'
          },
          {
            label: 'Whitepapers',
            href: '/whitepapers',
            description: 'Ingegneria, IoT e Sicurezza'
          },
          {
            label: 'Projeto Ψ (PSI)',
            href: '/whitepapers/projeto-psi',
            description: 'Whitepaper tecnico: Hardware Sovrano'
          },
          {
            label: 'PSI — Dimostrazione',
            href: '/projeto-psi',
            description: 'Landing commerciale: investimento e licenze'
          },
          {
            label: 'Saggi',
            href: '/essays',
            description: 'Teologia, Umanistica e Storia'
          }
        ]
      },
      {
        label: 'Archivio',
        items: [
          {
            label: 'Archivio Teologico',
            href: '/acervo-teologico',
            description: 'Sermoni per cluster tematico'
          },
          {
            label: 'Clube Santo',
            href: '/clube-santo',
            description: 'Risveglio per l\'era digitale'
          },
          {
            label: 'Mundo Político',
            href: '/mundo-politico',
            description: 'Articoli e analisi politiche'
          }
        ]
      },
      {
        label: 'Strumenti',
        items: [
          {
            label: 'Simulazioni',
            href: '/simulacoes',
            description: 'Laboratorio di scenari prospettici'
          },
          {
            label: 'Identità',
            href: '/identidade',
            description: 'Hub canonico di identità sovrana'
          },
          {
            label: 'Certificazioni',
            href: '/certifications',
            description: 'Credenziali e verifiche'
          }
        ]
      }
    ]
  },
  cta: 'CONTATTAMI',
  mobileMenu: {
    open: 'Apri menu',
    close: 'Chiudi menu'
  },
  footer: {
    tagline: 'Ulisses Flores · Ground Truth Knowledge Hub',
    identityLink: 'Sovereign Identity Graph'
  },
  faqSection: {
    defaultTitle: 'Domande Frequenti'
  },
  authorHubCard: {
    defaultLabel: 'Autore',
    defaultDescription: 'Fonte canonica di autorialità e identità semantica di questo contenuto.'
  },
  breadcrumb: {
    home: 'Home'
  },
  actions: {
    verify: 'Verifica',
    open: 'Apri',
    explore: 'Esplora',
    contact: 'Contatta Ulisses Flores →'
  },
  notFound: {
    title: 'Page not found',
    description: 'The page you are looking for may have been moved, renamed, or no longer exists. Explore the main sections below.',
    searchHint: 'Or use the navigation at the top to find what you are looking for.',
    links: {
      home: { label: 'Home', description: 'Main page' },
      publications: { label: 'Publications', description: 'Research, Whitepapers and Essays' },
      identity: { label: 'Identity', description: 'Canonical identity hub' },
      simulations: { label: 'Simulations', description: 'Scenario laboratory' },
    },
  },
  languageSwitcher: {
    label: 'Lingua'
  }
} as const;
