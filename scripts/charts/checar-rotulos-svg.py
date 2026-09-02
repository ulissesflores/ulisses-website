#!/usr/bin/env python3
"""Orçamento de largura de TODO texto desenhado dentro dos SVGs do site.

POR QUE ESTE ARQUIVO EXISTE: o `_pdf/build_pdf.py` desenha as figuras num viewBox de
1250px com gutters largos e tem `assert` de largura; o SITE desenha as mesmas figuras em
720px (barras) e 764px (waffle), com gutters fixos e SEM assert nenhum. Rótulo que não
cabe no site é **cortado em silêncio** pelo viewBox — não quebra o build, não some do
DOM, só desaparece da imagem. O PDF que o Ulisses aprovou nunca teve esse corte.

DOIS REGIMES DE MEDIÇÃO, porque são dois tipos de figura:

1. **Gráficos de dados** (barras, waffle, funil, curvas): o texto ou vem por prop do
   `.mdx` (`title`/`subtitle`/`source`/nome de eixo) ou é rótulo de série no dataset.
   A parede é o viewBox, e o alvo é **85% do orçamento** (`--estrito`) — a fonte real
   varia por plataforma e o corte é silencioso.
2. **Figuras de geometria própria** (os seis diagramas abaixo): quase todo o texto mora
   DENTRO de uma caixa desenhada — célula, pílula, painel, coluna da linha do tempo. Aí
   a parede não é o viewBox, é a caixa; e o que reprova é **folga menor que 6px** de
   qualquer lado, ou dois textos vizinhos encostando um no outro. Percentual não serve:
   várias dessas caixas são dimensionadas pelo próprio texto (fórmula de contagem de
   caractere), então elas vivem, por construção, acima de 85%.

COBERTURA (espelho de `lib/content/mdx-components.tsx`, lido em 2026-09-02 — 22 entradas):

| Componente | Regime | Texto medido |
|---|---|---|
| CountryBarsChart | 1 | props + grupo, nome e valor de cada item |
| WaffleChart | 1 | props + label/sublabel de cada categoria |
| FunnelChart, EffortCostChart, InvertedUChart, NoiseFloorChart, NoiseVsSignalBars, TvChannelsDiagram | 1 | props |
| WordChoiceDiagram, WatermarkReachDiagram, TextVsFileDiagram, KeyPatternDiagram, KitchenDiagram, StepFlowDiagram | 2 | props + tudo que o dataset desenha |
| FlowLineDiagram, ConstraintExperimentChart, VramLadder | 2 | props + tudo que o dataset desenha |
| ObligationMatrix | 2 | props + tudo que o dataset desenha |
| ThermometerTrioDiagram | 2 | props + tudo que o dataset desenha |
| SimulationRenderer, YouTube, ArticleFigure | — | não desenham texto em SVG |

Componente instanciado num `.mdx` que não esteja nessa lista **reprova com exit 1** em vez
de ser pulado em silêncio: figura nova fora da cobertura foi exatamente como oito rótulos
cortados chegaram a página publicada no `noisy-tv-agentes`. Ao registrar componente novo em
`lib/content/mdx-components.tsx`, ensine a geometria dele aqui NO MESMO passo.

O QUE AINDA NÃO É MEDIDO (buraco conhecido, mesma classe do que este arquivo fecha): os
rótulos de série de `funnelDatasets` e `chartDatasets` (Funnel, EffortCost, InvertedU,
NoiseFloor, NoiseVsSignalBars) — desses cinco só os props entram. Quem for mexer nesses
datasets mede a olho, ou ensina a geometria deles aqui primeiro.

A geometria dos seis diagramas do regime 2 foi promovida dos medidores de dossiê que a
validaram na produção do artigo (`marca-dagua-claude/assets/checar-word-choice.py`,
`.../checar-figuras-marca-dagua.py`, `memoria-llm-local/assets/checar-kitchen.py`). Aqueles
medem UM artigo e congelam com ele; este varre o acervo inteiro e é o que segue vivo.

FONTE MEDIDA (recalibrado em 2026-08-13, lote 7 da repaginação): os 8 componentes de chart
de `lib/content/` passaram a carregar a classe `font-chart` no `<svg>` raiz, que fixa o
stack Fahkwang -> Noto Sans Hebrew -> fallback do sistema, **independente de `--font-ui`**.
Medimos com os TTF reais em `/Users/ulissesflores/Developer/redacao/fontes-medidor/`.
Trocar a tipografia do site não invalida mais esta calibração.

PESO IMPORTA: desde o lote 7 o `next/font` carrega Fahkwang **700 real** (`lib/fonts.ts`) —
antes o browser sintetizava (faux bold), com métrica diferente da real.

O hebraico usa Noto Sans Hebrew (variável). ARMADILHA: os eixos vêm na ordem
`[Weight, Width]` — inverter não dá erro, devolve largura errada em silêncio.

USO — sem argumento varre TODO o acervo publicado, que é como o `sota:check` chama:

    npm run charts:labels          # ou: python3 scripts/charts/checar-rotulos-svg.py

Com argumento, mede só o que for passado (módulos de dados E os `.mdx` que os consomem):

    python3 scripts/charts/checar-rotulos-svg.py --estrito \\
        data/artigos-charts.ts data/kitchen-diagram.ts content/artigos/memoria-llm-local/index.*.mdx
"""

from __future__ import annotations

import argparse
import json
import math
import re
import subprocess
import sys
from functools import lru_cache
from pathlib import Path

from PIL import ImageFont

FONTES = Path(__file__).resolve().parent / "fonts"
FONTE_LATINA = {400: FONTES / "Fahkwang-Regular.ttf", 700: FONTES / "Fahkwang-Bold.ttf"}
FONTE_HEBRAICA = FONTES / "NotoSansHebrew.ttf"  # variável, eixos [Weight, Width]
ALVO = 0.85
FOLGA = 6.0  # px mínimos entre um texto e a parede da caixa que o prende (regime 2)

CB = dict(W=720, PADL=150, PADR=64, X=24)
CB_PLOT = CB["W"] - CB["PADL"] - CB["PADR"]
WF = dict(W=24 + 50 * 11 + 190, X=24, LEGENDA=190 - 18 - 12)


def _eh_hebraico(texto: str) -> bool:
    return any("֐" <= c <= "׿" for c in texto)


@lru_cache(maxsize=None)
def _fonte(hebraico: bool, px: int, peso: int) -> ImageFont.FreeTypeFont:
    if not hebraico:
        return ImageFont.truetype(str(FONTE_LATINA[peso]), px)
    fonte = ImageFont.truetype(str(FONTE_HEBRAICA), px)
    fonte.set_variation_by_axes([peso, 100])  # ordem dos eixos: [Weight, Width]
    return fonte


def largura(texto: str, px: int, tracking: float = 0.0, peso: int = 400) -> float:
    fonte = _fonte(_eh_hebraico(texto), px, peso)
    return fonte.getlength(texto) + tracking * px * max(len(texto) - 1, 0)


# ─────────────────────────── carregamento dos módulos TS ───────────────────────────

# `export const` -> família interna. É por este nome que o módulo é reconhecido.
FAMILIAS = {
    "countryBarsDatasets": "countryBars",
    "waffleDatasets": "waffle",
    "stepFlowDatasets": "stepFlow",
    "wordChoiceDatasets": "wordChoice",
    "watermarkReachDatasets": "watermarkReach",
    "textVsFileDatasets": "textVsFile",
    "keyPatternDatasets": "keyPattern",
    "kitchenDatasets": "kitchen",
    "flowLineDatasets": "flowLine",
    "constraintExperimentDatasets": "constraintExperiment",
    "vramLadderDatasets": "vramLadder",
    "obligationMatrixDatasets": "obligationMatrix",
    "thermometerTrioDatasets": "thermometerTrio",
}

# Fragmento de entrega (chaves soltas, para colar dentro de um `Record` do site): a
# família sai da FORMA do valor. Só estas três são inequívocas — qualquer outra coisa
# reprova, porque adivinhar aqui é medir o dataset errado e reportar "tudo certo".
FORMA_SOLTA = {"categories": "waffle", "groups": "countryBars", "steps": "stepFlow"}


