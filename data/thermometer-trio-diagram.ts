/**
 * Datasets do `ThermometerTrioDiagram` — figuras 1 e 6 do artigo
 * `ia-mercado-de-trabalho`, nas duas cenas (mundo e Brasil) e nos cinco idiomas.
 *
 * Módulo próprio, e não `data/artigos-charts.ts`: o componente é do artigo, e o
 * arquivo do acervo já passa de 6 mil linhas.
 *
 * GERADO pelo `gerar-keys.py` do dossiê a partir de `dados.py` (fonte única) —
 * número nenhum foi digitado duas vezes.
 */

export interface ThermometerItem {
  nome: string; pergunta: string; leitura: string; sub?: string;
  nivel?: number; vazio?: boolean; cor: string;
}
export interface ThermometerTrioDataset {
  termometros: readonly ThermometerItem[]; conclusao: string;
}

/* `Record<string, ...>`: o componente indexa por `dataset: string` (o `compileMDX`
   só entrega atributo string), e um literal sem o `Record` reprova no `tsc --strict`. */
export const thermometerTrioDatasets: Record<string, ThermometerTrioDataset> = {
  'ia-trabalho-termometros-mundo': {
    termometros: [
      {
        nome: 'PREVISÃO',
        pergunta: 'a previsão do tempo',
        leitura: 'WEF: +170 mi / -92 mi até 2030',
        sub: 'projeção, não fato',
        nivel: 0.5,
        cor: '#64748b',
      },
      {
        nome: 'EXPOSIÇÃO',
        pergunta: 'o mapa da encosta',
        leitura: 'FMI: 40% do emprego global',
        sub: 'exposto não é substituído',
        nivel: 0.5,
        cor: '#60a5fa',
      },
      {
        nome: 'MEDIÇÃO',
        pergunta: 'o pluviômetro',
        leitura: 'Challenger: 184.538 desde 2023',
        sub: 'cortes atribuídos à IA (EUA)',
        nivel: 0.5,
        cor: '#a48f65',
      },
    ],
    conclusao: 'Misturar os três é o erro nº 1 da cobertura sobre IA e emprego.',
  },
  'ia-trabalho-termometros-brasil': {
    termometros: [
      {
        nome: 'PREVISÃO',
        pergunta: 'a previsão do tempo',
        leitura: 'só projeções globais',
        sub: 'nenhuma isola o Brasil',
        cor: '#64748b',
      },
      {
        nome: 'EXPOSIÇÃO',
        pergunta: 'o mapa da encosta',
        leitura: '37-41% do emprego',
        sub: 'OIT/BM 37% · FMI 41%',
        nivel: 0.39,
        cor: '#60a5fa',
      },
      {
        nome: 'MEDIÇÃO',
        pergunta: 'o pluviômetro',
        leitura: 'sem série pública',
        sub: 'CAGED não registra motivo',
        vazio: true,
        cor: '#a48f65',
      },
    ],
    conclusao: 'O único termômetro que mede fato é o que o Brasil não tem.',
  },
  'ia-trabalho-termometros-mundo-en': {
    termometros: [
      {
        nome: 'FORECAST',
        pergunta: 'the weather forecast',
        leitura: 'WEF: +170M / -92M by 2030',
        sub: 'projection, not fact',
        nivel: 0.5,
        cor: '#64748b',
      },
      {
        nome: 'EXPOSURE',
        pergunta: 'the hillside map',
        leitura: 'IMF: 40% of global jobs',
        sub: 'exposed is not replaced',
        nivel: 0.5,
        cor: '#60a5fa',
      },
      {
        nome: 'MEASURED',
        pergunta: 'the rain gauge',
        leitura: 'Challenger: 184,538 since 2023',
        sub: 'AI-attributed cuts (US)',
        nivel: 0.5,
        cor: '#a48f65',
      },
    ],
    conclusao: 'Mixing the three is error no. 1 in AI-and-jobs coverage.',
  },
  'ia-trabalho-termometros-brasil-en': {
    termometros: [
      {
        nome: 'FORECAST',
        pergunta: 'the weather forecast',
        leitura: 'global projections only',
        sub: 'none isolates Brazil',
        cor: '#64748b',
      },
      {
        nome: 'EXPOSURE',
        pergunta: 'the hillside map',
        leitura: '37-41% of jobs',
        sub: 'ILO/WB 37% · IMF 41%',
        nivel: 0.39,
        cor: '#60a5fa',
      },
      {
        nome: 'MEASURED',
        pergunta: 'the rain gauge',
        leitura: 'no public series',
        sub: 'CAGED logs no reason',
        vazio: true,
        cor: '#a48f65',
      },
    ],
    conclusao: 'The only thermometer that measures fact is the one Brazil lacks.',
  },
  'ia-trabalho-termometros-mundo-es': {
    termometros: [
      {
        nome: 'PRONÓSTICO',
        pergunta: 'pronóstico del tiempo',
        leitura: 'WEF: +170 mi / -92 mi a 2030',
        sub: 'proyección, no hecho',
        nivel: 0.5,
        cor: '#64748b',
      },
      {
        nome: 'EXPOSICIÓN',
        pergunta: 'mapa de la ladera',
        leitura: 'FMI: 40% del empleo global',
        sub: 'expuesto no es sustituido',
        nivel: 0.5,
        cor: '#60a5fa',
      },
      {
        nome: 'MEDICIÓN',
        pergunta: 'pluviómetro',
        leitura: 'Challenger: 184.538 desde 2023',
        sub: 'atribuidos a la IA (EE. UU.)',
        nivel: 0.5,
        cor: '#a48f65',
      },
    ],
    conclusao: 'Mezclar los tres es el error n.º 1 de la cobertura sobre IA y empleo.',
  },
  'ia-trabalho-termometros-brasil-es': {
    termometros: [
      {
        nome: 'PRONÓSTICO',
        pergunta: 'pronóstico del tiempo',
        leitura: 'solo proyecciones globales',
        sub: 'ninguna aísla a Brasil',
        cor: '#64748b',
      },
      {
        nome: 'EXPOSICIÓN',
        pergunta: 'mapa de la ladera',
        leitura: '37-41% del empleo',
        sub: 'OIT/BM 37% · FMI 41%',
        nivel: 0.39,
        cor: '#60a5fa',
      },
      {
        nome: 'MEDICIÓN',
        pergunta: 'pluviómetro',
        leitura: 'sin serie pública',
        sub: 'CAGED no registra motivo',
        vazio: true,
        cor: '#a48f65',
      },
    ],
    conclusao: 'El único termómetro que mide hechos es el que Brasil no tiene.',
  },
  'ia-trabalho-termometros-mundo-it': {
    termometros: [
      {
        nome: 'PREVISIONE',
        pergunta: 'le previsioni del tempo',
        leitura: 'WEF: +170 mln / -92 mln al 2030',
        sub: 'proiezione, non fatto',
        nivel: 0.5,
        cor: '#64748b',
      },
      {
        nome: 'ESPOSIZIONE',
        pergunta: 'la mappa del pendio',
        leitura: 'FMI: 40% del lavoro globale',
        sub: 'esposto non è sostituito',
        nivel: 0.5,
        cor: '#60a5fa',
      },
      {
        nome: 'MISURA',
        pergunta: 'il pluviometro',
        leitura: 'Challenger: 184.538 dal 2023',
        sub: 'tagli attribuiti all\'IA (USA)',
        nivel: 0.5,
        cor: '#a48f65',
      },
    ],
    conclusao: 'Mescolare i tre è l\'errore n° 1 della copertura su IA e lavoro.',
  },
  'ia-trabalho-termometros-brasil-it': {
    termometros: [
      {
        nome: 'PREVISIONE',
        pergunta: 'le previsioni del tempo',
        leitura: 'solo proiezioni globali',
        sub: 'nessuna isola il Brasile',
        cor: '#64748b',
      },
      {
        nome: 'ESPOSIZIONE',
        pergunta: 'la mappa del pendio',
        leitura: '37-41% del lavoro',
        sub: 'OIL/BM 37% · FMI 41%',
        nivel: 0.39,
        cor: '#60a5fa',
      },
      {
        nome: 'MISURA',
        pergunta: 'il pluviometro',
        leitura: 'senza serie pubblica',
        sub: 'CAGED non registra il motivo',
        vazio: true,
        cor: '#a48f65',
      },
    ],
    conclusao: 'Il solo termometro che misura fatti è quello che manca al Brasile.',
  },
  'ia-trabalho-termometros-mundo-he': {
    termometros: [
      {
        nome: 'תחזית',
        pergunta: 'תחזית מזג האוויר',
        leitura: 'WEF: 170 מיליון נוצרות, 92 נעלמות',
        sub: 'תחזית ל-2030, לא עובדה',
        nivel: 0.5,
        cor: '#64748b',
      },
      {
        nome: 'חשיפה',
        pergunta: 'מפת המדרון',
        leitura: 'IMF: 40% מהתעסוקה העולמית',
        sub: 'חשוף אינו מוחלף',
        nivel: 0.5,
        cor: '#60a5fa',
      },
      {
        nome: 'מדידה',
        pergunta: 'מד הגשם',
        leitura: 'Challenger: 184,538 מאז 2023',
        sub: 'פיטורים שיוחסו ל-AI (ארה״ב)',
        nivel: 0.5,
        cor: '#a48f65',
      },
    ],
    conclusao: 'ערבוב השלושה הוא טעות מספר 1 בסיקור על AI ותעסוקה.',
  },
  'ia-trabalho-termometros-brasil-he': {
    termometros: [
      {
        nome: 'תחזית',
        pergunta: 'תחזית מזג האוויר',
        leitura: 'רק תחזיות עולמיות',
        sub: 'אף אחת אינה מבודדת את ברזיל',
        cor: '#64748b',
      },
      {
        nome: 'חשיפה',
        pergunta: 'מפת המדרון',
        leitura: '37-41% מהתעסוקה',
        sub: 'ILO 37% · IMF 41%',
        nivel: 0.39,
        cor: '#60a5fa',
      },
      {
        nome: 'מדידה',
        pergunta: 'מד הגשם',
        leitura: 'אין סדרה ציבורית',
        sub: 'CAGED אינו רושם סיבה',
        vazio: true,
        cor: '#a48f65',
      },
    ],
    conclusao: 'המדחום היחיד שמודד עובדה הוא זה שאין לברזיל.',
  },
};
