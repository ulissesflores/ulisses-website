export const common = {
  nav: {
    categories: [
      {
        label: 'אודות',
        items: [
          {
            label: 'ביוגרפיה',
            href: '/#about',
            description: 'מי אני והמסלול שלי'
          },
          {
            label: 'מומחיות',
            href: '/#pillars',
            description: 'עמודי תווך של פעילות'
          },
          {
            label: 'מסלול',
            href: '/#trajectory',
            description: 'ציר זמן מקצועי'
          }
        ]
      },
      {
        label: 'פרסומים',
        items: [
          {
            label: 'Research',
            href: '/research',
            description: 'בינה מלאכותית, כלכלה ומערכות מורכבות'
          },
          {
            label: 'Whitepapers',
            href: '/whitepapers',
            description: 'הנדסה, IoT ואבטחה'
          },
          {
            label: 'Projeto Ψ (PSI)',
            href: '/whitepapers/projeto-psi',
            description: 'Whitepaper טכני: חומרה ריבונית'
          },
          {
            label: 'PSI — הדגמה',
            href: '/projeto-psi',
            description: 'דף נחיתה מסחרי: השקעה ורישוי'
          },
          {
            label: 'מאמרים',
            href: '/essays',
            description: 'תאולוגיה, מדעי הרוח והיסטוריה'
          }
        ]
      },
      {
        label: 'ארכיון',
        items: [
          {
            label: 'ארכיון תאולוגי',
            href: '/acervo-teologico',
            description: 'דרשות לפי אשכול נושאים'
          },
          {
            label: 'Clube Santo',
            href: '/clube-santo',
            description: 'התעוררות לעידן הדיגיטלי'
          },
          {
            label: 'Mundo Político',
            href: '/mundo-politico',
            description: 'מאמרים וניתוחים פוליטיים'
          }
        ]
      },
      {
        label: 'כלים',
        items: [
          {
            label: 'סימולציות',
            href: '/simulacoes',
            description: 'מעבדה לתרחישים עתידיים'
          },
          {
            label: 'זהות',
            href: '/identidade',
            description: 'מרכז קנוני לזהות ריבונית'
          },
          {
            label: 'הסמכות',
            href: '/certifications',
            description: 'אישורים ואימותים'
          }
        ]
      }
    ]
  },
  cta: 'דברו איתי',
  mobileMenu: {
    open: 'פתח תפריט',
    close: 'סגור תפריט'
  },
  footer: {
    tagline: 'Ulisses Flores · Ground Truth Knowledge Hub',
    identityLink: 'Sovereign Identity Graph'
  },
  faqSection: {
    defaultTitle: 'שאלות נפוצות'
  },
  authorHubCard: {
    defaultLabel: 'מחבר',
    defaultDescription: 'מקור קנוני לזיהוי מחבר וזהות סמנטית של תוכן זה.'
  },
  breadcrumb: {
    home: 'בית'
  },
  actions: {
    verify: 'אמת',
    open: 'פתח',
    explore: 'חקור',
    contact: 'דבר עם Ulisses Flores →'
  },
  languageSwitcher: {
    label: 'שפה'
  }
} as const;
