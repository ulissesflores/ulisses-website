## Leia primeiro
Antes de qualquer trabalho, leia `HANDOFF.md` na raiz — é o resumo de sessão vivo
(estado, pendências, furos de continuidade, critério de separação de projetos).
Regra-mestra: decisão recente supera decisão antiga; código em produção é a fonte da verdade.

## Before Commit Hook
Always run `npm test` before git commit. If fails: "Tests failed: <error>".

## Quem commita (decisão do Ulisses, 2026-09-03)
Só o **PUBLICADOR** commita e empurra neste repo. Toda outra sessão entrega MATERIAL como pedido
em `/Users/ulissesflores/m4/gerente-de-sessoes/publicacao/<AAAA-MM-DD>-<slug>/PEDIDO.md` e não
commita — `.husky/pre-commit` e `.husky/pre-push` recusam por mecanismo (o pre-push confere o
trailer `Publicado-por:` commit a commit, para barrar commit alheio pego de carona).
O publicador exporta `PUBLICADOR=<nome>` e publica sem OK no turn apenas com todo gate de código
em 0, ZERO itens de julgamento abertos e todo commit do range marcado. Item aberto = para.
Papel: `/Users/ulissesflores/m4/gerente-de-sessoes/state/prompt-publicador.md`.
