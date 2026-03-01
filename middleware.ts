import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AI_BOT_REGEX = /GPTBot|ClaudeBot|Google-Extended|OAI-SearchBot|PerplexityBot|ChatGPT-User/i;
const DENSE_PREFIXES = ['/identidade', '/research', '/whitepapers', '/essays', '/acervo-teologico', '/mundo-politico'];

function isDenseRoute(pathname: string): boolean {
  return DENSE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request: NextRequest) {
  const ua = request.headers.get('user-agent') || '';
  const pathname = request.nextUrl.pathname;

  if (!AI_BOT_REGEX.test(ua)) {
    return NextResponse.next();
  }

  if (pathname === '/' || pathname.endsWith('.md') || !isDenseRoute(pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `${pathname}.md`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.*|robots.*).*)',
};
