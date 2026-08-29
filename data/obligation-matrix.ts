/**
 * ══════════════════════════════════════════════════════════════════════
 * Dados do `ObligationMatrix` — artigo `carta-ciberdefesa-openai`
 * ══════════════════════════════════════════════════════════════════════
 *
 * GERADO por `assets/gerar-dados.py` do dossiê — NÃO editar à mão.
 * Dossiê: /Users/ulissesflores/Developer/redacao/dossies/carta-ciberdefesa-openai/
 *
 * PROCEDÊNCIA: captura pinada da carta (sha256 23fd95b7ba264bb9d01cd7a7f76a2b880cf65b7bb4d1a78ce1b542fa4aaf7b24),
 * https://web.archive.org/web/20260828154512/https://openai.com/collective-cyberdefense/
 * O corpo dos quatro blocos é byte-idêntico nas quatro capturas entre 27/08 17:13 e
 * 28/08 15:45 UTC: na página muda a lista de quem assina, nunca o que a carta pede.
 *
 * A figura é uma ASSERÇÃO DE AUSÊNCIA, então carrega as duas coisas que uma exige: o
 * espaço de busca ENUMERADO (as cinco colunas, cada uma uma regex no gerador) e um
 * CONTROLE POSITIVO — a página Trusted Access for Cyber, da própria OpenAI, fev/2026,
 * que acende três das cinco colunas e apaga duas. Documento DIFERENTE, e o rótulo da
 * linha diz isso dentro do SVG: os US$ 10 milhões não são desta carta.
 *
 * Um Record com TODOS os idiomas: `{id}` é o pt-br, `-en`, `-es`, `-it`, `-he` as
 * traduções — o componente faz `throw` em id desconhecido.
 *
 * Toda quebra de linha é EXPLÍCITA (array de linhas): `<text>` de SVG não quebra
 * sozinho, e o medidor `scripts/charts/checar-rotulos-svg.py` mede as mesmas linhas
 * que o componente desenha.
 */

export type ObligationEstado = 'ausente' | 'parcial' | 'presente';

export interface ObligationCelula {
  estado: ObligationEstado;
  /** Micro-rótulo sob a marca. Vazio em 'ausente' — a ausência não se explica. */
  nota?: readonly string[];
}

export interface ObligationLinha {
  /** '01'..'04' na carta; vazio na linha de controle. */
  numero: string;
  destinatario: readonly string[];
  /** Volume de pedidos do bloco ("6 frases no imperativo"); vazio no controle. */
  volume: string;
  /** Uma célula por coluna, na ordem de `colunas`. */
  celulas: readonly ObligationCelula[];
  /** Controle positivo: desenhado abaixo da régua, em quarentena visual. */
  controle?: boolean;
}

export interface ObligationMatrixDataset {
  colunas: readonly (readonly string[])[];
  linhas: readonly ObligationLinha[];
  legenda: { ausente: string; parcial: string; presente: string };
  conclusao: readonly string[];
}

