# ADR-0008 — O site LINKA um DOI cunhado, nunca monta um

Data: 2026-09-08 · Status: aceito · Decisor: Ulisses
Registro a posteriori do que o commit `70ab101` (2026-09-07) já mudou.

## Contexto

O site publicava 18 obras, cada uma com um identificador montado por padrão
`10.5281/zenodo.<ano><ordinal de 2 dígitos>` — ano colado à posição da obra na lista, e assim
por diante. O padrão saía de `buildDoiTarget()`, em `scripts/upkf/lib/text.mjs`: o gerador não lia um
DOI, ele **fabricava** um a partir do ano e da posição da obra na lista.

Essa faixa do Zenodo está ocupada desde 2011. Medição de 2026-09-05, arquivo por arquivo:

| Achado | Número |
|---|---|
| DOIs do site que resolvem para trabalho de TERCEIROS | **17 de 18** (1 não resolvia; **0** eram dele) |
| Arquivos versionados carregando o padrão | **386** — `public/` 112 · `content/` 90 · `data/` 184 |
| Os PDFs servidos eram os artigos? | **não** — 9 a 19 KB, 3 a 5 páginas, markdown cru no texto |

O identificador que a obra de 2025 recebia devolve HTTP 200 — e é o trabalho de um taxonomista
de cracas. O valor literal não é reproduzido aqui de propósito: ver a nota sobre o teste, abaixo.

Três defeitos estruturais sustentavam isso, e nenhum era o valor em si:

1. **O gerador lia a própria saída como fonte.** `findSourcePath()` punha `public/upkf-source.md` —
   escrito pelo próprio gerador e `gitignored` — à frente do UPKF versionado. Editar a fonte
   versionada não surtia efeito enquanto a cópia pública existisse, e um checkout limpo gerava
   bytes diferentes dos commitados.
2. **O verificador cobrava o defeito.** `verify-artifacts.mjs` asseria *"DOI-ready usa política
   doi_target para todos os artigos"* — ele **reprovava** o repo se algum artigo **não** tivesse
   DOI montado.
3. **A rubrica premiava o defeito.** `doi-quality.mjs` dava 2 de 11 sinais à simples existência do
   identificador fabricado.

O erro de fundo não é técnico, é epistêmico: **HTTP 200 não prova posse de um DOI.** Um
identificador que resolve prova apenas que alguém depositou algo ali — não que foi você.

E o dano não é simétrico. Um registro ORCID e um índice de citação guardam o que receberam: obra
sem identificador é normal e reversível; obra com o identificador de outra pessoa é contaminação
que sobrevive à correção do site.

## Decisão

**O site LINKA um DOI cunhado num depósito. Nunca monta um.**

Um identificador só entra numa peça pública se satisfizer as três condições, juntas:

1. **Resolve** — a requisição devolve metadado, não uma página de erro.
2. **É dele** — `author.family == Flores`, verificado por *content negotiation*, não por status HTTP:

   ```bash
   curl -sL -H 'Accept: application/vnd.citationstyles.csl+json' "https://doi.org/<DOI>"
   ```

