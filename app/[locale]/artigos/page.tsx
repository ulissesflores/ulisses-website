import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { artigosByDateDesc, formatArtigoDate } from '@/data/artigos';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { defaultLocale, isLocale, localeToOgLocale, type Locale } from '@/data/i18n';
import { getDictionary } from '@/lib/get-dictionary';
import { localePath } from '@/lib/locale-path';
import { buildCanonical, buildLanguageAlternates, defaultOgImages } from '@/data/seo';

const canonicalPath = '/artigos';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.artigos;

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
      canonical: buildCanonical(locale, canonicalPath),
      languages: buildLanguageAlternates(canonicalPath),
    },
    openGraph: {
      images: defaultOgImages(locale),
      type: 'website',
      url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      locale: localeToOgLocale[locale],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
    },
  };
}

export default async function ArtigosPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.artigos;

  const origin = upkfMeta.primaryWebsite;
  const pageUrl = `${origin}${canonicalPath}`;
  const breadcrumbBase = locale === defaultLocale ? origin : `${origin}/${locale}`;

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${pageUrl}#collection`,
    name: t.meta.ogTitle,
    description: t.meta.description,
    url: pageUrl,
    inLanguage: locale,
    isPartOf: { '@id': `${origin}/#website` },
    author: {
      '@type': 'Person',
      '@id': `${origin}/#person`,
      name: upkfMeta.publicDisplayName || upkfMeta.displayName,
    },
    hasPart: artigosByDateDesc.map((artigo) => ({
      '@type': 'BlogPosting',
      '@id': `${origin}${canonicalPath}/${artigo.slug}#article`,
      headline: artigo.title,
      url: `${origin}${canonicalPath}/${artigo.slug}`,
      datePublished: artigo.date,
      keywords: artigo.tags.join(', '),
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.common.breadcrumb.home, item: `${breadcrumbBase}/` },
      { '@type': 'ListItem', position: 2, name: t.hero.badge, item: `${breadcrumbBase}${canonicalPath}` },
    ],
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className='pt-20 pb-16 border-b border-neutral-800'>
        <div className='max-w-4xl mx-auto px-6'>
          <div className='flex items-center gap-2 mb-6'>
            <Link
              href={localePath('/', locale)}
              className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'
            >
              {dict.common.breadcrumb.home}
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-neutral-400'>{t.hero.badge}</span>
          </div>

          <h1 className='text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight'>
            {t.hero.h1}
          </h1>

          <p className='text-lg text-neutral-400 leading-relaxed mb-10 max-w-3xl'>{t.hero.lead}</p>

          <div className='max-w-xl'>
            <AuthorHubCard
              label={dict.common.authorHubCard.defaultLabel}
              compact
              description={dict.common.authorHubCard.defaultDescription}
              href={localePath('/identidade', locale)}
            />
          </div>
        </div>
      </section>

      <main className='max-w-4xl mx-auto px-6 py-16'>
        <section className='space-y-4'>
          {artigosByDateDesc.map((artigo) => (
            <article
              key={artigo.slug}
              className='p-6 rounded-xl bg-neutral-900/40 border border-neutral-800 hover:border-emerald-500/40 transition-colors'
            >
              <div className='flex flex-wrap items-center gap-3 mb-3 text-xs text-neutral-400'>
                <span className='flex items-center gap-2 font-mono uppercase'>
                  <Calendar size={12} /> {formatArtigoDate(artigo.date, locale)}
                </span>
              </div>
              <h2 className='text-2xl font-semibold text-white mb-3 leading-snug'>
                <Link
                  href={localePath(`${canonicalPath}/${artigo.slug}`, locale)}
                  className='hover:text-emerald-400 transition-colors'
                >
                  {artigo.title}
                </Link>
              </h2>
              <p className='text-neutral-400 mb-4 leading-relaxed'>{artigo.summary}</p>
              <div className='flex flex-wrap gap-2'>
                {artigo.tags.map((tag) => (
                  <span
                    key={tag}
                    className='text-[11px] bg-neutral-950 border border-neutral-800 rounded-full px-2 py-1 text-neutral-400'
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
