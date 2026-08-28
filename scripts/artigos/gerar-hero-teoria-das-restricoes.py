#!/usr/bin/env python3
"""Capa (`hero`) do artigo `teoria-das-restricoes`, uma por idioma.

POR QUE ESTE ARQUIVO EXISTE: a capa pt-BR veio pronta do dossiê da redação
(`hero.py`), com TODO texto em português desenhado dentro do PNG — título,
subtítulo, rótulos e o atalho. Servir aquela arte a quem lê em inglês é pior
que não servir capa nenhuma, então a capa e o `og:image` valiam só no pt-BR.
Este script fecha o buraco: rende a MESMA composição nos outros quatro idiomas.

NENHUMA STRING É DIGITADA AQUI. Toda palavra desenhada vem de um arquivo do
repo que já passou pelos gates:

| vaga na capa            | fonte única                                                |
|---|---|
| título (2 linhas)       | `title` do frontmatter do `index.<lang>.mdx`               |
| subtítulo               | prop `title` da figura 1 no mesmo `.mdx`                   |
| atalho no rodapé        | último segmento da prop `source` da figura 1               |
| postos, capacidades, pilha, ociosidade, medidor, tese | `flowLineDatasets['restricao-linha-padaria<sufixo>']` de `data/flow-line-diagram.ts` |

O pt-BR NÃO é regerado: `hero.png`/`hero-og.png` são a arte que o Ulisses
aprovou e que já está no ar. Duas vagas da capa pt-BR (subtítulo e tese) são
frases próprias da capa, sem contraparte traduzida em lugar nenhum do repo;
os outros quatro idiomas usam, nessas duas vagas, o título da figura e a
`conclusao` do dataset — frases aprovadas do artigo daquele idioma. Traduzir
à mão está fora de questão (as traduções deste site nunca são feitas à mão).

HEBRAICO: a Fahkwang não tem hebraico, e misturar fonte por trecho o PIL não
faz sozinho — no `he` a peça inteira sai na Noto Sans Hebrew, que cobre latino
e dígitos. Os blocos de texto alinham à DIREITA e são desenhados com
`direction='rtl'` (exige raqm; o script recusa rodar sem ele, porque sem
shaping o hebraico sai em ordem de código e ninguém vê o defeito no diff).
A GEOMETRIA da linha de postos continua da esquerda para a direita, a mesma
limitação já declarada para as 10 figuras deste artigo.

Uso:
    python3 scripts/artigos/gerar-hero-teoria-das-restricoes.py            # os 4 idiomas
    python3 scripts/artigos/gerar-hero-teoria-das-restricoes.py en         # só um

Saída em `public/artigos/teoria-das-restricoes/`: `hero-<lang>.png` (2400x1260,
paleta adaptativa) e `hero-<lang>-og.png` (1200x630) — `og:image` pesado o
WhatsApp descarta sem avisar, e o gate de peso está no fim deste arquivo.
"""

from __future__ import annotations

import importlib.util
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, features

RAIZ = Path(__file__).resolve().parents[2]
SLUG = "teoria-das-restricoes"
MDX = RAIZ / "content/artigos" / SLUG
SAIDA = RAIZ / "public/artigos" / SLUG
FONTES = RAIZ / "scripts/charts/fonts"

# pt-br fica de fora de propósito: a capa aprovada é a que já está no ar.
IDIOMAS = {"en": "-en", "es": "-es", "it": "-it", "he": "-he"}
OG = (1200, 630)
OG_LIMITE_KB = 300  # acima disso o unfurl do WhatsApp cai calado

W, H = 2400, 1260
BG = (16, 29, 42)
SURFACE = (20, 25, 31)
BORDA = (38, 46, 58)
WHITE = (255, 255, 255)
APOIO = (163, 163, 163)
OURO_CLARO = (196, 173, 127)
OURO = (164, 143, 101)
CINZA = (100, 116, 139)
CINZA_FRACO = (58, 68, 84)
ASSINATURA = (92, 102, 116)

MARGEM = 160
TOPO_TITULO = 140
RESPIRO = 44
PILHA_COLUNAS = 3


def dataset_do_idioma(sufixo: str) -> dict:
    """Reusa o avaliador de TS do medidor de rótulos — um só jeito de ler o módulo."""
    spec = importlib.util.spec_from_file_location(
        "medidor", RAIZ / "scripts/charts/checar-rotulos-svg.py"
    )
    medidor = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(medidor)
    familia = medidor.datasets_do_ts(RAIZ / "data/flow-line-diagram.ts")["flowLine"]
    return familia[f"restricao-linha-padaria{sufixo}"]