def datasets_do_ts(caminho: Path) -> dict[str, dict]:
    """Avalia o TS como JS e devolve `{família: {chave: dataset}}`."""
    bruto = caminho.read_text(encoding="utf-8")
    js = re.sub(r"^import .*$", "", bruto, flags=re.M)
    # `export type X = A | B;` numa linha só não tem `\n}` para fechar: o stripper de
    # bloco abaixo engoliria dali até o `}` do PRÓPRIO Record de dados, e o arquivo
    # inteiro sairia como "não rendeu nenhum dataset". Foi o caso de `CeDataset`.
    js = re.sub(r"^(export )?type \w+\s*=[^;{]*;$", "", js, flags=re.M)
    js = re.sub(r"^(export )?(interface|type)[\s\S]*?\n\}", "", js, flags=re.M)
    js = re.sub(r"^export const (\w+)\s*:[^=]+=", r"const \1 =", js, flags=re.M)
    js = re.sub(r"^export const ", "const ", js, flags=re.M)

    nomes = [n for n in re.findall(r"^const (\w+)\s*=", js, flags=re.M) if n in FAMILIAS]
    if nomes:
        pares = ",".join(f"['{FAMILIAS[n]}',{n}]" for n in nomes)
        js += f"\nconsole.log(JSON.stringify(Object.fromEntries([{pares}])));"
    else:
        # Arquivo de ENTREGA: chaves soltas, sem os `export const` do site. Elas são
        # sintaxe válida de literal de objeto (comentários inclusive) — basta embrulhar.
        js = (
            f"const soltos = {{\n{js}\n}};\n"
            f"const forma = {json.dumps(FORMA_SOLTA)};\n"
            "const fora = {};\n"
            "for (const [k, v] of Object.entries(soltos)) {\n"
            "  const par = Object.entries(forma).find(([campo]) => v && v[campo]);\n"
            "  if (!par) { console.error(k); process.exit(3); }\n"
            "  if (!fora[par[1]]) fora[par[1]] = {};\n"
            "  fora[par[1]][k] = v;\n"
            "}\n"
            "console.log(JSON.stringify(fora));"
        )

    saida = subprocess.run(["node", "-e", js], capture_output=True, text=True)
    if saida.returncode == 3:
        sys.exit(
            f"{caminho}: o bloco solto '{saida.stderr.strip()}' não tem forma "
            f"reconhecível ({'/'.join(FORMA_SOLTA)}). Use a forma `export const "
            "<família>Datasets = {...}` — adivinhar a família daria falso 'tudo certo'."
        )
    if saida.returncode:
        sys.exit(f"não consegui avaliar {caminho}:\n{saida.stderr}")

    dados = json.loads(saida.stdout)
    # Um .ts que avalia mas não rende dataset nenhum é PIOR que um erro: o relatório
    # sai "0 acima de 85%" porque não mediu nada. Aconteceu com os wrappers
    # `...Additions` (formato descartado na aplicação do artigo #3).
    if not any(dados.values()):
        sys.exit(
            f"{caminho}: avaliou mas não rendeu nenhum dataset — formato não suportado "
            f"(o esperado é `export const <nome>` entre {sorted(FAMILIAS)}, ou chaves "
            "soltas de waffle/countryBars/stepFlow). Medir isto daria falso 'tudo certo'."
        )
    return dados


# ───────────────── regime 1: texto por prop, parede = viewBox ─────────────────

# prop -> (px, peso, orçamento). Orçamento = quanto o texto pode ocupar antes do viewBox
# cortar, derivado da geometria lida em `lib/content/` (âncora `start` -> W - x; âncora
# `middle` -> 2 × a menor das duas folgas; `yLabel` é rotacionado -90°, então o orçamento
# dele é a ALTURA, não a largura).
# `description` NÃO entra: vira `aria-label`/`<title>`, não é `<text>` desenhado.
CB_ORC = CB["W"] - CB["X"]  # 696 — CountryBars e Funnel
WF_ORC = WF["W"] - CB["X"]  # 740 — Waffle
_CABECALHO = lambda orc: {  # noqa: E731 — title/subtitle/source, o trio de todo chart
    "title": (15, 700, orc),
    "subtitle": (11, 400, orc),
    "source": (9, 400, orc),
}
# inverted-u e noise-floor têm a MESMA caixa (W=720, PAD 56/24, H=420).
_EIXOS_720 = {"xLabel": (11, 400, 688), "yLabel": (11, 400, 412)}

COMPONENTES: dict[str, dict[str, tuple[int, int, float]]] = {
    "CountryBarsChart": _CABECALHO(CB_ORC),
    "FunnelChart": _CABECALHO(CB_ORC),
    "WaffleChart": _CABECALHO(WF_ORC),
    # W=720, PAD.left=52, plotW=536, H=436 -> xLabel centrado em 320, yLabel em 209.
    "EffortCostChart": _CABECALHO(668) | {"xLabel": (11, 400, 640), "yLabel": (11, 400, 418)},
    "InvertedUChart": _CABECALHO(664) | _EIXOS_720,
    "NoiseFloorChart": _CABECALHO(664) | _EIXOS_720,
    "NoiseVsSignalBars": _CABECALHO(704),  # PAD.left=16; não tem xLabel/yLabel
    # W=720, H=470, PAD 44/220/70/66: cabeçalho a x=66 (orçamento 646), plotW=434, plotH=356
    # (yLabel rotacionado). Rótulos de série/âncora/legenda vivem em `data/utilization-curve.ts`
    # e são medidos pelo `checar-curva.py` do dossiê `tokens-por-dolar` — mesmo buraco declarado
    # dos `chartDatasets`.
    "UtilizationCurveChart": _CABECALHO(646) | {"xLabel": (11, 400, 434), "yLabel": (11, 400, 356)},
    # W=760, duas colunas (x=24 e x=396) de PANEL_W=340: os títulos de coluna são 12/700.
    "TvChannelsDiagram": _CABECALHO(736)
    | {"leftTitle": (12, 700, 340), "rightTitle": (12, 700, 340)},
}
del COMPONENTES["TvChannelsDiagram"]["subtitle"]  # este componente não tem subtitle


def medir(
    rotulo: str,
    texto: str,
    px: int,
    orcamento: float,
    tracking: float = 0.0,
    peso: int = 400,
) -> dict:
    lw = largura(texto, px, tracking, peso)
    return dict(
        rotulo=rotulo,
        texto=texto,
        largura=lw,
        orcamento=orcamento,
        uso=lw / orcamento,
        folga=None,
        peso=peso,
    )


# ──────────── regime 2: texto dentro de caixa desenhada, parede = a caixa ────────────


class Cena:
    """Acumula (quem, x0, x1, parede_esq, parede_dir, texto, peso, fila) do desenho.

    `fila` agrupa textos que ficam LADO A LADO na mesma altura (as pontas de um
    medidor, os rótulos de uma linha do tempo, as legendas de três colunas): neles o
    que reprova não é a parede, é encostar no vizinho. A largura não vê colisão
    vertical — para isso o gate é olhar o PNG, e ele continua obrigatório.
    """

    def __init__(
        self, nome: str, folga_vizinho: float = FOLGA, folga_parede: float = FOLGA
    ) -> None:
        self.nome = nome
        self.folga_vizinho = folga_vizinho
        # Mínimo até a parede. 6px é o default porque nessas figuras a parede é a caixa
        # que corta (célula, painel, viewBox). Cena cuja parede é uma borda DESENHADA
        # bem dentro do viewBox baixa este valor: lá passar da parede é feio, não é
        # corte silencioso — e o corte de verdade continua sendo pego, porque a borda
        # desenhada vem antes do viewBox.
        self.folga_parede = folga_parede
        self.itens: list[tuple[str, float, float, float, float, str, int, str | None]] = []

    def _põe(self, quem, x0, x1, paredes, texto, peso, fila):
        self.itens.append((quem, x0, x1, paredes[0], paredes[1], texto, peso, fila))

    def inicio(self, quem, texto, px, peso, x, paredes, fila=None):
        self._põe(quem, x, x + largura(texto, px, peso=peso), paredes, texto, peso, fila)

    def fim(self, quem, texto, px, peso, x, paredes, fila=None):
        """Texto com `textAnchor='end'`: cresce para a esquerda."""
        self._põe(quem, x - largura(texto, px, peso=peso), x, paredes, texto, peso, fila)

    def centro(self, quem, texto, px, peso, cx, paredes, fila=None):
        m = largura(texto, px, peso=peso) / 2
        self._põe(quem, cx - m, cx + m, paredes, texto, peso, fila)

    def vertical(self, quem, texto, px, peso, altura):
        """Texto rotacionado -90°: o orçamento dele é a ALTURA, não a largura.
        Medir contra a largura daria um falso 'cabe' — a armadilha do yLabel."""
        m = largura(texto, px, peso=peso) / 2
        self._põe(
            f"{quem} (rotacionado)", altura / 2 - m, altura / 2 + m, (0.0, altura),
            texto, peso, None,
        )

    def caixa(self, quem, descricao, x0, x1, paredes, fila=None):
        """Geometria sem texto (um espaço vazio, uma pílula) que também tem de caber."""
        self._põe(quem, x0, x1, paredes, descricao, 400, fila)


