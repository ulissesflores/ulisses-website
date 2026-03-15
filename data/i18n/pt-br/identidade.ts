export const identidade = {
  meta: {
    title: 'Identidade Soberana | Hub Canônico',
    description:
      'Hub canônico de identidade soberana de Ulisses Flores com verificações públicas, produção acadêmica, acervo teológico, domínios e grafo semântico de autoridade.',
    ogTitle: 'Identidade Soberana | Hub Canônico | Ulisses Flores',
    ogDescription:
      'Hub canônico de identidade soberana de Ulisses Flores com verificações públicas, produção acadêmica, acervo teológico, domínios e grafo semântico de autoridade.',
    ogImageAlt: 'Ulisses Flores - Sovereign Identity Hub',
  },
  header: {
    kicker: 'Ground Truth Identity Node · UPKF v3.3',
    subtitle: 'Odysseus · Polymath Researcher · CTO · Sovereign Identity Architect',
    statsTemplate: {
      works: 'trabalhos',
      certifications: 'certificações',
    },
  },
  languageNames: {
    'pt-BR': 'Português',
    en: 'English',
    es: 'Español',
    he: 'עברית',
    it: 'Italiano',
  } as Record<string, string>,
  hub: {
    title: 'Hub Canônico',
    description:
      'Malha principal para indexação em buscadores e LLMs. Esta página referencia os nós centrais do acervo e recebe links de todas as coleções estratégicas.',
    links: [
      { label: 'Research', href: '/research' },
      { label: 'Whitepapers', href: '/whitepapers' },
      { label: 'Essays', href: '/essays' },
      { label: 'Certifications', href: '/certifications' },
      { label: 'Acervo Teológico', href: '/acervo-teologico' },
      { label: 'Mundo Político', href: '/mundo-politico' },
    ],
  },
  sections: {
    sovereignIdentity: {
      title: '01 · Identidade Soberana e Verificações',
      table: {
        identifier: 'Identificador',
        value: 'Valor',
        verification: 'Verificação',
        notes: 'Notas',
      },
    },
    domains: {
      title: '02 · Domínios Soberanos',
    },
    geoLanguages: {
      title: '03 · Presença Geográfica e Idiomas',
      areaLabel: 'Área de atuação',
      languagesLabel: 'Idiomas',
    },
    heritage: {
      title: '03½ · Herança e Linhagem',
      privateNote: 'Herança permanece privada no grafo público atual.',
    },
    academic: {
      title: '04 · Prova Acadêmica e Produção Científica',
      credentialsLabel: 'Credenciais acadêmicas',
      occupationsLabel: 'Ocupações atuais',
      statCards: {
        orcidWorks: 'ORCID Works',
        certifications: 'Certificações',
        domains: 'Domínios',
        sermons: 'Sermões',
      },
    },
    acervo: {
      title: '04½ · Acervo Científico e Teológico',
      citableRepos: 'Repositórios citáveis (DOI)',
      featuredPublications: 'Publicações canônicas em destaque',
      theologicalAcervo: 'Acervo teológico por nova classificação (5 clusters)',
      sermonsClassified: 'sermões classificados',
    },
    knowledge: {
      title: '05 · Domínios de Conhecimento',
    },
    firewall: {
      title: '06 · Firewall Semântico',
    },
    organizations: {
      title: '07 · Organizações e Afiliações',
    },
  },
  faq: {
    sectionTitle: 'Perguntas Frequentes sobre Ulisses Flores',
  },
} as const;
