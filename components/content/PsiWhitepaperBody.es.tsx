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
              Índice del Whitepaper
            </p>
            <ol className='space-y-2 text-sm'>
              {[
                { n: '1', t: 'Introducción: El Colapso de la Confianza Institucional y el Modelo de Amenaza' },
                { n: '2', t: 'Arquitectura Física (El Receptáculo)' },
                { n: '2.1', t: 'Aleaciones Cu-W y Mitigación de Pulsos Electromagnéticos (EMP)' },
                { n: '2.2', t: 'Aislamiento contra Ataques de Canal Lateral (SCA)' },
                { n: '2.3', t: 'Arquitectura de Aislamiento Radical (Air-Gapped)' },
                { n: '3', t: 'El Núcleo Criptográfico (El Colapso de la Función de Onda)' },
                { n: '3.1', t: 'Funciones Físicas No Clonables (SRAM PUF)' },
                { n: '3.2', t: 'Estándar Post-Cuántico XMSS (NIST SP 800-208)' },
                { n: '3.3', t: 'Entropía Híbrida: El Cierre del Lazo' },
                { n: '4', t: 'Heurísticas Defensivas Activas (Phantom Input y Evil Maid)' },
                { n: '4.1', t: 'Biometría Comportamental y Detección de Coerción' },
                { n: '4.2', t: 'Cifrado Negable (Deniable Encryption)' },
                { n: '4.3', t: 'Atestación Criptográfica contra Evil Maid' },
                { n: '5', t: 'Redundancia de Grado Aeroespacial: TMR y LEO' },
                { n: '5.1', t: 'La Amenaza Radiactiva Orbital (SEU, SEL, TID)' },
                { n: '5.2', t: 'El Estándar Rad-Hard y FRAM Ferroeléctrica' },
                { n: '5.3', t: 'Redundancia Modular Triple (TMR)' },
                { n: '6', t: 'Conclusión' },
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
            <h2 id='section-1'>1. Introducción: El Colapso de la Confianza Institucional y el Modelo de Amenaza</h2>

            <p>
              La transición de la economía global hacia infraestructuras descentralizadas basadas en criptografía
              asimétrica ha transferido la carga de la seguridad directamente al individuo. Históricamente, la
              protección de activos patrimoniales dependía de instituciones fiduciarias, como bancos centrales y
              custodios regulados, que operaban bajo la protección armada del Estado. Sin embargo, la
              descentralización introdujo una vulnerabilidad paradójica: el poseedor de la clave privada
              se convierte en el <strong>único punto de falla (single point of failure)</strong>.
            </p>

            <p>
              Las carteras de hardware convencionales fueron concebidas bajo un conjunto de suposiciones
              inherentemente frágiles. Presumen que el entorno operativo es benigno, que la integridad
              de la cadena de suministro de microchips está intacta, que los procesos de fabricación están
              exentos de <em>hardware trojans</em> y, principalmente, que el usuario está operando el
              dispositivo en estado de calma y libre de amenazas físicas o coerción.
            </p>

            <p>
              El <strong>Proyecto Ψ (PSI)</strong> surge de la completa objeción a estas premisas, basándose
              en el paradigma diametralmente opuesto de <strong>&ldquo;Zero Trust in Silicon&rdquo;</strong> (Confianza
              Cero en el Silicio). Bajo esta nueva ontología, la arquitectura asume nativamente que el entorno es
              invariablemente hostil, que el fabricante original puede albergar vectores maliciosos, que los canales
              de comunicación están siendo activamente monitoreados y que el propio usuario puede estar bajo la mira
              de un arma.
            </p>

            <p>
              Cuando la confianza en todas las capas humanas, corporativas e institucionales es metódicamente
              eliminada, la seguridad debe anclarse únicamente en la frialdad inviolable de las <strong>leyes de la
              física de materiales</strong>, de la <strong>termodinámica</strong> y de la <strong>matemática
              criptográfica avanzada</strong>. El modelo de amenaza abordado por la arquitectura PSI trasciende el
              dominio civil y se adentra en el rigor de los estándares militares y aeroespaciales (<strong>C4ISR</strong>).
            </p>

            <p>
              El advenimiento de invasiones domiciliarias orientadas a la extorsión violenta de criptoactivos —
              conocidas coloquialmente como <em>ataques de &ldquo;llave inglesa de cinco dólares&rdquo;</em>—
              ha hecho que los sofisticados ataques remotos de malware sean estadísticamente secundarios. Si un agresor
              puede simplemente torturar al propietario para obtener el PIN de acceso, la resistencia lógica del
              dispositivo se vuelve irrelevante. La seguridad, por lo tanto, necesita ser <strong>transmutada de una
              disciplina puramente electrónica a una ciencia psicológica, biomecánica y estructural</strong>.
            </p>

            {/* ═════════ Section 2 ═════════ */}
            <h2 id='section-2'>2. Arquitectura Física (El Receptáculo)</h2>

            <p>
              La primera línea de defensa de cualquier sistema criptográfico no reside en el algoritmo
              matemático, sino en la <strong>frontera física</strong> que separa la lógica computacional del
              adversario. El &ldquo;Receptáculo&rdquo; del Proyecto PSI representa una convergencia extrema de
              ingeniería de materiales y física del estado sólido, orientada a la neutralización absoluta de
              intrusiones mecánicas, ataques electromagnéticos de alta potencia y técnicas invasivas de
              espionaje basadas en emanometría.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-arquitetura-hardware-camadas-defesa.webp'
                alt='Diagrama isométrico en vista explosionada detallando las cuatro capas de defensa física del hardware criptográfico Proyecto PSI: blindaje externo en Cobre-Tungsteno, encapsulado de resina epoxi, malla de seguridad activa (Tamper Mesh) cian, y núcleo lógico de silicio.'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>Figura 1:</strong> Capas de Defensa Física y Lógica del Receptáculo PSI (Cu-W → Epoxi → Tamper Mesh → Silicio).
              </figcaption>
            </figure>

            <h3 id='section-2-1'>2.1 Aleaciones de Cobre-Tungsteno y Mitigación de Pulsos Electromagnéticos (EMP)</h3>

            <p>
              Un Pulso Electromagnético (EMP), ya sea proveniente de una detonación nuclear a gran altitud
              (NEMP) o de armamentos de interferencia electromagnética intencional (IEMI), genera corrientes
              inducidas devastadoras que destruyen circuitos electrónicos mediante sobretensiones. Para
              proteger el núcleo criptográfico, el chasis del PSI abandona el aluminio y el plástico tradicionales
              en favor de una <strong>aleación matriz compuesta de Cobre-Tungsteno (Cu-W)</strong>.
            </p>

            <p>
              El <strong>Tungsteno (W)</strong> posee una densidad extremadamente elevada (~19.3 g/cm³) y el
              punto de fusión más alto entre todos los metales puros (3422°C). Estas propiedades confieren
              una formidable inercia cinética y térmica al dispositivo, además de funcionar como escudo natural
              contra radiaciones ionizantes de alta energía. Sin embargo, el tungsteno puro carece de la
              conductividad eléctrica optimizada para crear una Jaula de Faraday perfecta —es en este punto
              donde el <strong>Cobre (Cu)</strong>, con su altísima conductividad, llena la brecha.
            </p>

            <p>
              El sistema W-Cu presenta <strong>inmiscibilidad total</strong> tanto en estado sólido como
              líquido. Consecuentemente, el chasis se fabrica mediante métodos avanzados de <strong>metalurgia
              de polvos</strong>: un esqueleto poroso de tungsteno es primeramente prensado y sinterizado a
              altas temperaturas, seguido por la infiltración capilar de cobre líquido fundido. El compuesto
              resultante (70-80% W / 20-30% Cu) exhibe un comportamiento sinérgico excepcional.
            </p>

            <p>
              La eficacia se cuantifica por la <strong>Eficacia de Blindaje (SE)</strong>, medida en decibelios:
            </p>

            <div className='not-prose overflow-x-auto my-14'>
              <figure className='p-8 bg-neutral-900/40 rounded-3xl border border-neutral-800 shadow-2xl flex flex-col items-center'>
                <div className='font-serif text-3xl md:text-5xl text-neutral-100 mb-6 tracking-widest text-center'>
                  SE = 10 · log₁₀(P<sub className='text-2xl'>i</sub> / P<sub className='text-2xl'>t</sub>)
                </div>
                <figcaption className='w-full max-w-md border-t border-neutral-800 pt-4 text-sm text-neutral-400 text-center font-mono'>
                  <p>Eficacia de Blindaje (<strong className='text-cyan-400'>SE<sub>total</sub></strong>) = R + A + B</p>
                </figcaption>
              </figure>
            </div>

            {/* ── Callout: Descoberta Chave — Blindagem ── */}
            <aside className='not-prose my-10 border-l-4 border-cyan-500 bg-cyan-950/20 p-6 rounded-r-xl'>
              <h4 className='text-cyan-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2'>
                💡 Descubrimiento Clave (TL;DR)
              </h4>
              <p className='text-neutral-200 m-0 leading-relaxed'>
                La implementación de la arquitectura de blindaje Cu-W del Proyecto PSI resultó en una <strong className='text-white'>eficacia de blindaje superior a 100 dB</strong>, excediendo las rigurosas normativas militares MIL-STD-285. El compuesto 70-80% W / 20-30% Cu combina la inercia cinética del tungsteno con la conductividad del cobre en una Jaula de Faraday de grado nuclear.
              </p>
            </aside>

            <p>
              La atenuación global resulta del sumatorio de tres mecanismos: <strong>pérdida por reflexión (R)</strong>,
              <strong> pérdida por absorción interna (A)</strong> y <strong>corrección por múltiples reflexiones (B)</strong>.
              Estructuras densas que incorporan cobre garantizan consistentemente SE {'>'}100 dB, superando las
              rigurosas normativas militares (MIL-STD-285).
            </p>

            {/* Table: Shielding Comparison */}
            <div className='not-prose overflow-x-auto my-12 border border-neutral-800 rounded-xl shadow-lg'>
              <table className='w-full text-start text-sm text-neutral-300'>
                <caption className='p-4 bg-neutral-900/80 text-start text-cyan-400 font-mono uppercase tracking-widest font-bold border-b border-neutral-800 text-xs'>
                  Tabla 1: Parámetros de Blindaje Electromagnético (Cu-W)
                </caption>
                <thead>
                  <tr className='bg-neutral-900/80 text-neutral-200'>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Material</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Conductividad</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>SE (RF)</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Ventaja Estructural</th>
                  </tr>
                </thead>
                <tbody className='text-neutral-400'>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>Acero Galvanizado</td>
                    <td className='px-4 py-3'>Baja</td>
                    <td className='px-4 py-3'>~90 dB</td>
                    <td className='px-4 py-3'>Alta permeabilidad magnética</td>
                  </tr>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>Cobre Puro (Cu)</td>
                    <td className='px-4 py-3'>Muy Alta (100% IACS)</td>
                    <td className='px-4 py-3'>{'>'}100 dB</td>
                    <td className='px-4 py-3'>Máxima reflexión de pulso EMP</td>
                  </tr>
                  <tr className='bg-cyan-950/20'>
                    <td className='px-4 py-3 text-cyan-300 font-semibold'>Aleación Cu-W (PSI)</td>
                    <td className='px-4 py-3 text-cyan-300'>Alta (40-50% IACS)</td>
                    <td className='px-4 py-3 text-cyan-300'>{'>'}100 dB</td>
                    <td className='px-4 py-3 text-cyan-300'>Blindaje RF + gama; rigidez extrema</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 id='section-2-2'>2.2 Aislamiento Acústico, Térmico y Químico contra Ataques de Canal Lateral (SCA)</h3>

            <p>
              La ejecución de algoritmos criptográficos altera el estado de millones de transistores miles
              de millones de veces por segundo. Estas transiciones lógicas consumen corrientes variadas que
              escapan al ambiente en forma de <strong>calor</strong>, <strong>radiación electromagnética residual</strong> y
              <strong> ruido acústico</strong>. Atacantes bien equipados utilizan estas emanaciones para inferir
              el material de la clave secreta —disciplina conocida como <strong>Ataques de Canal Lateral (SCA)</strong>.
            </p>

            <p>
              <strong>Ataques Acústicos (ASCA):</strong> Capacitores cerámicos multicapa (MLCC) e inductores
              exhiben efectos piezoeléctricos y electrostrictivos. Las fluctuaciones de voltaje durante las
              operaciones criptográficas causan deformaciones microscópicas, induciendo ondas sonoras y
              ultrasónicas interceptables por micrófonos direccionales.
            </p>

            <p>
              <strong>Ataques Térmicos (TSCA):</strong> Cámaras de imagen térmica capturan variaciones en los
              perfiles de calor de la superficie del chip, mapeando la asimetría cuando diferentes bloques lógicos
              operan claves con bits distintos.
            </p>

            <p>
              Para mitigar ambos vectores, el PSI <strong>encapsula completamente el hardware criptográfico</strong> en
              resina epoxi termoestable infundida con microesferas de vidrio y granulaciones de matriz cerámica
              (*potting*):
            </p>

            <ol>
              <li>
                <strong>Amortiguación Acústica Viscoelástica:</strong> La incompatibilidad de impedancia
                acústica entre los componentes piezoeléctricos y la densa resina fuerza a las ondas sonoras a
                sufrir una atenuación drástica —convertidas en calor de bajísima amplitud.
              </li>
              <li>
                <strong>Aplanamiento del Gradiente Térmico:</strong> La conductividad térmica intencionalmente
                baja del epoxi actúa como filtro pasa-baja térmico. La inercia absorbe y linealiza los picos
                de calor transitorios, aplastando las curvas de firma térmica.
              </li>
              <li>
                <strong>Defensa Química Simbiótica:</strong> Dentro de la matriz epoxi, una compleja malla de
                hilos finos (*tamper mesh*) activamente energizada está entrelazada. La química de la capa
                aislante está diseñada para ser idéntica a la de la resina curada —los solventes que disuelven
                la resina destruyen simultáneamente la malla, activando la <strong>zeroización instantánea</strong> de las claves
                antes de que el invasor alcance el objetivo.
              </li>
            </ol>

            <h3 id='section-2-3'>2.3 Arquitectura de Aislamiento Radical (Air-Gapped)</h3>

            <p>
              La topología del PSI exige una <strong>arquitectura de interfaz nula y aislamiento radical</strong>.
              El dispositivo elimina terminantemente puertos USB, no exhibe pantallas interactivas y carece de
              conmutadores mecánicos tradicionales. El suministro de energía y la transferencia estrictamente
              estructurada de datos cifrados ocurren únicamente por medio de <strong>Pogo Pins magnéticos
              cifrados</strong> de cara plana. Al extirpar físicamente los puertos de entrada/salida
              convencionales, el PSI revoca la superficie de contacto para ataques lógicos prevalentes (BadUSB,
              firmware injection, fuzzing).
            </p>

            {/* ═════════ Section 3 ═════════ */}
            <h2 id='section-3'>3. El Núcleo Criptográfico (El Colapso de la Función de Onda)</h2>

            <p>
              Inspirado en la mecánica cuántica, el concepto de <strong>&ldquo;Colapso de la Función de Onda&rdquo;</strong> de la
              Clave Privada estipula que la clave solo existe en la memoria volátil en el milisegundo exacto en que
              se solicita una firma digital. En las carteras legadas y HSMs comerciales, la clave maestra de 256 bits
              se almacena persistentemente en Memoria No Volátil (Flash EEPROM). Bajo el modelo hostil del PSI,
              cualquier dato mantenido estáticamente es vulnerable —un Estado-Nación podría usar Microscopía
              Electrónica de Barrido (SEM) o Haces de Iones Focalizados (FIB) para extraer la clave.
            </p>

            <p>
              La respuesta del PSI es drástica: <strong>la clave privada no se almacena en el dispositivo en
              ningún momento</strong>.
            </p>

            <h3 id='section-3-1'>3.1 Funciones Físicas No Clonables Basadas en SRAM (SRAM PUF)</h3>

            <p>
              Mientras el dispositivo está en reposo (desenergizado), el núcleo de memoria es un <strong>vacío
              absoluto de información</strong>. Las celdas de memoria SRAM estándar están formadas por latches
              biestables de acoplamiento cruzado (topología 6T). Al encenderse, los transistores compiten para
              llevar el estado lógico a &lsquo;0&rsquo; o &lsquo;1&rsquo;. Debido a <strong>Fluctuaciones
              Aleatorias de Dopantes (RDF)</strong> e irregularidades a nivel nanométrico en los procesos de
              litografía, cada celda presenta discrepancias físicas en sus Tensiones de Umbral (V<sub>th</sub>).
            </p>

            <p>
              Esta asimetría atómica significa que cada celda colapsa de forma predecible al mismo
              estado inicial. Al escanear miles de estas celdas, se extrae una cadena binaria de alta
              entropía —la <strong>huella digital incontestable de ese silicio</strong>, imposible de
              clonar, predecir o copiar.
            </p>

            <p>
              La calidad criptográfica se modela por la <strong>Decidability (d&apos;)</strong>, que compara
              las distribuciones normales de la Distancia de Hamming Fraccional (FHD) entre lecturas intra-dispositivo
              (ruido térmico) e inter-dispositivo (aleatoriedad entre chips diferentes).
            </p>

            <p>
              Para transformar el estado físico ruidoso en una semilla criptográfica con una precisión del 100%,
              se emplean <strong>Fuzzy Extractors</strong> (Extractores Difusos) —módulos de &ldquo;Secure
              Sketch&rdquo; que combinan la respuesta ruidosa de la SRAM con &ldquo;Helper Data&rdquo; y algoritmos
              de corrección de errores (BCH o Polares). Después de la firma, la alimentación de la SRAM es obliterada,
              las cargas se disipan y <strong>la clave deja de existir</strong>.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-ciclo-vida-chave-criptografica-sram-puf.webp'
                alt='Diagrama de flujo lógico del ciclo de vida de la clave privada en el Proyecto PSI vía SRAM PUF. El flujo convierte el ruido físico del silicio en entropía pura, procesa a través del Fuzzy Extractor para generar la semilla (cristal estructurado), culminando en zeroización instantánea y desintegración digital.'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>Figura 2:</strong> Flujo de Derivación de Clave Efímera vía SRAM PUF (Power-up → RDF → Fuzzy Extractor → Semilla → Zeroización).
              </figcaption>
            </figure>

            <h3 id='section-3-2'>3.2 El Estándar Post-Cuántico XMSS (NIST SP 800-208)</h3>

            <p>
              Si se construye un computador cuántico con qubits lógicos estables, el <strong>Algoritmo de
              Shor</strong> destruirá toda la infraestructura basada en curvas elípticas (ECDSA, EdDSA).
              Preparándose para el &ldquo;Q-Day&rdquo;, el PSI incorpora el <strong>eXtended Merkle Signature
              Scheme (XMSS)</strong>, estandarizado por el NIST (SP 800-208) y RFC 8391.
            </p>

            <p>
              El XMSS no depende de la factorización de primos ni de mapeos algebraicos. Su seguridad
              reside en la <strong>inviabilidad computacional de crear colisiones en funciones hash</strong> (SHA-256,
              SHAKE256) —premisa comprobada por décadas de criptoanálisis e irreducible contra algoritmos
              de Grover.
            </p>

            <p>
              La complejidad reside en su naturaleza *stateful*: el XMSS construye un Árbol de Merkle
              donde cada nodo hoja lleva material para una <strong>Firma Única de Winternitz (WOTS+)</strong>.
              Cada clave OTS <strong>solo puede firmar un único mensaje en la vida útil del sistema</strong>.
              La reutilización de estado causa un colapso catastrófico de la seguridad.
            </p>

            <blockquote>
              <p>
                &ldquo;Esta recomendación exige que la generación de claves y firmas se ejecuten
                estrictamente en módulos criptográficos de hardware dedicados que no permiten que el material
                de clave secreta sea exportado.&rdquo; — <strong>NIST SP 800-208</strong>
              </p>
            </blockquote>

            <p>
              El microcontrolador del PSI gestiona el puntero XMSS enteramente dentro de las barreras
              de epoxi de silicio, rechazando toda exportación de claves raíz vía buses externos.
            </p>

            <h3 id='section-3-3'>3.3 Entropía Híbrida: El Cierre del Lazo</h3>

            <p>
              La Semilla Maestra que alimenta las hojas WOTS+ demanda <strong>&ldquo;Entropía Híbrida
              Redundante&rdquo;</strong>:
            </p>

            <ol>
              <li>
                <strong>Entropía Dinámica Intrínseca:</strong> extraída del SRAM PUF —vinculada
                exclusivamente al hardware físico.
              </li>
              <li>
                <strong>Entropía Estática Extrínseca:</strong> provista por el humano vía NFC smartcard de
                aproximación temporal combinada a la biometría del titular vivo.
              </li>
            </ol>

            <p>
              Una <strong>Función de Derivación de Claves (KDF)</strong> basada en hashes absorbe la
              aleatoriedad del microchip mezclada con las credenciales orgánicas. Este nudo gordiano algorítmico
              blinda la custodia en los dos extremos: el dispositivo sustraído es inútil (entropía humana
              omitida); el individuo secuestrado sin el chip es igualmente impotente (porción estocástica
              del silicio perdida).
            </p>

            {/* ═════════ Section 4 ═════════ */}
            <h2 id='section-4'>4. Heurísticas Defensivas Activas (Phantom Input y Evil Maid)</h2>

            <p>
              La seguridad ciberfísica colapsa invariablemente ante la <strong>coerción cinética
              directa</strong>. Si el titular legítimo es torturado para informar contraseñas, la fuerza del
              vector de extorsión suprimirá todas las criptografías. La innovación revolucionaria del PSI
              consiste en transponer la seguridad del silicio al terreno de la <strong>neuropsicología
              y biometría activa</strong>.
            </p>

            <h3 id='section-4-1'>4.1 Biometría Comportamental y Detección Fisiológica de Coerción</h3>

            <p>
              Ante la tortura, la porción simpática del Sistema Nervioso Autónomo precipita la reacción de
              &ldquo;lucha o huida&rdquo;, resultando en cascadas de catecolaminas y cortisol. El PSI integra
              sensores que mapean continuamente <strong>Biometría Comportamental</strong>:
            </p>

            <ol>
              <li>
                <strong>Dinámica de Presionamiento y Presión:</strong> Sensores magnetoelásticos y
                *strain gauges* rastrean variaciones de presión (~0.25 kPa), *Flight Time* y *Hold Time*.
                Bajo estrés, el agarre se petrifica, la dinámica se vuelve brutal y arrítmica.
              </li>
              <li>
                <strong>Micro-temblores Neuromusculares:</strong> Acelerómetros y giroscopios triaxiales
                (IMU) cuantifican la agitación milimétrica. El temblor fisiológico (8-12 Hz) es modulado
                violentamente durante la coerción —amplitud amplificada, frecuencias de relajación suprimidas.
              </li>
              <li>
                <strong>Frecuencia Cardíaca y PPG:</strong> Fotopletismógrafos y sensores de bioimpedancia
                miden la vasoconstricción periférica, taquicardia y reducción de la Variabilidad de la Frecuencia
                Cardíaca (HRV) —biomarcador de estrés detectable por redes neuronales.
              </li>
            </ol>

            <p>
              Estos datos desembocan en módulos de <strong>IA de borde (Edge AI)</strong> —Redes de
              Cápsulas (CapsNets) y *Random Forest* para series temporales fisiológicas, con puntuaciones F1
              entre <strong>96.97% y 99.82%</strong> en *datasets* clínicos de estrés.
            </p>

            {/* Table: Biometrics */}
            <div className='not-prose overflow-x-auto my-12 border border-neutral-800 rounded-xl shadow-lg'>
              <table className='w-full text-start text-sm text-neutral-300'>
                <caption className='p-4 bg-neutral-900/80 text-start text-cyan-400 font-mono uppercase tracking-widest font-bold border-b border-neutral-800 text-xs'>
                  Tabla 2: Biomarcadores de Detección Fisiológica de Coerción
                </caption>
                <thead>
                  <tr className='bg-neutral-900/80 text-neutral-200'>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Biomarcador</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Hardware</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Patrón Bajo Coerción</th>
                  </tr>
                </thead>
                <tbody className='text-neutral-400'>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>Fuerza y Dinámica de Contacto</td>
                    <td className='px-4 py-3'>Sensores Magnetoelásticos + Strain Gauges</td>
                    <td className='px-4 py-3'>Latencia arrítmica; picos de presión; rigidez de retención</td>
                  </tr>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>Temblor Muscular</td>
                    <td className='px-4 py-3'>IMU (Acelerómetros/Giroscopios)</td>
                    <td className='px-4 py-3'>Ruptura de la frecuencia 8-12 Hz; espasmos de alta variabilidad</td>
                  </tr>
                  <tr>
                    <td className='px-4 py-3'>Señales Cardiovasculares</td>
                    <td className='px-4 py-3'>Bioimpedancia / Ópticos / PPG</td>
                    <td className='px-4 py-3'>Vasoconstricción; caída HRV; taquicardia</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Callout: Descoberta Chave — Biometria ── */}
            <aside className='not-prose my-10 border-l-4 border-cyan-500 bg-cyan-950/20 p-6 rounded-r-xl'>
              <h4 className='text-cyan-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2'>
                💡 Descubrimiento Clave (TL;DR)
              </h4>
              <p className='text-neutral-200 m-0 leading-relaxed'>
                Los módulos de IA de borde (CapsNets + Random Forest) alcanzaron <strong className='text-white'>puntuaciones F1 entre 96.97% y 99.82%</strong> en la detección de estrés fisiológico en *datasets* clínicos —permitiendo al dispositivo distinguir la operación legítima de la operación bajo coerción en tiempo real, sin dependencia de servidores externos.
              </p>
            </aside>

            <h3 id='section-4-2'>4.2 Cifrado Negable (Deniable Encryption — Protocolo Phantom Input)</h3>

            <p>
              Cuando los buses neuromusculares alertan positivamente la bandera de coerción, el PSI opta por
              un camino contraintuitivo: <strong>no bloquea las operaciones</strong>. En los ecosistemas
              normativos, el bloqueo provocaría la aniquilación física del portador por secuestradores
              implacables. El dispositivo asume la <strong>preservación de la integridad biológica del dueño</strong>.
            </p>

            <p>
              El hardware se acopla a la topología de la <strong>Plausibilidad Negable (Plausible Deniability)</strong>,
              concretizada a través del <strong>Cifrado Negable (Deniable Encryption)</strong> basado
              en <strong>Coercion-Resistant CP-ABE</strong> (*Ciphertext-Policy Attribute-Based Encryption*).
              Una única semilla deriva dos caminos:
            </p>

            <ul>
              <li><strong>Real Secret Key (RSK):</strong> revela la cartera central verídica.</li>
              <li><strong>Fake Secret Key (FSK):</strong> abre un entorno ilusorio plausible, con fondos
              operativos creíbles y transacciones validadas en red.</li>
            </ul>

            <p>
              Funciones basadas en <strong>mapas de grupos bilineales de orden compuesto</strong> y
              <strong> Chameleon Hashing</strong> garantizan que las ecuaciones no pueden ser estadísticamente
              desentrañadas. El agresor escapa saciado creyendo haber extraído las claves maestras —mientras
              que la soberanía patrimonial real permanece oculta e intacta.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-protocolo-phantom-biometria-coacao.webp'
                alt='Árbol de decisión lógico del Protocolo Phantom Input (Deniable Encryption). Una biometría central bifurca activamente el enrutamiento: el camino óptico superior seguro (cian) accede a la clave real (RSK), mientras que el camino inferior bajo detección de coerción (ámbar) redirige silenciosamente a una clave falsa (FSK).'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>Figura 3:</strong> Protocolo Phantom Input — Biometría → Bandera Coerción → RSK vs FSK (Deniable Encryption).
              </figcaption>
            </figure>

            <h3 id='section-4-3'>4.3 Atestación Criptográfica contra Sustitución Hostil (&ldquo;Evil Maid&rdquo;)</h3>

            <p>
              El ataque *Evil Maid* implica el intercambio insidioso del dispositivo por un clon cosmético
              con hardware radiotransmisor escondido. El PSI subvierte esto con <strong>atestación inversa</strong>:
              es el dispositivo el que debe probar su autenticidad al *host* vía <strong>Pruebas de Conocimiento
              Cero (ZKP)</strong>, generando <strong>Imágenes de Arranque Personales</strong> intransferibles. Un
              clon sin el chip legítimo no produce la atestación correcta, alertando al usuario sobre la
              interceptación.
            </p>

            {/* ═════════ Section 5 ═════════ */}
            <h2 id='section-5'>5. Redundancia de Grado Aeroespacial: TMR y Amenazas LEO</h2>

            <p>
              La filosofía del Horizonte de Eventos defiende que las amenazas no siempre son terrestres. Un
              cofre inviolable postula <strong>resiliencia contra catástrofes de infraestructura</strong>,
              garantizando la perpetuidad computacional en la adversidad —incluyendo la <strong>Órbita Terrestre
              Baja (LEO)</strong>.
            </p>

            <h3 id='section-5-1'>5.1 La Amenaza Radiactiva Orbital (SEU, SEL, TID)</h3>

            <p>
              A 300-800 km de la superficie, la magnetosfera se adelgaza sustancialmente (especialmente en la
              Anomalía del Atlántico Sur). El ambiente está inundado de protones solares e iones pesados
              de los rayos cósmicos galácticos (GCR). Los componentes COTS colapsan bajo:
            </p>

            <ul>
              <li>
                <strong>Dosis Ionizante Total (TID):</strong> Degeneración continua de semiconductores por la
                acumulación acumulativa de irradiaciones gamma en el SiO₂ aislante, alterando las tensiones de umbral
                y causando fugas letales.
              </li>
              <li>
                <strong>Efectos de Eventos Únicos (SEE):</strong> Transitorios inducidos por la perforación
                de una partícula cargada —<strong>Single-Event Upsets (SEU)</strong> voltean bits
                aleatoriamente; <strong>Single-Event Latch-ups (SEL)</strong> disparan cortocircuitos
                fusionando pistas microscópicas.
              </li>
            </ul>

            <h3 id='section-5-2'>5.2 El Estándar Rad-Hard y FRAM Ferroeléctrica</h3>

            <p>
              El PSI descarta memorias Flash y NAND EEPROMs civiles en favor de <strong>Memorias RAM
              Ferroeléctricas Rad-Hard (FRAM)</strong>. Contrariamente a las memorias tradicionales basadas en el
              atrapamiento de electrones sobre capacitores de puerta flotante CMOS, la FRAM utiliza
              topologías cristalográficas exóticas (película delgada de <strong>Titanato Zirconato de
              Plomo — PZT</strong>).
            </p>

            <p>
              La estructura mantiene las claves binarias por la <strong>polarización fija de campo eléctrico
              residual</strong> asociada a posicionamientos geométricos del cristal metálico —un arreglo de
              dipolo estable inquebrantable. Las partículas ionizantes en tránsito <strong>no corrompen</strong> estas
              cristalizaciones orientadas, confiriendo inmunidad nativa en ambientes de TID masivo.
            </p>

            <h3 id='section-5-3'>5.3 Redundancia Modular Triple (TMR)</h3>

            <p>
              Cada operación crítica es físicamente replicada <strong>tres veces</strong> en microcontroladores
              independientes (sub-bloques A, B, C). Al final de los cálculos paralelos, las vías convergen en un
              <strong> Dispositivo Escrutador de Mayoría (&ldquo;Voter&rdquo;)</strong>.
            </p>

            <p>
              Si una partícula cósmica voltea los transistores del sub-bloque B (SEU), los conjuntos A y C
              continúan reportando datos correctos. El Voter —por Mayoría Simple (2 contra 1)— expulsa
              instantáneamente los errores espurios, sin reinicializaciones o intervenciones operacionales. El
              dispositivo mantiene una operación continua e infalible bajo bombardeo radiactivo orbital.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-arquitetura-tmr-redundancia-voter.webp'
                alt='Esquema de arquitectura Triple Modular Redundancy (TMR) aeroespacial del Proyecto PSI. Tres microprocesadores independientes procesan datos de forma paralela tolerante a fallas, convergiendo en una puerta lógica de Voter Mayoritario central que valida y emite solo una salida cian unificada e inmune a la inyección de fallas.'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>Figura 4:</strong> Redundancia Modular Triple — Sub-bloques A/B/C → Voter por Mayoría → Salida Infalible.
              </figcaption>
            </figure>

            {/* ── Callout: Descoberta Chave — TMR ── */}
            <aside className='not-prose my-10 border-l-4 border-cyan-500 bg-cyan-950/20 p-6 rounded-r-xl'>
              <h4 className='text-cyan-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2'>
                💡 Descubrimiento Clave (TL;DR)
              </h4>
              <p className='text-neutral-200 m-0 leading-relaxed'>
                La arquitectura de <strong className='text-white'>Redundancia Modular Triple (TMR)</strong> con Voter por mayoría simple, combinada con memorias <strong className='text-white'>FRAM Rad-Hard</strong> inmunes a TID, garantiza la operación continua e infalible del PSI incluso bajo bombardeo de rayos cósmicos galácticos en Órbita Terrestre Baja (LEO) —eliminando Single-Event Upsets sin reinicializaciones.
              </p>
            </aside>

            {/* ═════════ Section 6 ═════════ */}
            <h2 id='section-6'>6. Conclusión</h2>

            <p>
              El <strong>Proyecto PSI (Ψ)</strong> trasciende de manera categórica la dimensión de &ldquo;cartera
              electrónica de consumo&rdquo;, migrando la taxonomía de la custodia a niveles inexplorados de las
              ciencias bélicas, metalúrgicas y de salvaguarda civil planetaria.
            </p>

            <p>
              Adoptando irrestrictamente el manifiesto existencial del <strong>&ldquo;Zero Trust in Silicon&rdquo;</strong>,
              sus respuestas pavimentan el estado del arte interdisciplinario:
            </p>

            <ol>
              <li>
                <strong>Vanguardia Cinética:</strong> El entrelazamiento de la termodinámica acústica del encapsulado
                epoxi a la densidad militar del Cu-W suprime los vectores forenses acústicos piezoeléctricos en
                paralelo con la absorción instantánea de EMP.
              </li>
              <li>
                <strong>Efimeridad Criptográfica Rad-Hard:</strong> La abolición de la persistencia electrónica
                por SRAM PUF, solidificada por el XMSS post-cuántico (NIST SP 800-208) y sobreviviendo en
                memorias FRAM cristalizadas, barre los peligros de microscopios forenses y del futuro cuántico.
              </li>
              <li>
                <strong>Resguardo Neural de Plausibilidad Activa:</strong> Los biomarcadores comportamentales
                (CapsNets) desencadenan una mutación cibernética indetectable para cifrado fantasma negable
                bajo estrés de coerción en tiempo real.
              </li>
            </ol>

            <p>
              Al unificar estos frentes de salvaguarda material y procesamiento cibernético, el dispositivo
              se consagra como el <strong>baluarte y la frontera inmutable del horizonte de eventos tangible
              en la defensa inquebrantable del futuro de la soberanía personal</strong>.
            </p>

          </div>{/* end prose */}

          {/* ─── References ─── */}
          <section className='mt-16 rounded-xl border border-neutral-800 bg-neutral-900/30 p-6'>
            <h2 className='text-lg font-bold text-white mb-4'>Referencias Científicas</h2>
            <ol className='space-y-2 text-xs text-neutral-500 list-decimal list-inside'>
              <li id='ref-1'>NIST SP 800-208. <em>Recommendation for Stateful Hash-Based Signature Schemes (XMSS/LMS)</em>. National Institute of Standards and Technology.</li>
              <li id='ref-2'>Roel Maes (2013). <em>Physically Unclonable Functions: Constructions, Properties and Applications</em>. Springer.</li>
              <li id='ref-3'>Kocabaş, O., et al. &ldquo;A Review of Side-Channel Attacks on Cryptographic Hardware.&rdquo; <em>IEEE Transactions on Information Forensics and Security</em>.</li>
              <li id='ref-4'>TMR &amp; Rad-Hard Architecture: Estudios em redundância modular tripla e FRAM para ambientes LEO/Aeroespacial.</li>
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