def medidas_da_cena(cena: Cena) -> tuple[list[dict], list[dict]]:
    """Converte a cena em medidas de parede + colisões entre vizinhos de fila."""
    medidas = [
        dict(
            rotulo=f"{cena.nome} · {quem}",
            texto=texto,
            largura=x1 - x0,
            orcamento=None,
            uso=None,
            folga=min(x0 - lo, hi - x1),
            minimo=cena.folga_parede,
            peso=peso,
        )
        for quem, x0, x1, lo, hi, texto, peso, _ in cena.itens
    ]

    colisoes = []
    filas = {fila for *_, fila in cena.itens if fila}
    for fila in sorted(filas):
        ordenados = sorted(
            (it for it in cena.itens if it[7] == fila), key=lambda it: it[1]
        )
        for a, b in zip(ordenados, ordenados[1:]):
            colisoes.append(
                dict(
                    rotulo=f"{cena.nome} · {a[0]} -> {b[0]}",
                    texto=f"{a[5]!r} / {b[5]!r}",
                    vao=b[1] - a[2],
                    minimo=cena.folga_vizinho,
                )
            )
    return medidas, colisoes


# ── WordChoiceDiagram — geometria de `word-choice-diagram.tsx` ──────────────────
WC_MOLDURA = (12.0, 748.0)  # W=760, 6px de respiro de cada lado da borda do viewBox
WC_TIRA = {"x": 24, "gap": 8}
WC_SLOT_W = 132
WC_CAND = {"x": 452, "w": 268}
WC_CHAVE = {"x": 60, "w": 268}


def _largura_caixa_wc(texto: str, peso: int) -> float:
    """Mesma fórmula do componente — é ela que decide o retângulo desenhado."""
    return round(len(texto) * (8 if peso == 700 else 7.6)) + 24


def cena_word_choice(ds: dict, props: dict) -> Cena:
    modo = props.get("mode") or "livre"  # default do componente
    cena_ds = ds[modo]
    c = Cena(f"WordChoiceDiagram · {modo}")
    c.inicio("title", props["title"], 15, 700, WC_TIRA["x"], WC_MOLDURA)

    # A tira de palavras já escritas: cada caixa é dimensionada pela fórmula, então
    # o risco não é o texto na caixa — é a tira inteira passar da moldura.
    cursor = float(WC_TIRA["x"])
    for i, p in enumerate(cena_ds["written"]):
        w = _largura_caixa_wc(p, 400)
        c.centro(f"written[{i}]", p, 12, 400, cursor + w / 2, WC_MOLDURA)
        cursor += w + WC_TIRA["gap"]

    c.caixa("slot (espaço vazio)", "[espaço vazio]", cursor, cursor + WC_SLOT_W, WC_MOLDURA)
    c.centro("slotLabel", cena_ds["slotLabel"], 10, 400, cursor + WC_SLOT_W / 2, WC_MOLDURA)

    cand = (WC_CAND["x"], WC_CAND["x"] + WC_CAND["w"])
    for i, cand_ds in enumerate(cena_ds["candidates"]):
        cx = WC_CAND["x"] + WC_CAND["w"] / 2
        c.centro(f"candidates[{i}].word", cand_ds["word"], 13, 700, cx, cand)
        c.centro(f"candidates[{i}].note", cand_ds["note"], 10, 400, cx, cand)

    chave = (WC_CHAVE["x"], WC_CHAVE["x"] + WC_CHAVE["w"])
    c.inicio("keyLabel", cena_ds["keyLabel"], 12, 700, WC_CHAVE["x"] + 16, chave)
    c.inicio("keyNote", cena_ds["keyNote"], 10, 400, WC_CHAVE["x"] + 16, chave)

    c.inicio("caption", cena_ds["caption"], 11, 400, WC_TIRA["x"], WC_MOLDURA)
    if props.get("source"):
        c.inicio("source", props["source"], 9, 400, WC_TIRA["x"], WC_MOLDURA)
    return c


# ── WatermarkReachDiagram — geometria de `watermark-reach-diagram.tsx` ──────────
WR_MOLDURA = (12.0, 708.0)  # W=720
WR_PLOT = {"x": 168, "y": 74, "w": 528, "h": 236}
WR_COL = WR_PLOT["w"] / 2
WR_PAD = 15


def cena_watermark_reach(ds: dict, props: dict) -> Cena:
    c = Cena("WatermarkReachDiagram")
    c.inicio("title", props["title"], 15, 700, 24, WR_MOLDURA)
    c.vertical("yAxis", ds["yAxis"], 11, 700, WR_PLOT["h"])

    # Rótulos de linha: anchor 'end' a 12px da borda esquerda da matriz. A parede
    # direita é a matriz em si (168), não a âncora — senão a folga sai sempre 0 e o
    # gate vira alarme falso.
    for quem, texto in (("yHigh", ds["yHigh"]), ("yLow", ds["yLow"])):
        c.fim(quem, texto, 11, 400, WR_PLOT["x"] - 12, (WR_MOLDURA[0], float(WR_PLOT["x"])))

    # Rótulos de coluna: centrados na coluna, sem invadir a vizinha.
    for i, (quem, texto) in enumerate((("xLow", ds["xLow"]), ("xHigh", ds["xHigh"]))):
        x0 = WR_PLOT["x"] + i * WR_COL
        c.centro(quem, texto, 11, 400, x0 + WR_COL / 2, (x0, x0 + WR_COL))

    c.centro("xAxis", ds["xAxis"], 11, 700, WR_PLOT["x"] + WR_PLOT["w"] / 2, WR_MOLDURA)

    # Células: o texto começa em x+PAD e a parede é a do retângulo (x+4 .. x+COL-4).
    for i, cell in enumerate(ds["cells"]):
        x = WR_PLOT["x"] + (i % 2) * WR_COL
        paredes = (x + 4, x + WR_COL - 4)
        c.inicio(f"cells[{i}].headline", cell["headline"], 12, 700, x + WR_PAD, paredes)
        for j, item in enumerate(cell["items"]):
            c.inicio(f"cells[{i}].items[{j}]", f"· {item}", 11, 400, x + WR_PAD, paredes)

    if props.get("source"):
        c.inicio("source", props["source"], 10, 400, 24, WR_MOLDURA)
    return c


# ── TextVsFileDiagram — geometria de `text-vs-file-diagram.tsx` ─────────────────
TF_MOLDURA = (12.0, 708.0)  # W=720
TF_PANEL = {"w": 328, "gap": 16}
TF_LEFT = 24
TF_RIGHT = TF_LEFT + TF_PANEL["w"] + TF_PANEL["gap"]
TF_PAD = 18
TF_PILL_GAP = 6
TF_TAG = {"x": 176, "w": 134}


def cena_text_vs_file(ds: dict, props: dict) -> Cena:
    c = Cena("TextVsFileDiagram")
    c.inicio("title", props["title"], 15, 700, 24, TF_MOLDURA)

    esq, dir_ = ds["left"], ds["right"]
    p_esq = (float(TF_LEFT), float(TF_LEFT + TF_PANEL["w"]))
    p_dir = (float(TF_RIGHT), float(TF_RIGHT + TF_PANEL["w"]))

    c.inicio("left.badge", esq["badge"], 13, 700, TF_LEFT + TF_PAD, p_esq)
    c.inicio("left.subtitle", esq["subtitle"], 11, 400, TF_LEFT + TF_PAD, p_esq)
    c.inicio("left.wordsNote", esq["wordsNote"], 11, 400, TF_LEFT + TF_PAD, p_esq)
    for i, nota in enumerate(esq["notes"]):
        c.inicio(f"left.notes[{i}]", nota, 11, 400, TF_LEFT + TF_PAD, p_esq)

    # As pílulas dividem a largura útil em partes iguais — vaga estreita.
    n = len(esq["words"])
    pill_w = (TF_PANEL["w"] - 2 * TF_PAD - (n - 1) * TF_PILL_GAP) / n
    for i, w in enumerate(esq["words"]):
        x = TF_LEFT + TF_PAD + i * (pill_w + TF_PILL_GAP)
        peso = 700 if w["marked"] else 400
        c.centro(f"left.words[{i}]", w["text"], 11, peso, x + pill_w / 2, (x, x + pill_w))

    c.inicio("right.badge", dir_["badge"], 13, 700, TF_RIGHT + TF_PAD, p_dir)
    c.inicio("right.subtitle", dir_["subtitle"], 11, 400, TF_RIGHT + TF_PAD, p_dir)
    for i, nota in enumerate(dir_["notes"]):
        c.inicio(f"right.notes[{i}]", nota, 11, 400, TF_RIGHT + TF_PAD, p_dir)

    tag0 = TF_RIGHT + TF_TAG["x"]
    c.centro(
        "right.tagLabel", dir_["tagLabel"], 11, 700, tag0 + TF_TAG["w"] / 2,
        (float(tag0), float(tag0 + TF_TAG["w"])),
    )

    if props.get("source"):
        c.inicio("source", props["source"], 10, 400, 24, TF_MOLDURA)
    return c


