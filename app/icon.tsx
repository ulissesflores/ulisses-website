import { ImageResponse } from 'next/og';

// Favicon (file convention): UF monogram in the brand palette.
// Replaces the previous large-JPG icon that caused browsers to fall back to
// the default (Vercel) favicon. Legible down to 16px.
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0b1220 0%, #0a0a0a 100%)',
          color: '#34d399',
          fontSize: 300,
          fontWeight: 800,
          letterSpacing: '-10px',
          fontFamily: 'system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
        }}
      >
        UF
      </div>
    ),
    { ...size },
  );
}
