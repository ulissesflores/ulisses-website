import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SERMON_REDIRECTS } from './data/seo/sermon-redirects';

// ─── Constants ─────────────────────────────────────────────────────────────────

const SUPPORTED_LOCALES = new Set(['pt-br', 'en', 'es', 'it', 'he']);
const DEFAULT_LOCALE = 'pt-br';

const AI_BOT_REGEX = /GPTBot|ClaudeBot|Google-Extended|OAI-SearchBot|PerplexityBot|ChatGPT-User/i;

const REWRITABLE_PREFIXES = [
  '/identidade',
  '/research',
  '/whitepapers',
  '/essays',
  '/acervo-teologico',
  '/mundo-politico',
  '/certifications',
  '/simulacoes',
  '/clube-santo',
  '/projeto-psi',
];

const PREFIX_ALIASES: [string, string][] = [
  ['/pesquisa', '/research'],
  ['/ensaios', '/essays'],
  ['/certificacoes', '/certifications'],
  ['/sermons', '/acervo-teologico'],
];

const DUPLICATED_COLLECTION_SEGMENTS = [
  'research',
  'whitepapers',
  'essays',
  'acervo-teologico',
  'mundo-politico',
  'certifications',
  'simulacoes',
  'pesquisa',
  'ensaios',
  'certificacoes',
  'sermons',
  'clube-santo',
  'projeto-psi',
];

const INFRA_PATHS = new Set([
  '/favicon.ico',
  '/robots.txt',
  '/feed.xml',
  '/sitemap.xml',
  '/sitemap-resources.xml',
  '/llms.txt',
  '/llms-full.txt',
]);

const DOUBLE_LOCALE_PATTERN = /^\/(pt-br|en|es|he|it)\/(pt-br|en|es|he|it)(\/|$)/i;
const SINGLE_LOCALE_PATTERN = /^\/(pt-br|en|es|he|it)(\/|$)/i;

// ─── Pure utility functions (exported for testing) ─────────────────────────────

export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) {
    return '/';
  }

  const [first, ...rest] = segments;
  if (SUPPORTED_LOCALES.has(first.toLowerCase())) {
    return rest.length > 0 ? `/${rest.join('/')}` : '/';
  }
  return pathname;
}

