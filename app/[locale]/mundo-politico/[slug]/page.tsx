import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { knowledgeData } from '@/data/knowledge';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { defaultLocale, isLocale, localeToOgLocale, type Locale } from '@/data/i18n';
import { getDictionary } from '@/lib/get-dictionary';
import { localePath } from '@/lib/locale-path';
import { buildCanonical } from '@/data/seo';

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export function generateStaticParams() {
  return knowledgeData.blog.posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale;
  const post = knowledgeData.blog.posts.find((item) => item.slug === slug);

  if (!post) {
    return { title: 'Post not found' };
  }

  return {
    title: post.headline,
    description: post.summary,
    authors: [
      {
        name: upkfMeta.publicDisplayName || upkfMeta.displayName,
        url: `${upkfMeta.primaryWebsite}/identidade`,
      },
    ],
    alternates: {
      canonical: buildCanonical(locale, post.canonicalPath),
    },
    openGraph: {
      type: 'article',
      url: `${upkfMeta.primaryWebsite}${post.canonicalPath}`,
      title: post.headline,
      description: post.summary,
      publishedTime: post.publishedAt,
      locale: localeToOgLocale[locale],
    },
  };
}

export default async function MundoPoliticoPostPage({ params }: PageProps) {
  const { slug, locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.common.mundoPoliticoDetail;
  const post = knowledgeData.blog.posts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${upkfMeta.primaryWebsite}${post.canonicalPath}#blog-post`,
    headline: post.headline,
    description: post.summary,
    datePublished: post.publishedAt,
    inLanguage: locale,
    url: post.url,
    mainEntityOfPage: `${upkfMeta.primaryWebsite}${post.canonicalPath}`,
    author: {
      '@id': `${upkfMeta.primaryWebsite}/#person`,
    },
    isPartOf: {
      '@id': `${upkfMeta.primaryWebsite}${knowledgeData.blog.canonicalPath}#collection`,
    },
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <main className='max-w-3xl mx-auto px-6 py-20'>
        <Link href={localePath('/mundo-politico', locale)} className='text-sm text-neutral-400 hover:text-emerald-400 transition-colors'>
          {t.backTo}
        </Link>

        <header className='mt-8 mb-10'>
          <p className='text-xs uppercase tracking-widest text-emerald-400 mb-3'>{t.sectionLabel}</p>
          <h1 className='text-3xl md:text-4xl font-bold text-white mb-4'>{post.headline}</h1>
          <p className='text-sm text-neutral-500 mb-4'>{t.publishedOn} {post.publishedAt}</p>
          <p className='text-neutral-400 leading-relaxed'>{post.summary}</p>
          <div className='mt-4 max-w-xl'>
            <AuthorHubCard
              label={dict.common.authorHubCard.defaultLabel}
              href={localePath('/identidade', locale)}
              compact
            />
          </div>
        </header>

        <section className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 space-y-5'>
          <h2 className='text-xl font-semibold text-white'>{t.canonicalContext}</h2>
          <p className='text-neutral-300 leading-relaxed'>
            {t.canonicalDescription}
          </p>
          <div>
            <p className='text-xs uppercase tracking-widest text-neutral-500 mb-1'>{t.originalSource}</p>
            <a href={post.url} target='_blank' rel='noopener noreferrer' className='text-emerald-300 hover:text-emerald-200 break-all'>
              {post.url}
            </a>
          </div>
          <div>
            <p className='text-xs uppercase tracking-widest text-neutral-500 mb-1'>{t.authorPage}</p>
            <a
              href={knowledgeData.blog.authorPage}
              target='_blank'
              rel='noopener noreferrer'
              className='text-emerald-300 hover:text-emerald-200 break-all'
            >
              {knowledgeData.blog.authorPage}
            </a>
          </div>
        </section>
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }} />
    </div>
  );
}
