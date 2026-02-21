import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { knowledgeData } from '@/data/knowledge';
import { upkfMeta } from '@/data/generated/upkf.generated';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return knowledgeData.certifications.map((certification) => ({
    slug: certification.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const certification = knowledgeData.certifications.find((item) => item.slug === slug);

  if (!certification) {
    return { title: 'Certification not found' };
  }

  return {
    title: `${certification.name} | ${certification.provider}`,
    description: certification.summary,
    alternates: {
      canonical: certification.canonicalPath,
    },
    openGraph: {
      type: 'article',
      url: `${upkfMeta.primaryWebsite}${certification.canonicalPath}`,
      title: `${certification.name} | ${certification.provider}`,
      description: certification.summary,
      publishedTime: certification.publishedAt,
    },
  };
}

export default async function CertificationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const certification = knowledgeData.certifications.find((item) => item.slug === slug);

  if (!certification) {
    notFound();
  }

  const issuerId = certification.issuerRef.startsWith('http')
    ? certification.issuerRef
    : certification.issuerRef.startsWith('#')
      ? `${upkfMeta.primaryWebsite}${certification.issuerRef}`
      : `${upkfMeta.primaryWebsite}/#${certification.issuerRef}`;

  const credentialJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    '@id': `${upkfMeta.primaryWebsite}${certification.canonicalPath}#credential`,
    name: certification.name,
    identifier: certification.certId || undefined,
    url: certification.verifyUrl,
    credentialCategory: 'Certification',
    datePublished: certification.publishedAt,
    recognizedBy: {
      '@id': issuerId,
      '@type': 'Organization',
      name: certification.provider,
    },
    about: {
      '@id': `${upkfMeta.primaryWebsite}/#person`,
    },
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <main className='max-w-3xl mx-auto px-6 py-20'>
        <Link href='/certifications' className='text-sm text-neutral-400 hover:text-emerald-400 transition-colors'>
          Voltar para Certifications
        </Link>

        <header className='mt-8 mb-10'>
          <p className='text-xs uppercase tracking-widest text-emerald-400 mb-3'>{certification.provider}</p>
          <h1 className='text-3xl md:text-4xl font-bold text-white mb-4'>{certification.name}</h1>
          <p className='text-neutral-400 leading-relaxed'>{certification.summary}</p>
        </header>

        <section className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 space-y-4'>
          <div>
            <p className='text-xs uppercase tracking-widest text-neutral-500 mb-1'>Provider</p>
            <p className='text-neutral-200'>{certification.provider}</p>
          </div>
          {certification.certId ? (
            <div>
              <p className='text-xs uppercase tracking-widest text-neutral-500 mb-1'>Certificate ID</p>
              <p className='text-neutral-200 font-mono break-all'>{certification.certId}</p>
            </div>
          ) : null}
          <div>
            <p className='text-xs uppercase tracking-widest text-neutral-500 mb-1'>Verification URL</p>
            <a
              href={certification.verifyUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-emerald-300 hover:text-emerald-200 break-all transition-colors'
            >
              {certification.verifyUrl}
            </a>
          </div>
          <p className='text-sm text-neutral-400'>
            Esta é a página canônica de referência para a credencial. O link de verificação acima aponta para a origem oficial.
          </p>
        </section>
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(credentialJsonLd) }} />
    </div>
  );
}
