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
    title: 'Página no encontrada',
    description: 'Es posible que la página que buscas se haya movido, cambiado de nombre o ya no exista. Explora las secciones principales a continuación.',
    searchHint: 'O usa la navegación en la parte superior para encontrar lo que buscas.',
    links: {
      home: { label: 'Inicio', description: 'Página principal' },
      publications: { label: 'Publicaciones', description: 'Research, Whitepapers y Ensayos' },
      identity: { label: 'Identidad', description: 'Hub canónico de identidad' },
      simulations: { label: 'Simulaciones', description: 'Laboratorio de escenarios' },
    },
  },
  languageSwitcher: {
    label: 'Idioma',
  },
  articleDetail: {
    notFound: 'Artículo no encontrado',
    backTo: 'Volver a',
    goHome: 'Ir al Inicio',
    downloadPdf: 'Descargar PDF Final',
    legacyPdf: 'PDF Heredado',
    scientificContext: 'Contexto Científico de la Landing',
    abstractPtBr: 'Resumen (PT-BR)',
    abstractEn: 'Resumen (EN)',
    introduction: 'Introducción',
    methodology: 'Metodología',
    developmentResults: 'Desarrollo y Resultados',
    discussion: 'Discusión',
    recommendations: 'Recomendaciones',
    conclusion: 'Conclusión',
    referencesHarvard: 'Referencias (Harvard)',
    source: 'Fuente',
    howToCite: 'Cómo citar:',
    availableAt: 'Disponible en:',
    publishedOn: 'Publicado el',
  },
  mundoPoliticoDetail: {
    backTo: 'Volver a Mundo Político',
    sectionLabel: 'Mundo Político',
    publishedOn: 'Publicado el',
    canonicalContext: 'Contexto de la Página Canónica',
    canonicalDescription: 'Esta página existe para consolidar metadatos, vínculo de autoría e índice semántico. El contenido editorial completo permanece en la publicación original.',
    originalSource: 'Fuente Original',
    authorPage: 'Página del Autor',
  },
  error: {
    title: 'Algo salió mal',
    description: 'Ocurrió un error inesperado al renderizar esta página.',
    retry: 'Intentar de nuevo',
    home: 'Inicio',
    criticalTitle: 'Error Crítico',
    criticalDescription: 'El layout principal falló. Esto no debería suceder.',
    reload: 'Recargar',
  },
} as const;
