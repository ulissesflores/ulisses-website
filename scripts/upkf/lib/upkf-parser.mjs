import fs from 'node:fs';
import { ARTICLE_REFERENCES_PATH, CATEGORY_METADATA, DOCS_UPKF_PATH, LOCAL_UPKF_PATH, PUBLIC_UPKF_PATH, SOTA_GEOGRAPHIC_SERVICES, SOTA_JOB_TITLES, SOTA_KNOWS_ABOUT } from './constants.mjs';
import { extractBlock, extractScalar, normalizeForSearch, normalizeHeadingTitle, parseBlockParagraph, parseIndentedList, parseIndentedMap, parseInlineArray, parseMarkdownTableRows, parseMultilingualMap, splitBySecondAndThirdLevelHeadings, splitByThirdLevelHeadings } from './text.mjs';

export function loadArticleReferencesMap() {
  const mapPath = process.env.UPKF_ARTICLE_REFERENCES || ARTICLE_REFERENCES_PATH;
  if (!fs.existsSync(mapPath)) {
    return {};
  }

  try {
    const raw = fs.readFileSync(mapPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    const normalized = {};
    for (const [slug, refs] of Object.entries(parsed)) {
      if (!Array.isArray(refs)) {
        continue;
      }

      normalized[slug] = refs
        .map((ref) => {
          if (!ref || typeof ref !== 'object') {
            return null;
          }

          const citation = String(ref.citation || '').trim();
          const url = String(ref.url || '').trim();

          if (!citation) {
            return null;
          }

          return {
            citation,
            url: url || undefined,
          };
        })
        .filter(Boolean);
    }

    return normalized;
  } catch (error) {
    process.stderr.write(`Aviso: falha ao carregar article-references.json (${error.message}).\n`);
    return {};
  }
}

export function findSourcePath() {
  const candidates = [process.env.UPKF_SOURCE, PUBLIC_UPKF_PATH, LOCAL_UPKF_PATH, DOCS_UPKF_PATH].filter(Boolean);
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `UPKF nao encontrado. Defina UPKF_SOURCE ou garanta a existencia de: ${LOCAL_UPKF_PATH}`,
  );
}

function parsePublicIdentifiers(upkfText) {
  const section = extractBlock(upkfText, '## Public Identifiers\n', '\n\n## sameAs (Canonical Profile Links)');
  const rows = parseMarkdownTableRows(section)
    .slice(1)
    .map((cells) => ({
      label: cells[0] || '',
      value: cells[1] || '',
      url: cells[2] || '',
      notes: cells[3] || '',
    }))
    .filter((row) => row.label && row.value);

  const findByLabel = (matcher) =>
    rows.find((row) => normalizeForSearch(row.label).includes(normalizeForSearch(matcher)));

  return {
    rows,
    palauDigitalResidency: findByLabel('RNS.ID (Palau)') || null,
    gitcoinPassport: findByLabel('Gitcoin Passport') || null,
    keybase: findByLabel('Keybase') || null,
  };
}

function parseDomainInventory(upkfText) {
  const section = extractBlock(upkfText, '## Domain Inventory (Hub & Spoke — 14 domains)\n', '\n\n### Web3 Presence');
  return parseMarkdownTableRows(section)
    .slice(1)
    .map((cells) => ({
      position: Number(cells[0]) || undefined,
      domain: cells[1] || '',
      url: cells[2] || '',
      category: cells[3] || '',
      purpose: cells[4] || '',
    }))
    .filter((row) => row.domain && row.url.startsWith('http'));
}

function parseKnowledgeDomains(upkfText) {
  const section = extractBlock(upkfText, '## Knowledge Domains (DefinedTerms → Wikidata)\n', '\n\n---');
  return parseMarkdownTableRows(section)
    .slice(1)
    .map((cells) => cells[0] || '')
    .filter(Boolean);
}

