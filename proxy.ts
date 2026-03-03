import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AI_BOT_REGEX = /GPTBot|ClaudeBot|Google-Extended|OAI-SearchBot|PerplexityBot|ChatGPT-User/i;
const LOCALE_PREFIXES = new Set(['pt-br', 'en', 'es', 'it', 'he']);
const REWRITABLE_PREFIXES = [
  '/identidade',
  '/research',
  '/whitepapers',
  '/essays',
  '/acervo-teologico',
  '/mundo-politico',
  '/certifications',
  '/simulacoes',
];
const PREFIX_ALIASES = [
  ['/pesquisa', '/research'],
  ['/ensaios', '/essays'],
  ['/certificacoes', '/certifications'],
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

function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) {
    return '/';
  }

  const [first, ...rest] = segments;
  if (LOCALE_PREFIXES.has(first.toLowerCase())) {
    return rest.length > 0 ? `/${rest.join('/')}` : '/';
  }
  return pathname;
}

function isRewritablePublicRoute(pathname: string): boolean {
  if (pathname === '/') {
    return true;
  }
  return REWRITABLE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function toMarkdownPath(pathname: string): string {
  if (pathname === '/') {
    return '/index.md';
  }
  return `${pathname}.md`;
}

function collapseDuplicatedPrefix(pathname: string): string {
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

function mapPtAliases(pathname: string): string {
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

export { stripLocalePrefix, isRewritablePublicRoute, toMarkdownPath, collapseDuplicatedPrefix, mapPtAliases };

export function proxy(request: NextRequest) {
  const ua = request.headers.get('user-agent') || '';
  const rawPathname = request.nextUrl.pathname;

  if (!AI_BOT_REGEX.test(ua)) {
    return NextResponse.next();
  }

  if (rawPathname.endsWith('.md')) {
    return NextResponse.next();
  }

  if (INFRA_PATHS.has(rawPathname) || rawPathname.startsWith('/.well-known/')) {
    return NextResponse.next();
  }

  if (/\.[a-z0-9]+$/i.test(rawPathname)) {
    return NextResponse.next();
  }

  const trimmedPathname =
    rawPathname.length > 1 && rawPathname.endsWith('/') ? rawPathname.slice(0, -1) : rawPathname;
  const canonicalPathname = mapPtAliases(collapseDuplicatedPrefix(stripLocalePrefix(trimmedPathname)));

  if (!isRewritablePublicRoute(canonicalPathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = toMarkdownPath(canonicalPathname);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico|robots.txt|sitemap.*|feed.xml|\\.well-known/.*).*)',
  ],
};
