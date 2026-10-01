import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { software, softwareCanonicalPath, softwareCounts, softwareMeasuredAt } from '@/data/software';
import { AUTHOR } from '@/data/research';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { defaultLocale, isLocale, localeToOgLocale, type Locale } from '@/data/i18n';
import { getDictionary } from '@/lib/get-dictionary';
import { localePath } from '@/lib/locale-path';
import { buildCanonical, buildLanguageAlternates, defaultOgImages, toMetaDescription } from '@/data/seo';

/**
 * Seção de trabalhos técnicos: rota e rótulo próprios, FORA de publicações (docs/07 do
 * projeto publicacoes-recuperacao). Cada item imprime a palavra "Software", mostra versão
 * e estado de manutenção, e tem um bloco de citação visivelmente diferente do de artigo.
 * Nenhum campo de artigo (revista, volume, página) aparece aqui, de propósito.
 */

interface PageProps {
  params: Promise<{ locale: string }>;
}

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ''));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.common.softwarePage;
  return {
    title: t.metaTitle,
    description: toMetaDescription(t.lead),
    alternates: {
      canonical: buildCanonical(locale, softwareCanonicalPath),
      languages: buildLanguageAlternates(softwareCanonicalPath),
    },
    openGraph: {
      images: defaultOgImages(locale),
      type: 'website',
      title: `${t.title} | Ulisses Flores`,
      description: t.lead,
      url: `${upkfMeta.primaryWebsite}${buildCanonical(locale, softwareCanonicalPath)}`,
      locale: localeToOgLocale[locale],
    },
  };
}

