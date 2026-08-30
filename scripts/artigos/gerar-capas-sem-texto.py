#!/usr/bin/env python3
"""Capas (`hero`) SEM TEXTO, uma por artigo — a mesma arte serve os 5 idiomas.

POR QUE ESTE ARQUIVO EXISTE: as capas deste acervo têm o texto do artigo
DESENHADO dentro do PNG. Isso as prende a um idioma só: das 11 publicadas,
10 valem apenas no pt-BR, e a única que existe nos 5 (`teoria-das-restricoes`)
custou um gerador dedicado, com shaping bidi e uma vaga sem tradução declarada.

Capa sem palavra nenhuma dissolve o problema: um arquivo serve os 5 locales,
não há o que traduzir, não há hebraico para shapear, não há rótulo estourando
caixa. O que a capa carrega é a GEOMETRIA do achado do artigo — a forma dos
dados é a mensagem.

O QUE PODE APARECER NA ARTE (e nada além disso):

- marcas geométricas derivadas dos dados que o artigo já publica;
- inteiros e símbolos neutros de idioma (`4`, `256`, `GB`, `%`, `✓`) — dígito
  não se traduz, e a régua deste arquivo proíbe decimal: `8,64` em pt-BR vira
  `8.64` em inglês, e aí a arte deixaria de servir os 5;
- o domínio, discreto, no rodapé — URL não é frase.

O TÍTULO NÃO ENTRA DE PROPÓSITO. Na página ele já está impresso logo acima da
imagem; no card social toda plataforma imprime o título ao lado da miniatura.
Desenhá-lo dentro do PNG duplica o que já está escrito e mata os outros quatro
idiomas em troca de nada.

Uso:
    python3 scripts/artigos/gerar-capas-sem-texto.py                 # todas
    python3 scripts/artigos/gerar-capas-sem-texto.py ia-local-por-vram
    python3 scripts/artigos/gerar-capas-sem-texto.py --amostra <dir> # não toca public/

Saída padrão: `public/artigos/<slug>/hero.png` (2400x1260) e `hero-og.*`
(1200x630), pelo mesmo `publicar-capa.py` que mede o encoding e trava o peso
do card — acima de ~300 KB o WhatsApp descarta o `og:image` sem avisar.
"""

from __future__ import annotations

import math
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parents[2]
FONTES = RAIZ / "scripts/charts/fonts"
LARGURA, ALTURA = 2400, 1260

# Paleta do site (`app/globals.css`), para a capa não destoar da página onde ela cai.
FUNDO = "#0b1420"
PAINEL = "#101d2a"
OURO = "#a48f65"
OURO_CLARO = "#c4ad7f"
OURO_ESCURO = "#7b643f"
TINTA = "#f5f0e6"
ALERTA = "#c2603f"  # o que estoura / o que não fecha
FRIO = "#4a6b8a"  # a marca secundária, quando a cena precisa de duas famílias

DOMINIO = "ulissesflores.com"


def fonte(tamanho: int, negrito: bool = True) -> ImageFont.FreeTypeFont:
    nome = "Fahkwang-Bold.ttf" if negrito else "Fahkwang-Regular.ttf"
    return ImageFont.truetype(str(FONTES / nome), tamanho)


def tela() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    im = Image.new("RGB", (LARGURA, ALTURA), FUNDO)
    return im, ImageDraw.Draw(im)


def assinatura(d: ImageDraw.ImageDraw) -> None:
    """O domínio no rodapé. É a única cadeia de caracteres comum a todas as cenas."""
    f = fonte(30, negrito=False)
    d.text((140, ALTURA - 96), DOMINIO, font=f, fill=OURO_ESCURO)


def so_inteiro(texto: str) -> str:
    """Trava da régua: separador decimal muda de idioma, então não entra na arte."""
    if re.search(r"\d[.,]\d", texto):
        raise SystemExit(f"capa sem texto: '{texto}' tem decimal — o separador muda de idioma")
    return texto


def numero(d: ImageDraw.ImageDraw, xy, texto, tamanho, cor, ancora="lm", negrito=True) -> None:
    d.text(xy, so_inteiro(texto), font=fonte(tamanho, negrito), fill=cor, anchor=ancora)


