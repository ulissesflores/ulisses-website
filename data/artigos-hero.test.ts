import { describe, it, expect } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { artigos } from './artigos';
import { supportedLocales } from './i18n';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🖼️  Capa por locale — o gate que substituiu o `locale === defaultLocale`
 * ───────────────────────────────────────────────────────────────────────────────
 *  Enquanto a capa valia num locale só, a condição no template era a garantia.
 *  Com um mapa por locale, quem garante é isto: caminho no `hero` que não tem
 *  arquivo em `public/` é `<img>` quebrado na página e `og:image` 404 no unfurl —
 *  e nada no build reclama, porque `next/image` só descobre em runtime e o
 *  `og:image` é uma string de metadado.
 *
 *  O teto de peso do card existe pelo mesmo motivo de o `hero-og.png` ser um
 *  arquivo separado do `hero.png`: acima de ~300 KB o WhatsApp desiste do unfurl
 *  sem dizer nada, e o link circula sem imagem nenhuma.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const PUBLIC_DIR = new URL('../public', import.meta.url).pathname;
const OG_MAX_KB = 300;

const capas = artigos.flatMap((artigo) =>
  Object.entries(artigo.hero?.locales ?? {}).map(([locale, capa]) => ({
    slug: artigo.slug,
    locale,
    ...capa,
  })),
);

describe('Capas dos artigos', () => {
  it('todo caminho declarado em `hero` existe em public/', () => {
    const ausentes = capas
      .flatMap((c) => [c.src, c.og].map((p) => ({ ...c, p })))
      .filter(({ p }) => !existsSync(join(PUBLIC_DIR, p)))
      .map(({ slug, locale, p }) => `${slug} (${locale}): ${p}`);
    expect(ausentes).toEqual([]);
  });

  it(`nenhum card de compartilhamento passa de ${OG_MAX_KB} KB`, () => {
    const pesados = capas
      .map((c) => ({ ...c, kb: statSync(join(PUBLIC_DIR, c.og)).size / 1024 }))
      .filter(({ kb }) => kb > OG_MAX_KB)
      .map(({ slug, locale, kb }) => `${slug} (${locale}): ${kb.toFixed(0)} KB`);
    expect(pesados).toEqual([]);
  });

  it('só declara locale que o site serve', () => {
    const forasteiros = capas
      .filter((c) => !supportedLocales.includes(c.locale as (typeof supportedLocales)[number]))
      .map((c) => `${c.slug}: ${c.locale}`);
    expect(forasteiros).toEqual([]);
  });
});