export function parseCurrentOccupations(upkfText) {
  const section = extractBlock(upkfText, '## Current Occupations\n', '\n\n## Professional Experience (Chronological)');
  if (!section) {
    return [];
  }

  return splitByThirdLevelHeadings(section)
    .map(({ heading, block }, index) => ({
      position: index + 1,
      title: normalizeHeadingTitle(heading),
      schemaId: extractScalar(block, 'schema_id'),
      schemaType: extractScalar(block, 'schema_type') || 'Occupation',
      organizationRef: extractScalar(block, 'organization_ref'),
      location: extractScalar(block, 'location'),
      appliedSkills: parseInlineArray(extractScalar(block, 'applied_skills')),
    }))
    .filter((occupation) => occupation.title && occupation.schemaId);
}

function parseAcademicCredentialEntries(section, sourceType) {
  if (!section) {
    return [];
  }

  return splitByThirdLevelHeadings(section)
    .map(({ heading, block }, index) => {
      const thesisTitle = parseIndentedMap(block, 'thesis_title');
      const topics = parseInlineArray(extractScalar(block, 'topics'));
      const skillsAcquired = parseInlineArray(extractScalar(block, 'skills_acquired'));
      const thesisTopics = parseInlineArray(extractScalar(block, 'thesis_topics'));
      const skills = Array.from(new Set([...topics, ...skillsAcquired, ...thesisTopics]));

      return {
        position: index + 1,
        sourceType,
        title: normalizeHeadingTitle(heading),
        schemaId: extractScalar(block, 'schema_id'),
        schemaType: extractScalar(block, 'schema_type') || 'EducationalOccupationalCredential',
        institution: extractScalar(block, 'institution'),
        institutionRef: extractScalar(block, 'institution_ref'),
        institutionUrl: extractScalar(block, 'institution_url'),
        institutionSameAs: extractScalar(block, 'institution_sameAs'),
        period: extractScalar(block, 'period'),
        credentialStatus:
          extractScalar(block, 'credentialStatus') || (sourceType === 'internationalExtensions' ? 'Completed' : ''),
        credentialCategory: extractScalar(block, 'credentialCategory'),
        thesisTitle,
        skills,
        flagshipProjectRef: extractScalar(block, 'flagship_project_ref'),
      };
    })
    .filter((credential) => credential.title && credential.schemaId);
}

export function parseAcademicCredentials(upkfText) {
  const formalSection = extractBlock(upkfText, '## Formal Degrees\n', '\n\n## International Extensions');
  const extensionsSection = extractBlock(upkfText, '## International Extensions\n', '\n\n## Licenses & Certifications');

  return [
    ...parseAcademicCredentialEntries(formalSection, 'formalDegrees'),
    ...parseAcademicCredentialEntries(extensionsSection, 'internationalExtensions'),
  ];
}

function parseSoftwareReleases(block) {
  const releasesMatch = block.match(/^- releases:\n([\s\S]*?)(?=\n- [a-zA-Z0-9_]+:|$)/m);
  if (!releasesMatch) {
    return [];
  }

  return releasesMatch[1]
    .split('\n')
    .map((line) => line.match(/^\s{2}-\s+(.+)$/))
    .filter(Boolean)
    .map((match) => String(match[1] || '').trim())
    .map((entry) => {
      const segments = entry.split('|').map((item) => item.trim());
      const release = {};
      for (const segment of segments) {
        const scalarMatch = segment.match(/^([a-zA-Z0-9_]+):\s*(.+)$/);
        if (!scalarMatch) {
          continue;
        }
        const key = scalarMatch[1];
        const value = scalarMatch[2].trim();
        release[key] = value;
      }

      return {
        version: release.version || '',
        doi: release.doi || '',
        doiUrl: release.doi_url || '',
      };
    })
    .filter((release) => release.version || release.doi || release.doiUrl);
}

