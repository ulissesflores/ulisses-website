import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import type { ReactNode } from 'react';
import { ArticleToc } from '@/components/article-toc';
import { AuthorHubCard } from '@/components/author-hub-card';
import { CopyButton } from '@/components/copy-button';
import {
  AUTHOR,
  abstractFor,
  bodyLocaleFor,
  formatCitation,
  paperPath,
  paperUrl,
  plainAbstract,
  researchCanonicalPath,
  type ResearchPaper,
} from '@/data/research';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { defaultLocale, localeLabels, type Locale } from '@/data/i18n';
import type { Dictionary } from '@/data/i18n/types';
import { extractHeadings } from '@/lib/content/mdx-heading-ids';
import { localePath } from '@/lib/locale-path';

/**
 * Página de paper no modelo Distill (docs/05 do projeto publicacoes-recuperacao): a página É
 * o artigo. Ordem dos blocos: título · byline com ORCID · linha de estado sem selo falso ·
 * identificadores · resumo · ações discretas · sumário lateral · corpo em coluna única ·
 * código e dados (existe mesmo vazia) · apêndice fixo: como citar, reuso, atualizações.
 * Zero métricas, zero contador de citação: com poucos artigos, contador é confissão.
 *
 * Deck de uma linha, "por que isso importa" e resumo em linguagem simples são prosa AUTORAL
 * e não existem aqui até o autor escrevê-los; a página não inventa texto.
 */

interface PaperPageProps {
  paper: ResearchPaper;
  locale: Locale;
  dict: Dictionary;
  /** Corpo MDX já compilado, no locale de `bodyLocale`. */
  body: ReactNode;
  rawBody: string;
}

function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '');
}

/**
 * O resumo é verbatim do paper e pode trazer parágrafos e `**rótulos**` (resumo estruturado:
 * Background/Methods/Results). Só esses dois traços viram HTML; nada mais é interpretado.
 */
function AbstractText({ text }: { text: string }) {
  return plainParagraphs(text).map((para, i) => (
    <p key={i} className='text-lg leading-relaxed text-neutral-200 max-w-[68ch] mb-4 last:mb-0'>
      {para.split(/\*\*([^*]+)\*\*/g).map((part, j) => (j % 2 ? <strong key={j}>{part}</strong> : part))}
    </p>
  ));
}

function plainParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter(Boolean);
}

