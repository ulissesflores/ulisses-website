import { defaultLocale, isLocale } from '@/data/i18n';
import type { Locale } from '@/data/i18n';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicationCollections, publications, type PublicationCategory } from '@/data/publications';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';

const validCategories = Object.keys(publicationCollections) as PublicationCategory[];

interface PageProps {
  params: Promise<{ category: string; locale: string }>;
}

/* ── Per-category storytelling (SEO/GEO/LLM) ────────────────────── */
const categoryStory: Record<string, {
  h1: string;
  metaDescription: string;
  lead: string;
  authorityTitle: string;
  authorityBody: string;
  chips: string[];
  keywords: string[];
}> = {
  research: {
    h1: 'Pesquisa Científica Aplicada e Sistemas Complexos',
    metaDescription:
      'Publicações originais de Ulisses Flores em IA, Economia Austríaca e Sistemas Distribuídos. Rigor acadêmico Q1 com identificadores DOI.',
    lead:
      'A verdadeira inovação não nasce do hype corporativo, mas do rigor acadêmico validado por pares. Este repositório consolida décadas de pesquisa científica e modelagem analítica conduzidas por Ulisses Flores. Explorando a intersecção entre Inteligência Artificial, Resiliência Cibernética-Financeira e a Teoria dos Sistemas Complexos, cada publicação aqui listada (com registro DOI) representa uma contribuição documentada para o estado da arte da engenharia e da economia.',
    authorityTitle: 'Rigor de nível Q1 com rastreabilidade DOI',
    authorityBody:
      'Cada artigo segue padrões de publicação acadêmica internacional com revisão por pares, identificadores DOI e metodologia reprodutível — aplicados diretamente a projetos reais de consultoria, arquitetura de sistemas e pesquisa em IA.',
    chips: ['Consultor Estratégico de IA', 'Cientista de Dados', 'Mestrando AGTU (EUA)', 'Publicações com DOI', 'Sistemas Complexos'],
    keywords: ['pesquisa científica IA', 'sistemas complexos', 'resiliência cibernética', 'DOI', 'Ulisses Flores pesquisador'],
  },
  whitepapers: {
    h1: 'Whitepapers Técnicos e Arquitetura de Confiança Zero',
    metaDescription:
      'Documentação técnica de arquiteturas de hardware, criptografia e IoT. Incluindo o Projeto PSI (Hardware Wallet Nuclear-Grade) por Ulisses Flores.',
    lead:
      'A transição de conceitos teóricos para a engenharia de produção exige documentação irrefutável. Esta seção abriga Whitepapers técnicos que detalham arquiteturas de missão crítica, sistemas "Cloudless" e criptografia de estado-da-arte. É aqui que projetos de classe soberana — como a hardware wallet de grau nuclear (Projeto PSI) e soluções de Edge Computing (GoldenLeaf) — são expostos em seu nível mais profundo de abstração em silício e matemática.',
    authorityTitle: 'Engenharia documentada com precisão IEEE',
    authorityBody:
      'Cada whitepaper detalha arquiteturas reais com fundamentação em padrões NIST, IEEE e literatura de ponta em side-channel analysis, criptografia pós-quântica e materiais aeroespaciais.',
    chips: ['Arquiteto de Software', 'Desenvolvedor de Hardware', 'Consultor de IA', 'Mestrando AGTU (EUA)', 'Zero Trust', 'IoT Cloudless'],
    keywords: ['whitepapers técnicos', 'arquitetura zero trust', 'criptografia pós-quântica', 'IoT cloudless', 'Ulisses Flores engenharia'],
  },
  essays: {
    h1: 'Ensaios: Filosofia, Tecnologia e o Comportamento Humano',
    metaDescription:
      'Ensaios de Ulisses Flores explorando a intersecção entre tecnologia, teologia histórica, ética e as dinâmicas da ação humana.',
    lead:
      'A tecnologia, desprovida de lastro filosófico e histórico, torna-se uma ferramenta cega. Como um pesquisador polímata, as análises aqui reunidas transcendem o código e a matemática. Estes ensaios são reflexões profundas sobre a condição humana, a ética na era da hiper-vigilância, e como a teologia histórica e a filosofia moldam a nossa compreensão do poder, da liberdade e do futuro da sociedade.',
    authorityTitle: 'Reflexão interdisciplinar com rigor acadêmico',
    authorityBody:
      'Cada ensaio combina análise histórico-crítica, filosofia política e fundamentos teológicos, oferecendo uma perspectiva única que conecta humanidades clássicas ao impacto da tecnologia contemporânea.',
    chips: ['Pesquisador Polímata', 'Teologia Histórica', 'Filosofia Política', 'Mestrando AGTU (EUA)', 'Ética e Tecnologia'],
    keywords: ['ensaios filosofia tecnologia', 'teologia histórica', 'ética IA', 'Ulisses Flores ensaios', 'humanidades e tecnologia'],
  },
};

