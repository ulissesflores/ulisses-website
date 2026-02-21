import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, Calendar, Download } from 'lucide-react';
import { publicationCollections, publications } from '@/data/publications';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { buildLanguageAlternates } from '@/data/seo';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export function generateStaticParams() {
  return publications.map((publication) => ({
    category: publication.category,
    slug: publication.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const publication = publications.find((item) => item.category === category && item.id === slug);

  if (!publication) {
    return { title: 'Artigo nao encontrado' };
  }

  const canonicalPath = `/${publication.category}/${publication.id}`;

  return {
    title: publication.title,
    description: publication.summary,
    alternates: {
      canonical: canonicalPath,
      languages: buildLanguageAlternates(canonicalPath),
    },
    openGraph: {
      type: 'article',
      title: publication.title,
      description: publication.summary,
      url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
      publishedTime: publication.publishedAt,
      modifiedTime: publication.updatedAt,
      authors: [upkfMeta.canonicalLegalName],
      tags: publication.tags,
    },
    other: {
      citation_title: publication.title,
      citation_author: upkfMeta.canonicalLegalName,
      citation_publication_date: publication.publishedAt,
      citation_language: publication.inLanguage,
      citation_pdf_url: `${upkfMeta.primaryWebsite}${publication.downloadUrl}`,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { category, slug } = await params;
  const publication = publications.find((item) => item.category === category && item.id === slug);

  if (!publication) {
    notFound();
  }

  const collection = publicationCollections[publication.category];

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': publication.kind === 'R' ? 'Report' : 'ScholarlyArticle',
    '@id': `${upkfMeta.primaryWebsite}/#pub-${publication.id}`,
    headline: publication.title,
    name: publication.title,
    description: publication.summary,
    datePublished: publication.publishedAt,
    dateModified: publication.updatedAt,
    inLanguage: publication.inLanguage,
    url: `${upkfMeta.primaryWebsite}/${publication.category}/${publication.id}`,
    keywords: publication.tags,
    author: {
      '@type': 'Person',
      '@id': `${upkfMeta.primaryWebsite}/#person`,
      name: upkfMeta.canonicalLegalName,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${upkfMeta.primaryWebsite}/#codexhash-research`,
      name: 'Codex Hash Research',
    },
    isPartOf: {
      '@id': `${upkfMeta.primaryWebsite}/#collection-${publication.category}`,
      name: collection.heading,
    },
    encoding: {
      '@type': 'MediaObject',
      contentUrl: `${upkfMeta.primaryWebsite}${publication.downloadUrl}`,
      encodingFormat: 'application/pdf',
    },
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-emerald-500/30'>
      <div className='fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none' />
      <div className='fixed inset-0 bg-[radial-gradient(circle_800px_at_50%_-200px,#10b98108,transparent)] pointer-events-none' />

      <main className='relative max-w-4xl mx-auto px-6 py-20 z-10'>
        <Link
          href={`/${publication.category}`}
          className='inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-emerald-400 transition-colors mb-4 group'
        >
          <ArrowLeft size={16} className='group-hover:-translate-x-1 transition-transform' />
          Voltar para {collection.title}
        </Link>

        <Link href='/' className='inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-300 transition-colors mb-10'>
          Ir para Home
        </Link>

        <header className='mb-12 border-b border-white/10 pb-12'>
          <div className='flex flex-wrap gap-4 mb-6'>
            <span className='px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-full'>
              {publication.category}
            </span>
            <span className='flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase'>
              <Calendar size={12} /> {publication.date}
            </span>
            <span className='text-xs text-neutral-500 border border-neutral-700 rounded-full px-2 py-1'>
              {publication.kind === 'R' ? 'Report' : 'ScholarlyArticle'}
            </span>
          </div>

          <h1 className='text-3xl md:text-5xl font-bold text-white mb-8 leading-tight'>{publication.title}</h1>

          <p className='text-lg text-neutral-400 leading-relaxed mb-8'>{publication.summary}</p>

          <div className='flex flex-wrap gap-2 mb-8'>
            {publication.tags.map((tag) => (
              <span key={tag} className='text-xs bg-neutral-900 text-neutral-400 px-3 py-1 rounded-full border border-neutral-800'>
                #{tag}
              </span>
            ))}
          </div>

          <div className='flex flex-col sm:flex-row gap-4'>
            <a
              href={publication.downloadUrl}
              target='_blank'
              className='flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]'
            >
              <Download size={20} />
              Baixar PDF (temporario)
            </a>
          </div>
        </header>

        <div className='prose prose-invert max-w-none space-y-10'>
          <section>
            <h2 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
              <BookOpen size={20} className='text-emerald-500' /> Sintese Executiva da Pagina
            </h2>
            <div className='bg-neutral-900/40 p-8 rounded-2xl border border-emerald-500/20 space-y-4'>
              <p className='text-neutral-200 leading-relaxed'>{publication.landing.overview}</p>
              <p className='text-neutral-300 leading-relaxed'>{publication.landing.problem}</p>
              <ul className='list-disc pl-6 text-neutral-300 space-y-2'>
                {publication.landing.contributions.map((contribution) => (
                  <li key={contribution}>{contribution}</li>
                ))}
              </ul>
              <p className='text-neutral-300 leading-relaxed'>{publication.landing.applications}</p>
              <p className='text-sm text-emerald-300/90 leading-relaxed border-t border-emerald-500/20 pt-4'>
                {publication.landing.downloadPitch}
              </p>
            </div>
          </section>

          <section>
            <h2 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
              <BookOpen size={20} className='text-cyan-500' /> Resumo Cientifico
            </h2>
            <div className='bg-neutral-900/30 p-8 rounded-2xl border border-white/5 text-lg leading-relaxed text-neutral-300 shadow-inner'>
              {publication.sections.abstract}
            </div>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-white mb-3'>Introducao</h2>
            <p className='text-neutral-300 leading-relaxed'>{publication.sections.introduction}</p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-white mb-3'>Metodos</h2>
            <p className='text-neutral-300 leading-relaxed'>{publication.sections.methods}</p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-white mb-3'>Resultados</h2>
            <p className='text-neutral-300 leading-relaxed'>{publication.sections.results}</p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-white mb-3'>Discussao</h2>
            <p className='text-neutral-300 leading-relaxed'>{publication.sections.discussion}</p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-white mb-3'>Conclusao</h2>
            <p className='text-neutral-300 leading-relaxed'>{publication.sections.conclusion}</p>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-white mb-3'>Referencias</h2>
            <ul className='list-disc pl-6 text-neutral-300 space-y-2'>
              {publication.sections.references.map((reference) => (
                <li key={reference}>{reference}</li>
              ))}
            </ul>
          </section>

          <section className='mt-12 p-6 border-l-4 border-emerald-500/30 bg-emerald-900/5 rounded-r-xl'>
            <p className='text-sm text-neutral-400 italic'>
              <strong>Como citar:</strong> FLORES, C. U. &quot;{publication.title}&quot;. Codex Hash Research,
              {` ${publication.date}`}. Disponivel em: {upkfMeta.primaryWebsite}/{publication.category}/{publication.id}
            </p>
          </section>
        </div>
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    </div>
  );
}
