import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { certificationsSotaData, getCertificationSotaBySlug } from '@/data/certifications-sota';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { AuthorHubCard } from '@/components/author-hub-card';
import { getDictionary } from '@/lib/get-dictionary';
import { isLocale, defaultLocale } from '@/data/i18n';
import type { Locale } from '@/data/i18n';

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export function generateStaticParams() {
  return certificationsSotaData.map((certification) => ({
    slug: certification.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const certification = getCertificationSotaBySlug(slug);

  if (!certification) {
    return { title: 'Certification not found' };
  }

  const description = certification.about || certification.problems_solved || certification.summary;

  return {
    title: `${certification.title} | ${certification.provider}`,
    description,
    authors: [
      {
        name: upkfMeta.publicDisplayName || upkfMeta.displayName,
        url: `${upkfMeta.primaryWebsite}/identidade`,
      },
    ],
    alternates: {
      canonical: certification.canonicalPath,
    },
    openGraph: {
      type: 'article',
      url: `${upkfMeta.primaryWebsite}${certification.canonicalPath}`,
      title: `${certification.title} | ${certification.provider}`,
      description,
      publishedTime: certification.publishedAt,
    },
  };
}

export default async function CertificationDetailPage({ params }: PageProps) {
  const { slug, locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const t = dict.certifications;
  const certification = getCertificationSotaBySlug(slug);

  if (!certification) {
    notFound();
  }

  const issuerId = certification.issuerRef.startsWith('http')
    ? certification.issuerRef
    : certification.issuerRef.startsWith('#')
      ? `${upkfMeta.primaryWebsite}${certification.issuerRef}`
      : `${upkfMeta.primaryWebsite}/#${certification.issuerRef}`;

  const credentialId = `${upkfMeta.primaryWebsite}${certification.canonicalPath}#credential`;
  const courseId = `${upkfMeta.primaryWebsite}${certification.canonicalPath}#course`;

  const certificationJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOccupationalCredential',
        '@id': credentialId,
        name: certification.title,
        identifier: certification.certId || undefined,
        url: `${upkfMeta.primaryWebsite}${certification.canonicalPath}`,
        sameAs: certification.verifyUrl,
        credentialCategory: 'Professional Certification',
        datePublished: certification.publishedAt,
        recognizedBy: {
          '@id': issuerId,
          '@type': 'Organization',
          name: certification.provider,
        },
        about: {
          '@id': `${upkfMeta.primaryWebsite}/#person`,
        },
      },
      {
        '@type': 'Course',
        '@id': courseId,
        name: certification.title,
        description: certification.about,
        provider: {
          '@id': issuerId,
          '@type': 'Organization',
          name: certification.provider,
        },
        inLanguage: locale,
        teaches: certification.skills,
        educationalCredentialAwarded: certification.title,
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          startDate: certification.publishedAt,
        },
        mainEntityOfPage: `${upkfMeta.primaryWebsite}${certification.canonicalPath}`,
      },
    ],
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <main className='max-w-3xl mx-auto px-6 py-20'>
        <Link href='/certifications' className='text-sm text-neutral-400 hover:text-emerald-400 transition-colors'>
          {t.detail.backLink}
        </Link>

        <header className='mt-8 mb-10'>
          <p className='text-xs uppercase tracking-widest text-emerald-400 mb-3'>{certification.provider}</p>
          <h1 className='text-3xl md:text-4xl font-bold text-white mb-4'>{certification.title}</h1>
          <p className='text-neutral-400 leading-relaxed'>{certification.about}</p>
          <div className='mt-4 max-w-xl'>
            <AuthorHubCard label={t.detail.author} compact />
          </div>
        </header>

        <section className='rounded-xl border border-neutral-800 bg-neutral-900/30 p-6 space-y-6'>
          <div>
            <p className='text-xs uppercase tracking-widest text-neutral-500 mb-1'>{t.detail.provider}</p>
            <p className='text-neutral-200'>{certification.provider}</p>
          </div>

          {certification.certId ? (
            <div>
              <p className='text-xs uppercase tracking-widest text-neutral-500 mb-1'>{t.detail.certId}</p>
              <p className='text-neutral-200 font-mono break-all'>{certification.certId}</p>
            </div>
          ) : null}

          <div>
            <p className='text-xs uppercase tracking-widest text-neutral-500 mb-2'>{t.grid.skillsAcquired}</p>
            <div className='flex flex-wrap gap-2'>
              {certification.skills.map((skill) => (
                <span key={skill} className='rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300'>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className='text-xs uppercase tracking-widest text-neutral-500 mb-1'>{t.grid.problemsSolved}</p>
            <p className='text-neutral-300'>{certification.problems_solved}</p>
          </div>

          <div>
            <p className='text-xs uppercase tracking-widest text-neutral-500 mb-1'>{t.grid.verifyUrl}</p>
            <a
              href={certification.verifyUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-emerald-300 hover:text-emerald-200 break-all transition-colors'
            >
              {certification.verifyUrl}
            </a>
          </div>
        </section>
      </main>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(certificationJsonLd) }} />
    </div>
  );
}
