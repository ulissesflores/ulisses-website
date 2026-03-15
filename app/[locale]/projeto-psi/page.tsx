import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { projetoPsiComercialFaq } from '@/data/faq';

const canonicalPath = '/projeto-psi';

export const metadata: Metadata = {
  title: 'Projeto PSI — Hardware Soberano para Custódia de Ativos Digitais | Ulisses Flores',
  description:
    'Custódia de ativos digitais de classe nuclear. Hardware com Zero Trust em Silício, criptografia pós-quântica XMSS e redundância aeroespacial TMR. Investimento e licenciamento.',
  keywords: [
    'hardware wallet',
    'custódia de ativos digitais',
    'zero trust hardware',
    'criptografia pós-quântica',
    'SRAM PUF',
    'investimento hardware security',
    'soberania digital',
    'cold storage institucional',
    'Ulisses Flores',
    'Codex Hash',
    'segurança nuclear',
    'TMR redundância',
  ],
  alternates: { canonical: canonicalPath },
  openGraph: {
    type: 'website',
    url: `https://ulissesflores.com${canonicalPath}`,
    title: 'Projeto PSI — Hardware Soberano para Custódia de Ativos Digitais',
    description:
      'Custódia de ativos digitais de classe nuclear. Zero Trust em Silício, XMSS pós-quântico e redundância aeroespacial TMR.',
    locale: 'pt_BR',
  },
};

const origin = upkfMeta.primaryWebsite;

const pageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
      '@id': `${origin}${canonicalPath}#product`,
      url: `${origin}${canonicalPath}`,
      name: 'Projeto PSI — Hardware Soberano de Custódia',
      description:
        'Dispositivo de hardware para custódia soberana de ativos digitais com Zero Trust em Silício, criptografia pós-quântica XMSS, SRAM PUF e redundância modular tripla aeroespacial.',
      brand: { '@type': 'Brand', name: 'Codex Hash' },
      manufacturer: { '@id': `${origin}/#person` },
      category: 'Hardware Security / Digital Asset Custody',
      audience: {
        '@type': 'BusinessAudience',
        audienceType: 'Investors, VCs, Family Offices, Institutional Custody',
      },
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/PreOrder',
        priceCurrency: 'USD',
        price: '0',
        description: 'Licenciamento e investimento — contato direto.',
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${origin}${canonicalPath}#webpage`,
      url: `${origin}${canonicalPath}`,
      name: 'Projeto PSI — Hardware Soberano para Custódia de Ativos Digitais',
      isPartOf: { '@id': `${origin}/#website` },
      about: { '@id': `${origin}${canonicalPath}#product` },
      author: { '@id': `${origin}/#person` },
    },
  ],
};

const pillars = [
  {
    src: '/whitepapers/psi-arquitetura-hardware-camadas-defesa.webp',
    alt: 'Diagrama das camadas de defesa do hardware PSI: blindagem Faraday, cerâmica anti-térmica e isolamento acústico',
    title: 'Fortaleza Física',
    text: 'Chassis blindado com malha Faraday contra pulsos eletromagnéticos. Cerâmica anti-térmica. Isolamento acústico contra ataques de canal lateral. Sem USB. Sem tela. Sem superfície de ataque.',
  },
  {
    src: '/whitepapers/psi-ciclo-vida-chave-criptografica-sram-puf.webp',
    alt: 'Ciclo de vida da chave criptográfica: reconstrução efêmera via SRAM PUF — a chave nunca existe em repouso',
    title: 'Chave que Nunca Existe',
    text: 'A chave privada não é armazenada — em lugar nenhum. Ela é reconstruída temporariamente usando a impressão digital única do silício (SRAM PUF) e colapsa após cada uso. Sem semente para roubar.',
  },
  {
    src: '/whitepapers/psi-protocolo-phantom-biometria-coacao.webp',
    alt: 'Protocolo Phantom Input: detecção de coação por biometria comportamental e liberação de fundos falsos sob extorsão',
    title: 'Anti-Sequestro Inteligente',
    text: 'O PSI aprende seu padrão biométrico. Se detectar stress ou coação, ativa o Phantom Mode: desbloqueia uma carteira-fantasma com fundos falsos. O agressor nunca saberá que foi enganado.',
  },
  {
    src: '/whitepapers/psi-arquitetura-tmr-redundancia-voter.webp',
    alt: 'Arquitetura TMR com voter: três processadores executam em paralelo e um voter valida consenso — padrão aeroespacial',
    title: 'Redundância Aeroespacial',
    text: 'Três processadores executam cada operação em paralelo. Um "voter" valida o consenso. Se um chip falhar ou for adulterado, os outros dois continuam. É a mesma tecnologia usada em satélites e mísseis.',
  },
];