# ── KeyPatternDiagram — geometria de `key-pattern-diagram.tsx` ──────────────────
KP_MOLDURA = (12.0, 708.0)  # W=720
KP_FAIXA = {"x": 24, "w": 672}
KP_GAP = 4
KP_MEDIDOR = {"x": 24, "w": 672}


def cena_key_pattern(ds: dict, props: dict) -> Cena:
    modo = props.get("mode") or "dia"  # default do componente
    cena_ds = ds[modo]
    c = Cena(f"KeyPatternDiagram · {modo}")
    c.inicio("title", props["title"], 15, 700, 24, KP_MOLDURA)
    c.inicio("badge", cena_ds["badge"], 11, 700, 24, KP_MOLDURA)

    # Rótulo dentro da célula: o componente só desenha com até 3 células.
    n = len(cena_ds["pattern"])
    if n <= 3:
        celula_w = (KP_FAIXA["w"] - (n - 1) * KP_GAP) / n
        for i in range(n):
            x = KP_FAIXA["x"] + i * (celula_w + KP_GAP)
            paredes = (x, x + celula_w)
            c.centro(f"cellLabel[{i}]", cena_ds["cellLabel"], 13, 700, x + celula_w / 2, paredes)
            c.centro(f"cellNote[{i}]", cena_ds["cellNote"], 11, 400, x + celula_w / 2, paredes)

    c.inicio("meterAxis", ds["meterAxis"], 11, 400, 24, KP_MOLDURA)
    # As duas pontas do medidor não podem se tocar: viram vizinhas.
    c.inicio("meter.low", ds["meterLow"], 10, 400, KP_MEDIDOR["x"], KP_MOLDURA, fila="meter")
    c.fim(
        "meter.high", ds["meterHigh"], 10, 400,
        KP_MEDIDOR["x"] + KP_MEDIDOR["w"], KP_MOLDURA, fila="meter",
    )

    c.inicio("caption", cena_ds["caption"], 11, 400, 24, KP_MOLDURA)
    if props.get("source"):
        c.inicio("source", props["source"], 9, 400, 24, KP_MOLDURA)
    return c


# ── StepFlowDiagram — geometria de `step-flow-diagram.tsx` (duas orientações) ───
SF_W = 720
SF_MOLDURA = (12.0, 708.0)
SF_CHAIN = {"left": 24, "right": 24}
SF_TL = {"left": 24, "right": 24}


def cena_step_flow(ds: dict, props: dict) -> Cena:
    timeline = ds.get("orientation") == "timeline"
    c = Cena(f"StepFlowDiagram · {'timeline' if timeline else 'chain'}")
    c.inicio("title", props["title"], 15, 700, SF_CHAIN["left"], SF_MOLDURA)
    if props.get("subtitle"):
        c.inicio("subtitle", props["subtitle"], 11, 400, SF_CHAIN["left"], SF_MOLDURA)

    passos = ds["steps"]
    n = len(passos)

    if timeline:
        plot_w = SF_W - SF_TL["left"] - SF_TL["right"]
        passo = plot_w / (n - 1 or 1)
        for i, s in enumerate(passos):
            # O componente ancora os extremos em start/end e centra o resto. A parede
            # aqui é só o viewBox: o risco real da linha do tempo não é a moldura, é um
            # rótulo encostar no do ponto vizinho — e isso se mede comparando os dois
            # intervalos, não contra uma parede inventada no meio do caminho (que
            # reprovaria os extremos, que crescem para um lado só).
            if i == 0:
                pos, metodo = float(SF_TL["left"]), "inicio"
            elif i == n - 1:
                pos, metodo = float(SF_W - SF_TL["right"]), "fim"
            else:
                pos, metodo = SF_TL["left"] + i * passo, "centro"
            getattr(c, metodo)(
                f"steps[{i}].label", s["label"], 12, 700, pos, SF_MOLDURA, fila="label"
            )
            if s.get("detail"):
                getattr(c, metodo)(
                    f"steps[{i}].detail", s["detail"], 11, 400, pos, SF_MOLDURA, fila="detail"
                )
    else:
        # Cadeia vertical: uma caixa por passo, texto a 16px da borda esquerda dela.
        caixa = (float(SF_CHAIN["left"]), float(SF_W - SF_CHAIN["right"]))
        x = SF_CHAIN["left"] + 16
        for i, s in enumerate(passos):
            c.inicio(f"steps[{i}].label", f"{i + 1}. {s['label']}", 12, 700, x, caixa)
            if s.get("detail"):
                c.inicio(f"steps[{i}].detail", s["detail"], 11, 400, x, caixa)

    if props.get("source"):
        c.inicio("source", props["source"], 10, 400, SF_CHAIN["left"], SF_MOLDURA)
    return c


# ── KitchenDiagram — geometria de `kitchen-diagram.tsx` ─────────────────────────
KT_MOLDURA = (12.0, 748.0)  # W=760 — vale para title e source, desenhados fora da caixa
KT_CAIXA = (28.0, 732.0)  # borda interna útil da cozinha (x=24, w=712, 4px de respiro)
KT_CENTROS = {"pantry": 131.0, "counter": 403.0, "pot": 652.0}
KT_FOLGA_VIZINHO = 8.0  # px mínimos entre duas legendas na mesma linha
# A parede desta figura é a BORDA DESENHADA da cozinha (732), 16px dentro do viewBox
# (748): encostar nela é apertado, não é corte. Quem corta em silêncio é o viewBox, e a
# borda vem antes dele — texto que passe de 732 já reprova. Mesma régua do medidor que
# validou a figura na produção (`memoria-llm-local/assets/checar-kitchen.py`).
KT_FOLGA_PAREDE = 0.0
KT_TAG_FIM = {"kitchen": 712.0, "inflow": 560.0}  # pílulas com âncora 'end'


def _largura_pilula_kt(texto: str) -> float:
    """Mesma fórmula do componente — é ela que dimensiona o retângulo desenhado."""
    return round(len(texto) * 6) + 22


def _pilula_kt(c: Cena, quem: str, texto: str, x0: float, fila: str) -> None:
    """A pílula tem de caber na moldura E o texto (10/700) tem de caber na pílula.

    A fórmula de largura é contagem de caractere, calibrada em pt-br: num idioma de
    caractere mais largo (o hebraico) ela subdimensiona a pílula em silêncio.
    """
    w = _largura_pilula_kt(texto)
    c.caixa(f"{quem} (pílula)", texto, x0, x0 + w, KT_CAIXA, fila=fila)
    c.centro(f"{quem} (texto)", texto, 10, 700, x0 + w / 2, (x0, x0 + w))


def cena_kitchen(ds: dict, props: dict) -> Cena:
    etiquetado = (props.get("mode") or "plain") == "labeled"
    c = Cena(
        f"KitchenDiagram · {'labeled' if etiquetado else 'plain'}",
        KT_FOLGA_VIZINHO,
        KT_FOLGA_PAREDE,
    )
    c.inicio("title", props["title"], 15, 700, 24, KT_MOLDURA)

    c.inicio("kitchen.name", ds["kitchen"]["name"], 12, 700, 40, KT_CAIXA, fila="topo")
    c.inicio("kitchen.note", ds["kitchen"]["note"], 10, 400, 40, KT_CAIXA)
    c.inicio("inflow.name", ds["inflow"]["name"], 10, 400, 246, KT_CAIXA, fila="fluxo")
    # 9,5px no componente; medir em 10 é o lado seguro do erro.
    c.centro("growth", ds["growth"], 10, 400, KT_CENTROS["counter"], KT_CAIXA)

    if etiquetado:
        for quem in ("kitchen", "inflow"):
            fim = KT_TAG_FIM[quem]
            _pilula_kt(
                c, f"{quem}.tag", ds[quem]["tag"],
                fim - _largura_pilula_kt(ds[quem]["tag"]),
                "topo" if quem == "kitchen" else "fluxo",
            )

    for quem, cx in KT_CENTROS.items():
        peca = ds[quem]
        c.centro(f"{quem}.name", peca["name"], 13, 700, cx, KT_CAIXA, fila="name")
        c.centro(f"{quem}.note", peca["note"], 10, 400, cx, KT_CAIXA, fila="note")
        if peca.get("note2"):
            c.centro(f"{quem}.note2", peca["note2"], 10, 400, cx, KT_CAIXA, fila="note2")
        if etiquetado:
            _pilula_kt(
                c, f"{quem}.tag", peca["tag"],
                cx - _largura_pilula_kt(peca["tag"]) / 2, "tag",
            )
            if peca.get("tagNote"):
                c.centro(f"{quem}.tagNote", peca["tagNote"], 10, 400, cx, KT_CAIXA, fila="tagNote")

    if props.get("source"):
        c.inicio("source", props["source"], 9, 400, 24, KT_MOLDURA)
    return c


