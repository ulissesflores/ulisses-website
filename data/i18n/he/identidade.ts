export const identidade = {
  meta: {
    title: 'זהות ריבונית | רכזת קנונית',
    description: 'רכזת קנונית של זהות ריבונית של Ulisses Flores עם אימותים ציבוריים, תוצרת אקדמית, אוסף תיאולוגי, דומיינים וגרף סמנטי של סמכות.',
    ogTitle: 'זהות ריבונית | רכזת קנונית | Ulisses Flores',
    ogDescription: 'רכזת קנונית של זהות ריבונית של Ulisses Flores עם אימותים ציבוריים, תוצרת אקדמית, אוסף תיאולוגי, דומיינים וגרף סמנטי של סמכות.',
    ogImageAlt: 'Ulisses Flores - רכזת זהות ריבונית'
  },
  header: {
    kicker: 'Ground Truth Identity Node · UPKF v3.3',
    subtitle: 'אודיסאוס · חוקר רב-תחומי · CTO · אדריכל זהות ריבונית',
    statsTemplate: {
      works: 'עבודות',
      certifications: 'הסמכות'
    }
  },
  languageNames: {
    "pt-BR": 'פורטוגזית',
    en: 'אנגלית',
    es: 'ספרדית',
    he: 'עברית',
    it: 'איטלקית'
  },
  hub: {
    title: 'רכזת קנונית',
    description: 'רשת ראשית לאינדוקס במנועי חיפוש ו-LLMs. עמוד זה מפנה לצמתים המרכזיים של האוסף ומקבל קישורים מכל האוספים האסטרטגיים.',
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
        label: 'אוסף תיאולוגי',
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
      title: '01 · זהות ריבונית ואימותים',
      table: {
        identifier: 'מזהה',
        value: 'ערך',
        verification: 'אימות',
        notes: 'הערות'
      }
    },
    domains: {
      title: '02 · דומיינים ריבוניים'
    },
    geoLanguages: {
      title: '03 · נוכחות גאוגרפית ושפות',
      areaLabel: 'תחום פעילות',
      languagesLabel: 'שפות'
    },
    heritage: {
      title: '03½ · מורשת ושושלת',
      privateNote: 'המורשת נשארת פרטית בגרף הציבורי הנוכחי.'
    },
    academic: {
      title: '04 · הוכחה אקדמית ותוצרת מדעית',
      credentialsLabel: 'אישורים אקדמיים',
      occupationsLabel: 'עיסוקים נוכחיים',
      statCards: {
        orcidWorks: 'עבודות ORCID',
        certifications: 'הסמכות',
        domains: 'דומיינים',
        sermons: 'דרשות'
      }
    },
    acervo: {
      title: '04½ · אוסף מדעי ותיאולוגי',
      citableRepos: 'מאגרים ניתנים לציטוט (DOI)',
      featuredPublications: 'פרסומים קנוניים מומלצים',
      theologicalAcervo: 'אוסף תיאולוגי לפי סיווג חדש (5 clusters)',
      sermonsClassified: 'דרשות מסווגות'
    },
    knowledge: {
      title: '05 · תחומי ידע'
    },
    firewall: {
      title: '06 · חומת אש סמנטית',
    },
    organizations: {
      title: '07 · ארגונים ושיוכים'
    }
  },
  faq: {
    sectionTitle: 'שאלות נפוצות על Ulisses Flores'
  }
} as const;
