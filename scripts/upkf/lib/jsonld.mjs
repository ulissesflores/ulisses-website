import path from 'node:path';
import { CATEGORY_METADATA } from './constants.mjs';
import { formatDateWithTimezone, slugify } from './text.mjs';

function buildAreaServedJsonLd() {
  const regions = [
    { country: 'Brasil', code: 'BR', cities: [
      { name: 'São Paulo', lat: -23.5505, lng: -46.6333 },
      { name: 'Jundiaí', lat: -23.1857, lng: -46.8978 },
      { name: 'Campinas', lat: -22.9099, lng: -47.0626 },
      { name: 'Itupeva', lat: -23.1530, lng: -47.0578 },
    ]},
    { country: 'El Salvador', code: 'SV', cities: [
      { name: 'San Salvador', lat: 13.6929, lng: -89.2182 },
    ]},
    { country: 'Itália', code: 'IT', cities: [
      { name: 'Roma', lat: 41.9028, lng: 12.4964 },
    ]},
    { country: 'Israel', code: 'IL', cities: [
      { name: 'Tel Aviv', lat: 32.0853, lng: 34.7818 },
    ]},
    { country: 'Estados Unidos', code: 'US', cities: [
      { name: 'Houston', lat: 29.7604, lng: -95.3698 },
      { name: 'Dallas', lat: 32.7767, lng: -96.7970 },
      { name: 'San Antonio', lat: 29.4241, lng: -98.4936 },
      { name: 'Frisco', lat: 33.1507, lng: -96.8236 },
      { name: 'Plano', lat: 33.0198, lng: -96.6989 },
      { name: 'Highland Park', lat: 32.8335, lng: -96.7920 },
    ]},
  ];
  return regions.flatMap((region) =>
    region.cities.map((city) => ({
      '@type': 'Place',
      name: `${city.name}, ${region.country}`,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: city.lat,
        longitude: city.lng,
      },
      address: {
        '@type': 'PostalAddress',
        addressCountry: region.code,
        addressLocality: city.name,
      },
    })),
  );
}

export function buildUrlInventory(upkfText, publications, websiteUrl, knowledgeData) {
  const directMatches = Array.from(
    upkfText.matchAll(/https?:\/\/(?:www\.)?ulissesflores\.com[^\s)\]"']*/g),
  ).map((match) => match[0]);

  const normalized = new Set();
  const add = (url) => {
    try {
      const parsed = new URL(url, websiteUrl);
      if (!/ulissesflores\.com$/i.test(parsed.hostname)) {
        return;
      }
      normalized.add(
        `${parsed.origin}${parsed.pathname}${parsed.search}${parsed.hash}`.replace(/\/$/, '') ||
          parsed.origin,
      );
    } catch {
      // ignore malformed links
    }
  };

  directMatches.forEach(add);
  add(`${websiteUrl}/`);
  add(`${websiteUrl}/#codexhash`);

  Object.keys(CATEGORY_METADATA).forEach((category) => add(`${websiteUrl}/${category}`));
  publications.forEach((publication) => {
    add(publication.canonicalUrl);
    add(`${websiteUrl}${publication.downloadUrl}`);
    if (publication.primaryPdfUrl) {
      add(`${websiteUrl}${publication.primaryPdfUrl}`);
    }
    if (publication.legacyPdfUrl) {
      add(`${websiteUrl}${publication.legacyPdfUrl}`);
    }
    if (publication.mdUrl) {
      add(`${websiteUrl}${publication.mdUrl}`);
    }
    if (publication.docxUrl) {
      add(`${websiteUrl}${publication.docxUrl}`);
    }
  });
  add(`${websiteUrl}/certifications`);
  add(`${websiteUrl}/identidade`);
  add(`${websiteUrl}/sermons`);
  add(`${websiteUrl}/acervo-teologico`);
  add(`${websiteUrl}/mundo-politico`);
  add(`${websiteUrl}/feed.xml`);
  add(`${websiteUrl}/sitemap-resources.xml`);
  add(`${websiteUrl}/llms.txt`);
  add(`${websiteUrl}/llms-full.txt`);
  add(`${websiteUrl}/doi/manifest.json`);

  if (knowledgeData) {
    knowledgeData.certifications.forEach((certification) => add(`${websiteUrl}${certification.canonicalPath}`));
    knowledgeData.blog.posts.forEach((post) => add(`${websiteUrl}${post.canonicalPath}`));
    knowledgeData.sermons.collections.forEach((collection) => {
      add(`${websiteUrl}${collection.canonicalPath}`);
      collection.items.forEach((item) => add(`${websiteUrl}${item.canonicalPath}`));
    });
  }

  const urls = Array.from(normalized).sort();
  const grouped = {
    root: urls.filter((url) => new URL(url).pathname === '/'),
    collections: urls.filter((url) => {
      const pathname = new URL(url).pathname.replace(/^\//, '');
      return (
        Object.prototype.hasOwnProperty.call(CATEGORY_METADATA, pathname) ||
        ['certifications', 'sermons', 'mundo-politico'].includes(pathname)
      );
    }),
    items: urls.filter((url) => {
      const pathname = new URL(url).pathname;
      if (pathname.endsWith('.pdf')) {
        return false;
      }
      const segments = pathname.split('/').filter(Boolean);
      const first = segments[0];
      if (segments.length === 2) {
        return (
          Object.prototype.hasOwnProperty.call(CATEGORY_METADATA, first) ||
          first === 'certifications' ||
          first === 'mundo-politico' ||
          first === 'sermons'
        );
      }
      return segments.length === 3 && first === 'sermons';
    }),
    assets: urls.filter((url) => new URL(url).pathname.endsWith('.pdf')),
    anchors: urls.filter((url) => new URL(url).hash),
  };

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      all: urls.length,
      collections: grouped.collections.length,
      items: grouped.items.length,
      assets: grouped.assets.length,
      anchors: grouped.anchors.length,
    },
    grouped,
    urls,
  };
}

