import { upkfMeta } from '@/data/generated/upkf.generated';

/**
 * Dados do cartão de visita digital (`/c`) — o destino do QR e da tag NFC.
 *
 * Origem única: quase tudo já existe em `upkfMeta` (gerado do UPKF). Aqui mora só
 * o que o UPKF NÃO expõe, porque aplica default-deny a PII: o telefone.
 */

/**
 * Telefone em formato E.164 **sem** `+` nem separadores — é o formato que o
 * `wa.me` exige (ex.: '5511999999999').
 *
 * Vem de `WHATSAPP_NUMBER`, e não do código, porque este repositório é público:
 * gravado aqui, o número pessoal entraria no histórico do git para sempre, e
 * remover depois exigiria reescrever a história. Pela variável, trocar ou tirar
 * é uma alteração de ambiente.
 *
 * Lido em escopo de módulo e só por código de servidor (`app/[locale]/c/page.tsx`
 * e `app/c.vcf/route.ts`), então resolve em build time e as duas rotas continuam
 * estáticas. Sem a variável, `null`: a página não renderiza a linha do WhatsApp e
 * o vCard não emite `TEL`, em vez de publicar um link quebrado.
 */
export const whatsappNumber: string | null = process.env.WHATSAPP_NUMBER?.trim() || null;

/** Mensagem que já vem digitada quando a pessoa abre a conversa. */
export const whatsappGreeting = 'Olá, Ulisses. Peguei seu cartão e queria conversar.';

export const contactEmail = 'contato@ulissesflores.com';

/** Retrato usado no cartão — o mesmo asset já servido em `/identidade`. */
export const portrait = '/carlos-ulisses-flores-cto.jpg';

/**
 * `TITLE` do vCard. Fica aqui, e não no dicionário i18n, porque o `.vcf` é servido
 * numa URL única e sem locale (é ela que vai gravada no chip NFC). Consequência
 * assumida: o SKU em inglês entrega um cargo em português. Se o cartão EN de fato
 * for impresso, o certo é um segundo handler `/c-en.vcf`, não localizar este.
 */
export const cardTitle = 'Pesquisador de IA Aplicada';

/**
 * Empresa no vCard. Escrito aqui porque o UPKF só guarda a **razão social**
 * (`affiliations[0].name` = 'CODEX HASH LTDA'), e caixa alta num cartão de visita
 * lê como grito. O nome de marca não tem campo próprio no UPKF.
 */
export const cardOrganization = 'Codex Hash';

export function whatsappHref(): string | null {
  if (!whatsappNumber) return null;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappGreeting)}`;
}

/** Acha um perfil no `sameAs` do UPKF sem repetir a URL aqui. */
function profile(needle: string): string {
  return (upkfMeta.sameAs as readonly string[]).find((url) => url.includes(needle)) || '';
}

export type CardLinkId = 'site' | 'linkedin' | 'orcid' | 'lattes' | 'github' | 'scholar';

/**
 * Rótulo de cada link dentro do vCard. Sem ele o app de contatos empilha seis
 * campos "url" idênticos e ninguém sabe qual é o ORCID. Não vem do dicionário
 * i18n porque o `.vcf` é servido numa URL única sem locale — e porque são todos
 * nomes próprios, iguais em qualquer idioma.
 */
export const vcardLinkLabels: Record<CardLinkId, string> = {
  site: 'Site',
  linkedin: 'LinkedIn',
  orcid: 'ORCID',
  lattes: 'Lattes',
  github: 'GitHub',
  scholar: 'Google Scholar',
};

type CardLink = { id: CardLinkId; href: string };

/**
 * Ordem deliberada: identidade profissional primeiro (LinkedIn), depois as âncoras
 * acadêmicas (ORCID, Lattes) e por último o código. É a ordem em que um interlocutor
 * de negócio procura, não a ordem em que o UPKF lista.
 */
export const cardLinks: CardLink[] = ([
  { id: 'site', href: upkfMeta.primaryWebsite },
  { id: 'linkedin', href: profile('linkedin.com') },
  { id: 'orcid', href: profile('orcid.org') },
  { id: 'lattes', href: profile('lattes.cnpq.br') },
  { id: 'scholar', href: profile('scholar.google.com') },
  { id: 'github', href: profile('github.com/') },
] satisfies CardLink[]).filter((link) => link.href.length > 0);
