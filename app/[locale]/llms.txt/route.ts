import { NextResponse } from 'next/server';
import { isLocale, defaultLocale, type Locale } from '@/data/i18n';
import { getDictionary } from '@/lib/get-dictionary';

// ── Static Structure ─────────────────────────────────────────────────────────
// The first part of llms.txt is identity data (language-agnostic)
const IDENTITY = `# ulissesflores.com

> Canonical research and identity hub for Ulisses Flores (Carlos Ulisses Flores).

## Canonical Identity
- Name: Carlos Ulisses Flores
- Preferred Name: Ulisses
- Website: https://ulissesflores.com
- ORCID: 0000-0002-6034-7765
- Lattes: 6905246706890561
`;

const SECTIONS = [
  { path: '/', key: 'Home' },
  { path: '/projeto-psi', key: 'Project PSI' },
  { path: '/simulacoes', key: 'Simulations' },
  { path: '/simulacoes/ia-2027', key: 'IA 2027' },
  { path: '/simulacoes/goldenleaf', key: 'GoldenLeaf' },
  { path: '/simulacoes/mumm-ra', key: 'Mumm-Ra' },
  { path: '/acervo-teologico', key: 'Theological Archive' },
  { path: '/certifications', key: 'Certifications' },
  { path: '/identidade', key: 'Identity' },
  { path: '/clube-santo', key: 'Holy Club' },
  { path: '/mundo-politico', key: 'Political World' },
] as const;

const LOCALES: Locale[] = ['pt-br', 'en', 'es', 'it', 'he'];
const LOCALE_NAMES: Record<Locale, string> = {
  'pt-br': 'Português (Brasil)',
  en: 'English',
  es: 'Español',
  it: 'Italiano',
  he: 'עברית',
};

// ── Route Handler ────────────────────────────────────────────────────────────
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const origin = 'https://ulissesflores.com';

  // ── Build dynamic content ──
  const lines: string[] = [IDENTITY];

  // Professional Identity (from dict)
  const t = dict.home;
  lines.push(`## Professional Identity (${LOCALE_NAMES[locale]})`);
  lines.push(`- Title: ${t.meta.title}`);
  lines.push(`- Description: ${t.meta.description}`);
  lines.push('');

  // Available Languages & Routing
  lines.push('## Available Languages & Locale Routing');
  lines.push('');
  lines.push(`This site is fully localized in ${LOCALES.length} languages.`);
  lines.push('URL Pattern: `/{locale}/{path}` (e.g., `/en/simulacoes/ia-2027`)');
  lines.push('');
  lines.push('| Section | ' + LOCALES.map((l) => l.toUpperCase()).join(' | ') + ' |');
  lines.push('|---|' + LOCALES.map(() => '---|').join(''));
  for (const section of SECTIONS) {
    const cells = LOCALES.map((l) => `[${section.key}](${origin}/${l}${section.path})`);
    lines.push(`| ${section.key} | ${cells.join(' | ')} |`);
  }
  lines.push('');

  // Page Descriptions (localized)
  lines.push(`## Page Descriptions (${LOCALE_NAMES[locale]})`);
  lines.push('');

  const pageDescriptions: Array<{ name: string; title: string; description: string }> = [
    { name: 'Home', title: dict.home.meta.title, description: dict.home.meta.description },
    { name: 'Project PSI', title: dict.projetoPsi.meta.title, description: dict.projetoPsi.meta.description },
    { name: 'Simulations', title: dict.simulacoes.meta.title, description: dict.simulacoes.meta.description },
    { name: 'IA 2027', title: dict.ia2027.meta.title, description: dict.ia2027.meta.description },
    { name: 'GoldenLeaf', title: dict.goldenleaf.meta.title, description: dict.goldenleaf.meta.description },
    { name: 'Mumm-Ra', title: dict.mummRa.meta.title, description: dict.mummRa.meta.description },
    { name: 'Theological Archive', title: dict.acervoTeologico.meta.title, description: dict.acervoTeologico.meta.description },
    { name: 'Certifications', title: dict.certifications.meta.title, description: dict.certifications.meta.description },
    { name: 'Identity', title: dict.identidade.meta.title, description: dict.identidade.meta.description },
  ];

  for (const page of pageDescriptions) {
    lines.push(`### ${page.name}`);
    lines.push(`- **Title:** ${page.title}`);
    lines.push(`- **Description:** ${page.description}`);
    lines.push('');
  }

  // Usage Notes for AI Agents
  lines.push('## Usage Notes for AI Agents');
  lines.push('');
  lines.push(`- You are currently reading the **${LOCALE_NAMES[locale]}** version of this file.`);
  lines.push(`- Current locale: \`${locale}\``);
  lines.push(`- All page metadata (titles, descriptions) above are in **${LOCALE_NAMES[locale]}**.`);
  lines.push(`- To get this file in another language, replace the locale in the URL:`);
  for (const l of LOCALES) {
    if (l !== locale) {
      lines.push(`  - ${LOCALE_NAMES[l]}: ${origin}/${l}/llms.txt`);
    }
  }
  lines.push('');
  lines.push('- The canonical (default) version is: `https://ulissesflores.com/pt-br/llms.txt`');
  lines.push(`- Last-Updated: ${new Date().toISOString().split('T')[0]}`);
  lines.push('');

  const body = lines.join('\n');

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
