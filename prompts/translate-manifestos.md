# Prompt para Gemini — Tradução dos Manifestos

Cole o bloco abaixo inteiro no Gemini. Ele vai devolver o arquivo TypeScript completo com as 4 traduções preenchidas.

---

## PROMPT (copie daqui até o final)

```
Você é um tradutor profissional especializado em textos acadêmicos, teológicos e políticos.

Preciso que traduza os dois manifestos abaixo do pt-BR para 4 idiomas: en (inglês), es (espanhol), it (italiano), he (hebraico).

REGRAS:
1. Mantenha o tom visceral, provocativo e elegante do original — NÃO suavize.
2. Preserve nomes próprios: "John Wesley", "Sócrates", "Jesus Cristo", "Escola Austríaca", "Clube Santo", "Mundo Político", "Arqueologia Espiritual e Teológica".
3. "Clube Santo" = "The Holy Club" em inglês (termo histórico real de John Wesley). Em espanhol: "El Club Santo". Em italiano: "Il Club Santo". Em hebraico: "המועדון הקדוש".
4. Mantenha a estrutura EXATA do TypeScript — preencha os campos vazios sem alterar tipos, chaves, ou aspas simples.
5. Para hebraico (he): texto deve ser RTL-ready, sem marcadores especiais — apenas o texto traduzido.
6. A tag "Manifesto" pode ser traduzida: en="Manifesto", es="Manifiesto", it="Manifesto", he="מניפסט".
7. Retorne APENAS o arquivo TypeScript completo, sem explicações.

ARQUIVO PARA PREENCHER:

/**
 * Manifestos Translation Table
 *
 * Source: pt-BR (canonical)
 * Target: en, es, it, he
 *
 * Status: ALL LANGUAGES COMPLETE
 */

export interface ManifestoTranslation {
  tag: string;
  title: string;
  subtitle: string;
  sections: { heading: string; paragraphs: string[] }[];
  quote?: string;
}

export type ManifestoKey = 'clubeSanto' | 'mundoPolitico';

export const manifestoTranslations: Record<ManifestoKey, Record<string, ManifestoTranslation>> = {
  clubeSanto: {
    'pt-BR': {
      tag: 'Manifesto',
      title: 'O Clube Santo: Um Avivamento para a Era Digital',
      subtitle: 'Uma comunidade de mentes e corações em busca da verdadeira conexão.',
      sections: [
        {
          heading: 'Tudo começou com um chá.',
          paragraphs: [
            'Não, não estamos falando do chá das cinco britânico, mas de um chá que derramou um sopro de vida em uma Inglaterra espiritualmente adormecida. John Wesley, o protagonista dessa história, poderia muito bem ter sido o inventor do chá matcha ou do detox, mas o que ele realmente fez foi criar uma xícara cheia de avivamento, conhecida como O Clube Santo.',
            'O Clube Santo, para os desavisados, não era um clube de boas-vindas para aspirantes a santos. Era muito mais que isso. Era uma reunião de mentes e corações que buscavam a verdadeira conexão com Deus, aliada a um rigor intelectual implacável. E que conexão! A Inglaterra nunca mais foi a mesma. John Wesley, com seu Clube Santo, desencadeou um avivamento espiritual tão grande que até o Rei George I teve que ajustar sua coroa.',
          ],
        },
        {
          heading: 'O Novo Giro: Arqueologia Espiritual',
          paragraphs: [
            'Você deve estar se perguntando: por que estamos falando de um clube criado séculos atrás na Inglaterra? Porque acreditamos que é hora de um novo avivamento para os nossos tempos. Um movimento que começará na América Latina, mas não parará até alcançar os confins do mundo.',
            'Estamos trazendo de volta o Clube Santo, mas com um giro para a era digital. O nosso instituto une o fervor pentecostal avivalista com ferramentas de Inteligência Artificial para realizar o que chamamos de Arqueologia Espiritual e Teológica. Juntos, vamos revolucionar o mundo, um avivamento de cada vez. Prepare a sua xícara.',
          ],
        },
      ],
    },
    en: { tag: '', title: '', subtitle: '', sections: [] },
    es: { tag: '', title: '', subtitle: '', sections: [] },
    it: { tag: '', title: '', subtitle: '', sections: [] },
    he: { tag: '', title: '', subtitle: '', sections: [] },
  },

  mundoPolitico: {
    'pt-BR': {
      tag: 'Manifesto',
      title: 'A Mecânica do Poder e a Busca pela Verdade',
      subtitle: '',
      quote: 'A democracia já matou muitas verdades. Não podemos permitir que isso continue acontecendo.',
      sections: [
        {
          heading: '',
          paragraphs: [
            'Criamos este projeto — o Mundo Político — como um espaço dedicado a quem busca entender o jogo do poder e se recusa a ser refém de manipulações e narrativas enganosas. A mudança só pode acontecer quando nos tornamos agentes ativos dela, e o primeiro passo é entender como o sistema realmente funciona.',
          ],
        },
        {
          heading: 'A Crítica Socrática',
          paragraphs: [
            'A democracia, como a conhecemos, permite que o povo vote em quem o governará. Porém, o pai da Filosofia, Sócrates, era receoso quanto a este método. Em um dos casos mais importantes da humanidade, a ideia de Sócrates foi posta à prova em seu próprio julgamento. Diante de 500 atenienses, por uma curta margem na votação, ele foi condenado à morte por cicuta. Pelo método do voto, a filosofia — a busca incansável pela verdade — foi injustiçada por pessoas que não entendiam exatamente do que se tratava aquela votação.',
            'Essa mesma injustiça histórica evidenciou-se na condenação de outro homem. O povo, de forma democrática, condenou à pena de morte um homem sem crime: Jesus Cristo. Aquele que não apenas buscava a verdade, mas que era a própria Verdade.',
          ],
        },
        {
          heading: 'Nosso Propósito',
          paragraphs: [
            'Esse é o mundo político em que vivemos. Entendemos que o conhecimento é a melhor forma de blindar a sociedade contra as falhas da "regra da maioria" desprovida de lastro moral e intelectual. Nossos esforços estão em promover os meios para que os fatos, a economia e a geopolítica sejam interpretados sob a ótica da lógica irrefutável (Escola Austríaca) e da soberania individual.',
          ],
        },
      ],
    },
    en: { tag: '', title: '', subtitle: '', sections: [] },
    es: { tag: '', title: '', subtitle: '', sections: [] },
    it: { tag: '', title: '', subtitle: '', sections: [] },
    he: { tag: '', title: '', subtitle: '', sections: [] },
  },
};
```

---

## Depois que o Gemini devolver

1. Copie o TypeScript que ele retornar
2. Substitua o conteúdo de `data/translations/manifestos.ts`
3. Rode `npm run build` para validar
4. Me peça para commitar e fazer push