const targetMarket = [
  {
    title: 'Family Offices & UHNWIs',
    text: 'Custódia pessoal de patrimônio digital de 7+ dígitos sem depender de terceiros.',
  },
  {
    title: 'Fundos & Exchanges Institucionais',
    text: 'Cold storage de classe militar para compliance e auditoria de custódia qualificada.',
  },
  {
    title: 'Governos & Bancos Centrais',
    text: 'Custódia soberana de reservas digitais nacionais e CBDCs com resistência a ataques de estado.',
  },
];

const stats = [
  {
    value: '0',
    label: 'Chaves armazenadas permanentemente. Zero superfície de ataque estática.',
  },
  {
    value: '3×',
    label: 'Redundância modular tripla. Cada operação validada por consenso de 3 processadores.',
  },
  {
    value: 'Q-Day Ready',
    label: 'Criptografia XMSS pós-quântica. Preparado para o dia em que computadores quânticos quebrarem RSA e ECDSA.',
  },
  {
    value: 'EMP-Proof',
    label: 'Blindagem Faraday + cerâmica. Funcional após pulso eletromagnético.',
  },
];

export default function ProjetoPsiPage() {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className='relative w-full bg-neutral-950 py-28 sm:py-36'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]' />
        <div className='relative mx-auto max-w-4xl px-6 text-center'>
          <span className='inline-block rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 mb-8'>
            Investimento &amp; Licenciamento
          </span>
          <h1 className='text-4xl font-extrabold leading-[1.1] tracking-tight text-neutral-50 sm:text-5xl lg:text-6xl'>
            Projeto PSI: O Cofre Digital que Desafia as Leis da Física
          </h1>
          <p className='mt-6 text-lg leading-relaxed text-neutral-400 sm:text-xl max-w-3xl mx-auto'>
            Custódia soberana de ativos digitais com segurança de classe nuclear. Zero Trust em
            silício. Criptografia à prova de computadores quânticos. Redundância de nível
            aeroespacial.
          </p>
          <div className='mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
            <a
              href='#contato'
              className='inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-3.5 text-sm font-bold text-neutral-950 shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-400/30'
            >
              Solicitar Apresentação Executiva
            </a>
            <Link
              href='/whitepapers/projeto-psi'
              className='inline-flex items-center justify-center rounded-full border border-neutral-700 px-8 py-3.5 text-sm font-semibold text-neutral-300 transition-colors hover:border-neutral-500 hover:text-neutral-100'
            >
              Ler o Whitepaper Técnico
            </Link>
          </div>
        </div>
      </section>

      {/* ── EXECUTIVE SUMMARY ───────────────────────────────────────────── */}
      <section className='bg-neutral-950 py-24'>
        <article className='mx-auto max-w-4xl px-6'>
          <h2 className='text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl'>
            Por Que o PSI Existe
          </h2>
          <div className='mt-8 space-y-6 text-lg leading-relaxed text-neutral-300'>
            <p>
              A era do &ldquo;confie no banco&rdquo; acabou. A era do &ldquo;confie na
              exchange&rdquo; nunca deveria ter começado. O Projeto PSI nasce da premissa radical de
              que a custódia dos seus ativos digitais não pode depender de nenhuma instituição,
              nenhum servidor e nenhuma pessoa — nem mesmo do fabricante do dispositivo.
            </p>
            <p>
              Enquanto hardware wallets tradicionais protegem contra hackers amadores, o PSI foi
              arquitetado para resistir a adversários de estado, ataques eletromagnéticos, extorsão
              física e até computadores quânticos. Não é uma melhoria incremental.{' '}
              <strong className='text-emerald-400'>É uma mudança de paradigma.</strong>
            </p>
          </div>
        </article>
      </section>

      {/* ── 4 PILLARS ───────────────────────────────────────────────────── */}
      <section className='bg-neutral-950 py-24'>
        <div className='mx-auto max-w-6xl px-6'>
          <h2 className='text-center text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl mb-16'>
            Quatro Pilares de Segurança Absoluta
          </h2>
          <div className='grid gap-10 sm:grid-cols-2'>
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className='group rounded-2xl border border-neutral-800/60 bg-neutral-900/30 p-6 transition-colors hover:border-emerald-500/30'
              >
                <div className='overflow-hidden rounded-xl bg-neutral-950 mb-6'>
                  <Image
                    src={pillar.src}
                    alt={pillar.alt}
                    width={720}
                    height={405}
                    className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]'
                  />
                </div>
                <h3 className='text-xl font-bold text-neutral-50 mb-3'>{pillar.title}</h3>
                <p className='text-neutral-400 leading-relaxed'>{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARGET MARKET ───────────────────────────────────────────────── */}
      <section className='bg-neutral-950 py-24'>
        <div className='mx-auto max-w-6xl px-6'>
          <h2 className='text-center text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl mb-16'>
            Para Quem é o PSI
          </h2>
          <div className='grid gap-8 sm:grid-cols-3'>
            {targetMarket.map((segment) => (
              <article
                key={segment.title}
                className='rounded-2xl border border-neutral-800/60 bg-neutral-900/30 p-8 text-center transition-colors hover:border-cyan-500/30'
              >
                <h3 className='text-lg font-bold text-cyan-400 mb-4'>{segment.title}</h3>
                <p className='text-neutral-400 leading-relaxed'>{segment.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── NUMBERS ─────────────────────────────────────────────────────── */}
      <section className='bg-neutral-950 py-24'>
        <div className='mx-auto max-w-6xl px-6'>
          <h2 className='text-center text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl mb-16'>
            Os Números que Importam
          </h2>
          <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
            {stats.map((stat) => (
              <div
                key={stat.value}
                className='rounded-2xl border border-neutral-800/60 bg-neutral-900/30 p-8 text-center'
              >
                <p className='text-4xl font-extrabold text-emerald-400 mb-4'>{stat.value}</p>
                <p className='text-sm text-neutral-400 leading-relaxed'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUTHOR HUB CARD ─────────────────────────────────────────────── */}
      <section className='bg-neutral-950 py-12'>
        <div className='mx-auto max-w-4xl px-6'>
          <AuthorHubCard
            label='Inventor & Arquiteto'
            description='Projeto concebido por Ulisses Flores — Consultor Estratégico de IA, Mestrando em Inteligência Artificial pela AGTU (EUA) e co-inventor de tecnologias blockchain (Codex Hash).'
          />
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className='bg-neutral-950 py-24'>
        <div className='mx-auto max-w-4xl px-6'>
          <FaqSection
            items={projetoPsiComercialFaq}
            sectionTitle='Perguntas Frequentes — Investidores'
          />
        </div>
      </section>

      {/* ── CTA / CONTATO ───────────────────────────────────────────────── */}
      <section id='contato' className='bg-neutral-950 py-28'>
        <div className='mx-auto max-w-3xl px-6 text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl'>
            Pronto para Conhecer o Futuro da Custódia?
          </h2>
          <p className='mt-6 text-lg text-neutral-400 leading-relaxed'>
            Agende uma apresentação executiva do Projeto PSI. Discutimos modelo de licenciamento,
            roadmap de produto e oportunidades de investimento.
          </p>
          <div className='mt-10'>
            <Link
              href='/'
              className='inline-flex items-center justify-center rounded-full bg-emerald-500 px-10 py-4 text-sm font-bold text-neutral-950 shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-400/30'
            >
              Entrar em Contato
            </Link>
          </div>
        </div>
      </section>

      {/* ── CROSS-LINK ──────────────────────────────────────────────────── */}
      <aside className='bg-neutral-950 pb-20'>
        <div className='mx-auto max-w-4xl px-6 text-center'>
          <Link
            href='/whitepapers/projeto-psi'
            className='inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-emerald-400'
          >
            📄 Leia o Whitepaper Técnico Completo &rarr;
          </Link>
        </div>
      </aside>
    </>
  );
}
