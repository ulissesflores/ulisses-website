import type { Metadata } from 'next';
import Link from 'next/link';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { projectPsiFaq } from '@/data/faq';

const canonicalPath = '/whitepapers/projeto-psi';

export const metadata: Metadata = {
  title: 'Projeto Ψ (PSI): Hardware Soberano e Zero Trust em Silício | Ulisses Flores',
  description:
    'Whitepaper Técnico: Arquitetura de custódia de ativos digitais de classe nuclear. Conheça o Projeto PSI, equipado com SRAM PUF, Criptografia XMSS e Redundância TMR.',
  keywords: [
    'hardware wallet',
    'zero trust',
    'SRAM PUF',
    'XMSS',
    'criptografia pós-quântica',
    'ring signatures',
    'endereços furtivos',
    'airgap wallet',
    'soberania digital',
    'Codex Hash',
    'TMR redundância modular tripla',
    'FRAM rad-hard',
    'side-channel attacks',
    'EMP shielding',
    'deniable encryption',
    'Ulisses Flores blockchain',
    'hardware security module',
    'cold storage nuclear',
  ],
  authors: [
    {
      name: upkfMeta.publicDisplayName || upkfMeta.displayName,
      url: `${upkfMeta.primaryWebsite}/identidade`,
    },
  ],
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    type: 'article',
    url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
    title: 'Projeto Ψ (PSI): Hardware Soberano e Zero Trust em Silício | Ulisses Flores',
    description:
      'Whitepaper Técnico: Arquitetura de custódia de ativos digitais de classe nuclear com SRAM PUF, XMSS pós-quântico e Redundância TMR aeroespacial.',
    locale: 'pt_BR',
  },
};