# ── FlowLineDiagram — geometria de `flow-line-diagram.tsx` ──────────────────────
FL_MOLDURA = (12.0, 708.0)  # W=720, 12px de respiro do viewBox (mesma régua do StepFlow)
FL_CENTROS = (80.0, 220.0, 360.0, 500.0, 640.0)
FL_CAIXA_W = 112.0
FL_PASSO = 140.0
# O medidor de baixo tem uma seta desenhada no meio: cada ponta escreve contra ela,
# não contra a borda da caixa. É a parede que aperta de verdade.
FL_MEDIDOR = {"x": 24.0, "w": 672.0, "seta_x0": 330.0, "seta_x1": 390.0}
# Nenhuma parede desta figura CORTA: a caixa do posto é `<rect>` sem `clipPath`, e a
# moldura fica 12px antes do viewBox. Mesma situação do KitchenDiagram — por isso a
# folga vai embutida em cada parede (a do medidor guarda 6px da seta desenhada) em vez
# de sair do piso global de 6px, que é o piso de quem corta. O que corta continua pego:
# nome mais largo que a caixa reprova, e nome encostando no vizinho também.
FL_FOLGA_PAREDE = 0.0


def cena_flow_line(ds: dict, props: dict) -> Cena:
    c = Cena("FlowLineDiagram", folga_parede=FL_FOLGA_PAREDE)
    c.inicio("title", props["title"], 15, 700, 24, FL_MOLDURA)

    r = ds["restricao"]
    for i, posto in enumerate(ds["postos"]):
        cx = FL_CENTROS[i]
        # O nome mora DENTRO da caixa de 112px — a parede dele é ela, não o viewBox.
        caixa = (cx - FL_CAIXA_W / 2, cx + FL_CAIXA_W / 2)
        c.centro(f"postos[{i}].nome", posto["nome"], 12, 700, cx, caixa, fila="nome")
        if posto.get("capacidade"):
            c.centro(
                f"postos[{i}].capacidade", posto["capacidade"], 10,
                700 if i == r else 400, cx, FL_MOLDURA, fila="capacidade",
            )

    if r > 0:
        # Rótulo da pilha: centrado no vão antes da restrição (componente: vao + 14).
        vao = FL_CENTROS[r - 1] + FL_CAIXA_W / 2
        c.centro("filaAntes", ds["filaAntes"], 10, 400, vao + FL_PASSO / 2 - FL_CAIXA_W / 2, FL_MOLDURA)

    antes = FL_CENTROS[:r]
    if ds.get("ociosoAntes") and antes:
        c.centro("ociosoAntes", ds["ociosoAntes"], 10, 400, sum(antes) / len(antes), FL_MOLDURA, fila="ocioso")
    depois = FL_CENTROS[r + 1 :]
    if depois and ds["ociosoDepois"]:
        c.centro("ociosoDepois", ds["ociosoDepois"], 10, 400, sum(depois) / len(depois), FL_MOLDURA, fila="ocioso")

    c.inicio(
        "medidor.entra", ds["medidor"]["entra"], 12, 400,
        FL_MEDIDOR["x"] + 16, (FL_MEDIDOR["x"], FL_MEDIDOR["seta_x0"] - FOLGA),
    )
    c.fim(
        "medidor.sai", ds["medidor"]["sai"], 12, 700,
        FL_MEDIDOR["x"] + FL_MEDIDOR["w"] - 16,
        (FL_MEDIDOR["seta_x1"] + FOLGA, FL_MEDIDOR["x"] + FL_MEDIDOR["w"]),
    )
    c.inicio("conclusao", ds["conclusao"], 12, 700, 24, FL_MOLDURA)
    if props.get("source"):
        c.inicio("source", props["source"], 9, 400, 24, FL_MOLDURA)
    return c


# ── ConstraintExperimentChart — geometria de `constraint-experiment-chart.tsx` ──
CE_MOLDURA = (12.0, 708.0)
CE_LIN = {"H": 470, "top": 48, "right": 24, "bottom": 100, "left": 60}
CE_BAR = {"top": 48, "left": 176, "right": 24, "nome_x": 166}
CE_W = 720


def cena_constraint_experiment(ds: dict, props: dict) -> Cena:
    """Um componente, dois corpos. O `mode` da tag TEM de bater com o `modo` do
    dataset — o componente lança erro no pareamento errado, e medir a forma errada
    daria um 'tudo certo' sobre uma figura que nem chega a renderizar."""
    if props.get("mode") != ds["modo"]:
        sys.exit(
            f'ConstraintExperimentChart: mode="{props.get("mode")}" não bate com o '
            f'dataset (modo "{ds["modo"]}")'
        )
    return (
        _cena_ce_linhas(ds, props)
        if ds["modo"] in ("teto", "residuo")
        else _cena_ce_barras(ds, props)
    )


def _cena_ce_cabecalho(ds: dict, props: dict) -> Cena:
    c = Cena(f"ConstraintExperimentChart · {ds['modo']}")
    c.inicio("title", props["title"], 15, 700, 24, CE_MOLDURA)
    if props.get("subtitle"):
        c.inicio("subtitle", props["subtitle"], 11, 400, 24, CE_MOLDURA)
    return c


def _cena_ce_rodape(c: Cena, ds: dict, props: dict) -> Cena:
    c.inicio("conclusao", ds["conclusao"], 12, 700, 24, CE_MOLDURA)
    if props.get("source"):
        c.inicio("source", props["source"], 9, 400, 24, CE_MOLDURA)
    return c


def _cena_ce_linhas(ds: dict, props: dict) -> Cena:
    c = _cena_ce_cabecalho(ds, props)
    plot_w = CE_W - CE_LIN["left"] - CE_LIN["right"]
    plot_h = CE_LIN["H"] - CE_LIN["top"] - CE_LIN["bottom"]
    x0, x1 = ds["xDominio"]
    y0, y1 = ds["yDominio"]
    sx = lambda x: CE_LIN["left"] + (x - x0) / (x1 - x0) * plot_w  # noqa: E731
    sy = lambda y: CE_LIN["top"] + plot_h - (y - y0) / (y1 - y0) * plot_h  # noqa: E731
    plot = (float(CE_LIN["left"]), float(CE_LIN["left"] + plot_w))

    # Cada tick do eixo Y está numa altura diferente: parede sim, vizinho não.
    for t in ds["yTicks"]:
        c.fim(f"yTick[{t['label']}]", t["label"], 10, 400, CE_LIN["left"] - 8, (12.0, plot[0]))
    for t in ds["xTicks"]:
        c.centro(f"xTick[{t['label']}]", t["label"], 10, 400, sx(t["v"]), CE_MOLDURA, fila="xtick")

    ref = ds["referencia"]
    x_ref = sx(ref["valor"]) if ref["eixo"] == "x" else None
    if ref["eixo"] == "y":
        c.inicio("referencia.rotulo", ref["rotulo"], 10, 700, CE_LIN["left"] + 6, plot)
    else:
        c.fim("referencia.rotulo", ref["rotulo"], 10, 700, x_ref - 6, (plot[0], CE_MOLDURA[1]))

    # Chamadas: vizinhas quando as bases caem na MESMA faixa de 12px de altura — é
    # assim que duas se encostam. E nenhuma pode cruzar a linha de referência vertical,
    # que aqui entra na faixa como um obstáculo de largura zero.
    faixas = set()
    for i, ch in enumerate(ds["chamadas"]):
        x = sx(ch["x"]) + ch["dx"]
        faixa = f"chamada@{round((sy(ch['y']) + ch['dy']) / 12)}"
        faixas.add(faixa)
        metodo = {"end": "fim", "start": "inicio", "middle": "centro"}[ch["ancora"]]
        getattr(c, metodo)(f"chamadas[{i}]", ch["texto"], 11, 400, x, CE_MOLDURA, fila=faixa)
    if x_ref is not None:
        for faixa in sorted(faixas):
            c.caixa("referencia (linha)", f"| x={ref['valor']}", x_ref, x_ref, CE_MOLDURA, fila=faixa)

    if props.get("xLabel"):
        c.centro("xLabel", props["xLabel"], 11, 400, CE_LIN["left"] + plot_w / 2, plot)
    if props.get("yLabel"):
        c.vertical("yLabel", props["yLabel"], 11, 400, plot_h)
    return _cena_ce_rodape(c, ds, props)