def props_da_figura(lang: str) -> dict[str, str]:
    texto = (MDX / f"index.{lang}.mdx").read_text(encoding="utf-8")
    bloco = re.search(
        r'<FlowLineDiagram\b[^>]*?dataset="restricao-linha-padaria[^"]*"[^>]*?/>', texto, re.S
    )
    if not bloco:
        sys.exit(f"{lang}: não achei a figura da padaria no .mdx")
    props = {
        k: re.sub(r"\s*\n\s*", " ", v)
        for k, v in re.findall(r'(\w+)="((?:[^"\\]|\\.)*)"', bloco.group(0), re.S)
    }
    frontmatter = re.search(r"^title:\s*'((?:[^'\\]|\\.)*)'", texto, re.M)
    if not frontmatter:
        sys.exit(f"{lang}: frontmatter sem `title`")
    props["artigo"] = frontmatter.group(1).replace("\\'", "'")
    return props


def titulo_em_duas_linhas(titulo: str) -> tuple[str, str]:
    """`Teoria das Restrições: a restrição é um lugar, não um esforço` ->
    (`a restrição é um lugar,`, `não um esforço.`) — a mesma quebra da capa pt-BR.
    Recusa em vez de adivinhar: título sem os dois pontos ou sem a vírgula sai
    torto na capa e ninguém repara até o card circular."""
    if ": " not in titulo:
        sys.exit(f"título sem `: ` para partir: {titulo!r}")
    tese = titulo.split(": ", 1)[1]
    if ", " not in tese:
        sys.exit(f"tese sem `, ` para quebrar em duas linhas: {tese!r}")
    cabeca, cauda = tese.rsplit(", ", 1)
    return f"{cabeca},", f"{cauda}."


def atalho_do_source(source: str) -> str:
    """O rodapé da capa é o atalho, que a prop `source` da figura já carrega no fim."""
    if " · " not in source:
        sys.exit(f"`source` sem o atalho depois de ` · `: {source!r}")
    return source.rsplit(" · ", 1)[1]


class Pincel:
    """Desenha texto sabendo o idioma: fonte, direção e alinhamento saem daqui.

    Um lugar só decide `rtl`, porque decidir em cada chamada é como um bloco
    escapa e sai em ordem de código — defeito que o diff não mostra.
    """

    def __init__(self, d: ImageDraw.ImageDraw, rtl: bool):
        self.d = d
        self.rtl = rtl
        familia = "NotoSansHebrew" if rtl else "Fahkwang"
        self.arquivo = {
            700: FONTES / (f"{familia}-Bold.ttf" if not rtl else f"{familia}.ttf"),
            400: FONTES / (f"{familia}-Regular.ttf" if not rtl else f"{familia}.ttf"),
        }

    def fonte(self, px: int, peso: int = 400) -> ImageFont.FreeTypeFont:
        f = ImageFont.truetype(str(self.arquivo[peso]), px)
        if self.rtl:
            # A Noto Sans Hebrew é variável: sem fixar o eixo, o "bold" sai regular.
            f.set_variation_by_axes([peso, 100])
        return f

    def _kw(self) -> dict:
        return {"direction": "rtl"} if self.rtl else {}

    def largura(self, texto: str, fonte) -> float:
        return self.d.textlength(texto, font=fonte, **self._kw())

    def altura(self, texto: str, fonte) -> int:
        caixa = self.d.textbbox((0, 0), texto, font=fonte, **self._kw())
        return caixa[3] - caixa[1]

    def bloco(self, texto: str, esq: float, dir_: float, y: float, fonte, cor) -> None:
        """Texto de bloco: encosta na margem que o idioma manda."""
        x = dir_ - self.largura(texto, fonte) if self.rtl else esq
        self.d.text((x, y), texto, font=fonte, fill=cor, **self._kw())

    def centro(self, texto: str, cx: float, y: float, fonte, cor) -> None:
        self.d.text(
            (cx - self.largura(texto, fonte) / 2, y), texto, font=fonte, fill=cor, **self._kw()
        )


