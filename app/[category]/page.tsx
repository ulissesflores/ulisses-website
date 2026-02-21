import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicationCollections, publications, type PublicationCategory } from '@/data/publications';
import { upkfMeta } from '@/data/generated/upkf.generated';

const validCategories = Object.keys(publicationCollections) as PublicationCategory[];

interface PageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return validCategories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;

  if (!validCategories.includes(category as PublicationCategory)) {
    return { title: 'Categoria nao encontrada' };
  }

  const collection = publicationCollections[category as PublicationCategory];

  return {
    title: collection.heading,
    description: collection.description,
    alternates: {
      canonical: `/${category}`,
    },
    openGraph: {
      type: 'website',
      title: collection.heading,
      description: collection.description,
      url: `${upkfMeta.primaryWebsite}/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  if (!validCategories.includes(category as PublicationCategory)) {
    notFound();
  }

  const typedCategory = category as PublicationCategory;
  const collection = publicationCollections[typedCategory];
  const categoryPublications = publications
    .filter((publication) => publication.category === typedCategory)
    .sort((a, b) => {
      if (a.date === b.date) {
        return a.ordinal - b.ordinal;
      }
      return Number(b.date) - Number(a.date);
    });

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <div className='fixed inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none' />
      <main className='relative max-w-5xl mx-auto px-6 py-20 z-10'>
        <Link
          href='/'
          className='inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-emerald-400 transition-colors mb-10'
        >
          Voltar para Home
        </Link>

        <header className='mb-10'>
          <p className='text-xs uppercase tracking-widest text-emerald-400 mb-3'>{collection.title}</p>
          <h1 className='text-3xl md:text-5xl font-bold text-white mb-4'>{collection.heading}</h1>
          <p className='text-neutral-400 text-lg leading-relaxed'>{collection.description}</p>
        </header>

        <section className='space-y-4'>
          {categoryPublications.map((publication) => (
            <article
              key={publication.id}
              className='p-6 rounded-xl bg-neutral-900/40 border border-neutral-800 hover:border-emerald-500/40 transition-colors'
            >
              <div className='flex flex-wrap items-center gap-3 mb-3 text-xs text-neutral-500'>
                <span className='px-2 py-1 border border-neutral-700 rounded-full uppercase'>{publication.category}</span>
                <span>{publication.date}</span>
                <span>{publication.kind === 'R' ? 'Report' : 'ScholarlyArticle'}</span>
              </div>
              <h2 className='text-2xl font-semibold text-white mb-3'>
                <Link href={`/${publication.category}/${publication.id}`} className='hover:text-emerald-400 transition-colors'>
                  {publication.title}
                </Link>
              </h2>
              <p className='text-neutral-400 mb-4 leading-relaxed'>{publication.summary}</p>
              <div className='flex flex-wrap gap-2'>
                {publication.tags.map((tag) => (
                  <span key={tag} className='text-[11px] bg-neutral-950 border border-neutral-800 rounded-full px-2 py-1 text-neutral-400'>
                    #{tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
