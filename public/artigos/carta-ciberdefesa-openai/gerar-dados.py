#!/usr/bin/env python3
"""Gera `data/obligation-matrix.ts` do ulisses-website a partir da captura PINADA da carta.

POR QUE ESTE ARQUIVO EXISTE: a figura do artigo e uma ASSERCAO DE AUSENCIA -- "nenhum dos
quatro blocos de pedidos obriga ninguem a nada mensuravel". Asercao de ausencia so vale com
(a) o espaco de busca ENUMERADO e (b) um CONTROLE POSITIVO que prove que o instrumento
detecta a coisa quando ela existe. Os dois entram na propria figura, nao so na prosa.

O ESPACO ENUMERADO sao as cinco colunas: cifra, prazo, verbo que obriga, quem responde,
alvo verificavel. Cada uma e uma busca por regex no texto do bloco, listada em MARCADORES.

O CONTROLE POSITIVO e a pagina "Trusted Access for Cyber" da propria OpenAI (fevereiro de
2026), que traz "we are committing $10 million in API credits": mesma editora, mesmo
assunto, seis meses antes. Ela ACENDE tres das cinco colunas -- e apaga duas. Controle que
acende tudo nao calibra nada; este mostra que a regua mede.

REGRA DO ESTADO PARCIAL (a defesa da figura, escrita aqui de proposito): 'parcial' so
quando um COMPONENTE GENUINO do marcador esta presente e falta o resto. O bloco 02 diz
"measure progress by how many organizations are protected" -- fornece a metrica, nao o alvo:
parcial. Ja "significant funding" (bloco 04) e ADJETIVO, nao numero: fica AUSENTE, e o
aparte "o mais perto que a carta chega de dinheiro e um adjetivo" vive na prosa, nao na
figura. Sem essa regra, a matriz vira acusacao em vez de medida.

ESCOPO DO ACHADO DOS ALGARISMOS: vale para o CORPO da carta (do "We have a limited window"
ate "Let's put them to work."). A lista de signatarios tem "1Password" e "F5" -- dizer "os
unicos algarismos da carta" sem essa ressalva e falseavel por pedante.

USO:
    python3 assets/gerar-dados.py            # escreve no site e imprime o laudo
    python3 assets/gerar-dados.py --conferir # so imprime, nao escreve
"""

from __future__ import annotations

import argparse
import hashlib
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from extrair_blocos import blocos as _blocos, texto as _texto  # noqa: E402

RAIZ = Path(__file__).resolve().parents[1]
DESTINO = Path("/Users/ulissesflores/Developer/ulisses-website/data/obligation-matrix.ts")

# Captura pinada. E o memento publico mais recente da carta -- citavel por URL, ao
# contrario do HTML que o Chromium salvou aqui. O corpo dos quatro blocos e byte-identico
# nas quatro capturas de 22h (medido por `extrair-blocos.py`): o que muda na pagina e a
# lista de quem assina, nunca o que a carta pede.
CAPTURA = RAIZ / "fontes/20260828154512.html"
MEMENTO = "https://web.archive.org/web/20260828154512/https://openai.com/collective-cyberdefense/"
CONTROLE = RAIZ / "fontes/raw/c-tac-text.txt"

# ── o espaco enumerado ──────────────────────────────────────────────────────────
# Cada marcador e uma busca. O que a figura afirma e exatamente o que estas regex
# devolvem -- nao uma leitura minha do texto.
MARCADORES = [
    ("cifra", r"[$€£]\s?[\d,.]+|\b\d[\d,.]*\s*(?:million|billion|thousand)\b|\b\d+\s*%"),
    ("prazo", r"\b(?:20\d\d|by\s+(?:the\s+)?end\b|deadline|within\s+\d|no later than|Q[1-4]\b)"),
    ("verbo", r"\b(?:must|shall|are required|commit(?:s|ted|ment|ments|ting)?|"
              r"pledge[sd]?|undertake[sn]?|binding|obligat\w+|mandat(?:e|es|ed|ory))\b"),
    ("responde", r"\bwe (?:will|shall|are committing|commit|pledge)\b"),
    ("alvo", r"\b(?:at least|no fewer than|target of|reduce .{0,20}by \d|"
             r"\d+\s*%|by 20\d\d)\b"),
]


def marcar(trecho: str) -> dict[str, list[str]]:
    return {
        nome: [m.group(0) for m in re.finditer(pat, trecho, re.I)]
        for nome, pat in MARCADORES
    }


def frases_imperativas(corpo: str) -> list[str]:
    """Frases do bloco. Nenhum bloco tem abreviacao, entao `. ` basta e e auditavel."""
    return [f.strip() for f in re.split(r"(?<=\.)\s+", corpo) if f.strip()]


