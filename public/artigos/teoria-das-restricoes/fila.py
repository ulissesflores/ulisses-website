#!/usr/bin/env python3
"""Simulador de linha em série para o artigo "Teoria das Restrições".

Motivo de existir: as duas afirmações centrais da Teoria das Restrições — a saída
do sistema não passa da restrição, e acelerar quem NÃO é a restrição não aumenta
a saída (só engorda a fila) — quase sempre são ilustradas com desenho e anedota.
Aqui elas são medidas, com semente fixa e código publicado junto.

O modelo é uma linha de N postos em série, servidor único por posto e tempo de
atendimento exponencial de taxa `mu_i`. Um posto tem `mu` menor que os outros: é
a restrição. Não há framework de simulação e não há dependência — em fila em
série com FIFO nenhum item ultrapassa outro, então a recursão de Lindley

    inicio[i][k] = max(saida[i-1][k], saida[i][k-1])
    saida[i][k]  = inicio[i][k] + servico[i][k]

é exata e é o simulador inteiro. Três políticas de liberação de trabalho:

  poisson  chegadas externas a taxa `lam` — o sistema aberto de livro-texto.
  empurra  libera um item toda vez que o PRIMEIRO posto fica livre: é o
           "mantenha todo mundo ocupado", o ótimo local que a TOC ataca.
  corda    tambor-pulmão-corda (drum-buffer-rope) na forma CONWIP: item novo só
           entra quando outro sai, então o trabalho em curso fica constante.

Uso:
    python3 fila.py                  # roda os 3 experimentos -> resultados.json
    python3 fila.py --autoteste      # confere o simulador contra a fórmula fechada
    python3 fila.py --experimento 2  # roda só um experimento

Convenção de unidades: tempo em "unidades de tempo" e taxa em "itens por unidade
de tempo". O artigo dá nome concreto a isso (carros por minuto, tickets por hora);
o modelo é adimensional de propósito.
"""

from __future__ import annotations

import argparse
import json
import random
import statistics
from pathlib import Path

AQUI = Path(__file__).parent

# A linha do artigo: cinco postos, o terceiro é a restrição (4 contra 10).
LINHA_BASE = [10.0, 10.0, 4.0, 10.0, 10.0]
RESTRICAO = 2  # índice 0-based do posto restrição em LINHA_BASE
SEMENTE = 20260825


# --------------------------------------------------------------------------- #
# O simulador
# --------------------------------------------------------------------------- #
def simular(mus, politica, k_itens, lam=None, corda=None, semente=SEMENTE):
    """Roda a linha e devolve (entrada, saida) — um tempo por item.

    `entrada[k]` é quando o item k foi liberado no sistema e `saida[k]` quando
    deixou o último posto. Percorremos em ordem de item (não de posto) porque a
    política `corda` depende da saída de um item anterior: é realimentação.
    """
    rng = random.Random(semente)
    n_postos = len(mus)
    livre = [0.0] * n_postos          # quando cada posto termina o item atual
    entrada = [0.0] * k_itens
    saida = [0.0] * k_itens
    chegada = 0.0

    for k in range(k_itens):
        if politica == "poisson":
            chegada += rng.expovariate(lam)
            t = chegada
        elif politica == "empurra":
            # Libera assim que o primeiro posto pode pegar: a taxa de entrada
            # passa a ser a capacidade do posto 1, não a demanda.
            t = livre[0]
        elif politica == "corda":
            # A corda: o item k só entra quando o item k-corda saiu. Mesmo que o
            # primeiro posto esteja ocioso. É a ociosidade deliberada da TOC.
            t = max(livre[0], saida[k - corda]) if k >= corda else livre[0]
        else:
            raise ValueError(f"política desconhecida: {politica}")

        entrada[k] = t
        for i, mu in enumerate(mus):
            inicio = t if t > livre[i] else livre[i]
            t = inicio + rng.expovariate(mu)
            livre[i] = t
        saida[k] = t

    return entrada, saida


