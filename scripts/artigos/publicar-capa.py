#!/usr/bin/env python3
"""Publica a capa de um artigo em `public/artigos/<slug>/`, nos dois tamanhos.

POR QUE ESTE ARQUIVO EXISTE: as capas dos artigos vinham parando em
`content/artigos/<slug>/hero.png`, que o Next NÃO serve (o cabeçalho de
`lib/content/article-figure.tsx` já documenta isso) — dez PNGs de arte boa
eram asset morto. Publicar à mão é copiar, redimensionar e escolher encoding,
e a escolha de encoding é a parte que engana.

A ESCOLHA DE ENCODING É MEDIDA, NÃO ADIVINHADA. As capas deste acervo são de
duas naturezas, e o que serve a uma estraga a outra:

- **arte chapada** (a linha de postos, a onda da marca-d'água): PNG com paleta
  adaptativa de 256 cores é praticamente sem perda — o `hero.png` do
  `teoria-das-restricoes` caiu 109 -> 47 KB com desvio máximo de 9/255.
- **plate pontilhado** (o censo em waffle, as réguas de estatística): milhares
  de cores e grão de 1px. A mesma paleta ali REESCREVE o desenho — desvio
  máximo de 139/255 no `quantas-pessoas-usam-ia`. Para esses, quem comprime é
  JPEG, com RMS abaixo de 5 (invisível) e um terço do peso.

Então: tenta a paleta; se o desvio máximo passar de `DESVIO_MAX`, cai para
JPEG. Nunca o contrário, e nunca por palpite — o número entra no relatório.

O CARD (1200x630) É ARQUIVO PRÓPRIO, não o mesmo do corpo: acima de ~300 KB o
WhatsApp descarta o `og:image` em silêncio e o link circula sem imagem. O teto
é gate em `data/artigos-hero.test.ts`.

PROPORÇÃO: a capa tem de nascer em 1200:630 (1.905:1). Arte 16:9 exigiria
recorte, e recortar é decisão de composição — o script recusa em vez de cortar
por conta própria.

Uso:
    python3 scripts/artigos/publicar-capa.py <slug> <caminho-da-arte> [nome-base]
    python3 scripts/artigos/publicar-capa.py marca-dagua-claude content/artigos/marca-dagua-claude/hero.png

`nome-base` (padrão `hero`) existe para o artigo que tem DUAS capas: a arte pt-BR com
texto desenhado e uma capa muda para os outros idiomas, no mesmo diretório.

Imprime a linha para colar em `data/artigos.ts` (campo `hero`). Não apaga a
origem: limpar `content/` é outro gate.
"""

from __future__ import annotations

import math
import sys
from pathlib import Path

from PIL import Image, ImageChops

RAIZ = Path(__file__).resolve().parents[2]
CARD = (1200, 630)
DESVIO_MAX = 16  # /255. Acima disso a paleta mexe no desenho, não só no peso.
CARD_TETO_KB = 300


def desvio_maximo(antes: Image.Image, depois: Image.Image) -> int:
    return max(e[1] for e in ImageChops.difference(antes, depois.convert("RGB")).getextrema())


def rms(antes: Image.Image, depois: Image.Image) -> float:
    h = ImageChops.difference(antes, depois.convert("RGB")).histogram()
    return math.sqrt(sum(i * i * n for i, n in enumerate(h[:256])) / max(sum(h[:256]), 1))


def gravar(im: Image.Image, base: Path, qualidade: int) -> tuple[Path, str]:
    """PNG com paleta quando ela sai de graça; JPEG quando não sai."""
    paleta = im.convert("P", palette=Image.ADAPTIVE, colors=256)
    d = desvio_maximo(im, paleta)
    if d <= DESVIO_MAX:
        destino = base.with_suffix(".png")
        paleta.save(destino, optimize=True)
        return destino, f"PNG/paleta · desvio {d}/255"
    destino = base.with_suffix(".jpg")
    im.save(destino, quality=qualidade, optimize=True, progressive=True)
    return destino, f"JPEG q{qualidade} · a paleta desviaria {d}/255, RMS {rms(im, Image.open(destino)):.1f}"


def main() -> int:
    if len(sys.argv) not in (3, 4):
        sys.exit(__doc__.split("Uso:")[1].strip())
    slug, origem = sys.argv[1], Path(sys.argv[2])
    base = sys.argv[3] if len(sys.argv) == 4 else "hero"
    if not origem.exists():
        sys.exit(f"arte não encontrada: {origem}")

    im = Image.open(origem).convert("RGB")
    if abs(im.width / im.height - CARD[0] / CARD[1]) > 0.001:
        sys.exit(
            f"{slug}: a arte é {im.width}x{im.height}, e o card é {CARD[0]}x{CARD[1]} "
            f"({CARD[0] / CARD[1]:.3f}:1). Recortar é decisão de composição — quem "
            "decide o corte é quem fez a arte, não este script."
        )

    destino = RAIZ / "public/artigos" / slug
    destino.mkdir(parents=True, exist_ok=True)
    pagina, como_p = gravar(im, destino / base, 92)
    card, como_c = gravar(im.resize(CARD, Image.LANCZOS), destino / f"{base}-og", 88)

    kb_card = card.stat().st_size / 1024
    print(f"{pagina.relative_to(RAIZ)}  {pagina.stat().st_size / 1024:.0f} KB  ({como_p})")
    print(f"{card.relative_to(RAIZ)}  {kb_card:.0f} KB  ({como_c})")
    if kb_card > CARD_TETO_KB:
        print(f"\nREPROVOU: o card passou de {CARD_TETO_KB} KB — o WhatsApp descarta em silêncio.")
        return 1

    print(f"""
Cole em `data/artigos.ts`, na entrada de `{slug}`, DEPOIS de `tags`:

  hero: {{
    width: {im.width},
    height: {im.height},
    locales: {{
      'pt-br': {{ src: '/artigos/{slug}/{pagina.name}', og: '/artigos/{slug}/{card.name}' }},
    }},
  }},""")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
