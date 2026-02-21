import type { Metadata } from 'next';
import Link from 'next/link';
import { knowledgeData } from '@/data/knowledge';
import { upkfMeta } from '@/data/generated/upkf.generated';

export const metadata: Metadata = {
  title: 'Mundo Politico | Canonical Index',
  description:
    'Índice canônico dos artigos publicados no portal Mundo Político com páginas de contexto e links para as fontes originais.',
  alternates: {
    canonical: '/mundo-politico',
  },
  openGraph: {
    type: 'website',
    url: `${upkfMeta.primaryWebsite}/mundo-politico`,
    title: 'Mundo Politico | Canonical Index',
    description:
      'Canonical index of Mundo Político articles with publication context and links to original resources.',
  },
};

export default function MundoPoliticoPage() {
  const posts = [...knowledgeData.blog.posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${upkfMeta.primaryWebsite}/mundo-politico#collection`,
    url: `${upkfMeta.primaryWebsite}/mundo-politico`,
    name: 'Mundo Politico - Canonical Index',
    description:
      'Canonical index of Mundo Político publications with individual context pages and outbound references.',
    hasPart: posts.map((post) => ({
      '@id': `${upkfMeta.primaryWebsite}${post.canonicalPath}`,
    })),
    about: {
      '@id': `${upkfMeta.primaryWebsite}/#person`,
    },
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <main className='max-w-5xl mx-auto px-6 py-20'>
        <Link href='/' className='text-sm text-neutral-400 hover:text-emerald-400 transition-colors'>
          Voltar para Home
        </Link>

        <header className='mt-8 mb-10'>
          <p className='text-xs uppercase tracking-widest text-emerald-400 mb-3'>Mundo Politico</p>
          <h1 className='text-4xl font-bold text-white mb-4'>Mundo Politico - Canonical Index</h1>
          <p className='text-neutral-400 leading-relaxed max-w-3xl'>
            Esta seção organiza as publicações do portal Mundo Político em páginas canônicas internas, com contexto editorial e
            referência para a URL original.
          </p>
        </header>

        <div className='space-y-4'>
          {posts.map((post) => (
            <article key={post.slug} className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6'>
              <div className='flex flex-wrap gap-3 text-xs text-neutral-500 mb-3'>
                <span className='rounded-full border border-neutral-700 px-2 py-1'>#{post.position}</span>
                <span>{post.publishedAt}</span>
              </div>
              <h2 className='text-xl font-semibold text-white mb-3'>
                <Link href={post.canonicalPath} className='hover:text-emerald-400 transition-colors'>
                  {post.headline}
                </Link>
              </h2>
              <p className='text-sm text-neutral-400 mb-4'>{post.summary}</p>
              <a
                href={post.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-sm text-emerald-300 hover:text-emerald-200 transition-colors'
              >
                Link original no Mundo Politico
              </a>
            </article>
          ))}
        </div>
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </div>
  );
}

