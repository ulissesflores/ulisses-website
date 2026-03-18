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
  notFound: {
    title: 'הדף לא נמצא',
    description: 'ייתכן שהדף שאתה מחפש הועבר, שונה שמו או שאינו קיים עוד. חקור את הסעיפים העיקריים למטה.',
    searchHint: 'או השתמש בניווט בראש העמוד כדי למצוא את מה שאתה מחפש.',
    links: {
      home: { label: 'בית', description: 'עמוד ראשי' },
      publications: { label: 'פרסומים', description: 'מחקר, Whitepapers ומאמרים' },
      identity: { label: 'זהות', description: 'מרכז קנוני לזהות' },
      simulations: { label: 'סימולציות', description: 'מעבדה לתרחישים' },
    },
  },
  languageSwitcher: {
    label: 'שפה',
  },
  articleDetail: {
    notFound: 'המאמר לא נמצא',
    backTo: 'חזרה ל',
    goHome: 'לדף הבית',
    downloadPdf: 'הורד PDF סופי',
    legacyPdf: 'PDF ישן',
    scientificContext: 'הקשר מדעי של הנחיתה',
    abstractPtBr: 'תקציר (PT-BR)',
    abstractEn: 'תקציר (EN)',
    introduction: 'מבוא',
    methodology: 'מתודולוגיה',
    developmentResults: 'פיתוח ותוצאות',
    discussion: 'דיון',
    recommendations: 'המלצות',
    conclusion: 'מסקנות',
    referencesHarvard: 'הפניות (Harvard)',
    source: 'מקור',
    howToCite: 'כיצד לצטט:',
    availableAt: 'זמין ב:',
    publishedOn: 'פורסם ב',
  },
  mundoPoliticoDetail: {
    backTo: 'חזרה ל-Mundo Político',
    sectionLabel: 'Mundo Político',
    publishedOn: 'פורסם ב',
    canonicalContext: 'הקשר העמוד הקנוני',
    canonicalDescription: 'עמוד זה קיים כדי לאחד מטא-נתונים, קישור מחבר ואינדקס סמנטי. התוכן העריכתי המלא נשאר בפרסום המקורי.',
    originalSource: 'מקור מקורי',
    authorPage: 'דף המחבר',
  },
  error: {
    title: 'משהו השתבש',
    description: 'אירעה שגיאה בלתי צפויה בעת רינדור עמוד זה.',
    retry: 'נסה שוב',
    home: 'בית',
    criticalTitle: 'שגיאה קריטית',
    criticalDescription: 'הפריסה הראשית נכשלה. זה לא אמור לקרות.',
    reload: 'טען מחדש',
  },
} as const;
