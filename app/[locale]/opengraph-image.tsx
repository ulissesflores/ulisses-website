import { ImageResponse } from 'next/og';

// Default Open Graph / Twitter card for all [locale] routes (1200x630).
// Replaces the previous 350x401 JPG (declared as 1200x630 — a size lie that
// produced blurry/letterboxed link unfurls). Branded card in the site palette.
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Ulisses Flores — Codex Hash Research Laboratory';

export default function OpengraphImage() {
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
          background: 'linear-gradient(135deg, #0b1220 0%, #0a0a0a 100%)',
          fontFamily: 'system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', width: 64, height: 8, background: '#34d399', marginBottom: 40 }} />
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 800, color: '#ffffff', letterSpacing: '-2px' }}>
          Ulisses Flores
        </div>
        <div style={{ display: 'flex', fontSize: 36, fontWeight: 600, color: '#34d399', marginTop: 16 }}>
          Codex Hash Research Laboratory
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#a3a3a3', marginTop: 28, maxWidth: 900, lineHeight: 1.35 }}>
          AI · complex systems · cryptographic infrastructure · research-to-production
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#d4d4d4', marginTop: 'auto' }}>
          ulissesflores.com
        </div>
      </div>
    ),
    { ...size },
  );
}