export function buildCoreSiteJsonLd(identity, organization, frontmatter) {
  const siteUrl = identity.primaryWebsite || 'https://ulissesflores.com';
  const publicIdentifiers = Array.isArray(identity.publicIdentifiers) ? identity.publicIdentifiers : [];
  const personIdentifier = [];
  const personIdentifierDedup = new Set();

  const pushIdentifier = (property) => {
    if (!property || !property.propertyID || !property.value) {
      return;
    }
    const dedupKey = `${property.propertyID}|${property.value}`;
    if (personIdentifierDedup.has(dedupKey)) {
      return;
    }
    personIdentifierDedup.add(dedupKey);
    personIdentifier.push(property);
  };

  publicIdentifiers.forEach((identifier) => {
    pushIdentifier({
      '@type': 'PropertyValue',
      propertyID: identifier.label,
      value: identifier.value,
      url: identifier.url && identifier.url.startsWith('http') ? identifier.url : undefined,
      description: identifier.notes || undefined,
    });
  });

  pushIdentifier(
    identity.orcid
      ? {
          '@type': 'PropertyValue',
          propertyID: 'ORCID',
          value: identity.orcid,
          url: `https://orcid.org/${identity.orcid}`,
        }
      : null,
  );
  pushIdentifier(
    identity.lattesId
      ? {
          '@type': 'PropertyValue',
          propertyID: 'Lattes',
          value: identity.lattesId,
          url: `http://lattes.cnpq.br/${identity.lattesId}`,
        }
      : null,
  );

  // Web credentials (Gitcoin, Palau, etc.) — recognizedBy must point to an Organization,
  // not a Person. Since these are self-sovereign credentials without a traditional issuing
  // institution, we omit recognizedBy and keep only the about reference.
  const webCredentialNodes = (identity.hasCredential || []).map((credential) => ({
    ...credential,
    about: {
      '@id': `${siteUrl}/#person`,
    },
  }));

  const institutionNodes = [];
  const institutionNodeIds = new Set();

  const academicCredentialNodes = (identity.academicCredentials || [])
    .map((credential) => {
      const institutionId = normalizeLocalAnchorId(
        siteUrl,
        credential.institutionRef || `#institution-${slugify(credential.institution || credential.title)}`,
        `institution-${slugify(credential.institution || credential.title)}`,
      );

      if (credential.institution && !institutionNodeIds.has(institutionId)) {
        institutionNodeIds.add(institutionId);
        institutionNodes.push({
          '@id': institutionId,
          '@type': 'CollegeOrUniversity',
          name: credential.institution,
          url: credential.institutionUrl || undefined,
          sameAs: credential.institutionSameAs || undefined,
        });
      }

      const credentialProperties = [
        credential.credentialStatus
          ? {
              '@type': 'PropertyValue',
              propertyID: 'credentialStatus',
              value: credential.credentialStatus,
            }
          : null,
        credential.period
          ? {
              '@type': 'PropertyValue',
              propertyID: 'period',
              value: credential.period,
            }
          : null,
        credential.skills && credential.skills.length > 0
          ? {
              '@type': 'PropertyValue',
              propertyID: 'skills',
              value: credential.skills.join(', '),
            }
          : null,
      ].filter(Boolean);

      const thesisLanguages = Object.entries(credential.thesisTitle || {}).map(([lang, value]) => ({
        '@value': value,
        '@language': lang,
      }));

      return {
        '@id': normalizeLocalAnchorId(siteUrl, credential.schemaId, `credential-${slugify(credential.title)}`),
        '@type': 'EducationalOccupationalCredential',
        name: credential.title,
        credentialCategory: credential.credentialCategory || undefined,
        educationalLevel: credential.credentialCategory || undefined,
        recognizedBy: credential.institution
          ? {
              '@id': institutionId,
            }
          : undefined,
        about: {
          '@id': `${siteUrl}/#person`,
        },
        url: credential.institutionUrl || undefined,
        description:
          credential.thesisTitle?.en ||
          credential.thesisTitle?.['pt-BR'] ||
          credential.thesisTitle?.es ||
          undefined,
        identifier: credential.period
          ? {
              '@type': 'PropertyValue',
              propertyID: 'Period',
              value: credential.period,
            }
          : undefined,
        additionalProperty: credentialProperties.length > 0 ? credentialProperties : undefined,
        alternateName: thesisLanguages.length > 0 ? thesisLanguages : undefined,
      };
    })
    .filter((credential) => credential['@id'] && credential.name);

  const credentialNodes = [...webCredentialNodes, ...academicCredentialNodes];

  const occupationNodes = (identity.occupations || []).map((occupation) => ({
    '@id': normalizeLocalAnchorId(siteUrl, occupation.schemaId, `occupation-${slugify(occupation.title)}`),
    '@type': occupation.schemaType || 'Occupation',
    name: occupation.title,
    description:
      occupation.appliedSkills && occupation.appliedSkills.length > 0
        ? `Applied skills: ${occupation.appliedSkills.join(', ')}.`
        : undefined,
    skills:
      occupation.appliedSkills && occupation.appliedSkills.length > 0 ? occupation.appliedSkills.join(', ') : undefined,
    // occupationalLocation removed: not a valid Schema.org property for Occupation.
    // Location context is represented via workLocation on the Person node.
    estimatedSalary: undefined,
  }));

  const geographicPlaces = (identity.geographicallyServes || []).map((place) => ({
    '@type': 'Place',
    name: place,
  }));
  const domainInventoryNodes = (identity.domainInventory || []).map((domain) => ({
    '@id': `${siteUrl}/#domain-${slugify(domain.domain)}`,
    '@type': 'WebSite',
    name: domain.domain,
    url: domain.url,
    description: `${domain.category}${domain.purpose ? ` — ${domain.purpose}` : ''}`,
  }));
  const sameAs = Array.from(
    new Set(
      [
        ...(identity.sameAs || []),
        identity.sovereignIdentity?.keybaseUrl || '',
        identity.sovereignIdentity?.gravatarUrl || '',
        identity.sovereignIdentity?.ethLimoUrl || '',
      ].filter(Boolean),
    ),
  );

  const affiliationNodes = [];
  const affiliationNodeIds = new Set();
  const protectedAffiliationIds = new Set([`${siteUrl}/#codexhash`, `${siteUrl}/#codexhash-research`]);

  (identity.affiliations || []).forEach((affiliation) => {
    const affiliationId = normalizeLocalAnchorId(
      siteUrl,
      affiliation.schemaId,
      `organization-${slugify(affiliation.name || 'affiliation')}`,
    );

    if (protectedAffiliationIds.has(affiliationId) || affiliationNodeIds.has(affiliationId)) {
      return;
    }
    affiliationNodeIds.add(affiliationId);

    affiliationNodes.push({
      '@id': affiliationId,
      '@type': affiliation.schemaType || 'Organization',
      name: affiliation.name,
      legalName: affiliation.legalName || undefined,
      alternateName: affiliation.alternateNames && affiliation.alternateNames.length > 0 ? affiliation.alternateNames : undefined,
      url: affiliation.url || undefined,
      sameAs: affiliation.sameAs && affiliation.sameAs.length > 0 ? affiliation.sameAs : undefined,
      parentOrganization: affiliation.parentOrganizationRef
        ? {
            '@id': normalizeLocalAnchorId(
              siteUrl,
              affiliation.parentOrganizationRef,
              `organization-${slugify(affiliation.name || 'parent')}`,
            ),
          }
        : undefined,
      description:
        affiliation.description?.['pt-BR'] || affiliation.description?.en || affiliation.relation || undefined,
    });
  });

  const affiliationRefs = Array.from(
    new Set([
      `${siteUrl}/#codexhash`,
      ...affiliationNodes.map((node) => node['@id']),
    ]),
  ).map((id) => ({ '@id': id }));

  const alumniOfRefs = institutionNodes.map((node) => ({ '@id': node['@id'] })).filter((node) => node['@id']);

  const languageLabelByCode = {
    'pt-BR': 'Portuguese',
    en: 'English',
    es: 'Spanish',
    he: 'Hebrew',
    it: 'Italian',
  };

  const knowsLanguage = (identity.languages || []).map((code) => ({
    '@type': 'Language',
    name: languageLabelByCode[code] || code,
    alternateName: code,
  }));

  const heritageProperties =
    identity.heritage?.publishPublic && Array.isArray(identity.heritage.clusters)
      ? [
          ...identity.heritage.clusters.map((cluster) => ({
            '@type': 'PropertyValue',
            propertyID: `heritage:${slugify(cluster.cluster || cluster.title || 'cluster')}`,
            name: cluster.title,
            value: [
              cluster.keySurnames && cluster.keySurnames.length > 0 ? cluster.keySurnames.join(', ') : '',
              cluster.region || '',
              cluster.probabilityScore ? `probability ${cluster.probabilityScore}` : '',
              cluster.thesis || '',
            ]
              .filter(Boolean)
              .join(' — '),
          })),
          identity.heritage?.synthesis?.sephardicIdentity
            ? {
                '@type': 'PropertyValue',
                propertyID: 'heritage:synthesis-sephardic',
                value: identity.heritage.synthesis.sephardicIdentity,
              }
            : null,
          identity.heritage?.synthesis?.italianIdentity
            ? {
                '@type': 'PropertyValue',
                propertyID: 'heritage:synthesis-italian',
                value: identity.heritage.synthesis.italianIdentity,
              }
            : null,
        ].filter(Boolean)
      : [];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@id': `${siteUrl}/#website`,
        '@type': 'WebSite',
        name: frontmatter.title || 'Ulisses Flores',
        url: siteUrl,
        inLanguage: frontmatter.languages || ['pt-BR'],
      },
      {
        '@id': `${siteUrl}/#person`,
        '@type': 'Person',
        name: identity.publicDisplayName || identity.canonicalName,
        alternateName: identity.alternateNames,
        givenName: identity.preferredName,
        birthDate: identity.birthYear ? `${identity.birthYear}` : undefined,
        url: siteUrl,
        sameAs,
        jobTitle: identity.jobTitle || [],
        knowsAbout: identity.knowsAbout || [],
        knowsLanguage: knowsLanguage.length > 0 ? knowsLanguage : undefined,
        nationality: identity.nationalities || [],
        hasCredential: credentialNodes.map((credential) => ({ '@id': credential['@id'] })),
        hasOccupation: occupationNodes.map((occupation) => ({ '@id': occupation['@id'] })),
        memberOf: affiliationRefs.length > 0 ? affiliationRefs : undefined,
        alumniOf: alumniOfRefs.length > 0 ? alumniOfRefs : undefined,
        affiliation: affiliationRefs.length > 0 ? affiliationRefs : undefined,
        // areaServed/geographicallyServes removed: not valid Schema.org properties for Person.
        // workLocation represents where the person operates professionally.
        workLocation: geographicPlaces.length > 0 ? geographicPlaces : undefined,
        disambiguatingDescription: identity.disambiguation.en || identity.disambiguation['pt-BR'] || '',
        description: identity.description['pt-BR'] || '',
        identifier: personIdentifier.length > 0 ? personIdentifier : undefined,
        additionalProperty: [
          ...identity.notSameAs.map((item) => ({
            '@type': 'PropertyValue',
            propertyID: 'notSameAs',
            value: item,
          })),
          {
            '@type': 'PropertyValue',
              propertyID: 'geographicallyServes',
              value: (identity.geographicallyServes || []).join(', '),
            },
          ...heritageProperties,
        ],
        worksFor: {
          '@id': `${siteUrl}/#codexhash`,
        },
      },
      {
        '@id': `${siteUrl}/#codexhash`,
        '@type': 'Organization',
        name: 'Codex Hash',
        legalName: organization.legalName || 'CODEX HASH LTDA',
        identifier: organization.cnpj
          ? {
              '@type': 'PropertyValue',
              propertyID: 'CNPJ',
              value: organization.cnpj,
            }
          : undefined,
        foundingDate: organization.foundingDate || undefined,
        url: organization.url || 'https://codexhash.com',
        email: organization.email || undefined,
        address: organization.address
          ? {
              '@type': 'PostalAddress',
              streetAddress: organization.address,
              addressLocality: organization.addressLocality || 'São Paulo',
              postalCode: organization.postalCode || '04061-003',
              addressCountry: {
                '@type': 'Country',
                name: 'BR',
              },
            }
          : undefined,
        description: organization.description['pt-BR'] || '',
        areaServed: buildAreaServedJsonLd(),
        knowsLanguage: ['pt-BR', 'en', 'es', 'it', 'he'],
      },
      {
        '@id': `${siteUrl}/#codexhash-research`,
        '@type': 'Organization',
        name: 'Codex Hash Research',
        url: 'https://codexhash.com/research',
        parentOrganization: {
          '@id': `${siteUrl}/#codexhash`,
        },
      },
      {
        '@id': `${siteUrl}/#professional-service`,
        '@type': ['ProfessionalService', 'Service'],
        name: 'Consultoria, Palestras e Pesquisa — Ulisses Flores',
        description:
          'Consultoria estratégica em IA generativa e sistemas complexos, palestras e treinamentos executivos, pesquisa aplicada (whitepapers, simulações, deep research) e board advisory.',
        provider: { '@id': `${siteUrl}/#person` },
        serviceType: [
          'AI Consulting',
          'Strategic Advisory',
          'Keynote Speaking',
          'Corporate Training',
          'Applied Research',
          'Board Advisory',
        ],
        areaServed: buildAreaServedJsonLd(),
        availableLanguage: ['pt-BR', 'en', 'es', 'it', 'he'],
        audience: {
          '@type': 'Audience',
          audienceType: 'CxO, CTO, Founder, Investor, University, Enterprise',
        },
        url: siteUrl,
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Modalidades',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Consultoria em IA e Sistemas',
                description:
                  'Diagnóstico estratégico, roadmap de IA generativa, arquitetura de sistemas críticos, governança de dados e riscos.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Palestras e Keynotes',
                description:
                  'Keynotes e masterclasses sobre IA generativa, economia austríaca aplicada, blockchain em empresas e sistemas complexos.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Treinamentos Executivos',
                description:
                  'Workshops in-company para lideranças técnicas e executivas em adoção de IA, arquitetura de produto e segurança.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Pesquisa Aplicada',
                description:
                  'Whitepapers, simulações, deep research e pareceres técnicos publicados em ulissesflores.com.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Board Advisory / Fractional CTO',
                description:
                  'Assentos consultivos em conselhos e atuação como fractional CTO/CSO para empresas em transformação digital.',
              },
            },
          ],
        },
      },
      ...institutionNodes,
      ...affiliationNodes,
      ...credentialNodes,
      ...occupationNodes,
      ...domainInventoryNodes,
    ],
  };
}

