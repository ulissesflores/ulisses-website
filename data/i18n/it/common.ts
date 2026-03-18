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
    title: 'Pagina non trovata',
    description: 'La pagina che stai cercando potrebbe essere stata spostata, rinominata o non esiste più. Esplora le sezioni principali qui sotto.',
    searchHint: 'Oppure usa la navigazione in alto per trovare ciò che cerchi.',
    links: {
      home: { label: 'Home', description: 'Pagina principale' },
      publications: { label: 'Pubblicazioni', description: 'Research, Whitepapers e Saggi' },
      identity: { label: 'Identità', description: 'Hub canonico di identità' },
      simulations: { label: 'Simulazioni', description: 'Laboratorio di scenari' },
    },
  },
  languageSwitcher: {
    label: 'Lingua',
  },
  articleDetail: {
    notFound: 'Articolo non trovato',
    backTo: 'Torna a',
    goHome: 'Vai alla Home',
    downloadPdf: 'Scarica PDF Finale',
    legacyPdf: 'PDF Legacy',
    scientificContext: 'Contesto Scientifico della Landing',
    abstractPtBr: 'Sommario (PT-BR)',
    abstractEn: 'Sommario (EN)',
    introduction: 'Introduzione',
    methodology: 'Metodi',
    developmentResults: 'Sviluppo e Risultati',
    discussion: 'Discussione',
    recommendations: 'Raccomandazioni',
    conclusion: 'Conclusione',
    referencesHarvard: 'Riferimenti (Harvard)',
    source: 'Collegamento',
    howToCite: 'Come citare:',
    availableAt: 'Disponibile su:',
    publishedOn: 'Pubblicato il',
  },
  mundoPoliticoDetail: {
    backTo: 'Torna a Mundo Político',
    sectionLabel: 'Mundo Político',
    publishedOn: 'Pubblicato il',
    canonicalContext: 'Contesto della Pagina Canonica',
    canonicalDescription: 'Questa pagina esiste per consolidare metadati, vincolo di autorialità e indice semantico. Il contenuto editoriale completo rimane nella pubblicazione originale.',
    originalSource: 'Fonte Originale',
    authorPage: 'Pagina dell\'Autore',
  },
  error: {
    title: 'Qualcosa è andato storto',
    description: 'Si è verificato un errore imprevisto durante il rendering di questa pagina.',
    retry: 'Riprova',
    home: 'Home',
    criticalTitle: 'Errore Critico',
    criticalDescription: 'Il layout principale ha fallito. Questo non dovrebbe accadere.',
    reload: 'Ricarica',
  },
} as const;