def _cena_ce_barras(ds: dict, props: dict) -> Cena:
    c = _cena_ce_cabecalho(ds, props)
    plot_w = CE_W - CE_BAR["left"] - CE_BAR["right"]
    log = ds.get("escalaLog")

    def sx_log(v):
        d0, d1 = math.log10(log["dominio"][0]), math.log10(log["dominio"][1])
        return (math.log10(v) - d0) / (d1 - d0) * plot_w

    for bi, bloco in enumerate(ds["blocos"]):
        # O cabeçalho é o único texto com `letterSpacing` (0.08em a 10px = 0,8px por
        # vão): `Cena.inicio` não tem tracking, então o intervalo entra pronto.
        cab = bloco["cabecalho"].upper()
        c.caixa(f"blocos[{bi}].cabecalho", cab, 24.0, 24.0 + largura(cab, 10, 0.08, 700), CE_MOLDURA)
        sx = sx_log if log else (lambda v, m=bloco["escala"]["max"]: v / m * plot_w)
        for i, barra in enumerate(bloco["barras"]):
            peso = 700 if barra["papel"] == "destaque" else 400
            fila = f"b{bi}r{i}"
            c.fim(f"blocos[{bi}].barras[{i}].nome", barra["nome"], 11, peso,
                  CE_BAR["nome_x"], (12.0, float(CE_BAR["left"])), fila=fila)
            c.inicio(f"blocos[{bi}].barras[{i}].rotulo", barra["rotulo"], 11, peso,
                     CE_BAR["left"] + sx(barra["valor"]) + 8, CE_MOLDURA, fila=fila)
        if bloco.get("escala"):
            c.inicio(f"blocos[{bi}].escala.rotulo", bloco["escala"]["rotulo"], 9, 400,
                     CE_BAR["left"], CE_MOLDURA)

    if log:
        for t in log["ticks"]:
            c.centro(f"escalaLog.tick[{t['label']}]", t["label"], 9, 400,
                     CE_BAR["left"] + sx_log(t["v"]), CE_MOLDURA, fila="logtick")
        c.inicio("escalaLog.rotulo", log["rotulo"], 9, 400, CE_BAR["left"], CE_MOLDURA)
    return _cena_ce_rodape(c, ds, props)


# ── VramLadder — geometria de `vram-ladder.tsx` ─────────────────────────────────
# Duas paredes diferentes na mesma figura: a coluna do degrau é cortada por onde a
# trilha começa (x0), e a linha do modelo não tem parede útil — o que reprova nela é
# o "cabe até" (ancorado no FIM da trilha, crescendo para a esquerda) encostar no nome
# do modelo. Por isso os dois entram na mesma fila, um por degrau.
VL_W = 760
VL_PAD = {"left": 8, "right": 8}
VL_MOLDURA = (0.0, float(VL_W))  # não há borda desenhada dentro: a parede é o viewBox
VL_COL_CAP = 152  # coluna do degrau: capacidade em cima, hardware embaixo
VL_COL_FIM = 140  # faixa livre à direita da trilha, para onde o transbordo cresce
VL_X0 = VL_PAD["left"] + VL_COL_CAP
VL_PLOT_W = VL_W - VL_PAD["left"] - VL_PAD["right"] - VL_COL_CAP - VL_COL_FIM


def cena_vram_ladder(ds: dict, props: dict) -> Cena:
    c = Cena("VramLadder")
    esq = float(VL_PAD["left"])
    c.inicio("title", props["title"], 15, 700, esq, VL_MOLDURA)
    if props.get("subtitle"):
        c.inicio("subtitle", props["subtitle"], 11, 400, esq, VL_MOLDURA)

    # A coluna do degrau é cortada de verdade: a trilha começa em x0 e o texto do
    # modelo é desenhado ali. Já o texto do modelo NÃO tem parede à esquerda — ele
    # nasce nessa mesma âncora de projeto, e a distância dele para a coluna já está
    # garantida pela folga que a coluna deve à parede dela. A parede dele é o viewBox.
    coluna = (0.0, float(VL_X0))
    linha = VL_MOLDURA
    for i, d in enumerate(ds["degraus"]):
        c.inicio(f"degraus[{i}].capacidade", f"{d['capacidade']} GB", 15, 700, esq, coluna)
        c.inicio(f"degraus[{i}].hardware", d["hardware"], 9, 400, esq, coluna)
        # modelo e quant vivem no MESMO <text> (o quant é um tspan), separados por dois
        # espaços: medir só o modelo deixaria passar um quant que invade o vizinho.
        c.inicio(
            f"degraus[{i}].modelo",
            f"{d['modelo']}  {d['quant']}",
            10.5, 400, float(VL_X0), linha, fila=f"degrau{i}",
        )
        c.fim(
            f"degraus[{i}].cabeAte",
            d["cabeAte"],
            10,
            700 if d["pesos"] + d["cacheRef"] > d["capacidade"] else 400,
            float(VL_X0 + VL_PLOT_W),
            linha,
            fila=f"degrau{i}",
        )

    # O componente não mede texto: posiciona a legenda estimando ~5,1px por caractere a
    # 10px. Medimos a largura REAL nas posições que essa ESTIMATIVA produz — é justamente
    # onde ela subestima que um item encosta no marcador do seguinte. O marcador entra
    # como caixa para que o vão medido seja texto -> marcador, não texto -> texto.
    x = float(VL_PAD["left"])
    for chave in ("pesos", "cache", "estouro"):
        texto = ds["legenda"][chave]
        c.inicio(f"legenda.{chave}", texto, 10, 400, x + 15, VL_MOLDURA)
        # O item inteiro (marcador + rótulo) entra na fila como UMA peça: o marcador e
        # o rótulo dele são a mesma unidade, separados por 5px de projeto. O vão que
        # importa é o do fim de um rótulo até o marcador do item SEGUINTE.
        c.caixa(
            f"legenda.{chave} (item)", texto, x, x + 15 + largura(texto, 10),
            VL_MOLDURA, fila="legenda",
        )
        x += 15 + len(texto) * 5.1 + 22

    if props.get("source"):
        c.inicio("source", props["source"], 9, 400, esq, VL_MOLDURA)
    return c


# ── ObligationMatrix — geometria de `obligation-matrix.tsx` ────────────────────
# Duas paredes distintas: a coluna de rótulo à esquerda é cortada por onde a primeira
# célula começa (x0), e o texto de cada célula é preso à CÉLULA dele, não ao viewBox —
# rótulo de célula que passa da célula encosta no da coluna vizinha muito antes de
# chegar à borda da figura. As marcas (traço/meia-lua/disco) são shapes, não glifos:
# não entram na medição de texto de propósito, e é por isso que são shapes.
OM_W = 760
OM_PAD = {"left": 8, "right": 8}
OM_COL_ROTULO = 236
OM_X0 = OM_PAD["left"] + OM_COL_ROTULO
OM_COL_W = (OM_W - OM_PAD["left"] - OM_PAD["right"] - OM_COL_ROTULO) / 5
OM_MOLDURA = (0.0, float(OM_W))
OM_ROTULO = (0.0, float(OM_X0))


def _om_celula(c: int) -> tuple[float, float]:
    return (OM_X0 + c * OM_COL_W, OM_X0 + (c + 1) * OM_COL_W)


def cena_obligation_matrix(ds: dict, props: dict) -> Cena:
    c = Cena("ObligationMatrix")
    esq = float(OM_PAD["left"])
    c.inicio("title", props["title"], 15, 700, esq, OM_MOLDURA)
    if props.get("subtitle"):
        c.inicio("subtitle", props["subtitle"], 11, 400, esq, OM_MOLDURA)

    # Cabeçalho: cada coluna é o espaço de busca enumerado, centrado na célula dela.
    for i, coluna in enumerate(ds["colunas"]):
        cx = OM_X0 + (i + 0.5) * OM_COL_W
        for k, linha in enumerate(coluna):
            c.centro(f"colunas[{i}][{k}]", linha, 9.5, 400, cx, _om_celula(i))

    for i, l in enumerate(ds["linhas"]):
        # O controle não tem número, então o texto dele não recua — e por isso também
        # não disputa altura com número nenhum.
        controle = bool(l.get("controle"))
        x_texto = esq if controle else esq + 30
        fila = f"linha{i}"
        if l["numero"]:
            c.inicio(f"linhas[{i}].numero", l["numero"], 14, 700, esq, OM_ROTULO, fila=fila)
        for k, linha in enumerate(l["destinatario"]):
            # Só a primeira linha do destinatário divide altura com o número.
            c.inicio(
                f"linhas[{i}].destinatario[{k}]", linha, 9.5 if controle else 11, 400,
                x_texto, OM_ROTULO, fila=fila if k == 0 else None,
            )
        if l["volume"]:
            c.inicio(f"linhas[{i}].volume", l["volume"], 9, 400, x_texto, OM_ROTULO)
        for j, celula in enumerate(l["celulas"]):
            cx = OM_X0 + (j + 0.5) * OM_COL_W
            for k, nota in enumerate(celula.get("nota") or []):
                c.centro(f"linhas[{i}].celulas[{j}].nota[{k}]", nota, 8, 400, cx, _om_celula(j))

    # Legenda: mesma estimativa de ~5,1px/caractere do componente, medida na fonte real
    # nas posições que essa ESTIMATIVA produz. O marcador entra como caixa para que o vão
    # medido seja rótulo -> marcador do item seguinte, não texto -> texto.
    x = float(OM_PAD["left"])
    for chave in ("ausente", "parcial", "presente"):
        texto = ds["legenda"][chave]
        c.inicio(f"legenda.{chave}", texto, 10, 400, x + 22, OM_MOLDURA)
        c.caixa(
            f"legenda.{chave} (item)", texto, x, x + 22 + largura(texto, 10),
            OM_MOLDURA, fila="legenda",
        )
        x += 15 + len(texto) * 5.1 + 22

    for k, linha in enumerate(ds["conclusao"]):
        c.inicio(f"conclusao[{k}]", linha, 11, 400, esq, OM_MOLDURA)
    if props.get("source"):
        c.inicio("source", props["source"], 9, 400, esq, OM_MOLDURA)
    return c


