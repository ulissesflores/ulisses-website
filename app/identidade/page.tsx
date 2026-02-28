import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { acervoClusters } from '@/data/acervo-teologico';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { publications } from '@/data/publications';
import { buildLanguageAlternates } from '@/data/seo';

const canonicalPath = '/identidade';
const ogImage = '/carlos-ulisses-flores-cto.jpg';
const pageTitle = 'Identidade Soberana | Hub Canônico';
const llmDescription =
  'Hub canônico de identidade soberana de Ulisses Flores com verificações públicas, produção acadêmica, acervo teológico, domínios e grafo semântico de autoridade.';

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

function normalizeForSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

const languageNames: Record<string, string> = {
  'pt-BR': 'Português',
  en: 'English',
  es: 'Español',
  he: 'עברית',
  it: 'Italiano',
};

export const metadata: Metadata = {
  title: pageTitle,
  description: llmDescription,
  alternates: {
    canonical: canonicalPath,
    languages: buildLanguageAlternates(canonicalPath),
  },
  openGraph: {
    type: 'profile',
    url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
    title: `${pageTitle} | Ulisses Flores`,
    description: llmDescription,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Ulisses Flores - Sovereign Identity Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${pageTitle} | Ulisses Flores`,
    description: llmDescription,
    images: [ogImage],
  },
  other: {
    'geo.region': 'BR-SP',
    'geo.placename': 'Sao Paulo',
  },
};

export default function IdentidadePage() {
  const publicJsonLd = loadPublicJsonLd();
  const publicIdentifiers = Array.isArray(upkfMeta.publicIdentifiers) ? upkfMeta.publicIdentifiers : [];
  const domainInventory = Array.isArray(upkfMeta.domainInventory) ? upkfMeta.domainInventory : [];
  const academicCredentials = Array.isArray(upkfMeta.academicCredentials)
    ? [...upkfMeta.academicCredentials].sort((a, b) => (a.position ?? 999) - (b.position ?? 999))
    : [];
  const softwareProjects = Array.isArray(upkfMeta.softwareProjects) ? upkfMeta.softwareProjects : [];
  const affiliations = Array.isArray(upkfMeta.affiliations) ? upkfMeta.affiliations : [];
  const occupations = Array.isArray(upkfMeta.occupations) ? upkfMeta.occupations : [];

  const heritage = upkfMeta.heritage || { publishPublic: false, clusters: [], synthesis: {} };
  const heritageClusters = Array.isArray(heritage.clusters) ? heritage.clusters : [];

  const identityStats = upkfMeta.identityHubStats || {
    orcidWorks: 40,
    certifications: 34,
    domains: 15,
    sermons: 56,
  };

  const findIdentifier = (matcher: string) =>
    publicIdentifiers.find((identifier) => normalizeForSearch(identifier.label).includes(normalizeForSearch(matcher)));

  const palau = findIdentifier('RNS.ID (Palau)');
  const gitcoin = findIdentifier('Gitcoin Passport');
  const keybase = findIdentifier('Keybase');
  const didIdentifier = findIdentifier('DID');

  const topPublications = [...publications]
    .sort((a, b) => {
      if (a.publishedAt === b.publishedAt) {
        return a.ordinal - b.ordinal;
      }
      return b.publishedAt.localeCompare(a.publishedAt);
    })
    .slice(0, 8);

  const statCards = [
    { label: 'ORCID Works', value: identityStats.orcidWorks, href: '/research' },
    { label: 'Certificações', value: identityStats.certifications, href: '/certifications' },
    { label: 'Domínios', value: identityStats.domains, href: '/identidade#dominios' },
    { label: 'Sermões', value: identityStats.sermons, href: '/acervo-teologico' },
  ];

  const hubLinks = [
    { label: 'Research', href: '/research' },
    { label: 'Whitepapers', href: '/whitepapers' },
    { label: 'Essays', href: '/essays' },
    { label: 'Certifications', href: '/certifications' },
    { label: 'Acervo Teológico', href: '/acervo-teologico' },
    { label: 'Mundo Político', href: '/mundo-politico' },
  ];

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${upkfMeta.primaryWebsite}${canonicalPath}#webpage`,
        url: `${upkfMeta.primaryWebsite}${canonicalPath}`,
        name: pageTitle,
        description: llmDescription,
        inLanguage: 'pt-BR',
        isPartOf: {
          '@id': `${upkfMeta.primaryWebsite}/#website`,
        },
        mainEntity: {
          '@id': `${upkfMeta.primaryWebsite}/#person`,
        },
        significantLink: hubLinks.map((entry) => `${upkfMeta.primaryWebsite}${entry.href}`),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${upkfMeta.primaryWebsite}${canonicalPath}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: upkfMeta.primaryWebsite,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Identidade',
            item: `${upkfMeta.primaryWebsite}${canonicalPath}`,
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${upkfMeta.primaryWebsite}${canonicalPath}#hub-links`,
        name: 'Hub Canônico de Conteúdo',
        itemListElement: hubLinks.map((entry, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: entry.label,
          url: `${upkfMeta.primaryWebsite}${entry.href}`,
        })),
      },
    ],
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-neutral-200'>
      <div className='fixed inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none' />
      <div className='fixed inset-0 bg-[radial-gradient(circle_900px_at_50%_-250px,#10b98112,transparent)] pointer-events-none' />

      <main className='relative max-w-6xl mx-auto px-6 pt-28 pb-20 space-y-10 z-10'>
        <header className='rounded-2xl border border-neutral-800 bg-neutral-900/45 p-8 md:p-10'>
          <div className='grid gap-8 md:grid-cols-[220px_1fr] items-start'>
            <div className='relative w-44 h-44 md:w-52 md:h-52 rounded-2xl overflow-hidden border border-neutral-700'>
              <Image
                src={ogImage}
                alt='Carlos Ulisses Flores'
                fill
                priority
                sizes='(max-width: 768px) 176px, 208px'
                className='object-cover'
              />
            </div>

            <div>
              <p className='text-xs uppercase tracking-[0.18em] text-emerald-300 mb-3'>Ground Truth Identity Node · UPKF v3.3</p>
              <h1 className='text-4xl md:text-5xl font-bold text-white mb-3'>{upkfMeta.publicDisplayName}</h1>
              <p className='text-neutral-300 text-lg'>Odysseus · Polymath Researcher · CTO · Sovereign Identity Architect</p>
              <p className='text-sm text-neutral-500 mt-4'>
                ORCID {upkfMeta.orcid} · Lattes {upkfMeta.lattesId} · {identityStats.orcidWorks} trabalhos ·{' '}
                {identityStats.certifications} certificações
              </p>

              <div className='mt-6 flex flex-wrap gap-2 text-xs'>
                {palau?.value ? (
                  <span className='rounded-full border border-emerald-700/40 bg-emerald-900/20 px-3 py-1 text-emerald-300'>
                    Palau ID {palau.value}
                  </span>
                ) : null}
                {gitcoin?.value ? (
                  <span className='rounded-full border border-cyan-700/40 bg-cyan-900/20 px-3 py-1 text-cyan-300'>
                    Gitcoin Passport {gitcoin.value}
                  </span>
                ) : null}
                {didIdentifier?.value ? (
                  <span className='rounded-full border border-violet-700/40 bg-violet-900/20 px-3 py-1 text-violet-300'>
                    {didIdentifier.value}
                  </span>
                ) : null}
                <span className='rounded-full border border-neutral-700 px-3 py-1 text-neutral-300'>
                  {upkfMeta.nationalities.join(' · ')}
                </span>
              </div>
            </div>
          </div>
        </header>

        <section className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6'>
          <h2 className='text-2xl font-semibold text-white mb-4'>Hub Canônico</h2>
          <p className='text-neutral-400 mb-5'>
            Malha principal para indexação em buscadores e LLMs. Esta página referencia os nós centrais do acervo e recebe links
            de todas as coleções estratégicas.
          </p>
          <div className='grid gap-3 md:grid-cols-3'>
            {hubLinks.map((entry) => (
              <Link
                key={entry.href}
                href={entry.href}
                className='rounded-lg border border-neutral-800 bg-neutral-950/70 px-4 py-3 text-sm text-neutral-200 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors'
              >
                {entry.label}
              </Link>
            ))}
          </div>
        </section>

        <section id='soberana' className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6'>
          <h2 className='text-2xl font-semibold text-white mb-4'>01 · Identidade Soberana e Verificações</h2>
          <div className='grid gap-4 md:grid-cols-3'>
            {[
              {
                title: 'RNS.ID (Palau)',
                value: palau?.value || 'N/A',
                description: palau?.notes || 'Credencial de residência digital nacional.',
                url: palau?.url || '#',
              },
              {
                title: 'Gitcoin Passport',
                value: gitcoin?.value || 'N/A',
                description: gitcoin?.notes || 'Score de resistência Sybil.',
                url: gitcoin?.url || '#',
              },
              {
                title: 'Keybase + PGP',
                value: keybase?.value || 'ul1ss3sfl0r3s',
                description: keybase?.notes || 'Prova criptográfica e chaves públicas.',
                url: keybase?.url || upkfMeta.sovereignIdentity?.keybaseUrl || '#',
              },
            ].map((item) => (
              <article key={item.title} className='rounded-xl border border-neutral-800 bg-neutral-950/70 p-4'>
                <p className='text-xs uppercase tracking-widest text-neutral-500 mb-2'>{item.title}</p>
                <p className='text-lg text-white font-semibold mb-2'>{item.value}</p>
                <p className='text-sm text-neutral-400 mb-3'>{item.description}</p>
                {item.url !== '#' ? (
                  <a href={item.url} target='_blank' rel='noopener noreferrer' className='text-sm text-emerald-300 hover:text-emerald-200'>
                    Verificar
                  </a>
                ) : null}
              </article>
            ))}
          </div>

          <div className='mt-6 overflow-x-auto'>
            <table className='w-full min-w-[760px] text-sm'>
              <thead className='text-left text-neutral-500'>
                <tr className='border-b border-neutral-800'>
                  <th className='py-2 pr-4'>Identificador</th>
                  <th className='py-2 pr-4'>Valor</th>
                  <th className='py-2 pr-4'>Verificação</th>
                  <th className='py-2'>Notas</th>
                </tr>
              </thead>
              <tbody>
                {publicIdentifiers.map((identifier) => (
                  <tr key={`${identifier.label}-${identifier.value}`} className='border-b border-neutral-900'>
                    <td className='py-2 pr-4 text-neutral-200'>{identifier.label}</td>
                    <td className='py-2 pr-4 font-mono text-xs text-neutral-400 break-all'>{identifier.value}</td>
                    <td className='py-2 pr-4'>
                      {identifier.url ? (
                        <a
                          href={identifier.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-emerald-300 hover:text-emerald-200 text-xs'
                        >
                          Abrir
                        </a>
                      ) : (
                        <span className='text-neutral-600 text-xs'>N/A</span>
                      )}
                    </td>
                    <td className='py-2 text-neutral-500 text-xs'>{identifier.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id='dominios' className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6'>
          <h2 className='text-2xl font-semibold text-white mb-4'>02 · Domínios Soberanos</h2>
          <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
            {domainInventory.map((domain) => {
              const category = String(domain.category || '').replace(/\*/g, '').trim();
              const isHub = normalizeForSearch(category).includes('hub');

              return (
                <a
                  key={domain.domain}
                  href={domain.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`rounded-lg border p-3 transition-colors ${
                    isHub
                      ? 'border-emerald-600/50 bg-emerald-900/10 hover:border-emerald-500'
                      : 'border-neutral-800 bg-neutral-950/70 hover:border-neutral-600'
                  }`}
                >
                  <p className='font-mono text-xs text-neutral-400 mb-1'>{category || 'Domain'}</p>
                  <p className='text-sm text-white mb-1'>{domain.domain}</p>
                  <p className='text-xs text-neutral-500'>{domain.purpose || 'Canonical property'}</p>
                </a>
              );
            })}
          </div>
        </section>

        <section className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6'>
          <h2 className='text-2xl font-semibold text-white mb-4'>03 · Presença Geográfica e Idiomas</h2>
          <div className='grid gap-6 md:grid-cols-2'>
            <article className='rounded-xl border border-neutral-800 bg-neutral-950/70 p-4'>
              <p className='text-xs uppercase tracking-widest text-neutral-500 mb-3'>Área de atuação</p>
              <ul className='space-y-2 text-sm text-neutral-300'>
                {upkfMeta.geographicallyServes.map((place) => (
                  <li key={place} className='border-b border-neutral-900 pb-2 last:border-0'>
                    {place}
                  </li>
                ))}
              </ul>
            </article>

            <article className='rounded-xl border border-neutral-800 bg-neutral-950/70 p-4'>
              <p className='text-xs uppercase tracking-widest text-neutral-500 mb-3'>Idiomas</p>
              <div className='grid grid-cols-2 gap-2'>
                {upkfMeta.languages.map((language) => (
                  <div key={language} className='rounded-md border border-neutral-800 px-3 py-2 text-sm text-neutral-300'>
                    {languageNames[language] || language}
                    <span className='ml-2 text-xs text-neutral-500'>({language})</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6'>
          <h2 className='text-2xl font-semibold text-white mb-4'>03½ · Herança e Linhagem</h2>
          {heritage.publishPublic ? (
            <>
              <div className='grid gap-4 md:grid-cols-3'>
                {heritageClusters.map((cluster) => (
                  <article key={cluster.cluster} className='rounded-xl border border-neutral-800 bg-neutral-950/70 p-4'>
                    <p className='text-xs uppercase tracking-widest text-neutral-500 mb-2'>{cluster.cluster}</p>
                    <h3 className='text-sm font-semibold text-white mb-2'>{cluster.title}</h3>
                    <p className='text-xs text-neutral-400 mb-2'>{cluster.keySurnames.join(', ')}</p>
                    <p className='text-xs text-neutral-500 mb-2'>{cluster.region}</p>
                    <p className='text-xs text-neutral-300'>{cluster.thesis}</p>
                  </article>
                ))}
              </div>
              <div className='mt-4 rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 text-sm text-neutral-300'>
                <p>{heritage.synthesis?.sephardicIdentity || ''}</p>
                <p className='mt-2'>{heritage.synthesis?.italianIdentity || ''}</p>
              </div>
            </>
          ) : (
            <p className='text-sm text-neutral-400'>Herança permanece privada no grafo público atual.</p>
          )}
        </section>

        <section id='academico' className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6'>
          <h2 className='text-2xl font-semibold text-white mb-4'>04 · Prova Acadêmica e Produção Científica</h2>

          <div className='grid gap-3 md:grid-cols-4 mb-6'>
            {statCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className='rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 text-center hover:border-emerald-500/40 transition-colors'
              >
                <p className='text-4xl font-bold text-white leading-none'>{card.value}</p>
                <p className='text-xs uppercase tracking-widest text-neutral-500 mt-2'>{card.label}</p>
              </Link>
            ))}
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            <article className='rounded-xl border border-neutral-800 bg-neutral-950/70 p-4'>
              <p className='text-xs uppercase tracking-widest text-neutral-500 mb-3'>Credenciais acadêmicas</p>
              <div className='space-y-3'>
                {academicCredentials.map((credential) => (
                  <div key={credential.schemaId} className='border-b border-neutral-900 pb-3 last:border-0'>
                    <p className='text-sm font-semibold text-white'>{credential.title}</p>
                    <p className='text-xs text-neutral-400'>
                      {credential.institution} · {credential.period || 'N/A'}
                    </p>
                    <p className='text-xs text-neutral-500'>
                      {credential.credentialCategory || credential.sourceType}
                      {credential.credentialStatus ? ` · ${credential.credentialStatus}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className='rounded-xl border border-neutral-800 bg-neutral-950/70 p-4'>
              <p className='text-xs uppercase tracking-widest text-neutral-500 mb-3'>Ocupações atuais</p>
              <div className='space-y-3'>
                {occupations.map((occupation) => (
                  <div key={occupation.schemaId} className='border-b border-neutral-900 pb-3 last:border-0'>
                    <p className='text-sm font-semibold text-white'>{occupation.title}</p>
                    <p className='text-xs text-neutral-400'>{occupation.location || 'N/A'}</p>
                    <p className='text-xs text-neutral-500'>{occupation.appliedSkills.join(', ')}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id='acervo' className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6'>
          <h2 className='text-2xl font-semibold text-white mb-4'>04½ · Acervo Científico e Teológico</h2>

          <h3 className='text-lg font-semibold text-white mb-3'>Repositórios citáveis (DOI)</h3>
          <div className='grid gap-3 md:grid-cols-3'>
            {softwareProjects.map((project) => (
              <article key={project.schemaId} className='rounded-xl border border-neutral-800 bg-neutral-950/70 p-4'>
                <p className='text-sm text-white font-semibold mb-2'>{project.slug}</p>
                <a
                  href={project.repo}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-xs text-emerald-300 hover:text-emerald-200 break-all'
                >
                  {project.repo}
                </a>
                <div className='mt-3 flex flex-wrap gap-1'>
                  {(project.releases as ReadonlyArray<{ doi?: string; version?: string }>).map((release, index) => {
                    const releaseKey = release.doi || release.version || `release-${index + 1}`;
                    return (
                      <span
                        key={`${project.schemaId}-${releaseKey}`}
                        className='rounded-full border border-neutral-700 px-2 py-1 text-[10px] text-neutral-400'
                      >
                        {release.doi || release.version || 'release'}
                      </span>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          <h3 className='text-lg font-semibold text-white mt-6 mb-3'>Publicações canônicas em destaque</h3>
          <div className='grid gap-2 md:grid-cols-2'>
            {topPublications.map((publication) => (
              <Link
                key={publication.id}
                href={`/${publication.category}/${publication.id}`}
                className='rounded-lg border border-neutral-800 bg-neutral-950/70 px-3 py-2 text-sm text-neutral-300 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors'
              >
                {publication.title}
              </Link>
            ))}
          </div>

          <h3 className='text-lg font-semibold text-white mt-6 mb-3'>Acervo teológico por nova classificação (5 clusters)</h3>
          <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
            {acervoClusters.map((cluster) => (
              <Link
                key={cluster.id}
                href={`/acervo-teologico#cluster-${cluster.id}`}
                className='rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 hover:border-emerald-500/40 transition-colors'
              >
                <p className='font-mono text-xs text-neutral-500 mb-2'>{cluster.id}</p>
                <p className='text-sm font-semibold text-white mb-2'>{cluster.seoTitle}</p>
                <p className='text-xs text-neutral-400'>{cluster.sermons.length} sermões classificados</p>
              </Link>
            ))}
          </div>
        </section>

        <section id='conhecimento' className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6'>
          <h2 className='text-2xl font-semibold text-white mb-4'>05 · Domínios de Conhecimento</h2>
          <div className='flex flex-wrap gap-2'>
            {upkfMeta.knowsAbout.map((topic) => (
              <span key={topic} className='rounded-full border border-neutral-700 bg-neutral-950/60 px-3 py-1 text-xs text-neutral-300'>
                {topic}
              </span>
            ))}
          </div>
        </section>

        <section id='firewall' className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6'>
          <h2 className='text-2xl font-semibold text-white mb-4'>06 · Firewall Semântico</h2>
          <div className='grid gap-3 md:grid-cols-2'>
            {Object.entries(upkfMeta.disambiguation).map(([lang, text]) => (
              <article key={lang} className='rounded-xl border border-neutral-800 bg-neutral-950/70 p-4'>
                <p className='text-xs uppercase tracking-widest text-neutral-500 mb-2'>{lang}</p>
                <p className='text-sm text-neutral-300 leading-relaxed'>{text}</p>
              </article>
            ))}
          </div>
          {Array.isArray(upkfMeta.notSameAs) && upkfMeta.notSameAs.length > 0 ? (
            <div className='mt-4 rounded-xl border border-red-900/40 bg-red-950/20 p-4'>
              <p className='text-xs uppercase tracking-widest text-red-300 mb-2'>notSameAs</p>
              <ul className='space-y-1 text-sm text-red-100/85'>
                {upkfMeta.notSameAs.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section id='organizacoes' className='rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6'>
          <h2 className='text-2xl font-semibold text-white mb-4'>07 · Organizações e Afiliações</h2>
          <div className='grid gap-3 md:grid-cols-2'>
            {affiliations.map((affiliation) => (
              <article key={affiliation.schemaId} className='rounded-xl border border-neutral-800 bg-neutral-950/70 p-4'>
                <p className='text-xs uppercase tracking-widest text-neutral-500 mb-1'>{affiliation.schemaType}</p>
                <p className='text-sm font-semibold text-white mb-1'>{affiliation.name}</p>
                <p className='text-xs text-neutral-400 mb-2'>{affiliation.legalName || affiliation.relation || 'Affiliation node'}</p>
                {affiliation.url ? (
                  <a
                    href={affiliation.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-xs text-emerald-300 hover:text-emerald-200 break-all'
                  >
                    {affiliation.url}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </main>

      <script
        id='structured-data-identidade-canonical'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(publicJsonLd) }}
      />
      <script
        id='structured-data-identidade-page'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </div>
  );
}