export function parseSoftwareProjects(upkfText) {
  const section = extractBlock(
    upkfText,
    '## GitHub Repositories & Zenodo DOIs (Citable Artifacts)\n',
    '\n\n## ORCID Works — Complete Inventory (40/40)',
  );
  if (!section) {
    return [];
  }

  return splitByThirdLevelHeadings(section)
    .map(({ heading, block }, index) => {
      const releases = parseSoftwareReleases(block);
      const scalarDoi = extractScalar(block, 'doi');
      const scalarDoiUrl = extractScalar(block, 'doi_url');
      const scalarVersion = extractScalar(block, 'version');

      if (scalarDoi || scalarDoiUrl || scalarVersion) {
        releases.unshift({
          version: scalarVersion,
          doi: scalarDoi,
          doiUrl: scalarDoiUrl,
        });
      }

      const dedupedReleaseMap = new Map();
      releases.forEach((release) => {
        const key = `${release.version || ''}|${release.doi || ''}|${release.doiUrl || ''}`;
        if (!dedupedReleaseMap.has(key)) {
          dedupedReleaseMap.set(key, release);
        }
      });
      const dedupedReleases = Array.from(dedupedReleaseMap.values());

      return {
        position: index + 1,
        slug: normalizeHeadingTitle(heading),
        schemaId: extractScalar(block, 'schema_id'),
        schemaType: extractScalar(block, 'schema_type') || 'SoftwareSourceCode',
        repo: extractScalar(block, 'repo'),
        codeRepository: extractScalar(block, 'codeRepository') || extractScalar(block, 'repo'),
        version: extractScalar(block, 'version'),
        license: extractScalar(block, 'license'),
        licenseUrl: extractScalar(block, 'license_url'),
        programmingLanguage: extractScalar(block, 'programmingLanguage'),
        runtimePlatform: extractScalar(block, 'runtimePlatform'),
        name: parseIndentedMap(block, 'name'),
        description: parseIndentedMap(block, 'description'),
        keywords: parseInlineArray(extractScalar(block, 'keywords')),
        releases: dedupedReleases,
      };
    })
    .filter((project) => project.schemaId && project.repo);
}

export function parseAffiliations(upkfText) {
  const section = extractBlock(
    upkfText,
    '# Organizations & Affiliations\n',
    '\n\n---\n\n\n# Digital Assets & Web3 Identifiers',
  );
  if (!section) {
    return [];
  }

  return splitBySecondAndThirdLevelHeadings(section)
    .map(({ heading, block }) => {
      const schemaId = extractScalar(block, 'schema_id');
      if (!schemaId) {
        return null;
      }

      const nameFromScalar = extractScalar(block, 'name');
      const legalName = extractScalar(block, 'legal_name');
      const normalizedHeading = heading.replace(/^Sub-Organization:\s*/i, '').trim();

      return {
        schemaId,
        schemaType: extractScalar(block, 'schema_type') || 'Organization',
        name: nameFromScalar || legalName || normalizedHeading,
        legalName,
        url: extractScalar(block, 'url'),
        parentOrganizationRef: extractScalar(block, 'parentOrganization_ref'),
        relation: extractScalar(block, 'relation'),
        sameAs: parseIndentedList(block, 'sameAs'),
        description: parseIndentedMap(block, 'description'),
        alternateNames: parseInlineArray(extractScalar(block, 'alternate_names')),
      };
    })
    .filter(Boolean);
}