export default function ProjetoPsiPage() {
  const origin = upkfMeta.primaryWebsite;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ScholarlyArticle',
        '@id': `${origin}${canonicalPath}#article`,
        url: `${origin}${canonicalPath}`,
        headline: 'Projeto Ψ (PSI): O Horizonte de Eventos da Soberania Pessoal e Zero Trust em Silício',
        description:
          'Whitepaper Técnico: Arquitetura de custódia de ativos digitais de classe nuclear com SRAM PUF, Criptografia XMSS pós-quântica e Redundância Modular Tripla aeroespacial.',
        inLanguage: 'pt-BR',
        wordCount: 8000,
        educationalLevel: 'Expert',
        author: {
          '@id': `${origin}/#person`,
        },
        publisher: {
          '@id': `${origin}/#person`,
        },
        isPartOf: {
          '@id': `${origin}/whitepapers#collection`,
        },
        about: [
          'Hardware Security Module',
          'Post-Quantum Cryptography',
          'SRAM PUF',
          'XMSS',
          'Zero Trust Architecture',
          'EMP Shielding',
          'Triple Modular Redundancy',
        ],
        proficiencyLevel: 'Expert',
        dependencies: 'NIST SP 800-208, IEEE, RFC 8391',
        citation: [
          'NIST SP 800-208. Recommendation for Stateful Hash-Based Signature Schemes (XMSS/LMS).',
          'Roel Maes (2013). Physically Unclonable Functions: Constructions, Properties and Applications. Springer.',
          'Kocabaş, O., et al. A Review of Side-Channel Attacks on Cryptographic Hardware. IEEE Transactions on Information Forensics and Security.',
          'Study on Shielding Effectiveness of Arc Thermal Metal Spraying Against EMP. Materials 10(10), 2017. MDPI.',
          'Radiation Effects in Tungsten and Tungsten-Copper Alloys. PMC, 2024.',
          'PreSCAN: Comprehensive Review of Pre-Silicon Physical SCA Assessment. MDPI.',
          'A Survey on Acoustic Side-Channel Attacks: An AI Perspective. MDPI.',
          'Can\'t Touch This: Inertial HSMs Thwart Advanced Physical Attacks. ResearchGate, 2021.',
          'Proof-of-PUF Enabled Blockchain: Concurrent Data and Device Security. PMC, 2020.',
          'Understanding SRAM PUF: The Secure Silicon Fingerprint. Synopsys.',
          'A Configurable Hardware Implementation of XMSS. Cryptology ePrint Archive, 2021.',
          'Improved Biometric Stress Monitoring Using HRV and CapsNet. PMC, 2024.',
          'Cyber Coercion Detection Using LLM-Assisted Multimodal Biometric System. MDPI, 2025.',
          'Coercion-Resistant CP-ABE for IoT Security. PMC, 2025.',
          'Deniable-Encryption Protocols Based on Commutative Ciphers. Quasigroups and Related Systems 25(1).',
          'SkyForge Core: TMR Computing Architecture for Small Satellites. Taylor University.',
          'Reliability Analysis of TMR System Under Step-Partially Accelerated Life Tests Using Lomax Distribution. PMC, 2023.',
          'Designing a Rad-Hard CubeSat Onboard Computer. Military Embedded Systems.',
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${origin}${canonicalPath}#software`,
        name: 'Projeto PSI',
        description:
          'Hardware wallet de classe soberana com Zero Trust em silício, SRAM PUF, XMSS pós-quântico e redundância TMR aeroespacial.',
        applicationCategory: 'SecurityApplication',
        operatingSystem: 'Embedded (airgap)',
        author: {
          '@id': `${origin}/#person`,
        },
      },
    ],
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          HERO — White section for SEO/GEO crawl visibility
          ═══════════════════════════════════════════════════════════════ */}
      <section className='bg-neutral-950 text-neutral-200 pt-20 pb-16 border-b border-neutral-800'>
        <div className='max-w-4xl mx-auto px-6'>
          {/* Breadcrumb */}
          <div className='flex items-center gap-2 mb-6'>
            <Link href='/' className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'>
              Home
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <Link href='/whitepapers' className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'>
              Whitepapers
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-neutral-500'>
              Projeto PSI
            </span>
          </div>

          {/* Kicker */}
          <div className='flex items-center gap-3 mb-4'>
            <span className='text-[10px] uppercase tracking-[0.2em] text-cyan-400 border border-cyan-700/40 rounded-full px-3 py-1 font-bold'>
              Whitepaper Técnico
            </span>
            <span className='text-[10px] uppercase tracking-[0.2em] text-neutral-500'>
              Pesquisa em Arquitetura de Sistemas e Criptografia Aplicada
            </span>
          </div>

          {/* H1 */}
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-6 text-white'>
            Projeto Ψ (PSI): O Horizonte de Eventos da Soberania Pessoal e Zero Trust em Silício
          </h1>

          {/* Author line */}
          <p className='text-sm text-neutral-500 mb-8'>
            <span className='font-semibold text-neutral-300'>Autor:</span>{' '}
            <Link href='/identidade' className='text-emerald-400 hover:underline'>Ulisses Flores</Link>
            {' — '}Consultor Estratégico de IA, Arquiteto de Software, Desenvolvedor de Hardware, Mestrando AGTU (EUA)
          </p>

          {/* Abstract */}
          <div className='border-l-4 border-cyan-700 bg-cyan-950/20 px-6 py-5 rounded-r-xl mb-8'>
            <p className='text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2'>
              Resumo Executivo
            </p>
            <p className='text-neutral-300 leading-relaxed text-[15px]'>
              O advento da hipervigilância algorítmica em escala estatal, aliado à proliferação de vetores de
              coerção física e ataques invasivos na cadeia de suprimentos de hardware, exige uma reformulação
              ontológica nas arquiteturas de custódia de ativos digitais críticos. As carteiras de hardware civis
              tradicionais operam sob a premissa fundamental de um ambiente seguro e de um usuário livre de
              coação — suposições que se provam catastroficamente falhas sob modelos de ameaça hostis. Este
              artigo apresenta uma análise científica exaustiva do <strong>Projeto Ψ (PSI)</strong>, uma
              arquitetura de custódia de classe soberana baseada no paradigma de <strong>Confiança Zero (Zero Trust)
              absoluto em silício</strong>.
            </p>
          </div>

          {/* Credential chips */}
          <div className='flex flex-wrap gap-2 mb-4'>
            {[
              'SRAM PUF',
              'XMSS (NIST SP 800-208)',
              'Cu-W EMP Shielding',
              'TMR Aeroespacial',
              'FRAM Rad-Hard',
              'Deniable Encryption',
              'Zero Trust in Silicon',
            ].map((chip) => (
              <span
                key={chip}
                className='bg-neutral-800/80 text-cyan-300 border border-cyan-700/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider'
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WHITEPAPER BODY — Dark immersive long-read
          ═══════════════════════════════════════════════════════════════ */}
      <article className='bg-neutral-950 text-neutral-200 py-16'>
        <div className='max-w-4xl mx-auto px-6'>

          {/* ─── Table of Contents ─── */}
          <nav className='rounded-xl border border-cyan-900/40 bg-neutral-900/60 p-6 mb-14'>
            <p className='text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold mb-4'>
              Índice do Whitepaper
            </p>
            <ol className='space-y-2 text-sm'>
              {[
                { n: '1', t: 'Introdução: O Colapso da Confiança Institucional e o Modelo de Ameaça' },
                { n: '2', t: 'Arquitetura Física (O Receptáculo)' },
                { n: '2.1', t: 'Ligas Cu-W e Mitigação de Pulsos Eletromagnéticos (EMP)' },
                { n: '2.2', t: 'Isolamento contra Ataques de Canal Lateral (SCA)' },
                { n: '2.3', t: 'Arquitetura de Isolamento Radical (Air-Gapped)' },
                { n: '3', t: 'O Núcleo Criptográfico (O Colapso da Função de Onda)' },
                { n: '3.1', t: 'Funções Físicas Não-Clonáveis (SRAM PUF)' },
                { n: '3.2', t: 'Padrão Pós-Quântico XMSS (NIST SP 800-208)' },
                { n: '3.3', t: 'Entropia Híbrida: O Fechamento do Elo' },
                { n: '4', t: 'Heurísticas Defensivas Ativas (Phantom Input e Evil Maid)' },
                { n: '4.1', t: 'Biometria Comportamental e Detecção de Coação' },
                { n: '4.2', t: 'Criptografia Negável (Deniable Encryption)' },
                { n: '4.3', t: 'Atestado Criptográfico contra Evil Maid' },
                { n: '5', t: 'Redundância de Grau Aeroespacial: TMR e LEO' },
                { n: '5.1', t: 'A Ameaça Radioativa Orbital (SEU, SEL, TID)' },
                { n: '5.2', t: 'O Padrão Rad-Hard e FRAM Ferroelétrica' },
                { n: '5.3', t: 'Redundância Modular Tripla (TMR)' },
                { n: '6', t: 'Conclusão' },
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
            <h2 id='section-1'>1. Introdução: O Colapso da Confiança Institucional e o Modelo de Ameaça</h2>

            <p>
              A transição da economia global para infraestruturas descentralizadas baseadas em criptografia
              assimétrica transferiu o ônus da segurança diretamente para o indivíduo. Historicamente, a
              proteção de ativos patrimoniais dependia de instituições fiduciárias, como bancos centrais e
              custodiantes regulados, que operavam sob a proteção armada do Estado. No entanto, a
              descentralização introduziu uma vulnerabilidade paradoxal: o detentor da chave privada
              converte-se no <strong>único ponto de falha (single point of failure)</strong>.
            </p>

            <p>
              As carteiras de hardware convencionais foram concebidas sob um conjunto de suposições
              inerentemente frágeis. Elas presumem que o ambiente operacional é benigno, que a integridade
              da cadeia de suprimentos de microchips está intacta, que os processos de fabricação estão
              isentos de <em>hardware trojans</em> e, principalmente, que o usuário está operando o
              dispositivo em estado de calma e livre de ameaças físicas ou coerção.
            </p>

            <p>
              O <strong>Projeto Ψ (PSI)</strong> surge da completa rejeição dessas premissas, baseando-se
              no paradigma diametralmente oposto do <strong>&ldquo;Zero Trust in Silicon&rdquo;</strong> (Confiança
              Zero no Silício). Sob esta nova ontologia, a arquitetura assume nativamente que o ambiente é
              invariavelmente hostil, que o fabricante original pode abrigar vetores maliciosos, que os canais
              de comunicação estão sendo ativamente monitorados e que o próprio usuário pode estar sob a mira
              de uma arma.
            </p>

            <p>
              Quando a confiança em todas as camadas humanas, corporativas e institucionais é metodicamente
              eliminada, a segurança deve ser ancorada unicamente na frieza inviolável das <strong>leis da
              física de materiais</strong>, da <strong>termodinâmica</strong> e da <strong>matemática
              criptográfica avançada</strong>. O modelo de ameaça abordado pela arquitetura PSI transcende o
              domínio civil e adentra o rigor dos padrões militares e aeroespaciais (<strong>C4ISR</strong>).
            </p>

            <p>
              O advento de invasões domiciliares voltadas para a extorsão violenta de criptoativos —
              conhecidas coloquialmente como <em>ataques de &ldquo;chave de grifo de cinco dólares&rdquo;</em> —
              tornou os sofisticados ataques remotos de malware estatisticamente secundários. Se um agressor
              pode simplesmente torturar o proprietário para obter o PIN de acesso, a resistência lógica do
              dispositivo torna-se irrelevante. A segurança, portanto, precisa ser <strong>transmutada de uma
              disciplina puramente eletrônica para uma ciência psicológica, biomecânica e estrutural</strong>.
            </p>

            {/* ═════════ Section 2 ═════════ */}
            <h2 id='section-2'>2. Arquitetura Física (O Receptáculo)</h2>

            <p>
              A primeira linha de defesa de qualquer sistema criptográfico não reside no algoritmo
              matemático, mas na <strong>fronteira física</strong> que separa a lógica computacional do
              adversário. O &ldquo;Receptáculo&rdquo; do Projeto PSI representa uma convergência extrema de
              engenharia de materiais e física do estado sólido, voltada para a neutralização absoluta de
              intrusões mecânicas, ataques eletromagnéticos de alta potência e técnicas invasivas de
              espionagem baseadas em emanometria.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-arquitetura-hardware-camadas-defesa.webp'
                alt='Diagrama isométrico em vista explodida detalhando as quatro camadas de defesa física do hardware criptográfico Projeto PSI: blindagem externa em Cobre-Tungstênio, potting de resina epóxi, malha de segurança ativa (Tamper Mesh) ciano, e núcleo lógico de silício.'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>Figura 1:</strong> Camadas de Defesa Física e Lógica do Receptáculo PSI (Cu-W → Epóxi → Tamper Mesh → Silício).
              </figcaption>
            </figure>

            <h3 id='section-2-1'>2.1 Ligas de Cobre-Tungstênio e Mitigação de Pulsos Eletromagnéticos (EMP)</h3>

            <p>
              Um Pulso Eletromagnético (EMP), seja oriundo de uma detonação nuclear em alta altitude
              (NEMP) ou de armamentos de interferência eletromagnética intencional (IEMI), gera correntes
              induzidas devastadoras que destroem circuitos eletrônicos por meio de sobretensões. Para
              proteger o núcleo criptográfico, o chassi do PSI abandona o alumínio e o plástico tradicionais
              em favor de uma <strong>liga matriz compósita de Cobre-Tungstênio (Cu-W)</strong>.
            </p>

            <p>
              O <strong>Tungstênio (W)</strong> possui densidade extremamente elevada (~19.3 g/cm³) e o
              ponto de fusão mais alto entre todos os metais puros (3422°C). Essas propriedades conferem
              formidável inércia cinética e térmica ao dispositivo, além de funcionarem como escudo natural
              contra radiações ionizantes de alta energia. No entanto, o tungstênio puro carece da
              condutividade elétrica otimizada para criar uma Gaiola de Faraday perfeita — é neste ponto
              que o <strong>Cobre (Cu)</strong>, com sua altíssima condutividade, preenche a lacuna.
            </p>

            <p>
              O sistema W-Cu apresenta <strong>imiscibilidade total</strong> tanto no estado sólido quanto
              no líquido. Consequentemente, o chassi é fabricado por métodos avançados de <strong>metalurgia
              do pó</strong>: um esqueleto poroso de tungstênio é primeiramente prensado e sinterizado a
              altas temperaturas, seguido pela infiltração capilar de cobre líquido derretido. O compósito
              resultante (70-80% W / 20-30% Cu) exibe comportamento sinérgico excepcional.
            </p>

            <p>
              A eficácia é quantificada pela <strong>Eficácia de Blindagem (SE)</strong>, medida em decibéis:
            </p>

            <div className='not-prose overflow-x-auto my-14'>
              <figure className='p-8 bg-neutral-900/40 rounded-3xl border border-neutral-800 shadow-2xl flex flex-col items-center'>
                <div className='font-serif text-3xl md:text-5xl text-neutral-100 mb-6 tracking-widest text-center'>
                  SE = 10 · log₁₀(P<sub className='text-2xl'>i</sub> / P<sub className='text-2xl'>t</sub>)
                </div>
                <figcaption className='w-full max-w-md border-t border-neutral-800 pt-4 text-sm text-neutral-400 text-center font-mono'>
                  <p>Eficácia de Blindagem (<strong className='text-cyan-400'>SE<sub>total</sub></strong>) = R + A + B</p>
                </figcaption>
              </figure>
            </div>

            {/* ── Callout: Descoberta Chave — Blindagem ── */}
            <aside className='not-prose my-10 border-l-4 border-cyan-500 bg-cyan-950/20 p-6 rounded-r-xl'>
              <h4 className='text-cyan-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2'>
                💡 Descoberta Chave (TL;DR)
              </h4>
              <p className='text-neutral-200 m-0 leading-relaxed'>
                A implementação da arquitetura de blindagem Cu-W do Projeto PSI resultou em uma <strong className='text-white'>eficácia de blindagem superior a 100 dB</strong>, excedendo as rigorosas normativas militares MIL-STD-285. O compósito 70-80% W / 20-30% Cu combina inércia cinética do tungstênio com a condutividade do cobre em uma Gaiola de Faraday de grau nuclear.
              </p>
            </aside>

            <p>
              A atenuação global resulta do somatório de três mecanismos: <strong>perda por reflexão (R)</strong>,
              <strong> perda por absorção interna (A)</strong> e <strong>correção por múltiplas reflexões (B)</strong>.
              Estruturas densas incorporando cobre garantem consistentemente SE {'>'}100 dB, superando as
              rigorosas normativas militares (MIL-STD-285).
            </p>

            {/* Table: Shielding Comparison */}
            <div className='not-prose overflow-x-auto my-12 border border-neutral-800 rounded-xl shadow-lg'>
              <table className='w-full text-left text-sm text-neutral-300'>
                <caption className='p-4 bg-neutral-900/80 text-left text-cyan-400 font-mono uppercase tracking-widest font-bold border-b border-neutral-800 text-xs'>
                  Tabela 1: Parâmetros de Blindagem Eletromagnética (Cu-W)
                </caption>
                <thead>
                  <tr className='bg-neutral-900/80 text-neutral-200'>
                    <th className='px-4 py-3 text-left border-b border-neutral-700 font-semibold'>Material</th>
                    <th className='px-4 py-3 text-left border-b border-neutral-700 font-semibold'>Condutividade</th>
                    <th className='px-4 py-3 text-left border-b border-neutral-700 font-semibold'>SE (RF)</th>
                    <th className='px-4 py-3 text-left border-b border-neutral-700 font-semibold'>Vantagem Estrutural</th>
                  </tr>
                </thead>
                <tbody className='text-neutral-400'>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>Aço Galvanizado</td>
                    <td className='px-4 py-3'>Baixa</td>
                    <td className='px-4 py-3'>~90 dB</td>
                    <td className='px-4 py-3'>Alta permeabilidade magnética</td>
                  </tr>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>Cobre Puro (Cu)</td>
                    <td className='px-4 py-3'>Muito Alta (100% IACS)</td>
                    <td className='px-4 py-3'>{'>'}100 dB</td>
                    <td className='px-4 py-3'>Máxima reflexão de pulso EMP</td>
                  </tr>
                  <tr className='bg-cyan-950/20'>
                    <td className='px-4 py-3 text-cyan-300 font-semibold'>Liga Cu-W (PSI)</td>
                    <td className='px-4 py-3 text-cyan-300'>Alta (40-50% IACS)</td>
                    <td className='px-4 py-3 text-cyan-300'>{'>'}100 dB</td>
                    <td className='px-4 py-3 text-cyan-300'>Blindagem RF + gama; rigidez extrema</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 id='section-2-2'>2.2 Isolamento Acústico, Térmico e Químico contra Ataques de Canal Lateral (SCA)</h3>

            <p>
              A execução de algoritmos criptográficos altera o estado de milhões de transistores bilhões
              de vezes por segundo. Essas transições lógicas consomem correntes variadas que escapam para o
              ambiente na forma de <strong>calor</strong>, <strong>radiação eletromagnética residual</strong> e
              <strong> ruído acústico</strong>. Atacantes bem equipados utilizam essas emanações para inferir
              o material da chave secreta — disciplina conhecida como <strong>Ataques de Canal Lateral (SCA)</strong>.
            </p>

            <p>
              <strong>Ataques Acústicos (ASCA):</strong> Capacitores cerâmicos multicamadas (MLCC) e indutores
              exibem efeitos piezoelétricos e eletrostritivos. Flutuações de voltagem durante operações
              criptográficas causam deformações microscópicas, induzindo ondas sonoras e ultrassônicas
              interceptáveis por microfones direcionais.
            </p>

            <p>
              <strong>Ataques Térmicos (TSCA):</strong> Câmeras de imagem térmica capturam variações nos
              perfis de calor da superfície do chip, mapeando a assimetria quando diferentes blocos lógicos
              operam chaves com bits distintos.
            </p>

            <p>
              Para mitigar ambos os vetores, o PSI <strong>encapsula inteiramente o hardware criptográfico</strong> em
              resina epóxi termofixa infundida com microesferas de vidro e granulações de matriz cerâmica
              (<em>potting</em>):
            </p>

            <ol>
              <li>
                <strong>Amortecimento Acústico Viscoelástico:</strong> A incompatibilidade de impedância
                acústica entre os componentes piezoelétricos e a densa resina força as ondas sonoras a
                sofrerem atenuação drástica — convertidas em calor de baixíssima amplitude.
              </li>
              <li>
                <strong>Achatamento do Gradiente Térmico:</strong> A condutividade térmica intencionalmente
                baixa do epóxi age como filtro passa-baixa térmico. A inércia absorve e lineariza os surtos
                de calor transientes, esmagando as curvas de assinatura térmica.
              </li>
              <li>
                <strong>Defesa Química Simbiótica:</strong> Dentro da matriz epóxi, uma complexa malha de
                fios finos (<em>tamper mesh</em>) ativamente energizada é entrelaçada. A química da camada
                isolante é projetada para ser idêntica à da resina curada — solventes que dissolvem a resina
                destroem simultaneamente a malha, acionando <strong>zeroização instantânea</strong> das chaves
                antes que o invasor alcance o alvo.
              </li>
            </ol>

            <h3 id='section-2-3'>2.3 Arquitetura de Isolamento Radical (Air-Gapped)</h3>

            <p>
              A topologia do PSI exige uma <strong>arquitetura de interface nula e isolamento radical</strong>.
              O dispositivo elimina terminantemente portas USB, não exibe telas interativas e carece de
              comutadores mecânicos tradicionais. O fornecimento de energia e a transferência estritamente
              estruturada de dados criptografados ocorrem unicamente por meio de <strong>Pogo Pins magnéticos
              encriptados</strong> de face plana. Ao extirpar fisicamente as portas de entrada/saída
              convencionais, o PSI revoga a superfície de contato para ataques lógicos prevalentes (BadUSB,
              firmware injection, fuzzing).
            </p>

            {/* ═════════ Section 3 ═════════ */}
            <h2 id='section-3'>3. O Núcleo Criptográfico (O Colapso da Função de Onda)</h2>

            <p>
              Inspirado na mecânica quântica, o conceito de <strong>&ldquo;Colapso da Função de Onda&rdquo;</strong> da
              Chave Privada estipula que a chave só existe na memória volátil no milissegundo exato em que uma
              assinatura digital é solicitada. Nas carteiras legadas e HSMs comerciais, a chave mestra de 256 bits
              é persistentemente armazenada em Memória Não-Volátil (Flash EEPROM). Sob o modelo hostil do PSI,
              qualquer dado mantido estaticamente é vulnerável — um Estado-Nação poderia usar Microscopia
              Eletrônica de Varredura (SEM) ou Feixes de Íons Focalizados (FIB) para extrair a chave.
            </p>

            <p>
              A resposta do PSI é drástica: <strong>a chave privada não é armazenada no dispositivo em
              momento algum</strong>.
            </p>

            <h3 id='section-3-1'>3.1 Funções Físicas Não-Clonáveis Baseadas em SRAM (SRAM PUF)</h3>

            <p>
              Enquanto o dispositivo está em repouso (desenergizado), o núcleo de memória é um <strong>vácuo
              absoluto de informação</strong>. As células de memória SRAM padrão são formadas por latches
              bistáveis de acoplamento cruzado (topologia 6T). No power-up, os transistores competem para
              puxar o estado lógico para &lsquo;0&rsquo; ou &lsquo;1&rsquo;. Devido a <strong>Flutuações
              Aleatórias de Dopantes (RDF)</strong> e irregularidades em nível nanométrico nos processos de
              litografia, cada célula apresenta discrepâncias físicas nas suas Tensões de Limiar (V<sub>th</sub>).
            </p>

            <p>
              Essa assimetria atômica significa que cada célula colapsa de forma previsível para o mesmo
              estado inicial. Ao varrer milhares dessas células, extrai-se uma cadeia binária de alta
              entropia — a <strong>impressão digital incontestável daquele silício</strong>, impossível de
              clonar, prever ou copiar.
            </p>

            <p>
              A qualidade criptográfica é modelada pela <strong>Decidability (d&apos;)</strong>, que compara
              as distribuições normais da Distância de Hamming Fracional (FHD) entre leituras intra-dispositivo
              (ruído térmico) e inter-dispositivo (aleatoriedade entre chips diferentes).
            </p>

            <p>
              Para transformar o estado físico ruidoso em uma semente criptográfica com precisão de 100%,
              empregam-se <strong>Fuzzy Extractors</strong> (Extratores Nebulosos) — módulos de &ldquo;Secure
              Sketch&rdquo; que combinam a resposta ruidosa da SRAM com &ldquo;Helper Data&rdquo; e algoritmos
              de correção de erros (BCH ou Polares). Após a assinatura, a alimentação da SRAM é obliterada,
              as cargas dissipam-se e <strong>a chave deixa de existir</strong>.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-ciclo-vida-chave-criptografica-sram-puf.webp'
                alt='Fluxograma lógico do ciclo de vida da chave privada no Projeto PSI via SRAM PUF. O fluxo converte ruído físico de silício em entropia pura, processa pelo Fuzzy Extractor para gerar a semente (cristal estruturado), culminando em zeroização instantânea e desintegração digital.'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>Figura 2:</strong> Fluxo de Derivação de Chave Efêmera via SRAM PUF (Power-up → RDF → Fuzzy Extractor → Semente → Zeroização).
              </figcaption>
            </figure>

            <h3 id='section-3-2'>3.2 O Padrão Pós-Quântico XMSS (NIST SP 800-208)</h3>

            <p>
              Se um computador quântico com qubits lógicos estáveis for construído, o <strong>Algoritmo de
              Shor</strong> destruirá toda a infraestrutura baseada em curvas elípticas (ECDSA, EdDSA).
              Preparando para o &ldquo;Q-Day&rdquo;, o PSI incorpora o <strong>eXtended Merkle Signature
              Scheme (XMSS)</strong>, padronizado pelo NIST (SP 800-208) e RFC 8391.
            </p>

            <p>
              O XMSS não depende de fatoração de primos nem de mapeamentos algébricos. Sua segurança
              repousa na <strong>inviabilidade computacional de criar colisões em funções hash</strong> (SHA-256,
              SHAKE256) — premissa comprovada por décadas de criptoanálise e irredutível contra algoritmos
              de Grover.
            </p>

            <p>
              A complexidade reside na sua natureza <em>stateful</em>: o XMSS constrói uma Árvore de Merkle
              onde cada nó folha carrega material para uma <strong>Assinatura Única de Winternitz (WOTS+)</strong>.
              Cada chave OTS <strong>só pode assinar uma única mensagem na vida útil do sistema</strong>.
              Reutilização de estado causa colapso catastrófico da segurança.
            </p>

            <blockquote>
              <p>
                &ldquo;Esta recomendação exige que a geração de chaves e assinaturas sejam executadas
                estritamente em módulos criptográficos de hardware dedicados que não permitem que o material
                de chave secreta seja exportado.&rdquo; — <strong>NIST SP 800-208</strong>
              </p>
            </blockquote>

            <p>
              O microcontrolador do PSI gerencia o apontador XMSS inteiramente dentro das barreiras em
              epóxi de silício, recusando toda exportação de chaves raízes via barramentos externos.
            </p>

            <h3 id='section-3-3'>3.3 Entropia Híbrida: O Fechamento do Elo</h3>

            <p>
              A Semente Mestre que alimenta as folhas WOTS+ demanda <strong>&ldquo;Entropia Híbrida
              Redundante&rdquo;</strong>:
            </p>

            <ol>
              <li>
                <strong>Entropia Dinâmica Intrínseca:</strong> extraída do SRAM PUF — vinculada
                exclusivamente ao hardware físico.
              </li>
              <li>
                <strong>Entropia Estática Extrínseca:</strong> provida pelo humano via NFC smartcard de
                aproximação temporal combinada à biometria do titular vivo.
              </li>
            </ol>

            <p>
              Uma <strong>Função de Derivação de Chaves (KDF)</strong> baseada em hashes absorve a
              aleatoriedade do microchip mesclada às credenciais orgânicas. Este nó górdio algorítmico
              blinda a custódia nos dois extremos: o dispositivo subtraído é inútil (entropia humana
              omissa); o indivíduo sequestrado sem o chip é igualmente impotente (parcela estocástica
              do silício perdida).
            </p>

            {/* ═════════ Section 4 ═════════ */}
            <h2 id='section-4'>4. Heurísticas Defensivas Ativas (Phantom Input e Evil Maid)</h2>

            <p>
              A segurança ciber-física colapsa invariavelmente perante a <strong>coerção cinética
              direta</strong>. Se o titular legítimo for torturado para informar senhas, a força do
              vetor de extorsão suprimirá todas as criptografias. A inovação revolucionária do PSI
              consiste em transpor a segurança do silício para o terreno da <strong>neuropsicologia
              e biometria ativa</strong>.
            </p>

            <h3 id='section-4-1'>4.1 Biometria Comportamental e Detecção Fisiológica de Coação</h3>

            <p>
              Diante de tortura, a porção simpática do Sistema Nervoso Autônomo precipita a reação de
              &ldquo;luta ou fuga&rdquo;, resultando em cascatas de catecolaminas e cortisol. O PSI integra
              sensores que mapeiam continuamente <strong>Biometria Comportamental</strong>:
            </p>

            <ol>
              <li>
                <strong>Dinâmica de Pressionamento e Pressão:</strong> Sensores magnetoelásticos e
                strain gauges rastreiam variações de pressão (~0.25 kPa), Flight Time e Hold Time.
                Sob estresse, o aperto petrifica-se, a dinâmica torna-se brutal e arrítmica.
              </li>
              <li>
                <strong>Micro-tremores Neuromusculares:</strong> Acelerômetros e giroscópios triaxiais
                (IMU) quantificam a agitação milimétrica. O tremor fisiológico (8-12 Hz) é modulado
                violentamente durante coerção — amplitude amplificada, frequências de relaxação suprimidas.
              </li>
              <li>
                <strong>Frequência Cardíaca e PPG:</strong> Fotopletismógrafos e sensores de bioimpedância
                aferem vasoconstrição periférica, taquicardia e redução da Variabilidade da Frequência
                Cardíaca (HRV) — biomarcador de estresse detectável por redes neurais.
              </li>
            </ol>

            <p>
              Esses dados desembocam em módulos de <strong>IA de borda (Edge AI)</strong> — Redes de
              Cápsulas (CapsNets) e Random Forest para séries temporais fisiológicas, com escores F1
              entre <strong>96.97% e 99.82%</strong> em datasets clínicos de estresse.
            </p>

            {/* Table: Biometrics */}
            <div className='not-prose overflow-x-auto my-12 border border-neutral-800 rounded-xl shadow-lg'>
              <table className='w-full text-left text-sm text-neutral-300'>
                <caption className='p-4 bg-neutral-900/80 text-left text-cyan-400 font-mono uppercase tracking-widest font-bold border-b border-neutral-800 text-xs'>
                  Tabela 2: Biomarcadores de Detecção Fisiológica de Coação
                </caption>
                <thead>
                  <tr className='bg-neutral-900/80 text-neutral-200'>
                    <th className='px-4 py-3 text-left border-b border-neutral-700 font-semibold'>Biomarcador</th>
                    <th className='px-4 py-3 text-left border-b border-neutral-700 font-semibold'>Hardware</th>
                    <th className='px-4 py-3 text-left border-b border-neutral-700 font-semibold'>Padrão Sob Coerção</th>
                  </tr>
                </thead>
                <tbody className='text-neutral-400'>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>Força e Dinâmica de Contato</td>
                    <td className='px-4 py-3'>Sensores Magnetoelásticos + Strain Gauges</td>
                    <td className='px-4 py-3'>Latência arrítmica; picos de pressão; rigidez de retenção</td>
                  </tr>
                  <tr className='border-b border-neutral-800'>
                    <td className='px-4 py-3'>Tremor Muscular</td>
                    <td className='px-4 py-3'>IMU (Acelerômetros/Giroscópios)</td>
                    <td className='px-4 py-3'>Ruptura da frequência 8-12 Hz; espasmos de alta variabilidade</td>
                  </tr>
                  <tr>
                    <td className='px-4 py-3'>Sinais Cardiovasculares</td>
                    <td className='px-4 py-3'>Bioimpedância / Ópticos / PPG</td>
                    <td className='px-4 py-3'>Vasoconstrição; queda HRV; taquicardia</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Callout: Descoberta Chave — Biometria ── */}
            <aside className='not-prose my-10 border-l-4 border-cyan-500 bg-cyan-950/20 p-6 rounded-r-xl'>
              <h4 className='text-cyan-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2'>
                💡 Descoberta Chave (TL;DR)
              </h4>
              <p className='text-neutral-200 m-0 leading-relaxed'>
                Os módulos de IA de borda (CapsNets + Random Forest) atingiram <strong className='text-white'>escores F1 entre 96.97% e 99.82%</strong> na detecção de estresse fisiológico em datasets clínicos — permitindo ao dispositivo distinguir operação legítima de operação sob coerção em tempo real, sem dependência de servidores externos.
              </p>
            </aside>

            <h3 id='section-4-2'>4.2 Criptografia Negável (Deniable Encryption — Protocolo Phantom Input)</h3>

            <p>
              Quando os barramentos neuromusculares alertam positivamente a flag de coerção, o PSI opta por
              um caminho contraintuitivo: <strong>ele não bloqueia as operações</strong>. Nos ecossistemas
              normativos, o travamento provocaria a aniquilação física do portador por sequestradores
              implacáveis. O dispositivo assume a <strong>preservação da integridade biológica do dono</strong>.
            </p>

            <p>
              O hardware acopla à topologia da <strong>Plausibilidade Negável (Plausible Deniability)</strong>,
              concretizada através da <strong>Criptografia Negável (Deniable Encryption)</strong> baseada
              em <strong>Coercion-Resistant CP-ABE</strong> (Ciphertext-Policy Attribute-Based Encryption).
              Uma única semente deriva dois caminhos:
            </p>

            <ul>
              <li><strong>Real Secret Key (RSK):</strong> revela a carteira central verídica.</li>
              <li><strong>Fake Secret Key (FSK):</strong> abre um ambiente ilusório plausível, com fundos
              operacionais críveis e transações validadas em rede.</li>
            </ul>

            <p>
              Funções baseadas em <strong>mapas de grupos bilineares de ordem composta</strong> e
              <strong> Chameleon Hashing</strong> garantem que as equações não podem ser estatisticamente
              destrinchadas. O agressor escapa saciado acreditando ter extraído as chaves-mestras — enquanto
              a soberania patrimonial real permanece oculta e intacta.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-protocolo-phantom-biometria-coacao.webp'
                alt='Árvore de decisão lógica do Protocolo Phantom Input (Deniable Encryption). Uma biometria central bifurca ativamente o roteamento: o caminho ótico superior seguro (ciano) acessa a chave real (RSK), enquanto o caminho inferior sob detecção de coação (âmbar) redireciona silenciosamente para uma chave falsa (FSK).'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>Figura 3:</strong> Protocolo Phantom Input — Biometria → Flag Coerção → RSK vs FSK (Deniable Encryption).
              </figcaption>
            </figure>

            <h3 id='section-4-3'>4.3 Atestado Criptográfico contra Substituição Hostil (&ldquo;Evil Maid&rdquo;)</h3>

            <p>
              O ataque <em>Evil Maid</em> envolve a troca insidiosa do dispositivo por um clone cosmético
              com hardware rádio-transmissor escondido. O PSI subverte isso com <strong>atestado reverso</strong>:
              é o dispositivo que deve provar sua autenticidade ao host via <strong>Provas de Conhecimento
              Zero (ZKP)</strong>, gerando <strong>Imagens de Boot Pessoais</strong> intransferíveis. Um
              clone sem o chip legítimo não produz a atestação correta, alertando o usuário sobre a
              interceptação.
            </p>

            {/* ═════════ Section 5 ═════════ */}
            <h2 id='section-5'>5. Redundância de Grau Aeroespacial: TMR e Ameaças LEO</h2>

            <p>
              A filosofia do Horizonte de Eventos defende que as ameaças nem sempre são terrestres. Um
              cofre inviolável postula <strong>resiliência contra catástrofes de infraestrutura</strong>,
              garantindo perpetuidade computacional na adversidade — incluindo a <strong>Órbita Terrestre
              Baixa (LEO)</strong>.
            </p>

            <h3 id='section-5-1'>5.1 A Ameaça Radioativa Orbital (SEU, SEL, TID)</h3>

            <p>
              A 300-800 km da superfície, a magnetosfera adelgaça substancialmente (especialmente na
              Anomalia do Atlântico Sul). O ambiente está inundado de prótons solares e íons pesados
              dos raios cósmicos galácticos (GCR). Componentes COTS colapsam sob:
            </p>

            <ul>
              <li>
                <strong>Dose Ionizante Total (TID):</strong> Degeneração contínua de semicondutores pela
                acumulação cumulativa de irradiações gama no SiO₂ isolante, alterando tensões de limiar
                e causando fugas letais.
              </li>
              <li>
                <strong>Efeitos de Eventos Únicos (SEE):</strong> Transientes induzidos pela perfuração
                de uma partícula carregada — <strong>Single-Event Upsets (SEU)</strong> flipam bits
                aleatoriamente; <strong>Single-Event Latch-ups (SEL)</strong> engatilham curtos-circuitos
                fundindo trilhos microscópicos.
              </li>
            </ul>

            <h3 id='section-5-2'>5.2 O Padrão Rad-Hard e FRAM Ferroelétrica</h3>

            <p>
              O PSI descarta memórias Flash e NAND EEPROMs civis em favor de <strong>Memórias RAM
              Ferroelétricas Rad-Hard (FRAM)</strong>. Contrariando memórias tradicionais baseadas no
              aprisionamento de elétrons sobre capacitores de porta flutuante CMOS, a FRAM utiliza
              topologias cristalográficas exóticas (filme fino de <strong>Titanato Zirconato de Chumbo — PZT</strong>).
            </p>

            <p>
              A estrutura mantém as chaves binárias pela <strong>polarização fixa de campo elétrico
              residual</strong> associada a posicionamentos geométricos do cristal metálico — um arranjo de
              dipolo estável inabalável. Partículas ionizantes em trânsito <strong>não corrompem</strong> essas
              cristalizações orientadas, conferindo imunidade nativa em ambientes de TID massivo.
            </p>

            <h3 id='section-5-3'>5.3 Redundância Modular Tripla (TMR)</h3>

            <p>
              Cada operação crítica é fisicamente replicada <strong>três vezes</strong> em microcontroladores
              independentes (sub-blocos A, B, C). Ao final dos cálculos paralelos, as vias convergem num
              <strong> Dispositivo Escrutinador de Maioria (&ldquo;Voter&rdquo;)</strong>.
            </p>

            <p>
              Se uma partícula cósmica flipar os transistores do sub-bloco B (SEU), os conjuntos A e C
              continuam reportando dados corretos. O Voter — por Maioria Simples (2 contra 1) — expulsa
              instantaneamente os erros espúrios, sem reinicializações ou intervenções operacionais. O
              dispositivo mantém operação contínua e infalível sob bombardeio radioativo orbital.
            </p>

            <figure className='not-prose my-16'>
              <img
                src='/whitepapers/psi-arquitetura-tmr-redundancia-voter.webp'
                alt='Esquema de arquitetura Triple Modular Redundancy (TMR) aeroespacial do Projeto PSI. Três microprocessadores independentes processam dados de forma paralela tolerante a falhas, convergindo para uma porta lógica de Voter Majoritário central que valida e emite apenas uma saída ciano unificada e imune a injeção de falhas.'
                loading='lazy'
                className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
              />
              <figcaption className='text-center text-sm text-neutral-500 font-mono'>
                <strong className='text-cyan-500 uppercase tracking-widest'>Figura 4:</strong> Redundância Modular Tripla — Sub-blocos A/B/C → Voter por Maioria → Saída Infalível.
              </figcaption>
            </figure>

            {/* ── Callout: Descoberta Chave — TMR ── */}
            <aside className='not-prose my-10 border-l-4 border-cyan-500 bg-cyan-950/20 p-6 rounded-r-xl'>
              <h4 className='text-cyan-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2'>
                💡 Descoberta Chave (TL;DR)
              </h4>
              <p className='text-neutral-200 m-0 leading-relaxed'>
                A arquitetura de <strong className='text-white'>Redundância Modular Tripla (TMR)</strong> com Voter por maioria simples, combinada a memórias <strong className='text-white'>FRAM Rad-Hard</strong> imunes a TID, garante operação contínua e infalível do PSI mesmo sob bombardeio de raios cósmicos galácticos em Órbita Terrestre Baixa (LEO) — eliminando Single-Event Upsets sem reinicializações.
              </p>
            </aside>

            {/* ═════════ Section 6 ═════════ */}
            <h2 id='section-6'>6. Conclusão</h2>

            <p>
              O <strong>Projeto PSI (Ψ)</strong> transcende de maneira categórica a dimensão de &ldquo;carteira
              eletrônica de consumo&rdquo;, migrando a taxonomia da custódia para patamares inexplorados das
              ciências bélicas, metalúrgicas e de salvaguarda civil planetária.
            </p>

            <p>
              Adotando irrestritamente o manifesto existencial do <strong>&ldquo;Zero Trust in Silicon&rdquo;</strong>,
              suas respostas pavimentam o estado da arte interdisciplinar:
            </p>

            <ol>
              <li>
                <strong>Vanguarda Cinética:</strong> O entrelaçamento da termodinâmica acústica do potting
                epóxi à densidade militar do Cu-W suprime os vetores forenses acústicos piezoelétricos em
                paralelo com a absorção instantânea de EMP.
              </li>
              <li>
                <strong>Efemeridade Criptográfica Rad-Hard:</strong> A abolição da persistência eletrônica
                por SRAM PUF, solidificada pelo XMSS pós-quântico (NIST SP 800-208) e sobrevivendo em
                memórias FRAM cristalografadas, varre os perigos de microscópios forenses e do futuro quântico.
              </li>
              <li>
                <strong>Resguardo Neural de Plausibilidade Ativa:</strong> Os biomarcadores comportamentais
                (CapsNets) desencadeiam mutação cibernética indetectável para criptografia fantasma negável
                sob estresse de coerção em tempo real.
              </li>
            </ol>

            <p>
              Ao unificar essas frentes de salvaguarda material e processamento cibernético, o dispositivo
              consagra-se como o <strong>baluarte e a fronteira imutável do horizonte de eventos tangível
              na defesa inabalável do futuro da soberania pessoal</strong>.
            </p>

          </div>{/* end prose */}

          {/* ─── References ─── */}
          <section className='mt-16 rounded-xl border border-neutral-800 bg-neutral-900/30 p-6'>
            <h2 className='text-lg font-bold text-white mb-4'>Referências Científicas</h2>
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
        </div>
      </article>

      {/* ═══════════════════════════════════════════════════════════════
          AUTHOR + CTA + FAQ
          ═══════════════════════════════════════════════════════════════ */}
      <section className='bg-neutral-950 text-neutral-200 pb-4'>
        <div className='max-w-5xl mx-auto px-6'>
          <AuthorHubCard
            label='Pesquisa & Co-invenção'
            description='Projeto PSI investigado e documentado por Ulisses Flores — Consultor Estratégico de IA, Arquiteto de Software, Desenvolvedor de Hardware, co-inventor do Codex Hash e Mestrando em IA pela AGTU (EUA).'
          />
        </div>
      </section>

      <section className='bg-neutral-950 text-neutral-200 py-12'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h2 className='text-xl font-bold text-white mb-3'>
            Interesse em soberania digital e hardware criptográfico?
          </h2>
          <p className='text-neutral-400 mb-6 max-w-2xl mx-auto text-sm leading-relaxed'>
            Ulisses Flores oferece consultoria em privacidade digital, arquiteturas de hardware wallet,
            Ring Signatures e implementação de protocolos de soberania para empresas e projetos de
            blockchain. Entre em contato.
          </p>
          <Link
            href='/'
            className='inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm'
          >
            Falar com Ulisses Flores →
          </Link>
        </div>
      </section>

      <section className='bg-neutral-950 text-neutral-200 pb-16'>
        <div className='max-w-4xl mx-auto px-6'>
          <FaqSection
            items={projectPsiFaq}
            sectionTitle='Perguntas sobre o Projeto PSI e Hardware Wallet'
          />
        </div>
      </section>

      <script
        id='structured-data-projeto-psi'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </>
  );
}
