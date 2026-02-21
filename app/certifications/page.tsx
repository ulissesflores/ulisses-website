import type { Metadata } from 'next';
import Link from 'next/link';
import { knowledgeData } from '@/data/knowledge';
import { upkfMeta } from '@/data/generated/upkf.generated';

const providerOrder = ['Alura', 'Coursera', 'edX'] as const;
type CertificationItem = (typeof knowledgeData.certifications)[number];

function groupByProvider() {
  const groups = new Map<string, CertificationItem[]>();
  knowledgeData.certifications.forEach((certification) => {
    if (!groups.has(certification.provider)) {
      groups.set(certification.provider, []);
    }
    groups.get(certification.provider)?.push(certification);
  });

  providerOrder.forEach((provider) => {
    const certifications = groups.get(provider);
    if (certifications) {
      certifications.sort((a, b) => {
        const aPos = 'position' in a ? a.position || 0 : 0;
        const bPos = 'position' in b ? b.position || 0 : 0;
        if (aPos && bPos) {
          return aPos - bPos;
        }
        return a.name.localeCompare(b.name);
      });
    }
  });

  return providerOrder
    .map((provider) => ({ provider, certifications: groups.get(provider) || [] }))
    .filter((entry) => entry.certifications.length > 0);
}

export const metadata: Metadata = {
  title: 'Certifications and Credentials',
  description:
    'Index of certifications and credentials with canonical pages, verification links, and structured metadata.',
  alternates: {
    canonical: '/certifications',
  },
  openGraph: {
    type: 'website',
    url: `${upkfMeta.primaryWebsite}/certifications`,
    title: 'Certifications and Credentials',
    description:
      'Canonical directory of certifications (Alura, Coursera, edX) with individual verification pages.',
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
      'Canonical directory of certifications (Alura, Coursera, edX) with individual verification pages.',
    inLanguage: 'en',
    about: {
      '@id': `${upkfMeta.primaryWebsite}/#person`,
    },
    hasPart: knowledgeData.certifications.map((certification) => ({
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
            Diretório canônico de certificações com páginas dedicadas para cada credencial, verificação pública e metadados
            estruturados para indexação.
          </p>
        </header>

        <div className='space-y-10'>
          {providerGroups.map((group) => (
            <section key={group.provider} className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6'>
              <h2 className='text-2xl font-semibold text-white mb-4'>{group.provider}</h2>
              <div className='grid gap-4'>
                {group.certifications.map((certification) => (
                  <article key={certification.slug} className='rounded-lg border border-neutral-800 bg-neutral-950/60 p-4'>
                    <h3 className='text-lg font-semibold text-white mb-2'>
                      <Link href={certification.canonicalPath} className='hover:text-emerald-400 transition-colors'>
                        {certification.name}
                      </Link>
                    </h3>
                    <p className='text-sm text-neutral-400 mb-3'>{certification.summary}</p>
                    <div className='flex flex-wrap gap-3 text-xs'>
                      {certification.certId ? (
                        <span className='rounded-full border border-neutral-700 px-3 py-1 text-neutral-300'>{certification.certId}</span>
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
