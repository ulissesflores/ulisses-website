#!/usr/bin/env python3
"""Gera o dataset TypeScript da escada de VRAM a partir dos numeros MEDIDOS.

Por que existe: o card viral que originou o artigo orca so os PESOS. Aqui cada degrau
carrega as DUAS parcelas (pesos + cache) e o ponto em que a linha quebra. Rodar este
script e a unica forma legitima de mexer nos numeros do grafico -- nao editar o .ts a mao.

Uso:
    python3 gerar-dataset.py            # imprime o bloco TS no stdout
    python3 gerar-dataset.py --check    # so confere a aritmetica e sai

Procedencia de cada numero:
  * PESOS  = tamanho REAL do arquivo GGUF no Hugging Face Hub (GB decimais do Hub),
             convertido para GiB aqui. Repos citados em FONTE_PESOS.
  * CACHE  = saida de `python3 medidor.py --repo <repo>` (dossie memoria-llm-local),
             cache real com batch=1 e 2 bytes/elemento. Copias cruas em
             fontes/medidor-2026-08-27/.
  * CAPACIDADE = memoria do hardware, verificada em fontes/pesquisa-hardware.md.
"""

from __future__ import annotations
import argparse, json, sys

GB_PARA_GIB = 1e9 / 2**30  # Hub publica bytes decimais; VRAM e binaria. Ver artigo irmao.


def gib(gb_decimal: float) -> float:
    return round(gb_decimal * GB_PARA_GIB, 2)


# Tamanhos de arquivo GGUF, em GB decimais do Hub (2026-08-27).
FONTE_PESOS = {
    "gemma-4-E2B-qat":      (3.35,   "google/gemma-4-E2B-it-qat-q4_0-gguf"),
    "gemma-4-E2B-mmproj":   (0.99,   "google/gemma-4-E2B-it-qat-q4_0-gguf (mmproj)"),
    "gemma-4-12B-qat":      (6.98,   "google/gemma-4-12B-it-qat-q4_0-gguf"),
    "gemma-4-12B-q8":       (12.67,  "lmstudio-community/gemma-4-12B-it-GGUF"),
    "gemma-4-26B-q4km":     (16.80,  "lmstudio-community/gemma-4-26B-A4B-it-GGUF"),
    "qwen38-27B-q4km":      (16.46,  "unsloth/Qwen3.8-27B-GGUF (UD-Q4_K_M)"),
    "qwen38-27B-q6k":       (21.98,  "unsloth/Qwen3.8-27B-GGUF (UD-Q6_K)"),
    "qwen38-27B-q8":        (29.05,  "unsloth/Qwen3.8-27B-GGUF (Q8_0)"),
    "qwen38-27B-bf16":      (54.66,  "unsloth/Qwen3.8-27B-GGUF (BF16)"),
    "flashnext-q2kxl":      (78.87,  "unsloth/Qwen3.8-Flash-Next-GGUF (UD-Q2_K_XL)"),
    "flashnext-q3kxl":      (89.99,  "unsloth/Qwen3.8-Flash-Next-GGUF (UD-Q3_K_XL)"),
    "flashnext-q4kxl":      (111.33, "unsloth/Qwen3.8-Flash-Next-GGUF (UD-Q4_K_XL)"),
    "dsv4flash-q8kxl":      (161.87, "unsloth/DeepSeek-V4-Flash-0731-GGUF (UD-Q8_K_XL)"),
}

# Cache real em GiB por contexto, direto do medidor.py. Chave = contexto em tokens.
CACHE = {
    "gemma-4-E2B":     {8192: 0.12, 32768: 0.45, 131072: 1.76},
    "gemma-4-12B":     {8192: 0.66, 32768: 2.16, 131072: 8.16, 262144: 16.16},
    "gemma-4-26B-A4B": {8192: 0.41, 32768: 1.35, 131072: 5.10, 262144: 10.10},
    "Qwen3.8-27B":     {8192: 0.64, 32768: 2.14, 131072: 8.14, 262144: 16.14},
    "Flash-Next":      {8192: 0.29, 32768: 0.86, 131072: 3.11, 262144: 6.11},
    "V4-Flash-0731":   {8192: 0.67, 32768: 2.69, 131072: 10.75, 262144: 21.50},
}

