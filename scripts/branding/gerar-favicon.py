#!/usr/bin/env python3
"""Gera `app/favicon.ico` com DOIS níveis de detalhe, um por faixa de tamanho.

POR QUE ESTE ARQUIVO EXISTE: o símbolo do arqueiro tem detalhe demais para 16
pixels. Medido em 2026-08-30, quadro a quadro: aos 16px o desenho vira um borrão
escuro e o Ulisses não conseguia achar a própria aba entre as outras. Regerar os
quadros pequenos com reamostragem melhor NÃO resolve — o problema é a densidade
do traço, não o filtro.

O formato ICO guarda uma IMAGEM POR QUADRO, e não uma imagem redimensionada N
vezes. É essa propriedade que este script usa:

| quadro | arte |
|---|---|
| 16, 32 | o alvo — círculo e cruz, traço grosso; o que sobra do símbolo quando só cabem 16 pixels |
| 48, 64, 128, 256 | o arqueiro inteiro, de `app/icon.png`, como sempre foi |

Não há marca nova: o alvo JÁ é metade do símbolo (o círculo dividido em quatro
que o arqueiro mira). A cor, o fundo e o diâmetro são os mesmos nas duas artes,
então a troca de detalhe não se nota entre um tamanho e o outro.

Efeito colateral desejado: o arquivo muda, o hash da URL que o Next emite muda
junto, e todo navegador é obrigado a rebuscar o ícone — inclusive o Safari, cujo
banco de favicons (`~/Library/Safari/Favicon Cache/`) NÃO é limpo pela janela
anônima e por isso segurava um ícone velho.

Uso:
    python3 scripts/branding/gerar-favicon.py            # grava app/favicon.ico
    python3 scripts/branding/gerar-favicon.py --conferir # só relata o que está lá

O `.ico` é escrito à mão porque o PIL só sabe redimensionar UMA imagem para
todos os quadros (`append_images` recusa tamanhos diferentes). O contêiner é
simples: cabeçalho, uma entrada de diretório por quadro, e os PNGs em seguida —
PNG dentro de ICO é aceito por todo navegador atual.
"""

from __future__ import annotations

import struct
import sys
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parents[2]
MESTRE = RAIZ / "app/icon.png"
DESTINO = RAIZ / "app/favicon.ico"

MARINHO = (16, 29, 42)
OURO = (196, 173, 127)
PEQUENOS = (16, 32)
GRANDES = (48, 64, 128, 256)


def alvo(lado: int = 512) -> Image.Image:
    """O alvo: círculo e cruz. Traço grosso o bastante para sobreviver a 16px."""
    im = Image.new("RGB", (lado, lado), MARINHO)
    d = ImageDraw.Draw(im)
    margem, grossura = round(lado * 0.078), round(lado * 0.078)
    d.ellipse((margem, margem, lado - margem, lado - margem), outline=OURO, width=grossura)
    meio, fim = lado // 2, lado - margem - grossura // 2
    inicio = margem + grossura // 2
    d.line((meio, inicio, meio, fim), fill=OURO, width=grossura - 4)
    d.line((inicio, meio, fim, meio), fill=OURO, width=grossura - 4)
    return im


def quadros() -> list[tuple[int, Image.Image]]:
    arqueiro = Image.open(MESTRE).convert("RGBA")
    pequeno = alvo().convert("RGBA")
    return [(s, pequeno.resize((s, s), Image.LANCZOS)) for s in PEQUENOS] + [
        (s, arqueiro.resize((s, s), Image.LANCZOS)) for s in GRANDES
    ]


def escrever_ico(destino: Path, imagens: list[tuple[int, Image.Image]]) -> None:
    payloads = []
    for _, im in imagens:
        buf = BytesIO()
        im.save(buf, format="PNG", optimize=True)
        payloads.append(buf.getvalue())

    cabecalho = struct.pack("<HHH", 0, 1, len(imagens))
    offset = len(cabecalho) + 16 * len(imagens)
    diretorio = b""
    for (lado, _), dados in zip(imagens, payloads):
        # 256 é gravado como 0: o campo tem um byte só.
        diretorio += struct.pack(
            "<BBBBHHII", lado % 256, lado % 256, 0, 0, 1, 32, len(dados), offset
        )
        offset += len(dados)
    destino.write_bytes(cabecalho + diretorio + b"".join(payloads))


def conferir() -> int:
    """Lê de volta e prova que os quadros pequenos NÃO são o mesmo desenho dos grandes."""
    im = Image.open(DESTINO)
    tamanhos = sorted(im.info["sizes"])
    print(f"{DESTINO.relative_to(RAIZ)}  {DESTINO.stat().st_size / 1024:.0f} KB  quadros: {[s[0] for s in tamanhos]}")

    def tinta(lado: int) -> float:
        im.size = (lado, lado)
        q = im.convert("RGB")
        pixels = list(q.getdata()) if not hasattr(q, "get_flattened_data") else list(q.convert("RGB").getdata())
        marcados = sum(1 for p in pixels if max(abs(a - b) for a, b in zip(p, MARINHO)) > 60)
        return marcados / (lado * lado)

    for lado, _ in [(s[0], None) for s in tamanhos]:
        print(f"  {lado:3}px  tinta sobre o fundo: {tinta(lado):.0%}")
    esperado = {s for s in PEQUENOS} | {s for s in GRANDES}
    if {s[0] for s in tamanhos} != esperado:
        print(f"REPROVOU: quadros {esperado} eram esperados")
        return 1
    # O alvo cobre mais área que o arqueiro reduzido: é assim que ele se lê a 16px.
    if tinta(16) <= tinta(48):
        print("REPROVOU: o quadro de 16px não tem mais tinta que o de 48px — o alvo não entrou")
        return 1
    return 0


def main() -> int:
    if "--conferir" in sys.argv:
        return conferir()
    escrever_ico(DESTINO, quadros())
    return conferir()


if __name__ == "__main__":
    raise SystemExit(main())