export function isRewritablePublicRoute(pathname: string): boolean {
  if (pathname === '/') {
    return true;
  }
  return REWRITABLE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function toMarkdownPath(pathname: string): string {
  if (pathname === '/') {
    return '/index.md';
  }
  return `${pathname}.md`;
}

export function collapseDuplicatedPrefix(pathname: string): string {
  let normalized = pathname;
  DUPLICATED_COLLECTION_SEGMENTS.forEach((segment) => {
    const duplicatedPrefix = `/${segment}/${segment}/`;
    while (normalized.includes(duplicatedPrefix)) {
      normalized = normalized.replace(duplicatedPrefix, `/${segment}/`);
    }
    if (normalized === `/${segment}/${segment}`) {
      normalized = `/${segment}`;
    }
  });
  return normalized;
}

export function mapPtAliases(pathname: string): string {
  for (const [aliasPrefix, canonicalPrefix] of PREFIX_ALIASES) {
    if (pathname === aliasPrefix) {
      return canonicalPrefix;
    }
    if (pathname.startsWith(`${aliasPrefix}/`)) {
      return `${canonicalPrefix}${pathname.slice(aliasPrefix.length)}`;
    }
  }
  return pathname;
}

/** Extract locale from first path segment, returns null if not a supported locale */
export function extractLocale(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;
  const first = segments[0].toLowerCase();
  return SUPPORTED_LOCALES.has(first) ? first : null;
}

// ─── Middleware ─────────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const rawPathname = request.nextUrl.pathname;

  // ─── 1. Double-locale URLs (e.g. /he/en/path) → 410 Gone ──────────
  // Corrupted URLs from erroneous cross-locale crawling.
  // 410 = strongest signal for search engines to permanently de-index.
  if (DOUBLE_LOCALE_PATTERN.test(rawPathname)) {
    return new NextResponse(null, {
      status: 410,
      statusText: 'Gone',
      headers: {
        'X-Robots-Tag': 'noindex',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  }

  // ─── 1b. Legacy URL redirects (sermons, aliases) → 301 ──────────
  // Handles: /sermons/old-cluster/old-slug → /acervo-teologico/new-cluster/new-slug
  // Also handles PT aliases: /pesquisa → /research, /ensaios → /essays, etc.
  const strippedForAlias = stripLocalePrefix(rawPathname);
  const exactRedirect = SERMON_REDIRECTS[strippedForAlias];
  const aliased = exactRedirect
    || (strippedForAlias.startsWith('/sermons/') ? '/acervo-teologico' : mapPtAliases(strippedForAlias));
  if (aliased !== strippedForAlias) {
    const url = request.nextUrl.clone();
    const localePrefix = extractLocale(rawPathname);
    url.pathname = localePrefix && localePrefix !== DEFAULT_LOCALE
      ? `/${localePrefix}${aliased}`
      : aliased;
    return NextResponse.redirect(url, 301);
  }

  // ─── 2. Locale prefix routing ─────────────────────────────────────
  const localeMatch = SINGLE_LOCALE_PATTERN.exec(rawPathname);

  if (localeMatch) {
    const locale = localeMatch[1].toLowerCase();

    // /pt-br/path → 301 redirect to /path (default locale has no prefix)
    if (locale === DEFAULT_LOCALE) {
      const stripped = stripLocalePrefix(rawPathname);
      const url = request.nextUrl.clone();
      url.pathname = stripped;
      return NextResponse.redirect(url, 301);
    }

    // /en/path, /es/path, /it/path, /he/path → pass through to [locale] routes
    // The URL already has the locale prefix matching app/[locale]/ structure
    // Fall through to AI bot check below
  }

  // ─── 3. Bare path (no locale prefix) → rewrite to /pt-br/path ─────
  // Invisible rewrite: user sees /clube-santo, Next.js resolves /pt-br/clube-santo
  if (!localeMatch) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${rawPathname === '/' ? '' : rawPathname}`;
    return NextResponse.rewrite(url);
  }

  // ─── 4. AI bot markdown rewrite (bot-only) ────────────────────────
  const ua = request.headers.get('user-agent') || '';

  if (!AI_BOT_REGEX.test(ua)) {
    return NextResponse.next();
  }

  // Already .md → pass through
  if (rawPathname.endsWith('.md')) {
    return NextResponse.next();
  }

  // Infrastructure paths → pass through
  if (INFRA_PATHS.has(rawPathname) || rawPathname.startsWith('/.well-known/')) {
    return NextResponse.next();
  }

  // File with extension → pass through
  if (/\.[a-z0-9]+$/i.test(rawPathname)) {
    return NextResponse.next();
  }

  // Normalize and rewrite to markdown for AI bots
  const trimmedPathname =
    rawPathname.length > 1 && rawPathname.endsWith('/') ? rawPathname.slice(0, -1) : rawPathname;
  const canonicalPathname = mapPtAliases(
    collapseDuplicatedPrefix(stripLocalePrefix(trimmedPathname)),
  );

  if (!isRewritablePublicRoute(canonicalPathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = toMarkdownPath(canonicalPathname);
  return NextResponse.rewrite(url);
}

// ─── Matcher ───────────────────────────────────────────────────────────────────
// Blindado: ignores _next internals, API routes, infrastructure files, and any
// URL with a file extension (covers .ico, .jpg, .webp, .jsonld, .txt, .md, etc.)

export const config = {
  matcher: [
    '/((?!api|_next|favicon\\.ico|robots\\.txt|sitemap.*|feed\\.xml|\\.well-known|.*\\.[a-z0-9]{2,5}$).*)',
    // Catch double-locale URLs even with file extensions (.pdf, .docx, etc.)
    '/(pt-br|en|es|he|it)/(pt-br|en|es|he|it)/:path*',
  ],
};