function buildCollectionNodes(siteUrl) {
  return Object.entries(CATEGORY_METADATA).map(([slug, metadata]) => ({
    '@id': `${siteUrl}/#collection-${slug}`,
    '@type': 'CollectionPage',
    name: metadata.heading,
    description: metadata.description,
    url: `${siteUrl}/${slug}`,
  }));
}

function buildPublicationNodes(siteUrl, publications) {
  return publications.map((publication) => ({
    '@id': `${siteUrl}/#pub-${publication.id}`,
    '@type': publication.kind === 'R' ? 'Report' : 'ScholarlyArticle',
    name: publication.title,
    headline: publication.title,
    description: publication.landing.overview,
    url: publication.canonicalUrl,
    datePublished: formatDateWithTimezone(publication.publishedAt),
    dateModified: formatDateWithTimezone(publication.updatedAt),
    inLanguage: publication.inLanguage,
    author: {
      '@id': `${siteUrl}/#person`,
    },
    publisher: {
      '@id': `${siteUrl}/#codexhash-research`,
    },
    isPartOf: {
      '@id': `${siteUrl}/#collection-${publication.category}`,
    },
    encoding: {
      '@type': 'MediaObject',
      contentUrl: `${siteUrl}${publication.primaryPdfUrl || publication.downloadUrl}`,
      encodingFormat: 'application/pdf',
    },
    associatedMedia: [
      publication.mdUrl
        ? {
            '@type': 'MediaObject',
            contentUrl: `${siteUrl}${publication.mdUrl}`,
            encodingFormat: 'text/markdown',
          }
        : null,
      publication.docxUrl
        ? {
            '@type': 'MediaObject',
            contentUrl: `${siteUrl}${publication.docxUrl}`,
            encodingFormat:
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          }
        : null,
    ].filter(Boolean),
    abstract: publication.sections.abstract,
    keywords: publication.tags.join(', '),
    citation: publication.sections.references.map((reference) =>
      reference.url ? `${reference.citation} (${reference.url})` : reference.citation,
    ),
  }));
}