CTX_REF = 32768  # contexto de referencia do grafico: uma sessao de trabalho de verdade

# A escada. `hardware_orig` guarda o que o card viral dizia, para o artigo poder comparar.
DEGRAUS = [
    dict(cap=4,   peso="gemma-4-E2B-qat",  familia="gemma-4-E2B",     modelo="Gemma 4 E2B",          quant="QAT q4_0",
         hw="hw_igpu",      hw_orig="GPU integrada",           corrige=None),
    dict(cap=8,   peso="gemma-4-12B-qat",  familia="gemma-4-12B",     modelo="Gemma 4 12B",          quant="QAT q4_0",
         hw="hw_5060",      hw_orig="RTX 5060 / 4060",         corrige=None),
    dict(cap=16,  peso="gemma-4-12B-q8",   familia="gemma-4-12B",     modelo="Gemma 4 12B",          quant="Q8_0",
         hw="hw_5060ti",    hw_orig="RTX 5060 Ti / 4080",      corrige=None),
    dict(cap=24,  peso="qwen38-27B-q4km",  familia="Qwen3.8-27B",     modelo="Qwen3.8-27B",          quant="UD-Q4_K_M",
         hw="hw_3090",      hw_orig="RTX 3090 / 5080 Super",   corrige="corr_5080super"),
    dict(cap=32,  peso="qwen38-27B-q6k",   familia="Qwen3.8-27B",     modelo="Qwen3.8-27B",          quant="UD-Q6_K",
         hw="hw_5090",      hw_orig="RTX 5090 / M6",           corrige=None),
    dict(cap=48,  peso="qwen38-27B-q8",    familia="Qwen3.8-27B",     modelo="Qwen3.8-27B",          quant="Q8_0",
         hw="hw_m5pro48",   hw_orig="M5 Pro",                  corrige=None),
    dict(cap=64,  peso="qwen38-27B-bf16",  familia="Qwen3.8-27B",     modelo="Qwen3.8-27B",          quant="BF16",
         hw="hw_2x5090",    hw_orig="2x RTX 5090 / M5 Pro",    corrige="corr_agregado"),
    dict(cap=96,  peso="flashnext-q2kxl",  familia="Flash-Next",      modelo="Qwen3.8-Flash-Next",   quant="UD-Q2_K_XL",
         hw="hw_pro6000",   hw_orig="RTX PRO 6000 / M5 Ultra", corrige="corr_q3cabe"),
    dict(cap=128, peso="flashnext-q4kxl",  familia="Flash-Next",      modelo="Qwen3.8-Flash-Next",   quant="UD-Q4_K_XL",
         hw="hw_spark",     hw_orig="DGX Spark / M5 Max",      corrige="corr_wired"),
    dict(cap=256, peso="dsv4flash-q8kxl",  familia="V4-Flash-0731",   modelo="DeepSeek V4 Flash 0731", quant="UD-Q8_K_XL",
         hw="hw_m5ultra",   hw_orig="M5 Ultra / 2x DGX Spark", corrige=None),
]


def monta() -> list[dict]:
    linhas = []
    for d in DEGRAUS:
        pesos = gib(FONTE_PESOS[d["peso"]][0])
        cache = CACHE[d["familia"]]
        ctx_max = max(cache)
        # Ate que contexto a linha se sustenta: o maior contexto medido em que pesos+cache cabem.
        cabe_ate = None
        for ctx in sorted(cache):
            if pesos + cache[ctx] <= d["cap"]:
                cabe_ate = ctx
        linhas.append({
            "capacidade": d["cap"],
            "hardwareKey": d["hw"],
            "modelo": d["modelo"],
            "quant": d["quant"],
            "pesos": pesos,
            "cacheRef": cache.get(CTX_REF, cache[min(cache)]),
            "cacheMax": cache[ctx_max],
            "ctxMax": ctx_max,
            "cabeAte": cabe_ate,
            "corrigeKey": d["corrige"],
            "repo": FONTE_PESOS[d["peso"]][1],
        })
    return linhas



# ── Texto por locale ─────────────────────────────────────────────────────────
# O grafico tem rotulo, entao cada lingua precisa do SEU dataset (convencao da casa:
# grafico com texto = 1 dataset por locale em data/artigos-charts.ts).
# Nome de peca e de modelo e VERBATIM em todas as linguas; so o que e prosa traduz.

