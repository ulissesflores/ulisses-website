import type { Metadata } from 'next';
import Link from 'next/link';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { buildLanguageAlternates } from '@/data/seo';
import { AuthorHubCard } from '@/components/author-hub-card';

const canonicalPath = '/simulacoes';

export const metadata: Metadata = {
  title: 'Simulações | Laboratório de Cenários',
  description:
    'Hub de simulações e soluções experimentais com foco em cenários de IA, economia e sistemas complexos.',
  authors: [
    {
      name: upkfMeta.publicDisplayName || upkfMeta.displayName,
      url: `${upkfMeta.primaryWebsite}/identidade`,
    },
  ],
  alternates: {
    canonical: canonicalPath,
    languages: buildLanguageAlternates(canonicalPath),
  },
  openGraph: {
    type: 'website',
    url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
    title: 'Simulações | Laboratório de Cenários',
    description:
      'Acesso às simulações ativas do hub, incluindo a experiência scrollytelling RapadurIA 2027.',
  },
};

export default function SimulacoesPage() {
  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200 pt-20'>
      <main className='max-w-5xl mx-auto px-6 py-16'>
        <Link href='/' className='text-sm text-neutral-400 hover:text-emerald-300 transition-colors'>
          Voltar para Home
        </Link>

        <header className='mt-8 mb-12'>
          <p className='text-xs uppercase tracking-[0.18em] text-emerald-300 mb-3'>Simulações & Soluções</p>
          <h1 className='text-4xl font-bold text-white mb-3'>Laboratório de Simulações</h1>
          <p className='text-neutral-400 max-w-3xl leading-relaxed'>
            Espaço dedicado a projetos em execução com narrativa orientada a decisão. Cada simulação combina
            engenharia de interface, hipótese estratégica e visualização dinâmica de métricas.
          </p>
          <div className='mt-5 max-w-xl'>
            <AuthorHubCard
              label='Hub canônico'
              compact
              description='Simulações conectadas à identidade soberana para contexto autoral e indexação semântica.'
            />
          </div>
        </header>

        <section className='grid gap-6'>
          <article className='rounded-2xl border border-neutral-800 bg-neutral-900/40 p-7'>
            <p className='text-[11px] uppercase tracking-[0.2em] text-cyan-300 mb-2'>Projeto Ativo</p>
            <h2 className='text-2xl font-bold text-white mb-3'>RapadurIA 2027</h2>
            <p className='text-neutral-300 leading-relaxed mb-5'>
              Scrollytelling de cenário competitivo entre RapadurIA e DeepBregueço, com timeline interativa, KPIs por
              seção e finais ramificados completos no final da narrativa.
            </p>
            <Link
              href='/simulacoes/rapaduria-2027'
              className='inline-flex items-center gap-2 rounded-full border border-emerald-500/50 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-900/20 transition-colors'
            >
              Abrir simulação
            </Link>
          </article>
        </section>
      </main>
    </div>
  );
}
