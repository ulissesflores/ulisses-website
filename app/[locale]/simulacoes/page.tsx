import type { Metadata } from 'next';
import Link from 'next/link';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { isLocale, defaultLocale, localeToOgLocale, type Locale } from '@/data/i18n';
import { getDictionary } from '@/lib/get-dictionary';
import { buildLanguageAlternates } from '@/data/seo';

const canonicalPath = '/simulacoes';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.simulacoes;

  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: [...t.meta.keywords],
    authors: [{ name: upkfMeta.publicDisplayName || upkfMeta.displayName, url: `${upkfMeta.primaryWebsite}/identidade` }],
    alternates: { canonical: canonicalPath, languages: buildLanguageAlternates(canonicalPath) },
    openGraph: {
      type: 'website',
      url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      locale: localeToOgLocale[locale],
    },
  };
}

export default async function SimulacoesPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.simulacoes;
  const tFaq = dict.faq.simulacoes;

  const origin = upkfMeta.primaryWebsite;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${origin}${canonicalPath}#collection`,
        url: `${origin}${canonicalPath}`,
        name: t.meta.ogTitle,
        description: t.meta.description,
        inLanguage: locale,
        isPartOf: { '@id': `${origin}/#website` },
        author: { '@id': `${origin}/#person` },
      },
    ],
  };

  return (
    <>
      {/* Hero */}
      <section className='bg-neutral-950 text-neutral-200 pt-20 pb-16 border-b border-neutral-800'>
        <div className='max-w-4xl mx-auto px-6'>
          <div className='flex items-center gap-2 mb-6'>
            <Link href='/' className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'>
              {dict.common.breadcrumb.home}
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-neutral-500'>{t.breadcrumb}</span>
          </div>
          <h1 className='text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6 text-white'>{t.hero.h1}</h1>
          <p className='text-lg text-neutral-400 leading-relaxed mb-8 max-w-3xl'>{t.hero.lead}</p>
          <div className='border-s-4 border-cyan-700 bg-cyan-950/20 px-6 py-5 rounded-e-xl mb-10'>
            <p className='text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2'>{t.hero.authority.kicker}</p>
            <p className='text-neutral-300 leading-relaxed'>{t.hero.authority.text}</p>
          </div>
          <div className='flex flex-wrap gap-2 mb-8'>
            {t.hero.credentials.map((c) => (
              <span key={c} className='text-xs font-mono border border-neutral-700 bg-neutral-900/40 text-neutral-400 px-3 py-1 rounded-full'>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className='bg-neutral-950 text-neutral-200 py-16'>
        <div className='max-w-5xl mx-auto px-6'>
          <h2 className='text-2xl font-bold text-white mb-8'>{t.grid.title}</h2>
          <div className='grid gap-8'>
            {/* IA 2027 — featured */}
            <article className='rounded-2xl border border-emerald-800/30 bg-neutral-900/60 p-8'>
              <div className='flex items-center gap-3 mb-4'>
                {t.grid.ia2027.badges.map((b) => (
                  <span key={b} className='text-[10px] uppercase tracking-[0.2em] text-emerald-300 border border-emerald-700/40 rounded-full px-3 py-1'>{b}</span>
                ))}
              </div>
              <h2 className='text-2xl font-bold text-white mb-3'>
                <Link href='/simulacoes/ia-2027' className='hover:text-emerald-400 transition-colors'>{t.grid.ia2027.title}</Link>
              </h2>
              <p className='text-neutral-300 leading-relaxed mb-4'>
                {t.grid.ia2027.description}{' '}
                <strong className='text-emerald-300'>{t.grid.ia2027.descEndingSlowdown}</strong>{' '}
                ou <strong className='text-red-400'>{t.grid.ia2027.descEndingRace}</strong>.
              </p>
              <div className='flex flex-wrap gap-3 mb-6'>
                {t.grid.ia2027.tags.map((tag) => (
                  <span key={tag} className='text-xs border border-neutral-700 text-neutral-400 px-3 py-1 rounded-full'>{tag}</span>
                ))}
              </div>
              <Link href='/simulacoes/ia-2027' className='inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm'>
                {t.grid.ia2027.cta}
              </Link>
            </article>

            {/* GoldenLeaf */}
            <article className='rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8'>
              <div className='flex items-center gap-3 mb-4'>
                {t.grid.goldenleaf.badges.map((b) => (
                  <span key={b} className='text-[10px] uppercase tracking-[0.2em] text-green-300 border border-green-700/40 rounded-full px-3 py-1'>{b}</span>
                ))}
              </div>
              <h2 className='text-2xl font-bold text-white mb-3'>
                <Link href='/simulacoes/goldenleaf' className='hover:text-emerald-400 transition-colors'>{t.grid.goldenleaf.title}</Link>
              </h2>
              <p className='text-neutral-300 leading-relaxed mb-4'>{t.grid.goldenleaf.description}</p>
              <div className='flex flex-wrap gap-3 mb-6'>
                {t.grid.goldenleaf.tags.map((tag) => (
                  <span key={tag} className='text-xs border border-neutral-700 text-neutral-400 px-3 py-1 rounded-full'>{tag}</span>
                ))}
              </div>
            </article>

            {/* Mumm-Ra */}
            <article className='rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8'>
              <div className='flex items-center gap-3 mb-4'>
                {t.grid.mummRa.badges.map((b) => (
                  <span key={b} className='text-[10px] uppercase tracking-[0.2em] text-violet-300 border border-violet-700/40 rounded-full px-3 py-1'>{b}</span>
                ))}
              </div>
              <h2 className='text-2xl font-bold text-white mb-3'>
                <Link href='/simulacoes/mumm-ra' className='hover:text-emerald-400 transition-colors'>{t.grid.mummRa.title}</Link>
              </h2>
              <p className='text-neutral-300 leading-relaxed mb-4'>{t.grid.mummRa.description}</p>
              <div className='flex flex-wrap gap-3 mb-6'>
                {t.grid.mummRa.tags.map((tag) => (
                  <span key={tag} className='text-xs border border-neutral-700 text-neutral-400 px-3 py-1 rounded-full'>{tag}</span>
                ))}
              </div>
            </article>
          </div>
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
          <p className='text-neutral-400 mb-6 max-w-2xl mx-auto text-sm leading-relaxed'>{t.cta.description}</p>
          <Link href='/' className='inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm'>
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

      <script id='structured-data-simulacoes' type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </>
  );
}
