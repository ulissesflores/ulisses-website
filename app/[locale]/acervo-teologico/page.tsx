import { defaultLocale, isLocale, localeToOgLocale } from '@/data/i18n';
import type { Locale } from '@/data/i18n';
import type { Metadata } from 'next';
import Link from 'next/link';
import { acervoCanonicalPath, acervoClusters, acervoSermons } from '@/data/acervo-teologico';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { acervoTeologicoFaq } from '@/data/faq';
import { getDictionary } from '@/lib/get-dictionary';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.acervoTeologico;

  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: [...t.meta.keywords],
    authors: [
      {
        name: upkfMeta.publicDisplayName || upkfMeta.displayName,
        url: `${upkfMeta.primaryWebsite}/identidade`,
      },
    ],
    alternates: {
      canonical: acervoCanonicalPath,
    },
    openGraph: {
      type: 'website',
      url: `${upkfMeta.primaryWebsite}${acervoCanonicalPath}`,
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      locale: localeToOgLocale[locale],
    },
  };
}

export default async function AcervoTeologicoPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.acervoTeologico;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${upkfMeta.primaryWebsite}${acervoCanonicalPath}#collection`,
    url: `${upkfMeta.primaryWebsite}${acervoCanonicalPath}`,
    name: t.hero.h1,
    description: t.hero.lead,
    inLanguage: locale,
    isPartOf: {
      '@id': `${upkfMeta.primaryWebsite}/#website`,
    },
    author: {
      '@id': `${upkfMeta.primaryWebsite}/#person`,
    },
    hasPart: acervoSermons.map((sermon) => ({
      '@type': 'WebPage',
      '@id': `${upkfMeta.primaryWebsite}${sermon.canonicalPath}`,
      name: sermon.seoTitle,
      url: `${upkfMeta.primaryWebsite}${sermon.canonicalPath}`,
    })),
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      {/* ── Hero Section ── */}
      <section className='bg-neutral-950 text-neutral-200 pt-20 pb-16 border-b border-neutral-800'>
        <div className='max-w-4xl mx-auto px-6'>
          {/* Breadcrumb */}
          <div className='flex items-center gap-2 mb-6'>
            <Link href='/' className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'>
              Home
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-neutral-500'>
              {t.breadcrumb}
            </span>
          </div>

          {/* H1 */}
          <h1 className='text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight'>
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
          <div className='flex flex-wrap gap-2 mb-6'>
            {[...t.hero.credentials, `+${acervoSermons.length} ${t.hero.sermonsLabel}`].map((chip) => (
              <span
                key={chip}
                className='text-xs font-mono border border-neutral-700 bg-neutral-900/40 text-neutral-400 px-3 py-1 rounded-full'
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Stats */}
          <p className='text-sm text-neutral-500'>
            {t.hero.stats.clusters}: {acervoClusters.length} · {t.hero.stats.messages}: {acervoSermons.length}
          </p>
          <div className='mt-4 max-w-xl'>
            <AuthorHubCard label={t.hero.authorLabel} compact description={t.hero.authorDescription} />
          </div>
        </div>
      </section>

      {/* ── Clusters Grid ── */}
      <main className='max-w-6xl mx-auto px-6 py-16'>
        <h2 className='text-2xl font-bold text-white mb-8'>{t.grid.title}</h2>

        <div className='space-y-8'>
          {acervoClusters.map((cluster) => (
            <section
              key={cluster.id}
              id={`cluster-${cluster.id}`}
              className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 scroll-mt-24'
            >
              <h2 className='text-2xl font-semibold text-white mb-2'>{cluster.seoTitle}</h2>
              <p className='text-sm text-neutral-400 mb-6'>{cluster.metaDescription}</p>

              <div className='grid gap-4'>
                {cluster.sermons.map((sermon) => (
                  <article key={sermon.canonicalPath} className='rounded-lg border border-neutral-800 bg-neutral-950/60 p-4'>
                    <h3 className='text-lg font-semibold text-white mb-2'>
                      <Link href={sermon.canonicalPath} className='hover:text-emerald-400 transition-colors'>
                        {sermon.seoTitle}
                      </Link>
                    </h3>
                    <p className='text-xs text-neutral-500 mb-2'>{t.grid.publishedAt} {sermon.publishedAt}</p>
                    <p className='text-sm text-neutral-300'>{sermon.llmContext}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className='mt-12'>
          <FaqSection items={acervoTeologicoFaq} sectionTitle={t.faq.sectionTitle} />
        </div>
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </div>
  );
}
