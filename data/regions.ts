export interface GeoRegion {
  country: string;
  countryCode: string;
  cities: { name: string; lat: number; lng: number }[];
  timezone: string;
}

export const geoRegions: GeoRegion[] = [
  {
    country: 'Brasil',
    countryCode: 'BR',
    cities: [
      { name: 'São Paulo', lat: -23.5505, lng: -46.6333 },
      { name: 'Jundiaí', lat: -23.1857, lng: -46.8978 },
      { name: 'Campinas', lat: -22.9099, lng: -47.0626 },
      { name: 'Itupeva', lat: -23.1530, lng: -47.0578 },
    ],
    timezone: 'America/Sao_Paulo',
  },
  {
    country: 'El Salvador',
    countryCode: 'SV',
    cities: [{ name: 'San Salvador', lat: 13.6929, lng: -89.2182 }],
    timezone: 'America/El_Salvador',
  },
  {
    country: 'Itália',
    countryCode: 'IT',
    cities: [{ name: 'Roma', lat: 41.9028, lng: 12.4964 }],
    timezone: 'Europe/Rome',
  },
  {
    country: 'Israel',
    countryCode: 'IL',
    cities: [{ name: 'Tel Aviv', lat: 32.0853, lng: 34.7818 }],
    timezone: 'Asia/Jerusalem',
  },
  {
    country: 'Estados Unidos',
    countryCode: 'US',
    cities: [
      { name: 'Houston', lat: 29.7604, lng: -95.3698 },
      { name: 'Dallas', lat: 32.7767, lng: -96.7970 },
      { name: 'San Antonio', lat: 29.4241, lng: -98.4936 },
      { name: 'Frisco', lat: 33.1507, lng: -96.8236 },
      { name: 'Plano', lat: 33.0198, lng: -96.6989 },
      { name: 'Highland Park', lat: 32.8335, lng: -96.7920 },
    ],
    timezone: 'America/Chicago',
  },
];

/** Build JSON-LD areaServed array from regions */
export function buildAreaServed() {
  return geoRegions.flatMap((region) =>
    region.cities.map((city) => ({
      '@type': 'Place' as const,
      name: `${city.name}, ${region.country}`,
      geo: {
        '@type': 'GeoCoordinates' as const,
        latitude: city.lat,
        longitude: city.lng,
      },
      address: {
        '@type': 'PostalAddress' as const,
        addressCountry: region.countryCode,
        addressLocality: city.name,
      },
    })),
  );
}
