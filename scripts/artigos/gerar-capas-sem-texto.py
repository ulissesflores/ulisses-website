#!/usr/bin/env python3
"""Capas (`hero`) SEM TEXTO, uma por artigo — a mesma arte serve os 5 idiomas.

POR QUE ESTE ARQUIVO EXISTE: as capas deste acervo têm o texto do artigo
DESENHADO dentro do PNG, o que as prende a um idioma só. Capa sem palavra
nenhuma dissolve isso: um arquivo serve os 5 locales, não há o que traduzir, não
há hebraico para shapear e nenhum rótulo pode estourar caixa.

A PRIMEIRA VERSÃO DESTE ARQUIVO FOI REPROVADA e o motivo fica registrado para não
voltar: ela pegava a geometria dos gráficos do artigo e arrancava os rótulos. O
resultado era um gráfico pelado — honesto e feio. Capa não é gráfico sem legenda.

A RÉGUA CERTA JÁ EXISTIA NO ACERVO: `content/artigos/noisy-tv-agentes/
ilustracao-quarto-escuro.png`, a "Fig. III — o quarto escuro". É uma PRANCHA DE
OBSERVAÇÃO: fundo quase preto com grão, vinheta, cantos de moldura, curvas
atravessando o quadro, e o desenho aparecendo por LUZ, não por preenchimento.

Cada cena é uma IMAGEM pensada para aquele artigo — sedimento, coluna, fio,
brasa, rastro — e o dado do artigo continua por baixo dela, lido do dataset que o
próprio artigo publica. Nenhum número é digitado aqui.

O QUE NUNCA ENTRA: palavra, e número com separador decimal (`8,64` vira `8.64` em
inglês, e aí a arte deixaria de servir os 5 idiomas). O título não entra de
propósito: a página já o imprime acima da imagem, e todo card social imprime o
título ao lado da miniatura.

Uso:
    python3 scripts/artigos/gerar-capas-sem-texto.py                 # todas
    python3 scripts/artigos/gerar-capas-sem-texto.py glm-5-3
    python3 scripts/artigos/gerar-capas-sem-texto.py --amostra <dir> # não toca public/
"""

from __future__ import annotations

import math
import random
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

RAIZ = Path(__file__).resolve().parents[2]
LARGURA, ALTURA = 2400, 1260

FUNDO = (7, 9, 13)
RESPIRO = (26, 38, 54)
OURO = (196, 173, 127)
OURO_FOSCO = (140, 122, 88)
MOLDURA = (78, 64, 42)
FRIO = (118, 158, 214)
QUENTE = (214, 138, 96)


# ── A prancha: o que se repete em toda capa ─────────────────────────────────────


def abrir(semente):
    """Devolve o quadro e a CAMADA DE BRILHO, que é somada no fim.

    A semente fixa o acaso: a mesma capa sai igual em toda rodada, senão o arquivo
    mudaria de hash a cada build e o cache do leitor cairia à toa.
    """
    random.seed(semente)
    im = Image.new("RGB", (LARGURA, ALTURA), FUNDO)
    faixa = Image.new("L", (1, ALTURA))
    for y in range(ALTURA):
        faixa.putpixel((0, y), int(30 * (1 - y / ALTURA) ** 1.6))
    im.paste(Image.new("RGB", (LARGURA, ALTURA), RESPIRO), (0, 0), faixa.resize((LARGURA, ALTURA)))
    luz = Image.new("RGB", (LARGURA, ALTURA), (0, 0, 0))
    return im, ImageDraw.Draw(im), luz, ImageDraw.Draw(luz)


