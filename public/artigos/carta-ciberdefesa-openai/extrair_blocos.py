#!/usr/bin/env python3
"""Extrai os quatro blocos de pedidos da carta a partir de uma captura HTML crua.

Existe para que o dataset da figura venha da captura PINADA, com hash, e nunca de um
.txt intermediário cuja proveniencia nao esta estabelecida no dossie.
"""
import hashlib
import html
import re
import sys
from pathlib import Path

# O corpo mora em <p>/<h*>; o mural de logos e a lista de signatarios ficam fora dele
# porque nao sao paragrafo. Derrubamos script/style/svg antes: `svg` carrega os logos.
def texto(caminho: Path) -> list[str]:
    s = caminho.read_text(encoding="utf-8", errors="replace")
    s = re.sub(r"(?is)<(script|style|svg|noscript)[^>]*>.*?</\1>", " ", s)
    s = re.sub(r"(?s)<[^>]+>", "\n", s)
    linhas = [l.strip() for l in html.unescape(s).split("\n")]
    return [l for l in linhas if l]


MARCAS = ("01", "02", "03", "04")
# Frase que fecha o bloco 04. Sentinela explicita: se a carta for reescrita e ela sumir,
# o extrator para em vez de engolir o rodape da pagina dentro do bloco.
FIM = "We can make the digital infrastructure we all depend on more secure."


def blocos(linhas: list[str]) -> dict[str, dict[str, str]]:
    """`01`..`04` numa linha, o destinatario na seguinte, o corpo nas seguintes ate a
    proxima marca. O corpo NAO e uma linha so: no HTML da OpenAI o bloco 01 vem partido
    em tres elementos e os outros tres vem inteiros -- ler so a primeira linha perdia
    dois tercos do bloco 01 em silencio."""
    out = {}
    pos = {l: i for i, l in enumerate(linhas) if l in MARCAS}
    if sorted(pos) != list(MARCAS):
        return {}
    if FIM not in linhas:
        raise ValueError(f"sentinela de fim do bloco 04 ausente: {FIM!r}")
    limites = [pos[m] for m in MARCAS] + [linhas.index(FIM)]
    for k, m in enumerate(MARCAS):
        i = limites[k]
        out[m] = {
            "destinatario": linhas[i + 1],
            "corpo": " ".join(linhas[i + 2:limites[k + 1]]),
        }
    return out


if __name__ == "__main__":
    ref = None
    for caminho in map(Path, sys.argv[1:]):
        b = blocos(texto(caminho))
        sha = hashlib.sha256(caminho.read_bytes()).hexdigest()[:16]
        assinatura = {k: hashlib.sha256(v["corpo"].encode()).hexdigest()[:12] for k, v in b.items()}
        print(f"{caminho.name}  sha256:{sha}  blocos={len(b)}")
        for k in sorted(b):
            marca = ""
            if ref is not None:
                marca = "  IGUAL" if ref.get(k) == assinatura[k] else "  <<< DIFERE"
            print(f"    {k} {b[k]['destinatario'][:46]:46s} {assinatura[k]}{marca}")
        ref = ref or assinatura