function buildSoftwareProjectNodes(siteUrl, softwareProjects) {
  if (!Array.isArray(softwareProjects) || softwareProjects.length === 0) {
    return [];
  }

  return softwareProjects.map((project, index) => {
    const projectId = normalizeLocalAnchorId(
      siteUrl,
      project.schemaId,
      `software-${slugify(project.slug || `project-${index + 1}`)}`,
    );
    const releaseIdentifiers = (project.releases || [])
      .map((release) => {
        if (!release.doi && !release.doiUrl && !release.version) {
          return null;
        }

        const label = release.version ? `DOI (v${release.version})` : 'DOI';
        return {
          '@type': 'PropertyValue',
          propertyID: label,
          value: release.doi || release.doiUrl || release.version,
          url: release.doiUrl || (release.doi ? `https://doi.org/${release.doi}` : undefined),
        };
      })
      .filter(Boolean);

    const name = project.name?.en || project.name?.['pt-BR'] || project.slug;
    const description = project.description?.en || project.description?.['pt-BR'] || undefined;
    const inferredVersion =
      project.version || (project.releases && project.releases.length > 0 ? project.releases[project.releases.length - 1].version : '');

    return {
      '@id': projectId,
      '@type': 'SoftwareSourceCode',
      name,
      description,
      url: project.repo || project.codeRepository || undefined,
      codeRepository: project.codeRepository || project.repo || undefined,
      programmingLanguage: project.programmingLanguage || undefined,
      runtimePlatform: project.runtimePlatform || undefined,
      version: inferredVersion || undefined,
      license: project.licenseUrl || project.license || undefined,
      creator: {
        '@id': `${siteUrl}/#person`,
      },
      publisher: {
        '@id': `${siteUrl}/#codexhash-research`,
      },
      keywords: project.keywords && project.keywords.length > 0 ? project.keywords.join(', ') : undefined,
      identifier:
        releaseIdentifiers.length > 1
          ? releaseIdentifiers
          : releaseIdentifiers.length === 1
            ? releaseIdentifiers[0]
            : undefined,
    };
  });
}