# --------------------------------------------------------------------------- #
# As medidas
# --------------------------------------------------------------------------- #
def medir(entrada, saida, aquecimento, fracao_janela=0.6):
    """Vazão, tempo de travessia (W), trabalho em curso (L) e o resíduo de Little.

    Duas escolhas de medida importam e são deliberadas:

    1. L é medido INDEPENDENTEMENTE de W: integra-se a contagem de itens no
       sistema ao longo do tempo, em vez de dividir a soma dos tempos de
       travessia. Sem essa separação, comparar L com lam*W seria circular.

    2. A janela de observação FECHA ANTES do fim da corrida (`fracao_janela`).
       É o que um painel de verdade enxerga: às 15h você conhece o tempo de fila
       de quem já foi atendido, e não conhece o de quem ainda está na fila. Se a
       janela fosse até a última saída, todo item teria entrado e saído dentro
       dela e a Lei de Little fecharia por construção — inclusive numa fila que
       está explodindo. Foi o que o teste negativo do `--autoteste` pegou.

    O resíduo |L - lam*W| / L é, então, uma medida de sobrevivência: numa fila
    que cresce, quem está entalado nunca sai, nunca entra na média de espera, e
    só a contagem o enxerga. Em regime estacionário os dois caminhos coincidem.
    """
    k_itens = len(entrada)
    t0 = saida[aquecimento]
    # Não se observa além do último item liberado: depois disso a linha está
    # apenas drenando, o que é um regime que o sistema real não tem.
    t_limite = min(entrada[-1], saida[-1])
    t1 = t0 + fracao_janela * (t_limite - t0)
    janela = t1 - t0

    saiu_na_janela = [k for k in range(aquecimento, k_itens) if t0 <= saida[k] <= t1]
    w_medio = statistics.fmean(saida[k] - entrada[k] for k in saiu_na_janela)
    vazao = len(saiu_na_janela) / janela

    eventos = sorted([(t, 1) for t in entrada] + [(t, -1) for t in saida])
    n_dentro, area, t_ant, n_em_t1 = 0, 0.0, eventos[0][0], 0
    for t, delta in eventos:
        ini, fim = max(t_ant, t0), min(t, t1)
        if fim > ini:
            area += n_dentro * (fim - ini)
        if t <= t1:
            n_em_t1 = n_dentro + delta
        n_dentro += delta
        t_ant = t
    l_medio = area / janela

    return {
        "vazao": vazao,
        "tempo_de_travessia": w_medio,
        "trabalho_em_curso": l_medio,
        "trabalho_em_curso_no_fim_da_janela": n_em_t1,
        "residuo_de_little": abs(l_medio - vazao * w_medio) / l_medio,
    }


def w_teorico(mus, lam):
    """Tempo de travessia previsto pela forma fechada de M/M/1 em série.

    Vale pelo teorema de Burke: a saída de uma M/M/1 estável é Poisson de mesma
    taxa, então cada posto vê Poisson(lam) e o total é a soma dos 1/(mu_i - lam).
    Só existe se lam < min(mu): acima disso a fila não tem regime estacionário.
    """
    if lam >= min(mus):
        return None
    return sum(1.0 / (mu - lam) for mu in mus)


# --------------------------------------------------------------------------- #
# Experimento 1 — a rodovia: a saída não passa da restrição
# --------------------------------------------------------------------------- #
def experimento_rodovia(k_itens=400_000, aquecimento=60_000):
    linhas = []
    for passo in range(1, 15):
        lam = passo * 0.5                       # 0,5 a 7,0 itens por unidade
        entrada, saida = simular(LINHA_BASE, "poisson", k_itens, lam=lam)
        m = medir(entrada, saida, aquecimento)
        linhas.append({
            "demanda_oferecida": lam,
            "estavel": lam < LINHA_BASE[RESTRICAO],
            **m,
        })
    return {
        "titulo": "A saída do sistema não passa da restrição",
        "linha": LINHA_BASE,
        "capacidade_da_restricao": LINHA_BASE[RESTRICAO],
        "k_itens": k_itens,
        "pontos": linhas,
    }


