import type { Metadata } from 'next';
import Link from 'next/link';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { isLocale, defaultLocale, type Locale } from '@/data/i18n';
import { getDictionary } from '@/lib/get-dictionary';
import { buildLanguageAlternates } from '@/data/seo';

const canonicalPath = '/clube-santo';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.clubeSanto;

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

export default async function ClubeSantoPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.clubeSanto;
  const tFaq = dict.faq.clubeSanto;

  const origin = upkfMeta.primaryWebsite;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${origin}${canonicalPath}#webpage`,
        url: `${origin}${canonicalPath}`,
        name: t.meta.title,
        description: t.meta.description,
        inLanguage: locale,
        isPartOf: { '@id': `${origin}/#website` },
        about: { '@id': `${origin}${canonicalPath}#org` },
        author: { '@id': `${origin}/#person` },
      },
      {
        '@type': 'Organization',
        '@id': `${origin}${canonicalPath}#org`,
        name: 'O Clube Santo',
        description: t.meta.description,
        foundingDate: '2024',
        founder: { '@id': `${origin}/#person` },
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
          <div className='mb-6'>
            <span className='text-xs font-mono uppercase tracking-[0.2em] text-emerald-400'>
              {t.manifesto.kicker}
            </span>
          </div>
          <h2 className='text-3xl font-bold text-white mb-4'>{t.manifesto.title}</h2>
          <p className='text-lg text-neutral-400 italic mb-8'>{t.manifesto.subtitle}</p>

          <div className='prose prose-invert max-w-none'>
            <h3 className='text-xl font-semibold text-white'>{t.manifesto.h3_1}</h3>
            <p className='text-neutral-300 leading-relaxed mb-4'>{t.manifesto.p1}</p>
            <p className='text-neutral-300 leading-relaxed mb-8'>{t.manifesto.p2}</p>

            <h3 className='text-xl font-semibold text-white'>{t.manifesto.h3_2}</h3>
            <p className='text-neutral-300 leading-relaxed mb-4'>{t.manifesto.p3}</p>
            <p className='text-neutral-300 leading-relaxed'>{t.manifesto.p4}</p>
          </div>
        </article>
      </section>

      {/* Collections */}
      <section className='bg-neutral-950 text-neutral-200 py-16'>
        <div className='max-w-5xl mx-auto px-6'>
          <h2 className='text-3xl font-bold text-white mb-8'>{t.collections.title}</h2>
          <div className='grid gap-6 md:grid-cols-2'>
            <article className='rounded-2xl border border-emerald-800/30 bg-neutral-900/60 p-8'>
              <span className='text-[10px] uppercase tracking-[0.2em] text-emerald-300 border border-emerald-700/40 rounded-full px-3 py-1'>
                {t.collections.acervo.badge}
              </span>
              <h3 className='text-xl font-bold text-white mt-4 mb-3'>{t.collections.acervo.title}</h3>
              <p className='text-neutral-400 leading-relaxed mb-4'>{t.collections.acervo.description}</p>
              <Link
                href='/acervo-teologico'
                className='text-sm text-emerald-300 hover:text-emerald-200 transition-colors'
              >
                {t.collections.acervo.cta}
              </Link>
            </article>

            <article className='rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8'>
              <h3 className='text-xl font-bold text-white mb-3'>{t.collections.research.title}</h3>
              <p className='text-neutral-400 leading-relaxed'>{t.collections.research.description}</p>
            </article>
          </div>

          {t.collections.featured.items.length > 0 && (
            <div className='mt-8'>
              <h3 className='text-xl font-bold text-white mb-4'>{t.collections.featured.title}</h3>
              <div className='grid gap-4 md:grid-cols-3'>
                {t.collections.featured.items.map((item, index) => (
                  <article key={index} className='rounded-xl border border-neutral-800 bg-neutral-950/60 p-6'>
                    <p className='text-sm text-neutral-300 leading-relaxed'>{item}</p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Author */}
      <section className='bg-neutral-950 text-neutral-200 pb-4'>
        <div className='max-w-5xl mx-auto px-6'>
          <AuthorHubCard label={t.author.label} description={t.author.description} />
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
