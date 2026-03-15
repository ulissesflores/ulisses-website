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
  languageSwitcher: {
    label: 'Idioma'
  }
} as const;
