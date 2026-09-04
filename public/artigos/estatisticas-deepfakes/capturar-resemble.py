#!/usr/bin/env python3
"""Captura o painel publico de incidentes de deepfake da Resemble AI, para contar por conta propria.

E o script citado no artigo "As 7 estatisticas centrais de deepfake vem de quem vende o detector"
(https://ulissesflores.com/deepfake). A pagina e React e so monta a tabela depois de rodar o
JavaScript, entao `curl` nao serve: aqui vai um Chrome de verdade, que rola a pagina ate o fim e
guarda TRES coisas — o HTML final, o texto/tabelas/rotulos de SVG extraidos do DOM, e as respostas
XHR cruas em JSON, que sao a fonte de onde o painel desenha.

O que a rodada de 28/08/2026 mediu, e que esta no artigo: 2.266 incidentes no banco; 159 deles
(7,0%) com perda financeira verificada — sao esses 159, e nao os 2.266, que somam a cifra de
"US$ 1,3 bilhao" que circula; e a distribuicao por tipo de ataque, em que fraude corporativa e a
MENOR das seis categorias (185 casos, 8,2%). Se der diferente, me mande: atualizo e credito.

Requer `playwright` com o Chrome instalado (`pip install playwright`). Abre janela de verdade
(headless=False) porque o painel serve conteudo diferente para navegador headless.

Uso:
    python3 capturar-resemble.py [diretorio-de-saida]     # padrao: diretorio atual

Escreve `resemble-dashboard-raw.html`, `resemble-dashboard.png` e `resemble-dashboard-dump.json`.
"""
import json, sys, time
from playwright.sync_api import sync_playwright

URL = "https://www.resemble.ai/learn/deepfake-incident-database"
OUT = sys.argv[1] if len(sys.argv) > 1 else "."

with sync_playwright() as p:
    b = p.chromium.launch(headless=False, channel="chrome")
    ctx = b.new_context(
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0 Safari/537.36",
        locale="en-US", viewport={"width": 1440, "height": 1000})
    pg = ctx.new_page()
    xhr = []
    # o dashboard busca os incidentes por XHR: guardar a resposta crua e o corpo
    def on_resp(r):
        try:
            u = r.url
            if any(k in u.lower() for k in ("api", "incident", "json", "graphql", "supabase", "airtable")):
                ct = (r.headers or {}).get("content-type", "")
                if "json" in ct:
                    xhr.append({"url": u, "status": r.status, "body": r.text()[:400000]})
        except Exception:
            pass
    pg.on("response", on_resp)
    r = pg.goto(URL, wait_until="domcontentloaded", timeout=90000)
    print("status", r.status if r else None)
    for i in range(14):
        time.sleep(3)
        try:
            pg.mouse.wheel(0, 1200)
        except Exception:
            pass
        print(i, pg.title()[:70], "chars", len(pg.content()))
    html = pg.content()
    open(f"{OUT}/resemble-dashboard-raw.html", "w").write(html)
    data = pg.evaluate("""() => {
      const body = document.body;
      // todo texto visivel + tabelas + rotulos de grafico (svg text)
      const svgText = [...document.querySelectorAll('svg text')].map(t => t.textContent.trim()).filter(Boolean);
      const tables = [...document.querySelectorAll('table')].map(tb =>
        [...tb.querySelectorAll('tr')].map(tr => [...tr.querySelectorAll('th,td')].map(c => c.innerText.trim())));
      const selects = [...document.querySelectorAll('select')].map(s => ({name: s.name||s.id, options: [...s.options].map(o=>o.text)}));
      const btns = [...document.querySelectorAll('button,[role=tab]')].map(b=>b.innerText.trim()).filter(Boolean);
      return {svgText, tables, selects, btns, text: body.innerText};
    }""")
    try:
        pg.screenshot(path=f"{OUT}/resemble-dashboard.png", timeout=15000)
    except Exception as e:
        print("screenshot falhou (nao-fatal):", e)
    b.close()

data["xhr"] = xhr
json.dump(data, open(f"{OUT}/resemble-dashboard-dump.json", "w"), ensure_ascii=False, indent=1)
print("svgText", len(data["svgText"]), "tables", len(data["tables"]),
      "btns", len(data["btns"]), "xhr", len(xhr), "chars", len(data["text"]))
for x in xhr:
    print("XHR", x["status"], x["url"][:140], "len", len(x["body"]))
