import type { Metadata } from 'next';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { isLocale, defaultLocale, localeToOgLocale, type Locale } from '@/data/i18n';
import { getDictionary } from '@/lib/get-dictionary';
import { buildLanguageAlternates, buildCanonical } from '@/data/seo';

const canonicalPath = '/palestras';
const ogImage = '/carlos-ulisses-flores-cto.jpg';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.palestras;

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
      // og:image inherits file convention app/[locale]/opengraph-image.tsx (1200x630)
    },
    twitter: {
      card: 'summary_large_image',
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
    },
    other: { 'geo.region': 'BR-SP', 'geo.placename': 'Jundiai' },
  };
}

export default async function PalestrasPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.palestras;
  const tFaq = dict.faq.palestras;

  const origin = upkfMeta.primaryWebsite;
  const pageUrl = `${origin}${canonicalPath}`;

  // Schema.org JSON-LD: Service (speaking) + Person speaker + OfferCatalog (formats) + WebPage
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${pageUrl}#service`,
        name: t.meta.ogTitle,
        url: pageUrl,
        description: t.meta.description,
        serviceType: [
          'Keynote Speaking',
          'Executive Masterclass',
          'In-Company Workshop',
          'Technical Lecture',
          'Panel Moderation',
        ],
        provider: { '@id': `${origin}/#person` },
        areaServed: ['BR', 'LatAm', 'US', 'EU', 'IL'],
        availableLanguage: ['pt-BR', 'en', 'es', 'it'],
        audience: {
          '@type': 'Audience',
          audienceType: t.publicos.items.map((p) => p.title).join(', '),
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: t.formatos.title,
          itemListElement: t.formatos.items.map((f) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: f.title,
              description: f.description,
              provider: { '@id': `${origin}/#person` },
            },
            priceSpecification: {
              '@type': 'PriceSpecification',
              priceCurrency: locale === 'pt-br' ? 'BRL' : 'USD',
              description: f.priceLabel,
            },
            eligibleDuration: { '@type': 'QuantitativeValue', description: f.duration },
          })),
        },
      },
      {
        '@type': 'Person',
        '@id': `${pageUrl}#speaker`,
        name: 'Ulisses Flores',
        url: `${origin}/`,
        image: 'https://gravatar.com/ulissesflores',
        sameAs: [`${origin}/`, 'https://gravatar.com/ulissesflores'],
        jobTitle: 'Keynote Speaker · MSc Candidate em IA · Arquiteto de Sistemas Críticos',
        knowsLanguage: ['pt-BR', 'en', 'es', 'it', 'he'],
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: t.meta.ogTitle,
        description: t.meta.description,
        isPartOf: { '@id': `${origin}/#website` },
        about: { '@id': `${pageUrl}#service` },
        author: { '@id': `${origin}/#person` },
        inLanguage: locale === 'pt-br' ? 'pt-BR' : locale,
        primaryImageOfPage: { '@type': 'ImageObject', url: `${origin}${ogImage}` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: t.hero.badge, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />

      {/* HERO */}
      <section className='relative w-full bg-neutral-950 py-28 sm:py-36'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(168,85,247,0.14),transparent)]' />
        <div className='relative mx-auto max-w-4xl px-6 text-center'>
          <span className='inline-block rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-purple-300 mb-8'>
            {t.hero.badge}
          </span>
          <h1 className='text-4xl font-extrabold leading-[1.1] tracking-tight text-neutral-50 sm:text-5xl lg:text-6xl'>
            {t.hero.h1}
          </h1>
          <p className='mt-6 text-lg leading-relaxed text-neutral-400 sm:text-xl max-w-3xl mx-auto'>
            {t.hero.lead}
          </p>
          <div className='mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
            <a
              href={t.briefing.submitHref}
              className='inline-flex items-center justify-center rounded-full bg-purple-500 px-8 py-3.5 text-sm font-bold text-neutral-950 shadow-lg shadow-purple-500/25 transition-all hover:bg-purple-400 hover:shadow-purple-400/30'
            >
              {t.hero.ctaPrimary}
            </a>
            <a
              href='#temas'
              className='inline-flex items-center justify-center rounded-full border border-neutral-700 px-8 py-3.5 text-sm font-semibold text-neutral-300 transition-colors hover:border-neutral-500 hover:text-neutral-100'
            >
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className='bg-neutral-950 py-12 border-t border-neutral-900'>
        <div className='mx-auto max-w-5xl px-6'>
          <p className='text-center text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-6'>
            {t.trust.label}
          </p>
          <ul className='flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-neutral-300'>
            {t.trust.items.map((it) => (
              <li key={it} className='flex items-center gap-2'>
                <span className='inline-block h-1.5 w-1.5 rounded-full bg-purple-400' />
                {it}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TEMAS */}
      <section id='temas' className='bg-neutral-950 py-24 border-t border-neutral-900'>
        <div className='mx-auto max-w-6xl px-6'>
          <h2 className='text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl text-center'>
            {t.temas.title}
          </h2>
          <p className='mt-4 text-center text-neutral-400 max-w-3xl mx-auto'>{t.temas.subtitle}</p>
          <div className='mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {t.temas.items.map((item) => (
              <article key={item.title} className='rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6'>
                <h3 className='text-lg font-semibold text-purple-300'>{item.title}</h3>
                <p className='mt-3 text-sm text-neutral-400 leading-relaxed'>{item.bullet}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FORMATOS */}
      <section id='formatos' className='bg-neutral-950 py-24 border-t border-neutral-900'>
        <div className='mx-auto max-w-6xl px-6'>
          <h2 className='text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl text-center'>
            {t.formatos.title}
          </h2>
          <p className='mt-4 text-center text-neutral-400 max-w-3xl mx-auto'>{t.formatos.subtitle}</p>
          <div className='mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {t.formatos.items.map((f) => (
              <article key={f.title} className='rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col'>
                <h3 className='text-lg font-semibold text-neutral-50'>{f.title}</h3>
                <div className='mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.15em]'>
                  <span className='inline-block rounded-full border border-neutral-700 bg-neutral-950 px-2.5 py-1 text-neutral-400'>{f.duration}</span>
                  <span className='inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-purple-300'>{f.priceLabel}</span>
                </div>
                <p className='mt-4 text-sm text-neutral-400 leading-relaxed'>{f.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PUBLICOS */}
      <section className='bg-neutral-950 py-24 border-t border-neutral-900'>
        <div className='mx-auto max-w-6xl px-6'>
          <h2 className='text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl text-center'>
            {t.publicos.title}
          </h2>
          <p className='mt-4 text-center text-neutral-400 max-w-3xl mx-auto'>{t.publicos.subtitle}</p>
          <div className='mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {t.publicos.items.map((p) => (
              <article key={p.title} className='rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6'>
                <h3 className='text-lg font-semibold text-cyan-300'>{p.title}</h3>
                <p className='mt-3 text-sm text-neutral-400 leading-relaxed'>{p.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CACHE */}
      <section id='cache' className='bg-neutral-950 py-24 border-t border-neutral-900'>
        <div className='mx-auto max-w-6xl px-6'>
          <h2 className='text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl text-center'>
            {t.cache.title}
          </h2>
          <p className='mt-4 text-center text-neutral-400 max-w-3xl mx-auto'>{t.cache.subtitle}</p>
          <div className='mt-10 overflow-x-auto rounded-2xl border border-neutral-800'>
            <table className='w-full text-sm'>
              <thead className='bg-neutral-900 text-neutral-300'>
                <tr>
                  <th className='px-5 py-3 text-start font-semibold'>{t.cache.columns.format}</th>
                  <th className='px-5 py-3 text-start font-semibold'>{t.cache.columns.base}</th>
                  <th className='px-5 py-3 text-start font-semibold'>{t.cache.columns.international}</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-neutral-900'>
                {t.cache.rows.map((row) => (
                  <tr key={row.format} className='bg-neutral-950/60'>
                    <td className='px-5 py-3 text-neutral-300 font-medium'>{row.format}</td>
                    <td className='px-5 py-3 text-purple-300'>{row.base}</td>
                    <td className='px-5 py-3 text-cyan-300'>{row.international}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className='mt-6 text-xs text-neutral-500 max-w-3xl mx-auto text-center leading-relaxed'>{t.cache.note}</p>
        </div>
      </section>

      {/* BRIEFING */}
      <section id='briefing' className='bg-neutral-950 py-24 border-t border-neutral-900'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl text-center'>
            {t.briefing.title}
          </h2>
          <p className='mt-4 text-center text-neutral-400 max-w-2xl mx-auto'>{t.briefing.subtitle}</p>
          <ul className='mt-10 space-y-3'>
            {t.briefing.fields.map((field) => (
              <li key={field.label} className='rounded-xl border border-neutral-800 bg-neutral-900/40 p-5'>
                <p className='text-sm font-semibold text-purple-300'>{field.label}</p>
                <p className='mt-1.5 text-sm text-neutral-400 leading-relaxed'>{field.placeholder}</p>
              </li>
            ))}
          </ul>
          <div className='mt-10 text-center'>
            <a
              href={t.briefing.submitHref}
              className='inline-flex items-center justify-center rounded-full bg-purple-500 px-8 py-3.5 text-sm font-bold text-neutral-950 shadow-lg shadow-purple-500/25 transition-all hover:bg-purple-400'
            >
              {t.briefing.submitButton}
            </a>
            <p className='mt-4 text-xs text-neutral-500'>{t.briefing.note}</p>
          </div>
        </div>
      </section>

      {/* DELIVERY + IDIOMAS */}
      <section className='bg-neutral-950 py-24 border-t border-neutral-900'>
        <div className='mx-auto max-w-6xl px-6 grid gap-10 md:grid-cols-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight text-neutral-50 sm:text-3xl'>{t.delivery.title}</h2>
            <ul className='mt-6 space-y-4'>
              {t.delivery.items.map((d) => (
                <li key={d.title} className='rounded-xl border border-neutral-800 bg-neutral-900/40 p-5'>
                  <h3 className='text-base font-semibold text-purple-300'>{d.title}</h3>
                  <p className='mt-2 text-sm text-neutral-400 leading-relaxed'>{d.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className='text-2xl font-bold tracking-tight text-neutral-50 sm:text-3xl'>{t.idiomas.title}</h2>
            <ul className='mt-6 space-y-3'>
              {t.idiomas.items.map((it) => (
                <li key={it.label} className='flex items-baseline justify-between rounded-xl border border-neutral-800 bg-neutral-900/40 px-5 py-3'>
                  <span className='text-sm font-semibold text-neutral-200'>{it.label}</span>
                  <span className='text-xs text-neutral-500 text-end max-w-[60%]'>{it.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* POLICIES */}
      <section className='bg-neutral-950 py-24 border-t border-neutral-900'>
        <div className='mx-auto max-w-4xl px-6'>
          <h2 className='text-2xl font-bold tracking-tight text-neutral-50 sm:text-3xl text-center'>
            {t.policies.title}
          </h2>
          <dl className='mt-10 space-y-3'>
            {t.policies.items.map((p) => (
              <div key={p.label} className='rounded-xl border border-neutral-800 bg-neutral-900/40 p-5'>
                <dt className='text-sm font-semibold text-purple-300'>{p.label}</dt>
                <dd className='mt-2 text-sm text-neutral-400 leading-relaxed'>{p.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* AUTHOR */}
      <section className='bg-neutral-950 py-12'>
        <div className='mx-auto max-w-4xl px-6'>
          <AuthorHubCard
            label='Author'
            description={upkfMeta.description[locale === 'pt-br' ? 'pt-BR' : (locale as 'en' | 'es' | 'it' | 'he')]}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className='bg-neutral-950 py-24 border-t border-neutral-900'>
        <div className='mx-auto max-w-4xl px-6'>
          <FaqSection items={[...tFaq]} sectionTitle={t.faq.sectionTitle} />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className='bg-neutral-950 py-28 border-t border-neutral-900'>
        <div className='mx-auto max-w-3xl px-6 text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl'>{t.finalCta.title}</h2>
          <p className='mt-6 text-lg text-neutral-400 leading-relaxed'>{t.finalCta.description}</p>
          <a
            href={t.finalCta.href}
            className='mt-10 inline-flex items-center justify-center rounded-full bg-purple-500 px-10 py-4 text-sm font-bold text-neutral-950 shadow-lg shadow-purple-500/25 transition-all hover:bg-purple-400 hover:shadow-purple-400/30'
          >
            {t.finalCta.button}
          </a>
        </div>
      </section>
    </>
  );
}