def seta(d: ImageDraw.ImageDraw, x1, y1, x2, y2, cor, grossura=6, ponta=26) -> None:
    d.line((x1, y1, x2, y2), fill=cor, width=grossura)
    ang = math.atan2(y2 - y1, x2 - x1)
    for lado in (+1, -1):
        a = ang + lado * math.radians(155)
        d.line((x2, y2, x2 + ponta * math.cos(a), y2 + ponta * math.sin(a)), fill=cor, width=grossura)


# ── Fonte dos dados: os datasets que o artigo já publica ────────────────────────


def ler_ts(arquivo: str, chave: str) -> str:
    """Recorta o bloco de um dataset do `.ts`. Ninguém digita número aqui."""
    fonte_ts = (RAIZ / arquivo).read_text()
    i = fonte_ts.index(f"'{chave}': {{")
    profundidade, j = 0, i + len(f"'{chave}': ")
    for k in range(j, len(fonte_ts)):
        if fonte_ts[k] == "{":
            profundidade += 1
        elif fonte_ts[k] == "}":
            profundidade -= 1
            if profundidade == 0:
                return fonte_ts[i : k + 1]
    raise SystemExit(f"dataset '{chave}' não fecha em {arquivo}")


def campos_numericos(bloco: str, nome: str) -> list[float]:
    return [float(v) for v in re.findall(rf"{nome}:\s*([\d.]+)", bloco)]


# ── Cenas, uma por artigo ───────────────────────────────────────────────────────


def cena_ia_local_por_vram() -> Image.Image:
    """Dez máquinas, a mesma pergunta: cabe? A parede é a mesma; o que vaza, não.

    Cada faixa é um degrau da escada de VRAM do artigo, NORMALIZADO: a moldura
    vale sempre 100% da memória daquela placa, e é a parede da direita. Dentro,
    o claro são os pesos do modelo e o escuro é o cache no contexto de
    referência. O que atravessa a parede é o que falta quando o contexto vai ao
    máximo. A forma diz o achado: os pesos cabem em todo mundo — quem não cabe
    é a conversa, e ela some das máquinas grandes por outro motivo (o modelo
    daquele degrau tem cache menor).
    """
    bloco = ler_ts("data/artigos-charts.ts", "ia-local-por-vram-escada")
    cap = campos_numericos(bloco, "capacidade")
    pesos = campos_numericos(bloco, "pesos")
    c_ref = campos_numericos(bloco, "cacheRef")
    c_max = campos_numericos(bloco, "cacheMax")

    im, d = tela()
    x0, parede = 470, 1740          # a moldura de todos os degraus
    topo, base = 175, 1075
    passo = (base - topo) / len(cap)
    alt = int(passo * 0.62)
    larg = parede - x0

    for i, capacidade in enumerate(cap):
        y = int(topo + i * passo)
        px = larg / capacidade      # px por GB DAQUELA placa

        d.rectangle((x0, y, parede, y + alt), fill=PAINEL)
        # pesos: o que não muda enquanto se conversa.
        d.rectangle((x0, y, x0 + min(larg, int(pesos[i] * px)), y + alt), fill=OURO_CLARO)
        # cache no contexto de referência, encostado nos pesos.
        ini_cache = x0 + int(pesos[i] * px)
        d.rectangle((ini_cache, y, min(parede, ini_cache + int(c_ref[i] * px)), y + alt), fill=OURO_ESCURO)
        # a parede: sempre no mesmo lugar, porque a moldura é 100% da placa.
        d.line((parede, y - 2, parede, y + alt + 2), fill=TINTA, width=3)
        # o que falta no contexto máximo, atravessando a parede.
        falta = pesos[i] + c_max[i] - capacidade
        if falta > 0:
            fim_x = parede + int(min(falta * px, 560))
            d.rectangle((parede + 8, y + 6, fim_x, y + alt - 6), fill=ALERTA)
            if falta * px > 560:    # não cabe nem no quadro: a barra sai cortada
                for k in range(3):
                    d.rectangle((fim_x + 14 + k * 26, y + 6, fim_x + 28 + k * 26, y + alt - 6), fill=ALERTA)

        numero(d, (x0 - 40, y + alt / 2), f"{int(capacidade)}", 52, TINTA, ancora="rm")

    numero(d, (x0 - 40, topo - 66), "GB", 34, OURO_ESCURO, ancora="rm", negrito=False)
    assinatura(d)
    return im


