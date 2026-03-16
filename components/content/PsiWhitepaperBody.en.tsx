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
              Whitepaper Index
            </p>
            <ol className='space-y-2 text-sm'>
              {[
                { n: '1', t: 'Introduction: The Collapse of Institutional Trust and the Threat Model' },
                { n: '2', t: 'Physical Architecture (The Receptacle)' },
                { n: '2.1', t: 'Cu-W Alloys and Electromagnetic Pulse (EMP) Mitigation' },
                { n: '2.2', t: 'Isolation against Side-Channel Attacks (SCA)' },
                { n: '2.3', t: 'Radical Isolation Architecture (Air-Gapped)' },
                { n: '3', t: 'The Cryptographic Core (The Wave Function Collapse)' },
                { n: '3.1', t: 'Physical Unclonable Functions (SRAM PUF)' },
                { n: '3.2', t: 'Post-Quantum Standard XMSS (NIST SP 800-208)' },
                { n: '3.3', t: 'Hybrid Entropy: Closing the Loop' },
                { n: '4', t: 'Active Defensive Heuristics (Phantom Input and Evil Maid)' },
                { n: '4.1', t: 'Behavioral Biometrics and Coercion Detection' },
                { n: '4.2', t: 'Deniable Encryption' },
                { n: '4.3', t: 'Cryptographic Attestation against Evil Maid' },
                { n: '5', t: 'Aerospace-Grade Redundancy: TMR and LEO' },
                { n: '5.1', t: 'The Orbital Radiation Threat (SEU, SEL, TID)' },
                { n: '5.2', t: 'The Rad-Hard Standard and Ferroelectric FRAM' },
                { n: '5.3', t: 'Triple Modular Redundancy (TMR)' },
                { n: '6', t: 'Conclusion' },
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
            <h2 id='section-1'>1. Introduction: The Collapse of Institutional Trust and the Threat Model</h2>

            <p>
              The global economy&apos;s transition to decentralized infrastructures based on asymmetric cryptography
              has shifted the burden of security directly onto the individual. Historically, the
              protection of patrimonial assets relied on fiduciary institutions, such as central banks and
              regulated custodians, operating under the armed protection of the State. However,
              decentralization introduced a paradoxical vulnerability: the private key holder
              becomes the <strong>single point of failure</strong>.
            </p>

            <p>
              Conventional hardware wallets were designed under a set of inherently fragile
              assumptions. They presume that the operating environment is benign, that the integrity
              of the microchip supply chain is intact, that manufacturing processes are
              free from <em>hardware trojans</em>, and, crucially, that the user is operating the
              device in a calm state, free from physical threats or coercion.
            </p>

            <p>
              <strong>Project Ψ (PSI)</strong> emerges from the complete rejection of these premises, based
              on the diametrically opposed paradigm of <strong>&ldquo;Zero Trust in Silicon&rdquo;</strong>.
              Under this new ontology, the architecture natively assumes that the environment is
              invariably hostile, that the original manufacturer may harbor malicious vectors, that
              communication channels are actively monitored, and that the user themselves may be
              under duress.
            </p>

            <p>
              When trust in all human, corporate, and institutional layers is methodically
              eliminated, security must be anchored solely in the inviolable coldness of the <strong>laws of
              material physics</strong>, <strong>thermodynamics</strong>, and <strong>advanced cryptographic
              mathematics</strong>. The threat model addressed by the PSI architecture transcends the
              civil domain and enters the rigor of military and aerospace standards (<strong>C4ISR</strong>).
            </p>

            <p>
              The advent of home invasions aimed at the violent extortion of crypto-assets —
              colloquially known as <em>&ldquo;five-dollar wrench attacks&rdquo;</em> —
              has rendered sophisticated remote malware attacks statistically secondary. If an aggressor
              can simply torture the owner to obtain the access PIN, the device&apos;s logical resistance
              becomes irrelevant. Security, therefore, needs to be <strong>transmuted from a
              purely electronic discipline into a psychological, biomechanical, and structural science</strong>.
            </p>

            {/* ═════════ Section 2 ═════════ */}
            <h2 id='section-2'>2. Physical Architecture (The Receptacle)</h2>

            <p>
              The first line of defense of any cryptographic system does not reside in the mathematical
              algorithm, but in the <strong>physical boundary</strong> that separates computational logic from
              the adversary. The PSI Project&apos;s &ldquo;Receptacle&rdquo; represents an extreme convergence of
              materials engineering and solid-state physics, aimed at the absolute neutralization of
              mechanical intrusions, high-power electromagnetic attacks, and invasive emanometric
              espionage techniques.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-arquitetura-hardware-camadas-defesa.webp'
                alt='Exploded isometric diagram detailing the four physical defense layers of the Project PSI cryptographic hardware: external Copper-Tungsten shielding, epoxy resin potting, cyan active security mesh (Tamper Mesh), and silicon logic core.'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>Figure 1:</strong> Physical and Logical Defense Layers of the PSI Receptacle (Cu-W → Epoxy → Tamper Mesh → Silicon).
              </figcaption>
            </figure>

            <h3 id='section-2-1'>2.1 Copper-Tungsten Alloys and Electromagnetic Pulse (EMP) Mitigation</h3>

            <p>
              An Electromagnetic Pulse (EMP), whether originating from a high-altitude nuclear
              detonation (NEMP) or from intentional electromagnetic interference (IEMI) weaponry,
              generates devastating induced currents that destroy electronic circuits through
              overvoltages. To protect the cryptographic core, the PSI chassis abandons traditional
              aluminum and plastic in favor of a <strong>Copper-Tungsten (Cu-W) composite matrix alloy</strong>.
            </p>

            <p>
              <strong>Tungsten (W)</strong> possesses extremely high density (~19.3 g/cm³) and the
              highest melting point among all pure metals (3422°C). These properties confer
              formidable kinetic and thermal inertia to the device, in addition to functioning as a
              natural shield against high-energy ionizing radiation. However, pure tungsten lacks the
              optimized electrical conductivity to create a perfect Faraday Cage — it is at this point
              that <strong>Copper (Cu)</strong>, with its very high conductivity, fills the gap.
            </p>

            <p>
              The W-Cu system exhibits <strong>total immiscibility</strong> in both solid and liquid
              states. Consequently, the chassis is manufactured by advanced <strong>powder metallurgy</strong>
              methods: a porous tungsten skeleton is first pressed and sintered at high temperatures,
              followed by capillary infiltration of molten liquid copper. The resulting composite
              (70-80% W / 20-30% Cu) exhibits exceptional synergistic behavior.
            </p>

            <p>
              Effectiveness is quantified by <strong>Shielding Effectiveness (SE)</strong>, measured in decibels:
            </p>

            <div className='not-prose overflow-x-auto my-14'>
              <figure className='p-8 bg-neutral-900/40 rounded-3xl border border-neutral-800 shadow-2xl flex flex-col items-center'>
                <div className='font-serif text-3xl md:text-5xl text-neutral-100 mb-6 tracking-widest text-center'>
                  SE = 10 · log₁₀(P<sub className='text-2xl'>i</sub> / P<sub className='text-2xl'>t</sub>)
                </div>
                <figcaption className='w-full max-w-md border-t border-neutral-800 pt-4 text-sm text-neutral-400 text-center font-mono'>
                  <p>Shielding Effectiveness (<strong className='text-cyan-400'>SE<sub>total</sub></strong>) = R + A + B</p>
                </figcaption>
              </figure>
            </div>

            {/* ── Callout: Descoberta Chave — Blindagem ── */}
            <aside className='not-prose my-10 border-l-4 border-cyan-500 bg-cyan-950/20 p-6 rounded-r-xl'>
              <h4 className='text-cyan-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2'>
                💡 Key Discovery (TL;DR)
              </h4>
              <p className='text-neutral-200 m-0 leading-relaxed'>
                The implementation of Project PSI&apos;s Cu-W shielding architecture resulted in a <strong className='text-white'>shielding effectiveness greater than 100 dB</strong>, exceeding rigorous military standards MIL-STD-285. The 70-80% W / 20-30% Cu composite combines tungsten&apos;s kinetic inertia with copper&apos;s conductivity in a nuclear-grade Faraday Cage.
              </p>
            </aside>

            <p>
              Overall attenuation results from the sum of three mechanisms: <strong>reflection loss (R)</strong>,
              <strong> internal absorption loss (A)</strong>, and <strong>multiple reflection correction (B)</strong>.
              Dense structures incorporating copper consistently ensure SE {'>'}100 dB, surpassing
              rigorous military standards (MIL-STD-285).
            </p>

            {/* Table: Shielding Comparison */}
            <div className='not-prose overflow-x-auto my-12 border border-neutral-800 rounded-xl shadow-lg'>
              <table className='w-full text-start text-sm text-neutral-300'>
                <caption className='p-4 bg-neutral-900/80 text-start text-cyan-400 font-mono uppercase tracking-widest font-bold border-b border-neutral-800 text-xs'>
                  Table 1: Electromagnetic Shielding Parameters (Cu-W)
                </caption>
                <thead>
                  <tr className='bg-neutral-900/80 text-neutral-200'>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Material</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Conductivity</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>SE (RF)</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Structural Advantage</th>
                  </tr>
                </thead>
                <tbody className='text-neutral-400'>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>Galvanized Steel</td>
                    <td className='px-4 py-3'>Low</td>
                    <td className='px-4 py-3'>~90 dB</td>
                    <td className='px-4 py-3'>High magnetic permeability</td>
                  </tr>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>Pure Copper (Cu)</td>
                    <td className='px-4 py-3'>Very High (100% IACS)</td>
                    <td className='px-4 py-3'>{'>'}100 dB</td>
                    <td className='px-4 py-3'>Maximum EMP pulse reflection</td>
                  </tr>
                  <tr className='bg-cyan-950/20'>
                    <td className='px-4 py-3 text-cyan-300 font-semibold'>Cu-W Alloy (PSI)</td>
                    <td className='px-4 py-3 text-cyan-300'>High (40-50% IACS)</td>
                    <td className='px-4 py-3 text-cyan-300'>{'>'}100 dB</td>
                    <td className='px-4 py-3 text-cyan-300'>RF + gamma shielding; extreme rigidity</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 id='section-2-2'>2.2 Acoustic, Thermal, and Chemical Isolation against Side-Channel Attacks (SCA)</h3>

            <p>
              The execution of cryptographic algorithms changes the state of millions of transistors
              billions of times per second. These logical transitions consume varying currents that
              escape into the environment in the form of <strong>heat</strong>, <strong>residual
              electromagnetic radiation</strong>, and <strong>acoustic noise</strong>. Well-equipped
              attackers use these emanations to infer the secret key material — a discipline known
              as <strong>Side-Channel Attacks (SCA)</strong>.
            </p>

            <p>
              <strong>Acoustic Attacks (ASCA):</strong> Multilayer ceramic capacitors (MLCC) and
              inductors exhibit piezoelectric and electrostrictive effects. Voltage fluctuations
              during cryptographic operations cause microscopic deformations, inducing sound and
              ultrasonic waves interceptable by directional microphones.
            </p>

            <p>
              <strong>Thermal Attacks (TSCA):</strong> Thermal imaging cameras capture variations in
              the heat profiles of the chip surface, mapping asymmetry when different logic blocks
              operate keys with distinct bits.
            </p>

            <p>
              To mitigate both vectors, PSI <strong>entirely encapsulates the cryptographic hardware</strong>
              in thermosetting epoxy resin infused with glass microspheres and ceramic matrix
              granulations (<em>potting</em>):
            </p>

            <ol>
              <li>
                <strong>Viscoelastic Acoustic Damping:</strong> The acoustic impedance mismatch
                between piezoelectric components and the dense resin forces sound waves to undergo
                drastic attenuation — converted into very low-amplitude heat.
              </li>
              <li>
                <strong>Thermal Gradient Flattening:</strong> The intentionally low thermal
                conductivity of the epoxy acts as a thermal low-pass filter. The inertia absorbs
                and linearizes transient heat surges, crushing thermal signature curves.
              </li>
              <li>
                <strong>Symbiotic Chemical Defense:</strong> Within the epoxy matrix, a complex mesh
                of fine wires (<em>tamper mesh</em>) actively energized is interwoven. The chemistry
                of the insulating layer is designed to be identical to that of the cured resin —
                solvents that dissolve the resin simultaneously destroy the mesh, triggering
                <strong>instantaneous key zeroization</strong> before the attacker reaches the target.
              </li>
            </ol>

            <h3 id='section-2-3'>2.3 Radical Isolation Architecture (Air-Gapped)</h3>

            <p>
              The PSI topology requires a <strong>null-interface and radical isolation architecture</strong>.
              The device strictly eliminates USB ports, does not display interactive screens, and
              lacks traditional mechanical switches. Power supply and strictly structured encrypted
              data transfer occur solely via <strong>flat-faced encrypted magnetic Pogo Pins</strong>.
              By physically excising conventional input/output ports, PSI revokes the contact
              surface for prevalent logical attacks (BadUSB, firmware injection, fuzzing).
            </p>

            {/* ═════════ Section 3 ═════════ */}
            <h2 id='section-3'>3. The Cryptographic Core (The Wave Function Collapse)</h2>

            <p>
              Inspired by quantum mechanics, the concept of <strong>&ldquo;Private Key Wave Function Collapse&rdquo;</strong>
              stipulates that the key only exists in volatile memory at the exact millisecond a
              digital signature is requested. In legacy wallets and commercial HSMs, the 256-bit
              master key is persistently stored in Non-Volatile Memory (Flash EEPROM). Under PSI&apos;s
              hostile model, any statically held data is vulnerable — a Nation-State could use
              Scanning Electron Microscopy (SEM) or Focused Ion Beams (FIB) to extract the key.
            </p>

            <p>
              PSI&apos;s response is drastic: <strong>the private key is not stored on the device at any time</strong>.
            </p>

            <h3 id='section-3-1'>3.1 SRAM-Based Physical Unclonable Functions (SRAM PUF)</h3>

            <p>
              While the device is at rest (de-energized), the memory core is an <strong>absolute
              vacuum of information</strong>. Standard SRAM memory cells are formed by cross-coupled
              bistable latches (6T topology). At power-up, transistors compete to pull the logical
              state to &lsquo;0&rsquo; or &lsquo;1&rsquo;. Due to <strong>Random Dopant Fluctuations (RDF)</strong>
              and nanometer-level irregularities in lithography processes, each cell exhibits
              physical discrepancies in its Threshold Voltages (V<sub>th</sub>).
            </p>

            <p>
              This atomic asymmetry means that each cell predictably collapses to the same initial
              state. By scanning thousands of these cells, a high-entropy binary string is extracted
              — the <strong>unquestionable fingerprint of that silicon</strong>, impossible to clone,
              predict, or copy.
            </p>

            <p>
              Cryptographic quality is modeled by <strong>Decidability (d&apos;)</strong>, which compares
              the normal distributions of Fractional Hamming Distance (FHD) between intra-device
              readings (thermal noise) and inter-device readings (randomness between different chips).
            </p>

            <p>
              To transform the noisy physical state into a cryptographic seed with 100% precision,
              <strong>Fuzzy Extractors</strong> — &ldquo;Secure Sketch&rdquo; modules that combine the
              noisy SRAM response with &ldquo;Helper Data&rdquo; and error correction algorithms (BCH
              or Polar codes) — are employed. After signing, the SRAM power is obliterated, charges
              dissipate, and <strong>the key ceases to exist</strong>.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-ciclo-vida-chave-criptografica-sram-puf.webp'
                alt='Logical flowchart of the private key lifecycle in Project PSI via SRAM PUF. The flow converts physical silicon noise into pure entropy, processes it through the Fuzzy Extractor to generate the seed (structured crystal), culminating in instant zeroization and digital disintegration.'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>Figure 2:</strong> Ephemeral Key Derivation Flow via SRAM PUF (Power-up → RDF → Fuzzy Extractor → Seed → Zeroization).
              </figcaption>
            </figure>

            <h3 id='section-3-2'>3.2 The Post-Quantum Standard XMSS (NIST SP 800-208)</h3>

            <p>
              If a quantum computer with stable logical qubits is built, <strong>Shor&apos;s Algorithm</strong>
              will destroy all infrastructure based on elliptic curves (ECDSA, EdDSA). Preparing for
              &ldquo;Q-Day,&rdquo; PSI incorporates the <strong>eXtended Merkle Signature Scheme (XMSS)</strong>,
              standardized by NIST (SP 800-208) and RFC 8391.
            </p>

            <p>
              XMSS does not rely on prime factorization or algebraic mappings. Its security rests on
              the <strong>computational infeasibility of creating collisions in hash functions</strong>
              (SHA-256, SHAKE256) — a premise proven by decades of cryptanalysis and irreducible
              against Grover&apos;s algorithms.
            </p>

            <p>
              The complexity lies in its <em>stateful</em> nature: XMSS constructs a Merkle Tree where
              each leaf node carries material for a <strong>Winternitz One-Time Signature (WOTS+)</strong>.
              Each OTS key <strong>can only sign a single message in the system&apos;s lifetime</strong>.
              State reuse causes catastrophic security collapse.
            </p>

            <blockquote>
              <p>
                &ldquo;This recommendation requires that key generation and signatures be performed
                strictly in dedicated hardware cryptographic modules that do not allow secret key
                material to be exported.&rdquo; — <strong>NIST SP 800-208</strong>
              </p>
            </blockquote>

            <p>
              PSI&apos;s microcontroller manages the XMSS pointer entirely within the silicon epoxy
              barriers, refusing all export of root keys via external buses.
            </p>

            <h3 id='section-3-3'>3.3 Hybrid Entropy: Closing the Loop</h3>

            <p>
              The Master Seed that feeds the WOTS+ leaves demands <strong>&ldquo;Redundant Hybrid
              Entropy&rdquo;</strong>:
            </p>

            <ol>
              <li>
                <strong>Intrinsic Dynamic Entropy:</strong> extracted from the SRAM PUF — exclusively
                linked to the physical hardware.
              </li>
              <li>
                <strong>Extrinsic Static Entropy:</strong> provided by the human via temporal
                proximity NFC smartcard combined with live holder biometrics.
              </li>
            </ol>

            <p>
              A <strong>Key Derivation Function (KDF)</strong> based on hashes absorbs the microchip&apos;s
              randomness merged with organic credentials. This algorithmic Gordian knot shields
              custody at both ends: the stolen device is useless (missing human entropy); the
              kidnapped individual without the chip is equally powerless (lost silicon stochastic
              portion).
            </p>

            {/* ═════════ Section 4 ═════════ */}
            <h2 id='section-4'>4. Active Defensive Heuristics (Phantom Input and Evil Maid)</h2>

            <p>
              Cyber-physical security invariably collapses in the face of <strong>direct kinetic
              coercion</strong>. If the legitimate holder is tortured to reveal passwords, the force
              of the extortion vector will suppress all cryptography. PSI&apos;s revolutionary
              innovation consists of transposing silicon security into the realm of <strong>neuropsychology
              and active biometrics</strong>.
            </p>

            <h3 id='section-4-1'>4.1 Behavioral Biometrics and Physiological Coercion Detection</h3>

            <p>
              In the face of torture, the sympathetic portion of the Autonomic Nervous System
              precipitates the &ldquo;fight or flight&rdquo; reaction, resulting in cascades of
              catecholamines and cortisol. PSI integrates sensors that continuously map
              <strong>Behavioral Biometrics</strong>:
            </p>

            <ol>
              <li>
                <strong>Pressing and Pressure Dynamics:</strong> Magnetoelastic sensors and strain
                gauges track pressure variations (~0.25 kPa), Flight Time, and Hold Time. Under
                stress, the grip petrifies, the dynamics become brutal and arrhythmic.
              </li>
              <li>
                <strong>Neuromuscular Micro-tremors:</strong> Triaxial accelerometers and gyroscopes
                (IMU) quantify millimeter-level agitation. Physiological tremor (8-12 Hz) is
                violently modulated during coercion — amplified amplitude, suppressed relaxation
                frequencies.
              </li>
              <li>
                <strong>Heart Rate and PPG:</strong> Photoplethysmographs and bioimpedance sensors
                measure peripheral vasoconstriction, tachycardia, and reduced Heart Rate Variability
                (HRV) — a stress biomarker detectable by neural networks.
              </li>
            </ol>

            <p>
              These data flow into <strong>Edge AI</strong> modules — Capsule Networks (CapsNets) and
              Random Forest for physiological time series, with F1 scores between <strong>96.97% and
              99.82%</strong> on clinical stress datasets.
            </p>

            {/* Table: Biometrics */}
            <div className='not-prose overflow-x-auto my-12 border border-neutral-800 rounded-xl shadow-lg'>
              <table className='w-full text-start text-sm text-neutral-300'>
                <caption className='p-4 bg-neutral-900/80 text-start text-cyan-400 font-mono uppercase tracking-widest font-bold border-b border-neutral-800 text-xs'>
                  Table 2: Physiological Coercion Detection Biomarkers
                </caption>
                <thead>
                  <tr className='bg-neutral-900/80 text-neutral-200'>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Biomarker</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Hardware</th>
                    <th className='px-4 py-3 text-start border-b border-neutral-700 font-semibold'>Pattern Under Coercion</th>
                  </tr>
                </thead>
                <tbody className='text-neutral-400'>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>Contact Force and Dynamics</td>
                    <td className='px-4 py-3'>Magnetoelastic Sensors + Strain Gauges</td>
                    <td className='px-4 py-3'>Arrhythmic latency; pressure peaks; retention stiffness</td>
                  </tr>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>Muscle Tremor</td>
                    <td className='px-4 py-3'>IMU (Accelerometers/Gyroscopes)</td>
                    <td className='px-4 py-3'>Disruption of 8-12 Hz frequency; high variability spasms</td>
                  </tr>
                  <tr>
                    <td className='px-4 py-3'>Cardiovascular Signals</td>
                    <td className='px-4 py-3'>Bioimpedance / Optical / PPG</td>
                    <td className='px-4 py-3'>Vasoconstriction; HRV drop; tachycardia</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Callout: Descoberta Chave — Biometria ── */}
            <aside className='not-prose my-10 border-l-4 border-cyan-500 bg-cyan-950/20 p-6 rounded-r-xl'>
              <h4 className='text-cyan-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2'>
                💡 Key Discovery (TL;DR)
              </h4>
              <p className='text-neutral-200 m-0 leading-relaxed'>
                The Edge AI modules (CapsNets + Random Forest) achieved <strong className='text-white'>F1 scores between 96.97% and 99.82%</strong> in detecting physiological stress in clinical datasets — allowing the device to distinguish legitimate operation from operation under coercion in real-time, without reliance on external servers.
              </p>
            </aside>

            <h3 id='section-4-2'>4.2 Deniable Encryption (Phantom Input Protocol)</h3>

            <p>
              When neuromuscular buses positively flag coercion, PSI opts for a counterintuitive
              path: <strong>it does not block operations</strong>. In normative ecosystems, locking
              would provoke the physical annihilation of the holder by ruthless kidnappers. The
              device assumes the <strong>preservation of the owner&apos;s biological integrity</strong>.
            </p>

            <p>
              The hardware couples to the topology of <strong>Plausible Deniability</strong>, realized
              through <strong>Deniable Encryption</strong> based on <strong>Coercion-Resistant CP-ABE</strong>
              (Ciphertext-Policy Attribute-Based Encryption). A single seed derives two paths:
            </p>

            <ul>
              <li><strong>Real Secret Key (RSK):</strong> reveals the true central wallet.</li>
              <li><strong>Fake Secret Key (FSK):</strong> opens a plausible illusory environment,
              with credible operational funds and network-validated transactions.</li>
            </ul>

            <p>
              Functions based on <strong>composite order bilinear group maps</strong> and
              <strong> Chameleon Hashing</strong> ensure that the equations cannot be statistically
              unraveled. The aggressor escapes satisfied, believing they have extracted the master
              keys — while the real patrimonial sovereignty remains hidden and intact.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-protocolo-phantom-biometria-coacao.webp'
                alt='Logical decision tree of the Phantom Input Protocol (Deniable Encryption). A central biometric actively bifurcates routing: the secure upper optical path (cyan) accesses the real key (RSK), while the lower path under coercion detection (amber) silently redirects to a fake key (FSK).'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>Figure 3:</strong> Phantom Input Protocol — Biometrics → Coercion Flag → RSK vs FSK (Deniable Encryption).
              </figcaption>
            </figure>

            <h3 id='section-4-3'>4.3 Cryptographic Attestation against Hostile Substitution (&ldquo;Evil Maid&rdquo;)</h3>

            <p>
              The <em>Evil Maid</em> attack involves the insidious swapping of the device for a cosmetic
              clone with hidden radio-transmitting hardware. PSI subverts this with <strong>reverse
              attestation</strong>: it is the device that must prove its authenticity to the host via
              <strong>Zero-Knowledge Proofs (ZKP)</strong>, generating untransferable <strong>Personal
              Boot Images</strong>. A clone without the legitimate chip does not produce the correct
              attestation, alerting the user to the interception.
            </p>

            {/* ═════════ Section 5 ═════════ */}
            <h2 id='section-5'>5. Aerospace-Grade Redundancy: TMR and LEO Threats</h2>

            <p>
              The Event Horizon philosophy argues that threats are not always terrestrial. An
              inviolable vault postulates <strong>resilience against infrastructure catastrophes</strong>,
              ensuring computational perpetuity in adversity — including <strong>Low Earth Orbit (LEO)</strong>.
            </p>

            <h3 id='section-5-1'>5.1 The Orbital Radiation Threat (SEU, SEL, TID)</h3>

            <p>
              At 300-800 km from the surface, the magnetosphere substantially thins (especially in
              the South Atlantic Anomaly). The environment is flooded with solar protons and heavy
              ions from galactic cosmic rays (GCR). COTS components collapse under:
            </p>

            <ul>
              <li>
                <strong>Total Ionizing Dose (TID):</strong> Continuous degeneration of semiconductors
                due to cumulative accumulation of gamma irradiations in the insulating SiO₂, altering
                threshold voltages and causing lethal leakages.
              </li>
              <li>
                <strong>Single-Event Effects (SEE):</strong> Transients induced by the penetration of
                a charged particle — <strong>Single-Event Upsets (SEU)</strong> randomly flip bits;
                <strong>Single-Event Latch-ups (SEL)</strong> trigger short circuits by fusing
                microscopic traces.
              </li>
            </ul>

            <h3 id='section-5-2'>5.2 The Rad-Hard Standard and Ferroelectric FRAM</h3>

            <p>
              PSI discards civilian Flash and NAND EEPROMs in favor of <strong>Rad-Hard Ferroelectric
              RAM (FRAM)</strong>. Contrary to traditional memories based on electron trapping over
              CMOS floating-gate capacitors, FRAM utilizes exotic crystallographic topologies (thin
              film of <strong>Lead Zirconate Titanate — PZT</strong>).
            </p>

            <p>
              The structure maintains binary keys through the <strong>fixed residual electric field
              polarization</strong> associated with geometric placements of the metallic crystal — an
              unshakeable stable dipole arrangement. Transient ionizing particles <strong>do not
              corrupt</strong> these oriented crystallizations, conferring native immunity in massive
              TID environments.
            </p>

            <h3 id='section-5-3'>5.3 Triple Modular Redundancy (TMR)</h3>

            <p>
              Each critical operation is physically replicated <strong>three times</strong> in
              independent microcontrollers (sub-blocks A, B, C). At the end of parallel calculations,
              the paths converge in a <strong>Majority Scrutinizer Device (&ldquo;Voter&rdquo;)</strong>.
            </p>

            <p>
              If a cosmic particle flips the transistors of sub-block B (SEU), sets A and C continue
              reporting correct data. The Voter — by Simple Majority (2 against 1) — instantly expels
              spurious errors, without reboots or operational interventions. The device maintains
              continuous and infallible operation under orbital radioactive bombardment.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-arquitetura-tmr-redundancia-voter.webp'
                alt='Architectural diagram of Project PSI&apos;s aerospace Triple Modular Redundancy (TMR). Three independent microprocessors process data in a fault-tolerant parallel manner, converging to a central Majority Voter logic gate that validates and emits only a unified cyan output immune to fault injection.'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>Figure 4:</strong> Triple Modular Redundancy — Sub-blocks A/B/C → Majority Voter → Infallible Output.
              </figcaption>
            </figure>

            {/* ── Callout: Descoberta Chave — TMR ── */}
            <aside className='not-prose my-10 border-l-4 border-cyan-500 bg-cyan-950/20 p-6 rounded-r-xl'>
              <h4 className='text-cyan-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2'>
                💡 Key Discovery (TL;DR)
              </h4>
              <p className='text-neutral-200 m-0 leading-relaxed'>
                The <strong className='text-white'>Triple Modular Redundancy (TMR)</strong> architecture with simple majority Voter, combined with <strong className='text-white'>Rad-Hard FRAM</strong> memories immune to TID, ensures continuous and infallible operation of PSI even under bombardment by galactic cosmic rays in Low Earth Orbit (LEO) — eliminating Single-Event Upsets without reboots.
              </p>
            </aside>

            {/* ═════════ Section 6 ═════════ */}
            <h2 id='section-6'>6. Conclusion</h2>

            <p>
              <strong>Project PSI (Ψ)</strong> categorically transcends the dimension of a &ldquo;consumer
              electronic wallet,&rdquo; shifting the taxonomy of custody to unexplored levels of
              military, metallurgical, and planetary civil safeguarding sciences.
            </p>

            <p>
              By unreservedly adopting the existential manifesto of <strong>&ldquo;Zero Trust in Silicon&rdquo;</strong>,
              its responses pave the way for interdisciplinary state-of-the-art:
            </p>

            <ol>
              <li>
                <strong>Kinetic Vanguard:</strong> The intertwining of the acoustic thermodynamics
                of epoxy potting with the military density of Cu-W suppresses piezoelectric acoustic
                forensic vectors in parallel with instantaneous EMP absorption.
              </li>
              <li>
                <strong>Rad-Hard Cryptographic Ephemerality:</strong> The abolition of electronic
                persistence by SRAM PUF, solidified by post-quantum XMSS (NIST SP 800-208) and
                surviving in crystallized FRAM memories, sweeps away the dangers of forensic
                microscopes and the quantum future.
              </li>
              <li>
                <strong>Active Plausibility Neural Safeguard:</strong> Behavioral biomarkers
                (CapsNets) trigger undetectable cybernetic mutation for deniable phantom encryption
                under real-time coercion stress.
              </li>
            </ol>

            <p>
              By unifying these fronts of material safeguarding and cybernetic processing, the device
              consecrates itself as the <strong>bulwark and immutable frontier of the tangible
              event horizon in the unwavering defense of the future of personal sovereignty</strong>.
            </p>

          </div>{/* end prose */}

          {/* ─── References ─── */}
          <section className='mt-16 rounded-xl border border-neutral-800 bg-neutral-900/30 p-6'>
            <h2 className='text-lg font-bold text-white mb-4'>Scientific References</h2>
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