export function parseHeritage(upkfText) {
  const section = extractBlock(
    upkfText,
    '## Forensic Heritage & Genealogical Audit\n',
    '\n\n---\n\n\n# Professional Taxonomy',
  );
  if (!section) {
    return {
      publishPublic: false,
      clusters: [],
      synthesis: {},
    };
  }

  const publishPublic =
    /PUBLIC_OVERRIDE\s*:\s*HERITAGE_PUBLIC/i.test(section) ||
    /public_override:\s*heritage_public/i.test(section) ||
    /classification:\s*PUBLIC_OVERRIDE/i.test(section);

  const clusters = splitByThirdLevelHeadings(section)
    .filter(({ heading }) => normalizeForSearch(heading) !== normalizeForSearch('Strategic Synthesis'))
    .map(({ heading, block }) => {
      const surnamesRaw = extractScalar(block, 'key_surnames');
      const keySurnames = surnamesRaw.includes('[')
        ? parseInlineArray(surnamesRaw)
        : surnamesRaw
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

      return {
        title: heading,
        cluster: extractScalar(block, 'cluster'),
        keySurnames,
        region: extractScalar(block, 'region'),
        probabilityScore: extractScalar(block, 'probability_score'),
        thesis: parseBlockParagraph(block, 'thesis_pt-BR'),
        nextStep: extractScalar(block, 'next_step'),
      };
    })
    .filter((cluster) => cluster.title && cluster.cluster);

  const synthesisBlock = extractBlock(section, '### Strategic Synthesis\n', undefined);
  const synthesis = {
    sephardicIdentity: extractScalar(synthesisBlock, 'sephardic_identity'),
    italianIdentity: extractScalar(synthesisBlock, 'italian_identity'),
  };

  return {
    publishPublic,
    clusters,
    synthesis,
  };
}

export function parseOrcidInventoryStats(upkfText) {
  const section = extractBlock(
    upkfText,
    '## ORCID Works — Complete Inventory (40/40)\n',
    '\n\n**Total: 40/40 ORCID works mapped.**',
  );
  if (!section) {
    return {
      counted: 0,
      reported: 0,
    };
  }

  const counted = section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && !line.includes(':--'))
    .map((line) =>
      line
        .split('|')
        .map((cell) => cell.trim())
        .filter(Boolean),
    )
    .filter((cells) => cells.length >= 6 && /^\d+$/.test(cells[0])).length;

  const totalMatch = upkfText.match(/\*\*Total:\s*(\d+)\/(\d+)\s+ORCID works mapped\.\*\*/);
  const reported = totalMatch ? Number(totalMatch[2] || totalMatch[1]) : counted;

  return {
    counted,
    reported,
  };
}