def cena_recusa_que_parou_o_estudo_das_recusas() -> Image.Image:
    """Um passo não devolveu nada — e o registro carimbou concluído do mesmo jeito.

    O artigo mostra o mecanismo, não uma frequência: o estudo que MEDE a
    frequência ainda está rodando. Então a cena mostra UMA instância, não uma
    taxa — uma fileira de passos, todos com o mesmo ✓ do orquestrador, e um
    deles oco. O carimbo continua lá em cima do vazio. É o achado do artigo em
    forma: do lado de fora, a recusa e o resultado vazio são a mesma coisa.
    """
    im, d = tela()
    colunas = 9
    lado, vao = 214, 46
    largura_grade = colunas * lado + (colunas - 1) * vao
    x0 = (LARGURA - largura_grade) // 2
    y = (ALTURA - lado) // 2 - 30
    oca = 5  # a casa que voltou vazia. Uma só: o artigo não mede quantas são.

    def visto(cx, cy, cor, grossura=20):
        d.line((cx - 44, cy + 4, cx - 10, cy + 42), fill=cor, width=grossura)
        d.line((cx - 10, cy + 42, cx + 48, cy - 40), fill=cor, width=grossura)

    for col in range(colunas):
        x = x0 + col * (lado + vao)
        if col == oca:
            # A casa oca: sem miolo, borda partida — e o mesmo carimbo por cima.
            for a, b in ((0, 46), (72, 118), (144, 190)):
                d.line((x + a, y, x + b, y), fill=ALERTA, width=6)
                d.line((x + a, y + lado, x + b, y + lado), fill=ALERTA, width=6)
                d.line((x, y + a, x, y + b), fill=ALERTA, width=6)
                d.line((x + lado, y + a, x + lado, y + b), fill=ALERTA, width=6)
        else:
            d.rounded_rectangle((x, y, x + lado, y + lado), radius=20, fill=PAINEL, outline=OURO_ESCURO, width=4)
        visto(x + lado / 2, y + lado / 2, OURO_CLARO)

    assinatura(d)
    return im