function normalizeLocalAnchorId(siteUrl, value, fallback) {
  if (!value) {
    return `${siteUrl}/#${fallback}`;
  }
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }
  if (value.startsWith('#')) {
    return `${siteUrl}/${value}`;
  }
  return `${siteUrl}/#${value}`;
}

function buildCertificationNodes(siteUrl, certifications) {
  const nodes = [];

  const addIssuer = (issuerRef, name) => {
    const id = normalizeLocalAnchorId(siteUrl, issuerRef, `issuer-${slugify(name || 'provider')}`);
    nodes.push({
      '@id': id,
      '@type': 'Organization',
      name,
      url: id.startsWith('http') ? id : undefined,
    });
    return id;
  };

  if (certifications.edx?.verifyUrl) {
    const issuerId = addIssuer(certifications.edx.issuerRef || '#edx', 'edX');
    nodes.push({
      '@id': `${siteUrl}/#cred-edx-${certifications.edx.certId || '1'}`,
      '@type': 'EducationalOccupationalCredential',
      name: certifications.edx.name,
      identifier: certifications.edx.certId || undefined,
      url: certifications.edx.verifyUrl,
      credentialCategory: 'Certification',
      recognizedBy: {
        '@id': issuerId,
      },
    });
  }

  if (certifications.coursera?.verifyUrl) {
    const issuerId = addIssuer(certifications.coursera.issuerRef || '#coursera', 'Coursera');
    nodes.push({
      '@id': `${siteUrl}/#cred-coursera-${certifications.coursera.certId || '1'}`,
      '@type': 'EducationalOccupationalCredential',
      name: certifications.coursera.name,
      identifier: certifications.coursera.certId || undefined,
      url: certifications.coursera.verifyUrl,
      credentialCategory: 'Certification',
      recognizedBy: {
        '@id': issuerId,
      },
    });
  }

  if (certifications.alura.length > 0) {
    const issuerId = addIssuer(certifications.aluraIssuerRef || '#alura', 'Alura');
    certifications.alura.forEach((cert) => {
      nodes.push({
        '@id': `${siteUrl}/#cred-alura-${cert.position}`,
        '@type': 'EducationalOccupationalCredential',
        name: cert.name,
        identifier: cert.certId,
        url: cert.verifyUrl,
        position: cert.position,
        credentialCategory: 'Certification',
        recognizedBy: {
          '@id': issuerId,
        },
      });
    });
  }

  return nodes;
}

