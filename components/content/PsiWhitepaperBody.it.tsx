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
              Indice del Whitepaper
            </p>
            <ol className='space-y-2 text-sm'>
              {[
                { n: '1', t: 'Introduzione: Il Collasso della Fiducia Istituzionale e il Modello di Minaccia' },
                { n: '2', t: 'Architettura Fisica (Il Ricettacolo)' },
                { n: '2.1', t: 'Leghe Cu-W e Mitigazione degli Impulsi Elettromagnetici (EMP)' },
                { n: '2.2', t: 'Isolamento contro Attacchi a Canale Laterale (SCA)' },
                { n: '2.3', t: 'Architettura di Isolamento Radicale (Air-Gapped)' },
                { n: '3', t: 'Il Nucleo Crittografico (Il Collasso della Funzione d&apos;Onda)' },
                { n: '3.1', t: 'Funzioni Fisiche Non Clonabili (SRAM PUF)' },
                { n: '3.2', t: 'Standard Post-Quantistico XMSS (NIST SP 800-208)' },
                { n: '3.3', t: 'Entropia Ibrida: La Chiusura dell&apos;Anello' },
                { n: '4', t: 'Euristiche Difensive Attive (Phantom Input e Evil Maid)' },
                { n: '4.1', t: 'Biometria Comportamentale e Rilevamento della Coercizione' },
                { n: '4.2', t: 'Crittografia Negabile (Deniable Encryption)' },
                { n: '4.3', t: 'Attestazione Crittografica contro Evil Maid' },
                { n: '5', t: 'Ridondanza di Grado Aerospaziale: TMR e LEO' },
                { n: '5.1', t: 'La Minaccia Radioattiva Orbitale (SEU, SEL, TID)' },
                { n: '5.2', t: 'Lo Standard Rad-Hard e FRAM Ferroelettrica' },
                { n: '5.3', t: 'Ridondanza Modulare Tripla (TMR)' },
                { n: '6', t: 'Conclusione' },
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
            <h2 id='section-1'>1. Introduzione: Il Collasso della Fiducia Istituzionale e il Modello di Minaccia</h2>

            <p>
              La transizione dell'economia globale verso infrastrutture decentralizzate basate sulla crittografia
              asimmetrica ha trasferito l'onere della sicurezza direttamente all'individuo. Storicamente, la
              protezione dei beni patrimoniali dipendeva da istituzioni fiduciarie, come banche centrali e
              custodi regolamentati, che operavano sotto la protezione armata dello Stato. Tuttavia, la
              decentralizzazione ha introdotto una vulnerabilità paradossale: il detentore della chiave privata
              diventa il <strong>singolo punto di fallimento (single point of failure)</strong>.
            </p>

            <p>
              I portafogli hardware convenzionali sono stati concepiti sotto un insieme di presupposti
              intrinsecamente fragili. Essi presumono che l'ambiente operativo sia benigno, che l'integrità
              della catena di approvvigionamento dei microchip sia intatta, che i processi di fabbricazione
              siano esenti da <em>hardware trojans</em> e, soprattutto, che l'utente stia operando il
              dispositivo in uno stato di calma e libero da minacce fisiche o coercizione.
            </p>

            <p>
              Il <strong>Progetto Ψ (PSI)</strong> nasce dal completo rifiuto di queste premesse, basandosi
              sul paradigma diametralmente opposto dello <strong>&ldquo;Zero Trust in Silicon&rdquo;</strong> (Fiducia
              Zero nel Silicio). Sotto questa nuova ontologia, l'architettura assume nativamente che l'ambiente è
              invariabilmente ostile, che il produttore originale può ospitare vettori malevoli, che i canali
              di comunicazione sono attivamente monitorati e che l'utente stesso può essere sotto la minaccia
              di un'arma.
            </p>

            <p>
              Quando la fiducia in tutti gli strati umani, aziendali e istituzionali è metodicamente
              eliminata, la sicurezza deve essere ancorata unicamente alla freddezza inviolabile delle <strong>leggi della
              fisica dei materiali</strong>, della <strong>termodinamica</strong> e della <strong>matematica
              crittografica avanzata</strong>. Il modello di minaccia affrontato dall'architettura PSI trascende il
              dominio civile e si addentra nel rigore degli standard militari e aerospaziali (<strong>C4ISR</strong>).
            </p>

            <p>
              L'avvento di invasioni domiciliari volte all'estorsione violenta di cripto-asset —
              colloquialmente note come *attacchi da &ldquo;chiave inglese da cinque dollari&rdquo;* —
              ha reso gli sofisticati attacchi remoti di malware statisticamente secondari. Se un aggressore
              può semplicemente torturare il proprietario per ottenere il PIN di accesso, la resistenza logica del
              dispositivo diventa irrilevante. La sicurezza, pertanto, deve essere <strong>trasmutata da una
              disciplina puramente elettronica a una scienza psicologica, biomeccanica e strutturale</strong>.
            </p>

            {/* ═════════ Section 2 ═════════ */}
            <h2 id='section-2'>2. Architettura Fisica (Il Ricettacolo)</h2>

            <p>
              La prima linea di difesa di qualsiasi sistema crittografico non risiede nell'algoritmo
              matematico, ma nella <strong>frontiera fisica</strong> che separa la logica computazionale dall'avversario.
              Il &ldquo;Ricettacolo&rdquo; del Progetto PSI rappresenta una convergenza estrema di
              ingegneria dei materiali e fisica dello stato solido, volta alla neutralizzazione assoluta di
              intrusioni meccaniche, attacchi elettromagnetici ad alta potenza e tecniche invasive di
              spionaggio basate sull'emanometria.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-arquitetura-hardware-camadas-defesa.webp'
                alt='Diagramma isometrico in vista esplosa che dettaglia i quattro strati di difesa fisica dell&apos;hardware crittografico Progetto PSI: schermatura esterna in Rame-Tungsteno, potting di resina epossidica, rete di sicurezza attiva (Tamper Mesh) ciano, e nucleo logico di silicio.'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>Figura 1:</strong> Strati di Difesa Fisica e Logica del Ricettacolo PSI (Cu-W → Epossidica → Tamper Mesh → Silicio).
              </figcaption>
            </figure>

            <h3 id='section-2-1'>2.1 Leghe di Rame-Tungsteno e Mitigazione degli Impulsi Elettromagnetici (EMP)</h3>

            <p>
              Un Impulso Elettromagnetico (EMP), sia esso derivante da una detonazione nucleare ad alta quota
              (NEMP) o da armamenti di interferenza elettromagnetica intenzionale (IEMI), genera correnti
              indotte devastanti che distruggono i circuiti elettronici tramite sovratensioni. Per
              proteggere il nucleo crittografico, il telaio del PSI abbandona l'alluminio e la plastica tradizionali
              in favore di una <strong>lega matrice composita di Rame-Tungsteno (Cu-W)</strong>.
            </p>

            <p>
              Il <strong>Tungsteno (W)</strong> possiede una densità estremamente elevata (~19.3 g/cm³) e il
              punto di fusione più alto tra tutti i metalli puri (3422°C). Queste proprietà conferiscono
              una formidabile inerzia cinetica e termica al dispositivo, oltre a funzionare come scudo naturale
              contro le radiazioni ionizzanti ad alta energia. Tuttavia, il tungsteno puro manca della
              conduttività elettrica ottimizzata per creare una Gabbia di Faraday perfetta — è a questo punto
              che il <strong>Rame (Cu)</strong>, con la sua altissima conduttività, colma la lacuna.
            </p>

            <p>
              Il sistema W-Cu presenta <strong>immiscibilità totale</strong> sia nello stato solido che
              in quello liquido. Di conseguenza, il telaio è fabbricato con metodi avanzati di <strong>metallurgia
              delle polveri</strong>: uno scheletro poroso di tungsteno viene prima pressato e sinterizzato a
              alte temperature, seguito dall'infiltrazione capillare di rame liquido fuso. Il composito
              risultante (70-80% W / 20-30% Cu) esibisce un comportamento sinergico eccezionale.
            </p>

            <p>
              L'efficacia è quantificata dall'<strong>Efficacia di Schermatura (SE)</strong>, misurata in decibel:
            </p>

            <div className='not-prose overflow-x-auto my-14'>
              <figure className='p-8 bg-neutral-900/40 rounded-3xl border border-neutral-800 shadow-2xl flex flex-col items-center'>
                <div className='font-serif text-3xl md:text-5xl text-neutral-100 mb-6 tracking-widest text-center'>
                  SE = 10 · log₁₀(P<sub className='text-2xl'>i</sub> / P<sub className='text-2xl'>t</sub>)
                </div>
                <figcaption className='w-full max-w-md border-t border-neutral-800 pt-4 text-sm text-neutral-400 text-center font-mono'>
                  <p>Efficacia di Schermatura (<strong className='text-cyan-400'>SE<sub>totale</sub></strong>) = R + A + B</p>
                </figcaption>
              </figure>
            </div>

            {/* ── Callout: Descoberta Chave — Blindagem ── */}
            <aside className='not-prose my-10 border-l-4 border-cyan-500 bg-cyan-950/20 p-6 rounded-r-xl'>
              <h4 className='text-cyan-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2'>
                💡 Scoperta Chiave (TL;DR)
              </h4>
              <p className='text-neutral-200 m-0 leading-relaxed'>
                L'implementazione dell'architettura di schermatura Cu-W del Progetto PSI ha portato a un'<strong className='text-white'>efficacia di schermatura superiore a 100 dB</strong>, superando le rigorose normative militari MIL-STD-285. Il composito 70-80% W / 20-30% Cu combina l'inerzia cinetica del tungsteno con la conduttività del rame in una Gabbia di Faraday di grado nucleare.
              </p>
            </aside>

            <p>
              L'attenuazione globale deriva dalla somma di tre meccanismi: <strong>perdita per riflessione (R)</strong>,
              <strong> perdita per assorbimento interno (A)</strong> e <strong>correzione per riflessioni multiple (B)</strong>.
              Strutture dense che incorporano rame garantiscono costantemente SE {'>'}100 dB, superando le
              rigorose normative militari (MIL-STD-285).
            </p>

            {/* Table: Shielding Comparison */}
            <div className='not-prose overflow-x-auto my-12 border border-neutral-800 rounded-xl shadow-lg'>
              <table className='w-full text-start text-sm text-neutral-300'>
                <caption className='p-4 bg-neutral-900/80 text-start text-cyan-400 font-mono uppercase tracking-widest font-bold border-b border-neutral-800 text-xs'>
                  Tabella 1: Parametri di Schermatura Elettromagnetica (Cu-W)
                </caption>
                <thead>
                  <tr className='bg-neutral-900/80 text-neutral-200'>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Materiale</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Conduttività</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>SE (RF)</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Vantaggio Strutturale</th>
                  </tr>
                </thead>
                <tbody className='text-neutral-400'>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>Acciaio Galvanizzato</td>
                    <td className='px-4 py-3'>Bassa</td>
                    <td className='px-4 py-3'>~90 dB</td>
                    <td className='px-4 py-3'>Alta permeabilità magnetica</td>
                  </tr>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>Rame Puro (Cu)</td>
                    <td className='px-4 py-3'>Molto Alta (100% IACS)</td>
                    <td className='px-4 py-3'>{'>'}100 dB</td>
                    <td className='px-4 py-3'>Massima riflessione di impulso EMP</td>
                  </tr>
                  <tr className='bg-cyan-950/20'>
                    <td className='px-4 py-3 text-cyan-300 font-semibold'>Lega Cu-W (PSI)</td>
                    <td className='px-4 py-3 text-cyan-300'>Alta (40-50% IACS)</td>
                    <td className='px-4 py-3 text-cyan-300'>{'>'}100 dB</td>
                    <td className='px-4 py-3 text-cyan-300'>Schermatura RF + gamma; rigidità estrema</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 id='section-2-2'>2.2 Isolamento Acustico, Termico e Chimico contro Attacchi a Canale Laterale (SCA)</h3>

            <p>
              L'esecuzione di algoritmi crittografici altera lo stato di milioni di transistor miliardi
              di volte al secondo. Queste transizioni logiche consumano correnti variabili che sfuggono nell'ambiente
              sotto forma di <strong>calore</strong>, <strong>radiazione elettromagnetica residua</strong> e
              <strong> rumore acustico</strong>. Attaccanti ben equipaggiati utilizzano queste emanazioni per inferire
              il materiale della chiave segreta — disciplina nota come <strong>Attacchi a Canale Laterale (SCA)</strong>.
            </p>

            <p>
              <strong>Attacchi Acustici (ASCA):</strong> Condensatori ceramici multistrato (MLCC) e induttori
              esibiscono effetti piezoelettrici ed elettrostrittivi. Fluttuazioni di tensione durante operazioni
              crittografiche causano deformazioni microscopiche, inducendo onde sonore e ultrasoniche
              intercettabili da microfoni direzionali.
            </p>

            <p>
              <strong>Attacchi Termici (TSCA):</strong> Telecamere a immagine termica catturano variazioni nei
              profili di calore della superficie del chip, mappando l'asimmetria quando diversi blocchi logici
              operano chiavi con bit distinti.
            </p>

            <p>
              Per mitigare entrambi i vettori, il PSI <strong>incapsula interamente l'hardware crittografico</strong> in
              resina epossidica termoindurente infusa con microsfere di vetro e granulazioni di matrice ceramica
              (<em>potting</em>):
            </p>

            <ol>
              <li>
                <strong>Smorzamento Acustico Viscoelastico:</strong> L'incompatibilità di impedenza
                acustica tra i componenti piezoelettrici e la densa resina costringe le onde sonore a
                subire un'attenuazione drastica — convertite in calore di bassissima ampiezza.
              </li>
              <li>
                <strong>Appiattimento del Gradiente Termico:</strong> La conduttività termica intenzionalmente
                bassa dell'epossidica agisce come filtro passa-basso termico. L'inerzia assorbe e linearizza i picchi
                di calore transitori, appiattendo le curve di firma termica.
              </li>
              <li>
                <strong>Difesa Chimica Simbiotica:</strong> All'interno della matrice epossidica, una complessa rete di
                fili sottili (<em>tamper mesh</em>) attivamente energizzata è intrecciata. La chimica dello strato
                isolante è progettata per essere identica a quella della resina indurita — solventi che dissolvono la resina
                distruggono simultaneamente la rete, attivando la <strong>zeroizzazione istantanea</strong> delle chiavi
                prima che l'invasore raggiunga l'obiettivo.
              </li>
            </ol>

            <h3 id='section-2-3'>2.3 Architettura di Isolamento Radicale (Air-Gapped)</h3>

            <p>
              La topologia del PSI richiede un'<strong>architettura di interfaccia nulla e isolamento radicale</strong>.
              Il dispositivo elimina categoricamente porte USB, non visualizza schermi interattivi e manca di
              interruttori meccanici tradizionali. L'alimentazione e il trasferimento strettamente
              strutturato di dati crittografati avvengono unicamente tramite <strong>Pogo Pin magnetici
              crittografati</strong> a faccia piana. Estirpando fisicamente le porte di ingresso/uscita
              convenzionali, il PSI revoca la superficie di contatto per attacchi logici prevalenti (BadUSB,
              firmware injection, fuzzing).
            </p>

            {/* ═════════ Section 3 ═════════ */}
            <h2 id='section-3'>3. Il Nucleo Crittografico (Il Collasso della Funzione d'Onda)</h2>

            <p>
              Ispirato alla meccanica quantistica, il concetto di <strong>&ldquo;Collasso della Funzione d'Onda&rdquo;</strong> della
              Chiave Privata stipula che la chiave esiste nella memoria volatile solo nell'esatto millisecondo in cui una
              firma digitale viene richiesta. Nei portafogli legacy e negli HSM commerciali, la chiave master a 256 bit
              è persistentemente memorizzata in Memoria Non Volatile (Flash EEPROM). Sotto il modello ostile del PSI,
              qualsiasi dato mantenuto staticamente è vulnerabile — uno Stato-Nazione potrebbe usare la Microscopia
              Elettronica a Scansione (SEM) o Fasci di Ioni Focalizzati (FIB) per estrarre la chiave.
            </p>

            <p>
              La risposta del PSI è drastica: <strong>la chiave privata non è memorizzata nel dispositivo in
              nessun momento</strong>.
            </p>

            <h3 id='section-3-1'>3.1 Funzioni Fisiche Non Clonabili Basate su SRAM (SRAM PUF)</h3>

            <p>
              Mentre il dispositivo è a riposo (disalimentato), il nucleo di memoria è un <strong>vuoto
              assoluto di informazione</strong>. Le celle di memoria SRAM standard sono formate da latch
              bistabili a accoppiamento incrociato (topologia 6T). All'accensione, i transistor competono per
              portare lo stato logico a &lsquo;0&rsquo; o &lsquo;1&rsquo;. A causa delle <strong>Fluttuazioni
              Casuali dei Dopanti (RDF)</strong> e delle irregolarità a livello nanometrico nei processi di
              litografia, ogni cella presenta discrepanze fisiche nelle sue Tensioni di Soglia (V<sub>th</sub>).
            </p>

            <p>
              Questa asimmetria atomica significa che ogni cella collassa in modo prevedibile allo stesso
              stato iniziale. Scansionando migliaia di queste celle, si estrae una catena binaria ad alta
              entropia — l'<strong>impronta digitale incontestabile di quel silicio</strong>, impossibile da
              clonare, prevedere o copiare.
            </p>

            <p>
              La qualità crittografica è modellata dalla <strong>Decidability (d&apos;)</strong>, che confronta
              le distribuzioni normali della Distanza di Hamming Frazionaria (FHD) tra letture intra-dispositivo
              (rumore termico) e inter-dispositivo (casualità tra chip diversi).
            </p>

            <p>
              Per trasformare lo stato fisico rumoroso in un seme crittografico con precisione del 100%,
              si impiegano <strong>Fuzzy Extractors</strong> (Estrattori Nebulosi) — moduli di &ldquo;Secure
              Sketch&rdquo; che combinano la risposta rumorosa della SRAM con &ldquo;Helper Data&rdquo; e algoritmi
              di correzione degli errori (BCH o Polari). Dopo la firma, l'alimentazione della SRAM viene obliterata,
              le cariche si dissipano e <strong>la chiave cessa di esistere</strong>.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-ciclo-vida-chave-criptografica-sram-puf.webp'
                alt='Diagramma di flusso logico del ciclo di vita della chiave privata nel Progetto PSI tramite SRAM PUF. Il flusso converte il rumore fisico del silicio in entropia pura, lo elabora tramite il Fuzzy Extractor per generare il seme (cristallo strutturato), culminando in zeroizzazione istantanea e disintegrazione digitale.'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>Figura 2:</strong> Flusso di Derivazione di Chiave Effimera tramite SRAM PUF (Power-up → RDF → Fuzzy Extractor → Seme → Zeroizzazione).
              </figcaption>
            </figure>

            <h3 id='section-3-2'>3.2 Lo Standard Post-Quantistico XMSS (NIST SP 800-208)</h3>

            <p>
              Se un computer quantistico con qubit logici stabili verrà costruito, l'<strong>Algoritmo di
              Shor</strong> distruggerà tutta l'infrastruttura basata su curve ellittiche (ECDSA, EdDSA).
              Preparandosi al &ldquo;Q-Day&rdquo;, il PSI incorpora l'<strong>eXtended Merkle Signature
              Scheme (XMSS)</strong>, standardizzato dal NIST (SP 800-208) e RFC 8391.
            </p>

            <p>
              L'XMSS non dipende dalla fattorizzazione di numeri primi né da mappature algebriche. La sua sicurezza
              si basa sull'<strong>inviabilità computazionale di creare collisioni in funzioni hash</strong> (SHA-256,
              SHAKE256) — premessa comprovata da decenni di criptoanalisi e irriducibile contro gli algoritmi
              di Grover.
            </p>

            <p>
              La complessità risiede nella sua natura *stateful*: l'XMSS costruisce un Albero di Merkle
              dove ogni nodo foglia porta materiale per una <strong>Firma Unica di Winternitz (WOTS+)</strong>.
              Ogni chiave OTS <strong>può firmare una singola messaggio nella vita utile del sistema</strong>.
              Il riutilizzo dello stato causa un collasso catastrofico della sicurezza.
            </p>

            <blockquote>
              <p>
                &ldquo;Questa raccomandazione richiede che la generazione di chiavi e firme sia eseguita
                strettamente in moduli crittografici hardware dedicati che non consentono l'esportazione del materiale
                della chiave segreta.&rdquo; — <strong>NIST SP 800-208</strong>
              </p>
            </blockquote>

            <p>
              Il microcontrollore del PSI gestisce il puntatore XMSS interamente all'interno delle barriere
              in epossidica di silicio, rifiutando ogni esportazione di chiavi radice tramite bus esterni.
            </p>

            <h3 id='section-3-3'>3.3 Entropia Ibrida: La Chiusura dell'Anello</h3>

            <p>
              Il Seme Master che alimenta le foglie WOTS+ richiede <strong>&ldquo;Entropia Ibrida
              Ridondante&rdquo;</strong>:
            </p>

            <ol>
              <li>
                <strong>Entropia Dinamica Intrinseca:</strong> estratta dalla SRAM PUF — vincolata
                esclusivamente all'hardware fisico.
              </li>
              <li>
                <strong>Entropia Statica Estrinseca:</strong> fornita dall'umano tramite smartcard NFC di
                prossimità temporale combinata alla biometria del titolare vivo.
              </li>
            </ol>

            <p>
              Una <strong>Funzione di Derivazione di Chiavi (KDF)</strong> basata su hash assorbe la
              casualità del microchip mescolata alle credenziali organiche. Questo nodo gordiano algoritmico
              blinda la custodia ai due estremi: il dispositivo sottratto è inutile (entropia umana
              omessa); l'individuo sequestrato senza il chip è ugualmente impotente (parte stocastica
              del silicio persa).
            </p>

            {/* ═════════ Section 4 ═════════ */}
            <h2 id='section-4'>4. Euristiche Difensive Attive (Phantom Input e Evil Maid)</h2>

            <p>
              La sicurezza ciber-fisica collassa invariabilmente di fronte alla <strong>coercizione cinetica
              diretta</strong>. Se il titolare legittimo viene torturato per fornire password, la forza del
              vettore di estorsione sopprimerà tutte le crittografie. L'innovazione rivoluzionaria del PSI
              consiste nel trasporre la sicurezza del silicio nel campo della <strong>neuropsicologia
              e biometria attiva</strong>.
            </p>

            <h3 id='section-4-1'>4.1 Biometria Comportamentale e Rilevamento Fisiologico della Coercizione</h3>

            <p>
              Di fronte alla tortura, la porzione simpatica del Sistema Nervoso Autonomo precipita la reazione di
              &ldquo;lotta o fuga&rdquo;, risultando in cascate di catecolamine e cortisolo. Il PSI integra
              sensori che mappano continuamente la <strong>Biometria Comportamentale</strong>:
            </p>

            <ol>
              <li>
                <strong>Dinamica di Pressione e Pressione:</strong> Sensori magnetoelastici e
                strain gauge tracciano variazioni di pressione (~0.25 kPa), Flight Time e Hold Time.
                Sotto stress, la presa si pietrifica, la dinamica diventa brutale e aritmica.
              </li>
              <li>
                <strong>Micro-tremori Neuromuscolari:</strong> Accelerometri e giroscopi triassiali
                (IMU) quantificano l'agitazione millimetrica. Il tremore fisiologico (8-12 Hz) è modulato
                violentemente durante la coercizione — ampiezza amplificata, frequenze di rilassamento soppresse.
              </li>
              <li>
                <strong>Frequenza Cardiaca e PPG:</strong> Fotopletismografi e sensori di bioimpedenza
                misurano la vasocostrizione periferica, la tachicardia e la riduzione della Variabilità della Frequenza
                Cardiaca (HRV) — biomarcatore di stress rilevabile da reti neurali.
              </li>
            </ol>

            <p>
              Questi dati confluiscono in moduli di <strong>IA di bordo (Edge AI)</strong> — Reti di
              Capsule (CapsNets) e Random Forest per serie temporali fisiologiche, con punteggi F1
              tra <strong>96.97% e 99.82%</strong> in dataset clinici di stress.
            </p>

            {/* Table: Biometrics */}
            <div className='not-prose overflow-x-auto my-12 border border-neutral-800 rounded-xl shadow-lg'>
              <table className='w-full text-start text-sm text-neutral-300'>
                <caption className='p-4 bg-neutral-900/80 text-start text-cyan-400 font-mono uppercase tracking-widest font-bold border-b border-neutral-800 text-xs'>
                  Tabella 2: Biomarcatori di Rilevamento Fisiologico della Coercizione
                </caption>
                <thead>
                  <tr className='bg-neutral-900/80 text-neutral-200'>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Biomarcatore</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Hardware</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Pattern Sotto Coercizione</th>
                  </tr>
                </thead>
                <tbody className='text-neutral-400'>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>Forza e Dinamica di Contatto</td>
                    <td className='px-4 py-3'>Sensori Magnetoelastici + Strain Gauge</td>
                    <td className='px-4 py-3'>Latenza aritmica; picchi di pressione; rigidità di ritenzione</td>
                  </tr>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>Tremore Muscolare</td>
                    <td className='px-4 py-3'>IMU (Accelerometri/Giroscopi)</td>
                    <td className='px-4 py-3'>Rottura della frequenza 8-12 Hz; spasmi ad alta variabilità</td>
                  </tr>
                  <tr>
                    <td className='px-4 py-3'>Segnali Cardiovascolari</td>
                    <td className='px-4 py-3'>Bioimpedenza / Ottici / PPG</td>
                    <td className='px-4 py-3'>Vasocostrizione; calo HRV; tachicardia</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Callout: Descoberta Chave — Biometria ── */}
            <aside className='not-prose my-10 border-l-4 border-cyan-500 bg-cyan-950/20 p-6 rounded-r-xl'>
              <h4 className='text-cyan-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2'>
                💡 Scoperta Chiave (TL;DR)
              </h4>
              <p className='text-neutral-200 m-0 leading-relaxed'>
                I moduli di IA di bordo (CapsNets + Random Forest) hanno raggiunto <strong className='text-white'>punteggi F1 tra 96.97% e 99.82%</strong> nel rilevamento dello stress fisiologico in dataset clinici — permettendo al dispositivo di distinguere l'operazione legittima dall'operazione sotto coercizione in tempo reale, senza dipendenza da server esterni.
              </p>
            </aside>

            <h3 id='section-4-2'>4.2 Crittografia Negabile (Deniable Encryption — Protocollo Phantom Input)</h3>

            <p>
              Quando i bus neuromuscolari segnalano positivamente il flag di coercizione, il PSI opta per
              un percorso controintuitivo: <strong>non blocca le operazioni</strong>. Negli ecosistemi
              normativi, il blocco provocherebbe l'annientamento fisico del portatore da parte di rapitori
              implacabili. Il dispositivo assume la <strong>preservazione dell'integrità biologica del proprietario</strong>.
            </p>

            <p>
              L'hardware si accoppia alla topologia della <strong>Plausibilità Negabile (Plausible Deniability)</strong>,
              concretizzata attraverso la <strong>Crittografia Negabile (Deniable Encryption)</strong> basata
              su <strong>Coercion-Resistant CP-ABE</strong> (Ciphertext-Policy Attribute-Based Encryption).
              Un unico seme deriva due percorsi:
            </p>

            <ul>
              <li><strong>Real Secret Key (RSK):</strong> rivela il portafoglio centrale veritiero.</li>
              <li><strong>Fake Secret Key (FSK):</strong> apre un ambiente illusorio plausibile, con fondi
              operativi credibili e transazioni validate in rete.</li>
            </ul>

            <p>
              Funzioni basate su <strong>mappe di gruppi bilineari di ordine composto</strong> e
              <strong> Chameleon Hashing</strong> garantiscono che le equazioni non possono essere statisticamente
              svelate. L'aggressore fugge sazio credendo di aver estratto le chiavi master — mentre la
              sovranità patrimoniale reale rimane occulta e intatta.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-protocolo-phantom-biometria-coacao.webp'
                alt='Albero di decisione logico del Protocollo Phantom Input (Deniable Encryption). Una biometria centrale biforca attivamente il routing: il percorso ottico superiore sicuro (ciano) accede alla chiave reale (RSK), mentre il percorso inferiore sotto rilevamento di coercizione (ambra) reindirizza silenziosamente a una chiave falsa (FSK).'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>Figura 3:</strong> Protocollo Phantom Input — Biometria → Flag Coercizione → RSK vs FSK (Deniable Encryption).
              </figcaption>
            </figure>

            <h3 id='section-4-3'>4.3 Attestazione Crittografica contro Sostituzione Ostile (&ldquo;Evil Maid&rdquo;)</h3>

            <p>
              L'attacco *Evil Maid* implica lo scambio insidioso del dispositivo con un clone cosmetico
              con hardware radio-trasmettitore nascosto. Il PSI sovverte ciò con <strong>attestazione inversa</strong>:
              è il dispositivo che deve provare la sua autenticità all'host tramite <strong>Prove a Conoscenza
              Zero (ZKP)</strong>, generando <strong>Immagini di Boot Personali</strong> intrasferibili. Un
              clone senza il chip legittimo non produce l'attestazione corretta, avvisando l'utente
              dell'intercettazione.
            </p>

            {/* ═════════ Section 5 ═════════ */}
            <h2 id='section-5'>5. Ridondanza di Grado Aerospaziale: TMR e Minacce LEO</h2>

            <p>
              La filosofia dell'Orizzonte degli Eventi sostiene che le minacce non sono sempre terrestri. Un
              cassaforte inviolabile postula <strong>resilienza contro catastrofi infrastrutturali</strong>,
              garantendo perpetuità computazionale nell'avversità — inclusa l'<strong>Orbita Terrestre
              Bassa (LEO)</strong>.
            </p>

            <h3 id='section-5-1'>5.1 La Minaccia Radioattiva Orbitale (SEU, SEL, TID)</h3>

            <p>
              A 300-800 km dalla superficie, la magnetosfera si assottiglia sostanzialmente (specialmente nell'Anomalia
              del Sud Atlantico). L'ambiente è inondato di protoni solari e ioni pesanti
              dei raggi cosmici galattici (GCR). I componenti COTS collassano sotto:
            </p>

            <ul>
              <li>
                <strong>Dose Ionizzante Totale (TID):</strong> Degenerazione continua dei semiconduttori per la
                accumulo cumulativo di irradiazioni gamma nel SiO₂ isolante, alterando le tensioni di soglia
                e causando fughe letali.
              </li>
              <li>
                <strong>Effetti di Eventi Singoli (SEE):</strong> Transitori indotti dalla perforazione
                di una particella carica — <strong>Single-Event Upsets (SEU)</strong> ribaltano bit
                casualmente; <strong>Single-Event Latch-ups (SEL)</strong> innescano cortocircuiti
                fondendo tracce microscopiche.
              </li>
            </ul>

            <h3 id='section-5-2'>5.2 Lo Standard Rad-Hard e FRAM Ferroelettrica</h3>

            <p>
              Il PSI scarta memorie Flash e NAND EEPROM civili in favore di <strong>Memorie RAM
              Ferroelectriche Rad-Hard (FRAM)</strong>. Contrariamente alle memorie tradizionali basate sull'intrappolamento
              di elettroni su condensatori a gate flottante CMOS, la FRAM utilizza
              topologie cristallografiche esotiche (film sottile di <strong>Titanato Zirconato di
              Piombo — PZT</strong>).
            </p>

            <p>
              La struttura mantiene le chiavi binarie tramite la <strong>polarizzazione fissa del campo
              elettrico residuo</strong> associata a posizionamenti geometrici del cristallo metallico — un arrangiamento di
              dipolo stabile inalterabile. Le particelle ionizzanti in transito <strong>non corrompono</strong> queste
              cristallizzazioni orientate, conferendo immunità nativa in ambienti di TID massivo.
            </p>

            <h3 id='section-5-3'>5.3 Ridondanza Modulare Tripla (TMR)</h3>

            <p>
              Ogni operazione critica è fisicamente replicata <strong>tre volte</strong> in microcontrollori
              indipendenti (sottoblocchi A, B, C). Al termine dei calcoli paralleli, le vie convergono in un
              <strong> Dispositivo Scrutinatore di Maggioranza (&ldquo;Voter&rdquo;)</strong>.
            </p>

            <p>
              Se una particella cosmica ribalta i transistor del sottoblocco B (SEU), gli insiemi A e C
              continuano a riportare dati corretti. Il Voter — per Maggioranza Semplice (2 contro 1) — espelle
              istantaneamente gli errori spuri, senza riavvii o interventi operativi. Il
              dispositivo mantiene un'operazione continua e infallibile sotto bombardamento radioattivo orbitale.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-arquitetura-tmr-redundancia-voter.webp'
                alt='Schema di architettura Triple Modular Redundancy (TMR) aerospaziale del Progetto PSI. Tre microprocessori indipendenti elaborano i dati in modo parallelo tollerante ai guasti, convergendo in una porta logica di Voter Maggioritario centrale che valida ed emette solo un&apos;uscita ciano unificata e immune all&apos;iniezione di guasti.'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>Figura 4:</strong> Ridondanza Modulare Tripla — Sottoblocchi A/B/C → Voter per Maggioranza → Uscita Infallibile.
              </figcaption>
            </figure>

            {/* ── Callout: Descoberta Chave — TMR ── */}
            <aside className='not-prose my-10 border-l-4 border-cyan-500 bg-cyan-950/20 p-6 rounded-r-xl'>
              <h4 className='text-cyan-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2'>
                💡 Scoperta Chiave (TL;DR)
              </h4>
              <p className='text-neutral-200 m-0 leading-relaxed'>
                L'architettura di <strong className='text-white'>Ridondanza Modulare Tripla (TMR)</strong> con Voter a maggioranza semplice, combinata a memorie <strong className='text-white'>FRAM Rad-Hard</strong> immuni a TID, garantisce un'operazione continua e infallibile del PSI anche sotto bombardamento di raggi cosmici galattici in Orbita Terrestre Bassa (LEO) — eliminando i Single-Event Upsets senza riavvii.
              </p>
            </aside>

            {/* ═════════ Section 6 ═════════ */}
            <h2 id='section-6'>6. Conclusione</h2>

            <p>
              Il <strong>Progetto PSI (Ψ)</strong> trascende in maniera categorica la dimensione di &ldquo;portafoglio
              elettronico di consumo&rdquo;, migrando la tassonomia della custodia a livelli inesplorati delle
              scienze belliche, metallurgiche e di salvaguardia civile planetaria.
            </p>

            <p>
              Adottando senza riserve il manifesto esistenziale dello <strong>&ldquo;Zero Trust in Silicon&rdquo;</strong>,
              le sue risposte aprono la strada allo stato dell'arte interdisciplinare:
            </p>

            <ol>
              <li>
                <strong>Avanguardia Cinetica:</strong> L'intreccio della termodinamica acustica del potting
                epossidico alla densità militare del Cu-W sopprime i vettori forensi acustici piezoelettrici in
                parallelo con l'assorbimento istantaneo di EMP.
              </li>
              <li>
                <strong>Effimera Crittografica Rad-Hard:</strong> L'abolizione della persistenza elettronica
                tramite SRAM PUF, solidificata dall'XMSS post-quantistico (NIST SP 800-208) e sopravvivendo
                in memorie FRAM cristallografate, spazza via i pericoli dei microscopi forensi e del futuro quantistico.
              </li>
              <li>
                <strong>Salvaguardia Neurale di Plausibilità Attiva:</strong> I biomarcatori comportamentali
                (CapsNets) innescano una mutazione cibernetica indetettabile per la crittografia fantasma negabile
                sotto stress di coercizione in tempo reale.
              </li>
            </ol>

            <p>
              Unificando questi fronti di salvaguardia materiale e elaborazione cibernetica, il dispositivo
              si consacra come il <strong>baluardo e la frontiera immutabile dell'orizzonte degli eventi tangibile
              nella difesa inattaccabile del futuro della sovranità personale</strong>.
            </p>

          </div>{/* end prose */}

          {/* ─── References ─── */}
          <section className='mt-16 rounded-xl border border-neutral-800 bg-neutral-900/30 p-6'>
            <h2 className='text-lg font-bold text-white mb-4'>Riferimenti Scientifici</h2>
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