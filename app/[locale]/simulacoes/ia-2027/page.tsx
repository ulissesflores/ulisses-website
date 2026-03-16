import { defaultLocale, isLocale, localeToOgLocale } from '@/data/i18n';
import type { Locale } from '@/data/i18n';
import type { Metadata } from 'next';
import Link from 'next/link';
import { IA2027Simulation } from '@/components/simulations/ia-2027/ia-2027-simulation';
import type { SimulationPath } from '@/components/simulations/ia-2027/types';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { getDictionary } from '@/lib/get-dictionary';
import { localePath } from '@/lib/locale-path';
import { buildCanonical } from '@/data/seo';

const canonicalPath = '/simulacoes/ia-2027';

type IA2027SearchParams = Promise<{
  path?: string | string[];
}>;

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: IA2027SearchParams;
}

function parseInitialPath(rawPath?: string | string[]): SimulationPath {
  const value = Array.isArray(rawPath) ? rawPath[0] : rawPath;
  if (value === 'slowdown' || value === 'race') {
    return value;
  }
  return 'main';
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.ia2027;

  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: [...t.meta.keywords],
    authors: [{ name: upkfMeta.publicDisplayName || upkfMeta.displayName, url: `${upkfMeta.primaryWebsite}/identidade` }],
    alternates: { canonical: buildCanonical(locale, canonicalPath) },
    openGraph: {
      type: 'article',
      url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      locale: localeToOgLocale[locale],
      images: [{
        url: `${upkfMeta.primaryWebsite}/simulacao-ia-2027-futuro-agi-ulisses-flores.jpg`,
        width: 1200,
        height: 630,
        alt: t.meta.ogImageAlt,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      images: [`${upkfMeta.primaryWebsite}/simulacao-ia-2027-futuro-agi-ulisses-flores.jpg`],
    },
  };
}

export default async function IA2027Page({ params, searchParams }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.ia2027.mainPage;

  const resolvedSearchParams = await searchParams;
  const initialPath = parseInitialPath(resolvedSearchParams.path);

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['WebPage', 'Article', 'SoftwareApplication'],
    '@id': `${upkfMeta.primaryWebsite}${canonicalPath}#webpage`,
    url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
    name: t.h1,
    headline: t.h1,
    description: t.lead,
    inLanguage: locale,
    keywords: 'futuro da inteligência artificial, cenários futuros IA, o que é AGI, inteligência artificial geral, soberania tecnológica, impacto da IA no mercado, agentes autônomos',
    about: [
      {
        '@type': 'Thing',
        name: 'Artificial General Intelligence',
        sameAs: 'https://en.wikipedia.org/wiki/Artificial_general_intelligence',
      },
      {
        '@type': 'Thing',
        name: 'AI Safety',
        sameAs: 'https://en.wikipedia.org/wiki/AI_safety',
      },
    ],
    translationOfWork: {
      '@type': 'CreativeWork',
      url: 'https://ai-2027.com/',
      name: 'AI 2027',
      inLanguage: 'en',
    },
    isPartOf: {
      '@id': `${upkfMeta.primaryWebsite}/#website`,
    },
    author: {
      '@id': `${upkfMeta.primaryWebsite}/#person`,
    },
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    image: `${upkfMeta.primaryWebsite}/simulacao-ia-2027-futuro-agi-ulisses-flores.jpg`,
  };

  return (
    <>
      {/* Hero Section — server-rendered for SEO/GEO/LLM */}
      <section className='bg-neutral-950 text-neutral-200 pt-20 pb-16 border-b border-neutral-800'>
        <div className='max-w-4xl mx-auto px-6'>

          {/* Breadcrumb / Kicker */}
          <div className='flex items-center gap-2 mb-6'>
            <Link
              href={localePath('/simulacoes', locale)}
              className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'
            >
              {dict.ia2027.breadcrumb.simulations}
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-neutral-500'>
              {dict.ia2027.breadcrumb.scenarios}
            </span>
          </div>

          {/* H1 */}
          <h1 className='text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6 text-white'>
            {t.h1}
          </h1>

          {/* Lead paragraph */}
          <p className='text-lg text-neutral-400 leading-relaxed mb-8 max-w-3xl'>
            {t.lead}
          </p>

          {/* Alert card — EEAT / Por que isso importa */}
          <div className='border-l-4 border-cyan-700 bg-cyan-950/20 px-6 py-5 rounded-r-xl mb-10'>
            <p className='text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2'>
              {t.authority.kicker}
            </p>
            <p className='text-neutral-300 leading-relaxed'>
              {t.authority.text}
            </p>
          </div>

          {/* Feature cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10'>
            {[...t.features].map((card) => (
              <div
                key={card.title}
                className='border border-neutral-800 rounded-xl p-5 bg-neutral-900/40'
              >
                <p className='font-semibold text-sm text-white mb-1'>{card.title}</p>
                <p className='text-sm text-neutral-400 leading-relaxed'>{card.body}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <a
              href='#ia-2027-sim'
              className='inline-flex items-center gap-2 bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full hover:bg-emerald-600 transition-colors text-sm'
            >
              {t.cta}
            </a>
            <p className='text-xs text-neutral-500 max-w-sm'>
              {t.ctaNote}{' '}
              <a
                href='https://ai-2027.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='underline hover:text-gray-700'
              >
                ai-2027.com
              </a>{' '}
              {t.ctaNoteEnd}
            </p>
          </div>
        </div>
      </section>

      {/* Simulation */}
      <IA2027Simulation initialPath={initialPath} />

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
            items={[...dict.faq.ia2027]}
            sectionTitle={t.faqTitle}
          />
        </div>
      </section>

      <script
        id='structured-data-ia-2027'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </>
  );
}
