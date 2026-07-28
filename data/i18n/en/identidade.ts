export const identidade = {
  meta: {
    title: 'Sovereign Identity and Public Verifications',
    description:
      'Sovereign identity page of Ulisses Flores with public verifications, academic production, theological archive, domains and semantic identity graph.',
    ogTitle: 'Sovereign Identity and Public Verifications | Ulisses Flores',
    ogDescription:
      'Sovereign identity page of Ulisses Flores with public verifications, academic production, theological archive, domains and semantic identity graph.',
    ogImageAlt: 'Ulisses Flores - Sovereign Identity',
  },
  header: {
    kicker: 'Verifiable identity · Public graph',
    subtitle: 'CTO · Researcher',
    statsTemplate: {
      works: 'works',
      certifications: 'certifications',
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
    title: 'Canonical Hub',
    description:
      'Main mesh for search engine and LLM indexing. This page references the central nodes of the archive and receives links from all strategic collections.',
    links: [
      { label: 'Research', href: '/research' },
      { label: 'Whitepapers', href: '/whitepapers' },
      { label: 'Essays', href: '/essays' },
      { label: 'Certifications', href: '/certifications' },
      { label: 'Theological Archive', href: '/acervo-teologico' },
      { label: 'Mundo Político', href: '/mundo-politico' },
    ],
  },
  sections: {
    sovereignIdentity: {
      title: '01 · Sovereign Identity and Verifications',
      table: {
        identifier: 'Identifier',
        value: 'Value',
        verification: 'Verification',
        notes: 'Notes',
      },
    },
    domains: {
      title: '02 · Sovereign Domains',
    },
    geoLanguages: {
      title: '03 · Geographic Presence and Languages',
      areaLabel: 'Area of operation',
      languagesLabel: 'Languages',
    },
    heritage: {
      title: '03½ · Heritage and Lineage',
      privateNote: 'Heritage remains private in the current public graph.',
    },
    academic: {
      title: '04 · Academic Proof and Scientific Production',
      credentialsLabel: 'Academic credentials',
      occupationsLabel: 'Current occupations',
      statCards: {
        orcidWorks: 'ORCID Works',
        certifications: 'Certifications',
        domains: 'Domains',
        sermons: 'Sermons',
      },
    },
    acervo: {
      title: '04½ · Scientific and Theological Archive',
      citableRepos: 'Citable repositories (DOI)',
      featuredPublications: 'Featured canonical publications',
      theologicalAcervo: 'Theological archive by new classification (5 clusters)',
      sermonsClassified: 'classified sermons',
    },
    knowledge: {
      title: '05 · Knowledge Domains',
    },
    firewall: {
      title: '06 · Identity Disambiguation',
    },
    organizations: {
      title: '07 · Organizations and Affiliations',
    },
  },
  faq: {
    sectionTitle: 'Frequently Asked Questions about Ulisses Flores',
  },
} as const;