# ── texto por locale ────────────────────────────────────────────────────────────
# `{n}` e a contagem MEDIDA de frases no imperativo, nao um numero digitado.
LOCALES = {
    "pt-br": dict(
        colunas=[["Cifra"], ["Prazo"], ["Verbo que", "obriga"], ["Quem", "responde"],
                 ["Alvo", "verificável"]],
        destinatarios=[["Toda organização"],
                       ["Empresas de cibersegurança", "e parceiros de tecnologia"],
                       ["Governos"],
                       ["Empresas de IA de fronteira"]],
        volume="{n} frases no imperativo",
        controle=["Controle: Trusted Access for Cyber,", "OpenAI, fev/2026 — outro documento"],
        nota_alvo=["nomeia a métrica,", "não o alvo"],
        nota_cifra=["US$ 10 milhões"],
        nota_verbo=["“we are committing”"],
        nota_responde=["a própria OpenAI"],
        legenda=dict(ausente="ausente", parcial="parcial", presente="presente"),
        conclusao=["Nenhum dos quatro blocos traz cifra, prazo ou verbo que obrigue.",
                   "Os únicos algarismos no corpo da carta são 01, 02, 03 e 04."],
    ),
    "en": dict(
        colunas=[["Amount"], ["Deadline"], ["Binding", "verb"], ["Who is", "accountable"],
                 ["Verifiable", "target"]],
        destinatarios=[["Every organization"],
                       ["Cybersecurity companies", "and technology partners"],
                       ["Governments"],
                       ["Frontier AI companies"]],
        volume="{n} imperative sentences",
        controle=["Control: Trusted Access for Cyber,", "OpenAI, Feb 2026 — a different document"],
        nota_alvo=["names the metric,", "not the target"],
        nota_cifra=["US$10 million"],
        nota_verbo=["“we are committing”"],
        nota_responde=["OpenAI itself"],
        legenda=dict(ausente="absent", parcial="partial", presente="present"),
        conclusao=["No block carries an amount, a deadline, or a verb that binds.",
                   "The only digits in the body of the letter are 01, 02, 03 and 04."],
    ),
    "es": dict(
        colunas=[["Cifra"], ["Plazo"], ["Verbo que", "obliga"], ["Quién", "responde"],
                 ["Meta", "verificable"]],
        destinatarios=[["Toda organización"],
                       ["Empresas de ciberseguridad", "y socios tecnológicos"],
                       ["Gobiernos"],
                       ["Empresas de IA de frontera"]],
        volume="{n} frases en imperativo",
        controle=["Control: Trusted Access for Cyber,", "OpenAI, feb. 2026 — otro documento"],
        nota_alvo=["nombra la métrica,", "no la meta"],
        nota_cifra=["US$ 10 millones"],
        nota_verbo=["“we are committing”"],
        nota_responde=["la propia OpenAI"],
        legenda=dict(ausente="ausente", parcial="parcial", presente="presente"),
        conclusao=["Ningún bloque trae cifra, plazo ni verbo que obligue.",
                   "Los únicos dígitos en el cuerpo de la carta son 01, 02, 03 y 04."],
    ),
    "it": dict(
        colunas=[["Cifra"], ["Scadenza"], ["Verbo che", "obbliga"], ["Chi ne", "risponde"],
                 ["Obiettivo", "verificabile"]],
        destinatarios=[["Ogni organizzazione"],
                       ["Aziende di cybersicurezza", "e partner tecnologici"],
                       ["Governi"],
                       ["Aziende di IA di frontiera"]],
        volume="{n} frasi all’imperativo",
        controle=["Controllo: Trusted Access for Cyber,", "OpenAI, feb. 2026 — altro documento"],
        nota_alvo=["nomina la metrica,", "non l’obiettivo"],
        nota_cifra=["US$ 10 milioni"],
        nota_verbo=["“we are committing”"],
        nota_responde=["la stessa OpenAI"],
        legenda=dict(ausente="assente", parcial="parziale", presente="presente"),
        conclusao=["Nessuno dei quattro blocchi porta cifra, scadenza o verbo che obblighi.",
                   "Le uniche cifre nel corpo della lettera sono 01, 02, 03 e 04."],
    ),
    "he": dict(
        colunas=[["סכום"], ["מועד"], ["פועל", "מחייב"], ["מי", "אחראי"], ["יעד", "נמדד"]],
        destinatarios=[["כל ארגון"],
                       ["חברות אבטחת סייבר", "ושותפות טכנולוגיה"],
                       ["ממשלות"],
                       ["חברות AI בחזית"]],
        volume="{n} משפטי ציווי",
        controle=["בקרה: Trusted Access for Cyber,", "OpenAI, פברואר 2026 — מסמך אחר"],
        nota_alvo=["נוקבת במדד,", "לא ביעד"],
        nota_cifra=["10 מיליון דולר"],
        nota_verbo=["“we are committing”"],
        nota_responde=["OpenAI עצמה"],
        legenda=dict(ausente="חסר", parcial="חלקי", presente="קיים"),
        conclusao=["באף אחד מארבעת הבלוקים אין סכום, מועד או פועל מחייב.",
                   "הספרות היחידות בגוף המכתב הן 01, 02, 03 ו-04."],
    ),
}