export const obligationMatrixDatasets: Record<string, ObligationMatrixDataset> = {
  'carta-ciberdefesa-blocos': {
    colunas: [['Cifra'], ['Prazo'], ['Verbo que', 'obriga'], ['Quem', 'responde'], ['Alvo', 'verificável']],
    linhas: [
      {
        numero: '01',
        destinatario: ['Toda organização'],
        volume: '6 frases no imperativo',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }],
      },
      {
        numero: '02',
        destinatario: ['Empresas de cibersegurança', 'e parceiros de tecnologia'],
        volume: '3 frases no imperativo',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'parcial', nota: ['nomeia a métrica,', 'não o alvo'] }],
      },
      {
        numero: '03',
        destinatario: ['Governos'],
        volume: '6 frases no imperativo',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }],
      },
      {
        numero: '04',
        destinatario: ['Empresas de IA de fronteira'],
        volume: '3 frases no imperativo',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }],
      },
      {
        numero: '',
        destinatario: ['Controle: Trusted Access for Cyber,', 'OpenAI, fev/2026 — outro documento'],
        volume: '',
        celulas: [
          { estado: 'presente', nota: ['US$ 10 milhões'] },
          { estado: 'ausente' },
          { estado: 'presente', nota: ['“we are committing”'] },
          { estado: 'presente', nota: ['a própria OpenAI'] },
          { estado: 'ausente' },
        ],
        controle: true,
      },
    ],
    legenda: { ausente: 'ausente', parcial: 'parcial', presente: 'presente' },
    conclusao: ['Nenhum dos quatro blocos traz cifra, prazo ou verbo que obrigue.', 'Os únicos algarismos no corpo da carta são 01, 02, 03 e 04.'],
  },
  'carta-ciberdefesa-blocos-en': {
    colunas: [['Amount'], ['Deadline'], ['Binding', 'verb'], ['Who is', 'accountable'], ['Verifiable', 'target']],
    linhas: [
      {
        numero: '01',
        destinatario: ['Every organization'],
        volume: '6 imperative sentences',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }],
      },
      {
        numero: '02',
        destinatario: ['Cybersecurity companies', 'and technology partners'],
        volume: '3 imperative sentences',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'parcial', nota: ['names the metric,', 'not the target'] }],
      },
      {
        numero: '03',
        destinatario: ['Governments'],
        volume: '6 imperative sentences',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }],
      },
      {
        numero: '04',
        destinatario: ['Frontier AI companies'],
        volume: '3 imperative sentences',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }],
      },
      {
        numero: '',
        destinatario: ['Control: Trusted Access for Cyber,', 'OpenAI, Feb 2026 — a different document'],
        volume: '',
        celulas: [
          { estado: 'presente', nota: ['US$10 million'] },
          { estado: 'ausente' },
          { estado: 'presente', nota: ['“we are committing”'] },
          { estado: 'presente', nota: ['OpenAI itself'] },
          { estado: 'ausente' },
        ],
        controle: true,
      },
    ],
    legenda: { ausente: 'absent', parcial: 'partial', presente: 'present' },
    conclusao: ['No block carries an amount, a deadline, or a verb that binds.', 'The only digits in the body of the letter are 01, 02, 03 and 04.'],
  },
  'carta-ciberdefesa-blocos-es': {
    colunas: [['Cifra'], ['Plazo'], ['Verbo que', 'obliga'], ['Quién', 'responde'], ['Meta', 'verificable']],
    linhas: [
      {
        numero: '01',
        destinatario: ['Toda organización'],
        volume: '6 frases en imperativo',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }],
      },
      {
        numero: '02',
        destinatario: ['Empresas de ciberseguridad', 'y socios tecnológicos'],
        volume: '3 frases en imperativo',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'parcial', nota: ['nombra la métrica,', 'no la meta'] }],
      },
      {
        numero: '03',
        destinatario: ['Gobiernos'],
        volume: '6 frases en imperativo',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }],
      },
      {
        numero: '04',
        destinatario: ['Empresas de IA de frontera'],
        volume: '3 frases en imperativo',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }],
      },
      {
        numero: '',
        destinatario: ['Control: Trusted Access for Cyber,', 'OpenAI, feb. 2026 — otro documento'],
        volume: '',
        celulas: [
          { estado: 'presente', nota: ['US$ 10 millones'] },
          { estado: 'ausente' },
          { estado: 'presente', nota: ['“we are committing”'] },
          { estado: 'presente', nota: ['la propia OpenAI'] },
          { estado: 'ausente' },
        ],
        controle: true,
      },
    ],
    legenda: { ausente: 'ausente', parcial: 'parcial', presente: 'presente' },
    conclusao: ['Ningún bloque trae cifra, plazo ni verbo que obligue.', 'Los únicos dígitos en el cuerpo de la carta son 01, 02, 03 y 04.'],
  },
  'carta-ciberdefesa-blocos-it': {
    colunas: [['Cifra'], ['Scadenza'], ['Verbo che', 'obbliga'], ['Chi ne', 'risponde'], ['Obiettivo', 'verificabile']],
    linhas: [
      {
        numero: '01',
        destinatario: ['Ogni organizzazione'],
        volume: '6 frasi all’imperativo',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }],
      },
      {
        numero: '02',
        destinatario: ['Aziende di cybersicurezza', 'e partner tecnologici'],
        volume: '3 frasi all’imperativo',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'parcial', nota: ['nomina la metrica,', 'non l’obiettivo'] }],
      },
      {
        numero: '03',
        destinatario: ['Governi'],
        volume: '6 frasi all’imperativo',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }],
      },
      {
        numero: '04',
        destinatario: ['Aziende di IA di frontiera'],
        volume: '3 frasi all’imperativo',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }],
      },
      {
        numero: '',
        destinatario: ['Controllo: Trusted Access for Cyber,', 'OpenAI, feb. 2026 — altro documento'],
        volume: '',
        celulas: [
          { estado: 'presente', nota: ['US$ 10 milioni'] },
          { estado: 'ausente' },
          { estado: 'presente', nota: ['“we are committing”'] },
          { estado: 'presente', nota: ['la stessa OpenAI'] },
          { estado: 'ausente' },
        ],
        controle: true,
      },
    ],
    legenda: { ausente: 'assente', parcial: 'parziale', presente: 'presente' },
    conclusao: ['Nessuno dei quattro blocchi porta cifra, scadenza o verbo che obblighi.', 'Le uniche cifre nel corpo della lettera sono 01, 02, 03 e 04.'],
  },
  'carta-ciberdefesa-blocos-he': {
    colunas: [['סכום'], ['מועד'], ['פועל', 'מחייב'], ['מי', 'אחראי'], ['יעד', 'נמדד']],
    linhas: [
      {
        numero: '01',
        destinatario: ['כל ארגון'],
        volume: '6 משפטי ציווי',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }],
      },
      {
        numero: '02',
        destinatario: ['חברות אבטחת סייבר', 'ושותפות טכנולוגיה'],
        volume: '3 משפטי ציווי',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'parcial', nota: ['נוקבת במדד,', 'לא ביעד'] }],
      },
      {
        numero: '03',
        destinatario: ['ממשלות'],
        volume: '6 משפטי ציווי',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }],
      },
      {
        numero: '04',
        destinatario: ['חברות AI בחזית'],
        volume: '3 משפטי ציווי',
        celulas: [{ estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }, { estado: 'ausente' }],
      },
      {
        numero: '',
        destinatario: ['בקרה: Trusted Access for Cyber,', 'OpenAI, פברואר 2026 — מסמך אחר'],
        volume: '',
        celulas: [
          { estado: 'presente', nota: ['10 מיליון דולר'] },
          { estado: 'ausente' },
          { estado: 'presente', nota: ['“we are committing”'] },
          { estado: 'presente', nota: ['OpenAI עצמה'] },
          { estado: 'ausente' },
        ],
        controle: true,
      },
    ],
    legenda: { ausente: 'חסר', parcial: 'חלקי', presente: 'קיים' },
    conclusao: ['באף אחד מארבעת הבלוקים אין סכום, מועד או פועל מחייב.', 'הספרות היחידות בגוף המכתב הן 01, 02, 03 ו-04.'],
  },
};
