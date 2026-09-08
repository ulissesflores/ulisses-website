#!/usr/bin/env python3
"""A `description` de uma figura bate com o que a figura DESENHA?

POR QUE ESTE ARQUIVO EXISTE: a prop `description` é o texto que o leitor de tela recebe
no lugar do SVG, e é a única parte da figura que nenhum gate media. Ela é escrita à mão,
o dataset muda depois, e a prosa fica descrevendo a figura anterior — em silêncio, porque
o `tsc` só vê uma string e o `checar-rotulos-svg.py` só mede pixel. O defeito que motivou
este gate está publicado no histórico: a fig. 2 do `quantas-pessoas-usam-ia-china` narrava
`Linha 1..5` numa escada de seis linhas (corrigido em `db4dde5`).

O QUE ELE MEDE, E O QUE ELE RECUSA A MEDIR. As três checagens candidatas foram rodadas
contra o acervo inteiro (82 invocações dos 3 componentes, 30 artigos) antes de qualquer uma
entrar aqui. A taxa de falso positivo — não a existência do defeito-alvo — decidiu:

| Checagem                                  | Reprovadas | Reais | Falsas | Papel      |
|-------------------------------------------|-----------:|------:|-------:|------------|
| marcadores ordinais 1..N + fechamento      |          1 |     1 |      0 | REPROVA    |
| ordem, com âncora NUMÉRICA e DISTINTA      |          3 |     3 |      0 | AVISA      |
| contagem declarada por numeral ("cinco X") |          7 |     1 |      6 | NÃO ENTROU |

A contagem por numeral ficou de fora porque a prosa real do acervo a derrota de três
maneiras que não se resolvem sem inventar regra nova a cada artigo: frase distributiva
("três blocos, cada um com uma barra" = 3 itens, não 1), linha de referência contada como
elemento, e rótulo repetido entre grupos. A checagem de ordem AVISA em vez de reprovar
porque os 3 achados reais são escolha narrativa — a description agrupa por país e o desenho
ordena por valor —, e nenhuma delas afirma número errado. Fidelidade de ORDEM é matéria de
leitura humana; fidelidade de CONTAGEM não é.

`degrau` e `nível` estão FORA da lista de palavras ordinais de propósito: são vocabulário
editorial, não estrutura. A fig. 4 do mesmo artigo do china diz "cinco degraus" numa escada
de seis linhas e está CERTA — a sexta linha é o total, e total não é degrau. Um gate que
força a prosa a adotar a contagem do dataset atropela a taxonomia do artigo.

USO:
    python3 scripts/charts/checar-description.py            # todos os artigos rastreados
    python3 scripts/charts/checar-description.py <arquivo>  # um .mdx

Exit 0 = nenhuma reprovação (avisos não reprovam). Exit 1 = ao menos uma.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FONTE_TS = RAIZ / "data/artigos-charts.ts"

# Componente -> `export const` que guarda os datasets dele. Componente que não estiver
# aqui é PULADO com linha-resumo, nunca aborta: figura nova não pode derrubar o gate do
# acervo inteiro, e o `checar-rotulos-svg.py` já reprova alto dado desenhado sem geometria.
FAMILIA = {
    "StepFlowDiagram": "stepFlowDatasets",
    "CostLadder": "costLadderDatasets",
    "CountryBarsChart": "countryBarsDatasets",
}

# Palavra ordinal que abre um elemento enumerado: "Linha 1:", "Elo 3", "Etapa 4,".
# Sem `degrau`/`nível` — ver o cabeçalho.
ORDINAL = r"(?:elo|linha|barra|item|etapa|passo|coluna)"

INVOCACAO = re.compile(
    r"<(" + "|".join(FAMILIA) + r")\b((?:\"[^\"]*\"|[^>])*?)/>", re.S
)
QUALQUER_INVOCACAO = re.compile(r"<([A-Z]\w+)\b((?:\"[^\"]*\"|[^>])*?)/>", re.S)
ATRIBUTO = re.compile(r'(\w+)="([^"]*)"')


def sem_acento(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def datasets_do_ts(caminho: Path) -> dict[str, dict]:
    """Lê os mapas de dataset do `.ts` pelo próprio `node`.

    ponytail: o `checar-rotulos-svg.py` tem um parser equivalente e maior. Não importo dele
    de propósito — importar grava um `__pycache__` na árvore de trabalho e acopla este gate
    a um arquivo que outra sessão edita. São doze linhas; a duplicação é mais barata que o
    acoplamento.
    """
    js = caminho.read_text(encoding="utf-8")
    for padrao, troca in (
        (r"^import .*$", ""),
        (r"^(export )?type \w+\s*=[^;{]*;$", ""),
        (r"^(export )?(interface|type)[\s\S]*?\n\}", ""),
        (r"^export const (\w+)\s*:[^=]+=", r"const \1 ="),
        (r"^export const ", "const "),
    ):
        js = re.sub(padrao, troca, js, flags=re.M)
    nomes = sorted(set(FAMILIA.values()))
    pares = ",".join(f"['{n}',typeof {n}!=='undefined'?{n}:null]" for n in nomes)
    js += f"\nconsole.log(JSON.stringify(Object.fromEntries([{pares}])));"
    saida = subprocess.run(["node", "-e", js], capture_output=True, text=True)
    if saida.returncode:
        sys.exit(f"não consegui ler {caminho}:\n{saida.stderr[:800]}")
    return json.loads(saida.stdout)


def desenhado(componente: str, dataset: dict) -> list[dict]:
    """Os elementos na ORDEM em que o componente os desenha."""
    if componente == "StepFlowDiagram":
        return list(dataset["steps"])
    if componente == "CostLadder":
        return list(dataset["rows"])
    if componente == "CountryBarsChart":
        return [item for grupo in dataset["groups"] for item in grupo["items"]]
    raise KeyError(componente)


def rotulo(elemento: dict) -> str:
    return str(elemento.get("label") or elemento.get("name") or "")


def ancora_numerica(elemento: dict) -> str | None:
    """O número impresso do elemento — e só ele.

    Token de palavra NÃO serve de âncora: colide com o vocabulário da própria frase. Medido
    — em `glm53flash-cadeia-100t` a âncora `cadeia` do 6º passo casa na abertura
    "Cadeia de seis etapas", dá posição 0 e acusa ordem trocada numa description correta.
    """
    for chave in ("valueLabel", "bill"):
        achado = re.search(r"\d+(?:[.,]\d+)?", str(elemento.get(chave) or ""))
        if achado:
            return achado.group(0)
    return None


def posicao(agulha: str, palheiro: str) -> int:
    """Primeira posição da âncora, ou -1. Fronteira à esquerda é obrigatória: sem ela
    «5,1» casa DENTRO de «15,1» e o gate acusa ordem trocada onde não há."""
    achado = re.search(rf"(?<![\d.,]){re.escape(agulha)}(?![\d])", palheiro)
    return achado.start() if achado else -1


def checar(componente: str, description: str, dataset: dict) -> tuple[list[str], list[str]]:
    """Devolve (reprovações, avisos) de uma figura."""
    plano = sem_acento(description).lower()
    elementos = desenhado(componente, dataset)
    total = len(elementos)
    reprovacoes: list[str] = []
    avisos: list[str] = []

    # ── REPROVA — marcadores ordinais contíguos, e o último igual ao total ────────────
    ordinais = sorted({int(d) for d in re.findall(rf"\b{ORDINAL}\s+(\d{{1,2}})\b", plano)})
    if ordinais:
        if ordinais != list(range(1, len(ordinais) + 1)):
            reprovacoes.append(f"marcadores ordinais não formam 1..N contíguo: {ordinais}")
        else:
            # Um elemento pode ser fechado por PALAVRA ("O último elo traz…") e conta como
            # mais um narrado. Por isso a conta é `maior ordinal + fechamento`, não o maior
            # ordinal sozinho.
            fechamento = re.search(rf"\b(?:o|a)\s+ultim[oa]\s+(?:{ORDINAL}|del[ea]s)\b", plano)
            narrados = ordinais[-1] + (1 if fechamento else 0)
            if narrados != total:
                como = " (contando o fechado por palavra, não por número)" if fechamento else ""
                reprovacoes.append(
                    f"a description narra {narrados} elemento(s){como}, mas o dataset desenha {total}"
                )

    # ── AVISA — ordem, só com âncora numérica, distinta e inteiramente citada ─────────
    ancoras = [ancora_numerica(e) for e in elementos]
    if all(a is not None for a in ancoras) and len(set(ancoras)) == len(ancoras):
        posicoes = [posicao(a, plano) for a in ancoras]
        if all(p >= 0 for p in posicoes):
            fora = [i for i in range(1, total) if posicoes[i] < posicoes[i - 1]]
            if fora:
                trocados = ", ".join(
                    f"«{rotulo(elementos[i])}» antes de «{rotulo(elementos[i - 1])}»" for i in fora
                )
                avisos.append(f"a description narra fora da ordem desenhada: {trocados}")

    return reprovacoes, avisos


def mdx_rastreados() -> list[Path]:
    """Só o que o git rastreia.

    Um glob pegaria artigo não rastreado de outra sessão na mesma árvore e reprovaria
    trabalho alheio em voo — que não é matéria deste gate.
    """
    saida = subprocess.run(
        ["git", "ls-files", "--", "content/artigos/*/index.pt-br.mdx"],
        capture_output=True, text=True, cwd=RAIZ,
    )
    if saida.returncode:
        sys.exit(f"git ls-files falhou:\n{saida.stderr[:400]}")
    return [RAIZ / linha for linha in saida.stdout.split()]


def main(argv: list[str]) -> int:
    alvos = [Path(a).resolve() for a in argv[1:]] or mdx_rastreados()
    bancos = datasets_do_ts(FONTE_TS)

    medidas = 0
    reprovadas: list[tuple[str, str, list[str]]] = []
    avisadas: list[tuple[str, str, list[str]]] = []
    pulados: dict[str, int] = {}
    sem_regra: dict[str, int] = {}

    def pular(motivo: str) -> None:
        pulados[motivo] = pulados.get(motivo, 0) + 1

    for arquivo in alvos:
        slug = arquivo.parent.name
        texto = arquivo.read_text(encoding="utf-8")

        for componente, _ in QUALQUER_INVOCACAO.findall(texto):
            if componente not in FAMILIA:
                sem_regra[componente] = sem_regra.get(componente, 0) + 1

        for componente, bruto in INVOCACAO.findall(texto):
            props = dict(ATRIBUTO.findall(bruto))
            nome = props.get("dataset")
            banco = bancos.get(FAMILIA[componente]) or {}
            if nome not in banco:
                pular(f"dataset ausente de {FONTE_TS.name}: {componente}/{nome}")
                continue
            if "description" not in props:
                pular(f"sem prop description literal: {componente}/{nome}")
                continue
            medidas += 1
            reprovacoes, avisos = checar(componente, props["description"], dict(banco[nome]))
            if reprovacoes:
                reprovadas.append((slug, nome, reprovacoes))
            if avisos:
                avisadas.append((slug, nome, avisos))

    for slug, nome, itens in reprovadas:
        print(f"[REPROVA] {slug} — {nome}")
        for item in itens:
            print(f"    -> {item}")
    for slug, nome, itens in avisadas:
        print(f"[aviso]   {slug} — {nome}")
        for item in itens:
            print(f"    -> {item}")
    for motivo, quantas in sorted(pulados.items()):
        print(f"[pulado]  {motivo} ({quantas}×)")
    if sem_regra:
        nomes = ", ".join(f"{c} {n}×" for c, n in sorted(sem_regra.items(), key=lambda x: -x[1]))
        print(
            f"[fora]    {len(sem_regra)} componente(s) fora das {len(FAMILIA)} famílias com regra "
            f"de contagem, {sum(sem_regra.values())} invocação(ões) — não medidos: {nomes}"
        )

    print(
        f"\ndescription: {medidas} figura(s) medida(s) em {len(alvos)} artigo(s) | "
        f"{len(reprovadas)} reprovada(s) | {len(avisadas)} com aviso"
    )
    return 1 if reprovadas else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
