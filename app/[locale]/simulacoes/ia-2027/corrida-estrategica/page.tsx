import { defaultLocale, isLocale, localeToOgLocale } from '@/data/i18n';
import type { Locale } from '@/data/i18n';
import type { Metadata } from 'next';
import Link from 'next/link';
import { IA2027Simulation } from '@/components/simulations/ia-2027/ia-2027-simulation';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { getDictionary } from '@/lib/get-dictionary';
import { localePath } from '@/lib/locale-path';
import { buildCanonical, buildLanguageAlternates } from '@/data/seo';

const canonicalPath = '/simulacoes/ia-2027/corrida-estrategica';
const parentPath = '/simulacoes/ia-2027';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.ia2027;

  return {
    title: t.raceMeta.title,
    description: t.raceMeta.description,
    keywords: [...t.raceMeta.keywords],
    authors: [{ name: upkfMeta.publicDisplayName || upkfMeta.displayName, url: `${upkfMeta.primaryWebsite}/identidade` }],
    alternates: { canonical: buildCanonical(locale, canonicalPath), languages: buildLanguageAlternates(canonicalPath) },
    openGraph: {
      type: 'article',
      url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
      title: t.raceMeta.ogTitle,
      description: t.raceMeta.ogDescription,
      locale: localeToOgLocale[locale],
      images: [{
        url: `${upkfMeta.primaryWebsite}/simulacao-ia-2027-futuro-agi-ulisses-flores.jpg`,
        width: 2752,
        height: 1536,
        alt: t.raceMeta.ogImageAlt,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.raceMeta.ogTitle,
      description: t.raceMeta.ogDescription,
      images: [`${upkfMeta.primaryWebsite}/simulacao-ia-2027-futuro-agi-ulisses-flores.jpg`],
    },
  };
}

export default async function CorridaEstrategicaPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.ia2027.racePage;

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
          'corrida estratégica IA, race AGI, corrida armamentista inteligência artificial, superinteligência riscos, AGI perda de controle',
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
              href={localePath('/simulacoes', locale)}
              className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'
            >
              {dict.ia2027.breadcrumb.simulations}
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <Link
              href={localePath('/simulacoes/ia-2027', locale)}
              className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'
            >
              IA 2027
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-red-500'>
              {dict.ia2027.breadcrumb.race}
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
          <div className='border-l-4 border-red-600 bg-red-950/20 px-6 py-5 rounded-r-xl mb-10'>
            <p className='text-sm font-semibold text-red-400 uppercase tracking-wide mb-2'>
              {t.alert.kicker}
            </p>
            <p className='text-neutral-300 leading-relaxed'>
              {t.alert.text}
            </p>
          </div>

          {/* CTA */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
            <Link
              href={localePath('/simulacoes/ia-2027', locale)}
              className='inline-flex items-center gap-2 bg-red-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-red-500 transition-colors text-sm'
            >
              {t.ctaFull}
            </Link>
            <Link
              href={localePath('/simulacoes/ia-2027/desaceleracao-coordenada', locale)}
              className='text-xs text-neutral-500 hover:text-neutral-300 underline'
            >
              {t.ctaAlt}
            </Link>
          </div>
        </div>
      </section>

      {/* Simulation locked to race path */}
      <IA2027Simulation initialPath='race' />

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
        id='structured-data-corrida-estrategica'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </>
  );
}
