import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { buildLanguageAlternates } from '@/data/seo';

const canonicalPath = '/identidade';
const llmDescription =
  'Perfil canônico de Ulisses Flores: Consultor de IA e Pesquisador Polímata. Autoridade verificada em sistemas complexos e economia austríaca.';
const ogImage = '/carlos-ulisses-flores-cto.jpg';

function loadPublicJsonLd() {
  try {
    const raw = readFileSync(join(process.cwd(), 'public', 'public.jsonld'), 'utf8');
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {
      '@context': 'https://schema.org',
      '@graph': [],
    };
  }
}

export const metadata: Metadata = {
  title: 'Identidade Soberana',
  description: llmDescription,
  alternates: {
    canonical: canonicalPath,
    languages: buildLanguageAlternates(canonicalPath),
  },
  openGraph: {
    type: 'profile',
    url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
    title: 'Identidade Soberana | Ulisses Flores',
    description: llmDescription,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Carlos Ulisses Flores - CTO profile',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Identidade Soberana | Ulisses Flores',
    description: llmDescription,
    images: [ogImage],
  },
};

export default function IdentidadePage() {
  const publicJsonLd = loadPublicJsonLd();
  const hasCredential = Array.isArray(upkfMeta.hasCredential) ? upkfMeta.hasCredential : [];
  const palauCredential = hasCredential.find((item) => String(item.name || '').toLowerCase().includes('palau'));
  const gitcoinCredential = hasCredential.find((item) => String(item.name || '').toLowerCase().includes('gitcoin'));
  const ethLimoUrl = upkfMeta.sameAs.find((url) => url.includes('.eth.limo'));

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <main className='max-w-6xl mx-auto px-6 py-20 space-y-10'>
        <header className='rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8 md:p-10'>
          <div className='grid gap-8 md:grid-cols-[220px_1fr] items-center'>
            <div className='relative w-44 h-44 md:w-52 md:h-52 rounded-2xl overflow-hidden border border-neutral-700'>
              <Image
                src='/carlos-ulisses-flores-cto.jpg'
                alt='Carlos Ulisses Flores, CTO e pesquisador'
                fill
                priority
                sizes='(max-width: 768px) 176px, 208px'
                className='object-cover'
              />
            </div>

            <div>
              <p className='text-xs uppercase tracking-[0.2em] text-emerald-300 mb-3'>Ground Truth Identity Node</p>
              <h1 className='text-4xl md:text-5xl font-bold text-white mb-3'>{upkfMeta.publicDisplayName}</h1>
              <p className='text-neutral-300 text-lg'>Odysseus & Sovereign Identity</p>
              <p className='text-sm text-neutral-500 mt-4'>ORCID {upkfMeta.orcid} · CTO da Codex Hash · 40 trabalhos e 34 certificações</p>
            </div>
          </div>
        </header>

        <section className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-8 space-y-4'>
          <h2 className='text-2xl font-semibold text-white'>Bio Semântica</h2>
          <p className='text-neutral-300 leading-relaxed'>
            Carlos Ulisses Flores atua há 28 anos entre finanças, engenharia de software e arquitetura de sistemas, conectando
            ciência econômica, inteligência artificial e governança de identidade digital soberana. Como CTO da Codex Hash, conduz
            pesquisa aplicada em sistemas complexos resilientes, agentes autônomos e infraestrutura Web3 auditável. Em paralelo, integra
            o mestrado em IA com investigação em Teologia Histórica, estruturando uma produção interdisciplinar que combina rigor técnico,
            densidade humanística e verificabilidade pública.
          </p>
          <p className='text-sm text-neutral-500'>Idiomas de autoridade: Português, English, Italiano, Español e Hebraico.</p>
        </section>

        <section className='grid gap-6 md:grid-cols-3'>
          <article className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 space-y-4'>
            <h3 className='text-xl font-semibold text-white'>Consultoria & Palestras</h3>
            <p className='text-sm text-neutral-300'>
              Estratégia executiva em IA, arquitetura de agentes e resiliência organizacional com foco regional em Itupeva, Jundiaí,
              Campinas e São Paulo.
            </p>
            <Link href='mailto:contato@codexhash.com' className='text-emerald-300 hover:text-emerald-200 transition-colors text-sm'>
              Solicitar agenda executiva
            </Link>
          </article>

          <article className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 space-y-4'>
            <h3 className='text-xl font-semibold text-white'>Identidade Web3</h3>
            <ul className='space-y-2 text-sm'>
              {palauCredential?.url ? (
                <li>
                  <a href={palauCredential.url} target='_blank' rel='noopener noreferrer' className='text-emerald-300 hover:text-emerald-200'>
                    Palau ID ({palauCredential.identifier})
                  </a>
                </li>
              ) : null}
              {gitcoinCredential?.url ? (
                <li>
                  <a href={gitcoinCredential.url} target='_blank' rel='noopener noreferrer' className='text-emerald-300 hover:text-emerald-200'>
                    Gitcoin Passport ({gitcoinCredential.identifier})
                  </a>
                </li>
              ) : null}
              {upkfMeta.sovereignIdentity?.keybaseUrl ? (
                <li>
                  <a
                    href={upkfMeta.sovereignIdentity.keybaseUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-emerald-300 hover:text-emerald-200'
                  >
                    Keybase
                  </a>
                </li>
              ) : null}
              {ethLimoUrl ? (
                <li>
                  <a href={ethLimoUrl} target='_blank' rel='noopener noreferrer' className='text-emerald-300 hover:text-emerald-200'>
                    ETH Limo
                  </a>
                </li>
              ) : null}
            </ul>
          </article>

          <article className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 space-y-4'>
            <h3 className='text-xl font-semibold text-white'>Research</h3>
            <p className='text-sm text-neutral-300'>Produção científica canônica, credenciais verificáveis e acervo teológico estruturado para GEO.</p>
            <div className='flex flex-col gap-2 text-sm'>
              <a
                href={`https://orcid.org/${upkfMeta.orcid}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-emerald-300 hover:text-emerald-200'
              >
                ORCID
              </a>
              <Link href='/acervo-teologico' className='text-emerald-300 hover:text-emerald-200'>
                Acervo Teológico
              </Link>
            </div>
          </article>
        </section>
      </main>

      <script id='structured-data-identidade' type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(publicJsonLd) }} />
    </div>
  );
}
