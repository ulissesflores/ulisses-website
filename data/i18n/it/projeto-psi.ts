export const projetoPsi = {
  meta: {
    title: 'Progetto PSI — Hardware Sovrano per la Custodia di Asset Digitali | Ulisses Flores',
    description: 'Custodia di asset digitali di classe nucleare. Hardware con Zero Trust su Silicio, crittografia post-quantistica XMSS e ridondanza aerospaziale TMR. Investimento e licenza.',
    keywords: [
      "hardware wallet",
      "custodia di asset digitali",
      "zero trust hardware",
      "crittografia post-quantistica",
      "SRAM PUF",
      "investimento sicurezza hardware",
      "sovranità digitale",
      "cold storage istituzionale",
      "Ulisses Flores",
      "Codex Hash",
      "sicurezza nucleare",
      "ridondanza TMR"
    ],
    ogTitle: 'Progetto PSI — Hardware Sovrano per la Custodia di Asset Digitali',
    ogDescription: 'Custodia di asset digitali di classe nucleare. Zero Trust su Silicio, XMSS post-quantistico e ridondanza aerospaziale TMR.'
  },
  hero: {
    badge: 'Investimento & Licenza',
    h1: 'Progetto PSI: La Cassaforte Digitale che Sfida le Leggi della Fisica',
    lead: 'Custodia sovrana di asset digitali con sicurezza di classe nucleare. Zero Trust su silicio. Crittografia a prova di computer quantistici. Ridondanza di livello aerospaziale.',
    ctaPrimary: 'Richiedi Presentazione Esecutiva',
    ctaSecondary: 'Leggi il Whitepaper Tecnico'
  },
  executiveSummary: {
    title: 'Perché PSI Esiste',
    p1: 'L\'era del “fidati della banca” è finita. L\'era del “fidati dell\'exchange” non avrebbe mai dovuto iniziare. Il Progetto PSI nasce dalla premessa radicale che la custodia dei tuoi asset digitali non può dipendere da alcuna istituzione, alcun server e alcuna persona — nemmeno dal produttore del dispositivo.',
    p2: 'Mentre gli hardware wallet tradizionali proteggono dagli hacker amatoriali, PSI è stato architettato per resistere ad avversari statali, attacchi elettromagnetici, estorsioni fisiche e persino computer quantistici. Non è un miglioramento incrementale.',
    p2Highlight: 'È un cambio di paradigma.'
  },
  pillars: {
    title: 'Quattro Pilastri di Sicurezza Assoluta',
    items: [
      {
        src: '/whitepapers/psi-arquitetura-hardware-camadas-defesa.webp',
        alt: 'Diagramma degli strati di difesa dell\'hardware PSI: schermatura di Faraday, ceramica anti-termica e isolamento acustico',
        title: 'Fortezza Fisica',
        text: 'Telaio blindato con gabbia di Faraday contro impulsi elettromagnetici. Ceramica anti-termica. Isolamento acustico contro attacchi a canale laterale. Senza USB. Senza schermo. Senza superficie di attacco.'
      },
      {
        src: '/whitepapers/psi-ciclo-vida-chave-criptografica-sram-puf.webp',
        alt: 'Ciclo di vita della chiave crittografica: ricostruzione effimera tramite SRAM PUF — la chiave non esiste mai a riposo',
        title: 'Chiave che Non Esiste Mai',
        text: 'La chiave privata non è memorizzata — da nessuna parte. Viene ricostruita temporaneamente usando l\'impronta digitale unica del silicio (SRAM PUF) e collassa dopo ogni utilizzo. Nessun seed da rubare.'
      },
      {
        src: '/whitepapers/psi-protocolo-phantom-biometria-coacao.webp',
        alt: 'Protocollo Phantom Input: rilevamento di coercizione tramite biometria comportamentale e rilascio di fondi falsi sotto estorsione',
        title: 'Anti-Sequestro Intelligente',
        text: 'PSI apprende il tuo modello biometrico. Se rileva stress o coercizione, attiva la Phantom Mode: sblocca un portafoglio fantasma con fondi falsi. L\'aggressore non saprà mai di essere stato ingannato.'
      },
      {
        src: '/whitepapers/psi-arquitetura-tmr-redundancia-voter.webp',
        alt: 'Architettura TMR con voter: tre processori eseguono in parallelo e un voter valida il consenso — standard aerospaziale',
        title: 'Ridondanza Aerospaziale',
        text: 'Tre processori eseguono ogni operazione in parallelo. Un "voter" valida il consenso. Se un chip fallisce o viene manomesso, gli altri due continuano. È la stessa tecnologia utilizzata in satelliti e missili.'
      }
    ]
  },
  targetMarket: {
    title: 'Per Chi è PSI',
    items: [
      {
        title: 'Family Offices & UHNWIs',
        text: 'Custodia personale di patrimonio digitale a 7+ cifre senza dipendere da terzi.'
      },
      {
        title: 'Fondi & Exchange Istituzionali',
        text: 'Cold storage di classe militare per compliance e audit di custodia qualificata.'
      },
      {
        title: 'Governi & Banche Centrali',
        text: 'Custodia sovrana di riserve digitali nazionali e CBDC con resistenza agli attacchi statali.'
      }
    ]
  },
  stats: {
    title: 'I Numeri che Contano',
    items: [
      {
        value: '0',
        label: 'Chiavi memorizzate permanentemente. Zero superficie di attacco statica.'
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
        value: 'EMP-Proof',
        label: 'Schermatura di Faraday + ceramica. Funzionale dopo impulso elettromagnetico.'
      }
    ]
  },
  author: {
    label: 'Inventore & Architetto',
    description: 'Progetto concepito da Ulisses Flores — Consulente Strategico di IA, Studente di Master in Intelligenza Artificiale presso AGTU (USA) e co-inventore di tecnologie blockchain (Codex Hash).'
  },
  faq: {
    sectionTitle: 'Domande Frequenti — Investitori'
  },
  cta: {
    title: 'Pronto a Conoscere il Futuro della Custodia?',
    description: 'Prenota una presentazione esecutiva del Progetto PSI. Discuteremo il modello di licenza, la roadmap del prodotto e le opportunità di investimento.',
    button: 'Contattaci'
  },
  crossLink: '📄 Leggi il Whitepaper Tecnico Completo →'
} as const;
