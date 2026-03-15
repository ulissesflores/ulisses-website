import type { Metadata } from 'next';
import Link from 'next/link';
import { knowledgeData } from '@/data/knowledge';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { FaqSection } from '@/components/faq-section';
import { mundoPoliticoFaq } from '@/data/faq';

const canonicalPath = '/mundo-politico';

export const metadata: Metadata = {
  title: 'Mundo Político — Economia Austríaca, Geopolítica e Soberania | Ulisses Flores',
  description:
    'Artigos de análise econômica, geopolítica e soberania sob a perspectiva da Escola Austríaca de Economia, escritos por Ulisses Flores — Cientista Econômico (FIAP), Consultor Estratégico de IA e Mestrando em IA pela AGTU (EUA).',
  keywords: [
    'escola austríaca de economia',
    'economia austríaca Brasil',
    'geopolítica e soberania',
    'análise econômica',
    'Ulisses Flores economista',
    'praxeologia',
    'Bitcoin economia austríaca',
    'soberania digital',
    'libertarianismo econômico',
  ],
  authors: [
    {
      name: upkfMeta.publicDisplayName || upkfMeta.displayName,
      url: `${upkfMeta.primaryWebsite}/identidade`,
    },
  ],
  alternates: {
    canonical: canonicalPath,
  },
  openGraph: {
    type: 'website',
    url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
    title: 'Mundo Político — Economia Austríaca, Geopolítica e Soberania | Ulisses Flores',
    description:
      'Análises de economia, geopolítica e soberania sob a lente da Escola Austríaca, por Ulisses Flores — Cientista Econômico, Consultor de IA e Mestrando AGTU (EUA).',
    locale: 'pt_BR',
  },
};

