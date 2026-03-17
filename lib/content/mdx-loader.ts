/**
 * ══════════════════════════════════════════════════════════════════════
 * MDX Content Loader — Reads and compiles MDX from content/ directory
 * ══════════════════════════════════════════════════════════════════════
 *
 * Lote 28: Provides server-side MDX loading for Next.js App Router.
 * Reads .mdx files from content/{publications,essays,whitepapers,simulations}/
 * and returns compiled MDX + frontmatter metadata.
 *
 * Usage:
 *   const { frontmatter, source } = await loadMdx('publications', '2025-little-law-resilience', 'pt-br');
 *   // Then render with <MDXRemote source={source} components={mdxComponents} />
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import type { ReactElement } from 'react';

export interface ContentFrontmatter {
  title: string;
  slug: string;
  category: string;
  date: string;
  language: string;
  canonicalUrl?: string;
  focus?: string;
  problem?: string;
  method?: string;
  result?: string;
  discussion?: string;
  application?: string;
  contributions?: string[];
  references?: string[];
  translations?: Record<string, string>;
  doi?: { status: string; target: string };
  type?: string;
  description?: string;
  components?: string[];
}

export interface MdxContent {
  frontmatter: ContentFrontmatter;
  content: ReactElement;
  rawBody: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content');

/**
 * Get the file path for a specific content item and locale.
 */
function getContentPath(
  contentType: string,
  slug: string,
  locale: string,
): string {
  return path.join(CONTENT_DIR, contentType, slug, `index.${locale}.mdx`);
}

/**
 * Check if a content item exists for a given locale.
 */
export function contentExists(
  contentType: string,
  slug: string,
  locale: string,
): boolean {
  return fs.existsSync(getContentPath(contentType, slug, locale));
}

/**
 * Load raw MDX content with frontmatter (no compilation).
 * Useful for metadata extraction without React rendering.
 */
export function loadRawMdx(
  contentType: string,
  slug: string,
  locale: string,
): { frontmatter: ContentFrontmatter; body: string } | null {
  const filePath = getContentPath(contentType, slug, locale);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return {
    frontmatter: data as ContentFrontmatter,
    body: content,
  };
}

/**
 * Load and compile MDX content for server-side rendering.
 * Returns compiled React element ready for rendering.
 */
export async function loadMdx(
  contentType: string,
  slug: string,
  locale: string,
  components?: Record<string, React.ComponentType<Record<string, unknown>>>,
): Promise<MdxContent | null> {
  const filePath = getContentPath(contentType, slug, locale);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content: rawBody } = matter(raw);

  const { content } = await compileMDX({
    source: rawBody,
    components: components ?? {},
    options: {
      parseFrontmatter: false,
    },
  });

  return {
    frontmatter: data as ContentFrontmatter,
    content,
    rawBody,
  };
}

/**
 * List all available slugs for a content type.
 */
export function listContentSlugs(contentType: string): string[] {
  const dir = path.join(CONTENT_DIR, contentType);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

/**
 * List all available locales for a specific content item.
 */
export function listContentLocales(
  contentType: string,
  slug: string,
): string[] {
  const dir = path.join(CONTENT_DIR, contentType, slug);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.startsWith('index.') && f.endsWith('.mdx'))
    .map((f) => f.replace('index.', '').replace('.mdx', ''))
    .sort();
}
