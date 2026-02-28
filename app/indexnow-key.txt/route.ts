const fallbackIndexNowKey = 'ulissesflores-indexnow-2026-key';

export const revalidate = 3600;

export async function GET() {
  const key = (process.env.INDEXNOW_KEY || fallbackIndexNowKey).trim();
  return new Response(`${key}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
