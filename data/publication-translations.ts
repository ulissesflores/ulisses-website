/**
 * Publication translations overlay — titles and summaries for EN/ES/IT/HE.
 * This file extends the generated publication data with localized content.
 * It is separate from publications.generated.ts because that file is
 * auto-generated and should not be manually modified.
 */

export interface PublicationTranslation {
  en: string;
  es: string;
  it: string;
  he: string;
  summary_en: string;
  summary_es: string;
  summary_it: string;
  summary_he: string;
}

export const publicationTranslations: Record<string, PublicationTranslation> = {
  "2025-little-law-resilience": {
    en: "Little's Law as a Vector for Resilience and Quality",
    es: "La Ley de Little como Vector de Resiliencia y Calidad",
    it: "La Legge di Little come Vettore di Resilienza e Qualità",
    he: "חוק ליטל כווקטור לחוסן ואיכות",
    summary_en: "Study on applying Little's Law to elevate delivery predictability and resilience in Data Science operations. Evidence indicates relevant lead time reduction without material throughput loss, reinforcing WIP limitation efficiency.",
    summary_es: "Estudio sobre la aplicación de la Ley de Little para elevar la previsibilidad de entrega y la resiliencia en operaciones de Data Science. La evidencia indica una reducción relevante del lead time sin pérdida material de throughput.",
    summary_it: "Studio sull'applicazione della Legge di Little per elevare la prevedibilità delle consegne e la resilienza nelle operazioni di Data Science. L'evidenza indica una riduzione rilevante del lead time senza perdita materiale di throughput.",
    summary_he: "מחקר על יישום חוק ליטל להעלאת חיזוי אספקה וחוסן בפעולות מדעי הנתונים. העדויות מצביעות על הפחתה משמעותית בזמן אספקה ללא אובדן מהותי בתפוקה."
  },
  "2025-lstm-asset-prediction": {
    en: "Predictive Analysis of Financial Assets Using LSTM Models",
    es: "Análisis Predictivo de Activos Financieros con Modelos LSTM",
    it: "Analisi Predittiva degli Attivi Finanziari con Modelli LSTM",
    he: "ניתוח חזוי של נכסים פיננסיים עם מודלי LSTM",
    summary_en: "Predictive analysis of financial assets with LSTM networks to capture temporal dynamics in non-stationary markets. The study evidences predictive signal gain in specific windows and improved robustness when training respects temporal order.",
    summary_es: "Análisis predictivo de activos financieros con redes LSTM para capturar dinámica temporal en mercados no estacionarios. El estudio evidencia ganancia de señal predictiva en ventanas específicas y mejora de robustez.",
    summary_it: "Analisi predittiva degli attivi finanziari con reti LSTM per catturare le dinamiche temporali nei mercati non stazionari. Lo studio evidenzia un guadagno di segnale predittivo in finestre specifiche e un miglioramento della robustezza.",
    summary_he: "ניתוח חזוי של נכסים פיננסיים עם רשתות LSTM ללכידת דינמיקה זמנית בשווקים לא סטציונריים. המחקר מעיד על רווח אות חזוי בחלונות ספציפיים ושיפור בחוסן."
  },
  "2025-hybrid-cooling-thermodynamics": {
    en: "Thermodynamic Analysis and Engineering of Hybrid Cooling Systems",
    es: "Análisis Termodinámico e Ingeniería de Sistemas Híbridos de Enfriamiento",
    it: "Analisi Termodinamica e Ingegneria di Sistemi Ibridi di Raffreddamento",
    he: "ניתוח תרמודינמי והנדסת מערכות קירור היברידיות",
    summary_en: "Whitepaper on applied thermodynamics for hybrid cooling system design in critical infrastructure. The hybrid configuration presents better thermal stability during load peaks and lower unavailability risk.",
    summary_es: "Whitepaper de termodinámica aplicada al diseño de sistemas híbridos de enfriamiento para infraestructura crítica. La configuración híbrida presenta mejor estabilidad térmica en picos de carga y menor riesgo de indisponibilidad.",
    summary_it: "Whitepaper di termodinamica applicata alla progettazione di sistemi ibridi di raffreddamento per infrastrutture critiche. La configurazione ibrida presenta una maggiore stabilità termica durante i picchi di carico.",
    summary_he: "מסמך טכני על תרמודינמיקה יישומית לתכנון מערכות קירור היברידיות לתשתיות קריטיות. התצורה ההיברידית מציגה יציבות תרמית טובה יותר בשיאי עומס וסיכון נמוך יותר לחוסר זמינות."
  },
  "2025-iot-data-sovereignty": {
    en: "Cloudless Architectures and Data Sovereignty in IoT",
    es: "Arquitecturas Cloudless y Soberanía de Datos en IoT",
    it: "Architetture Cloudless e Sovranità dei Dati in IoT",
    he: "ארכיטקטורות ללא ענן וריבונות מידע ב-IoT",
    summary_en: "Cloudless architectures for IoT with data sovereignty and local edge processing. The cloudless design reduces external dependency and improves control over confidentiality and local availability.",
    summary_es: "Arquitecturas cloudless para IoT con soberanía de datos y procesamiento local en edge. El diseño cloudless reduce la dependencia externa y mejora el control sobre la confidencialidad y disponibilidad local.",
    summary_it: "Architetture cloudless per IoT con sovranità dei dati ed elaborazione locale in edge. Il design cloudless riduce la dipendenza esterna e migliora il controllo sulla riservatezza e disponibilità locale.",
    summary_he: "ארכיטקטורות ללא ענן עבור IoT עם ריבונות מידע ועיבוד מקומי בקצה. העיצוב ללא ענן מפחית תלות חיצונית ומשפר שליטה על סודיות וזמינות מקומית."
  },
  "2025-fraud-detection-mlp": {
    en: "Credit Card Fraud Detection Using Neural Networks",
    es: "Detección de Fraudes en Tarjetas con Redes Neuronales",
    it: "Rilevamento Frodi con Carte di Credito mediante Reti Neurali",
    he: "זיהוי הונאות בכרטיסי אשראי עם רשתות עצביות",
    summary_en: "Credit card fraud detection with MLP neural networks and feature engineering for imbalanced data. The MLP + threshold adjustment combination improves fraud capture while maintaining an acceptable false positive operational rate.",
    summary_es: "Detección de fraude en tarjetas con redes neuronales MLP e ingeniería de atributos para datos desbalanceados. La combinación de MLP con ajuste de umbral mejora la captura de fraudes manteniendo una tasa operacional aceptable de falsos positivos.",
    summary_it: "Rilevamento delle frodi con carte di credito mediante reti neurali MLP e ingegneria delle feature per dati sbilanciati. La combinazione MLP con regolazione della soglia migliora la cattura delle frodi mantenendo un tasso operativo accettabile di falsi positivi.",
    summary_he: "זיהוי הונאות בכרטיסי אשראי עם רשתות עצביות MLP והנדסת תכונות לנתונים לא מאוזנים. השילוב של MLP עם כיוונון סף משפר את לכידת ההונאות תוך שמירה על שיעור חיובי שגוי מקובל."
  },
  "2024-historicity-jesus-archaeology": {
    en: "Comprehensive Historiographic and Archaeological Analysis: The Historicity of Jesus",
    es: "Análisis Historiográfico y Arqueológico Exhaustivo: La Historicidad de Jesús",
    it: "Analisi Storiografica e Archeologica Esaustiva: La Storicità di Gesù",
    he: "ניתוח היסטוריוגרפי וארכיאולוגי מקיף: ההיסטוריות של ישוע",
    summary_en: "Comprehensive historiographic and archaeological analysis on the historicity of Jesus, integrating textual, epigraphic and material evidence from the first century Mediterranean world.",
    summary_es: "Análisis historiográfico y arqueológico exhaustivo sobre la historicidad de Jesús, integrando evidencia textual, epigráfica y material del mundo mediterráneo del siglo primero.",
    summary_it: "Analisi storiografica e archeologica esaustiva sulla storicità di Gesù, integrando evidenze testuali, epigrafiche e materiali dal mondo mediterraneo del primo secolo.",
    summary_he: "ניתוח היסטוריוגרפי וארכיאולוגי מקיף על ההיסטוריות של ישוע, המשלב עדויות טקסטואליות, אפיגרפיות וחומריות מעולם הים התיכון של המאה הראשונה."
  },
  "2024-bitcoin-praxeology": {
    en: "Bitcoin as a Reserve Asset and Monetary Theory in the Austrian School",
    es: "Bitcoin como Activo de Reserva y la Teoría de la Moneda en la Escuela Austríaca",
    it: "Bitcoin come Attivo di Riserva e la Teoria Monetaria nella Scuola Austriaca",
    he: "ביטקוין כנכס רזרבי ותיאוריית המטבע באסכולה האוסטרית",
    summary_en: "Analysis of Bitcoin as a reserve asset through the lens of Austrian School monetary theory, praxeology and sound money principles in the digital age.",
    summary_es: "Análisis de Bitcoin como activo de reserva a través de la teoría monetaria de la Escuela Austríaca, la praxeología y los principios de dinero sano en la era digital.",
    summary_it: "Analisi di Bitcoin come attivo di riserva attraverso la teoria monetaria della Scuola Austriaca, la prasseologia e i principi della moneta sana nell'era digitale.",
    summary_he: "ניתוח ביטקוין כנכס רזרבי דרך פריזמת התיאוריה המוניטרית של האסכולה האוסטרית, הפרקסיאולוגיה ועקרונות הכסף הבריא בעידן הדיגיטלי."
  },
  "2024-scribal-canonization-ezra": {
    en: "Scribal Canonization: A Historical-Critical Analysis of Canon Formation",
    es: "Canonización Escribal: Análisis Histórico-Crítico de la Formación del Canon",
    it: "Canonizzazione Scribale: Analisi Storico-Critica della Formazione del Canone",
    he: "קנוניזציה סופרית: ניתוח היסטורי-ביקורתי של גיבוש הקנון",
    summary_en: "Historical-critical analysis of scribal canonization and the formation of the biblical canon, examining the role of scribal traditions and textual transmission.",
    summary_es: "Análisis histórico-crítico de la canonización escribal y la formación del canon bíblico, examinando el rol de las tradiciones escribales y la transmisión textual.",
    summary_it: "Analisi storico-critica della canonizzazione scribale e della formazione del canone biblico, esaminando il ruolo delle tradizioni scribali e della trasmissione testuale.",
    summary_he: "ניתוח היסטורי-ביקורתי של הקנוניזציה הסופרית ושל גיבוש הקנון המקראי, בוחן את תפקיד המסורות הסופריות ושידור הטקסט."
  },
  "2024-theology-economic-order": {
    en: "Transcendent Foundations of the Economic Order",
    es: "Fundamentos Trascendentes del Orden Económico",
    it: "Fondamenti Trascendenti dell'Ordine Economico",
    he: "יסודות טרנסצנדנטיים של הסדר הכלכלי",
    summary_en: "Study on the transcendent foundations of economic order, exploring the intersection between theological principles and economic structures across civilizations.",
    summary_es: "Estudio sobre los fundamentos trascendentes del orden económico, explorando la intersección entre principios teológicos y estructuras económicas a través de las civilizaciones.",
    summary_it: "Studio sui fondamenti trascendenti dell'ordine economico, esplorando l'intersezione tra principi teologici e strutture economiche attraverso le civiltà.",
    summary_he: "מחקר על היסודות הטרנסצנדנטיים של הסדר הכלכלי, חוקר את הצומת בין עקרונות תאולוגיים ומבנים כלכליים לאורך הציוויליזציות."
  },
  "2024-ring-signatures-privacy": {
    en: "Implementation of Ring Signatures and Stealth Addresses",
    es: "Implementación de Ring Signatures y Direcciones Furtivas",
    it: "Implementazione di Ring Signatures e Indirizzi Stealth",
    he: "יישום חתימות טבעת וכתובות חמקניות",
    summary_en: "Technical analysis of ring signature implementation and stealth addresses for privacy-preserving transactions in distributed systems.",
    summary_es: "Análisis técnico de la implementación de ring signatures y direcciones furtivas para transacciones con preservación de privacidad en sistemas distribuidos.",
    summary_it: "Analisi tecnica dell'implementazione delle ring signatures e degli indirizzi stealth per transazioni con preservazione della privacy nei sistemi distribuiti.",
    summary_he: "ניתוח טכני של יישום חתימות טבעת וכתובות חמקניות לעסקאות עם שימור פרטיות במערכות מבוזרות."
  },
  "2024-agritech-agile-flow": {
    en: "Agile Transformation and Flow Engineering in Data Science",
    es: "Transformación Ágil e Ingeniería de Flujo en Data Science",
    it: "Trasformazione Agile e Ingegneria del Flusso in Data Science",
    he: "טרנספורמציה אג'ילית והנדסת זרימה במדעי הנתונים",
    summary_en: "Study on agile transformation and flow engineering applied to Data Science teams, optimizing delivery pipelines and operational predictability.",
    summary_es: "Estudio sobre transformación ágil e ingeniería de flujo aplicadas a equipos de Data Science, optimizando pipelines de entrega y previsibilidad operacional.",
    summary_it: "Studio sulla trasformazione agile e l'ingegneria del flusso applicata ai team di Data Science, ottimizzando le pipeline di consegna e la prevedibilità operativa.",
    summary_he: "מחקר על טרנספורמציה אג'ילית והנדסת זרימה המיושמת על צוותי מדעי הנתונים, אופטימיזציה של צינורות אספקה וחיזוי תפעולי."
  },
  "2024-exegetical-treatise-anthropology": {
    en: "Exegetical Treatise on the Representation of Morality and Anthropology",
    es: "Tratado Exegético sobre la Representación de la Moralidad y Antropología",
    it: "Trattato Esegetico sulla Rappresentazione della Moralità e Antropologia",
    he: "מסה אקסגטית על ייצוג המוסר והאנתרופולוגיה",
    summary_en: "Exegetical treatise on the representation of morality and anthropology, examining scriptural foundations of human nature and ethical frameworks.",
    summary_es: "Tratado exegético sobre la representación de la moralidad y antropología, examinando los fundamentos escriturales de la naturaleza humana y los marcos éticos.",
    summary_it: "Trattato esegetico sulla rappresentazione della moralità e antropologia, esaminando i fondamenti scritturali della natura umana e i quadri etici.",
    summary_he: "מסה אקסגטית על ייצוג המוסר והאנתרופולוגיה, בוחנת את היסודות הכתוביים של טבע האדם והמסגרות האתיות."
  },
  "2023-marian-apparitions-critique": {
    en: "The Crown and the Cross: Theological and Phenomenological Analysis of Marian Apparitions",
    es: "La Corona y la Cruz: Análisis Teológico y Fenomenológico de las Apariciones Marianas",
    it: "La Corona e la Croce: Analisi Teologica e Fenomenologica delle Apparizioni Mariane",
    he: "הכתר והצלב: ניתוח תאולוגי ופנומנולוגי של הופעות מריאניות",
    summary_en: "Theological and phenomenological analysis of Marian apparitions, examining historical patterns, ecclesiastical criteria and sociocultural impact.",
    summary_es: "Análisis teológico y fenomenológico de las apariciones marianas, examinando patrones históricos, criterios eclesiásticos e impacto sociocultural.",
    summary_it: "Analisi teologica e fenomenologica delle apparizioni mariane, esaminando modelli storici, criteri ecclesiastici e impatto socioculturale.",
    summary_he: "ניתוח תאולוגי ופנומנולוגי של הופעות מריאניות, בוחן דפוסים היסטוריים, קריטריונים אקלזיאסטיים והשפעה חברתית-תרבותית."
  },
  "2023-digital-legacy": {
    en: "Challenges of Digital Legacy: Post-Mortem Memory Preservation",
    es: "Desafíos de la Herencia Digital: Preservación de la Memoria Post-Mortem",
    it: "Sfide dell'Eredità Digitale: Preservazione della Memoria Post-Mortem",
    he: "אתגרי המורשת הדיגיטלית: שימור זיכרון לאחר המוות",
    summary_en: "Analysis of digital legacy challenges and post-mortem memory preservation strategies in the age of cloud computing and social media.",
    summary_es: "Análisis de los desafíos de la herencia digital y estrategias de preservación de memoria post-mortem en la era de la computación en nube y las redes sociales.",
    summary_it: "Analisi delle sfide dell'eredità digitale e strategie di preservazione della memoria post-mortem nell'era del cloud computing e dei social media.",
    summary_he: "ניתוח אתגרי המורשת הדיגיטלית ואסטרטגיות שימור זיכרון לאחר המוות בעידן מחשוב הענן והמדיה החברתית."
  },
  "2023-holy-club-methodism": {
    en: "The Holy Club: Spiritual, Theological and Visual Archaeology of Methodism",
    es: "El Club Santo: Arqueología Espiritual, Teológica y Visual del Metodismo",
    it: "Il Club Santo: Archeologia Spirituale, Teologica e Visuale del Metodismo",
    he: "המועדון הקדוש: ארכיאולוגיה רוחנית, תאולוגית וחזותית של המתודיזם",
    summary_en: "Spiritual, theological and visual archaeology of the Holy Club and the origins of Methodism, examining John Wesley's transformative movement.",
    summary_es: "Arqueología espiritual, teológica y visual del Club Santo y los orígenes del metodismo, examinando el movimiento transformador de John Wesley.",
    summary_it: "Archeologia spirituale, teologica e visuale del Club Santo e le origini del metodismo, esaminando il movimento trasformativo di John Wesley.",
    summary_he: "ארכיאולוגיה רוחנית, תאולוגית וחזותית של המועדון הקדוש ומקורות המתודיזם, בוחנת את התנועה המהפכנית של ג'ון ווסלי."
  },
  "2022-theology-of-hope": {
    en: "The Theology of Hope in Times of Crisis",
    es: "La Teología de la Esperanza en Tiempos de Crisis",
    it: "La Teologia della Speranza in Tempi di Crisi",
    he: "תאולוגיית התקווה בעתות משבר",
    summary_en: "Theological reflection on hope in times of crisis, examining eschatological foundations and their practical implications for contemporary faith communities.",
    summary_es: "Reflexión teológica sobre la esperanza en tiempos de crisis, examinando los fundamentos escatológicos y sus implicaciones prácticas para las comunidades de fe contemporáneas.",
    summary_it: "Riflessione teologica sulla speranza in tempi di crisi, esaminando i fondamenti escatologici e le loro implicazioni pratiche per le comunità di fede contemporanee.",
    summary_he: "הגות תאולוגית על תקווה בעתות משבר, בוחנת יסודות אסכטולוגיים והשלכותיהם המעשיות על קהילות אמונה עכשוויות."
  },
  "2020-robotics-education": {
    en: "Active Methodologies in Teaching Programming Logic",
    es: "Metodologías Activas en la Enseñanza de Lógica de Programación",
    it: "Metodologie Attive nell'Insegnamento della Logica di Programmazione",
    he: "מתודולוגיות פעילות בהוראת לוגיקה של תכנות",
    summary_en: "Study on active methodologies in teaching programming logic using robotics, gamification and project-based learning approaches.",
    summary_es: "Estudio sobre metodologías activas en la enseñanza de lógica de programación utilizando robótica, gamificación y aprendizajes basados en proyectos.",
    summary_it: "Studio sulle metodologie attive nell'insegnamento della logica di programmazione utilizzando robotica, gamificazione e apprendimento basato su progetti.",
    summary_he: "מחקר על מתודולוגיות פעילות בהוראת לוגיקה של תכנות באמצעות רובוטיקה, גיימיפיקציה וגישות למידה מבוססות פרויקטים."
  },
  "2017-chaos-theory-economics": {
    en: "Chaos Theory: Emergence and Self-Organization in Markets",
    es: "Teoría del Caos: Emergencia y Autoorganización en Mercados",
    it: "Teoria del Caos: Emergenza e Auto-organizzazione nei Mercati",
    he: "תורת הכאוס: צמיחה והתארגנות עצמית בשווקים",
    summary_en: "Analysis of chaos theory applied to economic systems, exploring emergence, self-organization and non-linear dynamics in financial markets.",
    summary_es: "Análisis de la teoría del caos aplicada a sistemas económicos, explorando emergencia, autoorganización y dinámica no lineal en mercados financieros.",
    summary_it: "Analisi della teoria del caos applicata ai sistemi economici, esplorando emergenza, auto-organizzazione e dinamiche non lineari nei mercati finanziari.",
    summary_he: "ניתוח תורת הכאוס המיושמת על מערכות כלכליות, חוקר צמיחה, התארגנות עצמית ודינמיקה לא-לינארית בשווקים פיננסיים."
  }
};