3. **É do objeto certo** — o campo `type` decide onde ele pode aparecer. `article-journal` pode ser
   o DOI da publicação; `software` entra **apenas** como identificador relacionado ("código e dados
   desta obra"), nunca como o DOI do artigo.

Sem DOI que passe nas três, **cita-se pela URL canônica**. Obra sem DOI é normal; a página não
finge um.

Consequência de tipo, e é a mudança de arquitetura que este ADR registra: o estado `target` foi
**apagado do tipo emitido** pelo gerador. Antes o campo DOI tinha dois estados — `minted` (cunhado)
e `target` (pretendido, isto é, montado). O segundo estado era o defeito com nome de recurso: ele
permitia que um identificador inexistente trafegasse pelo sistema como se fosse dado. Restou um
estado só. Um DOI ou foi cunhado, ou não existe.

`buildDoiTarget()` foi removida. As três fontes do gerador deixaram de montar identificador.

### Efeito no conteúdo

- As **14 obras que ficam** perderam o campo `doi`. Intencional: os 18 valores eram fabricados.
  O campo volta, obra a obra, quando houver DOI cunhado em depósito real.
- As **4 obras sem original nenhum** — `2024-ring-signatures-privacy`, `2023-digital-legacy`,
  `2022-theology-of-hope`, `2020-robotics-education` — saíram do ar. Não é `noindex`: é remoção do
  registro, do conteúdo nos 5 locales e dos artefatos servidos. Duas varreduras independentes, a
  três meses de distância, não acharam original de nenhuma das quatro. Reversível se um aparecer.

### Mecanismo, porque exortação é inerte

`data/doi-nao-fabricado.test.ts`, 5 asserções: o padrão de 6 dígitos não existe em `app/`,
`content/`, `data/`, `docs/`, `lib/`, `scripts/`; nenhuma das 4 fontes do gerador volta a montar
DOI; o tipo emitido não aceita mais `'target'`; nenhuma publicação carrega `doi` que não seja
`minted`; e as 4 removidas não voltaram.

Travessado nas duas direções: reintroduzir a `buildDoiTarget` original deixa o teste **vermelho**;
revertido, **verde** 5/5.

> [!WARNING]
> A asserção usa `zenodo\.\d{6}(?!\d)`. **A borda de dígito não é detalhe de estilo.** O padrão
> falso tem exatamente 6 dígitos; os DOIs reais do autor têm 7 a 8 (`zenodo.20276631`,
> `zenodo.20108648`). Um regex sem a borda casaria o prefixo dos reais e reprovaria o repo no dia
> em que os DOIs verdadeiros entrarem.
>
> **E a asserção varre `docs/`, o que inclui este arquivo.** Por isso nenhum valor fabricado é
> reproduzido literalmente acima: um ADR que exemplificasse o defeito com o valor real deixaria a
> própria trava vermelha. Os exemplos ficam na forma `zenodo.<ano><ordinal>`, e os valores brutos
> vivem na evidência, fora do repo do site.

## Consequências

**Boas**

- O defeito morre na origem, não nos 18 valores. Nenhuma obra futura nasce com DOI fabricado.
- O padrão tem teste que trava a volta. A regra deixa de depender de alguém lembrar dela.
- A regra das três condições é executável por qualquer sessão, sem julgamento.

**Custos aceitos**

- As 14 obras ficam **sem** campo DOI até haver depósito. A página fica mais pobre — e honesta.
- **O ORCID passa a ter 4 URIs apontando para páginas que dão 404.** Isso não se resolve no repo:
  ou se tira a URL das 4 obras no ORCID, ou se tiram as obras. Item em aberto.
- **Não há `410 Gone` nem redirect** para as 4 URLs removidas. A recomendação da DataCite para
  identificador retirado é servir *tombstone page*, não 404 — mas isso é decisão de arquitetura do
  site, não deste ADR, e as 4 removidas não tinham DOI legítimo a preservar.

**O que este ADR NÃO decide**

- Se e quando cada uma das 14 recebe DOI cunhado. Depende de depósito real, obra a obra.
- Como o site exibe DOI de **software companheiro**. Hoje há 15 repositórios do autor com DOI
  verificado por autoria, e a maioria é `type: software` — o DOI da simulação, não do artigo.
  Exibi-los como DOI da publicação seria o mesmo defeito com outro rosto: **objeto errado, autor
  certo**. Precisa de desenho próprio.

## Fontes

- Medição crua, arquivo por arquivo:
  `/Users/ulissesflores/Developer/publicacoes-recuperacao/evidencia/01-resolucao-dos-18-dois-do-site.txt`,
  `.../03-os-pdfs-servidos-sao-stubs.txt`, `.../04-arquivos-contaminados.txt`
- Estado, decisões e cadeia de proveniência:
  `/Users/ulissesflores/Developer/publicacoes-recuperacao/PUBLICACOES-STATE.md`
- Pedido aplicado: `2026-09-05-remover-4-obras-sem-original` -> commit `70ab101`
- *DOI Content Negotiation*, DOI Foundation: `https://citation.crosscite.org/docs.html`
- *Best Practices for DOI Landing Pages*, DataCite: `https://support.datacite.org/docs/landing-pages`
