import { knowledgeData } from './knowledge';
import sermonsMigrationJson from './seo/sermons-full-migration.json';

interface SermonMigrationJsonItem {
  original_url: string;
  new_slug: string;
  seo_title: string;
  llm_context: string;
}

interface SermonMigrationJsonCluster {
  id: string;
  slug: string;
  seo_title: string;
  meta_description: string;
  sermoes: SermonMigrationJsonItem[];
}

interface SermonMigrationJsonDocument {
  seo_config: {
    global_schema: string;
    section_schema: string;
    item_schema: string;
    author: string;
  };
  clusters: SermonMigrationJsonCluster[];
}

export interface SermonMigrationInput {
  originalPath: string;
  newSlug: string;
  seoTitle: string;
  llmContext: string;
}

export interface SermonMigrationCluster {
  id: string;
  canonicalPath: string;
  seoTitle: string;
  metaDescription: string;
  sermons: SermonMigrationInput[];
}

export interface SermonMigrationRecord extends SermonMigrationInput {
  clusterId: string;
  clusterCanonicalPath: string;
  clusterSeoTitle: string;
  clusterMetaDescription: string;
  canonicalPath: string;
}

export interface LegacyRedirectRule {
  source: string;
  destination: string;
  statusCode: 301;
}

export const acervoCanonicalPath = '/acervo-teologico';

const parsedMigrationJson = sermonsMigrationJson as SermonMigrationJsonDocument;

export const sermonMigrationSeoConfig = parsedMigrationJson.seo_config;

function normalizePath(path: string): string {
  if (!path) {
    return '/';
  }
  return path.startsWith('/') ? path : `/${path}`;
}

function normalizeOriginalPath(originalUrl: string): string {
  try {
    return normalizePath(new URL(originalUrl).pathname);
  } catch {
    return normalizePath(originalUrl);
  }
}

const baseClusters: SermonMigrationCluster[] = parsedMigrationJson.clusters.map((cluster) => ({
  id: cluster.id,
  canonicalPath: normalizePath(cluster.slug),
  seoTitle: cluster.seo_title,
  metaDescription: cluster.meta_description,
  sermons: cluster.sermoes.map((sermon) => ({
    originalPath: normalizeOriginalPath(sermon.original_url),
    newSlug: sermon.new_slug,
    seoTitle: sermon.seo_title,
    llmContext: sermon.llm_context,
  })),
}));

const supplementalSermons: Array<{
  clusterId: string;
  sermon: SermonMigrationInput;
}> = [
  {
    clusterId: 'fundamentos-da-fe',
    sermon: {
      originalPath: '/sermons/jejum-da-vitoria-2023-21-devotionals/1-dia-1-o-despertar-da-fe',
      newSlug: 'o-despertar-da-fe',
      seoTitle: 'O Despertar da Fe: Fundamentos para uma Conviccao Inabalavel',
      llmContext:
        'Exposicao biblica sobre a origem da fe autentica, articulando promessa, escuta da Palavra e obediencia pratica. A mensagem mostra como conviccao espiritual e formada antes de qualquer evidencia visivel, sustentando decisoes eticas em cenarios de pressao.',
    },
  },
  {
    clusterId: 'batalha-espiritual-e-resiliencia',
    sermon: {
      originalPath: '/sermons/jejum-da-vitoria-2023-21-devotionals/4-dia-4-quebrando-as-muralhas-pela-oracao',
      newSlug: 'quebrando-as-muralhas-pela-oracao',
      seoTitle: 'Quebrando as Muralhas pela Oracao: Estrategia Espiritual de Cerco e Ruptura',
      llmContext:
        'Leitura teologica da oracao como ato de guerra espiritual e nao apenas devocao privada. O sermo interpreta muralhas como estruturas de oposicao persistente e apresenta disciplina de intercessao, perseveranca e unidade como vetor de rompimento.',
    },
  },
  {
    clusterId: 'mensagens-profeticas',
    sermon: {
      originalPath: '/sermons/jejum-da-vitoria-2023-21-devotionals/12-dia-12-alinhamento-profetico',
      newSlug: 'alinhamento-profetico',
      seoTitle: 'Alinhamento Profetico: Discernimento, Direcao e Obediencia no Tempo de Deus',
      llmContext:
        'Mensagem sobre calibragem espiritual entre promessa e cumprimento, com enfase em discernimento biblico para evitar ativismo sem direcao. O foco e alinhar intencao, linguagem e pratica ministerial ao que Deus ja revelou nas Escrituras.',
    },
  },
  {
    clusterId: 'mensagens-profeticas',
    sermon: {
      originalPath: '/sermons/jejum-da-vitoria-2023-21-devotionals/17-dia-17-celebracao-antecipada',
      newSlug: 'celebracao-antecipada',
      seoTitle: 'Celebracao Antecipada: Fe Profetica Antes da Materializacao',
      llmContext:
        'A mensagem desenvolve a logica da adoracao antecipada como declaracao de confianca na fidelidade divina. Trata da tensao entre processo e promessa, mostrando como gratidao antecipada reorganiza mente, emocao e postura comunitaria.',
    },
  },
  {
    clusterId: 'mensagens-profeticas',
    sermon: {
      originalPath: '/sermons/jejum-da-vitoria-2023-21-devotionals/21-dia-21-o-selo-da-vitoria',
      newSlug: 'o-selo-da-vitoria',
      seoTitle: 'O Selo da Vitoria: Consumacao de Ciclos e Confirmacao de Promessas',
      llmContext:
        'Estudo sobre fechamento profetico de ciclos espirituais, conectando perseveranca, obediencia e testemunho publico. O sermo apresenta a vitoria como resultado de processo de santificacao continua, nao como evento isolado de euforia religiosa.',
    },
  },
  {
    clusterId: 'eclesiologia-e-vida-pratica',
    sermon: {
      originalPath: '/sermons/cultos-online-27-services/17-cultivando-um-coracao-grato-20-11',
      newSlug: 'cultivando-um-coracao-grato',
      seoTitle: 'Cultivando um Coracao Grato: Liturgia de Gratidao e Maturidade Crista',
      llmContext:
        'Reflexao pastoral sobre gratidao como disciplina eclesial que combate murmuracao, cinismo e isolamento. A mensagem mostra como memoria das obras de Deus fortalece comunhao, gera estabilidade emocional e amplia resiliencia da igreja local.',
    },
  },
  {
    clusterId: 'batalha-espiritual-e-resiliencia',
    sermon: {
      originalPath: '/sermons/cultos-online-27-services/19-a-esperanca-que-nao-decepciona-04-12-2022',
      newSlug: 'a-esperanca-que-nao-decepciona',
      seoTitle: 'A Esperanca que Nao Decepciona: Perseveranca em Meio a Crises',
      llmContext:
        'Exegese de Romanos sobre esperanca escatologica e perseveranca pratica sob sofrimento. A mensagem articula dor, paciencia e formacao de carater, demonstrando como a esperanca cristocentrica impede colapso interior diante de incerteza prolongada.',
    },
  },
];

