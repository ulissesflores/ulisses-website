import { ImageResponse } from 'next/og';

// Apple touch icon (file convention): solid background (iOS masks corners).
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          fontSize: 104,
          fontWeight: 800,
          letterSpacing: '-4px',
          fontFamily: 'system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
        }}
      >
        UF
      </div>
    ),
    { ...size },
  );
}