# ── ThermometerTrioDiagram — geometria de `thermometer-trio-diagram.tsx` ───────
# Porte de `medir_termometros`, o medidor do dossiê `ia-mercado-de-trabalho`
# (`assets/checar-figuras.py`), que nasceu lendo este mesmo .tsx — os dois arquivos são
# byte-idênticos. Os três números abaixo vêm de lá já auditados, e é por isso que a cena
# não usa os defaults da `Cena`:
#   · moldura (24, 696) — a margem editorial do desenho, 24px DENTRO do viewBox (W=720);
#   · folga_parede ZERO — encostar na parede é permitido, passar dela não. É o caso que o
#     docstring da `Cena` prevê: a parede não é o viewBox, é uma margem bem dentro dele,
#     então o corte SILENCIOSO de verdade continua 24px além do que se mede aqui. Exigir
#     os 6px default reprovaria `title`/`subtitle`/`conclusao`/`source` das 10 figuras por
#     construção — eles nascem ancorados EM x=24, que é a própria parede. O dossiê tolera
#     ainda 0,5px de estouro; aqui não se tolera nenhum, então esta cena é a mais estrita
#     das duas;
#   · folga_vizinho 8px — as três colunas ficam lado a lado na mesma altura, e o que
#     reprova nelas é encostar no vizinho, não na parede.
# Os tubos, os bulbos e o preenchimento são shapes: não entram na medição de texto de
# propósito, e é por isso que são shapes.
TH_MOLDURA = (24.0, 696.0)
TH_COLS = (144.0, 360.0, 576.0)


def cena_termometros(ds: dict, props: dict) -> Cena:
    c = Cena("ThermometerTrioDiagram", folga_vizinho=8.0, folga_parede=0.0)
    esq = TH_MOLDURA[0]
    c.inicio("title", props["title"], 15, 700, esq, TH_MOLDURA)
    if props.get("subtitle"):
        c.inicio("subtitle", props["subtitle"], 11, 400, esq, TH_MOLDURA)

    for i, t in enumerate(ds["termometros"]):
        cx = TH_COLS[i]
        # `nome` é o único texto com `letterSpacing` (0.06em a 12px = 0,72px por vão) e
        # `Cena.centro` não tem tracking: o intervalo entra pronto, como em
        # `cena_constraint_experiment`.
        meia = largura(t["nome"], 12, 0.06, 700) / 2
        c.caixa(f"termometros[{i}].nome", t["nome"], cx - meia, cx + meia,
                TH_MOLDURA, fila="nome")
        c.centro(f"termometros[{i}].pergunta", t["pergunta"], 10, 400, cx,
                 TH_MOLDURA, fila="pergunta")
        c.centro(f"termometros[{i}].leitura", t["leitura"], 11, 700, cx,
                 TH_MOLDURA, fila="leitura")
        if t.get("sub"):
            c.centro(f"termometros[{i}].sub", t["sub"], 10, 400, cx,
                     TH_MOLDURA, fila="sub")
        # O bulbo vazio desenha um "?" — um glifo é um glifo, e texto não medido é
        # exatamente o silêncio deste gate, mesmo quando é um caractere só.
        if t.get("vazio"):
            c.centro(f"termometros[{i}].bulbo", "?", 14, 700, cx, TH_MOLDURA)

    c.inicio("conclusao", ds["conclusao"], 12, 700, esq, TH_MOLDURA)
    if props.get("source"):
        c.inicio("source", props["source"], 9, 400, esq, TH_MOLDURA)
    return c


# componente -> (família do dataset, construtor da cena)
CENAS = {
    "WordChoiceDiagram": ("wordChoice", cena_word_choice),
    "WatermarkReachDiagram": ("watermarkReach", cena_watermark_reach),
    "TextVsFileDiagram": ("textVsFile", cena_text_vs_file),
    "KeyPatternDiagram": ("keyPattern", cena_key_pattern),
    "StepFlowDiagram": ("stepFlow", cena_step_flow),
    "KitchenDiagram": ("kitchen", cena_kitchen),
    "FlowLineDiagram": ("flowLine", cena_flow_line),
    "ConstraintExperimentChart": ("constraintExperiment", cena_constraint_experiment),
    "VramLadder": ("vramLadder", cena_vram_ladder),
    "ObligationMatrix": ("obligationMatrix", cena_obligation_matrix),
    "ThermometerTrioDiagram": ("thermometerTrio", cena_termometros),
}

# Registrado em `mdx-components.tsx` mas sem `<text>` próprio: medir não se aplica.
# `YouTube` (iframe) e `ArticleFigure` (next/image + <figcaption>) desenham em HTML
# comum, não em SVG — legenda que não cabe quebra linha, não é cortada em silêncio,
# que é a falha que este medidor existe para pegar.
SEM_TEXTO = {"SimulationRenderer", "YouTube", "ArticleFigure"}


# ───────────────────────────── leitura dos `.mdx` ─────────────────────────────

# O valor entre aspas pode conter `>`: `->` é o estilo da casa para seta, e um `[^>]` cru
# pararia ali, fazendo a invocação INTEIRA não casar — nem medida, nem recusada. Era o caso
# do `<WaffleChart subtitle="... (3 -> 1)">` do memoria-llm-local, nos 5 locales.
INVOCACAO = re.compile(r'<([A-Z][A-Za-z]*)\b((?:"(?:[^"\\]|\\.)*"|[^>"])*?)/>', re.S)
PROP = re.compile(r'(\w+)="((?:[^"\\]|\\.)*)"', re.S)


def figuras_do_mdx(caminho: Path) -> list[tuple[str, dict]]:
    texto = caminho.read_text(encoding="utf-8")
    blocos = []
    for m in INVOCACAO.finditer(texto):
        componente, bruto = m.group(1), m.group(2)
        if componente in SEM_TEXTO:
            continue
        if componente not in COMPONENTES and componente not in CENAS:
            sys.exit(
                f"{caminho}: <{componente}> não tem geometria neste medidor. Se é figura "
                "nova, ensine a geometria dela AQUI antes de publicar — componente fora "
                "da cobertura é como oito rótulos cortados chegaram a página publicada."
            )
        props = {k: re.sub(r"\s*\n\s*", " ", v) for k, v in PROP.findall(bruto)}
        # Prop com chaves (`mode={x}`) passaria despercebida pelo regex e sumiria da
        # medição — o mesmo silêncio que corta rótulo. Recusa.
        sobra = re.sub(r'\w+="(?:[^"\\]|\\.)*"', "", bruto).strip()
        if sobra:
            sys.exit(
                f"{caminho}: <{componente}> tem prop que não é string entre aspas "
                f"duplas: {sobra!r}. O medidor só lê `nome=\"valor\"`."
            )
        if "title" not in props:
            sys.exit(f"{caminho}: <{componente}> sem `title`.")
        blocos.append((componente, props))
    return blocos


# ─────────────────────────────── varredura ───────────────────────────────


