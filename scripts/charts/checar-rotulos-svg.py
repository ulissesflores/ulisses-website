#!/usr/bin/env python3
"""Orçamento de largura de TODO texto desenhado dentro dos SVGs do site.

POR QUE ESTE ARQUIVO EXISTE: o `_pdf/build_pdf.py` desenha as figuras num viewBox de
1250px com gutters largos e tem `assert` de largura; o SITE desenha as mesmas figuras em
720px (barras) e 764px (waffle), com gutters fixos e SEM assert nenhum. Rótulo que não
cabe no site é **cortado em silêncio** pelo viewBox — não quebra o build, não some do
DOM, só desaparece da imagem. O PDF que o Ulisses aprovou nunca teve esse corte.

O que é medido, contra a geometria REAL lida em 2026-08-03 de
`/Users/ulissesflores/Developer/ulisses-website/lib/content/`:

| Componente        | Texto            | Âncora            | Orçamento |
|---|---|---|---|
| CountryBarsChart  | title (15px)     | x=24, início      | 696px |
| CountryBarsChart  | subtitle (11px)  | x=24, início      | 696px |
| CountryBarsChart  | source (9px)     | x=24, LINHA ÚNICA | 696px |
| CountryBarsChart  | group.label (10px, UPPERCASE, tracking .08em) | x=24 | 696px |
| CountryBarsChart  | item.name (11px) | x=140, FIM        | 140px |
| CountryBarsChart  | item.valueLabel (11px) | fim da barra +8 | 720 − x |
| WaffleChart       | title/subtitle/source | x=24         | 740px |
| WaffleChart       | category.label (11px) / .sublabel (10px) | x=604 | 160px |

`source` NÃO quebra linha no site (o do PDF quebra, via `_quebra()`): é um `<text>` só.

FONTE MEDIDA (recalibrado em 2026-08-13, lote 7 da repaginação): os 8 componentes de chart
de `lib/content/` passaram a carregar a classe `font-chart` no `<svg>` raiz, que fixa o
stack Fahkwang -> Noto Sans Hebrew -> fallback do sistema, **independente de `--font-ui`**.
Medimos com os TTF reais em `/Users/ulissesflores/Developer/redacao/fontes-medidor/`.
Trocar a tipografia do site não invalida mais esta calibração.

PESO IMPORTA: desde o lote 7 o `next/font` carrega Fahkwang **700 real** (`lib/fonts.ts`) —
antes o browser sintetizava (faux bold), com métrica diferente da real. Quem renderiza 700,
conferido em `lib/content/`:

| Texto | Peso |
|---|---|
| title (15px), em todos os componentes | 700 |
| CountryBarsChart group.label (10px)   | 700 |
| CountryBarsChart item.name / item.valueLabel (11px) | 700 **se `item.emphasis`**, senão 400 |
| subtitle (11px), source (9px), waffle label (11px) e sublabel (10px) | 400 |

O hebraico usa Noto Sans Hebrew (variável). ARMADILHA: os eixos vêm na ordem
`[Weight, Width]` — inverter não dá erro, devolve largura errada em silêncio.

MARGEM: o alvo é 85% do orçamento, não 100% — a fonte real varia por plataforma e o
corte é silencioso. `--estrito` reprova acima de 85%; sem a flag, reprova só acima de 100%.

USO:
    python3 checar-rotulos-site.py --estrito \
        entrega/assets/artigos-charts-keys.ts entrega/*.mdx
"""

from __future__ import annotations

import argparse
import json
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


def datasets_do_ts(caminho: Path) -> dict:
    """Avalia o TS como JS. O arquivo de entrega é um fragmento (chaves soltas): embrulha."""
    bruto = caminho.read_text(encoding="utf-8")
    js = (
        re.sub(r"^import .*$", "", bruto, flags=re.M)
        .replace("export const", "const")
        .replace(": Record<string, CountryBarsDataset>", "")
        .replace(": Record<string, WaffleDataset>", "")
    )
    js = re.sub(r"^(export )?interface[\s\S]*?\n\}", "", js, flags=re.M)
    # A decisão olha o BRUTO, não o `js` já reescrito: o cabeçalho do arquivo de entrega
    # cita `export const countryBarsDatasets` dentro de um comentário.
    if not re.search(r"^export const (countryBars|waffle)Datasets", bruto, flags=re.M):
        # Arquivo de ENTREGA: chaves soltas, sem os `export const` do site. Elas são
        # sintaxe válida de literal de objeto (comentários inclusive) — basta embrulhar,
        # e separar barras de waffle depois, pelo formato do valor.
        js = f"const soltos = {{\n{js}\n}};"
        rotulo = "soltos"
    else:
        rotulo = "null"
    js += (
        f"\nconst _s = {rotulo} ?? {{}};"
        "\nconst _cb = typeof countryBarsDatasets === 'undefined' ? {} : countryBarsDatasets;"
        "\nconst _wf = typeof waffleDatasets === 'undefined' ? {} : waffleDatasets;"
        "\nfor (const [k, v] of Object.entries(_s)) (v.categories ? _wf : _cb)[k] = v;"
        "\nconsole.log(JSON.stringify({countryBarsDatasets: _cb, waffleDatasets: _wf}));"
    )
    saida = subprocess.run(["node", "-e", js], capture_output=True, text=True)
    if saida.returncode:
        sys.exit(f"não consegui avaliar {caminho}:\n{saida.stderr}")
    dados = json.loads(saida.stdout)
    # Um .ts que avalia mas não rende dataset nenhum é PIOR que um erro: o relatório
    # sai "0 acima de 85%" porque não mediu nada. Aconteceu com os wrappers
    # `...Additions` (formato descartado na aplicação do artigo #3).
    if not dados["countryBarsDatasets"] and not dados["waffleDatasets"]:
        sys.exit(
            f"{caminho}: avaliou mas não rendeu nenhum dataset — formato não suportado "
            "(o esperado é `export const countryBarsDatasets`/`waffleDatasets` ou chaves "
            "soltas). Medir isto daria falso 'tudo certo'."
        )
    return dados


