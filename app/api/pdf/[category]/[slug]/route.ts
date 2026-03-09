import { NextResponse } from 'next/server';
import { publications } from '@/data/publications';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { buildPdfBuffer, markdownToPdfLines } from '@/lib/pdf-utils';

interface RouteParams {
  params: Promise<{ category: string; slug: string }>;
}

function buildArticleMarkdown(publication: (typeof publications)[number]): string {
  const sections = publication.articleSections;
  const lines: string[] = [];

  lines.push(`# ${publication.title}`);
  lines.push('');
  lines.push(`**Autor:** ${upkfMeta.publicDisplayName || upkfMeta.displayName}`);
  lines.push(`**Data:** ${publication.date}`);
  lines.push(`**Categoria:** ${publication.category}`);
  lines.push(`**DOI:** ${publication.doi.target || publication.doi.status}`);
  lines.push('');

  if (sections.abstract) {
    lines.push('## Resumo');
    lines.push('');
    lines.push(sections.abstract);
    lines.push('');
  }

  if (sections.abstractEn) {
    lines.push('## Abstract');
    lines.push('');
    lines.push(sections.abstractEn);
    lines.push('');
  }

  if (sections.introduction) {
    lines.push('## Introducao');
    lines.push('');
    lines.push(sections.introduction);
    lines.push('');
  }

  if (sections.methods) {
    lines.push('## Metodologia');
    lines.push('');
    lines.push(sections.methods);
    lines.push('');
  }

  if (sections.results) {
    lines.push('## Desenvolvimento e Resultados');
    lines.push('');
    lines.push(sections.results);
    lines.push('');
  }

  if (sections.discussion) {
    lines.push('## Discussao');
    lines.push('');
    lines.push(sections.discussion);
    lines.push('');
  }

  if (sections.recommendations?.length) {
    lines.push('## Recomendacoes');
    lines.push('');
    for (const rec of sections.recommendations) {
      lines.push(`- ${rec}`);
    }
    lines.push('');
  }

  if (sections.conclusion) {
    lines.push('## Conclusao');
    lines.push('');
    lines.push(sections.conclusion);
    lines.push('');
  }

  if (sections.references?.length) {
    lines.push('## Referencias');
    lines.push('');
    for (const ref of sections.references) {
      lines.push(`- ${ref.citation}${ref.url ? ` (${ref.url})` : ''}`);
    }
  }

  return lines.join('\n');
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { category, slug } = await params;

  const publication = publications.find(
    (item) => item.category === category && item.id === slug,
  );

  if (!publication) {
    return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
  }

  const markdown = buildArticleMarkdown(publication);
  const pdfBuffer = buildPdfBuffer({
    title: `${publication.title} - Deep Research`,
    author: upkfMeta.publicDisplayName || upkfMeta.displayName || 'Codex Hash Research',
    subject: `${publication.category} deep research article`,
    keywords: publication.tags.join(', '),
    lines: markdownToPdfLines(markdown),
    timestamp: publication.updatedAt || new Date().toISOString(),
  });

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${slug}.pdf"`,
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
