import { ImageResponse } from 'next/og';
import { artigos, localizeArtigo } from '@/data/artigos';
import { supportedLocales, type Locale } from '@/data/i18n';

// Card por artigo (1200x630). Sem isto, todo post do blog compartilha o card
// genérico de `app/[locale]/opengraph-image.tsx` e o unfurl não diz qual artigo é.
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return supportedLocales.flatMap((locale) => artigos.map((artigo) => ({ locale, slug: artigo.slug })));
}

export const alt = 'Artigo de Ulisses Flores';

export default async function ArtigoOpengraphImage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const artigo = artigos.find((item) => item.slug === slug);
  const title = artigo ? localizeArtigo(artigo, locale).title : 'Ulisses Flores';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '88px 96px',
          background: 'linear-gradient(135deg, #101d2a 0%, #0b1420 100%)',
          fontFamily: 'system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', width: 64, height: 8, background: '#a48f65', marginBottom: 40 }} />
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 80 ? 54 : 64,
            fontWeight: 800,
            color: '#f5f0e6',
            letterSpacing: '-1.5px',
            lineHeight: 1.18,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 'auto',
            fontSize: 26,
            color: '#c4ad7f',
          }}
        >
          <div style={{ display: 'flex' }}>Ulisses Flores</div>
          <div style={{ display: 'flex', color: '#a3a3a3' }}>ulissesflores.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