function formatDate(iso: string, locale: Locale): string {
  const tag = locale === 'pt-br' ? 'pt-BR' : locale;
  return new Date(`${iso}T12:00:00-03:00`).toLocaleDateString(tag, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function PaperPage({ paper, locale, dict, body, rawBody }: PaperPageProps) {
  const t = dict.common.paperPage;
  const bodyLocale = bodyLocaleFor(paper, locale);
  const abstract = abstractFor(paper, locale);
  const pdf = paper.pdf?.[bodyLocale] ?? paper.pdf?.[paper.language];
  const origin = upkfMeta.primaryWebsite;
  const pageUrl = paperUrl(paper, locale);
  const breadcrumbBase = locale === defaultLocale ? origin : `${origin}/${locale}`;
  const statusLabel = paper.status === 'technical-report' ? t.status.technicalReport : t.status.selfPublished;
  const citation = formatCitation(paper);
  const langOf = (l: Locale) => (l === 'pt-br' ? 'pt-BR' : l);

  const headings = extractHeadings(rawBody);
  const tocSections = [
    { id: 'resumo', label: t.abstract },
    ...headings.filter((h) => h.level === 2).map((h) => ({ id: h.id, label: h.label })),
    { id: 'codigo-e-dados', label: t.code },
    { id: 'citar', label: t.cite },
    { id: 'atualizacoes', label: t.updates },
  ];

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    '@id': `${pageUrl}#article`,
    headline: paper.title,
    name: paper.title,
    abstract: plainAbstract(abstract.text),
    inLanguage: langOf(bodyLocale),
    url: pageUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    datePublished: paper.publishedAt,
    dateModified: paper.updatedAt,
    version: paper.version,
    license: paper.textLicense.url,
    keywords: abstract.keywords.join(', '),
    author: {
      '@type': 'Person',
      '@id': `${origin}/#person`,
      name: AUTHOR.name,
      sameAs: AUTHOR.orcid,
      affiliation: { '@type': 'Organization', '@id': `${origin}/#codexhash-research`, name: AUTHOR.affiliation },
    },
    publisher: { '@type': 'Organization', '@id': `${origin}/#codexhash-research`, name: AUTHOR.affiliation },
    isPartOf: { '@id': `${origin}/#collection-research` },
    ...(paper.doi
      ? {
          sameAs: `https://doi.org/${paper.doi.value}`,
          identifier: {
            '@type': 'PropertyValue',
            propertyID: 'https://registry.identifiers.org/registry/doi',
            value: paper.doi.value,
          },
        }
      : {}),
    ...(pdf
      ? { encoding: { '@type': 'MediaObject', contentUrl: `${origin}${pdf.path}`, encodingFormat: 'application/pdf' } }
      : {}),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.common.breadcrumb.home, item: `${breadcrumbBase}/` },
      { '@type': 'ListItem', position: 2, name: 'Research', item: `${breadcrumbBase}${researchCanonicalPath}` },
      { '@type': 'ListItem', position: 3, name: paper.title, item: `${breadcrumbBase}${paperPath(paper)}` },
    ],
  };

  const label = 'text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500';

  return (
    <div className='min-h-screen bg-brand-navy text-neutral-200 selection:bg-brand-gold/30 selection:text-brand-offwhite'>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className='relative max-w-5xl mx-auto px-6 py-20'>
        <Link
          href={localePath(researchCanonicalPath, locale)}
          className='inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-brand-gold-light transition-colors mb-10 group'
        >
          <ArrowLeft size={16} className='group-hover:-translate-x-1 transition-transform rtl:-scale-x-100' />
          {t.backTo}
        </Link>

        {/* 1-4: título como primeiro conteúdo, byline, estado. */}
        <header className='mb-10 border-b border-white/10 pb-10'>
          <p className='text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold-light mb-5'>
            {t.kicker} · {statusLabel}
          </p>
          <h1 className='font-display text-3xl md:text-5xl font-bold text-brand-offwhite mb-6 leading-tight' lang={langOf(paper.language)}>
            {paper.title}
          </h1>

          <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1 text-neutral-300 mb-4'>
            <span className='text-lg font-semibold text-brand-offwhite'>{AUTHOR.name}</span>
            <span className='text-sm text-neutral-400'>{AUTHOR.affiliation}</span>
            <a href={AUTHOR.orcid} rel='author' className='font-mono text-sm text-brand-gold-light underline underline-offset-4'>
              {AUTHOR.orcid.replace('https://', '')}
            </a>
          </div>

          <dl className='flex flex-wrap gap-x-8 gap-y-2 text-sm text-neutral-400 mb-6'>
            <div>
              <dt className='inline'>{t.published}: </dt>
              <dd className='inline text-neutral-200'>
                <time dateTime={paper.publishedAt}>{formatDate(paper.publishedAt, locale)}</time>
              </dd>
            </div>
            <div>
              <dt className='inline'>{t.updated}: </dt>
              <dd className='inline text-neutral-200'>
                <time dateTime={paper.updatedAt}>{formatDate(paper.updatedAt, locale)}</time>
              </dd>
            </div>
            <div>
              <dt className='inline'>{t.version}: </dt>
              <dd className='inline font-mono text-neutral-200'>{paper.version}</dd>
            </div>
            <div>
              <dt className='inline'>{t.textLicense}: </dt>
              <dd className='inline text-neutral-200'>
                <a href={paper.textLicense.url} className='underline underline-offset-4'>
                  {paper.textLicense.name}
                </a>
              </dd>
            </div>
            <div>
              <dd className='inline text-neutral-500'>{t.noPeerReview}</dd>
            </div>
          </dl>

          {/* Identificadores: o DOI rotulado pelo objeto que identifica; o ORCID no lugar que o autor controla. */}
          <div className='grid gap-4 sm:grid-cols-2 text-sm'>
            <div className='rounded-lg border border-white/10 bg-neutral-900/30 p-4'>
              <p className={label}>{t.workId}</p>
              {paper.doi ? (
                <>
                  <a href={`https://doi.org/${paper.doi.value}`} className='font-mono text-brand-gold-light underline underline-offset-4 break-all'>
                    https://doi.org/{paper.doi.value}
                  </a>
                  <p className='mt-1 text-xs text-neutral-400'>
                    {paper.doi.object === 'publication' ? t.doiObject.publication : t.doiObject.replicationPackage}
                  </p>
                </>
              ) : (
                <>
                  <p className='text-neutral-300'>{t.noDoi}</p>
                  <a href={paperUrl(paper, paper.language)} className='font-mono text-brand-gold-light underline underline-offset-4 break-all'>
                    {paperUrl(paper, paper.language)}
                  </a>
                </>
              )}
            </div>
            <div className='rounded-lg border border-white/10 bg-neutral-900/30 p-4'>
              <p className={label}>{t.authorId}</p>
              <a href={AUTHOR.orcid} rel='author' className='font-mono text-brand-gold-light underline underline-offset-4'>
                {AUTHOR.orcid}
              </a>
            </div>
          </div>

          {bodyLocale !== locale ? (
            <p className='mt-6 rounded-md border border-brand-gold/30 bg-brand-gold/5 px-4 py-3 text-sm text-neutral-300'>
              {fill(t.bodyNotice, { lang: localeLabels[bodyLocale] })}
            </p>
          ) : null}
        </header>

        {/* 5: resumo em bloco semântico. */}
        {abstract.text ? (
          <section id='resumo' aria-labelledby='resumo-h' className='mb-8 scroll-mt-28' lang={langOf(abstract.locale)}>
            <h2 id='resumo-h' className={`${label} mb-3`}>
              {t.abstract}
            </h2>
            <AbstractText text={abstract.text} />
            {abstract.keywords.length ? (
              <p className='mt-4 text-sm text-neutral-400'>
                <span className={label}>{t.keywords}: </span>
                {abstract.keywords.join(' · ')}
              </p>
            ) : null}
          </section>
        ) : null}

        {/* 6: barra de ações discreta. O PDF é espelho. */}
        <div className='mb-12 flex flex-wrap items-center gap-4 text-sm'>
          {pdf ? (
            <a
              href={pdf.path}
              className='inline-flex items-center gap-2 rounded-md border border-neutral-700 px-4 py-2 text-neutral-200 hover:border-brand-gold/50 transition-colors'
            >
              <FileText size={16} /> {t.pdf}
              <span className='font-mono text-xs text-neutral-500'>
                {pdf.pages} p · {Math.round(pdf.bytes / 1024)} KB
              </span>
            </a>
          ) : null}
          <a href='#citar' className='text-brand-gold-light underline underline-offset-4'>
            {t.bibtex}
          </a>
          <a href='#codigo-e-dados' className='text-brand-gold-light underline underline-offset-4'>
            {t.code}
          </a>
          {pdf ? <span className='text-xs text-neutral-500'>{t.pdfNote}</span> : null}
        </div>

        {/* 7-9: sumário lateral e corpo em coluna única, com notas ancoradas no próprio corpo. */}
        <div className='lg:flex lg:gap-10 lg:items-start'>
          <div className='lg:order-2 lg:w-60 lg:shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto'>
            <ArticleToc sections={tocSections} title={dict.common.articleDetail.onThisPage} />
          </div>
          <div className='min-w-0 lg:order-1 flex-1'>
            <article
              className='prose prose-invert prose-lg max-w-[68ch] prose-headings:font-display prose-a:text-brand-gold-light prose-figcaption:text-neutral-400'
              lang={langOf(bodyLocale)}
              dir='ltr'
            >
              {body}
            </article>

            {/* 10: código e dados, mesmo vazia — vazio declarado vale mais que seção ausente. */}
            <section id='codigo-e-dados' className='mt-14 scroll-mt-28 rounded-xl border border-white/10 bg-neutral-900/30 p-6'>
              <h2 className='text-xl font-semibold text-brand-offwhite mb-4'>{t.code}</h2>
              {paper.repository ? (
                <dl className='space-y-3 text-sm'>
                  <div>
                    <dt className={label}>{t.repository}</dt>
                    <dd>
                      <a href={paper.repository} className='text-brand-gold-light underline underline-offset-4' rel='noopener'>
                        {paper.repository.replace('https://', '')}
                      </a>
                      {paper.doi?.object === 'replication-package' ? (
                        <span className='block text-xs text-neutral-400 mt-1'>{t.doiObject.replicationPackage}</span>
                      ) : null}
                    </dd>
                  </div>
                  {paper.related?.length ? (
                    <div>
                      <dt className={label}>{t.related}</dt>
                      <dd>
                        <ul className='space-y-1'>
                          {paper.related.map((r) => (
                            <li key={r.url}>
                              <span className='font-mono text-xs text-neutral-500'>{r.relation}</span>{' '}
                              <a href={r.url} className='text-brand-gold-light underline underline-offset-4'>
                                {r.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  ) : null}
                  {paper.origin ? (
                    <div>
                      <dt className={label}>{t.origin}</dt>
                      <dd className='text-neutral-300' lang={langOf(paper.language)}>
                        {paper.origin}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              ) : (
                <p className='text-sm text-neutral-300'>{t.noCode}</p>
              )}
            </section>

            {/* 12: o trio do Distill — citar, reuso, atualizações. */}
            <section id='citar' className='mt-10 scroll-mt-28'>
              <h2 className='text-xl font-semibold text-brand-offwhite mb-3'>{t.cite}</h2>
              <p className='text-sm text-neutral-300 leading-relaxed mb-4 break-words' lang='en'>
                {citation}
              </p>
              <p className={`${label} mb-2`}>{t.bibtex}</p>
              <pre className='overflow-x-auto rounded-md border border-neutral-800 bg-brand-navy-deep/60 p-4 text-xs leading-relaxed text-neutral-300'>
                <code>{paper.bibtex}</code>
              </pre>
              <div className='mt-3'>
                <CopyButton text={paper.bibtex} label={t.copy} doneLabel={t.copied} failLabel={t.copyFailed} />
              </div>
            </section>

            <section id='reuso' className='mt-10 scroll-mt-28'>
              <h2 className='text-xl font-semibold text-brand-offwhite mb-3'>{t.reuse}</h2>
              <p className='text-sm text-neutral-300 leading-relaxed'>
                {fill(t.reuseText, { license: paper.textLicense.name })}{' '}
                <a href={paper.textLicense.url} className='text-brand-gold-light underline underline-offset-4'>
                  {paper.textLicense.url.replace('https://', '')}
                </a>
              </p>
            </section>

            <section id='atualizacoes' className='mt-10 scroll-mt-28'>
              <h2 className='text-xl font-semibold text-brand-offwhite mb-3'>{t.updates}</h2>
              {paper.updates.length ? (
                <ul className='space-y-2 text-sm text-neutral-300'>
                  {paper.updates.map((u) => (
                    <li key={`${u.date}-${u.note}`}>
                      <time dateTime={u.date} className='font-mono text-neutral-400'>
                        {u.date}
                      </time>{' '}
                      {u.note}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-sm text-neutral-400'>{fill(t.noUpdates, { date: formatDate(paper.updatedAt, locale) })}</p>
              )}
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
          </div>
        </div>
      </main>
    </div>
  );
}
