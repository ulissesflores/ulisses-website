import type { Metadata } from 'next';
import Link from 'next/link';
import { certificationsSotaData } from '@/data/certifications-sota';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { buildLanguageAlternates } from '@/data/seo';

const providerOrder = ['Alura', 'Coursera', 'edX'] as const;
type CertificationItem = (typeof certificationsSotaData)[number];

function groupByProvider() {
  const groups = new Map<string, CertificationItem[]>();

  certificationsSotaData.forEach((certification) => {
    if (!groups.has(certification.provider)) {
      groups.set(certification.provider, []);
    }
    groups.get(certification.provider)?.push(certification);
  });

  groups.forEach((certifications) => {
    certifications.sort((a, b) => {
      const aPos = 'position' in a ? a.position || Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
      const bPos = 'position' in b ? b.position || Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
      if (aPos !== bPos) {
        return aPos - bPos;
      }
      return a.name.localeCompare(b.name);
    });
  });

  const providerRank = new Map<string, number>(providerOrder.map((provider, index) => [provider, index]));

  return Array.from(groups.entries())
    .map(([provider, certifications]) => ({ provider, certifications }))
    .sort((a, b) => {
      const rankA = providerRank.get(a.provider) ?? Number.MAX_SAFE_INTEGER;
      const rankB = providerRank.get(b.provider) ?? Number.MAX_SAFE_INTEGER;
      if (rankA !== rankB) {
        return rankA - rankB;
      }
      return a.provider.localeCompare(b.provider);
    });
}

export const metadata: Metadata = {
  title: 'Certifications and Credentials',
  description:
    'Indice canonico de certificacoes com contextualizacao tecnica, habilidades adquiridas, problemas resolvidos e verificacao publica.',
  alternates: {
    canonical: '/certifications',
    languages: buildLanguageAlternates('/certifications'),
  },
  openGraph: {
    type: 'website',
    url: `${upkfMeta.primaryWebsite}/certifications`,
    title: 'Certifications and Credentials',
    description:
      'Diretorio canonico de credenciais com paginas individuais, copy enriquecida e dados estruturados para indexacao semantica.',
  },
};

export default function CertificationsPage() {
  const providerGroups = groupByProvider();

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${upkfMeta.primaryWebsite}/certifications#collection`,
    url: `${upkfMeta.primaryWebsite}/certifications`,
    name: 'Certifications and Credentials',
    description:
      'Diretorio canonico de credenciais com paginas individuais, copy enriquecida e dados estruturados para indexacao semantica.',
    inLanguage: 'pt-BR',
    about: {
      '@id': `${upkfMeta.primaryWebsite}/#person`,
    },
    hasPart: certificationsSotaData.map((certification) => ({
      '@id': `${upkfMeta.primaryWebsite}${certification.canonicalPath}`,
    })),
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <main className='max-w-5xl mx-auto px-6 py-20'>
        <Link href='/' className='text-sm text-neutral-400 hover:text-emerald-400 transition-colors'>
          Voltar para Home
        </Link>

        <header className='mt-8 mb-10'>
          <p className='text-xs uppercase tracking-widest text-emerald-400 mb-3'>Certifications</p>
          <h1 className='text-4xl font-bold text-white mb-4'>Certifications and Credentials</h1>
          <p className='text-neutral-400 leading-relaxed max-w-3xl'>
            Diretorio canonico de certificacoes com contexto tecnico, habilidades adquiridas, problemas resolvidos e
            verificacao publica para cada credencial.
          </p>
        </header>

        <div className='space-y-10'>
          {providerGroups.map((group) => (
            <section key={group.provider} className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6'>
              <h2 className='text-2xl font-semibold text-white mb-4'>{group.provider}</h2>
              <div className='grid gap-4'>
                {group.certifications.map((certification) => (
                  <article key={certification.slug} className='rounded-lg border border-neutral-800 bg-neutral-950/60 p-5'>
                    <h3 className='text-lg font-semibold text-white mb-2'>
                      <Link href={certification.canonicalPath} className='hover:text-emerald-400 transition-colors'>
                        {certification.title}
                      </Link>
                    </h3>
                    <p className='text-sm text-neutral-400 mb-3'>{certification.summary}</p>
                    <p className='text-sm text-neutral-300 mb-4'>{certification.about}</p>

                    <div className='mb-4'>
                      <p className='text-xs uppercase tracking-widest text-neutral-500 mb-2'>Habilidades adquiridas</p>
                      <div className='flex flex-wrap gap-2'>
                        {certification.skills.map((skill) => (
                          <span key={skill} className='rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300'>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className='mb-4'>
                      <p className='text-xs uppercase tracking-widest text-neutral-500 mb-2'>Problemas enfrentados</p>
                      <p className='text-sm text-neutral-300'>{certification.problems_solved}</p>
                    </div>

                    <div className='flex flex-wrap gap-3 text-xs'>
                      {certification.certId ? (
                        <span className='rounded-full border border-neutral-700 px-3 py-1 text-neutral-300'>
                          {certification.certId}
                        </span>
                      ) : null}
                      <a
                        href={certification.verifyUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='rounded-full border border-emerald-700/40 bg-emerald-900/20 px-3 py-1 text-emerald-300 hover:bg-emerald-900/40 transition-colors'
                      >
                        Verify URL
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </div>
  );
}