export function generateStaticParams() {
  return validCategories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, locale: rawLocale } = await params;

  if (!validCategories.includes(category as PublicationCategory)) {
    return { title: 'Categoria nao encontrada' };
  }

  const collection = publicationCollections[category as PublicationCategory];
  const story = categoryStory[category];

  return {
    title: story ? `${story.h1} | Ulisses Flores` : collection.heading,
    description: story?.metaDescription || collection.description,
    keywords: story?.keywords,
    authors: [
      {
        name: upkfMeta.publicDisplayName || upkfMeta.displayName,
        url: `${upkfMeta.primaryWebsite}/identidade`,
      },
    ],
    alternates: {
      canonical: `/${category}`,
    },
    openGraph: {
      type: 'website',
      title: story ? `${story.h1} | Ulisses Flores` : collection.heading,
      description: story?.metaDescription || collection.description,
      url: `${upkfMeta.primaryWebsite}/${category}`,
      locale: 'pt_BR',
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category, locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : defaultLocale) as Locale;

  if (!validCategories.includes(category as PublicationCategory)) {
    notFound();
  }

  const typedCategory = category as PublicationCategory;
  const collection = publicationCollections[typedCategory];
  const story = categoryStory[typedCategory];
  const categoryPublications = publications
    .filter((publication) => publication.category === typedCategory)
    .sort((a, b) => {
      if (a.date === b.date) {
        return a.ordinal - b.ordinal;
      }
      return Number(b.date) - Number(a.date);
    });

  const collectionUrl = `${upkfMeta.primaryWebsite}/${typedCategory}`;
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${collectionUrl}#collection`,
    name: story?.h1 || collection.heading,
    description: story?.metaDescription || collection.description,
    url: collectionUrl,
    inLanguage: locale,
    isPartOf: {
      '@id': `${upkfMeta.primaryWebsite}/#website`,
    },
    author: {
      '@type': 'Person',
      '@id': `${upkfMeta.primaryWebsite}/#person`,
      name: 'Carlos Ulisses Flores',
    },
    hasPart: categoryPublications.map((pub) => ({
      '@type': pub.kind === 'R' ? 'Report' : 'ScholarlyArticle',
      '@id': `${pub.canonicalUrl}#article`,
      name: pub.title,
      url: pub.canonicalUrl,
      datePublished: pub.publishedAt,
      keywords: pub.tags.join(', '),
    })),
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* ── Hero Section ── */}
      <section className='bg-neutral-950 text-neutral-200 pt-20 pb-16 border-b border-neutral-800'>
        <div className='max-w-4xl mx-auto px-6'>
          {/* Breadcrumb */}
          <div className='flex items-center gap-2 mb-6'>
            <Link href='/' className='text-xs font-mono uppercase tracking-widest text-emerald-400 hover:underline'>
              Home
            </Link>
            <span className='text-xs text-neutral-600'>→</span>
            <span className='text-xs font-mono uppercase tracking-widest text-neutral-500'>
              {collection.title}
            </span>
          </div>

          {/* H1 */}
          <h1 className='text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight'>
            {story?.h1 || collection.heading}
          </h1>

          {/* Lead paragraph */}
          <p className='text-lg text-neutral-400 leading-relaxed mb-8 max-w-3xl'>
            {story?.lead || collection.description}
          </p>

          {/* Authority block */}
          {story && (
            <div className='border-l-4 border-cyan-700 bg-cyan-950/20 px-6 py-5 rounded-r-xl mb-10'>
              <p className='text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-2'>
                {story.authorityTitle}
              </p>
              <p className='text-neutral-300 leading-relaxed'>
                {story.authorityBody}
              </p>
            </div>
          )}

          {/* Credential chips */}
          {story && (
            <div className='flex flex-wrap gap-2 mb-6'>
              {story.chips.map((chip) => (
                <span
                  key={chip}
                  className='text-xs font-mono border border-neutral-700 bg-neutral-900/40 text-neutral-400 px-3 py-1 rounded-full'
                >
                  {chip}
                </span>
              ))}
            </div>
          )}

          {/* Featured link for whitepapers → Projeto PSI */}
          {typedCategory === 'whitepapers' && (
            <div className='rounded-xl border border-cyan-800/40 bg-cyan-950/10 p-5 mt-4'>
              <p className='text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold mb-2'>Destaque</p>
              <Link
                href='/whitepapers/projeto-psi'
                className='text-lg font-bold text-white hover:text-cyan-300 transition-colors'
              >
                Projeto Ψ (PSI): Hardware Soberano e Zero Trust em Silício →
              </Link>
              <p className='text-sm text-neutral-500 mt-1'>
                Whitepaper completo: SRAM PUF, XMSS pós-quântico, TMR aeroespacial e Deniable Encryption.
              </p>
            </div>
          )}

          <div className='mt-6 max-w-xl'>
            <AuthorHubCard
              label='Hub canônico'
              compact
              description='Coleção vinculada à entidade mestra para SEO/GEO e validação de autoria.'
            />
          </div>
        </div>
      </section>

      {/* ── Publications Grid ── */}
      <main className='relative max-w-5xl mx-auto px-6 py-16 z-10'>
        <h2 className='text-2xl font-bold text-white mb-8'>
          {categoryPublications.length} Publicações
        </h2>

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