# Texto que vem por PROP do MDX, por componente: prop -> (px, peso, orçamento).
# Orçamento = quanto o texto pode ocupar antes do viewBox cortar, derivado da geometria
# lida em `lib/content/` (âncora `start` -> W - x; âncora `middle` -> 2 × a menor das duas
# folgas; `yLabel` é rotacionado -90°, então o orçamento dele é a ALTURA, não a largura).
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
    # W=760, duas colunas (x=24 e x=396) de PANEL_W=340: os títulos de coluna são 12/700.
    "TvChannelsDiagram": _CABECALHO(736)
    | {"leftTitle": (12, 700, 340), "rightTitle": (12, 700, 340)},
}
del COMPONENTES["TvChannelsDiagram"]["subtitle"]  # este componente não tem subtitle

BLOCO_MDX = re.compile(rf"<({'|'.join(COMPONENTES)})\b(.*?)/>", re.S)
PROP = re.compile(r'(\w+)="((?:[^"\\]|\\.)*)"', re.S)


def props_do_mdx(caminho: Path) -> list[tuple[str, dict]]:
    texto = caminho.read_text(encoding="utf-8")
    blocos = []
    for m in BLOCO_MDX.finditer(texto):
        props = {k: re.sub(r"\s*\n\s*", " ", v) for k, v in PROP.findall(m.group(2))}
        blocos.append((m.group(1), props))
    return blocos


def medir(
    rotulo: str,
    texto: str,
    px: int,
    orcamento: float,
    tracking: float = 0.0,
    peso: int = 400,
):
    lw = largura(texto, px, tracking, peso)
    return dict(
        rotulo=rotulo,
        texto=texto,
        largura=lw,
        orcamento=orcamento,
        uso=lw / orcamento,
        peso=peso,
    )


def checar(caminhos: list[Path]) -> list[dict]:
    medidas: list[dict] = []

    for caminho in caminhos:
        if caminho.suffix == ".ts":
            dados = datasets_do_ts(caminho)
            for chave, ds in dados.get("countryBarsDatasets", {}).items():
                for g in ds["groups"]:
                    medidas.append(
                        medir(
                            f"{chave} · grupo",
                            g["label"].upper(),
                            10,
                            CB["W"] - CB["X"],
                            0.08,
                            peso=700,
                        )
                    )
                    for it in g["items"]:
                        # `emphasis` engrossa nome E valor para 700 (country-bars-chart.tsx).
                        peso = 700 if it.get("emphasis") else 400
                        medidas.append(
                            medir(
                                f"{chave} · name", it["name"], 11, CB["PADL"] - 10, peso=peso
                            )
                        )
                        x = CB["PADL"] + (it["value"] / ds["max"]) * CB_PLOT + 8
                        medidas.append(
                            medir(
                                f"{chave} · valueLabel",
                                it["valueLabel"],
                                11,
                                CB["W"] - x,
                                peso=peso,
                            )
                        )
            for chave, ds in dados.get("waffleDatasets", {}).items():
                for c in ds["categories"]:
                    medidas.append(medir(f"{chave} · label", c["label"], 11, WF["LEGENDA"]))
                    medidas.append(
                        medir(f"{chave} · sublabel", c["sublabel"], 10, WF["LEGENDA"])
                    )
        else:
            for componente, props in props_do_mdx(caminho):
                onde = f"{caminho.name} · {props.get('dataset', componente)}"
                for prop, (px, peso, orc) in COMPONENTES[componente].items():
                    if prop in props:
                        medidas.append(
                            medir(f"{onde} · {prop}", props[prop], px, orc, peso=peso)
                        )
    return medidas


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("caminhos", nargs="*", type=Path)
    ap.add_argument(
        "--estrito", action="store_true", help="reprova acima de 85%% do orçamento"
    )
    ap.add_argument("--tudo", action="store_true", help="lista também o que passou")
    args = ap.parse_args()

    # Sem argumento explícito, varre TODO artigo publicado mais o arquivo de
    # dados. É esta forma que o `sota:check` chama: um artigo novo entra na
    # varredura sozinho, sem ninguém precisar lembrar de adicioná-lo aqui.
    caminhos = args.caminhos
    if not caminhos:
        raiz = Path(__file__).resolve().parents[2]
        caminhos = sorted((raiz / "content/artigos").glob("*/index.*.mdx"))
        caminhos.append(raiz / "data/artigos-charts.ts")

    medidas = checar(caminhos)
    limite = ALVO if args.estrito else 1.0
    ruins = [m for m in medidas if m["uso"] > limite]

    for m in sorted(medidas if args.tudo else ruins, key=lambda m: -m["uso"]):
        marca = "ESTOURA" if m["uso"] > 1 else ("APERTADO" if m["uso"] > ALVO else "ok     ")
        print(
            f"{marca} {m['uso']:5.0%} ({m['largura']:6.1f}/{m['orcamento']:5.1f}px) "
            f"{'bold ' if m['peso'] == 700 else '     '}{m['rotulo']}: {m['texto']!r}"
        )

    print(f"\n{len(medidas)} textos medidos · {len(ruins)} acima de {limite:.0%}")
    return 1 if ruins else 0


if __name__ == "__main__":
    sys.exit(main())