CABECA = '''/**
 * ══════════════════════════════════════════════════════════════════════
 * Dados do `ObligationMatrix` — artigo `carta-ciberdefesa-openai`
 * ══════════════════════════════════════════════════════════════════════
 *
 * GERADO por `assets/gerar-dados.py` do dossiê — NÃO editar à mão.
 * Dossiê: /Users/ulissesflores/Developer/redacao/dossies/carta-ciberdefesa-openai/
 *
 * PROCEDÊNCIA: captura pinada da carta (sha256 {sha}),
 * {memento}
 * O corpo dos quatro blocos é byte-idêntico nas quatro capturas entre 27/08 17:13 e
 * 28/08 15:45 UTC: na página muda a lista de quem assina, nunca o que a carta pede.
 *
 * A figura é uma ASSERÇÃO DE AUSÊNCIA, então carrega as duas coisas que uma exige: o
 * espaço de busca ENUMERADO (as cinco colunas, cada uma uma regex no gerador) e um
 * CONTROLE POSITIVO — a página Trusted Access for Cyber, da própria OpenAI, fev/2026,
 * que acende três das cinco colunas e apaga duas. Documento DIFERENTE, e o rótulo da
 * linha diz isso dentro do SVG: os US$ 10 milhões não são desta carta.
 *
 * Um Record com TODOS os idiomas: `{{id}}` é o pt-br, `-en`, `-es`, `-it`, `-he` as
 * traduções — o componente faz `throw` em id desconhecido.
 *
 * Toda quebra de linha é EXPLÍCITA (array de linhas): `<text>` de SVG não quebra
 * sozinho, e o medidor `scripts/charts/checar-rotulos-svg.py` mede as mesmas linhas
 * que o componente desenha.
 */

export type ObligationEstado = 'ausente' | 'parcial' | 'presente';

export interface ObligationCelula {{
  estado: ObligationEstado;
  /** Micro-rótulo sob a marca. Vazio em 'ausente' — a ausência não se explica. */
  nota?: readonly string[];
}}

export interface ObligationLinha {{
  /** '01'..'04' na carta; vazio na linha de controle. */
  numero: string;
  destinatario: readonly string[];
  /** Volume de pedidos do bloco ("6 frases no imperativo"); vazio no controle. */
  volume: string;
  /** Uma célula por coluna, na ordem de `colunas`. */
  celulas: readonly ObligationCelula[];
  /** Controle positivo: desenhado abaixo da régua, em quarentena visual. */
  controle?: boolean;
}}

export interface ObligationMatrixDataset {{
  colunas: readonly (readonly string[])[];
  linhas: readonly ObligationLinha[];
  legenda: {{ ausente: string; parcial: string; presente: string }};
  conclusao: readonly string[];
}}

export const obligationMatrixDatasets: Record<string, ObligationMatrixDataset> = {{
'''


def ts(v) -> str:
    if isinstance(v, str):
        return "'" + v.replace("\\", "\\\\").replace("'", "\\'") + "'"
    if isinstance(v, list):
        return "[" + ", ".join(ts(x) for x in v) + "]"
    raise TypeError(v)


# Sentinelas do CORPO do controle. A pagina inteira carrega menu, rodape e "Keep reading"
# com anos soltos ("OpenAI (c) 2015-2026", "Aug 19, 2026"): medir a pagina crua acendia 18
# falsos "prazo" e teria posto um marcador na figura que o documento nao tem. O controle so
# calibra a regua se for medido no mesmo tipo de superficie que a carta -- corpo contra corpo.
CTRL_INICIO = "GPT‑5.3‑Codex is our most cyber-capable"
CTRL_FIM = "we are committing $10 million"


