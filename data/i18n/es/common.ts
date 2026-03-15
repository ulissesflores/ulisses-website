export const common = {
  nav: {
    categories: [
      {
        label: 'Acerca de',
        items: [
          {
            label: 'Biografía',
            href: '/#about',
            description: 'Quién soy y mi trayectoria'
          },
          {
            label: 'Experiencia',
            href: '/#pillars',
            description: 'Pilares de actuación'
          },
          {
            label: 'Trayectoria',
            href: '/#trajectory',
            description: 'Línea de tiempo profesional'
          }
        ]
      },
      {
        label: 'Publicaciones',
        items: [
          {
            label: 'Investigación',
            href: '/research',
            description: 'IA, Economía y Sistemas Complejos'
          },
          {
            label: 'Whitepapers',
            href: '/whitepapers',
            description: 'Ingeniería, IoT y Seguridad'
          },
          {
            label: 'Proyecto Ψ (PSI)',
            href: '/whitepapers/projeto-psi',
            description: 'Whitepaper técnico: Hardware Soberano'
          },
          {
            label: 'PSI — Demostración',
            href: '/projeto-psi',
            description: 'Landing comercial: inversión y licenciamiento'
          },
          {
            label: 'Ensayos',
            href: '/essays',
            description: 'Teología, Humanidades e Historia'
          }
        ]
      },
      {
        label: 'Archivo',
        items: [
          {
            label: 'Archivo Teológico',
            href: '/acervo-teologico',
            description: 'Sermones por clúster temático'
          },
          {
            label: 'Clube Santo',
            href: '/clube-santo',
            description: 'Avivamiento para la era digital'
          },
          {
            label: 'Mundo Político',
            href: '/mundo-politico',
            description: 'Artículos y análisis políticos'
          }
        ]
      },
      {
        label: 'Herramientas',
        items: [
          {
            label: 'Simulaciones',
            href: '/simulacoes',
            description: 'Laboratorio de escenarios prospectivos'
          },
          {
            label: 'Identidad',
            href: '/identidade',
            description: 'Hub canónico de identidad soberana'
          },
          {
            label: 'Certificaciones',
            href: '/certifications',
            description: 'Credenciales y verificaciones'
          }
        ]
      }
    ]
  },
  cta: 'CONTÁCTAME',
  mobileMenu: {
    open: 'Abrir menú',
    close: 'Cerrar menú'
  },
  footer: {
    tagline: 'Ulisses Flores · Ground Truth Knowledge Hub',
    identityLink: 'Sovereign Identity Graph'
  },
  faqSection: {
    defaultTitle: 'Preguntas Frecuentes'
  },
  authorHubCard: {
    defaultLabel: 'Autor',
    defaultDescription: 'Fuente canónica de autoría e identidad semántica de este contenido.'
  },
  breadcrumb: {
    home: 'Inicio'
  },
  actions: {
    verify: 'Verificar',
    open: 'Abrir',
    explore: 'Explorar',
    contact: 'Contactar con Ulisses Flores →'
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
    label: 'Idioma'
  }
} as const;