def checar(caminhos: list[Path]) -> tuple[list[dict], list[dict], list[str]]:
    dados: dict[str, dict] = {}
    mdxs: list[Path] = []
    for caminho in caminhos:
        if caminho.suffix == ".ts":
            for familia, ds in datasets_do_ts(caminho).items():
                dados.setdefault(familia, {}).update(ds)
        else:
            mdxs.append(caminho)

    medidas: list[dict] = []
    colisoes: list[dict] = []
    faltas: list[str] = []

    # Regime 1, datasets: rótulo de série de barras e de waffle.
    for chave, ds in dados.get("countryBars", {}).items():
        for g in ds["groups"]:
            medidas.append(
                medir(f"{chave} · grupo", g["label"].upper(), 10, CB["W"] - CB["X"], 0.08, peso=700)
            )
            for it in g["items"]:
                # `emphasis` engrossa nome E valor para 700 (country-bars-chart.tsx).
                peso = 700 if it.get("emphasis") else 400
                medidas.append(
                    medir(f"{chave} · name", it["name"], 11, CB["PADL"] - 10, peso=peso)
                )
                x = CB["PADL"] + (it["value"] / ds["max"]) * CB_PLOT + 8
                medidas.append(
                    medir(f"{chave} · valueLabel", it["valueLabel"], 11, CB["W"] - x, peso=peso)
                )
    for chave, ds in dados.get("waffle", {}).items():
        for cat in ds["categories"]:
            medidas.append(medir(f"{chave} · label", cat["label"], 11, WF["LEGENDA"]))
            medidas.append(medir(f"{chave} · sublabel", cat["sublabel"], 10, WF["LEGENDA"]))

    for mdx in mdxs:
        for componente, props in figuras_do_mdx(mdx):
            onde = f"{mdx.name} · {props.get('dataset', componente)}"
            if componente in COMPONENTES:  # regime 1: só os props
                for prop, (px, peso, orc) in COMPONENTES[componente].items():
                    if prop in props:
                        medidas.append(medir(f"{onde} · {prop}", props[prop], px, orc, peso=peso))
                continue

            familia, construtor = CENAS[componente]  # regime 2: a figura inteira
            ds = dados.get(familia, {}).get(props.get("dataset", ""))
            if ds is None:
                # É o mesmo erro que derruba a página em runtime: o componente faz
                # `throw` em dataset desconhecido.
                faltas.append(
                    f"{onde}: dataset '{props.get('dataset')}' não está em nenhum "
                    f"módulo passado ({familia})"
                )
                continue
            try:
                cena = construtor(ds, props)
            except KeyError as erro:
                faltas.append(f"{onde}: o dataset não tem o campo {erro} que a figura desenha")
                continue
            cena.nome = f"{mdx.name} · {cena.nome} · {props.get('dataset')}"
            novas, choques = medidas_da_cena(cena)
            medidas += novas
            colisoes += choques

    return medidas, colisoes, faltas


# ── Gate do bidi hebraico ────────────────────────────────────────────────────
# Este medidor mede LARGURA contra a caixa e por isso NÃO enxerga o bug que cortou 394
# dos 1108 rótulos das páginas `/he` (medido 2026-08-30): sob `direction: rtl` herdado do
# `<html dir="rtl">`, o texto de âncora `start` cresce para a ESQUERDA e o `viewBox` o corta.
# A largura continua cabendo; o que muda é o SENTIDO. O conserto mora em duas regras de
# `app/globals.css` presas ao marcador `svg.font-chart`, então o que dá para travar aqui,
# de forma determinística e sem navegador, é o CONTRATO das duas pontas:
#   1. todo componente que desenha `<text>` carrega `font-chart` no `<svg>` RAIZ;
#   2. as duas regras continuam em `globals.css`.
# Componente novo que esqueça a classe fica fora do conserto e reprova aqui, em vez de
# chegar publicado e invisível ao leitor hebraico.
# (Aberto: a asserção de que o texto de fato cai dentro da moldura exige DOM renderizado.
#  O probe de `getBBox` que mediu isto está no laudo; virar CI é melhoria enfileirada.)
JANELA_TAG_SVG = 800

REGRAS_BIDI = (
    "[dir='rtl'] svg.font-chart",
    "direction: ltr",
    "[dir='rtl'] svg.font-chart text",
    "unicode-bidi: plaintext",
)


def checar_bidi_hebraico(raiz: Path) -> list[str]:
    """Reprova componente sem `font-chart` na raiz, ou globals.css sem as regras."""
    falhas: list[str] = []

    for tsx in sorted((raiz / "lib/content").glob("*.tsx")):
        # Os comentários saem ANTES da busca: vários componentes explicam `<svg>` e `<text>`
        # em prosa (o obligation-matrix explica o próprio conserto de bidi dentro da tag), e
        # sem isso o `find` acha a menção e mede a janela errada.
        txt = re.sub(r"/\*.*?\*/", "", tsx.read_text(encoding="utf-8"), flags=re.S)
        if "<text" not in txt:
            continue
        i = txt.find("<svg")
        if i < 0 or "font-chart" not in txt[i : i + JANELA_TAG_SVG]:
            falhas.append(
                f"{tsx.relative_to(raiz)}: desenha <text> mas não tem `font-chart` no <svg> raiz "
                f"(primeiros {JANELA_TAG_SVG} caracteres da tag) — fica fora do conserto de bidi."
            )

    css = raiz / "app/globals.css"
    conteudo = css.read_text(encoding="utf-8") if css.exists() else ""
    for regra in REGRAS_BIDI:
        if regra not in conteudo:
            falhas.append(f"{css.relative_to(raiz)}: sumiu a regra de bidi hebraico `{regra}`.")

    return falhas


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("caminhos", nargs="*", type=Path)
    ap.add_argument(
        "--estrito",
        action="store_true",
        help="reprova acima de 85%% do orçamento (regime 1; o regime 2 já mede folga em px)",
    )
    ap.add_argument("--tudo", action="store_true", help="lista também o que passou")
    args = ap.parse_args()

    # Sem argumento explícito, varre TODO artigo publicado mais os módulos de dados.
    # É esta forma que o `sota:check` chama: artigo novo entra na varredura sozinho, e
    # módulo de dados novo também — `data/*-diagram.ts` é glob de propósito. Módulo cujo
    # `export const` não esteja em FAMILIAS reprova alto: dado desenhado sem geometria
    # ensinada é exatamente o silêncio que este gate existe para acabar.
    caminhos = args.caminhos
    if not caminhos:
        raiz = Path(__file__).resolve().parents[2]
        caminhos = sorted((raiz / "content/artigos").glob("*/index.*.mdx"))
        caminhos.append(raiz / "data/artigos-charts.ts")
        caminhos += sorted((raiz / "data").glob("*-diagram.ts"))
        caminhos.append(raiz / "data/constraint-experiment-chart.ts")
        # Nomeado sem o sufixo `-diagram`, então o glob acima NÃO o pega: fora desta
        # linha, o módulo seria pulado em silêncio pela varredura — o mesmo silêncio
        # que este arquivo existe para acabar.
        caminhos.append(raiz / "data/obligation-matrix.ts")

    medidas, colisoes, faltas = checar(caminhos)
    limite = ALVO if args.estrito else 1.0

    orcados = [m for m in medidas if m["orcamento"] is not None]
    encaixados = [m for m in medidas if m["folga"] is not None]
    ruins = [m for m in orcados if m["uso"] > limite]
    apertados = [m for m in encaixados if m["folga"] < m["minimo"]]
    choques = [c for c in colisoes if c["vao"] < c["minimo"]]

    if orcados:
        print("── orçamento de largura (parede = viewBox) ──")
    for m in sorted(orcados if args.tudo else ruins, key=lambda m: -m["uso"]):
        marca = "ESTOURA" if m["uso"] > 1 else ("APERTADO" if m["uso"] > ALVO else "ok     ")
        print(
            f"{marca} {m['uso']:5.0%} ({m['largura']:6.1f}/{m['orcamento']:5.1f}px) "
            f"{'bold ' if m['peso'] == 700 else '     '}{m['rotulo']}: {m['texto']!r}"
        )

    if encaixados:
        print("\n── geometria interna das figuras (parede = a caixa desenhada) ──")
    for m in sorted(apertados if not args.tudo else encaixados, key=lambda m: m["folga"]):
        marca = "ESTOURA" if m["folga"] < m["minimo"] else ("APERTADO" if m["folga"] < 2 * FOLGA else "ok     ")
        print(
            f"{marca} folga {m['folga']:7.1f}px (larg {m['largura']:6.1f}px) "
            f"{'bold ' if m['peso'] == 700 else '     '}{m['rotulo']}: {m['texto']!r}"
        )

    if colisoes:
        print("\n── textos vizinhos (o que reprova é encostar no vizinho) ──")
    for c in sorted(choques if not args.tudo else colisoes, key=lambda c: c["vao"]):
        marca = "ENCOSTA" if c["vao"] < c["minimo"] else "ok     "
        print(f"{marca} vão   {c['vao']:7.1f}px               {c['rotulo']}: {c['texto']}")

    if faltas:
        print("\n── dataset ausente (o componente faz `throw` em runtime) ──")
        for f in faltas:
            print(f"FALTA   {f}")

    print(
        f"\n{len(orcados)} texto(s) com orçamento · {len(ruins)} acima de {limite:.0%}"
        f"\n{len(encaixados)} texto(s) em caixa · {len(apertados)} abaixo da folga mínima"
        f"\n{len(colisoes)} par(es) vizinho(s) · {len(choques)} encostando"
        f"\n{len(faltas)} dataset(s) ausente(s)"
    )
    falhas_bidi = checar_bidi_hebraico(Path(__file__).resolve().parents[2])
    if falhas_bidi:
        print("\n── bidi hebraico (contrato do conserto de RTL) ──")
        for f in falhas_bidi:
            print(f"QUEBRA  {f}")
    print(f"{len(falhas_bidi)} quebra(s) no contrato de bidi hebraico")

    return 1 if (ruins or apertados or choques or faltas or falhas_bidi) else 0


if __name__ == "__main__":
    sys.exit(main())
