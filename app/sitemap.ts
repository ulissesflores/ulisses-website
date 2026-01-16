import { publications } from '@/data/publications';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ulissesflores.com';

  // Mapeamento dinâmico das publicações baseado nas categorias do Lattes [cite: 116, 117]
  const publicationEntries = publications.map((pub) => {
    // Definimos a prioridade baseada na relevância científica (SOTA) [cite: 533, 608]
    const priority = pub.category === 'research' ? 0.9 : 0.7;
    
    return {
      url: `${baseUrl}/${pub.category}/${pub.id}`,
      lastModified: new Date(), // Idealmente, use pub.lastUpdated se houver no data
      changeFrequency: 'monthly' as const,
      priority: priority,
    };
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    ...publicationEntries,
  ];
}