export default async function SoftwarePage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.common.softwarePage;
  const counts = softwareCounts();
  const origin = upkfMeta.primaryWebsite;
  const pageUrl = `${origin}${softwareCanonicalPath}`;
  const breadcrumbBase = locale === defaultLocale ? origin : `${origin}/${locale}`;

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${pageUrl}#collection`,
    name: t.title,
    description: t.lead,
    url: pageUrl,
    inLanguage: locale,
    isPartOf: { '@id': `${origin}/#website` },
    author: { '@type': 'Person', '@id': `${origin}/#person`, name: AUTHOR.name, sameAs: AUTHOR.orcid },
    hasPart: software.map((item) => ({
      '@type': 'SoftwareSourceCode',
      '@id': `https://doi.org/${item.conceptDoi}`,
      name: item.name,
      codeRepository: item.url,
      programmingLanguage: item.language,
      license: item.license,
      version: item.version,
      dateModified: item.pushedAt,
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'https://registry.identifiers.org/registry/doi',
        value: item.conceptDoi,
      },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.common.breadcrumb.home, item: `${breadcrumbBase}/` },
      { '@type': 'ListItem', position: 2, name: t.title, item: `${breadcrumbBase}${softwareCanonicalPath}` },
    ],
  };

  return (
    <div className='min-h-screen bg-brand-navy text-neutral-200 selection:bg-brand-gold/30 selection:text-brand-offwhite'>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className='max-w-4xl mx-auto px-6 py-20'>
        <Link
          href={localePath('/', locale)}
          className='inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-brand-gold-light transition-colors mb-10 group'
        >
          <ArrowLeft size={16} className='group-hover:-translate-x-1 transition-transform rtl:-scale-x-100' />
          {dict.common.breadcrumb.home}
        </Link>

        <header className='mb-12 border-b border-white/10 pb-10'>
          <p className='text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold-light mb-4'>{t.label}</p>
          <h1 className='font-display text-3xl md:text-5xl font-bold text-brand-offwhite mb-6 leading-tight'>{t.title}</h1>
          <p className='text-lg text-neutral-400 leading-relaxed max-w-3xl mb-6'>{t.lead}</p>
          {/* Contagem honesta, com data: o oposto de metadado inflado (docs/07 §12). */}
          <p className='font-mono text-sm text-brand-gold-light'>
            {fill(t.counts, { total: counts.total, withDoi: counts.withDoi, active: counts.active, date: softwareMeasuredAt })}
          </p>
          <p className='text-xs text-neutral-500 mt-2'>{fill(t.maintenanceRule, { date: softwareMeasuredAt })}</p>
        </header>

        <section className='grid gap-6 md:grid-cols-2 mb-14'>
          {t.explain.map((e) => (
            <div key={e.title} className='rounded-xl border border-white/10 bg-neutral-900/30 p-6'>
              <h2 className='text-base font-semibold text-brand-offwhite mb-2'>{e.title}</h2>
              <p className='text-sm text-neutral-400 leading-relaxed'>{e.text}</p>
            </div>
          ))}
        </section>

        <section className='space-y-6'>
          {software.map((item) => {
            const year = item.releasedAt.slice(0, 4);
            const cite = `${AUTHOR.citationName} (${year}). ${item.name} (Version ${item.version}) [Computer software]. Zenodo. https://doi.org/${item.versionDoi}`;
            return (
              <article
                key={item.repo}
                className='rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 hover:border-brand-gold/40 transition-colors'
              >
                <div className='flex flex-wrap items-center gap-3 mb-3 text-xs text-neutral-400'>
                  {/* A palavra impressa em cada item: sobrevive a quem chega por link direto. */}
                  <span className='px-2 py-1 border border-brand-gold/40 rounded-full uppercase tracking-widest text-brand-gold-light font-bold'>
                    {t.label}
                  </span>
                  <span className='font-mono'>
                    {t.version} {item.version}
                  </span>
                  <span className='px-2 py-1 border border-neutral-700 rounded-full'>{t.maintenance[item.maintenance]}</span>
                  <span className='font-mono'>{item.pushedAt}</span>
                </div>
                <h2 className='text-xl font-semibold text-brand-offwhite mb-2 leading-snug' lang='en'>
                  {item.name}
                </h2>
                {item.description ? (
                  <p className='text-sm text-neutral-400 leading-relaxed mb-4' lang='en'>
                    {item.description}
                  </p>
                ) : null}
                <dl className='grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2 mb-4'>
                  <div>
                    <dt className='text-neutral-500'>{t.conceptDoi}</dt>
                    <dd>
                      <a href={`https://doi.org/${item.conceptDoi}`} className='font-mono text-brand-gold-light underline underline-offset-4'>
                        https://doi.org/{item.conceptDoi}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className='text-neutral-500'>{t.versionDoi}</dt>
                    <dd>
                      <a href={`https://doi.org/${item.versionDoi}`} className='font-mono text-brand-gold-light underline underline-offset-4'>
                        https://doi.org/{item.versionDoi}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className='text-neutral-500'>{t.repository}</dt>
                    <dd>
                      <a href={item.url} className='text-brand-gold-light underline underline-offset-4' rel='noopener'>
                        {item.url.replace('https://', '')}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className='text-neutral-500'>
                      {t.license} · {t.language}
                    </dt>
                    <dd className='text-neutral-300'>
                      {item.license} · {item.language}
                    </dd>
                  </div>
                  {item.companion ? (
                    <div className='sm:col-span-2'>
                      <dt className='text-neutral-500'>
                        {t.companion} <span className='font-mono text-xs'>({item.companion.label})</span>
                      </dt>
                      <dd>
                        <a href={item.companion.url} className='text-brand-gold-light underline underline-offset-4'>
                          {item.companion.url.replace('https://', '')}
                        </a>
                      </dd>
                    </div>
                  ) : null}
                </dl>
                {/* Bloco de citação de SOFTWARE, visivelmente diferente do de artigo. */}
                <div className='rounded-md border border-dashed border-neutral-700 bg-brand-navy-deep/60 p-4'>
                  <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-1'>{t.cite}</p>
                  <p className='font-mono text-xs leading-relaxed text-neutral-300 break-words'>{cite}</p>
                </div>
              </article>
            );
          })}
        </section>

        <footer className='mt-16 border-t border-white/10 pt-10'>
          <AuthorHubCard
            label={dict.common.authorHubCard.defaultLabel}
            description={upkfMeta.description[locale === 'pt-br' ? 'pt-BR' : (locale as 'en' | 'es' | 'it' | 'he')]}
            href={localePath('/identidade', locale)}
            contactLabel={dict.common.actions.contact}
            contactHref={localePath('/#contact', locale)}
          />
        </footer>
      </main>
    </div>
  );
}