export function parseIdentity(upkfText) {
  const canonicalName = extractScalar(upkfText, 'canonical_legal_name');
  const preferredName = extractScalar(upkfText, 'preferred_name');
  const birthDate = extractScalar(upkfText, 'birth_date');
  const primaryWebsite = extractScalar(upkfText, 'primary_website').replace(/\/$/, '');
  const nationalities = parseInlineArray(extractScalar(upkfText, 'nationalities'));

  const alternateNames = parseInlineArray(extractScalar(upkfText, 'alternate_names'));
  const languages = parseInlineArray(extractScalar(upkfText, 'languages'));

  const disambiguationBlock = extractBlock(
    upkfText,
    '- disambiguating_description:\n',
    '\n\n### Identity Resolution Rules',
  );
  const descriptionBlock = extractBlock(upkfText, '- description:\n', '\n\n## Narrative Metaphor (Odysseus)');

  const disambiguation = parseMultilingualMap(disambiguationBlock);
  const description = parseMultilingualMap(descriptionBlock);

  const sameAsBlock = extractBlock(upkfText, '## sameAs (Canonical Profile Links)\n', '\n\n## Domain Inventory');
  const sameAs = sameAsBlock
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- http'))
    .map((line) => line.replace(/^-\s*/, '').trim());
  const identifiers = parsePublicIdentifiers(upkfText);
  const domainInventory = parseDomainInventory(upkfText);
  const knowledgeDomains = parseKnowledgeDomains(upkfText);

  const notSameAsBlock = extractBlock(
    upkfText,
    '**Explicit negative identity claims (notSameAs):**',
    '\n\n## Description',
  );
  const notSameAs = notSameAsBlock
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- NOT'))
    .map((line) => line.replace(/^- NOT\s*/, '').trim());

  const orcidMatch = upkfText.match(/ORCID:\s*([0-9-]+)/);
  const lattesMatch = upkfText.match(/Lattes ID:\s*([0-9]+)/);
  const publicDisplayName = alternateNames.includes('Carlos Ulisses Flores')
    ? 'Carlos Ulisses Flores'
    : canonicalName;
  const keybaseUrl = sameAs.find((item) => item.includes('keybase.io')) || identifiers.keybase?.url || '';
  const gravatarUrl = sameAs.find((item) => item.includes('gravatar.com')) || '';
  const ethLimoUrl = sameAs.find((item) => item.includes('.eth.limo')) || '';

  const hasCredential = [
    identifiers.palauDigitalResidency
      ? {
          '@id': `${primaryWebsite}/#credential-palau-digital-residency`,
          '@type': 'EducationalOccupationalCredential',
          name: 'RNS.ID Digital Residency (Palau)',
          identifier: identifiers.palauDigitalResidency.value,
          credentialCategory: 'Digital Residency',
          url: identifiers.palauDigitalResidency.url,
          description: identifiers.palauDigitalResidency.notes,
        }
      : null,
    identifiers.gitcoinPassport
      ? {
          '@id': `${primaryWebsite}/#credential-gitcoin-passport`,
          '@type': 'EducationalOccupationalCredential',
          name: 'Gitcoin Passport',
          identifier: identifiers.gitcoinPassport.value,
          credentialCategory: 'Web3 Identity Credential',
          url: identifiers.gitcoinPassport.url,
          description: identifiers.gitcoinPassport.notes,
        }
      : null,
  ].filter(Boolean);

  const knowsAbout = Array.from(new Set([...SOTA_KNOWS_ABOUT, ...knowledgeDomains]));
  const geographicallyServes = Array.from(new Set(SOTA_GEOGRAPHIC_SERVICES));

  return {
    canonicalName,
    publicDisplayName,
    preferredName,
    alternateNames,
    birthYear: birthDate ? birthDate.slice(0, 4) : '',
    primaryWebsite,
    languages,
    disambiguation,
    description,
    nationalities,
    sameAs,
    notSameAs,
    orcid: orcidMatch ? orcidMatch[1] : '',
    lattesId: lattesMatch ? lattesMatch[1] : '',
    jobTitle: SOTA_JOB_TITLES,
    knowsAbout,
    geographicallyServes,
    sovereignIdentity: {
      palauDigitalResidency: identifiers.palauDigitalResidency,
      gitcoinPassport: identifiers.gitcoinPassport,
      keybaseUrl,
      gravatarUrl,
      ethLimoUrl,
    },
    hasCredential,
    publicIdentifiers: identifiers.rows,
    domainInventory,
  };
}

export function parseOrganization(upkfText) {
  const block = extractBlock(
    upkfText,
    '## Codex Hash Ltda (Primary)\n',
    '\n\n### Sub-Organization: Codex Hash Research',
  );

  const descriptionBlock = extractBlock(block, '- description:\n', undefined);
  const description = parseMultilingualMap(descriptionBlock);

  return {
    schemaId: extractScalar(block, 'schema_id'),
    legalName: extractScalar(block, 'legal_name'),
    cnpj: extractScalar(block, 'cnpj').replace(/\s*<!--.*$/, '').trim(),
    foundingDate: extractScalar(block, 'founding_date'),
    url: extractScalar(block, 'url'),
    email: extractScalar(block, 'email').replace(/\s*<!--.*$/, '').trim(),
    address: extractScalar(block, 'address').replace(/\s*<!--.*$/, '').trim(),
    description,
  };
}

export function parseTop10Translations(upkfText) {
  const section = extractBlock(upkfText, '### Top 10 Publications — Multilingual Titles (EN/ES)\n', '\n\n---');
  const map = new Map();

  for (const line of section.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || trimmed.includes(':--')) {
      continue;
    }

    const cells = trimmed
      .split('|')
      .map((cell) => cell.trim())
      .filter(Boolean);

    if (cells.length < 4 || !/^\d+$/.test(cells[0])) {
      continue;
    }

    map.set(cells[1].replace(/\s+/g, ' ').trim(), {
      en: cells[2].replace(/\s+/g, ' ').trim(),
      es: cells[3].replace(/\s+/g, ' ').trim(),
    });
  }

  return map;
}

