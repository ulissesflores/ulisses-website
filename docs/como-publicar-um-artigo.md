# Como publicar um artigo em `/artigos`

Guia do fluxo combinado em 2026-08-01: **o Ulisses escreve o conteúdo, o agente publica.**
Vale para a seção `/artigos` — o blog autoral. Publicação acadêmica (`research`, `whitepapers`,
`essays`) é outro caminho: vem do UPKF e do gerador, não deste guia.

## O que você manda

Só o texto. Não precisa formatar, não precisa saber MDX, não precisa inventar slug.

Serve qualquer forma: markdown pronto, rascunho corrido, tópicos soltos, áudio transcrito,
link com comentário seu. O mínimo útil é:

1. **O texto** — mesmo bruto.
2. **A data** que deve constar (se não for hoje).
3. **Qualquer fonte** que você usou: link, print, PDF, número. Sem isso eu não afirmo nada
   como verificado; só o que dá para conferir vira afirmação no texto.

Se mandar só um tema ("quero falar sobre X"), o que devolvo é pergunta, não artigo pronto.
O site é assinado com seu ORCID e seu Lattes ao lado; texto redigido por LLM se lê como tal.

## O que eu faço

| Etapa | O que acontece |
|---|---|
| Estrutura | corto repetição, ordeno o argumento, escolho os cortes de seção |
| Crítica | aponto onde o argumento não fecha, onde falta evidência, onde está prolixo |
| Verificação | confiro cada número, data, preço e citação contra a fonte atual |
| Formatação | viro MDX com frontmatter, tabelas GFM, links |
| Registro | crio `content/artigos/<slug>/index.pt-br.mdx` e a entrada em `data/artigos.ts` |
| SEO | title, summary, tags, canonical, JSON-LD e sitemap saem daí, sem trabalho extra |
| Gate | `npm run sota:check`, e `npm run sota:full` antes do push |
| Deploy | commit e push — **só com sua autorização explícita no mesmo turn** |

## Onde o artigo mora

Duas peças, sempre as duas:

```text
content/artigos/<slug>/index.pt-br.mdx   <- o corpo
data/artigos.ts                          <- slug, title, summary, date, tags
```

O `slug` é `AAAA-MM-DD-assunto-curto` e precisa ser idêntico nos dois lugares — o nome da pasta
é o que vira URL. O artigo publicado responde em `https://ulissesflores.com/artigos/<slug>`.

**Sobre os outros idiomas:** basta o `index.pt-br.mdx`. Quando o arquivo do idioma não existe,
a rota serve o corpo em português com o `lang` correto (`app/[locale]/artigos/[slug]/page.tsx:90`)
— medido: `https://ulissesflores.com/en/artigos/2026-07-24-claude-opus-5` responde 200. Traduzir
é decisão por artigo, não obrigação para publicar.

## Modelo do arquivo

O frontmatter é obrigatório e tem exatamente estes cinco campos:

````mdx
---
title: 'Título completo, com dois-pontos e travessão se precisar'
slug: 2026-08-01-assunto-curto
category: artigos
date: '2026-08-01'
language: pt-BR
---

Primeiro parágrafo: a afirmação principal, sem aquecimento. Quem lê tem de saber do que se
trata antes de rolar a tela. Nada de "neste artigo vamos explorar".

O segundo parágrafo diz por que isso importa ou o que contraria o senso comum.

---

## Primeira seção

Prosa normal. **Negrito** para o dado que decide, `código` para identificador técnico,
[link nomeado](https://exemplo.com) para a fonte — nunca "clique aqui".

| Item | Valor |
|---|---|
| Tabela GFM só com pipe | funciona |
| Nada de box-drawing | quebraria o render |

## Segunda seção

Citação em bloco quando a frase é de outra pessoa:

> A frase exata, entre aspas na fonte original.

Bloco de código sempre com a linguagem declarada:

```python
print("sempre com linguagem, senão o lint reprova")
```

## Fechamento

Uma conclusão que decorra do que foi mostrado. Se a evidência não permite concluir, o texto
diz isso — resultado negativo verificado vale mais que conclusão confortável sem lastro.
````

## Regras de estilo que o site já segue

- **Português do Brasil.** Termo técnico em inglês onde é canônico (`prompt`, `deploy`, `token`).
- **Afirmação com lastro.** Número, preço, versão e data são conferidos contra a fonte na hora
  da publicação; sem fonte, o texto declara que não foi verificado.
- **Sem preâmbulo e sem recap.** Nada de "como vimos anteriormente" nem "espero que tenha
  gostado".
- **Tabela só com pipe** (`| coluna |`). Box-drawing (`┌ ─ ┐`) quebra o render.
- **Bloco de código sempre com linguagem** — `MD040` é regra ativa do gate.
- **Setas em ASCII** (`->`), não Unicode.
- Uma ideia por seção, e o título da seção diz qual é.

Referência viva de tom e formato: `content/artigos/2026-07-24-claude-opus-5/index.pt-br.mdx`.