def corpo_do_controle() -> str:
    linhas = [l.strip() for l in CONTROLE.read_text(encoding="utf-8").split("\n") if l.strip()]
    try:
        i = next(k for k, l in enumerate(linhas) if l.startswith(CTRL_INICIO))
        j = next(k for k, l in enumerate(linhas) if CTRL_FIM in l)
    except StopIteration:
        sys.exit(f"{CONTROLE}: sentinelas do corpo do controle nao encontradas")
    return "\n".join(linhas[i:j + 1])


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--conferir", action="store_true")
    args = ap.parse_args()

    sha = hashlib.sha256(CAPTURA.read_bytes()).hexdigest()
    linhas_html = _texto(CAPTURA)
    bl = _blocos(linhas_html)
    if sorted(bl) != ["01", "02", "03", "04"]:
        sys.exit(f"{CAPTURA}: esperava os blocos 01..04, achei {sorted(bl)}")

    # Corpo integral, para o achado dos algarismos.
    i0 = next(i for i, l in enumerate(linhas_html) if l.startswith("We have a limited window"))
    i1 = next(i for i, l in enumerate(linhas_html) if l.endswith("Let’s put them to work."))
    corpo = "\n".join(linhas_html[i0:i1 + 1])
    algarismos = re.findall(r"\d", corpo)
    if algarismos != list("01020304"):
        sys.exit(f"o corpo da carta deixou de ter só os algarismos dos blocos: {algarismos}")

    # ── medicao, bloco a bloco ──
    print(f"captura   {CAPTURA.name}  sha256:{sha[:16]}")
    print(f"corpo     {len(corpo)} chars · algarismos: {''.join(algarismos)} (= os 4 blocos)\n")
    medido = []
    for k in sorted(bl):
        frases = frases_imperativas(bl[k]["corpo"])
        hits = marcar(bl[k]["corpo"])
        medido.append((k, bl[k]["destinatario"], len(frases), hits))
        print(f"{k} {bl[k]['destinatario']}  ({len(frases)} frases)")
        for nome, _ in MARCADORES:
            print(f"     {nome:9s} {len(hits[nome]):2d} {hits[nome] if hits[nome] else ''}")
        for f in frases:
            print(f"     · {f[:96]}")
        print()

    ctrl = marcar(corpo_do_controle())
    print("CONTROLE POSITIVO — Trusted Access for Cyber (OpenAI, 5/fev/2026)")
    for nome, _ in MARCADORES:
        print(f"     {nome:9s} {len(ctrl[nome]):2d} {sorted(set(ctrl[nome]))[:6]}")

    # A figura so pode ser desenhada se a medicao sustentar o que ela afirma.
    for k, _, _, hits in medido:
        vivos = [n for n, _ in MARCADORES if hits[n]]
        if vivos:
            sys.exit(f"bloco {k} acendeu {vivos} — a matriz de ausência não se sustenta mais")
    if not ctrl["cifra"] or not ctrl["verbo"]:
        sys.exit("o controle positivo apagou: sem ele a asserção de ausência não vale")

    # ── emissao ──
    saida = [CABECA.format(sha=sha, memento=MEMENTO)]
    for locale, t in LOCALES.items():
        chave = "carta-ciberdefesa-blocos" + ("" if locale == "pt-br" else f"-{locale}")
        L = ["  '%s': {" % chave, "    colunas: [%s]," % ", ".join(ts(c) for c in t["colunas"]),
             "    linhas: ["]
        for i, (k, _, n, _) in enumerate(medido):
            cel = ["{ estado: 'ausente' }"] * 5
            # Bloco 02: "measure progress by how many organizations are protected, how
            # quickly attacks are contained" — fornece a METRICA e omite o ALVO.
            if k == "02":
                cel[4] = "{ estado: 'parcial', nota: %s }" % ts(t["nota_alvo"])
            L += [
                "      {",
                "        numero: %s," % ts(k),
                "        destinatario: %s," % ts(t["destinatarios"][i]),
                "        volume: %s," % ts(t["volume"].format(n=n)),
                "        celulas: [%s]," % ", ".join(cel),
                "      },",
            ]
        ctrl_cel = [
            "{ estado: 'presente', nota: %s }" % ts(t["nota_cifra"]),
            "{ estado: 'ausente' }",
            "{ estado: 'presente', nota: %s }" % ts(t["nota_verbo"]),
            "{ estado: 'presente', nota: %s }" % ts(t["nota_responde"]),
            "{ estado: 'ausente' }",
        ]
        L += [
            "      {",
            "        numero: ''," ,
            "        destinatario: %s," % ts(t["controle"]),
            "        volume: ''," ,
            "        celulas: [",
            *["          %s," % c for c in ctrl_cel],
            "        ],",
            "        controle: true,",
            "      },",
            "    ],",
            "    legenda: { ausente: %s, parcial: %s, presente: %s }," % (
                ts(t["legenda"]["ausente"]), ts(t["legenda"]["parcial"]), ts(t["legenda"]["presente"])),
            "    conclusao: %s," % ts(t["conclusao"]),
            "  },",
        ]
        saida.append("\n".join(L) + "\n")
    saida.append("};\n")
    conteudo = "".join(saida)

    if args.conferir:
        print("\n--conferir: nada escrito")
        return 0
    DESTINO.write_text(conteudo, encoding="utf-8")
    print(f"\nescrito {DESTINO} ({len(conteudo)} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
