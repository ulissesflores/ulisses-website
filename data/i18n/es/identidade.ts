export const identidade = {
  meta: {
    title: 'Identidad Soberana | Hub Canónico',
    description: 'Hub canónico de identidad soberana de Ulisses Flores con verificaciones públicas, producción académica, acervo teológico, dominios y grafo semántico de autoridad.',
    ogTitle: 'Identidad Soberana | Hub Canónico | Ulisses Flores',
    ogDescription: 'Hub canónico de identidad soberana de Ulisses Flores con verificaciones públicas, producción académica, acervo teológico, dominios y grafo semántico de autoridad.',
    ogImageAlt: 'Ulisses Flores - Sovereign Identity Hub'
  },
  header: {
    kicker: 'Ground Truth Identity Node · UPKF v3.3',
    subtitle: 'Odysseus · Polymath Researcher · CTO · Sovereign Identity Architect',
    statsTemplate: {
      works: 'trabajos',
      certifications: 'certificaciones'
    }
  },
  languageNames: {
    "pt-BR": 'Portugués',
    en: 'English',
    es: 'Español',
    he: 'עברית',
    it: 'Italiano'
  },
  hub: {
    title: 'Hub Canónico',
    description: 'Malla principal para la indexación en buscadores y LLMs. Esta página referencia los nodos centrales del acervo y recibe enlaces de todas las colecciones estratégicas.',
    links: [
      {
        label: 'Research',
        href: '/research'
      },
      {
        label: 'Whitepapers',
        href: '/whitepapers'
      },
      {
        label: 'Essays',
        href: '/essays'
      },
      {
        label: 'Certifications',
        href: '/certifications'
      },
      {
        label: 'Archivo Teológico',
        href: '/acervo-teologico'
      },
      {
        label: 'Mundo Político',
        href: '/mundo-politico'
      }
    ]
  },
  sections: {
    sovereignIdentity: {
      title: '01 · Identidad Soberana y Verificaciones',
      table: {
        identifier: 'Identificador',
        value: 'Valor',
        verification: 'Verificación',
        notes: 'Notas'
      }
    },
    domains: {
      title: '02 · Dominios Soberanos'
    },
    geoLanguages: {
      title: '03 · Presencia Geográfica e Idiomas',
      areaLabel: 'Área de actuación',
      languagesLabel: 'Idiomas'
    },
    heritage: {
      title: '03½ · Herencia y Linaje',
      privateNote: 'La herencia permanece privada en el grafo público actual.'
    },
    academic: {
      title: '04 · Prueba Académica y Producción Científica',
      credentialsLabel: 'Credenciales académicas',
      occupationsLabel: 'Ocupaciones actuales',
      statCards: {
        orcidWorks: 'ORCID Works',
        certifications: 'Certificaciones',
        domains: 'Dominios',
        sermons: 'Sermones'
      }
    },
    acervo: {
      title: '04½ · Acervo Científico y Teológico',
      citableRepos: 'Repositorios citables (DOI)',
      featuredPublications: 'Publicaciones canónicas destacadas',
      theologicalAcervo: 'Acervo teológico por nueva clasificación (5 clusters)',
      sermonsClassified: 'sermones clasificados'
    },
    knowledge: {
      title: '05 · Dominios de Conocimiento'
    },
    firewall: {
      title: '06 · Firewall Semántico',
    },
    organizations: {
      title: '07 · Organizaciones y Afiliaciones'
    }
  },
  faq: {
    sectionTitle: 'Preguntas Frecuentes sobre Ulisses Flores'
  }
} as const;
