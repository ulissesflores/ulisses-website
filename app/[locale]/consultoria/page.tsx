import type { Metadata } from 'next';
import Link from 'next/link';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { isLocale, defaultLocale, localeToOgLocale, type Locale } from '@/data/i18n';
import { getDictionary } from '@/lib/get-dictionary';
import { buildLanguageAlternates, buildCanonical } from '@/data/seo';
import { localePath } from '@/lib/locale-path';

const canonicalPath = '/consultoria';
const ogImage = '/carlos-ulisses-flores-cto.jpg';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.consultoria;

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

export default async function ConsultoriaPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.consultoria;
  const tFaq = dict.faq.consultoria;

  const origin = upkfMeta.primaryWebsite;
  const pageUrl = `${origin}${canonicalPath}`;

  // Schema.org JSON-LD: ProfessionalService + Service offers + WebPage + Person reference
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${pageUrl}#service`,
        name: t.meta.ogTitle,
        url: pageUrl,
        description: t.meta.description,
        provider: { '@id': `${origin}/#person` },
        areaServed: ['BR', 'LatAm', 'US', 'EU', 'IL'],
        availableLanguage: ['pt-BR', 'en', 'es', 'it', 'he'],
        serviceType: [
          'Strategic AI Consulting',
          'AI Roadmap',
          'Critical Systems Architecture',
          'Data Governance',
          'Fractional CTO',
          'Board Advisory',
          'In-Company Executive Training',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: t.modalidades.title,
          itemListElement: t.modalidades.items.map((m) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: m.title,
              description: m.description,
              provider: { '@id': `${origin}/#person` },
            },
            priceSpecification: { '@type': 'PriceSpecification', priceCurrency: locale === 'pt-br' ? 'BRL' : 'USD', description: m.priceLabel },
          })),
        },
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
            <a
              href={t.ctaStack.items[0].href}
              className='inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-3.5 text-sm font-bold text-neutral-950 shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-400/30'
            >
              {t.hero.ctaPrimary}
            </a>
            <a
              href='#modalidades'
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
          <p className='text-center text-[11px] uppercase tracking-[0.18em] text-neutral-400 mb-6'>
            {t.trust.label}
          </p>
          <ul className='flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-neutral-300'>
            {t.trust.items.map((it) => (
              <li key={it} className='flex items-center gap-2'>
                <span className='inline-block h-1.5 w-1.5 rounded-full bg-emerald-500' />
                {it}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* COMPARATOR */}
      <section className='bg-neutral-950 py-24'>
        <div className='mx-auto max-w-5xl px-6'>
          <h2 className='text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl text-center'>
            {t.comparator.title}
          </h2>
          <p className='mt-4 text-center text-neutral-400 max-w-2xl mx-auto'>
            {t.comparator.subtitle}
          </p>
          <div className='mt-10 overflow-x-auto rounded-2xl border border-neutral-800'>
            <table className='w-full text-sm'>
              <thead className='bg-neutral-900 text-neutral-300'>
                <tr>
                  <th className='px-5 py-3 text-start font-semibold'>{t.comparator.columns.symptom}</th>
                  <th className='px-5 py-3 text-start font-semibold'>{t.comparator.columns.service}</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-neutral-900'>
                {t.comparator.rows.map((row) => (
                  <tr key={row.symptom} className='bg-neutral-950/60 hover:bg-neutral-900/40 transition-colors'>
                    <td className='px-5 py-3 text-neutral-300'>{row.symptom}</td>
                    <td className='px-5 py-3 text-emerald-300 font-medium'>{row.service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* MODALIDADES */}
      <section id='modalidades' className='bg-neutral-950 py-24'>
        <div className='mx-auto max-w-6xl px-6'>
          <h2 className='text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl text-center'>
            {t.modalidades.title}
          </h2>
          <p className='mt-4 text-center text-neutral-400 max-w-3xl mx-auto'>{t.modalidades.subtitle}</p>
          <div className='mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {t.modalidades.items.map((m) => (
              <article key={m.title} className='rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col'>
                <h3 className='text-lg font-semibold text-neutral-50'>{m.title}</h3>
                <div className='mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.15em]'>
                  <span className='inline-block rounded-full border border-neutral-700 bg-neutral-950 px-2.5 py-1 text-neutral-400'>{m.duration}</span>
                  <span className='inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-300'>{m.priceLabel}</span>
                </div>
                <p className='mt-4 text-sm text-neutral-400 leading-relaxed'>{m.description}</p>
                <ul className='mt-4 space-y-1.5 text-sm text-neutral-300'>
                  {m.deliverables.map((d) => (
                    <li key={d} className='flex items-start gap-2'>
                      <span className='mt-1 inline-block h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0' />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* VERTICAIS */}
      <section className='bg-neutral-950 py-24 border-t border-neutral-900'>
        <div className='mx-auto max-w-6xl px-6'>
          <h2 className='text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl text-center'>
            {t.verticais.title}
          </h2>
          <p className='mt-4 text-center text-neutral-400 max-w-3xl mx-auto'>{t.verticais.subtitle}</p>
          <div className='mt-12 grid gap-6 md:grid-cols-3'>
            {t.verticais.items.map((v) => (
              <article key={v.title} className='rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6'>
                <h3 className='text-lg font-semibold text-emerald-300'>{v.title}</h3>
                <p className='mt-3 text-sm text-neutral-400 leading-relaxed'>{v.description}</p>
              </article>
            ))}
          </div>
          <div className='mt-10 text-center'>
            <p className='text-[11px] uppercase tracking-[0.18em] text-neutral-400 mb-3'>{t.verticais.additional.label}</p>
            <ul className='inline-flex flex-wrap justify-center gap-2 text-sm text-neutral-300'>
              {t.verticais.additional.items.map((a) => (
                <li key={a} className='rounded-full border border-neutral-800 bg-neutral-900/40 px-3 py-1'>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className='bg-neutral-950 py-24 border-t border-neutral-900'>
        <div className='mx-auto max-w-6xl px-6'>
          <h2 className='text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl text-center'>
            {t.pricing.title}
          </h2>
          <p className='mt-4 text-center text-neutral-400 max-w-3xl mx-auto'>{t.pricing.subtitle}</p>
          <div className='mt-10 overflow-x-auto rounded-2xl border border-neutral-800'>
            <table className='w-full text-sm'>
              <thead className='bg-neutral-900 text-neutral-300'>
                <tr>
                  <th className='px-5 py-3 text-start font-semibold'>{t.pricing.columns.modality}</th>
                  <th className='px-5 py-3 text-start font-semibold'>{t.pricing.columns.pricing}</th>
                  <th className='px-5 py-3 text-start font-semibold'>{t.pricing.columns.market}</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-neutral-900'>
                {t.pricing.rows.map((row) => (
                  <tr key={row.modality} className='bg-neutral-950/60'>
                    <td className='px-5 py-3 text-neutral-300 font-medium'>{row.modality}</td>
                    <td className='px-5 py-3 text-emerald-300'>{row.pricing}</td>
                    <td className='px-5 py-3 text-neutral-400'>{row.market}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className='mt-6 text-xs text-neutral-400 max-w-3xl mx-auto text-center leading-relaxed'>{t.pricing.note}</p>
        </div>
      </section>

      {/* CASES */}
      <section className='bg-neutral-950 py-24 border-t border-neutral-900'>
        <div className='mx-auto max-w-6xl px-6'>
          <h2 className='text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl text-center'>
            {t.cases.title}
          </h2>
          <p className='mt-4 text-center text-neutral-400 max-w-3xl mx-auto'>{t.cases.subtitle}</p>
          <div className='mt-12 grid gap-6 md:grid-cols-2'>
            {t.cases.items.map((c) => {
              const titleEl = (
                <h3 className='text-lg font-semibold text-neutral-50 group-hover:text-emerald-300 transition-colors'>
                  {c.title}
                </h3>
              );
              const link = 'link' in c && c.link ? (c.link as string) : null;
              const isInternal = link && link.startsWith('/');
              return (
                <article key={c.title} className='rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6'>
                  <span className='inline-block rounded-full border border-neutral-700 bg-neutral-950 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-neutral-400 mb-3'>
                    {c.kind}
                  </span>
                  {link ? (
                    isInternal ? (
                      <Link href={localePath(link, locale)} className='group block'>{titleEl}</Link>
                    ) : (
                      <a href={link} target='_blank' rel='noreferrer noopener' className='group block'>{titleEl}</a>
                    )
                  ) : (
                    titleEl
                  )}
                  <div className='mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.15em] text-neutral-400'>
                    <span>{c.vertical}</span>
                    <span>·</span>
                    <span>{c.period}</span>
                  </div>
                  <p className='mt-3 text-sm text-neutral-400 leading-relaxed'>{c.description}</p>
                  <p className='mt-3 text-sm text-emerald-300/90 leading-relaxed'>
                    <strong className='text-emerald-300'>→ </strong>
                    {c.outcome}
                  </p>
                </article>
              );
            })}
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
                  <h3 className='text-base font-semibold text-emerald-300'>{d.title}</h3>
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
                  <span className='text-xs text-neutral-400 text-end max-w-[60%]'>{it.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA STACK */}
      <section id='contato' className='bg-neutral-950 py-24 border-t border-neutral-900'>
        <div className='mx-auto max-w-6xl px-6'>
          <h2 className='text-3xl font-bold tracking-tight text-neutral-50 sm:text-4xl text-center'>
            {t.ctaStack.title}
          </h2>
          <p className='mt-4 text-center text-neutral-400 max-w-2xl mx-auto'>{t.ctaStack.subtitle}</p>
          <div className='mt-12 grid gap-6 md:grid-cols-3'>
            {t.ctaStack.items.map((c) => (
              <a
                key={c.title}
                href={c.href}
                className='block rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 transition-all hover:border-emerald-500/50 hover:bg-neutral-900/70'
              >
                <h3 className='text-lg font-semibold text-emerald-300'>{c.title}</h3>
                <p className='mt-3 text-sm text-neutral-400 leading-relaxed'>{c.description}</p>
                <span className='mt-5 inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-xs font-bold text-neutral-950'>
                  {c.button}
                </span>
              </a>
            ))}
          </div>
          <div className='mt-10 max-w-3xl mx-auto rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6'>
            <p className='text-[11px] uppercase tracking-[0.18em] text-neutral-400 mb-2'>{t.ctaStack.qualifier.title}</p>
            <p className='text-sm text-neutral-300 leading-relaxed'>{t.ctaStack.qualifier.description}</p>
          </div>
        </div>
      </section>

      {/* LEAD MAGNET */}
      <section className='bg-neutral-950 py-16 border-t border-neutral-900'>
        <div className='mx-auto max-w-3xl px-6 text-center'>
          <span className='inline-block rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 mb-5'>
            {t.leadMagnet.badge}
          </span>
          <h2 className='text-2xl font-bold tracking-tight text-neutral-50 sm:text-3xl'>{t.leadMagnet.title}</h2>
          <p className='mt-4 text-neutral-400 leading-relaxed'>{t.leadMagnet.description}</p>
          <a
            href={t.leadMagnet.href}
            className='mt-8 inline-flex items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-7 py-3 text-sm font-bold text-cyan-200 transition-colors hover:bg-cyan-500/20'
          >
            {t.leadMagnet.button}
          </a>
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
                <dt className='text-sm font-semibold text-emerald-300'>{p.label}</dt>
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
            className='mt-10 inline-flex items-center justify-center rounded-full bg-emerald-500 px-10 py-4 text-sm font-bold text-neutral-950 shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-400/30'
          >
            {t.finalCta.button}
          </a>
        </div>
      </section>
    </>
  );
}