def cena_carta_ciberdefesa_openai() -> Image.Image:
    """Cinco colunas de obrigação, quatro blocos de destinatário — e as caixas vazias.

    A matriz do artigo pergunta, para cada bloco da carta, se há cifra, prazo, verbo que
    obriga, responsável e alvo verificável. A resposta é `ausente` em 19 das 20 células.
    A cena desenha a matriz e nada mais: o vazio É o achado. A célula cheia embaixo é o
    controle do artigo — outro documento, da mesma empresa, que tem o que a carta não tem.
    """
    bloco = ler_ts("data/obligation-matrix.ts", "carta-ciberdefesa-blocos")
    estados = re.findall(r"estado: '(\w+)'", bloco)
    colunas, linhas = 5, 4
    grade = estados[: colunas * linhas]
    controle = estados[colunas * linhas :][:colunas]

    im, d = tela()
    cel_l, cel_a, vao = 356, 150, 38
    largura = colunas * cel_l + (colunas - 1) * vao
    x0 = (LARGURA - largura) // 2
    y0 = 150

    for i, estado in enumerate(grade):
        x = x0 + (i % colunas) * (cel_l + vao)
        y = y0 + (i // colunas) * (cel_a + vao)
        caixa = (x, y, x + cel_l, y + cel_a)
        if estado == "ausente":
            d.rounded_rectangle(caixa, radius=12, outline="#24384c", width=4)
        else:  # parcial: a única da matriz que tem meia resposta
            d.rounded_rectangle(caixa, radius=12, outline=OURO_ESCURO, width=4)
            d.rectangle((x + 20, y + 20, x + cel_l // 2, y + cel_a - 20), fill=OURO_ESCURO)

    # A fileira de controle, separada por um fio: outro documento, que preenche.
    y_ctrl = y0 + linhas * (cel_a + vao) + 46
    d.line((x0, y_ctrl - 34, x0 + largura, y_ctrl - 34), fill="#24384c", width=3)
    for i, estado in enumerate(controle):
        x = x0 + i * (cel_l + vao)
        caixa = (x, y_ctrl, x + cel_l, y_ctrl + cel_a)
        if estado == "presente":
            d.rounded_rectangle(caixa, radius=12, fill=OURO_CLARO)
        else:
            d.rounded_rectangle(caixa, radius=12, outline="#24384c", width=4)

    assinatura(d)
    return im


def cena_ninguem_provou_meta_le_whatsapp() -> Image.Image:
    """O canal é lacrado ponta a ponta. O vazamento sai da PONTA, com o cadeado aberto.

    O artigo desmonta a acusação de que a empresa lê o canal e mostra a saída que de fato
    existe: quando o destinatário denuncia, o texto já aberto no aparelho dele sobe para a
    empresa. A cena põe as duas coisas no mesmo quadro — o trecho entre as pontas com o
    cadeado FECHADO, e o ramo que desce da ponta direita com o cadeado ABERTO.
    """
    im, d = tela()
    y = 470
    esq, dir_ = 300, 2100

    def no(cx, cy, r=88):
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=PAINEL, outline=OURO, width=6)

    def cadeado(cx, cy, aberto: bool, cor):
        corpo = (cx - 52, cy - 26, cx + 52, cy + 66)
        d.rounded_rectangle(corpo, radius=14, fill=cor)
        # a haste: fechada encosta nos dois lados; aberta solta de um lado e sobe
        if aberto:
            d.arc((cx - 68, cy - 116, cx + 20, cy - 12), start=180, end=360, fill=cor, width=14)
            d.line((cx - 68, cy - 64, cx - 68, cy - 26), fill=cor, width=14)
        else:
            d.arc((cx - 38, cy - 106, cx + 38, cy - 12), start=180, end=360, fill=cor, width=14)
            d.line((cx - 38, cy - 60, cx - 38, cy - 26), fill=cor, width=14)
            d.line((cx + 38, cy - 60, cx + 38, cy - 26), fill=cor, width=14)

    # O trecho lacrado entre as duas pontas.
    d.line((esq + 100, y, dir_ - 100, y), fill=OURO, width=10)
    no(esq, y)
    no(dir_, y)
    d.rectangle((1110, y - 130, 1290, y + 120), fill=FUNDO)
    cadeado(1200, y - 20, aberto=False, cor=OURO)

    # O ramo que desce da ponta: o texto já aberto saindo do aparelho.
    seta(d, dir_, y + 110, dir_, 1000, ALERTA, grossura=10, ponta=42)
    d.rectangle((dir_ - 90, 580, dir_ + 90, 800), fill=FUNDO)
    cadeado(dir_, 660, aberto=True, cor=ALERTA)
    d.rounded_rectangle((dir_ - 150, 1010, dir_ + 150, 1150), radius=18, fill=PAINEL, outline=ALERTA, width=6)
    for k in range(3):  # o conteúdo legível, dentro de quem recebeu a denúncia
        d.line((dir_ - 100, 1055 + k * 34, dir_ + 100 - k * 44, 1055 + k * 34), fill=ALERTA, width=10)

    assinatura(d)
    return im


def cena_benchmark_harness_modelo() -> Image.Image:
    """Oito pares, o mesmo modelo dos dois lados — e a nota anda até 10 pontos.

    O artigo mostra que a diferença medida entre dois modelos pode vir do arnês, não do
    modelo. Cada barra é o quanto a nota se move num par; a de cima, destacada, é o valor
    extremo que sustentou a manchete. Sem rótulo: a barra longa sozinha conta a história.
    """
    bloco = ler_ts("data/artigos-charts.ts", "benchmark-oito-pares")
    valores = campos_numericos(bloco, "value")
    maximo = float(re.search(r"max:\s*([\d.]+)", bloco).group(1))

    im, d = tela()
    x0, larg = 300, 1800
    topo, alt, vao = 230, 74, 42
    for i, v in enumerate(valores):
        y = topo + i * (alt + vao)
        d.rectangle((x0, y, x0 + larg, y + alt), fill="#16232f")
        cor = OURO_CLARO if i == 0 else FRIO
        d.rectangle((x0, y, x0 + int(larg * v / maximo), y + alt), fill=cor)
    assinatura(d)
    return im


def cena_glm_5_3() -> Image.Image:
    """Duas mil quatrocentas e trinta e seis vulnerabilidades. Um oceano nunca reportado.

    Cada quadradinho é uma vulnerabilidade do balanço que a Z.ai publicou como prova de
    capacidade. A cor sai do próprio dataset do artigo. O que a forma diz: a mancha cinza
    — as que nunca saíram da descoberta — engole tudo o que veio depois.
    """
    bloco = ler_ts("data/artigos-charts.ts", "glm53-ledger-status")
    cores = re.findall(r"color: '(#\w+)'", bloco)
    contagens = [int(v) for v in re.findall(r"count: (\d+)", bloco)]
    celulas = [c for cor, n in zip(cores, contagens) for c in [cor] * n]

    colunas = 76  # 76 x 33 cobre os 2.436 do balanço dentro do quadro
    linhas = math.ceil(len(celulas) / colunas)
    lado, vao = 20, 5
    largura = colunas * (lado + vao) - vao
    altura = linhas * (lado + vao) - vao
    x0 = (LARGURA - largura) // 2
    y0 = (ALTURA - altura) // 2 - 24

    im, d = tela()
    # O painel atrás: o cinza `#3f3f46` do dataset some no fundo marinho sem ele.
    d.rounded_rectangle((x0 - 46, y0 - 46, x0 + largura + 46, y0 + altura + 46), radius=18, fill="#080f18")
    for i, cor in enumerate(celulas):
        x = x0 + (i % colunas) * (lado + vao)
        y = y0 + (i // colunas) * (lado + vao)
        d.rectangle((x, y, x + lado, y + lado), fill=cor)
    assinatura(d)
    return im


def _curvas(d, series, x_dom, y_dom, quadro, grossura=8, raio=13, log_x=False):
    (x0, y0, x1, y1) = quadro
    esc = math.log10 if log_x else (lambda v: v)
    ex = lambda v: x0 + (esc(v) - esc(x_dom[0])) / (esc(x_dom[1]) - esc(x_dom[0])) * (x1 - x0)
    ey = lambda v: y1 - (v - y_dom[0]) / (y_dom[1] - y_dom[0]) * (y1 - y0)
    for cor, pontos in series:
        tela_pts = [(ex(a), ey(b)) for a, b in pontos]
        if len(tela_pts) > 1:
            d.line([p for xy in tela_pts for p in xy], fill=cor, width=grossura, joint="curve")
        for x, y in tela_pts:
            d.ellipse((x - raio, y - raio, x + raio, y + raio), fill=cor)


def _series(bloco: str) -> list[tuple[str, list[tuple[float, float]]]]:
    saida = []
    for pedaco in bloco.split("label:")[1:]:
        cor = re.search(r"color: '(#\w+)'", pedaco)
        # só o que está DENTRO de `points:` — `xDomain: [1, 30]` também casaria com o par.
        corpo = re.search(r"points:\s*\[(.*?)\],?\s*\n\s*\}", pedaco, re.S)
        pontos = re.findall(r"\[([\d.]+),\s*([\d.]+)\]", corpo.group(1)) if corpo else []
        if cor and pontos:
            saida.append((cor.group(1), [(float(a), float(b)) for a, b in pontos]))
    return saida


def cena_2026_07_24_claude_opus_5() -> Image.Image:
    """Quatro trilhas de custo contra acerto. A dourada sobe mais gastando menos.

    É o gráfico do lançamento: cada trilha é um modelo, andando da esquerda (barato) para
    a direita (caro) conforme se paga por mais esforço. A trilha do Opus 5 fica acima e à
    esquerda das outras — a manchete do artigo, sem manchete.
    """
    bloco = ler_ts("data/artigos-charts.ts", "opus5-frontier-bench")
    dom = lambda nome: [float(v) for v in re.search(rf"{nome}: \[([\d.]+), ([\d.]+)\]", bloco).groups()]
    im, d = tela()
    quadro = (280, 170, 2150, 1090)
    d.line((quadro[0], quadro[3], quadro[2], quadro[3]), fill="#24384c", width=5)
    # eixo de custo em log, como no gráfico do artigo (xTicks 1,2,3,5,10,20,30).
    _curvas(d, _series(bloco), dom("xDomain"), dom("yDomain"), quadro, grossura=11, raio=17, log_x=True)
    assinatura(d)
    return im


def cena_deepseek_v4_flash_0731() -> Image.Image:
    """Nove linhas, nove derrotas: o placar que a própria DeepSeek publicou.

    A tabela do lançamento traz nove benchmarks agênticos em que o Claude Opus 4.8 vence o
    V4-Flash-0731 em TODAS as linhas. A cena é o placar cru — nove marcas cheias contra
    nove vazias. Nada a traduzir: 9 a 0 se lê em qualquer idioma.
    """
    im, d = tela()
    raio, vao = 96, 74
    largura = 9 * (raio * 2) + 8 * vao
    x0 = (LARGURA - largura) // 2 + raio
    for i in range(9):
        cx = x0 + i * (raio * 2 + vao)
        d.ellipse((cx - raio, 400 - raio, cx + raio, 400 + raio), fill=OURO_CLARO)
        d.ellipse((cx - raio, 880 - raio, cx + raio, 880 + raio), outline="#2a3f52", width=10)
    assinatura(d)
    return im


def cena_noisy_tv_agentes() -> Image.Image:
    """O U invertido da curiosidade — e o ponto onde só há ruído.

    A intensidade da curiosidade é 4·g·(1-g): zero quando não há lacuna, zero quando tudo é
    lacuna, máxima no meio. A marca em vermelho é a lacuna-fantasma que o artigo mediu no
    próprio agente (g = 0,177): ruído puro lido como sinal alto. A fórmula e o ponto saem
    de `lib/content/inverted-u-chart.tsx` e do dataset — nada é desenhado a olho.
    """
    bloco = ler_ts("data/artigos-charts-noisytv.ts", "noisytv-u-invertido")
    g_marca = float(re.search(r"g:\s*([\d.]+)", bloco).group(1))
    intensidade = lambda g: 4 * g * (1 - g)

    im, d = tela()
    x0, y0, x1, y1 = 300, 200, 2120, 1060
    ex = lambda g: x0 + g * (x1 - x0)
    ey = lambda v: y1 - v * (y1 - y0)

    d.line((x0, y1, x1, y1), fill="#24384c", width=5)
    pontos = [(ex(i / 160), ey(intensidade(i / 160))) for i in range(161)]
    d.line([p for xy in pontos for p in xy], fill=OURO_CLARO, width=10, joint="curve")

    xm, ym = ex(g_marca), ey(intensidade(g_marca))
    d.line((xm, y1, xm, ym), fill=ALERTA, width=6)
    d.ellipse((xm - 26, ym - 26, xm + 26, ym + 26), fill=ALERTA)
    assinatura(d)
    return im


def cena_jogos_robos_humanoides_2026() -> Image.Image:
    """Os 100 m: a barra do recorde humano, e as que já ficaram mais curtas que ela.

    Cada barra é um tempo da régua do artigo, com a cor do próprio grupo: a competição
    oficial de 2026, o evento-teste que viralizou, o recorde de Usain Bolt e o vencedor da
    edição de 2025. O fio branco é o Bolt, atravessando as outras. Sem número nenhum: os
    tempos têm vírgula decimal, que muda de idioma — e a barra já diz quem é mais curto.
    """
    bloco = ler_ts("data/artigos-charts.ts", "robos-2026-100m-reguas")
    itens = []
    for pedaco in bloco.split("color:")[1:]:
        cor = re.match(r"\s*'(#\w+)'", pedaco).group(1)
        for v in re.findall(r"value: ([\d.]+)", pedaco):
            itens.append((float(v), cor))
    itens.sort(key=lambda t: -t[0])
    maximo = max(v for v, _ in itens)
    bolt = min(v for v, c in itens if c == "#64748b")

    im, d = tela()
    x0, larg = 300, 1820
    topo, alt, vao = 250, 78, 42
    for i, (v, cor) in enumerate(itens):
        y = topo + i * (alt + vao)
        d.rectangle((x0, y, x0 + int(larg * v / maximo), y + alt), fill=cor)
    x_bolt = x0 + int(larg * bolt / maximo)
    d.line((x_bolt, topo - 46, x_bolt, topo + len(itens) * (alt + vao) - vao + 46), fill=TINTA, width=5)
    assinatura(d)
    return im


def cena_estatisticas_agentes_de_ia() -> Image.Image:
    """Acharam que a IA os deixou 24% mais rápidos. O cronômetro marcou 19% mais lento.

    O experimento da METR que o artigo usa mede três coisas na mesma tarefa: o tempo que os
    desenvolvedores PREVIRAM antes, o tempo MEDIDO, e o que eles ESTIMARAM depois de terem
    feito. Sem IA vale 100 — é o fio branco. As duas barras da crença ficam abaixo do fio; a
    do cronômetro atravessa. Só inteiros: nenhum número aqui muda de idioma.
    """
    bloco = ler_ts("data/artigos-charts.ts", "agentes-metr-percepcao")
    valores = [int(float(v)) for v in re.findall(r"value: ([\d.]+)", bloco)]
    maximo = float(re.search(r"max:\s*([\d.]+)", bloco).group(1))

    im, d = tela()
    base_y, larg_barra, vao = 1030, 300, 150
    largura = len(valores) * larg_barra + (len(valores) - 1) * vao
    x0 = (LARGURA - largura) // 2
    altura_util = 760
    y_sem_ia = base_y - int(100 / maximo * altura_util)

    for i, v in enumerate(valores):
        x = x0 + i * (larg_barra + vao)
        topo = base_y - int(v / maximo * altura_util)
        cor = ALERTA if v > 100 else OURO_CLARO
        d.rectangle((x, topo, x + larg_barra, base_y), fill=cor)
        numero(d, (x + larg_barra / 2, topo - 52), str(v), 62, cor, ancora="mm")

    # O fio da tarefa sem IA: a régua contra a qual as três medidas se leem.
    d.line((x0 - 130, y_sem_ia, x0 + largura + 130, y_sem_ia), fill=TINTA, width=6)
    numero(d, (x0 + largura + 150, y_sem_ia), "100", 44, TINTA, ancora="lm")
    d.line((x0 - 130, base_y, x0 + largura + 130, base_y), fill="#24384c", width=4)
    assinatura(d)
    return im


CENAS = {
    "ia-local-por-vram": cena_ia_local_por_vram,
    "recusa-que-parou-o-estudo-das-recusas": cena_recusa_que_parou_o_estudo_das_recusas,
    "carta-ciberdefesa-openai": cena_carta_ciberdefesa_openai,
    "ninguem-provou-meta-le-whatsapp": cena_ninguem_provou_meta_le_whatsapp,
    "benchmark-harness-modelo": cena_benchmark_harness_modelo,
    "glm-5-3": cena_glm_5_3,
    "2026-07-24-claude-opus-5": cena_2026_07_24_claude_opus_5,
    "deepseek-v4-flash-0731": cena_deepseek_v4_flash_0731,
    "noisy-tv-agentes": cena_noisy_tv_agentes,
    "jogos-robos-humanoides-2026": cena_jogos_robos_humanoides_2026,
    "estatisticas-agentes-de-ia": cena_estatisticas_agentes_de_ia,
}

# Um artigo tem DUAS capas: a arte pt-BR com texto (de outra sessão) fica, e a capa muda
# atende en/es/it/he. Só por isso o nome de saída é parametrizado.
NOME_BASE = {"estatisticas-agentes-de-ia": "hero-mudo"}


def main() -> int:
    argv = sys.argv[1:]
    amostra = None
    if "--amostra" in argv:
        i = argv.index("--amostra")
        amostra = Path(argv[i + 1])
        amostra.mkdir(parents=True, exist_ok=True)
        argv = argv[:i] + argv[i + 2 :]

    alvos = argv or list(CENAS)
    for slug in alvos:
        if slug not in CENAS:
            sys.exit(f"sem cena para '{slug}' — as que existem: {', '.join(CENAS)}")
        im = CENAS[slug]()
        if amostra:
            destino = amostra / f"{slug}.png"
            im.save(destino)
            print(f"{destino}  {destino.stat().st_size / 1024:.0f} KB")
            continue
        bruto = RAIZ / f".capa-bruta-{slug}.png"
        im.save(bruto)
        try:
            r = subprocess.run(
                [sys.executable, str(RAIZ / "scripts/artigos/publicar-capa.py"), slug, str(bruto), NOME_BASE.get(slug, "hero")],
                check=False,
            )
        finally:
            bruto.unlink(missing_ok=True)
        if r.returncode:
            return r.returncode
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