def halo(dl, x, y, raio, cor, forca=4):
    """Marca luz na camada de brilho. Ela é borrada e SOMADA no fim — nunca colada
    com máscara: colar apagou o desenho inteiro na primeira tentativa."""
    dl.ellipse((x - raio, y - raio, x + raio, y + raio), fill=tuple(v // forca for v in cor))


def arcos(d):
    """Duas curvas de observação. Atravessam o quadro — arco que morre no meio fica solto."""
    d.arc((-360, 210, 2760, 2600), start=204, end=336, fill=(28, 37, 50), width=2)
    d.arc((-260, 330, 2860, 2900), start=206, end=334, fill=(20, 27, 38), width=2)


def cantos(d):
    b, a = 88, 116
    for x, y, sx, sy in ((b, b, 1, 1), (LARGURA - b, b, -1, 1), (b, ALTURA - b, 1, -1), (LARGURA - b, ALTURA - b, -1, -1)):
        d.line((x, y, x + sx * a, y), fill=MOLDURA, width=3)
        d.line((x, y, x, y + sy * a), fill=MOLDURA, width=3)


def _grao(im):
    """A textura é o que tira da peça o ar de vetor."""
    n = Image.effect_noise((LARGURA, ALTURA), 26).convert("L")
    return Image.blend(im, ImageChops.screen(im, Image.merge("RGB", (n, n, n)).point(lambda v: v // 9)), 0.55)


def _vinheta(im):
    m = Image.new("L", (LARGURA, ALTURA), 0)
    ImageDraw.Draw(m).ellipse((-LARGURA * 0.30, -ALTURA * 0.55, LARGURA * 1.30, ALTURA * 1.55), fill=255)
    escuro = ImageChops.multiply(im, Image.new("RGB", (LARGURA, ALTURA), (120, 120, 130)))
    return Image.composite(im, escuro, m.filter(ImageFilter.GaussianBlur(180)))


def fechar(im, luz, com_arcos=True):
    im = ImageChops.add(im, luz.filter(ImageFilter.GaussianBlur(30)))
    d = ImageDraw.Draw(im)
    if com_arcos:
        arcos(d)
    cantos(d)
    return _vinheta(_grao(im))


# ── Fonte dos dados: os datasets que o artigo já publica ────────────────────────


def ler_ts(arquivo, chave):
    fonte = (RAIZ / arquivo).read_text()
    i = fonte.index("'%s': {" % chave)
    profundidade = 0
    for k in range(i + len(chave) + 3, len(fonte)):
        if fonte[k] == "{":
            profundidade += 1
        elif fonte[k] == "}":
            profundidade -= 1
            if profundidade == 0:
                return fonte[i:k + 1]
    raise SystemExit("dataset '%s' nao fecha em %s" % (chave, arquivo))


def numeros(bloco, nome):
    return [float(v) for v in re.findall(nome + r":\s*([\d.]+)", bloco)]


def series(bloco):
    saida = []
    for pedaco in bloco.split("label:")[1:]:
        cor = re.search(r"color: '(#\w+)'", pedaco)
        corpo = re.search(r"points:\s*\[(.*?)\],?\s*\n\s*\}", pedaco, re.S)
        pontos = re.findall(r"\[([\d.]+),\s*([\d.]+)\]", corpo.group(1)) if corpo else []
        if cor and pontos:
            saida.append((cor.group(1), [(float(a), float(b)) for a, b in pontos]))
    return saida


def hexa(c):
    return tuple(int(c[i:i + 2], 16) for i in (1, 3, 5))


def suave(c, k=0.72):
    """Puxa a cor do dataset para o tom da prancha: nada aqui grita."""
    return tuple(int(v * k + 40 * (1 - k)) for v in c)


# ── As cenas ────────────────────────────────────────────────────────────────────


def cena_glm_5_3():
    """Um sedimento de 2.436 grãos, quase todo apagado — e a brasa na ponta.

    Cada grão é uma vulnerabilidade do balanço que a Z.ai publicou como prova de
    capacidade cyber. 2.239 nunca saíram da descoberta: são o sedimento escuro que
    ocupa o quadro. O punhado que andou está aceso e apertado na ponta.
    """
    bloco = ler_ts("data/artigos-charts.ts", "glm53-ledger-status")
    cores = [suave(hexa(c)) for c in re.findall(r"color: '(#\w+)'", bloco)]
    contagens = [int(v) for v in re.findall(r"count: (\d+)", bloco)]
    graos = [(c, i > 1) for i, (c, n) in enumerate(zip(cores, contagens)) for _ in range(n)]

    im, d, luz, dl = abrir(53)
    x0, x1, cy = 250, 1960, 640
    for i, (cor, aceso) in enumerate(graos):
        t = i / len(graos)
        x = x0 + t * (x1 - x0) + random.gauss(0, 13)
        y = cy + random.gauss(0, 118 * (1 - 0.62 * t)) + 46 * math.sin(t * 5.2)
        r = 3.2 if not aceso else 5.0
        d.ellipse((x - r, y - r, x + r, y + r), fill=cor)
        if aceso:
            halo(dl, x, y, r * 4, cor)
    return fechar(im, luz)


def cena_ia_local_por_vram():
    """Dez colunas de luz contra uma parede. As que nao cabem vazam por cima.

    Cada coluna e um degrau da escada de VRAM, em FRACAO da memoria daquela placa:
    a parede e a mesma para todas. A coluna acesa e o que o modelo ocupa em
    repouso; as brasas que sobem alem da parede sao o que falta no contexto
    maximo. Os pesos cabem em todo mundo — quem nao cabe e a conversa.
    """
    bloco = ler_ts("data/artigos-charts.ts", "ia-local-por-vram-escada")
    cap, pesos = numeros(bloco, "capacidade"), numeros(bloco, "pesos")
    c_ref, c_max = numeros(bloco, "cacheRef"), numeros(bloco, "cacheMax")

    im, d, luz, dl = abrir(24)
    parede, base = 520, 1020
    larg, vao = 74, 118
    x0 = (LARGURA - (len(cap) * larg + (len(cap) - 1) * vao)) // 2

    for i, c in enumerate(cap):
        x = x0 + i * (larg + vao)
        ocupa = min(1.0, (pesos[i] + c_ref[i]) / c)
        topo = base - (base - parede) * ocupa
        # a coluna nasce escura no chao e chega acesa no topo: e luz, nao bloco
        for k in range(90):
            t = k / 90
            y = base - (base - topo) * t
            v = 0.10 + 0.90 * t ** 2.2
            d.rectangle((x, y - (base - topo) / 90 - 1, x + larg, y),
                        fill=tuple(int(cc * v) for cc in suave(OURO, 0.62)))
        d.rectangle((x, topo - 4, x + larg, topo + 2), fill=OURO)
        halo(dl, x + larg / 2, topo, larg * 1.5, OURO, forca=5)

        falta = pesos[i] + c_max[i] - c
        if falta > 0:
            alt = min(1.0, falta / c) * 330
            for _ in range(16):
                t = random.random()
                px = x + larg / 2 + random.gauss(0, larg * 0.42) * (0.4 + t)
                py = parede - alt * t
                r = max(1.5, 5 * (1 - t))
                d.ellipse((px - r, py - r, px + r, py + r),
                          fill=tuple(int(cc * (1 - t * 0.55)) for cc in QUENTE))
                halo(dl, px, py, r * 7, QUENTE, forca=5)

    d.line((x0 - 170, parede, x0 + len(cap) * (larg + vao) + 96, parede), fill=(96, 112, 132), width=3)
    return fechar(im, luz)


def cena_carta_ciberdefesa_openai():
    """Um mural de molduras vazias. A única acesa é de outro documento.

    A matriz do artigo pergunta, para cada bloco da carta, se há cifra, prazo,
    verbo que obriga, responsável e alvo verificável — e a resposta é ausente em
    dezenove das vinte células. Embaixo, separada por um fio, a fileira de
    controle: outra página da mesma empresa, que preenche o que a carta não
    preenche.
    """
    bloco = ler_ts("data/obligation-matrix.ts", "carta-ciberdefesa-blocos")
    estados = re.findall(r"estado: '(\w+)'", bloco)
    grade, controle = estados[:20], estados[20:25]

    im, d, luz, dl = abrir(155)
    cel_l, cel_a, vao = 330, 132, 40
    largura = 5 * cel_l + 4 * vao
    x0, y0 = (LARGURA - largura) // 2, 200

    for i, estado in enumerate(grade):
        x, y = x0 + (i % 5) * (cel_l + vao), y0 + (i // 5) * (cel_a + vao)
        d.rounded_rectangle((x, y, x + cel_l, y + cel_a), radius=10, outline=(28, 36, 47), width=2)
        if estado == "parcial":
            d.rounded_rectangle((x + 16, y + 16, x + cel_l // 2, y + cel_a - 16), radius=6, fill=(44, 39, 29))
            halo(dl, x + cel_l / 4, y + cel_a / 2, cel_a * 0.5, OURO_FOSCO, forca=12)

    y_ctrl = y0 + 4 * (cel_a + vao) + 56
    d.line((x0, y_ctrl - 40, x0 + largura, y_ctrl - 40), fill=(40, 52, 66), width=2)
    for i, estado in enumerate(controle):
        x = x0 + i * (cel_l + vao)
        if estado == "presente":
            d.rounded_rectangle((x, y_ctrl, x + cel_l, y_ctrl + cel_a), radius=10, fill=(70, 62, 46))
            d.rounded_rectangle((x, y_ctrl, x + cel_l, y_ctrl + 5), radius=2, fill=OURO)
            halo(dl, x + cel_l / 2, y_ctrl + cel_a / 2, cel_l * 0.42, OURO, forca=9)
        else:
            d.rounded_rectangle((x, y_ctrl, x + cel_l, y_ctrl + cel_a), radius=10, outline=(28, 36, 47), width=2)
    return fechar(im, luz)


def cena_ninguem_provou_meta_le_whatsapp():
    """Um fio de luz retesado entre duas pontas — e o esgarçamento na ponta.

    O artigo desmonta a acusação de que a empresa lê o canal e mostra a saída que
    de fato existe: o texto já aberto no aparelho de quem denuncia. O fio entre as
    pontas é inteiro; da ponta direita descem filamentos que se desfazem no
    escuro. A fuga não está no meio do caminho: está na ponta.
    """
    im, d, luz, dl = abrir(7)
    y, esq, dir_ = 470, 340, 1980

    d.line((esq, y, dir_, y), fill=suave(OURO, 0.55), width=5)
    for x in (esq, dir_):
        d.ellipse((x - 34, y - 34, x + 34, y + 34), outline=suave(OURO), width=5)
        halo(dl, x, y, 130, OURO, forca=6)
    for k in range(160):
        halo(dl, esq + (k / 160) * (dir_ - esq), y, 26, OURO, forca=16)

    for f in range(7):
        desvio = (f - 3) * 26
        for p in range(46):
            t = p / 46
            x = dir_ + desvio * t + random.gauss(0, 6)
            yy = y + 40 + t * 640
            r = max(1.0, 5 * (1 - t))
            cor = tuple(int(c * (1 - t * 0.8) + 10) for c in QUENTE)
            d.ellipse((x - r, yy - r, x + r, yy + r), fill=cor)
            if t < 0.45:
                halo(dl, x, yy, r * 6, QUENTE, forca=7)
    return fechar(im, luz)


def cena_recusa_que_parou_o_estudo_das_recusas():
    """Uma fileira de selos acesos, e um lugar onde a luz não pousa.

    O artigo mostra o mecanismo, não uma frequência — o estudo que a mede ainda
    está rodando. Então a cena mostra UMA instância: passos carimbados como
    concluídos, e um deles oco. Do lado de fora, a recusa e o resultado vazio são
    a mesma coisa.
    """
    im, d, luz, dl = abrir(26)
    n, r, vao = 9, 74, 96
    x0, cy = (LARGURA - (n * 2 * r + (n - 1) * vao)) // 2 + r, 620
    oca = 5

    for i in range(n):
        x = x0 + i * (2 * r + vao)
        if i == oca:
            d.ellipse((x - r, cy - r, x + r, cy + r), outline=(58, 40, 34), width=4)
            for k in range(7):
                a = k / 7 * math.tau
                cx, cyy = x + r * 0.55 * math.cos(a), cy + r * 0.55 * math.sin(a)
                d.ellipse((cx - 3, cyy - 3, cx + 3, cyy + 3), fill=(70, 52, 44))
        else:
            d.ellipse((x - r, cy - r, x + r, cy + r), fill=(30, 38, 50), outline=suave(OURO, 0.5), width=4)
            d.ellipse((x - r * 0.45, cy - r * 0.45, x + r * 0.45, cy + r * 0.45), fill=suave(OURO))
            halo(dl, x, cy, r * 2.1, OURO, forca=6)
    return fechar(im, luz)


def cena_benchmark_harness_modelo():
    """O mesmo par medido duas vezes: um fio de luz liga as duas notas.

    O artigo mostra que a diferenca entre dois modelos pode vir do arnes, nao do
    modelo. Cada fio sai da nota de baixo e chega na de cima; o comprimento e o
    quanto a nota anda so por trocar quem mede. O fio aceso e o valor extremo que
    sustentou a manchete — os outros sete mal saem do chao.
    """
    bloco = ler_ts("data/artigos-charts.ts", "benchmark-oito-pares")
    valores = numeros(bloco, "value")
    maximo = float(re.search(r"max:\s*([\d.]+)", bloco).group(1))

    im, d, luz, dl = abrir(8)
    chao, teto = 1010, 300
    x0, vao = 380, (LARGURA - 760) / (len(valores) - 1)

    d.line((240, chao, LARGURA - 240, chao), fill=(60, 74, 92), width=3)
    for i, v in enumerate(valores):
        x = x0 + i * vao
        topo = chao - (chao - teto) * (v / maximo)
        forte = i == 0
        cor = suave(OURO) if forte else (76, 100, 126)
        # o fio: apagado embaixo, aceso onde chega
        for k in range(70):
            t = k / 70
            y = chao - (chao - topo) * t
            c = tuple(int(cc * (0.25 + 0.75 * t ** 1.6)) for cc in cor)
            d.rectangle((x - (3 if forte else 2), y - (chao - topo) / 70 - 1, x + (3 if forte else 2), y), fill=c)
        r = 13 if forte else 7
        d.ellipse((x - r, topo - r, x + r, topo + r), fill=cor)
        halo(dl, x, topo, r * (5 if forte else 3.4), OURO if forte else FRIO, forca=4 if forte else 9)
        d.ellipse((x - 4, chao - 4, x + 4, chao + 4), fill=(70, 84, 102))
    return fechar(im, luz)


def cena_2026_07_24_claude_opus_5():
    """Quatro rastros subindo num campo escuro. O dourado sobe gastando menos.

    Cada rastro é um modelo andando da esquerda (barato) para a direita (caro)
    conforme se paga por mais esforço. O do Opus 5 fica acima e à esquerda dos
    outros — a manchete do artigo, sem manchete.
    """
    bloco = ler_ts("data/artigos-charts.ts", "opus5-frontier-bench")
    dom = lambda n: [float(v) for v in re.search(n + r": \[([\d.]+), ([\d.]+)\]", bloco).groups()]
    xd, yd = dom("xDomain"), dom("yDomain")

    im, d, luz, dl = abrir(5)
    x0, y0, x1, y1 = 300, 210, 2120, 1030
    ex = lambda v: x0 + (math.log10(v) - math.log10(xd[0])) / (math.log10(xd[1]) - math.log10(xd[0])) * (x1 - x0)
    ey = lambda v: y1 - (v - yd[0]) / (yd[1] - yd[0]) * (y1 - y0)

    d.line((x0 - 40, y1, x1 + 40, y1), fill=(40, 52, 66), width=2)
    for cor_hex, pontos in series(bloco):
        cor = suave(hexa(cor_hex))
        tela = [(ex(a), ey(b)) for a, b in pontos]
        d.line([p for xy in tela for p in xy], fill=cor, width=5, joint="curve")
        for j, (x, y) in enumerate(tela):
            r = 9 + 4 * (j == len(tela) - 1)
            d.ellipse((x - r, y - r, x + r, y + r), fill=cor)
            halo(dl, x, y, r * 4.5, cor, forca=6)
    return fechar(im, luz)


def cena_deepseek_v4_flash_0731():
    """Nove brasas contra nove cinzas: o placar que a própria DeepSeek publicou.

    A tabela do lançamento traz nove benchmarks agênticos em que o Claude Opus 4.8
    vence o V4-Flash-0731 em TODAS as linhas. A fileira de cima está acesa; a de
    baixo é o mesmo lugar, sem fogo.
    """
    im, d, luz, dl = abrir(9)
    n, r, vao = 9, 52, 110
    x0 = (LARGURA - (n * 2 * r + (n - 1) * vao)) // 2 + r
    for i in range(n):
        x = x0 + i * (2 * r + vao)
        d.ellipse((x - r, 400 - r, x + r, 400 + r), fill=suave(OURO))
        halo(dl, x, 400, r * 2.4, OURO, forca=7)
        d.ellipse((x - r, 880 - r, x + r, 880 + r), outline=(44, 50, 60), width=5)
        for _ in range(5):
            a, rr = random.random() * math.tau, r * 0.5 * random.random()
            cx, cyy = x + rr * math.cos(a), 880 + rr * math.sin(a)
            d.ellipse((cx - 2, cyy - 2, cx + 2, cyy + 2), fill=(52, 58, 68))
    return fechar(im, luz, com_arcos=False)


def cena_noisy_tv_agentes():
    """Uma tela de chuvisco acesa num quarto escuro, e o U invertido como arco.

    O artigo mede a armadilha da TV barulhenta: o agente fica preso diante de
    ruído puro porque confunde imprevisibilidade com informação. A luz da tela
    lava o quadro. O arco é a intensidade da curiosidade — máxima no meio, nula
    nas pontas — com a marca no ponto de lacuna-fantasma que ele mediu.
    """
    bloco = ler_ts("data/artigos-charts-noisytv.ts", "noisytv-u-invertido")
    g_marca = float(re.search(r"g:\s*([\d.]+)", bloco).group(1))

    im, d, luz, dl = abrir(41)
    tx0, ty0, tx1, ty1 = 760, 330, 1640, 830
    for y in range(ty0, ty1, 3):
        for x in range(tx0, tx1, 3):
            v = random.randint(20, 210)
            d.rectangle((x, y, x + 2, y + 2), fill=(v, v, min(255, int(v * 1.05))))
    d.rectangle((tx0 - 6, ty0 - 6, tx1 + 6, ty1 + 6), outline=(96, 108, 124), width=4)
    halo(dl, (tx0 + tx1) / 2, (ty0 + ty1) / 2, 620, (170, 186, 210), forca=7)

    cx0, cx1, base, alt = 300, 2120, 1120, 520
    pontos = [(cx0 + (i / 160) * (cx1 - cx0), base - 4 * (i / 160) * (1 - i / 160) * alt) for i in range(161)]
    d.line([p for xy in pontos for p in xy], fill=(70, 86, 108), width=4, joint="curve")
    xm = cx0 + g_marca * (cx1 - cx0)
    ym = base - 4 * g_marca * (1 - g_marca) * alt
    d.ellipse((xm - 13, ym - 13, xm + 13, ym + 13), fill=QUENTE)
    halo(dl, xm, ym, 90, QUENTE, forca=4)
    return fechar(im, luz, com_arcos=False)


def cena_jogos_robos_humanoides_2026():
    """Rastros de velocidade numa pista. Os curtos cruzaram a linha primeiro.

    Cada rastro é um tempo da régua dos 100 m, com a cor do grupo a que pertence:
    a competição oficial de 2026, o evento-teste que viralizou, o recorde humano e
    o vencedor da edição de 2025. O fio claro é o recorde humano, e quatro rastros
    terminam antes dele. Nenhum número: os tempos têm vírgula decimal.
    """
    bloco = ler_ts("data/artigos-charts.ts", "robos-2026-100m-reguas")
    itens = []
    for pedaco in bloco.split("color:")[1:]:
        cor = hexa(re.match(r"\s*'(#\w+)'", pedaco).group(1))
        itens += [(float(v), cor) for v in re.findall(r"value: ([\d.]+)", pedaco)]
    itens.sort(key=lambda t: -t[0])
    maximo = max(v for v, _ in itens)
    bolt = min(v for v, c in itens if c == hexa("#64748b"))

    im, d, luz, dl = abrir(100)
    x0, larg, topo, vao = 260, 1840, 250, 104
    for i, (v, cor) in enumerate(itens):
        y = topo + i * vao
        fim = x0 + larg * v / maximo
        cor = suave(cor)
        passo = (fim - x0) / 120
        for k in range(120):
            t = k / 120
            x = x0 + (fim - x0) * t
            h = 1.5 + 5.5 * t ** 3
            c = tuple(int(cc * (0.06 + 0.94 * t ** 3)) for cc in cor)
            d.rectangle((x, y - h / 2, x + passo + 1.5, y + h / 2), fill=c)
        d.ellipse((fim - 9, y - 9, fim + 9, y + 9), fill=cor)
        halo(dl, fim, y, 78, cor, forca=4)
    x_bolt = x0 + larg * bolt / maximo
    d.line((x_bolt, topo - 84, x_bolt, topo + len(itens) * vao - 28), fill=(178, 190, 206), width=3)
    return fechar(im, luz)


def cena_estatisticas_agentes_de_ia():
    """Duas aparições e uma coluna sólida — só a sólida atravessa o horizonte.

    O experimento da METR mede a mesma tarefa três vezes: o tempo PREVISTO, o
    MEDIDO no cronômetro e o ESTIMADO depois. Sem IA é o horizonte. As duas
    crenças são fantasmas que param embaixo dele; a medição é sólida e passa.
    """
    bloco = ler_ts("data/artigos-charts.ts", "agentes-metr-percepcao")
    valores = [int(v) for v in numeros(bloco, "value")]
    maximo = float(re.search(r"max:\s*([\d.]+)", bloco).group(1))

    im, d, luz, dl = abrir(95)
    base, alt_util = 1030, 740
    larg, vao = 300, 170
    largura = len(valores) * larg + (len(valores) - 1) * vao
    x0 = (LARGURA - largura) // 2
    y_horizonte = base - 100 / maximo * alt_util

    for i, v in enumerate(valores):
        x = x0 + i * (larg + vao)
        topo = base - v / maximo * alt_util
        if v > 100:
            d.rectangle((x, topo, x + larg, base), fill=(46, 30, 26))
            d.rectangle((x, topo, x + larg, topo + 7), fill=QUENTE)
            halo(dl, x + larg / 2, topo + 90, larg * 0.9, QUENTE, forca=5)
        else:
            for k in range(26):
                yy = topo + (base - topo) * k / 26
                d.rectangle((x, yy, x + larg, yy + 3), fill=(44, 54, 68))
            d.rectangle((x, topo, x + larg, topo + 3), fill=(88, 104, 124))
    d.line((x0 - 150, y_horizonte, x0 + largura + 150, y_horizonte), fill=(160, 172, 188), width=4)
    return fechar(im, luz)


CENAS = {
    "glm-5-3": cena_glm_5_3,
    "ia-local-por-vram": cena_ia_local_por_vram,
    "carta-ciberdefesa-openai": cena_carta_ciberdefesa_openai,
    "ninguem-provou-meta-le-whatsapp": cena_ninguem_provou_meta_le_whatsapp,
    "recusa-que-parou-o-estudo-das-recusas": cena_recusa_que_parou_o_estudo_das_recusas,
    "benchmark-harness-modelo": cena_benchmark_harness_modelo,
    "2026-07-24-claude-opus-5": cena_2026_07_24_claude_opus_5,
    "deepseek-v4-flash-0731": cena_deepseek_v4_flash_0731,
    "noisy-tv-agentes": cena_noisy_tv_agentes,
    "jogos-robos-humanoides-2026": cena_jogos_robos_humanoides_2026,
    "estatisticas-agentes-de-ia": cena_estatisticas_agentes_de_ia,
}

# Um artigo tem DUAS capas: a arte pt-BR com texto (de outra sessao) fica, e a capa
# muda atende en/es/it/he. So por isso o nome de saida e parametrizado.
NOME_BASE = {"estatisticas-agentes-de-ia": "hero-mudo"}


def main():
    argv = sys.argv[1:]
    amostra = None
    if "--amostra" in argv:
        i = argv.index("--amostra")
        amostra = Path(argv[i + 1])
        amostra.mkdir(parents=True, exist_ok=True)
        argv = argv[:i] + argv[i + 2:]

    for slug in argv or list(CENAS):
        if slug not in CENAS:
            sys.exit("sem cena para '%s' — as que existem: %s" % (slug, ", ".join(CENAS)))
        im = CENAS[slug]()
        if amostra:
            destino = amostra / ("%s.png" % slug)
            im.save(destino)
            print("%s  %.0f KB" % (destino, destino.stat().st_size / 1024))
            continue
        bruto = RAIZ / (".capa-bruta-%s.png" % slug)
        im.save(bruto)
        try:
            r = subprocess.run(
                [sys.executable, str(RAIZ / "scripts/artigos/publicar-capa.py"), slug, str(bruto),
                 NOME_BASE.get(slug, "hero")],
                check=False,
            )
        finally:
            bruto.unlink(missing_ok=True)
        if r.returncode:
            return r.returncode
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