HARDWARE = {
    # A linha de 24 GB e a UNICA correcao de hardware do card: a "RTX 5080 Super" nunca foi
    # lancada (adiada indefinidamente pelo preco do modulo GDDR7 de 3 GB). Trocada pela 4090.
    "hw_igpu":     {"pt-br": "GPU integrada", "en": "Integrated GPU", "es": "GPU integrada",
                    "it": "GPU integrata",    "he": "GPU \u05de\u05e9\u05d5\u05dc\u05d1\u05ea"},
    "hw_5060":     {k: "RTX 5060 / 4060" for k in ("pt-br", "en", "es", "it", "he")},
    "hw_5060ti":   {k: "RTX 5060 Ti / 4080" for k in ("pt-br", "en", "es", "it", "he")},
    "hw_3090":     {k: "RTX 3090 / 4090" for k in ("pt-br", "en", "es", "it", "he")},
    "hw_5090":     {k: "RTX 5090 / M6" for k in ("pt-br", "en", "es", "it", "he")},
    "hw_m5pro48":  {k: "M5 Pro (48 GB)" for k in ("pt-br", "en", "es", "it", "he")},
    "hw_2x5090":   {k: "2x RTX 5090 / M5 Pro" for k in ("pt-br", "en", "es", "it", "he")},
    "hw_pro6000":  {k: "RTX PRO 6000 / M5 Ultra" for k in ("pt-br", "en", "es", "it", "he")},
    "hw_spark":    {k: "DGX Spark / M5 Max" for k in ("pt-br", "en", "es", "it", "he")},
    "hw_m5ultra":  {k: "M5 Ultra / 2x DGX Spark" for k in ("pt-br", "en", "es", "it", "he")},
}

ATE = {"pt-br": "até {}", "en": "up to {}", "es": "hasta {}", "it": "fino a {}",
       "he": "\u05e2\u05d3 {}"}

LEGENDA = {
    "pt-br": {"pesos": "pesos do modelo", "cache": "cache a 32K de contexto",
              "estouro": "o que falta no contexto máximo do modelo"},
    "en":    {"pesos": "model weights", "cache": "cache at 32K context",
              "estouro": "what no longer fits at the model's maximum context"},
    "es":    {"pesos": "pesos del modelo", "cache": "caché a 32K de contexto",
              "estouro": "lo que ya no cabe en el contexto máximo del modelo"},
    "it":    {"pesos": "pesi del modello", "cache": "cache a 32K di contesto",
              "estouro": "ciò che non entra più al contesto massimo del modello"},
    "he":    {"pesos": "\u05de\u05e9\u05e7\u05dc\u05d9 \u05d4\u05de\u05d5\u05d3\u05dc",
              "cache": "cache \u05d1-32K \u05d4\u05e7\u05e9\u05e8",
              "estouro": "\u05de\u05d4 \u05e9\u05db\u05d1\u05e8 \u05dc\u05d0 \u05e0\u05db\u05e0\u05e1 \u05d1\u05d4\u05e7\u05e9\u05e8 \u05d4\u05de\u05e8\u05d1\u05d9"},
}

LOCALES = ["pt-br", "en", "es", "it", "he"]
CHAVE_BASE = "ia-local-por-vram-escada"


def q(s: str) -> str:
    """Literal de string TS entre aspas simples. O rotulo em ingles tem apostrofo."""
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"


def num(v: float) -> str:
    """Numero em TS: ponto decimal, sem zero a direita inutil."""
    return f"{v:.2f}".rstrip("0").rstrip(".")


