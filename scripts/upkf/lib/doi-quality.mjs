import { buildDoiTarget, htmlEscape } from './text.mjs';

function countWords(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function clampScore(value) {
  return Math.max(0, Math.min(1000, Math.round(value)));
}

function scoreFromWordCount(wordCount, minWords, targetWords) {
  if (wordCount <= 0) {
    return 0;
  }
  if (wordCount <= minWords) {
    return clampScore((wordCount / minWords) * 900);
  }
  if (wordCount >= targetWords) {
    return 1000;
  }
  const ratio = (wordCount - minWords) / Math.max(1, targetWords - minWords);
  return clampScore(900 + ratio * 100);
}

function computeArticleQuality(publication) {
  const abstractWords = countWords(publication.sections.abstract);
  const introWords = countWords(publication.sections.introduction);
  const methodsWords = countWords(publication.sections.methods);
  const resultsWords = countWords(publication.sections.results);
  const discussionWords = countWords(publication.sections.discussion);
  const conclusionWords = countWords(publication.sections.conclusion);
  const developmentWords = methodsWords + resultsWords + discussionWords;
  const referencesCount = publication.sections.references.length;
  const referencesWithUrl = publication.sections.references.filter((item) => Boolean(item.url)).length;
  const seoSignals =
    (publication.summary ? 1 : 0) +
    (publication.tags.length >= 2 ? 1 : 0) +
    (publication.canonicalUrl.startsWith('https://ulissesflores.com/') ? 1 : 0) +
    (publication.downloadUrl.endsWith('.pdf') ? 1 : 0);

  const partScores = {
    resumo: scoreFromWordCount(abstractWords, 120, 170),
    introducao: scoreFromWordCount(introWords, 170, 260),
    desenvolvimento: scoreFromWordCount(developmentWords, 420, 650),
    consideracoesFinais: scoreFromWordCount(conclusionWords, 120, 180),
    referencias: clampScore(Math.min(1, referencesCount / 6) * 700 + Math.min(1, referencesWithUrl / 5) * 300),
    seoGeo: clampScore((seoSignals / 4) * 1000),
  };

  const finalScore = clampScore(
    Object.values(partScores).reduce((sum, score) => sum + score, 0) / Object.values(partScores).length,
  );

  const lowPartActions = [];
  if (partScores.resumo < 950) {
    lowPartActions.push('Expandir resumo com objetivo, metodo e resultado mensuravel.');
  }
  if (partScores.introducao < 950) {
    lowPartActions.push('Detalhar lacuna cientifica e pergunta de pesquisa na introducao.');
  }
  if (partScores.desenvolvimento < 950) {
    lowPartActions.push('Aumentar profundidade de metodo/resultados/discussao com evidencias adicionais.');
  }
  if (partScores.consideracoesFinais < 950) {
    lowPartActions.push('Reforcar limitacoes e agenda de pesquisa futura na conclusao.');
  }
  if (partScores.referencias < 950) {
    lowPartActions.push('Adicionar referencias com DOI/URL verificavel e maior diversidade bibliografica.');
  }
  if (partScores.seoGeo < 950) {
    lowPartActions.push('Revisar metadados canonicos, tags e consistencia de URLs de distribuicao.');
  }

  const improvementActions = finalScore < 950 ? lowPartActions : [];

  return {
    id: publication.id,
    title: publication.title,
    canonicalUrl: publication.canonicalUrl,
    partScores,
    finalScore,
    approvedSota: finalScore >= 950,
    improvementActions,
    metrics: {
      abstractWords,
      introWords,
      developmentWords,
      conclusionWords,
      referencesCount,
      referencesWithUrl,
    },
  };
}

export function buildProjectQualityReport(publications, generatedAt) {
  const articles = publications.map((publication) => computeArticleQuality(publication));
  const projectScore = clampScore(
    articles.reduce((sum, article) => sum + article.finalScore, 0) / Math.max(1, articles.length),
  );

  const pendingActions = articles
    .filter((article) => !article.approvedSota)
    .flatMap((article) => article.improvementActions.map((action) => `[${article.id}] ${action}`));

  return {
    generatedAt,
    rubric: 'Yape model (Resumo, Introducao, Desenvolvimento, Consideracoes Finais, Referencias, SEO/GEO)',
    threshold: 950,
    projectScore,
    approvedSota: projectScore >= 950 && pendingActions.length === 0,
    pendingActions,
    articles,
  };
}

export function buildProjectQualityMarkdown(report) {
  const lines = [
    '# Scientific Article Quality Report (Generated)',
    '',
    `- Generated at: ${report.generatedAt}`,
    `- Rubric: ${report.rubric}`,
    `- Threshold (SOTA): ${report.threshold}`,
    `- Project score: ${report.projectScore}/1000`,
    `- Approved: ${report.approvedSota ? 'yes' : 'no'}`,
    '',
    '## Per-Article Scores',
    '',
    '| Slug | Resumo | Introducao | Desenvolvimento | Consideracoes Finais | Referencias | SEO/GEO | Final | SOTA |',
    '|:--|--:|--:|--:|--:|--:|--:|--:|:--:|',
    ...report.articles.map(
      (article) =>
        `| ${article.id} | ${article.partScores.resumo} | ${article.partScores.introducao} | ${article.partScores.desenvolvimento} | ${article.partScores.consideracoesFinais} | ${article.partScores.referencias} | ${article.partScores.seoGeo} | ${article.finalScore} | ${article.approvedSota ? 'yes' : 'no'} |`,
    ),
    '',
    '## Improvement Actions',
  ];

  if (report.pendingActions.length === 0) {
    lines.push('- Nenhuma acao pendente: todos os artigos atingiram o limiar SOTA.');
  } else {
    lines.push(...report.pendingActions.map((action) => `- ${action}`));
  }

  lines.push('');
  return `${lines.join('\n')}\n`;
}

function scoreDoiReadinessItem(item) {
  const requiredFields = [
    item.slug,
    item.title,
    item.canonicalUrl,
    item.pdfUrl,
    item.publishedAt,
    item.language,
    item.version,
    item.license,
    item.creators?.[0]?.name,
    item.creators?.[0]?.orcid,
  ];

  const completenessScore = clampScore(
    (requiredFields.filter(Boolean).length / requiredFields.length) * 1000,
  );

  const referencesCount = Array.isArray(item.references) ? item.references.length : 0;
  const referencesWithUrl = item.references.filter((reference) => Boolean(reference.url)).length;
  const referencesScore = clampScore(
    Math.min(1, referencesCount / 6) * 700 + Math.min(1, referencesWithUrl / 6) * 300,
  );

  const identifierSignals =
    (item.canonicalUrl.startsWith('https://ulissesflores.com/') ? 1 : 0) +
    (item.pdfUrl.startsWith('https://ulissesflores.com/') ? 1 : 0) +
    (item.cffPath.startsWith('/doi/') ? 1 : 0) +
    (item.zenodoPath.startsWith('/doi/') ? 1 : 0) +
    (item.crossrefPath.startsWith('/doi/') ? 1 : 0);
  const identifierScore = clampScore((identifierSignals / 5) * 1000);

  const workflowSignals =
    (item.zenodoMetadata?.metadata?.upload_type === 'publication' ? 1 : 0) +
    (Boolean(item.zenodoMetadata?.metadata?.publication_type) ? 1 : 0) +
    (Array.isArray(item.zenodoMetadata?.metadata?.related_identifiers) ? 1 : 0) +
    (Boolean(item.crossrefMetadata?.title) ? 1 : 0) +
    (Array.isArray(item.crossrefMetadata?.authors) ? 1 : 0) +
    (item.doi?.status === 'target' && Boolean(item.doi?.target) ? 1 : 0);
  const workflowScore = clampScore((workflowSignals / 6) * 1000);

  const cffSignals =
    (item.citationCff.includes('cff-version: 1.2.0') ? 1 : 0) +
    (!item.citationCff.includes('\ndoi:') ? 1 : 0) +
    (item.citationCff.includes('DOI target:') ? 1 : 0) +
    (item.citationCff.includes('authors:') ? 1 : 0) +
    (item.citationCff.includes('references:') ? 1 : 0);
  const cffScore = clampScore((cffSignals / 5) * 1000);

  const finalScore = clampScore(
    (completenessScore + referencesScore + identifierScore + workflowScore + cffScore) / 5,
  );

  return {
    completenessScore,
    referencesScore,
    identifierScore,
    workflowScore,
    cffScore,
    finalScore,
  };
}

function buildPublicationType(publication) {
  if (publication.kind === 'R') {
    return 'report';
  }
  if (publication.category === 'essays') {
    return 'article';
  }
  return 'article';
}

function buildCitationCff(item, generatedAt) {
  const referencesBlock = item.references
    .map((reference) => {
      const parts = [`  - unstructured: "${reference.citation.replace(/"/g, '\\"')}"`];
      if (reference.url) {
        parts.push(`    url: "${reference.url}"`);
      }
      return parts.join('\n');
    })
    .join('\n');

  return `cff-version: 1.2.0
message: "If you use this work, cite with this metadata. DOI target: ${item.doi.target} (not minted)."
title: "${item.title.replace(/"/g, '\\"')}"
type: article
authors:
  - family-names: "${item.creators[0].familyName}"
    given-names: "${item.creators[0].givenName}"
    orcid: "${item.creators[0].orcid}"
identifiers:
  - type: url
    value: "${item.canonicalUrl}"
  - type: url
    value: "${item.pdfUrl}"
abstract: "${item.abstract.replace(/\s+/g, ' ').replace(/"/g, '\\"')}"
keywords: [${item.keywords.map((keyword) => `"${keyword}"`).join(', ')}]
license: "${item.license}"
version: "${item.version}"
date-released: "${generatedAt}"
repository-code: "${item.canonicalUrl}"
references:
${referencesBlock}
`;
}

export function buildDoiReadyPackage(publications, identity, generatedAt) {
  const creator = {
    name: 'Flores, Carlos Ulisses',
    givenName: 'Carlos Ulisses',
    familyName: 'Flores',
    affiliation: 'Codex Hash Research',
    orcid: identity.orcid || '0000-0002-6034-7765',
  };

  const items = publications.map((publication) => {
    const publicationType = buildPublicationType(publication);
    const doiTarget = publication.doi?.target || buildDoiTarget(publication);
    const references = publication.sections.references.map((reference) => ({
      citation: reference.citation,
      url: reference.url || '',
    }));
    const canonicalUrl = publication.canonicalUrl;
    const pdfUrl = `https://ulissesflores.com${publication.primaryPdfUrl || publication.downloadUrl}`;
    const version = `v${generatedAt}`;
    const descriptionHtml = `<p>${htmlEscape(publication.sections.abstract)}</p>`;
    const cffPath = `/doi/${publication.id}/CITATION.cff`;
    const zenodoPath = `/doi/${publication.id}/zenodo.json`;
    const crossrefPath = `/doi/${publication.id}/crossref.json`;

    const zenodoMetadata = {
      metadata: {
        title: publication.title,
        upload_type: 'publication',
        publication_type: publicationType,
        publication_date: publication.publishedAt,
        description: descriptionHtml,
        creators: [
          {
            name: creator.name,
            affiliation: creator.affiliation,
            orcid: creator.orcid,
          },
        ],
        keywords: publication.tags,
        language: publication.inLanguage,
        references: references.map((reference) =>
          reference.url ? `${reference.citation} (${reference.url})` : reference.citation,
        ),
        related_identifiers: [
          {
            identifier: canonicalUrl,
            relation: 'isSupplementTo',
            resource_type: 'publication-article',
          },
          {
            identifier: pdfUrl,
            relation: 'isIdenticalTo',
            resource_type: 'publication-article',
          },
        ],
        version,
        notes: `DOI-ready metadata generated automatically from the canonical UPKF publication dataset. DOI target: ${doiTarget} (not minted).`,
        license: 'CC-BY-4.0',
      },
    };

    const crossrefMetadata = {
      schema: 'https://data.crossref.org/schemas/crossref_input.json',
      type: publicationType,
      title: publication.title,
      abstract: publication.sections.abstract,
      authors: [
        {
          given: creator.givenName,
          family: creator.familyName,
          ORCID: `https://orcid.org/${creator.orcid}`,
          affiliation: creator.affiliation,
        },
      ],
      issued: publication.publishedAt,
      language: publication.inLanguage,
      URL: canonicalUrl,
      resource: {
        primary: {
          URL: canonicalUrl,
        },
        pdf: {
          URL: pdfUrl,
        },
      },
      reference: references.map((reference, index) => ({
        key: `${publication.id}-ref-${index + 1}`,
        unstructured: reference.citation,
        DOI: reference.url.startsWith('https://doi.org/')
          ? reference.url.replace('https://doi.org/', '')
          : undefined,
        URL: reference.url || undefined,
      })),
      doi_target: doiTarget,
    };

    const item = {
      slug: publication.id,
      title: publication.title,
      category: publication.category,
      publicationType,
      kind: publication.kind,
      publishedAt: publication.publishedAt,
      language: publication.inLanguage,
      canonicalUrl,
      pdfUrl,
      doi: {
        status: 'target',
        target: doiTarget,
      },
      version,
      license: 'CC-BY-4.0',
      creators: [creator],
      keywords: publication.tags,
      abstract: publication.sections.abstract,
      references,
      cffPath,
      zenodoPath,
      crossrefPath,
      zenodoMetadata,
      crossrefMetadata,
      citationCff: '',
    };

    const citationCff = buildCitationCff(item, publication.publishedAt);
    item.citationCff = citationCff;
    item.score = scoreDoiReadinessItem(item);
    item.approved = item.score.finalScore >= 950;

    return item;
  });

  const taskScore = clampScore(
    items.reduce((sum, item) => sum + item.score.finalScore, 0) / Math.max(1, items.length),
  );
  const threshold = 950;
  const pending = items.filter((item) => !item.approved).map((item) => item.slug);

  return {
    generatedAt,
    threshold,
    taskScore,
    approved: taskScore >= threshold && pending.length === 0,
    pending,
    items,
  };
}

export function buildDoiReadyMarkdown(doiReady) {
  const lines = [
    '# DOI Ready Report (Generated)',
    '',
    `- Generated at: ${doiReady.generatedAt}`,
    `- Threshold: ${doiReady.threshold}`,
    `- Task score: ${doiReady.taskScore}/1000`,
    `- Approved: ${doiReady.approved ? 'yes' : 'no'}`,
    '',
    '## Per-Article Score',
    '',
    '| Slug | DOI status | DOI target | Completeness | References | Identifiers | Workflow | CFF | Final | Approved |',
    '|:--|:--:|:--|--:|--:|--:|--:|--:|--:|:--:|',
    ...doiReady.items.map(
      (item) =>
        `| ${item.slug} | ${item.doi?.status || 'target'} | ${item.doi?.target || '-'} | ${item.score.completenessScore} | ${item.score.referencesScore} | ${item.score.identifierScore} | ${item.score.workflowScore} | ${item.score.cffScore} | ${item.score.finalScore} | ${item.approved ? 'yes' : 'no'} |`,
    ),
    '',
  ];

  if (doiReady.pending.length > 0) {
    lines.push('## Pending');
    lines.push(...doiReady.pending.map((slug) => `- ${slug}`));
  } else {
    lines.push('## Pending');
    lines.push('- None');
  }

  lines.push('');
  return `${lines.join('\n')}\n`;
}
