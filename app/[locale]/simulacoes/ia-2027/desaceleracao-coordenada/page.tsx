import { defaultLocale, isLocale } from '@/data/i18n';
import type { Locale } from '@/data/i18n';
import type { Metadata } from 'next';
import Link from 'next/link';
import { IA2027Simulation } from '@/components/simulations/ia-2027/ia-2027-simulation';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { ia2027Faq } from '@/data/faq';
import { getDictionary } from '@/lib/get-dictionary';

const canonicalPath = '/simulacoes/ia-2027/desaceleracao-coordenada';
const parentPath = '/simulacoes/ia-2027';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: 'Desaceleração Coordenada: Cenário Slowdown da IA 2027 | Ulisses Flores',
  description:
    'Explore o cenário de Desaceleração Coordenada da simulação IA 2027: pausa global, alinhamento técnico e regulamentação internacional da AGI. Análise por Ulisses Flores — Consultor em IA, Professor, Palestrante e Mestrando AGTU (EUA).',
  keywords: [
    'desaceleração coordenada IA',
    'slowdown AGI',
    'alinhamento de IA',
    'regulamentação inteligência artificial',
    'segurança IA AGI',
    'cenários futuros IA',
    'soberania tecnológica',
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
    title: 'Desaceleração Coordenada: Cenário Slowdown da IA 2027',
    description:
      'Explore o cenário de Desaceleração Coordenada da simulação IA 2027: pausa global, alinhamento técnico e regulamentação internacional da AGI.',
    locale: 'pt_BR',
    images: [
      {
        url: `${upkfMeta.primaryWebsite}/simulacao-ia-2027-futuro-agi-ulisses-flores.jpg`,
        width: 2752,
        height: 1536,
        alt: 'IA 2027 · Desaceleração Coordenada — Cenário Slowdown',
      },
    ],
  },
};

export default async function DesaceleracaoCoordenadaPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.ia2027.slowdownPage;

  const origin = upkfMeta.primaryWebsite;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['WebPage', 'Article'],
        '@id': `${origin}${canonicalPath}#webpage`,
        url: `${origin}${canonicalPath}`,
        name: t.h1,
        headline: t.h1,
        description: t.lead,
        inLanguage: locale,
        keywords:
          'desaceleração coordenada IA, slowdown AGI, alinhamento de IA, regulamentação inteligência artificial, segurança IA',
        isPartOf: {
          '@id': `${origin}${parentPath}#webpage`,
        },
        author: {
          '@id': `${origin}/#person`,
        },
        image: `${origin}/simulacao-ia-2027-futuro-agi-ulisses-flores.jpg`,
      },
    ],
  };

  return (
    <>
      {/* Hero Section */}
      <section className='bg-neutral-950 text-neutral-200 pt-20 pb-16 border-b border-neutral-800'>
        <div className='max-w-4xl mx-auto px-6'>
          {/* Breadcrumb */}
          <div className='flex items-center gap-2 mb-6 flex-wrap'>
            <Link
              href='/simulacoes'
              className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'
            >
              {dict.ia2027.breadcrumb.simulations}
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <Link
              href='/simulacoes/ia-2027'
              className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'
            >
              IA 2027
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-emerald-400'>
              {dict.ia2027.breadcrumb.slowdown}
            </span>
          </div>

          {/* H1 */}
          <h1 className='text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6 text-white'>
            {t.h1}
          </h1>

          {/* Lead */}
          <p className='text-lg text-neutral-400 leading-relaxed mb-8 max-w-3xl'>
            {t.lead}
          </p>

          {/* Alert card */}
          <div className='border-l-4 border-emerald-600 bg-emerald-950/20 px-6 py-5 rounded-r-xl mb-10'>
            <p className='text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2'>
              {t.alert.kicker}
            </p>
            <p className='text-neutral-300 leading-relaxed'>
              {t.alert.text}
            </p>
          </div>

          {/* CTA */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <Link
              href='/simulacoes/ia-2027'
              className='inline-flex items-center gap-2 bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full hover:bg-emerald-600 transition-colors text-sm'
            >
              {t.ctaFull}
            </Link>
            <Link
              href='/simulacoes/ia-2027/corrida-estrategica'
              className='text-xs text-neutral-500 hover:text-neutral-300 underline'
            >
              {t.ctaAlt}
            </Link>
          </div>
        </div>
      </section>

      {/* Simulation locked to slowdown path */}
      <IA2027Simulation initialPath='slowdown' />

      {/* Author section */}
      <section className='bg-neutral-950 text-neutral-200 pb-12 pt-2'>
        <div className='max-w-7xl mx-auto px-6'>
          <AuthorHubCard
            label={t.authorLabel}
            description={t.authorDescription}
          />
        </div>
      </section>

      {/* FAQ section */}
      <section className='bg-neutral-950 text-neutral-200 pb-16'>
        <div className='max-w-4xl mx-auto px-6'>
          <FaqSection
            items={ia2027Faq}
            sectionTitle={t.faqTitle}
          />
        </div>
      </section>

      <script
        id='structured-data-desaceleracao-coordenada'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </>
  );
}
