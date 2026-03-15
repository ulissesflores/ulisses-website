import type { Metadata } from 'next';
import Link from 'next/link';
import { knowledgeData } from '@/data/knowledge';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { isLocale, defaultLocale, type Locale } from '@/data/i18n';
import { getDictionary } from '@/lib/get-dictionary';
import { buildLanguageAlternates } from '@/data/seo';

const canonicalPath = '/mundo-politico';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.mundoPolitico;

  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: [...t.meta.keywords],
    alternates: {
      canonical: canonicalPath,
      languages: buildLanguageAlternates(canonicalPath),
    },
    openGraph: {
      type: 'website',
      url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      locale: 'pt_BR',
    },
  };
}

export default async function MundoPoliticoPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.mundoPolitico;
  const tFaq = dict.faq.mundoPolitico;

  const origin = upkfMeta.primaryWebsite;

  const posts = [...knowledgeData.blog.posts].sort(
    (a, b) => {
      if (a.publishedAt === b.publishedAt) {
        return a.position - b.position;
      }
      return b.publishedAt.localeCompare(a.publishedAt);
    },
  );

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${origin}${canonicalPath}#collection`,
        url: `${origin}${canonicalPath}`,
        name: t.meta.title,
        description: t.meta.description,
        inLanguage: locale,
        isPartOf: { '@id': `${origin}/#website` },
        author: { '@id': `${origin}/#person` },
      },
    ],
  };

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />

      {/* Hero */}
      <section className='bg-neutral-950 text-neutral-200 pt-20 pb-16 border-b border-neutral-800'>
        <div className='max-w-4xl mx-auto px-6'>
          <div className='flex items-center gap-2 mb-6'>
            <Link href='/' className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'>
              {dict.common.breadcrumb.home}
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-neutral-500'>
              {t.breadcrumb}
            </span>
          </div>

          <h1 className='text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6 text-white'>
            {t.hero.h1}
          </h1>
          <p className='text-lg text-neutral-400 leading-relaxed mb-8 max-w-3xl'>
            {t.hero.lead}
          </p>
          <div className='border-s-4 border-cyan-700 bg-cyan-950/20 px-6 py-5 rounded-e-xl mb-10'>
            <p className='text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2'>
              {t.hero.authority.kicker}
            </p>
            <p className='text-neutral-300 leading-relaxed'>
              {t.hero.authority.text}
            </p>
          </div>
          <div className='flex flex-wrap gap-2 mb-8'>
            {t.hero.credentials.map((credential) => (
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

      {/* Manifesto */}
      <section className='bg-neutral-950 text-neutral-200 py-16'>
        <article className='max-w-4xl mx-auto px-6'>
          <span className='text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 mb-6 block'>
            {t.manifesto.kicker}
          </span>
          <h2 className='text-3xl font-bold text-white mb-6'>{t.manifesto.title}</h2>
          <blockquote className='border-s-4 border-amber-500/40 ps-6 mb-8 italic text-neutral-300 text-lg'>
            {t.manifesto.quote}
          </blockquote>
          <div className='prose prose-invert max-w-none'>
            <p className='text-neutral-300 leading-relaxed mb-4'>{t.manifesto.intro}</p>
            <h3 className='text-xl font-semibold text-white'>{t.manifesto.h3_socrates}</h3>
            <p className='text-neutral-300 leading-relaxed mb-4'>{t.manifesto.p_socrates}</p>
            <p className='text-neutral-300 leading-relaxed mb-8'>{t.manifesto.p_jesus}</p>
            <h3 className='text-xl font-semibold text-white'>{t.manifesto.h3_purpose}</h3>
            <p className='text-neutral-300 leading-relaxed'>{t.manifesto.p_purpose}</p>
          </div>
        </article>
      </section>

      {/* Posts */}
      <section className='bg-neutral-950 text-neutral-200 py-16'>
        <div className='max-w-5xl mx-auto px-6'>
          <div className='mb-8'>
            <AuthorHubCard label={t.posts.authorLabel} description={t.posts.authorDescription} />
          </div>
          <h2 className='text-2xl font-bold text-white mb-6'>{t.posts.title}</h2>
          <div className='grid gap-6'>
            {posts.map((post) => (
              <article key={post.canonicalPath} className='rounded-xl border border-neutral-800 bg-neutral-900/40 p-6'>
                <Link href={post.canonicalPath} className='group'>
                  <h3 className='text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors mb-2'>
                    {post.headline}
                  </h3>
                  <p className='text-sm text-neutral-400 leading-relaxed line-clamp-2'>
                    {post.summary}
                  </p>
                </Link>
                <div className='mt-4 flex items-center gap-3 text-xs text-neutral-500'>
                  <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                  {post.url && (
                    <a
                      href={post.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-emerald-300/70 hover:text-emerald-300'
                    >
                      {t.posts.originalLink}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='bg-neutral-950 text-neutral-200 py-12'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h2 className='text-xl font-bold text-white mb-3'>{t.cta.title}</h2>
          <p className='text-neutral-400 mb-6 max-w-2xl mx-auto text-sm leading-relaxed'>
            {t.cta.description}
          </p>
          <Link
            href='/'
            className='inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm'
          >
            {t.cta.button}
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className='bg-neutral-950 text-neutral-200 pb-16'>
        <div className='max-w-4xl mx-auto px-6'>
          <FaqSection items={[...tFaq]} sectionTitle={t.faq.sectionTitle} />
        </div>
      </section>
    </>
  );
}
