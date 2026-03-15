export const projetoPsi = {
  meta: {
    title: 'Proyecto PSI — Hardware Soberano para Custodia de Activos Digitales | Ulisses Flores',
    description: 'Custodia de activos digitales de clase nuclear. Hardware con Zero Trust en Silicio, criptografía postcuántica XMSS y redundancia aeroespacial TMR. Inversión y licenciamiento.',
    keywords: [
      "hardware wallet",
      "custodia de activos digitales",
      "zero trust hardware",
      "criptografía postcuántica",
      "SRAM PUF",
      "inversión en seguridad de hardware",
      "soberanía digital",
      "cold storage institucional",
      "Ulisses Flores",
      "Codex Hash",
      "seguridad nuclear",
      "TMR redundancia"
    ],
    ogTitle: 'Proyecto PSI — Hardware Soberano para Custodia de Activos Digitales',
    ogDescription: 'Custodia de activos digitales de clase nuclear. Zero Trust en Silicio, XMSS postcuántico y redundancia aeroespacial TMR.'
  },
  hero: {
    badge: 'Inversión y Licenciamiento',
    h1: 'Proyecto PSI: La Bóveda Digital que Desafía las Leyes de la Física',
    lead: 'Custodia soberana de activos digitales con seguridad de clase nuclear. Zero Trust en silicio. Criptografía a prueba de computadoras cuánticas. Redundancia de nivel aeroespacial.',
    ctaPrimary: 'Solicitar Presentación Ejecutiva',
    ctaSecondary: 'Leer el Whitepaper Técnico'
  },
  executiveSummary: {
    title: '¿Por Qué Existe el PSI?',
    p1: 'La era del “confía en el banco” terminó. La era del “confía en el exchange” nunca debió empezar. El Proyecto PSI nace de la premisa radical de que la custodia de sus activos digitales no puede depender de ninguna institución, ningún servidor y ninguna persona — ni siquiera del fabricante del dispositivo.',
    p2: 'Mientras que las hardware wallets tradicionales protegen contra hackers aficionados, el PSI fue diseñado para resistir a adversarios de estado, ataques electromagnéticos, extorsión física e incluso computadoras cuánticas. No es una mejora incremental.',
    p2Highlight: 'Es un cambio de paradigma.'
  },
  pillars: {
    title: 'Cuatro Pilares de Seguridad Absoluta',
    items: [
      {
        src: '/whitepapers/psi-arquitetura-hardware-camadas-defesa.webp',
        alt: 'Diagrama de las capas de defensa del hardware PSI: blindaje Faraday, cerámica antitérmica y aislamiento acústico',
        title: 'Fortaleza Física',
        text: 'Chasis blindado con malla Faraday contra pulsos electromagnéticos. Cerámica antitérmica. Aislamiento acústico contra ataques de canal lateral. Sin USB. Sin pantalla. Sin superficie de ataque.'
      },
      {
        src: '/whitepapers/psi-ciclo-vida-chave-criptografica-sram-puf.webp',
        alt: 'Ciclo de vida de la clave criptográfica: reconstrucción efímera vía SRAM PUF — la clave nunca existe en reposo',
        title: 'Clave que Nunca Existe',
        text: 'La clave privada no se almacena — en ningún lugar. Se reconstruye temporalmente usando la huella digital única del silicio (SRAM PUF) y colapsa después de cada uso. Sin semilla para robar.'
      },
      {
        src: '/whitepapers/psi-protocolo-phantom-biometria-coacao.webp',
        alt: 'Protocolo Phantom Input: detección de coacción por biometría conductual y liberación de fondos falsos bajo extorsión',
        title: 'Anti-Secuestro Inteligente',
        text: 'El PSI aprende su patrón biométrico. Si detecta estrés o coacción, activa el Phantom Mode: desbloquea una billetera fantasma con fondos falsos. El agresor nunca sabrá que fue engañado.'
      },
      {
        src: '/whitepapers/psi-arquitetura-tmr-redundancia-voter.webp',
        alt: 'Arquitectura TMR con voter: tres procesadores ejecutan en paralelo y un voter valida consenso — estándar aeroespacial',
        title: 'Redundancia Aeroespacial',
        text: 'Tres procesadores ejecutan cada operación en paralelo. Un "voter" valida el consenso. Si un chip falla o es adulterado, los otros dos continúan. Es la misma tecnología usada en satélites y misiles.'
      }
    ]
  },
  targetMarket: {
    title: '¿Para Quién es el PSI?',
    items: [
      {
        title: 'Family Offices & UHNWIs',
        text: 'Custodia personal de patrimonio digital de 7+ dígitos sin depender de terceros.'
      },
      {
        title: 'Fondos y Exchanges Institucionales',
        text: 'Cold storage de clase militar para cumplimiento y auditoría de custodia calificada.'
      },
      {
        title: 'Gobiernos y Bancos Centrales',
        text: 'Custodia soberana de reservas digitales nacionales y CBDCs con resistencia a ataques de estado.'
      }
    ]
  },
  stats: {
    title: 'Los Números que Importan',
    items: [
      {
        value: '0',
        label: 'Claves almacenadas permanentemente. Cero superficie de ataque estática.'
      },
      {
        value: '3×',
        label: 'Redundancia modular triple. Cada operación validada por consenso de 3 procesadores.'
      },
      {
        value: 'Q-Day Ready',
        label: 'Criptografía XMSS postcuántica. Preparado para el día en que computadoras cuánticas rompan RSA y ECDSA.'
      },
      {
        value: 'EMP-Proof',
        label: 'Blindaje Faraday + cerámica. Funcional después de pulso electromagnético.'
      }
    ]
  },
  author: {
    label: 'Inventor y Arquitecto',
    description: 'Proyecto concebido por Ulisses Flores — Consultor Estratégico de IA, Estudiante de Maestría en Inteligencia Artificial por la AGTU (EE. UU.) y co-inventor de tecnologías blockchain (Codex Hash).'
  },
  faq: {
    sectionTitle: 'Preguntas Frecuentes — Inversores'
  },
  cta: {
    title: '¿Listo para Conocer el Futuro de la Custodia?',
    description: 'Agende una presentación ejecutiva del Proyecto PSI. Discutimos modelo de licenciamiento, roadmap de producto y oportunidades de inversión.',
    button: 'Contactar'
  },
  crossLink: '📄 Lea el Whitepaper Técnico Completo →'
} as const;