function extractYouTubeThumbnail(url) {
  if (!url) return undefined;
  const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([\w-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : undefined;
}

function buildBlogNodes(siteUrl, blogPosts) {
  if (!blogPosts.posts || blogPosts.posts.length === 0) {
    return [];
  }

  const blogId = normalizeLocalAnchorId(siteUrl, blogPosts.blogSchemaId || '#mundopolitico-blog', 'mundopolitico-blog');
  const nodes = [
    {
      '@id': blogId,
      '@type': 'Blog',
      name: 'Mundo Político',
      url: blogPosts.blogUrl || 'https://mundopolitico.com.br/',
      inLanguage: blogPosts.inLanguage || 'pt-BR',
    },
  ];

  blogPosts.posts.forEach((post) => {
    const slug = slugify(post.headline).slice(0, 64) || `post-${post.position}`;
    const node = {
      '@id': `${siteUrl}/#mundopolitico-post-${post.position}-${slug}`,
      '@type': 'BlogPosting',
      headline: post.headline,
      url: post.url,
      inLanguage: blogPosts.inLanguage || 'pt-BR',
      isPartOf: {
        '@id': blogId,
      },
      author: {
        '@id': `${siteUrl}/#person`,
      },
      position: post.position,
    };

    if (post.datePublished && post.datePublished !== 'UNDATED') {
      node.datePublished = post.datePublished;
    }

    nodes.push(node);
  });

  return nodes;
}

function buildSermonNodes(siteUrl, sermons) {
  if (!sermons.collections || sermons.collections.length === 0) {
    return [];
  }

  const collectionId = normalizeLocalAnchorId(siteUrl, sermons.collectionSchemaId || '#sermons', 'sermons');
  const publisherId = normalizeLocalAnchorId(
    siteUrl,
    sermons.publisherRef || '#quadrangular-vila-helena',
    'quadrangular-vila-helena',
  );

  const collectionNode = {
    '@id': collectionId,
    '@type': 'Collection',
    name: 'Sermons & Theological Talks',
    url: sermons.channelUrl || 'https://www.youtube.com/@quadrangularvilahelena',
    inLanguage: sermons.inLanguage || 'pt-BR',
    publisher: {
      '@id': publisherId,
    },
    hasPart: sermons.collections.map((collection) => ({
      '@id': normalizeLocalAnchorId(siteUrl, collection.seriesSchemaId, `sermons-series-${slugify(collection.name)}`),
    })),
  };

  const nodes = [collectionNode];

  sermons.collections.forEach((series) => {
    const seriesId = normalizeLocalAnchorId(siteUrl, series.seriesSchemaId, `sermons-series-${slugify(series.name)}`);
    nodes.push({
      '@id': seriesId,
      '@type': 'CreativeWorkSeries',
      name: series.name,
      isPartOf: {
        '@id': collectionId,
      },
      inLanguage: sermons.inLanguage || 'pt-BR',
    });

    series.items.forEach((item) => {
      const slug = slugify(item.name).slice(0, 56) || `sermon-${item.position}`;
      const sermonNode = {
        '@id': `${seriesId}-sermon-${item.position}-${slug}`,
        '@type': 'VideoObject',
        additionalType: 'https://schema.org/Sermon',
        name: item.name,
        description: item.summary || item.name,
        url: item.youtubeUrl,
        contentUrl: item.youtubeUrl,
        thumbnailUrl: extractYouTubeThumbnail(item.youtubeUrl),
        inLanguage: sermons.inLanguage || 'pt-BR',
        genre: 'Sermon',
        isPartOf: {
          '@id': seriesId,
        },
        publisher: {
          '@id': publisherId,
        },
        position: item.position,
      };

      if (item.datePublished && item.datePublished !== 'UNDATED') {
        sermonNode.datePublished = formatDateWithTimezone(item.datePublished);
        sermonNode.uploadDate = formatDateWithTimezone(item.datePublished);
      }

      nodes.push(sermonNode);
    });
  });

  return nodes;
}

export function buildPublicJsonLd({
  coreSiteJsonLd,
  publications,
  frontmatter,
  sourcePath,
  identity,
  certifications,
  blogPosts,
  sermons,
  softwareProjects,
}) {
  const siteUrl = identity.primaryWebsite || 'https://ulissesflores.com';
  const baseGraph = Array.isArray(coreSiteJsonLd['@graph']) ? coreSiteJsonLd['@graph'] : [];
  const collectionNodes = buildCollectionNodes(siteUrl);
  const publicationNodes = buildPublicationNodes(siteUrl, publications);
  const softwareNodes = buildSoftwareProjectNodes(siteUrl, softwareProjects);
  const certificationNodes = buildCertificationNodes(siteUrl, certifications);
  const blogNodes = buildBlogNodes(siteUrl, blogPosts);
  const sermonNodes = buildSermonNodes(siteUrl, sermons);
  const extraNodes = [...softwareNodes, ...certificationNodes, ...blogNodes, ...sermonNodes];
  const isOrganizationNode = (node) => {
    const type = node?.['@type'];
    if (Array.isArray(type)) {
      return type.includes('Organization');
    }
    return type === 'Organization';
  };
  // Dataset.hasPart requires CreativeWork (or subclass). Filter out types that
  // live outside the CreativeWork branch of schema.org, otherwise Google flags
  // "Invalid object type for field hasPart" (GSC Datasets — WNC-10030322).
  //
  // Excluded types (not CreativeWork subclasses):
  //   - EducationalOccupationalCredential (Intangible)
  //   - Organization (already filtered via isOrganizationNode)
  //   - Person, Place, Service, ProfessionalService, Product, etc.
  //
  // Certifications still appear in the @graph via `extraNodes`; they're just
  // not declared as "parts" of the Dataset (which is semantically correct —
  // they're separate entities recognized by the Person node, not components
  // of the public knowledge graph document).
  // Full list of CreativeWork subclasses we emit OR could plausibly emit.
  // Kept explicit (rather than trying to runtime-resolve schema.org hierarchy)
  // so the filter is deterministic and reviewable.
  const CREATIVE_WORK_TYPES = new Set([
    // Direct CreativeWork + generic
    'CreativeWork', 'CreativeWorkSeries', 'Collection',
    // Article family
    'Article', 'BlogPosting', 'NewsArticle', 'Report', 'ScholarlyArticle', 'TechArticle',
    // Web pages
    'WebPage', 'WebSite', 'CollectionPage', 'AboutPage', 'FAQPage', 'ProfilePage',
    // Media
    'MediaObject', 'VideoObject', 'AudioObject', 'ImageObject', 'MusicRecording', 'MusicVideoObject',
    // Software
    'SoftwareApplication', 'SoftwareSourceCode', 'WebApplication', 'MobileApplication',
    // Books/publications
    'Book', 'Chapter', 'Periodical', 'PublicationIssue', 'PublicationVolume', 'Thesis',
    // Other creative works
    'Course', 'Dataset', 'Review', 'Painting', 'Photograph', 'ShortStory',
    'Message', 'Movie', 'MusicComposition', 'Sermon', 'Map', 'Diagram',
  ]);
  const isCreativeWorkType = (node) => {
    const type = node?.['@type'];
    if (Array.isArray(type)) {
      return type.some((t) => CREATIVE_WORK_TYPES.has(t));
    }
    return CREATIVE_WORK_TYPES.has(type);
  };

  const publicHasPart = [...collectionNodes, ...publicationNodes, ...softwareNodes, ...certificationNodes, ...blogNodes, ...sermonNodes]
    .filter((node) => !isOrganizationNode(node) && isCreativeWorkType(node))
    .map((node) => ({ '@id': node['@id'], '@type': node['@type'] || 'CreativeWork' }));

  const publicDatasetNode = {
    '@id': `${siteUrl}/#upkf-public`,
    '@type': 'Dataset',
    name: `${frontmatter.title || 'UPKF'} (Public Knowledge Graph)`,
    version: frontmatter.version || 'unknown',
    dateModified: formatDateWithTimezone(frontmatter.generated_at) || new Date().toISOString(),
    description: 'Public semantic graph derived from the canonical UPKF source.',
    inLanguage: frontmatter.languages || ['pt-BR'],
    url: `${siteUrl}/public.jsonld`,
    license: 'https://creativecommons.org/licenses/by-sa/4.0/',
    creator: {
      '@id': `${siteUrl}/#person`,
    },
    isBasedOn: {
      '@type': 'CreativeWork',
      name: path.basename(sourcePath),
    },
    hasPart: publicHasPart,
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [...baseGraph, ...collectionNodes, ...publicationNodes, ...extraNodes, publicDatasetNode],
  };
}

export function buildFullUpkfJsonLd({
  publicJsonLd,
  upkfSections,
  frontmatter,
  sourcePath,
  identity,
  sourceMdPublicUrl,
}) {
  const siteUrl = identity.primaryWebsite || 'https://ulissesflores.com';
  const baseGraph = Array.isArray(publicJsonLd['@graph']) ? publicJsonLd['@graph'] : [];

  const sectionIdMap = new Map();
  const sectionNodes = upkfSections.map((section, index) => {
    const sectionId = `urn:upkf:section:${index + 1}`;
    sectionIdMap.set(section.id, sectionId);
    return {
      '@id': sectionId,
      '@type': 'CreativeWork',
      name: section.title,
      text: section.content,
      position: index + 1,
      identifier: `upkf-section-${index + 1}`,
      isPartOf: section.parentId ? { '@id': '' } : { '@id': `${siteUrl}/#upkf` },
      about: {
        '@id': `${siteUrl}/#upkf`,
      },
    };
  });

  for (const node of sectionNodes) {
    if (node.isPartOf && node.isPartOf['@id'] === '') {
      const sectionEntry = upkfSections[node.position - 1];
      node.isPartOf = {
        '@id': sectionIdMap.get(sectionEntry.parentId) || `${siteUrl}/#upkf`,
      };
    }
  }

  const topLevelSections = upkfSections
    .filter((section) => !section.parentId)
    .map((section) => sectionIdMap.get(section.id))
    .filter(Boolean)
    .map((id) => ({ '@id': id }));

  const rootNode = {
    '@id': `${siteUrl}/#upkf`,
    '@type': 'Dataset',
    name: frontmatter.title || 'UPKF',
    version: frontmatter.version || 'unknown',
    dateModified: frontmatter.generated_at || new Date().toISOString(),
    description: 'Canonical markdown source used for deterministic full JSON-LD derivation.',
    encodingFormat: 'text/markdown',
    inLanguage: frontmatter.languages || ['pt-BR'],
    url: `${siteUrl}/full.jsonld`,
    creator: {
      '@id': `${siteUrl}/#person`,
    },
    isBasedOn: {
      '@type': 'CreativeWork',
      name: path.basename(sourcePath),
      text: sourcePath,
    },
    hasPart: topLevelSections,
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/ld+json',
        contentUrl: `${siteUrl}/site.jsonld`,
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/ld+json',
        contentUrl: `${siteUrl}/public.jsonld`,
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/ld+json',
        contentUrl: `${siteUrl}/full.jsonld`,
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'text/markdown',
        contentUrl: `${siteUrl}${sourceMdPublicUrl}`,
      },
    ],
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [...baseGraph, rootNode, ...sectionNodes],
  };
}
