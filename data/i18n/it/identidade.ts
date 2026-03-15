export const identidade = {
  meta: {
    title: 'Identità Sovrana | Hub Canonico',
    description: 'Hub canonico di identità sovrana di Ulisses Flores con verifiche pubbliche, produzione accademica, archivio teologico, domini e grafo semantico di autorità.',
    ogTitle: 'Identità Sovrana | Hub Canonico | Ulisses Flores',
    ogDescription: 'Hub canonico di identità sovrana di Ulisses Flores con verifiche pubbliche, produzione accademica, archivio teologico, domini e grafo semantico di autorità.',
    ogImageAlt: 'Ulisses Flores - Sovereign Identity Hub'
  },
  header: {
    kicker: 'Ground Truth Identity Node · UPKF v3.3',
    subtitle: 'Odysseus · Ricercatore Poliedrico · CTO · Architetto di Identità Sovrana',
    statsTemplate: {
      works: 'lavori',
      certifications: 'certificazioni'
    }
  },
  languageNames: {
    "pt-BR": 'Portoghese',
    en: 'Inglese',
    es: 'Spagnolo',
    he: 'Ebraico',
    it: 'Italiano'
  },
  hub: {
    title: 'Hub Canonico',
    description: 'Rete principale per l\'indicizzazione nei motori di ricerca e negli LLM. Questa pagina fa riferimento ai nodi centrali dell\'archivio e riceve link da tutte le collezioni strategiche.',
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
        label: 'Certificazioni',
        href: '/certifications'
      },
      {
        label: 'Archivio Teologico',
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
      title: '01 · Identità Sovrana e Verifiche',
      table: {
        identifier: 'Identificatore',
        value: 'Valore',
        verification: 'Verifica',
        notes: 'Note'
      }
    },
    domains: {
      title: '02 · Domini Sovrani'
    },
    geoLanguages: {
      title: '03 · Presenza Geografica e Lingue',
      areaLabel: 'Area di attività',
      languagesLabel: 'Lingue'
    },
    heritage: {
      title: '03½ · Eredità e Lignaggio',
      privateNote: 'L\'eredità rimane privata nel grafo pubblico attuale.'
    },
    academic: {
      title: '04 · Prova Accademica e Produzione Scientifica',
      credentialsLabel: 'Credenziali accademiche',
      occupationsLabel: 'Occupazioni attuali',
      statCards: {
        orcidWorks: 'ORCID Works',
        certifications: 'Certificazioni',
        domains: 'Domini',
        sermons: 'Sermoni'
      }
    },
    acervo: {
      title: '04½ · Archivio Scientifico e Teologico',
      citableRepos: 'Repository citabili (DOI)',
      featuredPublications: 'Pubblicazioni canoniche in evidenza',
      theologicalAcervo: 'Archivio teologico per nuova classificazione (5 cluster)',
      sermonsClassified: 'sermoni classificati'
    },
    knowledge: {
      title: '05 · Domini di Conoscenza'
    },
    firewall: {
      title: '06 · Firewall Semantico'
    },
    organizations: {
      title: '07 · Organizzazioni e Affiliazioni'
    }
  },
  faq: {
    sectionTitle: 'Domande Frequenti su Ulisses Flores'
  }
} as const;