export function parsePublicationRows(upkfText) {
  const section = extractBlock(
    upkfText,
    '## ORCID Works — Complete Inventory (40/40)\n',
    '\n\n**Total: 40/40 ORCID works mapped.**',
  );

  const rows = [];

  for (const line of section.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || trimmed.includes(':--')) {
      continue;
    }

    const cells = trimmed
      .split('|')
      .map((cell) => cell.trim())
      .filter(Boolean);

    if (cells.length < 6 || !/^\d+$/.test(cells[0])) {
      continue;
    }

    const ordinal = Number(cells[0]);
    const type = cells[1];
    let year = '';
    let title = '';
    let inLanguage = '';
    let url = '';

    if (/^\d{4}$/.test(cells[2])) {
      year = cells[2];
      title = cells[3];
      inLanguage = cells[4];
      url = cells[5];
    } else {
      title = cells[2];
      year = cells[3];
      inLanguage = cells[4];
      url = cells[5];
    }

    if (!url.startsWith('http')) {
      continue;
    }

    const parsed = new URL(url);
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments.length < 2) {
      continue;
    }

    const category = segments[0];
    const slug = segments[1];
    if (!Object.prototype.hasOwnProperty.call(CATEGORY_METADATA, category)) {
      continue;
    }

    rows.push({
      ordinal,
      type,
      year,
      title: title.replace(/\s+/g, ' ').trim(),
      inLanguage,
      category,
      slug,
      canonicalUrl: `${parsed.origin}/${category}/${slug}`,
    });
  }

  const deduped = [];
  const seen = new Set();
  for (const row of rows) {
    const key = `${row.category}/${row.slug}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(row);
    }
  }

  return deduped.sort((a, b) => {
    if (a.year === b.year) {
      return a.ordinal - b.ordinal;
    }
    return Number(b.year) - Number(a.year);
  });
}

function parseMarkdownTable(block) {
  const lines = block
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|'));

  if (lines.length < 2) {
    return [];
  }

  const toCells = (line) =>
    line
      .split('|')
      .map((cell) => cell.trim())
      .filter(Boolean);

  const headers = toCells(lines[0]);
  if (headers.length === 0) {
    return [];
  }

  const rows = [];
  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^\|[:\-\s|]+\|?$/.test(line)) {
      continue;
    }

    const cells = toCells(line);
    if (cells.length < headers.length) {
      continue;
    }

    const row = {};
    for (let col = 0; col < headers.length; col += 1) {
      row[headers[col]] = cells[col];
    }
    rows.push(row);
  }

  return rows;
}

export function parseCertifications(upkfText) {
  const section = extractBlock(upkfText, '## Licenses & Certifications\n', '\n\n---');
  if (!section) {
    return {
      edx: null,
      coursera: null,
      alura: [],
      aluraIssuerRef: '',
    };
  }

  const edxBlock = extractBlock(section, '### edX\n', '\n\n### Coursera');
  const courseraBlock = extractBlock(section, '### Coursera\n', '\n\n### Alura (32 certifications)');
  const aluraBlock = extractBlock(section, '### Alura (32 certifications)\n', undefined);

  const buildSimpleCert = (block, fallbackName) => {
    if (!block) {
      return null;
    }
    return {
      name: extractScalar(block, 'cert_name') || fallbackName,
      certId: extractScalar(block, 'cert_id'),
      verifyUrl: extractScalar(block, 'verify_url'),
      issuerRef: extractScalar(block, 'issuer_ref'),
    };
  };

  const aluraRows = parseMarkdownTable(aluraBlock)
    .map((row) => ({
      position: Number(row['#'] || 0),
      name: row.Certification || '',
      certId: row['Certificate ID'] || '',
      verifyUrl: row.verify_url || '',
    }))
    .filter((row) => row.position > 0 && row.name && row.verifyUrl);

  return {
    edx: buildSimpleCert(edxBlock, 'edX Certification'),
    coursera: buildSimpleCert(courseraBlock, 'Coursera Certification'),
    alura: aluraRows,
    aluraIssuerRef: extractScalar(aluraBlock, 'issuer_ref'),
  };
}

export function parseBlogPosts(upkfText) {
  const section = extractBlock(
    upkfText,
    '# Mundo Político — Blog Posts (19 articles, itemized)\n',
    '\n\n---\n\n\n# Sermons & Theological Talks (56 items, itemized)',
  );
  if (!section) {
    return {
      blogUrl: '',
      blogSchemaId: '',
      authorPage: '',
      inLanguage: 'pt-BR',
      posts: [],
    };
  }

  const rows = parseMarkdownTable(section);
  const posts = rows
    .map((row) => ({
      position: Number(row['#'] || 0),
      datePublished: row.datePublished || '',
      headline: row['headline_pt-BR'] || '',
      url: row.url || '',
    }))
    .filter((row) => row.position > 0 && row.headline && row.url);

  return {
    blogUrl: extractScalar(section, 'blog_url'),
    blogSchemaId: extractScalar(section, 'blog_schema_id'),
    authorPage: extractScalar(section, 'author_page'),
    inLanguage: extractScalar(section, 'inLanguage') || 'pt-BR',
    posts,
  };
}

export function parseSermons(upkfText) {
  const section = extractBlock(
    upkfText,
    '# Sermons & Theological Talks (56 items, itemized)\n',
    '\n\n---\n\n\n# Provenance & Derivation Specification',
  );
  if (!section) {
    return {
      collectionSchemaId: '',
      publisherRef: '',
      channelUrl: '',
      inLanguage: 'pt-BR',
      period: '',
      total: 0,
      collections: [],
    };
  }

  const headingRegex = /^## Collection:\s*(.+)$/gm;
  const headings = Array.from(section.matchAll(headingRegex)).map((match) => ({
    name: match[1].trim(),
    index: match.index ?? 0,
  }));

  const collections = [];
  for (let index = 0; index < headings.length; index += 1) {
    const start = headings[index].index;
    const end = headings[index + 1] ? headings[index + 1].index : section.length;
    const chunk = section.slice(start, end);

    const rows = parseMarkdownTable(chunk)
      .map((row) => ({
        position: Number(row['#'] || 0),
        name: row['name_pt-BR'] || '',
        datePublished: row.datePublished || '',
        youtubeUrl: row.youtube_url || '',
      }))
      .filter((row) => row.position > 0 && row.name && row.youtubeUrl);

    collections.push({
      name: headings[index].name,
      seriesSchemaId: extractScalar(chunk, 'series_schema_id'),
      items: rows,
    });
  }

  return {
    collectionSchemaId: extractScalar(section, 'collection_schema_id'),
    publisherRef: extractScalar(section, 'publisher_ref'),
    channelUrl: extractScalar(section, 'channel_url'),
    inLanguage: (extractScalar(section, 'inLanguage') || 'pt-BR').replace(/\s*\(.+$/, '').trim(),
    period: extractScalar(section, 'period'),
    total: Number(extractScalar(section, 'total') || 0),
    collections,
  };
}

export function parseMarkdownSections(markdown) {
  const frontmatterMatch = markdown.match(/^---\n[\s\S]*?\n---\n?/);
  const body = frontmatterMatch ? markdown.slice(frontmatterMatch[0].length) : markdown;
  const lines = body.split('\n');

  const sections = [];
  const stack = [];
  let current = null;
  let contentBuffer = [];

  const flushCurrent = () => {
    if (!current) {
      return;
    }
    current.content = contentBuffer.join('\n').trim();
    sections.push(current);
    contentBuffer = [];
  };

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushCurrent();
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();

      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      const parent = stack[stack.length - 1] || null;
      current = {
        id: `sec-${sections.length + 1}`,
        level,
        title,
        parentId: parent ? parent.id : null,
        content: '',
      };
      stack.push({ id: current.id, level });
      continue;
    }

    if (current) {
      contentBuffer.push(line);
    }
  }

  flushCurrent();
  return sections;
}
