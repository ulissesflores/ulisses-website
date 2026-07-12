export const projetoPsi = {
  meta: {
    title: 'Projeto PSI — Hardware Sovrano per la Custodia di Asset Digitali | Ulisses Flores',
    description: 'Custodia sovrana di asset digitali. Hardware con Zero Trust su silicio, crittografia post-quantistica XMSS e ridondanza modulare tripla (TMR). Investimento e licenza.',
    keywords: [
      "hardware wallet",
      "custodia di asset digitali",
      "hardware zero trust",
      "crittografia post-quantistica",
      "SRAM PUF",
      "investimento sicurezza hardware",
      "sovranità digitale",
      "cold storage istituzionale",
      "Ulisses Flores",
      "Codex Hash",
      "cold storage sovrano",
      "ridondanza TMR"
    ],
    ogTitle: 'Projeto PSI — Hardware Sovrano per la Custodia di Asset Digitali',
    ogDescription: 'Custodia sovrana di asset digitali. Zero Trust su silicio, XMSS post-quantistico e ridondanza modulare tripla (TMR).'
  },
  whitepaperMeta: {
    title: 'Projeto Ψ (PSI): Hardware Sovrano e Zero Trust su Silicio | Ulisses Flores',
    description: 'Whitepaper Tecnico: Architettura di custodia di asset digitali di classe sovrana. Scopri il Projeto PSI, dotato di SRAM PUF, Crittografia XMSS e Ridondanza TMR.',
    keywords: [
      "hardware wallet",
      "zero trust",
      "SRAM PUF",
      "XMSS",
      "crittografia post-quantistica",
      "ring signatures",
      "indirizzi furtivi",
      "airgap wallet",
      "sovranità digitale",
      "Codex Hash",
      "TMR ridondanza modulare tripla",
      "FRAM rad-hard",
      "side-channel attacks",
      "EMP shielding",
      "deniable encryption",
      "Ulisses Flores blockchain",
      "hardware security module",
      "cold storage sovrano"
    ],
    ogTitle: 'Projeto Ψ (PSI): Hardware Sovrano e Zero Trust su Silicio | Ulisses Flores',
    ogDescription: 'Whitepaper Tecnico: Architettura di custodia di asset digitali di classe sovrana con SRAM PUF, XMSS post-quantistico e Ridondanza TMR aerospaziale.'
  },
  simulacaoMeta: {
    title: 'Projeto Ψ (PSI): Esploratore Tecnico dell\'Architettura di Sicurezza | Ulisses Flores',
    description: 'Esploratore interattivo dell\'architettura del Projeto PSI — SRAM PUF, crittografia post-quantistica XMSS, ridondanza TMR aerospaziale e Ring Signatures. Naviga tra i 4 pilastri della sicurezza sovrana.',
    keywords: [
      "hardware wallet",
      "zero trust",
      "SRAM PUF",
      "XMSS",
      "crittografia post-quantistica",
      "ring signatures",
      "indirizzi furtivi",
      "airgap wallet",
      "sovranità digitale",
      "Codex Hash",
      "TMR ridondanza modulare tripla",
      "FRAM rad-hard",
      "side-channel attacks",
      "EMP shielding",
      "deniable encryption",
      "Ulisses Flores blockchain",
      "hardware security module",
      "cold storage sovrano"
    ],
    ogTitle: 'Projeto Ψ (PSI): Esploratore Tecnico dell\'Architettura di Sicurezza | Ulisses Flores',
    ogDescription: 'Esploratore interattivo dell\'architettura del Projeto PSI — SRAM PUF, XMSS post-quantistico e Ridondanza TMR aerospaziale.'
  },
  hero: {
    badge: 'Investimento & Licenza',
    h1: 'Projeto PSI: Custodia Sovrana di Asset Digitali',
    lead: 'Custodia sovrana di asset digitali. Zero Trust su silicio. Crittografia post-quantistica (firme hash-based XMSS). Ridondanza modulare tripla (TMR), derivata da standard aerospaziali.',
    ctaPrimary: 'Richiedi Presentazione Esecutiva',
    ctaSecondary: 'Leggi il Whitepaper Tecnico'
  },
  executiveSummary: {
    title: 'Perché il PSI Esiste',
    p1: 'L\'era del \'fidati della banca\' è finita. L\'era del \'fidati dell\'exchange\' non sarebbe mai dovuta iniziare. Il Projeto PSI nasce dalla premessa radicale che la custodia dei tuoi asset digitali non può dipendere da alcuna istituzione, alcun server e alcuna persona — nemmeno dal produttore del dispositivo.',
    p2: 'Mentre i hardware wallet tradizionali proteggono dagli hacker amatoriali, il PSI è stato architettato per resistere ad avversari statali, attacchi elettromagnetici, estorsioni fisiche e persino computer quantistici. Non è un miglioramento incrementale.',
    p2Highlight: 'È un cambiamento di paradigma.'
  },
  pillars: {
    title: 'Quattro Pilastri di Sicurezza',
    items: [
      {
        src: '/whitepapers/psi-arquitetura-hardware-camadas-defesa.webp',
        alt: 'Diagramma degli strati di difesa dell\'hardware PSI: schermatura di Faraday, ceramica anti-termica e isolamento acustico',
        title: 'Fortezza Fisica',
        text: 'Telaio blindato con gabbia di Faraday contro impulsi elettromagnetici. Ceramica anti-termica. Isolamento acustico contro attacchi a canale laterale. Senza USB e senza schermo — superficie di attacco minimizzata.'
      },
      {
        src: '/whitepapers/psi-ciclo-vida-chave-criptografica-sram-puf.webp',
        alt: 'Ciclo di vita della chiave crittografica: ricostruzione effimera tramite SRAM PUF — la chiave non esiste mai a riposo',
        title: 'Chiave che Non Esiste Mai',
        text: 'La chiave privata non è memorizzata — da nessuna parte. Viene ricostruita temporaneamente utilizzando l\'impronta digitale unica del silicio (SRAM PUF) e collassa dopo ogni utilizzo. Nessuna seed da rubare.'
      },
      {
        src: '/whitepapers/psi-protocolo-phantom-biometria-coacao.webp',
        alt: 'Protocollo Phantom Input: rilevamento di coercizione tramite biometria comportamentale e rilascio di fondi falsi sotto estorsione',
        title: 'Anti-Sequestro Intelligente',
        text: 'Il PSI apprende il tuo modello biometrico. Se rileva stress o coercizione, attiva il Phantom Mode: sblocca un wallet fantasma con fondi falsi. Progettato affinché l\'aggressore non si accorga dell\'inganno.'
      },
      {
        src: '/whitepapers/psi-arquitetura-tmr-redundancia-voter.webp',
        alt: 'Architettura TMR con voter: tre processori eseguono in parallelo e un voter valida il consenso — standard aerospaziale',
        title: 'Ridondanza Aerospaziale',
        text: 'Tre processori eseguono ogni operazione in parallelo. Un "voter" valida il consenso. Se un chip fallisce o viene manomesso, gli altri due continuano. Approccio di ridondanza usato in sistemi aerospaziali critici.'
      }
    ]
  },
  targetMarket: {
    title: 'Per Chi è il PSI',
    items: [
      {
        title: 'Family Offices & UHNWIs',
        text: 'Custodia personale di patrimonio digitale a 7+ cifre senza dipendere da terzi.'
      },
      {
        title: 'Fondi & Exchange Istituzionali',
        text: 'Cold storage di grado istituzionale per compliance e audit di custodia qualificata.'
      },
      {
        title: 'Governi & Banche Centrali',
        text: 'Custodia sovrana di riserve digitali nazionali e CBDC con resistenza ad attacchi statali.'
      }
    ]
  },
  stats: {
    title: 'I Numeri che Contano',
    items: [
      {
        value: '0',
        label: 'Chiavi memorizzate permanentemente. Superficie di attacco statica minimizzata.'
      },
      {
        value: '3×',
        label: 'Ridondanza modulare tripla. Ogni operazione validata dal consenso di 3 processori.'
      },
      {
        value: 'Q-Day Ready',
        label: 'Crittografia XMSS post-quantistica. Preparato per il giorno in cui i computer quantistici romperanno RSA ed ECDSA.'
      },
      {
        value: 'EMP-Resiliente',
        label: 'Schermatura di Faraday + ceramica, progettata per mitigare l\'impulso elettromagnetico (EMP).'
      }
    ]
  },
  author: {
    label: 'Inventore & Architetto',
    description: 'Progetto concepito da Ulisses Flores — Consulente Strategico di IA, Studente di Master in Intelligenza Artificiale presso AGTU e creatore di tecnologie blockchain in Codex Hash.'
  },
  faq: {
    sectionTitle: 'Domande Frequenti — Investitori'
  },
  cta: {
    title: 'Pronto a Conoscere il Futuro della Custodia?',
    description: 'Pianifica una presentazione esecutiva del Projeto PSI. Discutiamo modello di licenza, roadmap di prodotto e opportunità di investimento.',
    button: 'Contattaci'
  },
  crossLink: '📄 Leggi il Whitepaper Tecnico Completo →',
  whitepaperUI: {
    kicker: 'Whitepaper Tecnico',
    kickerSub: 'Ricerca in Architettura di Sistemi e Crittografia Applicata',
    h1: 'Projeto Ψ (PSI): L\'Orizzonte degli Eventi della Sovranità Personale e Zero Trust su Silicio',
    authorLabel: 'Autore:',
    authorRole: 'Consulente Strategico di IA, Architetto Software, Sviluppatore Hardware, Studente di Master AGTU',
    abstractTitle: 'Sommario Esecutivo',
    abstractText: 'L\'avvento dell\'iper-sorveglianza algoritmica su scala statale, unito alla proliferazione di vettori di coercizione fisica e attacchi invasivi nella catena di approvvigionamento hardware, richiede una riformulazione ontologica nelle architetture di custodia di asset digitali critici. I wallet hardware civili tradizionali operano sotto la premessa fondamentale di un ambiente sicuro e di un utente libero da coercizione — presupposti che si rivelano catastroficamente fallaci sotto modelli di minaccia ostili. Questo articolo presenta un\'analisi scientifica esaustiva del Projeto Ψ (PSI), un\'architettura di custodia di classe sovrana basata sul paradigma di Fiducia Zero (Zero Trust) assoluta su silicio.',
    authorCardLabel: 'Ricerca & Creazione',
    authorCardDescription: 'Projeto PSI investigato e documentato da Ulisses Flores — Consulente Strategico di IA, Architetto Software, Sviluppatore Hardware, creatore di Codex Hash e Studente di Master in IA presso AGTU.',
    ctaTitle: 'Interessato alla sovranità digitale e all\'hardware crittografico?',
    ctaDescription: 'Ulisses Flores offre consulenza in privacy digitale, architetture di hardware wallet, Ring Signatures e implementazione di protocolli di sovranità per aziende e progetti blockchain. Contattaci.',
    ctaButton: 'Parla con Ulisses Flores →',
    faqTitle: 'Domande sul Projeto PSI e Hardware Wallet'
  },
  jsonLd: {
    headline: 'Projeto Ψ (PSI): L\'Orizzonte degli Eventi della Sovranità Personale e Zero Trust su Silicio',
    description: 'Whitepaper Tecnico: Architettura di custodia di asset digitali di classe sovrana con SRAM PUF, Crittografia XMSS post-quantistica e Ridondanza Modulare Tripla aerospaziale.',
    softwareName: 'Projeto PSI',
    softwareDescription: 'Hardware wallet di classe sovrana con Zero Trust su silicio, SRAM PUF, XMSS post-quantistico e ridondanza TMR aerospaziale.'
  }
} as const;