# --------------------------------------------------------------------------- #
# Experimento 2 — melhorar o lugar errado
# --------------------------------------------------------------------------- #
def experimento_lugar_errado(k_itens=400_000, aquecimento=60_000):
    dobro_do_primeiro = list(LINHA_BASE)
    dobro_do_primeiro[0] = 20.0
    restricao_elevada = list(LINHA_BASE)
    restricao_elevada[RESTRICAO] = 5.0

    cenarios = [
        ("empurra_base", LINHA_BASE, "empurra", None,
         "Empurra: libera trabalho assim que o primeiro posto fica livre"),
        ("empurra_dobra_o_primeiro", dobro_do_primeiro, "empurra", None,
         "Empurra + dobra a capacidade do posto 1 (10 -> 20): esforço FORA da restrição"),
        ("empurra_eleva_a_restricao", restricao_elevada, "empurra", None,
         "Empurra + eleva a restrição (4 -> 5): +25% no lugar certo"),
        ("corda_base", LINHA_BASE, "corda", 6,
         "Corda (CONWIP=6) na mesma linha base: mesma capacidade, outra política"),
        ("corda_dobra_o_primeiro", dobro_do_primeiro, "corda", 6,
         "Corda + dobra o posto 1: a melhoria fora da restrição sob política certa"),
    ]

    saidas = {}
    for nome, mus, politica, corda, descricao in cenarios:
        entrada, saida = simular(mus, politica, k_itens, corda=corda)
        m = medir(entrada, saida, aquecimento)
        # Sob "empurra" a fila cresce sem limite: a média de W não é um número do
        # sistema, é um número da janela. O que tem sentido é a INCLINAÇÃO — de
        # quanto o tempo de travessia do item k cresce a cada item produzido.
        meio = k_itens // 2
        crescimento = (saida[-1] - entrada[-1]) - (saida[meio] - entrada[meio])
        m["crescimento_da_espera_por_item"] = crescimento / (k_itens - meio)
        m["espera_do_ultimo_item"] = saida[-1] - entrada[-1]
        saidas[nome] = {"linha": mus, "politica": politica, "corda": corda,
                        "descricao": descricao, **m}

    base, dobra = saidas["empurra_base"], saidas["empurra_dobra_o_primeiro"]
    eleva = saidas["empurra_eleva_a_restricao"]
    saidas["_leitura"] = {
        "ganho_de_vazao_dobrando_o_primeiro_pct":
            100 * (dobra["vazao"] / base["vazao"] - 1),
        "ganho_de_vazao_elevando_a_restricao_pct":
            100 * (eleva["vazao"] / base["vazao"] - 1),
        "piora_da_espera_dobrando_o_primeiro_pct":
            100 * (dobra["crescimento_da_espera_por_item"]
                   / base["crescimento_da_espera_por_item"] - 1),
        "queda_da_espera_com_a_corda_pct":
            100 * (1 - saidas["corda_base"]["tempo_de_travessia"]
                   / base["tempo_de_travessia"]),
    }
    return {"titulo": "Melhorar o lugar errado", "k_itens": k_itens, "cenarios": saidas}


# --------------------------------------------------------------------------- #
# Experimento 3 — o resíduo da Lei de Little denuncia o regime
# --------------------------------------------------------------------------- #
def experimento_little(k_itens=400_000, aquecimento=60_000):
    pontos = []
    for passo in range(1, 13):
        ocupacao = 0.50 + passo * 0.05           # 0,55 a 1,15 da restrição
        lam = ocupacao * LINHA_BASE[RESTRICAO]
        entrada, saida = simular(LINHA_BASE, "poisson", k_itens, lam=lam)
        m = medir(entrada, saida, aquecimento)
        previsto = w_teorico(LINHA_BASE, lam)
        pontos.append({
            "ocupacao_da_restricao": round(ocupacao, 2),
            "demanda_oferecida": lam,
            "estavel": previsto is not None,
            "tempo_de_travessia_previsto": previsto,
            "erro_contra_a_forma_fechada_pct":
                None if previsto is None
                else 100 * abs(m["tempo_de_travessia"] - previsto) / previsto,
            **m,
        })
    return {
        "titulo": "O resíduo de Little denuncia a fila que não fecha",
        "k_itens": k_itens,
        "pontos": pontos,
    }


