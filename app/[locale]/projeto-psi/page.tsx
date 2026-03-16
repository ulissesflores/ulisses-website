import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { isLocale, defaultLocale, localeToOgLocale, type Locale } from '@/data/i18n';
import { getDictionary } from '@/lib/get-dictionary';
import { buildLanguageAlternates, buildCanonical } from '@/data/seo';
import { localePath } from '@/lib/locale-path';

const canonicalPath = '/projeto-psi';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.projetoPsi;

  return {
    title: t.meta.title,
    description: t.meta.description,
    keywords: [...t.meta.keywords],
    alternates: { canonical: buildCanonical(locale, canonicalPath), languages: buildLanguageAlternates(canonicalPath) },
    openGraph: {
      type: 'website',
      url: `https://ulissesflores.com${canonicalPath}`,
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      locale: localeToOgLocale[locale],
    },
  };
}

export default async function ProjetoPsiPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.projetoPsi;
  const tFaq = dict.faq.projetoPsiComercial;

  const origin = upkfMeta.primaryWebsite;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${origin}${canonicalPath}#product`,
        url: `${origin}${canonicalPath}`,
        name: t.meta.ogTitle,
        description: t.meta.description,
        brand: { '@type': 'Brand', name: 'Codex Hash' },
        manufacturer: { '@id': `${origin}/#person` },
        category: 'Hardware Security / Digital Asset Custody',
      },
      {
        '@type': 'WebPage',
        '@id': `${origin}${canonicalPath}#webpage`,
        url: `${origin}${canonicalPath}`,
        name: t.meta.ogTitle,
        isPartOf: { '@id': `${origin}/#website` },
        about: { '@id': `${origin}${canonicalPath}#product` },
        author: { '@id': `${origin}/#person` },
      },
    ],
  };

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />

      {/* HERO */}
      <section className='relative w-full bg-neutral-950 py-28 sm:py-36'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]' />
        <div className='relative mx-auto max-w-4xl px-6 text-center'>
          <span className='inline-block rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 mb-8'>
            {t.hero.badge}
          </span>
          <h1 className='text-4xl font-extrabold leading-[1.1] tracking-tight text-neutral-50 sm:text-5xl lg:text-6xl'>
            {t.hero.h1}
          </h1>
          <p className='mt-6 text-lg leading-relaxed text-neutral-400 sm:text-xl max-w-3xl mx-auto'>
            {t.hero.lead}
          </p>
          <div className='mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
            <a href='#contato' className='inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-3.5 text-sm font-bold text-neutral-950 shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-400/30'>
              {t.hero.ctaPrimary}
            </a>
            <Link href={localePath('/whitepapers/projeto-psi', locale)} className='inline-flex items-center justify-center rounded-full border border-neutral-700 px-8 py-3.5 text-sm font-semibold text-neutral-300 transition-colors hover:border-neutral-500 hover:text-neutral-100'>
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* EXECUTIVE SUMMARY */}
      <section className='bg-neutral-950 py-24'>
        <article className='mx-auto max-w-4xl px-6'>
          <h2 className='text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl'>
            {t.executiveSummary.title}
          </h2>
          <div className='mt-8 space-y-6 text-lg leading-relaxed text-neutral-300'>
            <p>{t.executiveSummary.p1}</p>
            <p>
              {t.executiveSummary.p2}{' '}
              <strong className='text-emerald-400'>{t.executiveSummary.p2Highlight}</strong>
            </p>
          </div>
        </article>
      </section>

      {/* 4 PILLARS */}
      <section className='bg-neutral-950 py-24'>
        <div className='mx-auto max-w-6xl px-6'>
          <h2 className='text-center text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl mb-16'>
            {t.pillars.title}
          </h2>
          <div className='grid gap-10 sm:grid-cols-2'>
            {t.pillars.items.map((pillar) => (
              <article key={pillar.title} className='group rounded-2xl border border-neutral-800/60 bg-neutral-900/30 p-6 transition-colors hover:border-emerald-500/30'>
                <div className='overflow-hidden rounded-xl bg-neutral-950 mb-6'>
                  <Image src={pillar.src} alt={pillar.alt} width={720} height={405} className='w-full rounded-2xl mix-blend-screen brightness-[1.3] contrast-[1.4]' />
                </div>
                <h3 className='text-xl font-bold text-neutral-50 mb-3'>{pillar.title}</h3>
                <p className='text-neutral-400 leading-relaxed'>{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TARGET MARKET */}
      <section className='bg-neutral-950 py-24'>
        <div className='mx-auto max-w-6xl px-6'>
          <h2 className='text-center text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl mb-16'>
            {t.targetMarket.title}
          </h2>
          <div className='grid gap-8 sm:grid-cols-3'>
            {t.targetMarket.items.map((segment) => (
              <article key={segment.title} className='rounded-2xl border border-neutral-800/60 bg-neutral-900/30 p-8 text-center transition-colors hover:border-cyan-500/30'>
                <h3 className='text-lg font-bold text-cyan-400 mb-4'>{segment.title}</h3>
                <p className='text-neutral-400 leading-relaxed'>{segment.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section className='bg-neutral-950 py-24'>
        <div className='mx-auto max-w-6xl px-6'>
          <h2 className='text-center text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl mb-16'>
            {t.stats.title}
          </h2>
          <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
            {t.stats.items.map((stat) => (
              <div key={stat.value} className='rounded-2xl border border-neutral-800/60 bg-neutral-900/30 p-8 text-center'>
                <p className='text-4xl font-extrabold text-emerald-400 mb-4'>{stat.value}</p>
                <p className='text-sm text-neutral-400 leading-relaxed'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTHOR */}
      <section className='bg-neutral-950 py-12'>
        <div className='mx-auto max-w-4xl px-6'>
          <AuthorHubCard label={t.author.label} description={t.author.description} />
        </div>
      </section>

      {/* FAQ */}
      <section className='bg-neutral-950 py-24'>
        <div className='mx-auto max-w-4xl px-6'>
          <FaqSection items={[...tFaq]} sectionTitle={t.faq.sectionTitle} />
        </div>
      </section>

      {/* CTA */}
      <section id='contato' className='bg-neutral-950 py-28'>
        <div className='mx-auto max-w-3xl px-6 text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl'>
            {t.cta.title}
          </h2>
          <p className='mt-6 text-lg text-neutral-400 leading-relaxed'>
            {t.cta.description}
          </p>
          <div className='mt-10'>
            <Link href={localePath('/', locale)} className='inline-flex items-center justify-center rounded-full bg-emerald-500 px-10 py-4 text-sm font-bold text-neutral-950 shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-400/30'>
              {t.cta.button}
            </Link>
          </div>
        </div>
      </section>

      {/* CROSS-LINK */}
      <aside className='bg-neutral-950 pb-20'>
        <div className='mx-auto max-w-4xl px-6 text-center'>
          <Link href={localePath('/whitepapers/projeto-psi', locale)} className='inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-emerald-400'>
            {t.crossLink}
          </Link>
        </div>
      </aside>
    </>
  );
}
