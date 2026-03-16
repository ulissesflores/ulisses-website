import { localePath } from '@/lib/locale-path';
import type { Locale } from '@/data/i18n';

interface PsiWhitepaperBodyProps {
  locale: Locale;
  /** Include the large architectural diagrams (used in the whitepaper page, not in the simulation) */
  includeFigures?: boolean;
}

export function PsiWhitepaperBody({ locale, includeFigures = false }: PsiWhitepaperBodyProps) {
  return (
    <>
          {/* ─── Table of Contents ─── */}
          <nav className='rounded-xl border border-cyan-900/40 bg-neutral-900/60 p-6 mb-14'>
            <p className='text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold mb-4'>
              תוכן העניינים של המסמך הלבן
            </p>
            <ol className='space-y-2 text-sm'>
              {[
                { n: '1', t: 'מבוא: קריסת האמון המוסדי ומודל האיום' },
                { n: '2', t: 'ארכיטקטורה פיזית (הכלי)' },
                { n: '2.1', t: 'סגסוגות נחושת-טונגסטן (Cu-W) והפחתת פולסים אלקטרומגנטיים (EMP)' },
                { n: '2.2', t: 'בידוד מפני התקפות ערוץ צדדי (SCA)' },
                { n: '2.3', t: 'ארכיטקטורת בידוד רדיקלי (מנותקת אוויר)' },
                { n: '3', t: 'ליבת ההצפנה (קריסת פונקציית הגל)' },
                { n: '3.1', t: 'פונקציות פיזיות בלתי ניתנות לשכפול (SRAM PUF)' },
                { n: '3.2', t: 'תקן XMSS פוסט-קוונטי (NIST SP 800-208)' },
                { n: '3.3', t: 'אנטרופיה היברידית: סגירת המעגל' },
                { n: '4', t: 'היוריסטיקות הגנה אקטיביות (קלט פנטום ומשרתת רעה)' },
                { n: '4.1', t: 'ביומטריה התנהגותית וזיהוי כפייה' },
                { n: '4.2', t: 'הצפנה ניתנת להכחשה (Deniable Encryption)' },
                { n: '4.3', t: 'אימות קריפטוגרפי נגד משרתת רעה' },
                { n: '5', t: 'יתירות ברמה אווירית: TMR ו-LEO' },
                { n: '5.1', t: 'האיום הרדיואקטיבי המסלולי (SEU, SEL, TID)' },
                { n: '5.2', t: 'תקן Rad-Hard ו-FRAM פרואלקטרית' },
                { n: '5.3', t: 'יתירות מודולרית משולשת (TMR)' },
                { n: '6', t: 'מסקנה' },
              ].map((item) => (
                <li key={item.n}>
                  <a href={`#section-${item.n.replace('.', '-')}`} className='text-cyan-300 hover:text-cyan-100 transition-colors'>
                    <span className='inline-block w-10 text-neutral-500 font-mono text-xs'>{item.n}</span>
                    {item.t}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* ─── Prose content ───
               1=Respiro parágrafos  2=H2 capítulos  3=H3+listas  4=Links  5=Auxiliares */}
          <div className='prose prose-invert max-w-none lg:prose-lg prose-p:mb-8 prose-p:leading-[1.8] prose-p:text-neutral-300 prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:text-neutral-100 prose-h2:mt-24 prose-h2:mb-10 prose-h2:border-b prose-h2:border-neutral-800 prose-h2:pb-4 prose-h3:text-2xl prose-h3:mt-14 prose-h3:mb-6 prose-h3:text-cyan-400 prose-li:mb-3 prose-ul:my-8 prose-ol:my-8 prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-a:decoration-cyan-900 prose-a:underline-offset-4 prose-strong:text-white prose-blockquote:border-cyan-700 prose-blockquote:bg-neutral-900/40 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-table:border-neutral-700 prose-th:text-neutral-200 prose-th:border-neutral-700 prose-th:bg-neutral-900/60 prose-td:text-neutral-400 prose-td:border-neutral-800'>

            {/* ═════════ Section 1 ═════════ */}
            <h2 id='section-1'>1. מבוא: קריסת האמון המוסדי ומודל האיום</h2>

            <p>
              המעבר של הכלכלה הגלובלית לתשתיות מבוזרות המבוססות על קריפטוגרפיה אסימטרית העביר את נטל האבטחה ישירות אל הפרט. היסטורית, הגנה על נכסים פיננסיים הסתמכה על מוסדות נאמנות, כגון בנקים מרכזיים ושומרי פיקדונות מפוקחים, שפעלו תחת הגנת המדינה. עם זאת, הביזור הציג פגיעות פרדוקסלית: בעל המפתח הפרטי הופך ל<strong>נקודת כשל יחידה (single point of failure)</strong>.
            </p>

            <p>
              ארנקי חומרה קונבנציונליים תוכננו תחת מערכת הנחות שבירות מטבען. הם מניחים שסביבת ההפעלה שפירה, ששלמות שרשרת האספקה של המיקרו-שבבים נשמרת, שתהליכי הייצור נקיים מ<em>סוסים טרויאניים בחומרה</em> ו, ובעיקר, שהמשתמש מפעיל את המכשיר במצב רגוע וללא איומים פיזיים או כפייה.
            </p>

            <p>
              <strong>פרויקט Ψ (PSI)</strong> נובע מדחייה מוחלטת של הנחות אלו, ומתבסס על הפרדיגמה ההפוכה לחלוטין של <strong>&ldquo;אמון אפס בסיליקון&rdquo;</strong> (Zero Trust in Silicon). תחת אונטולוגיה חדשה זו, הארכיטקטורה מניחה באופן טבעי שהסביבה עוינת באופן בלתי משתנה, שהיצרן המקורי עשוי להכיל וקטורים זדוניים, שקני התקשורת מנוטרים באופן פעיל, ושהמשתמש עצמו עשוי להיות תחת איום נשק.
            </p>

            <p>
              כאשר האמון בכל השכבות האנושיות, התאגידיות והמוסדיות מבוטל באופן שיטתי, האבטחה חייבת להיות מעוגנת אך ורק בקור הבלתי ניתן להפרה של <strong>חוקי פיזיקת החומרים</strong>, <strong>תרמודינמיקה</strong> ו<strong>מתמטיקה קריפטוגרפית מתקדמת</strong>. מודל האיום המטופל על ידי ארכיטקטורת PSI חורג מהתחום האזרחי ונכנס לקפדנות של סטנדרטים צבאיים וחלל (<strong>C4ISR</strong>).
            </p>

            <p>
              הופעת פלישות לבתים שמטרתן סחיטה אלימה של נכסים קריפטוגרפיים — המכונות באופן עממי <em>התקפות &ldquo;מפתח ברגים בחמישה דולר&rdquo;</em> — הפכה את התקפות התוכנה הזדונית המתוחכמות מרחוק לשניות סטטיסטית. אם תוקף יכול פשוט לענות את הבעלים כדי להשיג את קוד הגישה, ההתנגדות הלוגית של המכשיר הופכת ללא רלוונטית. האבטחה, אם כן, צריכה להיות <strong>מומרת מדיסציפלינה אלקטרונית גרידא למדע פסיכולוגי, ביומכני ומבני</strong>.
            </p>

            {/* ═════════ Section 2 ═════════ */}
            <h2 id='section-2'>2. ארכיטקטורה פיזית (הכלי)</h2>

            <p>
              קו ההגנה הראשון של כל מערכת קריפטוגרפית אינו טמון באלגוריתם המתמטי, אלא ב<strong>גבול הפיזי</strong> המפריד בין הלוגיקה החישובית לבין היריב. &ldquo;הכלי&rdquo; של פרויקט PSI מייצג התכנסות קיצונית של הנדסת חומרים ופיזיקת מצב מוצק, המכוונת לנטרול מוחלט של חדירות מכניות, התקפות אלקטרומגנטיות בעוצמה גבוהה וטכניקות ריגול פולשניות המבוססות על אמנציה.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-arquitetura-hardware-camadas-defesa.webp'
                alt='דיאגרמה איזומטרית במבט מפורק המפרטת את ארבע שכבות ההגנה הפיזית של חומרת ההצפנה של פרויקט PSI: מיגון חיצוני מנחושת-טונגסטן, ציפוי שרף אפוקסי, רשת אבטחה פעילה (Tamper Mesh) בצבע ציאן, וליבה לוגית מסיליקון.'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>איור 1:</strong> שכבות הגנה פיזית ולוגית של כלי ה-PSI (Cu-W → אפוקסי → Tamper Mesh → סיליקון).
              </figcaption>
            </figure>

            <h3 id='section-2-1'>2.1 סגסוגות נחושת-טונגסטן (Cu-W) והפחתת פולסים אלקטרומגנטיים (EMP)</h3>

            <p>
              פולס אלקטרומגנטי (EMP), בין אם ממקור של פיצוץ גרעיני בגובה רב (NEMP) או מנשקי הפרעה אלקטרומגנטית מכוונת (IEMI), יוצר זרמים מושרים הרסניים המשמידים מעגלים אלקטרוניים באמצעות מתחי יתר. כדי להגן על ליבת ההצפנה, שלדת ה-PSI נוטשת את האלומיניום והפלסטיק המסורתיים לטובת <strong>סגסוגת מטריצה מרוכבת של נחושת-טונגסטן (Cu-W)</strong>.
            </p>

            <p>
              ל<strong>טונגסטן (W)</strong> צפיפות גבוהה במיוחד (~19.3 גרם/סמ"ק) ונקודת ההיתוך הגבוהה ביותר מבין כל המתכות הטהורות (3422°C). תכונות אלו מעניקות למכשיר אינרציה קינטית ותרמית אדירה, בנוסף לתפקוד כמגן טבעי מפני קרינה מייננת באנרגיה גבוהה. עם זאת, טונגסטן טהור חסר את המוליכות החשמלית האופטימלית ליצירת כלוב פאראדיי מושלם — ובנקודה זו <strong>נחושת (Cu)</strong>, עם מוליכותה הגבוהה במיוחד, משלימה את הפער.
            </p>

            <p>
              מערכת W-Cu מציגה <strong>אי-התמזגות מוחלטת</strong> הן במצב מוצק והן במצב נוזלי. כתוצאה מכך, השלדה מיוצרת בשיטות מתקדמות של <strong>מטלורגיית אבקות</strong>: שלד נקבובי של טונגסטן נדחס ומסונטר תחילה בטמפרטורות גבוהות, ולאחר מכן מוחדרת אליו נחושת נוזלית מותכת באמצעות פעולה קפילרית. החומר המרוכב המתקבל (70-80% W / 20-30% Cu) מפגין התנהגות סינרגטית יוצאת דופן.
            </p>

            <p>
              היעילות מכומתת על ידי <strong>יעילות מיגון (SE)</strong>, הנמדדת בדציבלים:
            </p>

            <div className='not-prose overflow-x-auto my-14'>
              <figure className='p-8 bg-neutral-900/40 rounded-3xl border border-neutral-800 shadow-2xl flex flex-col items-center'>
                <div className='font-serif text-3xl md:text-5xl text-neutral-100 mb-6 tracking-widest text-center'>
                  SE = 10 · log₁₀(P<sub className='text-2xl'>i</sub> / P<sub className='text-2xl'>t</sub>)
                </div>
                <figcaption className='w-full max-w-md border-t border-neutral-800 pt-4 text-sm text-neutral-400 text-center font-mono'>
                  <p>יעילות מיגון (<strong className='text-cyan-400'>SE<sub>total</sub></strong>) = R + A + B</p>
                </figcaption>
              </figure>
            </div>

            {/* ── Callout: Descoberta Chave — Blindagem ── */}
            <aside className='not-prose my-10 border-l-4 border-cyan-500 bg-cyan-950/20 p-6 rounded-r-xl'>
              <h4 className='text-cyan-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2'>
                💡 תגלית מפתח (TL;DR)
              </h4>
              <p className='text-neutral-200 m-0 leading-relaxed'>
                יישום ארכיטקטורת המיגון Cu-W של פרויקט PSI הביא ל<strong className='text-white'>יעילות מיגון העולה על 100 dB</strong>, ובכך עולה על התקנים הצבאיים המחמירים MIL-STD-285. החומר המרוכב 70-80% W / 20-30% Cu משלב את האינרציה הקינטית של הטונגסטן עם מוליכות הנחושת בכלוב פאראדיי ברמה גרעינית.
              </p>
            </aside>

            <p>
              ההנחתה הכוללת נובעת מסיכום של שלושה מנגנונים: <strong>אובדן כתוצאה מהחזרה (R)</strong>,
              <strong> אובדן כתוצאה מבליעה פנימית (A)</strong> ו<strong>תיקון כתוצאה מהחזרות מרובות (B)</strong>.
              מבנים צפופים המשלבים נחושת מבטיחים באופן עקבי SE {'>'}100 dB, ועולים על התקנים הצבאיים המחמירים (MIL-STD-285).
            </p>

            {/* Table: Shielding Comparison */}
            <div className='not-prose overflow-x-auto my-12 border border-neutral-800 rounded-xl shadow-lg'>
              <table className='w-full text-start text-sm text-neutral-300'>
                <caption className='p-4 bg-neutral-900/80 text-start text-cyan-400 font-mono uppercase tracking-widest font-bold border-b border-neutral-800 text-xs'>
                  טבלה 1: פרמטרים של מיגון אלקטרומגנטי (Cu-W)
                </caption>
                <thead>
                  <tr className='bg-neutral-900/80 text-neutral-200'>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>חומר</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>מוליכות</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>SE (RF)</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>יתרון מבני</th>
                  </tr>
                </thead>
                <tbody className='text-neutral-400'>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>פלדה מגולוונת</td>
                    <td className='px-4 py-3'>נמוכה</td>
                    <td className='px-4 py-3'>~90 dB</td>
                    <td className='px-4 py-3'>חדירות מגנטית גבוהה</td>
                  </tr>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>נחושת טהורה (Cu)</td>
                    <td className='px-4 py-3'>גבוהה מאוד (100% IACS)</td>
                    <td className='px-4 py-3'>{'>'}100 dB</td>
                    <td className='px-4 py-3'>החזרת פולס EMP מקסימלית</td>
                  </tr>
                  <tr className='bg-cyan-950/20'>
                    <td className='px-4 py-3 text-cyan-300 font-semibold'>סגסוגת Cu-W (PSI)</td>
                    <td className='px-4 py-3 text-cyan-300'>גבוהה (40-50% IACS)</td>
                    <td className='px-4 py-3 text-cyan-300'>{'>'}100 dB</td>
                    <td className='px-4 py-3 text-cyan-300'>מיגון RF + גמא; קשיחות קיצונית</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 id='section-2-2'>2.2 בידוד אקוסטי, תרמי וכימי מפני התקפות ערוץ צדדי (SCA)</h3>

            <p>
              ביצוע אלגוריתמים קריפטוגרפיים משנה את מצבם של מיליוני טרנזיסטורים מיליארדי פעמים בשנייה. תנודות לוגיות אלו צורכות זרמים משתנים הנפלטים לסביבה בצורת <strong>חום</strong>, <strong>קרינה אלקטרומגנטית שיורית</strong> ו<strong>רעש אקוסטי</strong>. תוקפים מצוידים היטב משתמשים בפליטות אלו כדי להסיק את חומר המפתח הסודי — דיסציפלינה המכונה <strong>התקפות ערוץ צדדי (SCA)</strong>.
            </p>

            <p>
              <strong>התקפות אקוסטיות (ASCA):</strong> קבלים קרמיים רב-שכבתיים (MLCC) וסלילים מציגים אפקטים פיאזואלקטריים ואלקטרוסטריקטיביים. תנודות מתח במהלך פעולות קריפטוגרפיות גורמות לעיוותים מיקרוסקופיים, המשרים גלי קול ואולטרסאונד הניתנים ליירוט על ידי מיקרופונים כיווניים.
            </p>

            <p>
              <strong>התקפות תרמיות (TSCA):</strong> מצלמות תרמיות לוכדות שינויים בפרופילי החום של פני השטח של השבב, וממפות את האסימטריה כאשר בלוקים לוגיים שונים מפעילים מפתחות עם ביטים שונים.
            </p>

            <p>
              כדי למתן את שני הווקטורים, ה-PSI <strong>מצפה לחלוטין את חומרת ההצפנה</strong> בשרף אפוקסי תרמוסטי המוחדר עם מיקרו-כדורי זכוכית וגרגרי מטריצה קרמית (<em>potting</em>):
            </p>

            <ol>
              <li>
                <strong>שיכוך אקוסטי ויסקואלסטי:</strong> אי-התאמת העכבה האקוסטית בין הרכיבים הפיאזואלקטריים לבין השרף הצפוף מאלצת את גלי הקול לעבור הנחתה דרסטית — המומרים לחום בעל משרעת נמוכה ביותר.
              </li>
              <li>
                <strong>שיטוח מפל הטמפרטורה:</strong> המוליכות התרמית הנמוכה בכוונה של האפוקסי פועלת כמסנן מעביר נמוכים תרמי. האינרציה סופגת ומיישרת את עליות החום החולפות, ומשטחת את עקומות החתימה התרמית.
              </li>
              <li>
                <strong>הגנה כימית סימביוטית:</strong> בתוך מטריצת האפוקסי, שזורה רשת מורכבת של חוטים דקים (<em>tamper mesh</em>) המופעלת באופן אקטיבי. הכימיה של שכבת הבידוד מתוכננת להיות זהה לזו של השרף המוקשה — ממיסים הממיסים את השרף משמידים בו-זמנית את הרשת, ומפעילים <strong>איפוס מיידי</strong> של המפתחות לפני שהפולש מגיע ליעד.
              </li>
            </ol>

            <h3 id='section-2-3'>2.3 ארכיטקטורת בידוד רדיקלי (מנותקת אוויר)</h3>

            <p>
              טופולוגיית ה-PSI דורשת <strong>ארכיטקטורת ממשק אפס ובידוד רדיקלי</strong>. המכשיר מבטל לחלוטין יציאות USB, אינו מציג מסכים אינטראקטיביים וחסר מתגים מכניים מסורתיים. אספקת החשמל והעברת נתונים מוצפנים מובנית בקפדנות מתרחשות אך ורק באמצעות <strong>פיני פוגו מגנטיים מוצפנים</strong> בעלי פנים שטוחות. על ידי עקירה פיזית של יציאות הקלט/פלט הקונבנציונליות, ה-PSI מבטל את משטח המגע להתקפות לוגיות נפוצות (BadUSB, הזרקת קושחה, fuzzing).
            </p>

            {/* ═════════ Section 3 ═════════ */}
            <h2 id='section-3'>3. ליבת ההצפנה (קריסת פונקציית הגל)</h2>

            <p>
              בהשראת מכניקת הקוונטים, הרעיון של <strong>&ldquo;קריסת פונקציית הגל&rdquo;</strong> של המפתח הפרטי קובע שהמפתח קיים בזיכרון נדיף רק באלפית השנייה המדויקת שבה מתבקשת חתימה דיגיטלית. בארנקים מדור קודם וב-HSMs מסחריים, מפתח המאסטר בן 256 הביטים מאוחסן באופן קבוע בזיכרון לא נדיף (Flash EEPROM). תחת המודל העוין של PSI, כל נתון הנשמר באופן סטטי פגיע — מדינה יכולה להשתמש במיקרוסקופיית אלקטרונים סורקת (SEM) או בקרני יונים ממוקדות (FIB) כדי לחלץ את המפתח.
            </p>

            <p>
              תגובת ה-PSI דרסטית: <strong>המפתח הפרטי אינו מאוחסן במכשיר בשום שלב</strong>.
            </p>

            <h3 id='section-3-1'>3.1 פונקציות פיזיות בלתי ניתנות לשכפול מבוססות SRAM (SRAM PUF)</h3>

            <p>
              כאשר המכשיר במצב מנוחה (מנותק חשמל), ליבת הזיכרון היא <strong>ריק מוחלט של מידע</strong>. תאי זיכרון SRAM סטנדרטיים מורכבים מ-latches ביסטביליים מצולבים (טופולוגיית 6T). בהפעלה, הטרנזיסטורים מתחרים למשוך את המצב הלוגי ל-'0' או '1'. עקב <strong>תנודות אקראיות של חומרים מסממים (RDF)</strong> ואי-סדירויות ברמה ננומטרית בתהליכי הליטוגרפיה, כל תא מציג אי-התאמות פיזיות במתחי הסף שלו (V<sub>th</sub>).
            </p>

            <p>
              אסימטריה אטומית זו פירושה שכל תא קורס באופן צפוי לאותו מצב התחלתי. על ידי סריקת אלפי תאים כאלה, מופקת שרשרת בינארית בעלת אנטרופיה גבוהה — <strong>טביעת האצבע הבלתי ניתנת לערעור של אותו סיליקון</strong>, בלתי אפשרית לשכפול, לחיזוי או להעתקה.
            </p>

            <p>
              איכות ההצפנה מודלת על ידי <strong>Decidability (d&apos;)</strong>, המשווה את ההתפלגויות הנורמליות של מרחק המינג חלקי (FHD) בין קריאות בתוך המכשיר (רעש תרמי) ובין מכשירים (אקראיות בין שבבים שונים).
            </p>

            <p>
              כדי להפוך את המצב הפיזי הרועש לזרע קריפטוגרפי בדיוק של 100%, משתמשים ב<strong>Fuzzy Extractors</strong> (מחלצים מטושטשים) — מודולי &ldquo;Secure Sketch&rdquo; המשלבים את התגובה הרועשת של ה-SRAM עם &ldquo;Helper Data&rdquo; ואלגוריתמים לתיקון שגיאות (BCH או פולריים). לאחר החתימה, אספקת החשמל ל-SRAM נמחקת, המטענים מתפזרים ו<strong>המפתח חדל מלהתקיים</strong>.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-ciclo-vida-chave-criptografica-sram-puf.webp'
                alt='תרשים זרימה לוגי של מחזור החיים של המפתח הפרטי בפרויקט PSI באמצעות SRAM PUF. הזרימה ממירה רעש פיזי מסיליקון לאנטרופיה טהורה, מעבדת אותו באמצעות Fuzzy Extractor ליצירת הזרע (קריסטל מובנה), ומסתיימת באיפוס מיידי ובהתפרקות דיגיטלית.'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>איור 2:</strong> זרימת גזירת מפתח ארעי באמצעות SRAM PUF (הפעלה → RDF → Fuzzy Extractor → זרע → איפוס).
              </figcaption>
            </figure>

            <h3 id='section-3-2'>3.2 תקן XMSS פוסט-קוונטי (NIST SP 800-208)</h3>

            <p>
              אם ייבנה מחשב קוונטי עם קיוביטים לוגיים יציבים, <strong>אלגוריתם שור</strong> יהרוס את כל התשתית המבוססת על עקומות אליפטיות (ECDSA, EdDSA). בהכנה ל&ldquo;יום ה-Q&rdquo;, ה-PSI משלב את <strong>eXtended Merkle Signature Scheme (XMSS)</strong>, שתוקנן על ידי NIST (SP 800-208) ו-RFC 8391.
            </p>

            <p>
              ה-XMSS אינו תלוי בפירוק לגורמים ראשוניים או במיפויים אלגבריים. אבטחתו נשענת על <strong>חוסר היכולת החישובית ליצור התנגשויות בפונקציות גיבוב</strong> (SHA-256, SHAKE256) — הנחה שהוכחה על ידי עשרות שנים של קריפטואנליזה ובלתי ניתנת לצמצום נגד אלגוריתמי גרובר.
            </p>

            <p>
              המורכבות טמונה באופיו ה<em>מצבי (stateful)</em>: ה-XMSS בונה עץ מרקל שבו כל צומת עלה נושא חומר עבור <strong>חתימת וינטרניץ יחידה (WOTS+)</strong>. כל מפתח OTS <strong>יכול לחתום על הודעה אחת בלבד במהלך חיי המערכת</strong>. שימוש חוזר במצב גורם לקריסה קטסטרופלית של האבטחה.
            </p>

            <blockquote>
              <p>
                &ldquo;המלצה זו דורשת שייצור מפתחות וחתימות יבוצע אך ורק במודולי חומרה קריפטוגרפיים ייעודיים שאינם מאפשרים ייצוא של חומר מפתח סודי.&rdquo; — <strong>NIST SP 800-208</strong>
              </p>
            </blockquote>

            <p>
              המיקרו-בקר של ה-PSI מנהל את מצביע ה-XMSS כולו בתוך מחסומי האפוקסי מסיליקון, ומונע כל ייצוא של מפתחות שורש דרך אפיקים חיצוניים.
            </p>

            <h3 id='section-3-3'>3.3 אנטרופיה היברידית: סגירת המעגל</h3>

            <p>
              זרע המאסטר המזין את עלי ה-WOTS+ דורש <strong>&ldquo;אנטרופיה היברידית יתירה&rdquo;</strong>:
            </p>

            <ol>
              <li>
                <strong>אנטרופיה דינמית פנימית:</strong> מופקת מ-SRAM PUF — מקושרת באופן בלעדי לחומרה הפיזית.
              </li>
              <li>
                <strong>אנטרופיה סטטית חיצונית:</strong> מסופקת על ידי האדם באמצעות כרטיס חכם NFC בקירוב זמני בשילוב עם ביומטריה של בעל הכרטיס החי.
              </li>
            </ol>

            <p>
              <strong>פונקציית גזירת מפתחות (KDF)</strong> מבוססת גיבוב סופגת את האקראיות של המיקרו-שבב המשולבת עם האישורים האורגניים. קשר גורדי אלגוריתמי זה מגן על המשמורת בשני הקצוות: המכשיר שנגנב חסר תועלת (אנטרופיה אנושית חסרה); האדם שנחטף ללא השבב חסר אונים באותה מידה (חלק סטוכסטי של הסיליקון אבד).
            </p>

            {/* ═════════ Section 4 ═════════ */}
            <h2 id='section-4'>4. היוריסטיקות הגנה אקטיביות (קלט פנטום ומשרתת רעה)</h2>

            <p>
              אבטחת סייבר-פיזית קורסת באופן בלתי נמנע מול <strong>כפייה קינטית ישירה</strong>. אם בעל המפתח הלגיטימי יעונה כדי למסור סיסמאות, כוחו של וקטור הסחיטה ידכא את כל ההצפנות. החידוש המהפכני של ה-PSI טמון בהעברת אבטחת הסיליקון לתחום ה<strong>נוירופסיכולוגיה והביומטריה הפעילה</strong>.
            </p>

            <h3 id='section-4-1'>4.1 ביומטריה התנהגותית וזיהוי פיזיולוגי של כפייה</h3>

            <p>
              מול עינויים, החלק הסימפתטי של מערכת העצבים האוטונומית מזרז את תגובת &ldquo;הילחם או ברח&rdquo;, וכתוצאה מכך מפל של קטכולאמינים וקורטיזול. ה-PSI משלב חיישנים הממפים באופן רציף <strong>ביומטריה התנהגותית</strong>:
            </p>

            <ol>
              <li>
                <strong>דינמיקת לחיצה ולחץ:</strong> חיישנים מגנטו-אלסטיים ומדדי מאמץ עוקבים אחר שינויים בלחץ (~0.25 kPa), זמן טיסה וזמן החזקה. תחת לחץ, האחיזה מתקשחת, הדינמיקה הופכת אכזרית ובלתי סדירה.
              </li>
              <li>
                <strong>מיקרו-רעידות נוירומוסקולריות:</strong> מדי תאוצה וגירוסקופים תלת-ציריים (IMU) מכמתים את הרעידות המילימטריות. הרעד הפיזיולוגי (8-12 הרץ) משתנה באלימות במהלך כפייה — משרעת מוגברת, תדרי הרפיה מדוכאים.
              </li>
              <li>
                <strong>קצב לב ו-PPG:</strong> פוטופלטיסמוגרפים וחיישני ביו-עכבה מודדים התכווצות כלי דם היקפית, טכיקרדיה והפחתה בשונות קצב הלב (HRV) — ביו-מרקר של מתח הניתן לזיהוי על ידי רשתות עצביות.
              </li>
            </ol>

            <p>
              נתונים אלו זורמים למודולי <strong>בינה מלאכותית בקצה (Edge AI)</strong> — רשתות קפסולות (CapsNets) ו-Random Forest עבור סדרות זמן פיזיולוגיות, עם ציוני F1 בין <strong>96.97% ל-99.82%</strong> במערכי נתונים קליניים של מתח.
            </p>

            {/* Table: Biometrics */}
            <div className='not-prose overflow-x-auto my-12 border border-neutral-800 rounded-xl shadow-lg'>
              <table className='w-full text-start text-sm text-neutral-300'>
                <caption className='p-4 bg-neutral-900/80 text-start text-cyan-400 font-mono uppercase tracking-widest font-bold border-b border-neutral-800 text-xs'>
                  טבלה 2: ביו-מרקרים לזיהוי פיזיולוגי של כפייה
                </caption>
                <thead>
                  <tr className='bg-neutral-900/80 text-neutral-200'>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>ביו-מרקר</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>חומרה</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>דפוס תחת כפייה</th>
                  </tr>
                </thead>
                <tbody className='text-neutral-400'>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>כוח ודינמיקת מגע</td>
                    <td className='px-4 py-3'>חיישנים מגנטו-אלסטיים + מדדי מאמץ</td>
                    <td className='px-4 py-3'>השהיה בלתי סדירה; שיאי לחץ; קשיחות אחיזה</td>
                  </tr>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>רעד שרירים</td>
                    <td className='px-4 py-3'>IMU (מדי תאוצה/גירוסקופים)</td>
                    <td className='px-4 py-3'>הפרעה בתדר 8-12 הרץ; עוויתות בעלות שונות גבוהה</td>
                  </tr>
                  <tr>
                    <td className='px-4 py-3'>אותות קרדיווסקולריים</td>
                    <td className='px-4 py-3'>ביו-עכבה / אופטיים / PPG</td>
                    <td className='px-4 py-3'>התכווצות כלי דם; ירידה ב-HRV; טכיקרדיה</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Callout: Descoberta Chave — Biometria ── */}
            <aside className='not-prose my-10 border-l-4 border-cyan-500 bg-cyan-950/20 p-6 rounded-r-xl'>
              <h4 className='text-cyan-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2'>
                💡 תגלית מפתח (TL;DR)
              </h4>
              <p className='text-neutral-200 m-0 leading-relaxed'>
                מודולי הבינה המלאכותית בקצה (CapsNets + Random Forest) השיגו <strong className='text-white'>ציוני F1 בין 96.97% ל-99.82%</strong> בזיהוי מתח פיזיולוגי במערכי נתונים קליניים — מה שמאפשר למכשיר להבחין בין פעולה לגיטימית לפעולה תחת כפייה בזמן אמת, ללא תלות בשרתים חיצוניים.
              </p>
            </aside>

            <h3 id='section-4-2'>4.2 הצפנה ניתנת להכחשה (Deniable Encryption — פרוטוקול קלט פנטום)</h3>

            <p>
              כאשר אפיקי העצבים-שרירים מזהים באופן חיובי את דגל הכפייה, ה-PSI בוחר בדרך לא אינטואיטיבית: <strong>הוא אינו חוסם את הפעולות</strong>. במערכות אקולוגיות נורמטיביות, נעילה הייתה גורמת להשמדה פיזית של הנושא על ידי חוטפים חסרי רחמים. המכשיר מניח את <strong>שימור השלמות הביולוגית של הבעלים</strong>.
            </p>

            <p>
              החומרה מתחברת לטופולוגיה של <strong>הכחשה סבירה (Plausible Deniability)</strong>, הממומשת באמצעות <strong>הצפנה ניתנת להכחשה (Deniable Encryption)</strong> המבוססת על <strong>Coercion-Resistant CP-ABE</strong> (Ciphertext-Policy Attribute-Based Encryption). זרע יחיד גוזר שני נתיבים:
            </p>

            <ul>
              <li><strong>מפתח סודי אמיתי (RSK):</strong> חושף את הארנק המרכזי האמיתי.</li>
              <li><strong>מפתח סודי מזויף (FSK):</strong> פותח סביבה אשלייתית סבירה, עם כספים תפעוליים אמינים ועסקאות מאומתות ברשת.</li>
            </ul>

            <p>
              פונקציות המבוססות על <strong>מפות של קבוצות ביליניאריות מסדר מורכב</strong> ו<strong>גיבוב זיקית (Chameleon Hashing)</strong> מבטיחות שלא ניתן לפרק את המשוואות סטטיסטית. התוקף נמלט שבע רצון, מאמין שחילץ את מפתחות המאסטר — בעוד הריבונות הפיננסית האמיתית נשארת חבויה ושלמה.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-protocolo-phantom-biometria-coacao.webp'
                alt='עץ החלטות לוגי של פרוטוקול קלט פנטום (הצפנה ניתנת להכחשה). ביומטריה מרכזית מפצלת באופן פעיל את הניתוב: הנתיב האופטי העליון הבטוח (ציאן) ניגש למפתח האמיתי (RSK), בעוד שהנתיב התחתון תחת זיהוי כפייה (ענבר) מפנה בשקט למפתח מזויף (FSK).'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>איור 3:</strong> פרוטוקול קלט פנטום — ביומטריה → דגל כפייה → RSK לעומת FSK (הצפנה ניתנת להכחשה).
              </figcaption>
            </figure>

            <h3 id='section-4-3'>4.3 אימות קריפטוגרפי נגד החלפה עוינת (&ldquo;משרתת רעה&rdquo;)</h3>

            <p>
              התקפת <em>משרתת רעה</em> כרוכה בהחלפה ערמומית של המכשיר בשיבוט קוסמטי עם חומרת רדיו-משדר נסתרת. ה-PSI חותר תחת זאת באמצעות <strong>אימות הפוך</strong>: המכשיר הוא שצריך להוכיח את האותנטיות שלו למארח באמצעות <strong>הוכחות אפס ידע (ZKP)</strong>, תוך יצירת <strong>תמונות אתחול אישיות</strong> בלתי ניתנות להעברה. שיבוט ללא השבב הלגיטימי לא ייצר את האימות הנכון, ויתריע למשתמש על היירוט.
            </p>

            {/* ═════════ Section 5 ═════════ */}
            <h2 id='section-5'>5. יתירות ברמה אווירית: TMR ואיומי LEO</h2>

            <p>
              פילוסופיית אופק האירועים טוענת שהאיומים אינם תמיד יבשתיים. כספת בלתי ניתנת להפרה מציגה <strong>חוסן מפני אסונות תשתית</strong>, המבטיחה נצחיות חישובית במצוקה — כולל <strong>מסלול לווייני נמוך (LEO)</strong>.
            </p>

            <h3 id='section-5-1'>5.1 האיום הרדיואקטיבי המסלולי (SEU, SEL, TID)</h3>

            <p>
              במרחק של 300-800 ק"מ מהשטח, המגנטוספירה מתדלדלת באופן משמעותי (במיוחד באנומליה הדרום-אטלנטית). הסביבה מוצפת בפרוטונים סולאריים ויונים כבדים מקרניים קוסמיות גלקטיות (GCR). רכיבי COTS קורסים תחת:
            </p>

            <ul>
              <li>
                <strong>מינון מיינן כולל (TID):</strong> התנוונות מתמשכת של מוליכים למחצה עקב הצטברות מצטברת של קרינת גמא ב-SiO₂ המבודד, המשנה מתחי סף וגורמת לדליפות קטלניות.
              </li>
              <li>
                <strong>השפעות אירוע יחיד (SEE):</strong> מעברים חולפים הנגרמים על ידי חדירת חלקיק טעון — <strong>היפוכים של אירוע יחיד (SEU)</strong> הופכים ביטים באקראי; <strong>נעילות של אירוע יחיד (SEL)</strong> מפעילות קצרים חשמליים המתיכים מסלולים מיקרוסקופיים.
              </li>
            </ul>

            <h3 id='section-5-2'>5.2 תקן Rad-Hard ו-FRAM פרואלקטרית</h3>

            <p>
              ה-PSI זונח זיכרונות Flash ו-NAND EEPROM אזרחיים לטובת <strong>זיכרונות RAM פרואלקטריים עמידים לקרינה (Rad-Hard FRAM)</strong>. בניגוד לזיכרונות מסורתיים המבוססים על לכידת אלקטרונים על קבלי שער צף CMOS, ה-FRAM משתמש בטופולוגיות קריסטלוגרפיות אקזוטיות (שכבה דקה של <strong>טיטנאט זירקונט עופרת — PZT</strong>).
            </p>

            <p>
              המבנה שומר על המפתחות הבינאריים באמצעות <strong>קיטוב קבוע של שדה חשמלי שיורי</strong> הקשור למיקומים גיאומטריים של הגביש המתכתי — סידור דיפול יציב ובלתי ניתן לערעור. חלקיקים מייננים במעבר <strong>אינם משחיתים</strong> את ההתגבשויות המכוונות הללו, ומעניקים חסינות טבעית בסביבות TID מסיביות.
            </p>

            <h3 id='section-5-3'>5.3 יתירות מודולרית משולשת (TMR)</h3>

            <p>
              כל פעולה קריטית משוכפלת פיזית <strong>שלוש פעמים</strong> במיקרו-בקרים עצמאיים (תת-בלוקים A, B, C). בסיום החישובים המקבילים, הנתיבים מתכנסים ב<strong>התקן בוחן רוב (&ldquo;Voter&rdquo;)</strong>.
            </p>

            <p>
              אם חלקיק קוסמי יהפוך את הטרנזיסטורים של תת-בלוק B (SEU), המערכות A ו-C ימשיכו לדווח נתונים נכונים. ה-Voter — ברוב פשוט (2 נגד 1) — מסלק באופן מיידי את השגיאות המזויפות, ללא אתחולים או התערבויות תפעוליות. המכשיר שומר על פעולה רציפה ובלתי ניתנת לטעייה תחת הפצצה רדיואקטיבית מסלולית.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-arquitetura-tmr-redundancia-voter.webp'
                alt='תרשים ארכיטקטורת יתירות מודולרית משולשת (TMR) אווירית של פרויקט PSI. שלושה מיקרו-מעבדים עצמאיים מעבדים נתונים באופן מקבילי סובלני לתקלות, ומתכנסים לשער לוגי מרכזי של Voter רובני המאמת ופולט רק פלט ציאן מאוחד וחסין מפני הזרקת תקלות.'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>איור 4:</strong> יתירות מודולרית משולשת — תת-בלוקים A/B/C → Voter ברוב → פלט בלתי ניתן לטעייה.
              </figcaption>
            </figure>

            {/* ── Callout: Descoberta Chave — TMR ── */}
            <aside className='not-prose my-10 border-l-4 border-cyan-500 bg-cyan-950/20 p-6 rounded-r-xl'>
              <h4 className='text-cyan-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2'>
                💡 תגלית מפתח (TL;DR)
              </h4>
              <p className='text-neutral-200 m-0 leading-relaxed'>
                ארכיטקטורת ה<strong className='text-white'>יתירות המודולרית המשולשת (TMR)</strong> עם Voter ברוב פשוט, בשילוב עם זיכרונות <strong className='text-white'>FRAM עמידים לקרינה (Rad-Hard)</strong> חסינים ל-TID, מבטיחה פעולה רציפה ובלתי ניתנת לטעייה של ה-PSI גם תחת הפצצת קרניים קוסמיות גלקטיות במסלול לווייני נמוך (LEO) — ומבטלת Single-Event Upsets ללא אתחולים.
              </p>
            </aside>

            {/* ═════════ Section 6 ═════════ */}
            <h2 id='section-6'>6. מסקנה</h2>

            <p>
              <strong>פרויקט PSI (Ψ)</strong> חורג באופן קטגורי מממד של &ldquo;ארנק אלקטרוני צרכני&rdquo;, ומעביר את טקסונומיית המשמורת לרמות בלתי נחקרות של מדעי המלחמה, המטלורגיה וההגנה האזרחית הפלנטרית.
            </p>

            <p>
              באימוץ בלתי מסויג של המניפסט הקיומי של <strong>&ldquo;אמון אפס בסיליקון&rdquo;</strong>, תגובותיו סוללות את הדרך למצב האמנות הבין-תחומי:
            </p>

            <ol>
              <li>
                <strong>חזית קינטית:</strong> שזירת התרמודינמיקה האקוסטית של ציפוי האפוקסי עם הצפיפות הצבאית של Cu-W מדכאת את הווקטורים הפורנזיים האקוסטיים הפיאזואלקטריים במקביל לספיגה מיידית של EMP.
              </li>
              <li>
                <strong>ארעיות קריפטוגרפית עמידה לקרינה (Rad-Hard):</strong> ביטול העמידות האלקטרונית באמצעות SRAM PUF, המחוזקת על ידי XMSS פוסט-קוונטי (NIST SP 800-208) ושורדת בזיכרונות FRAM גבישיים, מסלקת את הסכנות של מיקרוסקופים פורנזיים ושל העתיד הקוונטי.
              </li>
              <li>
                <strong>הגנה עצבית של סבירות פעילה:</strong> הביו-מרקרים ההתנהגותיים (CapsNets) מפעילים מוטציה קיברנטית בלתי ניתנת לזיהוי עבור הצפנת פנטום ניתנת להכחשה תחת לחץ כפייה בזמן אמת.
              </li>
            </ol>

            <p>
              על ידי איחוד חזיתות אלו של הגנה חומרית ועיבוד סייברנטי, המכשיר מתקדש כ<strong>מעוז והגבול הבלתי משתנה של אופק האירועים המוחשי בהגנה בלתי מעורערת על עתיד הריבונות האישית</strong>.
            </p>

          </div>{/* end prose */}

          {/* ─── References ─── */}
          <section className='mt-16 rounded-xl border border-neutral-800 bg-neutral-900/30 p-6'>
            <h2 className='text-lg font-bold text-white mb-4'>אסמכתאות מדעיות</h2>
            <ol className='space-y-2 text-xs text-neutral-500 list-decimal list-inside'>
              <li id='ref-1'>NIST SP 800-208. <em>Recommendation for Stateful Hash-Based Signature Schemes (XMSS/LMS)</em>. National Institute of Standards and Technology.</li>
              <li id='ref-2'>Roel Maes (2013). <em>Physically Unclonable Functions: Constructions, Properties and Applications</em>. Springer.</li>
              <li id='ref-3'>Kocabaş, O., et al. &ldquo;A Review of Side-Channel Attacks on Cryptographic Hardware.&rdquo; <em>IEEE Transactions on Information Forensics and Security</em>.</li>
              <li id='ref-4'>TMR &amp; Rad-Hard Architecture: Estudos em redundância modular tripla e FRAM para ambientes LEO/Aeroespacial.</li>
              <li id='ref-5'>Deniable Encryption &amp; Behavioral Biometrics: Literaturas de heurísticas comportamentais em Edge AI contra coerção (<em>Rubber-hose cryptanalysis</em>).</li>
              <li id='ref-6'>Study on Shielding Effectiveness of Arc Thermal Metal Spraying Against EMP. <em>Materials</em> 10(10), 2017. MDPI.</li>
              <li id='ref-7'>Electromagnetic Shielding Performance of Carbon Black Mixed Concrete with Zn-Al Metal Thermal Spray Coating. <em>PMC</em>, 2020.</li>
              <li id='ref-8'>Radiation Effects in Tungsten and Tungsten-Copper Alloys. <em>PMC</em>, 2024.</li>
              <li id='ref-9'>Laser Powder Bed Fusion of Copper-Tungsten Composites. mediaTUM, TU Munich.</li>
              <li id='ref-10'>PreSCAN: Comprehensive Review of Pre-Silicon Physical SCA Assessment. <em>MDPI</em>.</li>
              <li id='ref-11'>A Comprehensive Survey on Non-Invasive Passive Side-Channel Analysis. <em>PMC</em>, 2022.</li>
              <li id='ref-12'>A Survey on Acoustic Side-Channel Attacks: An AI Perspective. <em>MDPI</em>.</li>
              <li id='ref-13'>Thermal Side-Channel Threats in Densely Integrated Microarchitectures. <em>PMC</em>, 2024.</li>
              <li id='ref-14'>Can&apos;t Touch This: Inertial HSMs Thwart Advanced Physical Attacks. <em>ResearchGate</em>, 2021.</li>
              <li id='ref-15'>Proof-of-PUF Enabled Blockchain: Concurrent Data and Device Security. <em>PMC</em>, 2020.</li>
              <li id='ref-16'>In-Depth Review and Comparative Analysis of DRAM-Based PUFs. <em>ResearchGate</em>, 2024.</li>
              <li id='ref-17'>Understanding SRAM PUF: The Secure Silicon Fingerprint. Synopsys.</li>
              <li id='ref-18'>Building Secure SRAM PUF Key Generators on Resource Constrained Devices. <em>arXiv</em>, 2019.</li>
              <li id='ref-19'>NIST SP 800-208 (Draft). <em>Recommendation for Stateful Hash-Based Signature Schemes</em>.</li>
              <li id='ref-20'>A Configurable Hardware Implementation of XMSS. <em>Cryptology ePrint Archive</em>, 2021.</li>
              <li id='ref-21'>Hash-based Signatures: State and Backup Management. IETF Draft.</li>
              <li id='ref-22'>Improved Biometric Stress Monitoring Using HRV and CapsNet. <em>PMC</em>, 2024.</li>
              <li id='ref-23'>Cyber Coercion Detection Using LLM-Assisted Multimodal Biometric System. <em>MDPI</em>, 2025.</li>
              <li id='ref-24'>Stress Detection for Keystroke Dynamics. Carnegie Mellon University.</li>
              <li id='ref-25'>Optimizing Mental Stress Detection via HRV Feature Selection. <em>MDPI Sensors</em>, 2025.</li>
              <li id='ref-26'>Coercion-Resistant CP-ABE for IoT Security. <em>PMC</em>, 2025.</li>
              <li id='ref-27'>Deniable-Encryption Protocols Based on Commutative Ciphers. <em>Quasigroups and Related Systems</em> 25(1).</li>
              <li id='ref-28'>SkyForge Core: TMR Computing Architecture for Small Satellites. Taylor University.</li>
              <li id='ref-29'>Experimental Study on SEU Mitigation in SRAM FPGA for LHC Phase-2. IIHE.</li>
              <li id='ref-30'>Reliability Analysis of TMR System Under Step-Partially Accelerated Life Tests Using Lomax Distribution. <em>PMC</em>, 2023.</li>
              <li id='ref-31'>A Rad Hard ASIC Design Approach: TMR. ASIC North.</li>
              <li id='ref-32'>SRAM FPGA Reliability Analysis for Harsh Radiation Environments. Pitt Space.</li>
              <li id='ref-33'>Designing a Rad-Hard CubeSat Onboard Computer. <em>Military Embedded Systems</em>.</li>
              <li id='ref-34'>Aging-Induced Long-Term Data Remanence in SRAM Cells. Auburn University.</li>
              <li id='ref-35'>System-Level Mitigation of SEFIs in Data Handling Architectures for Small Satellites. DigitalCommons@USU.</li>
            </ol>
          </section>
    </>
  );
}