# --------------------------------------------------------------------------- #
# Autoteste — o simulador contra a fórmula fechada
# --------------------------------------------------------------------------- #
def autoteste():
    """Um simulador que ninguém confere é um desenho com mais passos."""
    falhas = []

    # 1. M/M/1 em série contra a forma fechada, longe e perto da saturação.
    #    A 90% da restrição a fila relaxa devagar: com 200 mil itens o W medido
    #    ainda vem 7% acima da forma fechada, e com 1,5 milhão fica em -0,03%.
    #    Isso é transiente, não defeito — por isso a corrida perto da saturação
    #    é mais longa aqui e o experimento 3 publica o erro contra a fórmula.
    for lam, k_itens, aquecimento, tolerancia in (
            (2.0, 200_000, 20_000, 3.0), (3.6, 1_500_000, 300_000, 2.0)):
        entrada, saida = simular(LINHA_BASE, "poisson", k_itens, lam=lam)
        m = medir(entrada, saida, aquecimento)
        previsto = w_teorico(LINHA_BASE, lam)
        erro = 100 * abs(m["tempo_de_travessia"] - previsto) / previsto
        ok = erro < tolerancia
        print(f"[{'ok' if ok else 'FALHA'}] lam={lam} (K={k_itens:,}): W medido "
              f"{m['tempo_de_travessia']:.4f} vs previsto {previsto:.4f} "
              f"(erro {erro:.2f}%, tolerância {tolerancia}%)")
        if not ok:
            falhas.append(f"W fora da forma fechada em lam={lam}: {erro:.2f}%")

    # 2. Em regime estacionário o resíduo de Little tem de ser desprezível.
    entrada, saida = simular(LINHA_BASE, "poisson", 200_000, lam=3.0)
    m = medir(entrada, saida, 20_000)
    ok = m["residuo_de_little"] < 0.01
    print(f"[{'ok' if ok else 'FALHA'}] resíduo de Little estável: "
          f"{m['residuo_de_little']:.5f} (limite 0,01)")
    if not ok:
        falhas.append(f"resíduo alto em regime estável: {m['residuo_de_little']}")

    # 3. TESTE NEGATIVO: acima da restrição o resíduo TEM de estourar. Se não
    #    estourar, a medida não discrimina nada e a figura 3 não vale.
    entrada, saida = simular(LINHA_BASE, "poisson", 200_000, lam=5.0)
    m = medir(entrada, saida, 20_000)
    ok = m["residuo_de_little"] > 0.05
    print(f"[{'ok' if ok else 'FALHA'}] teste negativo (lam=5 > restrição=4): "
          f"resíduo {m['residuo_de_little']:.5f} (tem de passar de 0,05)")
    if not ok:
        falhas.append("o resíduo não discrimina o regime instável")

    # 4. A vazão não passa da restrição, por mais demanda que se ofereça.
    entrada, saida = simular(LINHA_BASE, "poisson", 200_000, lam=9.0)
    m = medir(entrada, saida, 20_000)
    ok = abs(m["vazao"] - LINHA_BASE[RESTRICAO]) / LINHA_BASE[RESTRICAO] < 0.02
    print(f"[{'ok' if ok else 'FALHA'}] vazão com demanda 9,0 na linha de "
          f"restrição 4,0: {m['vazao']:.4f} (tem de ficar em 4,0 ± 2%)")
    if not ok:
        falhas.append(f"vazão saturada errada: {m['vazao']}")

    if falhas:
        print("\nFALHOU:")
        for f in falhas:
            print(f"  - {f}")
        return 1
    print("\nautoteste: 4 de 4 ok")
    return 0


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--autoteste", action="store_true",
                    help="confere o simulador contra a forma fechada e para")
    ap.add_argument("--experimento", type=int, choices=(1, 2, 3),
                    help="roda só um experimento")
    ap.add_argument("--saida", default=str(AQUI / "resultados.json"))
    args = ap.parse_args()

    if args.autoteste:
        raise SystemExit(autoteste())

    todos = {1: experimento_rodovia, 2: experimento_lugar_errado, 3: experimento_little}
    escolhidos = [args.experimento] if args.experimento else sorted(todos)
    resultado = {
        "semente": SEMENTE,
        "linha_base": LINHA_BASE,
        "restricao": {"posto": RESTRICAO + 1, "capacidade": LINHA_BASE[RESTRICAO]},
        "experimentos": {},
    }
    for n in escolhidos:
        print(f"rodando experimento {n}...")
        resultado["experimentos"][f"experimento_{n}"] = todos[n]()

    Path(args.saida).write_text(
        json.dumps(resultado, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"gravado: {args.saida}")


if __name__ == "__main__":
    main()
