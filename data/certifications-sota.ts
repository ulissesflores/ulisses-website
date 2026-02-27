import { knowledgeData } from './knowledge';
import { upkfMeta } from '@/data/generated/upkf.generated';
import certificationsNarrativesJson from './seo/certifications.sota.json';

export interface CertificationNarrativeInput {
  id: string;
  title: string;
  url: string;
  about: string;
  skills: string[];
  problems_solved: string;
}

type KnowledgeCertification = (typeof knowledgeData.certifications)[number];

export type CertificationSotaItem = KnowledgeCertification & {
  title: string;
  about: string;
  skills: string[];
  problems_solved: string;
};

const certificationNarratives = certificationsNarrativesJson as CertificationNarrativeInput[];

const FALLBACK_SLUGS = new Set([
  'alura-13-ia-generativa-midjourney-e-chatgpt',
  'alura-23-java-orientacao-a-objetos',
]);

const certificationNarrativeById = new Map(certificationNarratives.map((entry) => [entry.id, entry]));

function buildFallbackNarrative(certification: KnowledgeCertification): CertificationNarrativeInput {
  if (certification.slug === 'alura-13-ia-generativa-midjourney-e-chatgpt') {
    return {
      id: certification.slug,
      title: 'IA Generativa: Midjourney e ChatGPT',
      url: `${upkfMeta.primaryWebsite}${certification.canonicalPath}`,
      about:
        'Formacao aplicada ao desenho de fluxos com IA generativa para producao de conteudo tecnico e apoio a discovery de produto. O foco esteve na orquestracao de prompts, avaliacao critica de respostas e definicao de trilhas de validacao para reduzir alucinacoes em ambientes corporativos.',
      skills: [
        'Prompt Engineering para LLMs',
        'Curadoria de respostas geradas por IA',
        'Automacao de workflows criativos',
        'Governanca de conteudo assistido por IA',
      ],
      problems_solved:
        'Reduziu o ciclo de experimentacao entre ideia e prototipo funcional ao estruturar um metodo de prompts verificaveis, com criterios de qualidade, rastreabilidade de fontes e revisao humana obrigatoria para saidas criticas.',
    };
  }

  if (certification.slug === 'alura-23-java-orientacao-a-objetos') {
    return {
      id: certification.slug,
      title: 'Java: Orientacao a Objetos',
      url: `${upkfMeta.primaryWebsite}${certification.canonicalPath}`,
      about:
        'Consolidacao dos fundamentos de orientacao a objetos em Java para modelagem de dominio em sistemas complexos. O curso reforcou encapsulamento, heranca, polimorfismo e contratos de interface como base para arquiteturas de software extensiveis e de alta manutencao.',
      skills: [
        'Modelagem de dominio com Java',
        'Encapsulamento e abstracao',
        'Polimorfismo e composicao',
        'Design orientado a objetos para evolucao de codigo',
      ],
      problems_solved:
        'Eliminou acoplamento acidental em modulos de negocio ao adotar uma modelagem orientada a contratos, reduzindo impacto de mudancas e facilitando testes unitarios em cenarios de refatoracao continua.',
    };
  }

  return {
    id: certification.slug,
    title: certification.name,
    url: `${upkfMeta.primaryWebsite}${certification.canonicalPath}`,
    about: certification.summary,
    skills: ['Software Architecture'],
    problems_solved: 'Sistematizacao de pratica tecnica com foco em qualidade e entrega.',
  };
}

const orphanNarratives = certificationNarratives.filter(
  (entry) => !knowledgeData.certifications.some((certification) => certification.slug === entry.id),
);
if (orphanNarratives.length > 0) {
  throw new Error(`Narrativas de certificacao sem pagina canonica: ${orphanNarratives.map((item) => item.id).join(', ')}`);
}

const missingNarratives = knowledgeData.certifications.filter(
  (certification) => !certificationNarrativeById.has(certification.slug),
);
if (missingNarratives.some((certification) => !FALLBACK_SLUGS.has(certification.slug))) {
  throw new Error(
    `Certificacoes sem narrativa SOTA fora da lista de fallback: ${missingNarratives
      .map((item) => item.slug)
      .join(', ')}`,
  );
}

export const certificationsSotaData: CertificationSotaItem[] = knowledgeData.certifications.map((certification) => {
  const narrative = certificationNarrativeById.get(certification.slug) ?? buildFallbackNarrative(certification);

  return {
    ...certification,
    title: narrative.title || certification.name,
    about: narrative.about,
    skills: narrative.skills,
    problems_solved: narrative.problems_solved,
  };
});

const uniqueSlugs = new Set(certificationsSotaData.map((item) => item.slug));
if (uniqueSlugs.size !== certificationsSotaData.length) {
  throw new Error('Slug de certificacao duplicado detectado no dataset SOTA.');
}

if (certificationsSotaData.length !== 34) {
  throw new Error(`Esperado 34 certificacoes no dataset SOTA, recebido ${certificationsSotaData.length}.`);
}

export const certificationsSotaBySlug = new Map<string, CertificationSotaItem>(
  certificationsSotaData.map((item) => [item.slug, item]),
);

export function getCertificationSotaBySlug(slug: string): CertificationSotaItem | null {
  return certificationsSotaBySlug.get(slug) ?? null;
}
