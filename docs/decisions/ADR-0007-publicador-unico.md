# ADR-0007 — Só o publicador commita e empurra

Data: 2026-09-03 · Status: aceito · Decisor: Ulisses

## Contexto

Várias sessões de agente editam ESTE MESMO checkout de `main` ao mesmo tempo. Branch é etiqueta
móvel, não pasta: duas sessões em branches diferentes na mesma pasta é impossível. Consequência
medida duas vezes:

- 2026-08-30 — `a415900` empurrou `8aee395` de carona, sem autorização de quem commitou.
- 2026-09-02 — `7f3877c`+`2586edd` levaram junto o `a823dab`, que estava parado.

Nos dois casos a regra escrita ("sem commit/push sem OK no turn") existia e foi violada por
MECANISMO, não por intenção: o commit alheio já estava na `main` local, e `git push` leva tudo.
Exortação carregada é inerte.

Worktree por tarefa foi avaliado e **recusado** pelo Ulisses (custo: `node_modules`, `.env.local`
e `.next` por pasta). A arquitetura escolhida foi serializar.

## Decisão

Neste repo, **só o PUBLICADOR commita e empurra**. O publicador é uma sessão com cwd na raiz do
repo — herda `CLAUDE.md`, `AGENTS.md`, `docs/como-publicar-um-artigo.md`, os ADRs e a skill
`seo-geo-sota` por construção. Publicar aqui é **curadoria**, não `git add`: a FORMA é julgada
por código (`sota:check`, `charts:labels`, `sota:full`), o GOSTO por ele.

Toda outra sessão entrega MATERIAL como pedido em
`/Users/ulissesflores/m4/gerente-de-sessoes/publicacao/<AAAA-MM-DD>-<slug>/PEDIDO.md`, fora do repo.

Mecanismo (nada depende de disciplina):

| Hook | Regra |
|---|---|
| `.husky/pre-commit` | sem `PUBLICADOR` exportado, recusa antes do `sota:check` |
| `.husky/commit-msg` | com `PUBLICADOR`, carimba o trailer `Publicado-por:` |
| `.husky/pre-push` | recusa o push se QUALQUER commit do range não tiver o trailer |

A marca vai no COMMIT, não no push: variável de ambiente marcaria o push inteiro e deixaria o
commit clandestino passar de carona — exatamente os dois incidentes acima.

O publicador publica sem OK no turno apenas com as três condições juntas: todo gate de código em
0, ZERO itens de julgamento abertos, e todo commit do range marcado. Item aberto = para, sem
commit e sem push.

## Consequências

- O controle do Ulisses deixa de ser aprovação prévia e passa a ser **auditoria posterior +
  `git revert`**: o julgamento do publicador é a última palavra antes do deploy do Vercel.
- Commit manual do Ulisses passa a exigir `PUBLICADOR=<nome>` exportado, ou
  `PUBLICADOR_OVERRIDE=1` no push.
- Duas sessões editando o MESMO arquivo na pasta compartilhada continua quebrado — isto resolve
  a publicação, não a edição concorrente.
- A janela de árvore suja encolhe a uma sessão de desenvolvimento: a sessão de origem reverte os
  próprios arquivos pelo manifesto ao entregar o pedido.

Desenho completo, com os 8 controles medidos:
`/Users/ulissesflores/m4/docs/projects/ulisses-website-git-flow/02-DESENHO-2026-09-03-publicador.md`