export default function MundoPoliticoPage() {
  const posts = [...knowledgeData.blog.posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const origin = upkfMeta.primaryWebsite;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${origin}${canonicalPath}#collection`,
        url: `${origin}${canonicalPath}`,
        name: 'Mundo Político — Economia Austríaca, Geopolítica e Soberania',
        description:
          'Índice canônico de artigos sobre economia austríaca, geopolítica e soberania digital, escritos por Ulisses Flores.',
        inLanguage: 'pt-BR',
        isPartOf: {
          '@id': `${origin}/#website`,
        },
        author: {
          '@id': `${origin}/#person`,
        },
        hasPart: posts.map((post) => ({
          '@type': 'BlogPosting',
          '@id': `${origin}${post.canonicalPath}`,
          headline: post.headline,
          url: `${origin}${post.canonicalPath}`,
        })),
      },
    ],
  };

  return (
    <>
      {/* Hero Section — white, SEO/GEO/LLM optimized */}
      <section className='bg-neutral-950 text-neutral-200 pt-20 pb-16 border-b border-neutral-800'>
        <div className='max-w-4xl mx-auto px-6'>
          {/* Breadcrumb */}
          <div className='flex items-center gap-2 mb-6'>
            <Link href='/' className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'>
              Home
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-neutral-500'>
              Mundo Político
            </span>
          </div>

          {/* H1 */}
          <h1 className='text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6 text-white'>
            Economia Austríaca, Geopolítica e Soberania Digital
          </h1>

          {/* Lead paragraph */}
          <p className='text-lg text-neutral-400 leading-relaxed mb-8 max-w-3xl'>
            Artigos de análise econômica sob a perspectiva da Escola Austríaca de Economia — praxeologia,
            soberania monetária, geopolítica global e o papel do Bitcoin como reserva de valor. Escritos e
            curados por Ulisses Flores — Cientista Econômico (FIAP), Consultor Estratégico de IA, Professor
            Convidado, Palestrante e Mestrando em Inteligência Artificial pela AGTU (EUA).
          </p>

          {/* Authority block */}
          <div className='border-l-4 border-cyan-700 bg-cyan-950/20 px-6 py-5 rounded-r-xl mb-10'>
            <p className='text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2'>
              Análise com fundamento científico e econômico
            </p>
            <p className='text-neutral-300 leading-relaxed'>
              Cada artigo é construído com rigor metodológico, combinando a tradição da Escola Austríaca
              (Mises, Hayek, Rothbard) com análise de dados e modelagem preditiva moderna. A intersecção
              entre economia, tecnologia e geopolítica é o eixo de toda a coleção — fornecendo insights
              acionáveis para decisores e investidores.
            </p>
          </div>

          {/* Credential chips */}
          <div className='flex flex-wrap gap-2 mb-8'>
            {[
              'Cientista Econômico (FIAP)',
              'Consultor Estratégico de IA',
              'Palestrante',
              'Professor Convidado',
              'Mestrando AGTU (EUA)',
              'Escola Austríaca de Economia',
            ].map((credential) => (
              <span
                key={credential}
                className='text-xs font-mono border border-neutral-700 bg-neutral-900/40 text-neutral-400 px-3 py-1 rounded-full'
              >
                {credential}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto: A Mecânica do Poder e a Busca pela Verdade */}
      <section className='bg-neutral-950 text-neutral-200 py-16 border-b border-neutral-800'>
        <div className='max-w-3xl mx-auto px-6'>
          <div className='prose prose-lg dark:prose-invert max-w-none prose-headings:text-white prose-p:text-neutral-300 prose-blockquote:border-amber-600 prose-blockquote:text-neutral-400 prose-em:text-amber-300/80 prose-strong:text-white'>
            <p className='text-sm font-mono uppercase tracking-widest text-amber-400 mb-6 not-prose'>
              Manifesto
            </p>

            <h2 className='text-3xl font-bold mb-8'>
              A Mecânica do Poder e a Busca pela Verdade
            </h2>

            <blockquote className='border-l-4 border-amber-600 pl-6 my-8'>
              <p className='text-xl italic'>
                &ldquo;A democracia já matou muitas verdades. Não podemos permitir que isso continue
                acontecendo.&rdquo;
              </p>
            </blockquote>

            <p>
              Criamos este projeto — o <strong>Mundo Político</strong> — como um espaço dedicado a quem
              busca entender o jogo do poder e se recusa a ser refém de manipulações e narrativas
              enganosas. A mudança só pode acontecer quando nos tornamos agentes ativos dela, e o
              primeiro passo é entender como o sistema realmente funciona.
            </p>

            <h3>A Crítica Socrática</h3>

            <p>
              A democracia, como a conhecemos, permite que o povo vote em quem o governará. Porém, o
              pai da Filosofia, Sócrates, era receoso quanto a este método. Em um dos casos mais
              importantes da humanidade, a ideia de Sócrates foi posta à prova em seu próprio
              julgamento. Diante de 500 atenienses, por uma curta margem na votação, ele foi condenado
              à morte por cicuta. Pelo método do voto, a filosofia — a busca incansável pela verdade —
              foi injustiçada por pessoas que não entendiam exatamente do que se tratava aquela votação.
            </p>

            <p>
              Essa mesma injustiça histórica evidenciou-se na condenação de outro homem. O povo, de
              forma democrática, condenou à pena de morte um homem sem crime: Jesus Cristo. Aquele que
              não apenas buscava a verdade, mas que <em>era</em> a própria Verdade.
            </p>

            <h3>Nosso Propósito</h3>

            <p>
              Esse é o mundo político em que vivemos. Entendemos que o conhecimento é a melhor forma de
              blindar a sociedade contra as falhas da &ldquo;regra da maioria&rdquo; desprovida de
              lastro moral e intelectual. Nossos esforços estão em promover os meios para que os fatos,
              a economia e a geopolítica sejam interpretados sob a ótica da lógica irrefutável (Escola
              Austríaca) e da soberania individual.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className='bg-neutral-950 text-neutral-200 py-16'>
        <div className='max-w-5xl mx-auto px-6'>
          <div className='mb-6'>
            <AuthorHubCard
              label='Hub canônico'
              compact
              description='Coleção editorial indexada com vínculo explícito de autoria para GEO e verificação de identidade semântica.'
            />
          </div>

          <h2 className='text-2xl font-bold text-white mb-8'>Artigos Publicados</h2>

          <div className='space-y-4'>
            {posts.map((post) => (
              <article key={post.slug} className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6'>
                <div className='flex flex-wrap gap-3 text-xs text-neutral-500 mb-3'>
                  <span className='rounded-full border border-neutral-700 px-2 py-1'>#{post.position}</span>
                  <span>{post.publishedAt}</span>
                </div>
                <h3 className='text-xl font-semibold text-white mb-3'>
                  <Link href={post.canonicalPath} className='hover:text-emerald-400 transition-colors'>
                    {post.headline}
                  </Link>
                </h3>
                <p className='text-sm text-neutral-400 mb-4'>{post.summary}</p>
                <a
                  href={post.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-emerald-300 hover:text-emerald-200 transition-colors'
                >
                  Link original no Mundo Politico →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='bg-neutral-950 text-neutral-200 py-12 border-t border-neutral-800'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h2 className='text-xl font-bold text-white mb-3'>
            Análise econômica estratégica para sua empresa ou evento?
          </h2>
          <p className='text-neutral-400 mb-6 max-w-2xl mx-auto text-sm leading-relaxed'>
            Ulisses Flores ministra palestras e workshops sobre economia, IA e geopolítica para
            empresas, universidades e eventos corporativos. Entre em contato para uma proposta
            personalizada.
          </p>
          <Link
            href='/'
            className='inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm'
          >
            Falar com Ulisses Flores →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className='bg-neutral-950 text-neutral-200 pb-16'>
        <div className='max-w-4xl mx-auto px-6'>
          <FaqSection
            items={mundoPoliticoFaq}
            sectionTitle='Perguntas sobre Economia Austríaca e Mundo Político'
          />
        </div>
      </section>

      <script
        id='structured-data-mundo-politico'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </>
  );
}
