import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar } from 'lucide-react';
import {
  artigoDateToIso,
  artigos,
  artigosCanonicalPath,
  findArtigo,
  formatArtigoDate,
  localizeArtigo,
} from '@/data/artigos';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { loadMdx } from '@/lib/content/mdx-loader';
import { MdxContentWrapper, mdxComponents } from '@/lib/content/mdx-components';
import { defaultLocale, isLocale, localeToOgLocale, type Locale } from '@/data/i18n';
import { getDictionary } from '@/lib/get-dictionary';
import { localePath } from '@/lib/locale-path';
import { buildCanonical, buildLanguageAlternates } from '@/data/seo';

const CONTENT_TYPE = 'artigos';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return artigos.map((artigo) => ({ slug: artigo.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const artigo = findArtigo(slug);

  if (!artigo) {
    return { title: dict.common.articleDetail.notFound };
  }

  const { title, summary } = localizeArtigo(artigo, locale);
  const path = `${artigosCanonicalPath}/${artigo.slug}`;
  // A capa vira o card de compartilhamento só onde a arte fala o idioma do leitor:
  // ela traz o título, os rótulos e o atalho desenhados dentro dela. Locale fora do
  // mapa cai no card tipográfico de `opengraph-image.tsx`, que É localizado.
  const heroOg = artigo.hero?.locales[locale]?.og ?? null;

  return {
    title,
    description: summary,
    keywords: [...artigo.tags],
    authors: [
      {
        name: upkfMeta.publicDisplayName || upkfMeta.displayName,
        url: `${upkfMeta.primaryWebsite}/identidade`,
      },
    ],
    alternates: {
      canonical: buildCanonical(locale, path),
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      // Card por artigo (app/[locale]/artigos/[slug]/opengraph-image.tsx), não o
      // genérico do site: a convenção de arquivo não sobrevive à substituição do
      // openGraph herdado do layout, então a URL entra explícita — ver data/seo.ts.
      images: [
        {
          url: `${upkfMeta.primaryWebsite}${heroOg ?? buildCanonical(locale, `${path}/opengraph-image`)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
      url: `${upkfMeta.primaryWebsite}${path}`,
      title,
      description: summary,
      locale: localeToOgLocale[locale],
      publishedTime: artigo.date,
      authors: [upkfMeta.publicDisplayName || upkfMeta.displayName],
      tags: [...artigo.tags],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: summary,
    },
  };
}

export default async function ArtigoPage({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.artigos;
  const artigo = findArtigo(slug);

  if (!artigo) {
    notFound();
  }

  const { title, summary } = localizeArtigo(artigo, locale);

  // Corpo traduzido quando existe; senão o original em pt-BR. Devolver 404 nos
  // outros locales quebraria o cluster hreflang que o metadata acima anuncia.
  const localizedMdx = await loadMdx(CONTENT_TYPE, artigo.slug, locale, mdxComponents);
  const mdx = localizedMdx ?? (await loadMdx(CONTENT_TYPE, artigo.slug, defaultLocale, mdxComponents));

  if (!mdx) {
    notFound();
  }

  const bodyLocale = localizedMdx ? locale : defaultLocale;

  const origin = upkfMeta.primaryWebsite;
  const path = `${artigosCanonicalPath}/${artigo.slug}`;
  const pageUrl = `${origin}${path}`;
  const breadcrumbBase = locale === defaultLocale ? origin : `${origin}/${locale}`;
  const publishedIso = artigoDateToIso(artigo.date);
  const hero = artigo.hero?.locales[locale];

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${pageUrl}#article`,
    headline: title,
    description: summary,
    url: pageUrl,
    inLanguage: locale,
    datePublished: publishedIso,
    dateModified: publishedIso,
    keywords: artigo.tags.join(', '),
    /*
     * A imagem do artigo, não o retrato do autor: até 2026-08-28 isto apontava para
     * `carlos-ulisses-flores-cto.jpg`, um retrato de 350x401 anunciado onde o consumidor
     * do metadado espera a arte do post. Agora é a capa daquele locale; sem capa, o card
     * tipográfico do próprio slug, que existe para os 5 e é 1200x630 de verdade.
     */
    image: `${origin}${hero?.og ?? buildCanonical(locale, `${path}/opengraph-image`)}`,
    author: {
      '@type': 'Person',
      '@id': `${origin}/#person`,
      name: upkfMeta.publicDisplayName || upkfMeta.displayName,
    },
    publisher: { '@id': `${origin}/#person` },
    isPartOf: { '@id': `${origin}${artigosCanonicalPath}#collection` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.common.breadcrumb.home, item: `${breadcrumbBase}/` },
      { '@type': 'ListItem', position: 2, name: t.hero.badge, item: `${breadcrumbBase}${artigosCanonicalPath}` },
      { '@type': 'ListItem', position: 3, name: title, item: `${breadcrumbBase}${path}` },
    ],
  };

  return (
    <div className='min-h-screen bg-brand-navy text-neutral-200 selection:bg-brand-gold/30 selection:text-brand-offwhite'>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className='max-w-3xl mx-auto px-6 py-20'>
        <Link
          href={localePath(artigosCanonicalPath, locale)}
          className='inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-brand-gold-light transition-colors mb-10 group'
        >
          <ArrowLeft size={16} className='group-hover:-translate-x-1 transition-transform rtl:-scale-x-100' />
          {t.post.backToIndex}
        </Link>

        <header className='mb-10 border-b border-white/10 pb-10'>
          <div className='flex flex-wrap items-center gap-4 mb-6 text-xs text-neutral-400'>
            <span className='px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold-light font-bold uppercase tracking-widest rounded-full'>
              {t.hero.badge}
            </span>
            <span className='flex items-center gap-2 font-mono uppercase'>
              <Calendar size={12} /> {dict.common.articleDetail.publishedOn} {formatArtigoDate(artigo.date, locale)}
            </span>
          </div>

          <h1 className='text-3xl md:text-4xl font-bold text-brand-offwhite mb-6 leading-tight'>{title}</h1>
          <p className='text-lg text-neutral-400 leading-relaxed mb-8'>{summary}</p>

          <div className='flex flex-wrap gap-2 mb-8'>
            {artigo.tags.map((tag) => (
              <span
                key={tag}
                className='text-[11px] bg-neutral-900 text-neutral-400 px-3 py-1 rounded-full border border-neutral-800'
              >
                #{tag}
              </span>
            ))}
          </div>

        </header>

        {/*
          Capa no idioma do leitor (mesma regra do `og:image` acima): o título e o
          atalho estão desenhados dentro do PNG. `priority` porque ela é o LCP da
          página; `width`/`height` reais reservam o espaço e mantêm o CLS em zero.
        */}
        {hero ? (
          <Image
            src={hero.src}
            alt={title}
            width={artigo.hero!.width}
            height={artigo.hero!.height}
            priority
            sizes='(min-width: 768px) 48rem, 100vw'
            className='mb-10 h-auto w-full rounded-lg border border-white/10'
          />
        ) : null}

        {/* Rolagem de tabela larga vive no map de `table` em mdx-components. */}
        <MdxContentWrapper locale={bodyLocale}>{mdx.content}</MdxContentWrapper>

        {/*
          Assinatura no FIM, não no topo: antes da leitura o card interrompe o
          artigo sem responder nada; depois dela é o único ponto em que a página
          pede algo ao leitor que acabou de investir o tempo todo. O `rel=author`
          para /identidade continua sendo emitido — é a âncora de GEO do UPKF.
        */}
        <footer className='mt-16 border-t border-white/10 pt-10'>
          {/* Bio da fonte canônica UPKF (já traduzida nos 5 locales), não o rótulo
              genérico: no fim do artigo o leitor quer saber QUEM escreveu aquilo. */}
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
