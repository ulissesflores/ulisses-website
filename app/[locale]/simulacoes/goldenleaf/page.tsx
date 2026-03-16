import { defaultLocale, isLocale, localeToOgLocale } from '@/data/i18n';
import type { Locale } from '@/data/i18n';
import type { Metadata } from 'next';
import Link from 'next/link';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { getDictionary } from '@/lib/get-dictionary';
import { localePath } from '@/lib/locale-path';
import { buildCanonical } from '@/data/seo';

const canonicalPath = '/simulacoes/goldenleaf';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.goldenleaf;

  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: [...t.meta.keywords],
    authors: [{ name: upkfMeta.publicDisplayName || upkfMeta.displayName, url: `${upkfMeta.primaryWebsite}/identidade` }],
    alternates: { canonical: buildCanonical(locale, canonicalPath) },
    openGraph: {
      type: 'website',
      url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      locale: localeToOgLocale[locale],
    },
  };
}

export default async function GoldenLeafPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.goldenleaf;

  const origin = upkfMeta.primaryWebsite;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${origin}${canonicalPath}#webpage`,
        url: `${origin}${canonicalPath}`,
        name: t.hero.h1,
        description: t.hero.lead,
        inLanguage: locale,
        isPartOf: {
          '@id': `${origin}/simulacoes#collection`,
        },
        author: {
          '@id': `${origin}/#person`,
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${origin}${canonicalPath}#software`,
        name: 'GoldenLeaf',
        description: t.hero.lead,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'IoT / Embedded',
        author: {
          '@id': `${origin}/#person`,
        },
      },
    ],
  };

  return (
    <>
      {/* Hero Section */}
      <section className='bg-neutral-950 text-neutral-200 pt-20 pb-16 border-b border-neutral-800'>
        <div className='max-w-4xl mx-auto px-6'>
          {/* Breadcrumb */}
          <div className='flex items-center gap-2 mb-6'>
            <Link href={localePath('/', locale)} className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'>
              Home
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <Link href={localePath('/simulacoes', locale)} className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'>
              {t.breadcrumb.simulations}
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-neutral-500'>
              {t.breadcrumb.goldenleaf}
            </span>
          </div>

          {/* H1 */}
          <h1 className='text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6 text-white'>
            {t.hero.h1}
          </h1>

          {/* Lead paragraph */}
          <p className='text-lg text-neutral-400 leading-relaxed mb-8 max-w-3xl'>
            {t.hero.lead}
          </p>

          {/* Authority block */}
          <div className='border-l-4 border-cyan-700 bg-cyan-950/20 px-6 py-5 rounded-r-xl mb-10'>
            <p className='text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2'>
              {t.hero.authority.kicker}
            </p>
            <p className='text-neutral-300 leading-relaxed'>
              {t.hero.authority.text}
            </p>
          </div>

          {/* Credential chips */}
          <div className='flex flex-wrap gap-2 mb-8'>
            {[...t.hero.credentials].map((credential) => (
              <span
                key={credential}
                className='text-xs font-mono border border-neutral-700 bg-neutral-900/40 text-neutral-400 px-3 py-1 rounded-full'
              >
                {credential}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className='bg-neutral-950 text-neutral-200 py-16'>
        <div className='max-w-5xl mx-auto px-6'>
          <h2 className='text-2xl font-bold text-white mb-8'>{t.architecture.title}</h2>

          <div className='grid sm:grid-cols-2 gap-6 mb-10'>
            {[...t.architecture.specs].map((spec) => (
              <article key={spec.title} className='rounded-xl border border-neutral-800 bg-neutral-900/40 p-6'>
                <span className='text-[10px] uppercase tracking-[0.2em] text-emerald-300 border border-emerald-700/40 rounded-full px-3 py-1'>
                  {spec.tag}
                </span>
                <h3 className='text-lg font-bold text-white mt-4 mb-2'>{spec.title}</h3>
                <p className='text-sm text-neutral-400 leading-relaxed'>{spec.description}</p>
              </article>
            ))}
          </div>

          {/* Related Publications */}
          <div className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6'>
            <h3 className='text-lg font-semibold text-white mb-4'>{t.architecture.relatedTitle}</h3>
            <div className='space-y-3'>
              <Link
                href={localePath('/whitepapers/2025-iot-data-sovereignty', locale)}
                className='block text-sm text-emerald-300 hover:text-emerald-200 transition-colors'
              >
                {t.architecture.relatedLinks[0]}
              </Link>
              <Link
                href={localePath('/whitepapers/2025-hybrid-cooling-thermodynamics', locale)}
                className='block text-sm text-emerald-300 hover:text-emerald-200 transition-colors'
              >
                {t.architecture.relatedLinks[1]}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Author block */}
      <section className='bg-neutral-950 text-neutral-200 pb-4'>
        <div className='max-w-5xl mx-auto px-6'>
          <AuthorHubCard
            label={t.author.label}
            description={t.author.description}
          />
        </div>
      </section>

      {/* CTA */}
      <section className='bg-neutral-950 text-neutral-200 py-12'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h2 className='text-xl font-bold text-white mb-3'>
            {t.cta.title}
          </h2>
          <p className='text-neutral-400 mb-6 max-w-2xl mx-auto text-sm leading-relaxed'>
            {t.cta.description}
          </p>
          <Link
            href={localePath('/', locale)}
            className='inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm'
          >
            {t.cta.button}
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className='bg-neutral-950 text-neutral-200 pb-16'>
        <div className='max-w-4xl mx-auto px-6'>
          <FaqSection
            items={[...dict.faq.goldenleaf]}
            sectionTitle={t.faq.sectionTitle}
          />
        </div>
      </section>

      <script
        id='structured-data-goldenleaf'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </>
  );
}