def tracejado(d: ImageDraw.ImageDraw, caixa: tuple, cor, largura: int, passo: int = 22) -> None:
    """Retângulo tracejado — o PIL não desenha dash; a ociosidade é desenhada à mão."""
    x0, y0, x1, y1 = caixa
    lados = [((x0, y0), (x1, y0)), ((x1, y0), (x1, y1)), ((x1, y1), (x0, y1)), ((x0, y1), (x0, y0))]
    for (ax, ay), (bx, by) in lados:
        comp = abs(bx - ax) + abs(by - ay)
        n = int(comp // passo)
        for i in range(0, n, 2):
            t0, t1 = i / n, min((i + 1) / n, 1.0)
            d.line(
                [(ax + (bx - ax) * t0, ay + (by - ay) * t0), (ax + (bx - ax) * t1, ay + (by - ay) * t1)],
                fill=cor,
                width=largura,
            )


def desenhar(lang: str, ds: dict, props: dict, estouros: list[str]) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    p = Pincel(d, rtl=(lang == "he"))

    titulo_f = p.fonte(96, 700)
    apoio_f = p.fonte(40)
    rotulo_f = p.fonte(40, 700)
    capacidade_f = p.fonte(30)
    legenda_f = p.fonte(34)
    tese_f = p.fonte(40, 700)
    assinatura_f = p.fonte(30)

    util = W - 2 * MARGEM

    def cabe(vaga: str, texto: str, fonte, limite: float) -> None:
        larg = p.largura(texto, fonte)
        if larg > limite:
            estouros.append(f"{lang} · {vaga}: {larg:.0f}px > {limite:.0f}px — {texto!r}")

    # ── Título em duas linhas: a tese do artigo ───────────────────────────
    # Avanço de linha por referência FIXA ("Ag"), não pela altura da tinta da linha:
    # medir o texto real encolhe o vão quando a linha não tem descendente, e o
    # subtítulo sobe. Só aparece com mais de um idioma — em inglês ("not an effort.")
    # o vão fechava, em português ("não um esforço.") não.
    alt_titulo = p.altura("Ag", titulo_f)
    alt_apoio = p.altura("Ag", apoio_f)
    l1, l2 = titulo_em_duas_linhas(props["artigo"])
    y = TOPO_TITULO
    for linha, cor, vao in ((l1, WHITE, 34), (l2, OURO_CLARO, RESPIRO)):
        cabe("titulo", linha, titulo_f, util)
        p.bloco(linha, MARGEM, W - MARGEM, y, titulo_f, cor)
        y += alt_titulo + vao

    sub = props["title"]
    cabe("subtitulo", sub, apoio_f, util)
    p.bloco(sub, MARGEM, W - MARGEM, y, apoio_f, APOIO)
    y += alt_apoio + RESPIRO

    # ── A moldura, e dentro dela a linha de postos ────────────────────────
    rodape_y = H - 108
    moldura = (MARGEM, y, W - MARGEM, rodape_y - RESPIRO - 20)
    d.rounded_rectangle(moldura, radius=28, fill=SURFACE, outline=BORDA, width=2)

    alt_rotulo = p.altura("Ag", rotulo_f)
    alt_cap = p.altura("Ag", capacidade_f)
    alt_legenda = p.altura("Ag", legenda_f)
    alt_tese = p.altura("Ag", tese_f)
    caixa_h, caixa_w, pilha_lado = 150, 300, 30
    fila = ds["fila"]
    restricao = ds["restricao"]
    pilha_h = (fila + PILHA_COLUNAS - 1) // PILHA_COLUNAS * (pilha_lado + 8)

    x0_util, x1_util = moldura[0] + 110, moldura[2] - 110
    postos = ds["postos"]
    passo = (x1_util - x0_util - caixa_w) / (len(postos) - 1)
    centros = [x0_util + caixa_w / 2 + i * passo for i in range(len(postos))]

    y_caixa = moldura[1] + 56 + pilha_h + 40
    y_cap = y_caixa + caixa_h + 18
    y_medidor = y_cap + alt_cap + 64
    y_tese = moldura[3] - 48 - alt_tese

    eixo = y_caixa + caixa_h / 2
    d.line([(x0_util, eixo), (x1_util, eixo)], fill=CINZA, width=6)

    for i, (posto, cx) in enumerate(zip(postos, centros)):
        caixa = (cx - caixa_w / 2, y_caixa, cx + caixa_w / 2, y_caixa + caixa_h)
        if i == restricao:
            d.rounded_rectangle(caixa, radius=18, fill=BG, outline=OURO_CLARO, width=10)
            cor_nome, cor_cap = OURO_CLARO, OURO_CLARO
        elif i > restricao:
            d.rounded_rectangle(caixa, radius=18, fill=BG)
            tracejado(d, caixa, CINZA_FRACO, 5)
            cor_nome, cor_cap = CINZA, CINZA_FRACO
        else:
            d.rounded_rectangle(caixa, radius=18, fill=BG, outline=CINZA, width=5)
            cor_nome, cor_cap = WHITE, APOIO
        cabe(f"postos[{i}].nome", posto["nome"], rotulo_f, caixa_w - 24)
        p.centro(posto["nome"], cx, y_caixa + (caixa_h - alt_rotulo) / 2 - 6, rotulo_f, cor_nome)
        if posto.get("capacidade"):
            cabe(f"postos[{i}].capacidade", posto["capacidade"], capacidade_f, passo - 16)
            p.centro(posto["capacidade"], cx, y_cap, capacidade_f, cor_cap)

    # ── A pilha de massa, entre o posto anterior e o forno ────────────────
    meio_fila = (centros[restricao - 1] + centros[restricao]) / 2
    x_pilha = meio_fila - (PILHA_COLUNAS * (pilha_lado + 8) - 8) / 2
    for k in range(fila):
        col, lin = k % PILHA_COLUNAS, k // PILHA_COLUNAS
        px = x_pilha + col * (pilha_lado + 8)
        py = y_caixa - 40 - (lin + 1) * (pilha_lado + 8) + 8
        d.rectangle([px, py, px + pilha_lado, py + pilha_lado], fill=OURO)
    cabe("filaAntes", ds["filaAntes"], capacidade_f, passo)
    p.centro(ds["filaAntes"], meio_fila, y_caixa - 40 - pilha_h - alt_cap - 14, capacidade_f, OURO)
    if ds["ociosoDepois"]:
        meio_ocioso = (centros[restricao + 1] + centros[restricao + 2]) / 2
        cabe("ociosoDepois", ds["ociosoDepois"], capacidade_f, 2 * passo)
        p.centro(ds["ociosoDepois"], meio_ocioso, y_caixa - 40 - alt_cap - 8, capacidade_f, CINZA_FRACO)

    # ── O medidor: o que entra e o que sai ────────────────────────────────
    entra, sai = ds["medidor"]["entra"], ds["medidor"]["sai"]
    larg_entra, larg_sai = p.largura(entra, legenda_f), p.largura(sai, legenda_f)
    # A régua entre as duas pontas é o que sobra: sem folga, a marcação some.
    if x1_util - larg_sai - 48 - (x0_util + larg_entra + 48) < 200:
        estouros.append(f"{lang} · medidor: as duas pontas não deixam 200px de régua")
    d.text((x0_util, y_medidor), entra, font=legenda_f, fill=WHITE, **p._kw())
    d.text((x1_util - larg_sai, y_medidor), sai, font=legenda_f, fill=OURO_CLARO, **p._kw())
    xa = x0_util + larg_entra + 48
    xb = x1_util - larg_sai - 48
    ym = y_medidor + alt_legenda / 2
    d.line([(xa, ym), (xb, ym)], fill=BORDA, width=4)
    for k in range(7):
        x = xa + 20 + k * 26
        d.rectangle([x, ym - 8, x + 16, ym + 8], fill=CINZA)
    for k in range(4):
        x = xb - 20 - (k + 1) * 26
        d.rectangle([x, ym - 8, x + 16, ym + 8], fill=OURO_CLARO)

    # ── A tese, em ouro ───────────────────────────────────────────────────
    cabe("conclusao", ds["conclusao"], tese_f, x1_util - x0_util)
    p.bloco(ds["conclusao"], x0_util, x1_util, y_tese, tese_f, OURO)

    atalho = atalho_do_source(props["source"])
    cabe("atalho", atalho, assinatura_f, util)
    p.bloco(atalho, MARGEM, W - MARGEM, rodape_y, assinatura_f, ASSINATURA)
    return img


def gravar(img: Image.Image, destino: Path, tamanho: tuple[int, int] | None = None) -> int:
    """Paleta adaptativa: a arte é chapada (marinho, ouro, cinzas) e 256 cores
    cortam o peso pela metade sem diferença visível."""
    peca = img if tamanho is None else img.resize(tamanho, Image.LANCZOS)
    peca.convert("RGB").convert("P", palette=Image.ADAPTIVE, colors=256).save(destino, optimize=True)
    return destino.stat().st_size


def main() -> int:
    if not features.check("raqm"):
        sys.exit(
            "PIL sem raqm: o hebraico sairia em ordem de código, sem shaping bidi, e o "
            "defeito não aparece no diff. Instale o libraqm antes de gerar."
        )
    pedidos = sys.argv[1:] or list(IDIOMAS)
    estouros: list[str] = []
    for lang in pedidos:
        if lang not in IDIOMAS:
            sys.exit(f"idioma sem capa a gerar: {lang} (o pt-br usa a arte aprovada do dossiê)")
        img = desenhar(lang, dataset_do_idioma(IDIOMAS[lang]), props_da_figura(lang), estouros)
        pagina = gravar(img, SAIDA / f"hero-{lang}.png")
        card = gravar(img, SAIDA / f"hero-{lang}-og.png", OG)
        aviso = "  ACIMA DO LIMITE" if card / 1024 > OG_LIMITE_KB else ""
        print(f"{lang}: hero-{lang}.png {pagina / 1024:.0f} KB · hero-{lang}-og.png {card / 1024:.0f} KB{aviso}")
        if card / 1024 > OG_LIMITE_KB:
            estouros.append(f"{lang} · og:image {card / 1024:.0f} KB > {OG_LIMITE_KB} KB")

    if estouros:
        print("\nREPROVOU — texto fora da vaga (o PNG corta em silêncio):")
        for e in estouros:
            print(f"  {e}")
        return 1
    print("\nSem estouro de vaga.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