const clusterById = new Map(baseClusters.map((cluster) => [cluster.id, cluster]));

supplementalSermons.forEach(({ clusterId, sermon }) => {
  const cluster = clusterById.get(clusterId);
  if (!cluster) {
    throw new Error(`Cluster nao encontrado para suplemento de sermao: ${clusterId}`);
  }
  cluster.sermons.push(sermon);
});

export const sermonMigrationClusters = baseClusters;

export const allSermonMigrations: SermonMigrationRecord[] = sermonMigrationClusters.flatMap((cluster) =>
  cluster.sermons.map((sermon) => ({
    ...sermon,
    clusterId: cluster.id,
    clusterCanonicalPath: cluster.canonicalPath,
    clusterSeoTitle: cluster.seoTitle,
    clusterMetaDescription: cluster.metaDescription,
    canonicalPath: `${cluster.canonicalPath}/${sermon.newSlug}`,
  })),
);

const originalPaths = new Set<string>(allSermonMigrations.map((item) => item.originalPath));
if (originalPaths.size !== allSermonMigrations.length) {
  throw new Error('Original path duplicado detectado no mapeamento de sermoes.');
}

const destinationPaths = new Set(allSermonMigrations.map((item) => item.canonicalPath));
if (destinationPaths.size !== allSermonMigrations.length) {
  throw new Error('Destino duplicado detectado no mapeamento de sermoes.');
}

const legacySermonPaths = new Set<string>(
  knowledgeData.sermons.collections.flatMap((collection) => collection.items.map((item) => item.canonicalPath)),
);

const unmappedLegacyPaths = [...legacySermonPaths].filter((path) => !originalPaths.has(path));
if (unmappedLegacyPaths.length > 0) {
  throw new Error(`Sermoes legados sem mapeamento: ${unmappedLegacyPaths.join(', ')}`);
}

const unknownLegacyPaths = [...originalPaths].filter((path) => !legacySermonPaths.has(path));
if (unknownLegacyPaths.length > 0) {
  throw new Error(`Sermoes de migracao sem equivalente legado: ${unknownLegacyPaths.join(', ')}`);
}

if (allSermonMigrations.length !== 56) {
  throw new Error(`Esperado 56 sermoes migrados, recebido ${allSermonMigrations.length}.`);
}

export const legacySermonRootRedirect: LegacyRedirectRule = {
  source: '/sermons',
  destination: acervoCanonicalPath,
  statusCode: 301,
};

export const legacySermonCollectionRedirects: LegacyRedirectRule[] = knowledgeData.sermons.collections.map((collection) => ({
  source: collection.canonicalPath,
  destination: acervoCanonicalPath,
  statusCode: 301,
}));

export const legacySermonDetailRedirects: LegacyRedirectRule[] = allSermonMigrations.map((item) => ({
  source: item.originalPath,
  destination: item.canonicalPath,
  statusCode: 301,
}));

export const legacySermonRedirects: LegacyRedirectRule[] = [
  legacySermonRootRedirect,
  ...legacySermonCollectionRedirects,
  ...legacySermonDetailRedirects,
];

const redirectSources = new Set(legacySermonRedirects.map((redirect) => redirect.source));
if (redirectSources.size !== legacySermonRedirects.length) {
  throw new Error('Source duplicado detectado nas regras de redirect dos sermoes.');
}
