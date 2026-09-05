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
| Dado | dado próprio do artigo vai para um repositório público linkado **antes** da publicação — nunca prometido a quem pedir |
| Formatação | viro MDX com frontmatter, tabelas GFM, links |
| Registro | crio `content/artigos/<slug>/index.pt-br.mdx`, a entrada em `data/artigos.ts` e, se houver capa, os arquivos em `public/artigos/<slug>/` |
| SEO | title, summary, tags, canonical, JSON-LD e sitemap saem daí, sem trabalho extra |
| Gate | `npm run sota:check`, e `npm run sota:full` antes do push |
| Deploy | commit e push — **só com sua autorização explícita no mesmo turn** |

## Onde o artigo mora

Duas peças, sempre as duas — três quando o artigo tem capa:

```text
content/artigos/<slug>/index.pt-br.mdx   <- o corpo
data/artigos.ts                          <- slug, title, summary, date, tags (e `hero`, se houver capa)
public/artigos/<slug>/hero.png           <- a capa, e o recorte 1200x630 ao lado dela
```

O `slug` é `assunto-curto`, **sem data** (decisão de 2026-08-01; os artigos antigos com
`AAAA-MM-DD-` na frente ficaram como estão). Precisa ser idêntico na pasta e em `data/artigos.ts`
— o nome da pasta é o que vira URL. O artigo publicado responde em
`https://ulissesflores.com/artigos/<slug>`.

### A capa (`hero`)

A capa aparece em três lugares: no topo do artigo, no card do índice `/artigos` e no
`og:image` — a imagem que WhatsApp, X e LinkedIn mostram quando o link circula.

O arquivo vai em `public/artigos/<slug>/`, **nunca** ao lado do `.mdx`: `content/` não é servido
pelo Next, e imagem colocada lá é asset morto (foi o que aconteceu com dez capas até 2026-08-28).
Quem põe no lugar e escolhe o encoding é o script, que mede em vez de adivinhar:

```bash
python3 scripts/artigos/publicar-capa.py <slug> <caminho-da-arte>
```

Ele exige que a arte já nasça em **1200:630** (2400x1260 é o padrão da casa) — recortar 16:9 é
decisão de composição, e quem decide é quem fez a arte. No fim ele imprime o bloco `hero` para
colar em `data/artigos.ts`, **depois de `tags`** (entre `slug` e `title` o artigo some do
`llms.txt` sem nenhum gate acusar).

O `hero` é um mapa **por idioma**, porque a arte da casa traz o título e o atalho desenhados
dentro dela: capa em português servida a quem lê em inglês é pior que capa nenhuma. Idioma fora
do mapa não ganha capa e cai no card tipográfico de
`app/[locale]/artigos/[slug]/opengraph-image.tsx`, que é gerado localizado para os cinco.
Que os arquivos existam e que nenhum card passe de 300 KB é gate: `data/artigos-hero.test.ts`.

**Sobre os outros idiomas:** basta o `index.pt-br.mdx`. Quando o arquivo do idioma não existe,
a rota serve o corpo em português com o `lang` correto (`app/[locale]/artigos/[slug]/page.tsx:90`)
— medido: `https://ulissesflores.com/en/artigos/2026-07-24-claude-opus-5` responde 200. Traduzir
é decisão por artigo, não obrigação para publicar.

## Dado do artigo: repositório público, nunca promessa

O texto **nunca** oferece dado, planilha, código ou memória de cálculo "mediante solicitação",
"sob demanda", "é só pedir" ou "posso enviar". Promessa não é publicação: quem lê seis meses
depois não tem a quem pedir, e a afirmação fica sem lastro conferível de fora.

Só existem dois desfechos, e o texto declara qual é:

1. **O dado existe** -> ele é publicado **antes** do artigo, num repositório público próprio
   (o *companion*), e o artigo linka esse repositório. O padrão da casa para esse repositório
   é a skill `scaffolding-public-repo`
   (`/Users/ulissesflores/.claude/skills/scaffolding-public-repo/SKILL.md`): entry-point único
   `run_all.py`, todo número publicado travado como asserção de teste, selo de proveniência
   SHA-256 (`chain_hash`) conferível com `--verify`, CI que reprova divergência entre texto e
   dado, e `CITATION.cff` + `codemeta.json` + `.zenodo.json` para o DOI.
2. **O dado não pode ser publicado** (é de terceiro, tem licença restritiva ou sigilo) -> o
   texto diz isso na linha em que o número aparece, com o motivo, e apresenta o número como
   não conferível de fora. Resultado declarado sem lastro vale mais que promessa de lastro.

O repositório companion vive **fora** deste repo: o site linka, não hospeda. O `.zenodo.json`
nasce com `access_right: closed`, e o DOI só é cunhado na release — com autorização explícita
do Ulisses no mesmo turn, como todo push.

## Modelo do arquivo

O frontmatter é obrigatório e tem exatamente estes cinco campos:

````mdx
---
title: 'Título completo, com dois-pontos e travessão se precisar'
slug: assunto-curto
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
- **Nada "mediante solicitação".** Dado prometido a quem pedir não conta como publicado: ou
  está num repositório público linkado, ou o texto declara por que não está -> seção *Dado do
  artigo*.
- **Sem preâmbulo e sem recap.** Nada de "como vimos anteriormente" nem "espero que tenha
  gostado".
- **Tabela só com pipe** (`| coluna |`). Box-drawing (`┌ ─ ┐`) quebra o render.
- **Bloco de código sempre com linguagem** — `MD040` é regra ativa do gate.
- **Setas em ASCII** (`->`), não Unicode.
- Uma ideia por seção, e o título da seção diz qual é.

Referência viva de tom e formato: `content/artigos/2026-07-24-claude-opus-5/index.pt-br.mdx`.