def emite_ts(linhas: list[dict]) -> str:
    out = []
    out.append("/**")
    out.append(" * A escada da VRAM do artigo `ia-local-por-vram`.")
    out.append(" *")
    out.append(" * NAO EDITAR A MAO. Gerado por")
    out.append(" * `python3 gerar-dataset.py --ts` no dossie")
    out.append(" * /Users/ulissesflores/Developer/redacao/dossies/ia-local-por-vram/.")
    out.append(" *")
    out.append(" * PESOS = tamanho real do arquivo GGUF no Hugging Face Hub (GB decimais do Hub),")
    out.append(" * convertido para GiB. CACHE = `python3 medidor.py --repo <repo>` do dossie")
    out.append(" * `memoria-llm-local`, batch 1, 2 bytes por elemento. CAPACIDADE = memoria do")
    out.append(" * hardware verificada em 2026-08-27. Repo de cada peso, na ordem dos degraus:")
    for l in linhas:
        out.append(f" *   {l['capacidade']:>4} GB - {l['repo']}")
    out.append(" *")
    out.append(" * Um dataset por locale: os rotulos sao texto.")
    out.append(" */")
    out.append("export interface VramLadderDegrau {")
    out.append("  /** Memoria do degrau, em GiB — e a trilha da linha. */")
    out.append("  capacidade: number;")
    out.append("  /** Pecas que tem essa memoria. Nome proprio: nao traduz. */")
    out.append("  hardware: string;")
    out.append("  modelo: string;")
    out.append("  quant: string;")
    out.append("  /** Parcela fixa: o arquivo de pesos, em GiB. */")
    out.append("  pesos: number;")
    out.append("  /** Parcela que cresce, no contexto de referencia de 32K, em GiB. */")
    out.append("  cacheRef: number;")
    out.append("  /** A mesma parcela no contexto maximo do modelo, em GiB. */")
    out.append("  cacheMax: number;")
    out.append("  /** Maior contexto medido em que pesos + cache ainda cabem. */")
    out.append("  cabeAte: string;")
    out.append("}")
    out.append("")
    out.append("export interface VramLadderDataset {")
    out.append("  degraus: VramLadderDegrau[];")
    out.append("  legenda: { pesos: string; cache: string; estouro: string };")
    out.append("}")
    out.append("")
    out.append("export const vramLadderDatasets: Record<string, VramLadderDataset> = {")
    for loc in LOCALES:
        chave = CHAVE_BASE if loc == "pt-br" else f"{CHAVE_BASE}-{loc}"
        out.append(f"  {q(chave)}: {{")
        out.append("    degraus: [")
        for l in linhas:
            ate = ATE[loc].format(f"{(l['cabeAte'] or 0)//1024}K")
            out.append("      {")
            out.append(f"        capacidade: {l['capacidade']},")
            out.append(f"        hardware: {q(HARDWARE[l['hardwareKey']][loc])},")
            out.append(f"        modelo: {q(l['modelo'])},")
            out.append(f"        quant: {q(l['quant'])},")
            out.append(f"        pesos: {num(l['pesos'])},")
            out.append(f"        cacheRef: {num(l['cacheRef'])},")
            out.append(f"        cacheMax: {num(l['cacheMax'])},")
            out.append(f"        cabeAte: {q(ate)},")
            out.append("      },")
        out.append("    ],")
        lg = LEGENDA[loc]
        out.append("    legenda: {")
        out.append(f"      pesos: {q(lg['pesos'])},")
        out.append(f"      cache: {q(lg['cache'])},")
        out.append(f"      estouro: {q(lg['estouro'])},")
        out.append("    },")
        out.append("  },")
    out.append("};")
    return "\n".join(out) + "\n"


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--check", action="store_true")
    p.add_argument("--json", action="store_true")
    p.add_argument("--ts", action="store_true", help="emite o bloco TypeScript")
    a = p.parse_args()
    linhas = monta()

    if a.ts:
        print(emite_ts(linhas), end="")
        return 0

    if a.check or a.json:
        for l in linhas:
            ref = l["pesos"] + l["cacheRef"]
            mx = l["pesos"] + l["cacheMax"]
            print(f"{l['capacidade']:>4} GiB | {l['modelo']:<24} {l['quant']:<12} "
                  f"pesos {l['pesos']:6.2f} | +32K = {ref:6.2f} {'OK ' if ref <= l['capacidade'] else 'ESTOURA'}"
                  f" | +{l['ctxMax']//1024}K = {mx:6.2f} {'OK ' if mx <= l['capacidade'] else 'ESTOURA'}"
                  f" | cabe ate {(l['cabeAte'] or 0)//1024}K")
        if a.json:
            print(json.dumps(linhas, indent=2, ensure_ascii=False), file=sys.stderr)
        return 0

    print(json.dumps(linhas, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
