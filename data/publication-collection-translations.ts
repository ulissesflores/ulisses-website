import type { PublicationCategory } from './generated/publications.generated';

export const publicationCollectionTranslations: Record<string, Record<string, { heading: string; description: string }>> = {
  research: {
    en: { heading: "Research: AI, Economics and Complex Systems", description: "Collection of scientific articles focused on cyber-financial resilience, quantitative modeling and artificial intelligence applied to complex systems." },
    es: { heading: "Investigación: IA, Economía y Sistemas Complejos", description: "Colección de artículos científicos enfocados en resiliencia ciberfinanciera, modelado cuantitativo e inteligencia artificial aplicada a sistemas complejos." },
    it: { heading: "Ricerca: IA, Economia e Sistemi Complessi", description: "Collezione di articoli scientifici focalizzati sulla resilienza ciberfinanziaria, modellazione quantitativa e intelligenza artificiale applicata a sistemi complessi." },
    he: { heading: "מחקר: בינה מלאכותית, כלכלה ומערכות מורכבות", description: "אוסף מאמרים מדעיים עם דגש על חוסן סייבר-פיננסי, מידול כמותי ובינה מלאכותית יישומית למערכות מורכבות." }
  },
  whitepapers: {
    en: { heading: "Whitepapers: Applied Engineering and Architecture", description: "Technical whitepapers on systems architecture, IoT hardware, security, privacy and data sovereignty in mission-critical environments." },
    es: { heading: "Whitepapers: Ingeniería Aplicada y Arquitectura", description: "Whitepapers técnicos sobre arquitectura de sistemas, hardware IoT, seguridad, privacidad y soberanía de datos en ambientes de misión crítica." },
    it: { heading: "Whitepapers: Ingegneria Applicata e Architettura", description: "Whitepapers tecnici su architettura dei sistemi, hardware IoT, sicurezza, privacy e sovranità dei dati in ambienti mission-critical." },
    he: { heading: "מסמכים טכניים: הנדסה יישומית וארכיטקטורה", description: "מסמכים טכניים על ארכיטקטורת מערכות, חומרת IoT, אבטחה, פרטיות וריבונות מידע בסביבות קריטיות." }
  },
  essays: {
    en: { heading: "Essays: Theology, Humanities and Historical Criticism", description: "Academic essays with a historical-critical approach in theology, philosophy and foundations of social and economic order." },
    es: { heading: "Ensayos: Teología, Humanidades y Crítica Histórica", description: "Ensayos académicos con enfoque histórico-crítico en teología, filosofía y fundamentos del orden social y económico." },
    it: { heading: "Saggi: Teologia, Umanistica e Critica Storica", description: "Saggi accademici con approccio storico-critico in teologia, filosofia e fondamenti dell'ordine sociale ed economico." },
    he: { heading: "מאמרים: תאולוגיה, מדעי הרוח וביקורת היסטורית", description: "מאמרים אקדמיים עם גישה היסטורית-ביקורתית בתאולוגיה, פילוסופיה ויסודות הסדר החברתי והכלכלי." }
  }
};
