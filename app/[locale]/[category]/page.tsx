import { defaultLocale, isLocale } from '@/data/i18n';
import type { Locale } from '@/data/i18n';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicationCollections, publications, type PublicationCategory } from '@/data/publications';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { getDictionary } from '@/lib/get-dictionary';

const validCategories = Object.keys(publicationCollections) as PublicationCategory[];

interface PageProps {
  params: Promise<{ category: string; locale: string }>;
}

export function generateStaticParams() {
  return validCategories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, locale: rawLocale } = await params;

  if (!validCategories.includes(category as PublicationCategory)) {
    return { title: 'Category not found' };
  }

  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const stories = dict.category.stories;
  const collection = publicationCollections[category as PublicationCategory];
  const story = stories[category as keyof typeof stories];

  return {
    title: story ? `${story.h1} | Ulisses Flores` : collection.heading,
    description: story?.metaDescription || collection.description,
    authors: [
      {
        name: upkfMeta.publicDisplayName || upkfMeta.displayName,
        url: `${upkfMeta.primaryWebsite}/identidade`,
      },
    ],
    alternates: {
      canonical: `/${category}`,
    },
    openGraph: {
      type: 'website',
      title: story ? `${story.h1} | Ulisses Flores` : collection.heading,
      description: story?.metaDescription || collection.description,
      url: `${upkfMeta.primaryWebsite}/${category}`,
      locale: 'pt_BR',
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category, locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale;

  if (!validCategories.includes(category as PublicationCategory)) {
    notFound();
  }

  const dict = await getDictionary(locale);
  const t = dict.category;
  const typedCategory = category as PublicationCategory;
  const collection = publicationCollections[typedCategory];
  const story = t.stories[typedCategory as keyof typeof t.stories];
  const categoryPublications = publications
    .filter((publication) => publication.category === typedCategory)
    .sort((a, b) => {
      if (a.date === b.date) {
        return a.ordinal - b.ordinal;
      }
      return Number(b.date) - Number(a.date);
    });

  const collectionUrl = `${upkfMeta.primaryWebsite}/${typedCategory}`;
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${collectionUrl}#collection`,
    name: story?.h1 || collection.heading,
    description: story?.metaDescription || collection.description,
    url: collectionUrl,
    inLanguage: locale,
    isPartOf: {
      '@id': `${upkfMeta.primaryWebsite}/#website`,
    },
    author: {
      '@type': 'Person',
      '@id': `${upkfMeta.primaryWebsite}/#person`,
      name: 'Carlos Ulisses Flores',
    },
    hasPart: categoryPublications.map((pub) => ({
      '@type': pub.kind === 'R' ? 'Report' : 'ScholarlyArticle',
      '@id': `${pub.canonicalUrl}#article`,
      name: pub.title,
      url: pub.canonicalUrl,
      datePublished: pub.publishedAt,
      keywords: pub.tags.join(', '),
    })),
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

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
              {collection.title}
            </span>
          </div>

          {/* H1 */}
          <h1 className='text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight'>
            {story?.h1 || collection.heading}
          </h1>

          {/* Lead paragraph */}
          <p className='text-lg text-neutral-400 leading-relaxed mb-8 max-w-3xl'>
            {story?.lead || collection.description}
          </p>

          {/* Authority block */}
          {story && (
            <div className='border-l-4 border-cyan-700 bg-cyan-950/20 px-6 py-5 rounded-r-xl mb-10'>
              <p className='text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2'>
                {story.authorityTitle}
              </p>
              <p className='text-neutral-300 leading-relaxed'>
                {story.authorityBody}
              </p>
            </div>
          )}

          {/* Credential chips */}
          {story && (
            <div className='flex flex-wrap gap-2 mb-6'>
              {[...story.chips].map((chip) => (
                <span
                  key={chip}
                  className='text-xs font-mono border border-neutral-700 bg-neutral-900/40 text-neutral-400 px-3 py-1 rounded-full'
                >
                  {chip}
                </span>
              ))}
            </div>
          )}

          {/* Featured link for whitepapers → Projeto PSI */}
          {typedCategory === 'whitepapers' && (
            <div className='rounded-xl border border-cyan-800/40 bg-cyan-950/10 p-5 mt-4'>
              <p className='text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold mb-2'>{t.highlight}</p>
              <Link
                href='/whitepapers/projeto-psi'
                className='text-lg font-bold text-white hover:text-cyan-300 transition-colors'
              >
                {t.psiLink}
              </Link>
              <p className='text-sm text-neutral-500 mt-1'>
                {t.psiDescription}
              </p>
            </div>
          )}

          <div className='mt-6 max-w-xl'>
            <AuthorHubCard
              label={t.authorLabel}
              compact
              description={t.authorDescription}
            />
          </div>
        </div>
      </section>

      {/* ── Publications Grid ── */}
      <main className='relative max-w-5xl mx-auto px-6 py-16 z-10'>
        <h2 className='text-2xl font-bold text-white mb-8'>
          {categoryPublications.length} {t.publicationsCount}
        </h2>

        <section className='space-y-4'>
          {categoryPublications.map((publication) => (
            <article
              key={publication.id}
              className='p-6 rounded-xl bg-neutral-900/40 border border-neutral-800 hover:border-emerald-500/40 transition-colors'
            >
              <div className='flex flex-wrap items-center gap-3 mb-3 text-xs text-neutral-500'>
                <span className='px-2 py-1 border border-neutral-700 rounded-full uppercase'>{publication.category}</span>
                <span>{publication.date}</span>
                <span>{publication.kind === 'R' ? 'Report' : 'ScholarlyArticle'}</span>
              </div>
              <h2 className='text-2xl font-semibold text-white mb-3'>
                <Link href={`/${publication.category}/${publication.id}`} className='hover:text-emerald-400 transition-colors'>
                  {publication.title}
                </Link>
              </h2>
              <p className='text-neutral-400 mb-4 leading-relaxed'>{publication.summary}</p>
              <div className='flex flex-wrap gap-2'>
                {publication.tags.map((tag) => (
                  <span key={tag} className='text-[11px] bg-neutral-950 border border-neutral-800 rounded-full px-2 py-1 text-neutral-400'>
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
