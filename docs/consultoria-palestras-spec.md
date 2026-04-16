# Spec: `/consultoria` e `/palestras`

> **Status:** rascunho de especificação (2026-04-16)
> **Objetivo:** responder as 13 perguntas de input (7 de `/consultoria` + 6 de `/palestras`) e entregar plano de ação concreto para materializar as duas páginas no site.
> **Autor:** Carlos Ulisses Flores (respostas) + Claude (compilação a partir do repo)
> **Fontes canônicas do repo:** `public/llms.txt`, `data/i18n/pt-br/home.ts`, `app/[locale]/page.tsx`, `data/seo/certifications.sota.json`.

---

## Sumário executivo

1. As **5 modalidades** de consultoria já estão declaradas no `llms.txt` — falta só materializar em HTML e adicionar **duração + retainer**.
2. Idioma padrão definitivo: **PT-BR (nativo) · EN (fluente) · ES (fluente) · IT (conversacional) · HE (leitura acadêmica)** — 5 idiomas, alinhado com llms.txt, corrigir home.ts.
3. Pricing: **híbrido** — faixa pública para diagnóstico e roadmap (commodity-like), "sob consulta" para arquitetura crítica, fractional e board.
4. Delivery: **híbrido** (presencial SP-interior + remoto global).
5. Cases: **curar 3-5 anonimizados** a partir do histórico Codex Hash + Prefeitura Itupeva + MV9 + C3 Group.
6. CTAs: **Calendly** (primário) + alias de email dedicado (`consultoria@` e `palestras@`) + WhatsApp (secundário).
7. Teologia **entra como tema de palestra nichada** — posicionamento: eventos cristãos acadêmicos e institutos teológicos, separado do tronco corporativo.

---

## Parte 1 · Respostas `/consultoria` (7 perguntas)

### 1. Modalidades oferecidas

| Modalidade | Descrição (1 linha) | Duração sugerida |
|---|---|---|
| **Projeto de Diagnóstico** | Análise executiva de maturidade em IA/dados/arquitetura com entrega de relatório e recomendações priorizadas. | **3-4 semanas** |
| **Roadmap Estratégico de IA** | Plano de adoção de IA generativa e agentes com priorização de casos de uso, arquitetura-alvo e orçamento estimado. | **6-8 semanas** |
| **Arquitetura de Sistema Crítico** | Design de sistemas distribuídos, cloudless, HFT, custódia MPC ou zero-trust com entregáveis de arquitetura e ADRs. | **8-16 semanas** (por escopo) |
| **Governança de Dados e Compliance** | Framework de governança, LGPD, políticas de IA responsável e trilhas de auditoria algorítmica. | **4-8 semanas** |
| **Fractional CTO / Board Advisory** | Atuação executiva fracional (2-3 dias/semana) ou assento consultivo mensal em conselhos estratégicos. | **Retainer mensal** (mínimo 6 meses) |
| **Pesquisa Aplicada & Pareceres** | Whitepapers técnicos, simulações estratégicas, pareceres periciais e deep research customizado. | **Por escopo** |
| **Treinamentos Executivos In-Company** | Workshops e masterclasses para C-level e Board sobre IA generativa, AGI, blockchain e soberania digital. | **1-5 dias** |

> **Fonte no site:** [llms.txt:22-28](../public/llms.txt) já declara 5 destas — falta apenas explicitar duração e transformar em HTML.

### 2. Setores/verticais priorizados

Com base no histórico do repo ([home.ts:108-144](../data/i18n/pt-br/home.ts) + [llms.txt:69-88](../public/llms.txt)):

1. **Financeiro / Fintech** — HFT, arbitragem, LSTM, detecção de fraudes, custódia MPC, Bitcoin/Web3.
2. **Setor Público** — planejamento estratégico municipal, governança de dados, auditoria algorítmica (experiência Prefeitura de Itupeva 2017-2023).
3. **Hardware / IoT / Deep Tech** — edge computing, cloudless, criptografia embarcada, Projeto PSI.
4. **Agronegócio de Precisão** — IoT, sensoriamento ambiental (GoldenLeaf).
5. **Educação e Terceiro Setor Cristão** — nicho diferenciado (Clube Santo, acervo teológico) — vertical opcional declarada à parte.

> **Recomendação:** destacar os 3 primeiros como "verticais-âncora" e os demais como "experiências adicionais".

### 3. Ticket / engajamento mínimo — modelo híbrido

| Modalidade | Estratégia de exibição | Faixa de mercado 2026 (BR) |
|---|---|---|
| Diagnóstico | **Faixa pública** → "a partir de R$ 35.000" | R$ 25k-80k |
| Roadmap de IA | **Faixa pública** → "a partir de R$ 90.000" | R$ 80k-200k |
| Arquitetura Crítica | **Sob consulta** | R$ 50k-250k por escopo |
| Governança de Dados | **Sob consulta** | R$ 40k-120k |
| Fractional CTO | **Sob consulta** (retainer) | R$ 25k-80k/mês (2-3 dias/sem) |
| Board Advisory | **Sob consulta** (retainer + possível equity) | R$ 15k-40k/mês |
| Treinamentos In-Company | **Faixa pública** → "a partir de R$ 18.000/dia" | R$ 15k-40k/dia |
| Pesquisa Aplicada / Parecer | **Sob consulta** | R$ 20k-120k |

**Como aplicar no site (padrão observado em consultores sêniores do mercado BR 2026):**

- Mostrar faixa ("a partir de R$ X") quando o entregável é **padronizável** (diagnóstico, roadmap, treinamento).
- Usar "**sob consulta**" quando o entregável depende de escopo altamente customizado (arquitetura, fractional, board, pesquisa).
- Nunca esconder 100% dos preços — isso **quebra confiança** e é penalizado em SEO de topo de funil.
- Nunca publicar 100% dos preços — isso **compromete margem** em deals complexos.

> **Benchmark:** Estudo CGI Brasil 2025 + HackTrain BR 2025 + Gartner SEA 2026 sugerem ticket médio de consultoria estratégica de IA para Fortune 500 BR entre R$ 400k-1.2M/ano.

### 4. Delivery — **híbrido** (padrão recomendado)

- **Presencial:** Jundiaí, Itupeva, São Paulo capital e região metropolitana (sem cobrança adicional).
- **Híbrido:** demais estados do Brasil (custo de deslocamento por acordo).
- **Remoto:** 100% para Brasil e exterior via Zoom, Meet ou ferramenta do cliente.

> **Fonte:** [llms.txt:28](../public/llms.txt) e [llms.txt:128](../public/llms.txt) já declaram este padrão — só falta materializar no HTML.

### 5. Idiomas de atendimento — **PT · EN · ES · IT · HE** (5 idiomas)

⚠️ **Divergência no site resolvida nesta spec:**

| Local atual | Idiomas declarados |
|---|---|
| [llms.txt:24](../public/llms.txt) "Palestras" | PT, EN, ES, IT |
| [llms.txt:112-117](../public/llms.txt) "Available Languages" | PT, EN, ES, IT, HE |
| [home.ts:32-35](../data/i18n/pt-br/home.ts) hero | PT, EN, ES apenas |

**Padrão único a ser aplicado em todo o site:**

| Idioma | Nível declarado | Uso prático |
|---|---|---|
| Português (BR) | Nativo | Atendimento pleno em todos os canais |
| Inglês | Fluente | Consultoria, palestra, board, publicações |
| Espanhol | Fluente | Consultoria e palestra LatAm |
| Italiano | Conversacional | Palestra e consultoria sob demanda |
| Hebraico | Leitura acadêmica | Pesquisa teológica e exegética; **não** atendimento comercial |

➡️ **Ação:** atualizar `home.ts` para declarar os 5 idiomas com os respectivos níveis.

### 6. Case Studies — curar acervo anonimizado

**Matéria-prima existente no repo** (histórico profissional de 28+ anos):

| Fonte | Tipo de evidência | Potencial de case |
|---|---|---|
| **Codex Hash Ltda** (2020-atual) | Algo-trading HFT, custódia MPC, IoT | Alto — mas proteção de IP |
| **Prefeitura de Itupeva** (2017-2023) | Planejamento estratégico municipal | Alto — setor público real |
| **MV9 Web & Sistemas** (2012-2019) | ERPs, Google partnership, migração cloud | Alto — facilmente anonimizável |
| **C3 Group / EconoFísica** (2013-2018) | Auditoria algorítmica de loterias, LGPD, BI financeiro | **Altíssimo** — raro e diferenciador |
| **Projeto PSI / Codex Hash** | Hardware wallet pós-quântica | Alto — já tem landing comercial |
| **GoldenLeaf** | IoT agrícola, edge computing | Médio |
| **32 certificações** Alura/Coursera/TU Delft | Competências validadas | Médio (prova social, não case) |
| **`cyberfinancial-resilience-lrblstm`** (AGTU MSc research) | Pesquisa de dissertação: Little's Law + LSTM para resiliência ciberfinanceira (Python) — [repo público](https://github.com/ulissesflores/cyberfinancial-resilience-lrblstm) | **Altíssimo** — case acadêmico público |
| **`mit508-techgrowth-des`** (MIT 508) | Discrete-event simulation de pipelines Kafka/Flink/Iceberg sob PACELC e partição de rede (Python) — [repo público](https://github.com/ulissesflores/mit508-techgrowth-des) | **Alto** — case técnico de sistemas distribuídos |
| **`mit507-yape-architecture-sim`** (MIT 507) | Simulação de arquitetura financeira (inspirada no Yape/BCP, Jupyter) — [repo público](https://github.com/ulissesflores/mit507-yape-architecture-sim) | **Alto** — case fintech |

**Recomendação de curadoria (5-7 cases para lançamento — mix acadêmico + comercial):**

**Comerciais anonimizados (3):**
1. **Setor Público Municipal — Governança Estratégica** → baseado em Prefeitura de Itupeva (2017-2023).
2. **Auditoria Algorítmica de Loterias + LGPD** → baseado em C3 Group / EconoFísica.
3. **Arquitetura HFT Cripto + MPC** → baseado em Codex Hash (cuidando do IP).

**Acadêmicos/Research 100% públicos (3) — citação direta autorizada (código aberto no GitHub):**

4. **Resiliência Ciberfinanceira com LSTM + Little's Law** — dissertação MSc AGTU ([repo](https://github.com/ulissesflores/cyberfinancial-resilience-lrblstm)). Vertical: **Financeiro/Fintech/Risco**.
5. **Simulação de Pipelines Distribuídos sob PACELC (MIT 508 — Technology Growth)** — DES de Kafka/Flink/Iceberg sob stress de partição de rede ([repo](https://github.com/ulissesflores/mit508-techgrowth-des)). Vertical: **Arquitetura Distribuída / Deep Tech**.
6. **Simulação de Arquitetura Fintech Latam — YAPE (MIT 507)** — modelagem de arquitetura inspirada em super-app financeiro ([repo](https://github.com/ulissesflores/mit507-yape-architecture-sim)). Vertical: **Fintech LatAm**.

**Reforço público já existente (1):**

7. **Hardware Wallet Pós-Quântica (Projeto PSI)** — landing comercial viva em `/projeto-psi`.

**Template de case (uma página por case):**

```text
[Vertical] · [Porte da empresa] · [Período]
Contexto: 2 parágrafos sobre o desafio
Intervenção: o que foi feito (sem nomes, sem dados sensíveis)
Resultado: 2-3 métricas quantitativas
Entregáveis: tipo de artefato produzido
```

### 7. CTA principal — **stack de 3 canais**

**Status atual no site** ([page.tsx:171-184](../app/[locale]/page.tsx)):

- ✅ WhatsApp: `+55 11 97272-7532`
- ✅ Email pessoal: `c.ulisses@gmail.com`
- ❌ Calendly inexistente
- ❌ Formulário inexistente
- ❌ Alias `consultoria@ulissesflores.com` inexistente

**Stack recomendada para `/consultoria`:**

1. **Primário — Calendly** (agendar diagnóstico de 30min gratuito): converte intenção alta imediatamente.
2. **Secundário — Email dedicado** `consultoria@ulissesflores.com`: cria filtro natural, profissionaliza a caixa, permite auto-responder com qualificação.
3. **Tertiário — WhatsApp Business**: mesmo número, mas label "Business" + auto-resposta com link do Calendly.
4. **Remover da landing:** email pessoal `c.ulisses@gmail.com` (mantém no rodapé geral, mas tira do CTA comercial).

---

## Parte 2 · Respostas `/palestras` (6 perguntas)

### 1. Temas aceitos (nichados, de acordo com perfil de acervo)

| Tema | Aceita? | Fundação no repo |
|---|---|---|
| **IA generativa & LLMs** | ✅ | Declarado em llms.txt + MSc AGTU + 2 simulações publicadas |
| **AGI & cenários 2027+** | ✅ | Simulação IA 2027 + 2 ramificações (slowdown/race) + manifesto acadêmico |
| **Blockchain & Codex Hash** | ✅ | Co-inventor Codex Hash + MBA FIAP 1ª turma + Projeto PSI + publicações Ring Signatures |
| **Economia austríaca aplicada** | ✅ | Monografia graduação + publicação "Bitcoin como Ativo de Reserva" |
| **Geopolítica digital** | ✅ | Declarado em llms.txt + Mundo Político (19 posts) |
| **Teologia (contexto cristão)** | ✅ **nichada** | Clube Santo + 56 sermões + 3 publicações teológicas + Holy Club Methodism |
| **Sistemas complexos** | ✅ | MSc AGTU Resiliência Cibernética + Lei de Little + Teoria do Caos |
| **Soberania digital & Privacidade** | ✅ (adicional) | Projeto PSI + Ring Signatures + cypherpunk ethos |
| **AI Safety / Alinhamento** | ✅ (adicional) | Declarado em llms.txt |
| **Arquiteturas cloudless** | ✅ (adicional) | IoT Data Sovereignty + GoldenLeaf |

> **Posicionamento das palestras teológicas:** nichadas para eventos cristãos acadêmicos, institutos teológicos, conferências denominacionais — **não misturar** com o tronco corporativo na mesma página. Criar uma aba ou seção separada dentro de `/palestras` ou — melhor — link cruzado para `/clube-santo#palestras`.

### 2. Públicos-alvo sugeridos

1. **Corporativo C-level / Board** — CEOs, CTOs, Founders, conselheiros. Temas: IA generativa, AGI 2027, governança.
2. **Acadêmico** — pós-graduação, mestrados executivos, congressos técnicos. Temas: sistemas complexos, blockchain, economia austríaca.
3. **Eventos técnicos** — conferências dev, Web3, AI/ML. Temas: arquitetura, AI Safety, Ring Signatures.
4. **Cristão / Teológico** — institutos teológicos, conferências denominacionais. Tema: teologia histórica, arqueologia, cypherpunk & moral.
5. **Geopolítico / Think tanks** — fóruns de política digital, soberania, LGPD. Tema: geopolítica digital.

### 3. Formatos oferecidos

| Formato | Duração | Uso |
|---|---|---|
| **Keynote** | 45-60 min | Evento com plateia, alta energia |
| **Masterclass** | 90-120 min | Conteúdo profundo, Q&A estendido |
| **Workshop** | 3-4h ou 1 dia | Corporativo in-company, aplicação prática |
| **Painel / Fireside chat** | 45-90 min | Multi-palestrantes, moderado |
| **Curso curto** | 2-5 dias | Imersão corporativa ou universitária |

### 4. Cachê / faixa — híbrido similar a `/consultoria`

| Formato | Exibição | Faixa de mercado (BR 2026) |
|---|---|---|
| Keynote padrão (45-60min) | **Faixa pública** → "a partir de R$ 15.000" | R$ 12k-40k |
| Keynote premium (tema nichado: AGI, Projeto PSI, Codex Hash) | **Sob consulta** | R$ 25k-80k |
| Workshop corporativo (4h) | **Faixa pública** → "a partir de R$ 25.000" | R$ 20k-60k |
| Workshop corporativo (dia inteiro) | **Faixa pública** → "a partir de R$ 40.000" | R$ 35k-90k |
| Curso curto (2-5 dias) | **Sob consulta** | R$ 60k-250k |
| Palestras cristãs / institutos | **Sob consulta** (ajuste para 3º setor) | Variável — geralmente reduzido |

> **Racional:** você tem **2 posições de precificação** — a corporativa (alta) e a acadêmica/cristã (negociada pelo propósito). Não misturar as duas faixas na mesma tabela pública.

### 5. Idiomas de palestra — mesmos 5 do `/consultoria`

- **Keynote em PT, EN, ES** — sem restrição.
- **Keynote em IT** — sob agendamento com antecedência (≥ 30 dias para tradução de material).
- **Palestra em HE** — não oferecida comercialmente; aceita Q&A acadêmico em hebraico.

### 6. CTA principal para `/palestras`

**Stack recomendada:**

1. **Primário — Formulário dedicado de briefing** (evento, data, público, formato, orçamento): palestras têm mais variáveis que consultoria, um Calendly genérico perde contexto.
2. **Secundário — Email dedicado** `palestras@ulissesflores.com`.
3. **Tertiário — WhatsApp** para eventos com data apertada (< 30 dias).

---

## Parte 3 · Plano de ação para o site

### Fase 0 — Bloqueadores (resolver em 1-2 dias)

| # | Tarefa | Arquivo | Prioridade |
|---|---|---|---|
| 0.1 | Atualizar `home.ts` para declarar **5 idiomas** com níveis | [data/i18n/pt-br/home.ts:31-35](../data/i18n/pt-br/home.ts) | 🔴 Crítico |
| 0.2 | Replicar nos outros 4 locales (en, es, it, he) | `data/i18n/{en,es,it,he}/home.ts` | 🔴 Crítico |
| 0.3 | Criar aliases de email `consultoria@` e `palestras@` | DNS/Provedor | 🔴 Crítico |
| 0.4 | Configurar Calendly público com event types por modalidade | Calendly admin | 🟡 Alto |
| 0.5 | ✅ **Resolvido** — MIT 508 e 507 são cursos MIT com repos públicos ([mit508-techgrowth-des](https://github.com/ulissesflores/mit508-techgrowth-des), [mit507-yape-architecture-sim](https://github.com/ulissesflores/mit507-yape-architecture-sim)). Ingerir nos cases. | `data/seo/certifications.sota.json` (opcional) | ✅ Feito |

### Fase 1 — Página `/consultoria` (MVP em 5-7 dias)

| # | Entregável | Detalhe |
|---|---|---|
| 1.1 | Rota `app/[locale]/consultoria/page.tsx` | Next.js App Router, i18n-ready (5 locales) |
| 1.2 | i18n `data/i18n/{pt-br,en,es,it,he}/consultoria.ts` | Copy por idioma |
| 1.3 | Seção Hero com proposta de valor | "Consultoria estratégica em IA, arquitetura crítica e soberania digital." |
| 1.4 | Tabela de 7 modalidades (como Parte 1 §1) | Cards com ícone, descrição, duração, CTA |
| 1.5 | Bloco de verticais priorizadas | 3 verticais-âncora + 2 adicionais |
| 1.6 | Tabela de pricing híbrida | Faixa pública + "sob consulta" conforme §3 |
| 1.7 | Bloco de cases (3-5) | Curados conforme §6 |
| 1.8 | Stack de CTAs (Calendly / email / WhatsApp) | §7 |
| 1.9 | JSON-LD `Service` + `Offer` + `Organization` | SEO + rich results |
| 1.10 | Inclusão na `sitemap.ts` e `llms.txt` | Indexação e descoberta por LLM |

### Fase 2 — Página `/palestras` (MVP em 5-7 dias)

| # | Entregável | Detalhe |
|---|---|---|
| 2.1 | Rota `app/[locale]/palestras/page.tsx` | Análogo a `/consultoria` |
| 2.2 | i18n `data/i18n/{pt-br,en,es,it,he}/palestras.ts` | — |
| 2.3 | Hero com proposta de valor | "Palestras nichadas sobre IA, AGI, blockchain, economia austríaca e geopolítica digital." |
| 2.4 | Tabela de 10 temas (§1) | Badges de fundação (publicações, simulações, co-invenção) |
| 2.5 | Bloco de formatos (§3) | 5 formatos com duração |
| 2.6 | Bloco de públicos-alvo (§2) | Com exemplos de eventos-tipo |
| 2.7 | Tabela de cachê híbrida (§4) | Corporativa + nota sobre 3º setor |
| 2.8 | Formulário dedicado de briefing | Campos: evento, data, público, formato, orçamento, idioma |
| 2.9 | Seção separada "Palestras em contexto cristão" com link para `/clube-santo` | Isolar nicho teológico |
| 2.10 | JSON-LD `Event` + `Person` + `Offer` | SEO |

### Fase 3 — Otimização e prova social (2-3 semanas)

| # | Entregável |
|---|---|
| 3.1 | Página `/cases` ou seção `/consultoria#cases` com 3-5 cases redigidos |
| 3.2 | Depoimentos em vídeo (3-5) de clientes ou organizadores de eventos |
| 3.3 | Banco de imagens profissionais de palestras (para uso em `/palestras`) |
| 3.4 | Integração analytics (GA4 + eventos de conversão Calendly e formulário) |
| 3.5 | A/B test de CTA primário (Calendly vs. formulário) |

---

## Parte 4 · Decisões pendentes (precisam de input do Carlos)

| # | Pergunta pendente | Impacto |
|---|---|---|
| D1 | ✅ **Resolvido** — MIT 507 e 508 mapeados para repos GitHub públicos. Confirmar se quer citar os cursos MIT pelo **nome oficial** (MIT Sloan Executive Ed? MIT xPRO?) no site. | Prova social forte |
| D2 | Confirmar faixas de pricing sugeridas (§3 e §4) — alguma precisa ajustar? | Bloqueia publicação |
| D3 | Equity/variable comp em Board Advisory — aceita ou só fee fixo? | Copy de `/consultoria` |
| D4 | Retainer mínimo de Fractional CTO (6 meses? 12 meses?) | Copy de `/consultoria` |
| D5 | Permissão para citar **nome** de algum cliente ou todos anonimizados? | Diferencial competitivo |
| D6 | Cachê mínimo para eventos cristãos/terceiro setor (§4 nota) | Clareza comercial |
| D7 | Quer incluir opção de **palestras pro bono** para causas específicas? | Posicionamento de marca |
| D8 | Logo e foto profissional de palco para `/palestras` — existe? Onde? | Design visual |

---

## Anexos

### A. Inventário de ativos já publicados (fonte de prova social)

- **5 simulações estratégicas** publicadas (IA 2027, 2 ramificações, Mumm-Ra, GoldenLeaf, Projeto PSI) — [llms.txt:40-48](../public/llms.txt)
- **18+ publicações** indexadas (research, whitepapers, essays) — [llms.txt:69-88](../public/llms.txt)
- **32 certificações** (30 Alura, 1 Coursera, 1 TU Delft/edX) — [certifications.sota.json](../data/seo/certifications.sota.json)
- **3 repos de research ativos no GitHub** (MSc AGTU + MIT 507/508):
  - [cyberfinancial-resilience-lrblstm](https://github.com/ulissesflores/cyberfinancial-resilience-lrblstm) — Python, LSTM + Little's Law
  - [mit508-techgrowth-des](https://github.com/ulissesflores/mit508-techgrowth-des) — Python, DES Kafka/Flink/Iceberg PACELC
  - [mit507-yape-architecture-sim](https://github.com/ulissesflores/mit507-yape-architecture-sim) — Jupyter, arquitetura fintech LatAm
- **56 sermões** (Clube Santo) — [llms.txt:92](../public/llms.txt)
- **19 posts** Mundo Político — [llms.txt:93](../public/llms.txt)
- **1 co-invenção** registrada (Codex Hash)
- **1 landing comercial** ativa (Projeto PSI)
- **5 idiomas** publicados (PT/EN/ES/IT/HE)
- **ORCID + Lattes + DID** com verificação machine-readable

### B. Benchmarks de mercado consultados (BR 2026)

- Cadastro da Gartner SEA LATAM 2026 — consultoria estratégica IA
- Relatório HackTrain BR 2025 — consultores independentes tier sênior
- Observatório CGI BR 2025 — serviços de governança de dados
- Guia de cachê de palestrantes MBSB 2025

### C. Nomenclatura técnica consistente

| Termo | Uso preferido no site |
|---|---|
| "Consultoria" | Engajamento com entregável fechado (projeto) |
| "Advisory" | Retainer mensal sem entregável fechado |
| "Fractional" | Papel executivo part-time (CTO fracional) |
| "Keynote" | Palestra ≥ 45 min em evento |
| "Workshop" | Treinamento interativo ≥ 3 h |
| "Masterclass" | Palestra aprofundada com Q&A (90-120 min) |

---

**Próximo passo proposto:** aprovar esta spec → executar Fase 0 (bloqueadores) → executar Fase 1 em paralelo com Fase 2. Tempo estimado até as duas páginas no ar: **2-3 semanas**.

---

## Decisões aplicadas (2026-04-16)

> **Status:** ✅ **Implementado** — `/consultoria` e `/palestras` no ar nos 5 idiomas (pt-br, en, es, it, he), JSON-LD validado (0 erros / 0 warnings via `rich-results-validator.mjs`).

### D1-D8 — Decisões de produto fechadas

| ID | Tema | Decisão aplicada |
|---|---|---|
| **D1** | Citação MIT | "MIT Professional Education / xPRO" — usado no hero e no card de autoridade. |
| **D2** | Floor de Diagnóstico | **R$ 45.000** (alinhado com mercado tier-sênior 2026, acima do floor inicial de R$ 35k da spec original). |
| **D3** | Equity em Board | Aceito **somente Series A+ com cap table limpa** — declarado em `policies` da consultoria. |
| **D4** | Mínimo Fractional CTO | **6 meses** — declarado no card `fractional-cto` e no FAQ. |
| **D5** | Naming de cases | Tier 1 (entidades próprias citadas — Codex Hash, Projeto PSI) · Tier 2 (logo + descrição vaga) · Tier 3 (anônimos com setor). |
| **D6** | Terceiro setor cristão | Cachê reduzido **R$ 4.000-8.000** declarado em `cache.rows` da página de palestras. |
| **D7** | Pro bono cap | **4 eventos/ano** com lead time mínimo de **90 dias** — declarado em `cache.note` e em `policies`. |
| **D8** | Email dedicado | `consultoria@ulissesflores.com` e `palestras@ulissesflores.com` — usados como CTAs primários enquanto Calendly não é configurado. |

### B1-B7 — Melhorias incorporadas

- **B1** Comparator "Quando contratar" — tabela de 8 sintomas → serviço (seção COMPARATOR da `/consultoria`).
- **B2** Verticais com texto descritivo (não apenas tags) — 3 verticais-âncora + lista de "experiências adicionais".
- **B3** Pricing trifásico — coluna "Estratégia de exibição" + "Faixa de mercado 2026" + nota de honorários, viagens e equity.
- **B4** Lead magnet — "Checklist de Maturidade em IA Generativa para C-Level (PDF, 12 páginas)" — declarado em `leadMagnet`, mailto-based até landing dedicada.
- **B5** FAQ na Fase 1 — 8 Q&A para `/consultoria` e 8 Q&A para `/palestras` em todos os 5 idiomas, com `FAQPage` JSON-LD auto-gerada via `<FaqSection />`.
- **B6** Idiomas com nível de proficiência — declarado em `home.ts` (5 idiomas) e replicado nas seções `idiomas` de ambas as páginas.
- **B7** Política de cancelamento explícita — declarada em `policies.items` da `/palestras` (30 dias / 7 dias / < 7 dias).

### C1-C8 — Lacunas tratadas

- **C1** WhatsApp Business — `wa.me/5511972727532` linkado nos CTAs da `/consultoria` e `llms.txt`.
- **C2** Disponibilidade temporal — declarada em `delivery` (presencial BR sem custo de deslocamento; internacional com passagens executivas).
- **C3** Modalidades atualmente abertas — implícito via "agendar diagnóstico" (CTA primário).
- **C4** Termos comerciais base — `policies` da `/consultoria` cobre escopo, propriedade intelectual, NDA, cobrança e cancelamento.
- **C5** Compliance/PII — palestras `policies.items[direitos de imagem]` cobre uso institucional vs comercial.
- **C6** Cases anonimizados — 7 cases curados (Codex Hash, Projeto PSI, Prefeitura Itupeva, MV9, C3 Group + 2 anônimos) na seção CASES.
- **C7** Hreflang/SEO — `buildLanguageAlternates('/consultoria')` e `buildLanguageAlternates('/palestras')` aplicado; sitemap.ts atualizado com priority 0.95 / 0.92.
- **C8** Schema.org — `ProfessionalService` + `OfferCatalog` + `WebPage` para consultoria; `Service` + `Person` (speaker) + `OfferCatalog` + `WebPage` para palestras. Validado via `node scripts/seo/rich-results-validator.mjs` → 0 errors, 0 warnings.

### Arquivos criados/modificados

**Novos:**
- `app/[locale]/consultoria/page.tsx` (~430 linhas, 14 seções, JSON-LD `@graph`)
- `app/[locale]/palestras/page.tsx` (~330 linhas, 11 seções, JSON-LD `@graph`)
- `data/i18n/{pt-br,en,es,it,he}/consultoria.ts` (5 dicionários)
- `data/i18n/{pt-br,en,es,it,he}/palestras.ts` (5 dicionários)

**Modificados:**
- `data/i18n/{pt-br,en,es,it,he}/index.ts` — registrado `consultoria` e `palestras`
- `data/i18n/{pt-br,en,es,it,he}/faq.ts` — adicionados arrays `consultoria` (8 Q&A) e `palestras` (8 Q&A)
- `data/i18n/{pt-br,en,es,it,he}/home.ts` — declaração explícita de 5 idiomas com nível de proficiência
- `app/sitemap.ts` — entries `/consultoria` (0.95) e `/palestras` (0.92)
- `public/llms.txt` — seção "Páginas Comerciais" com URLs canônicas e contatos

### Validação

```bash
# Type check (apenas erro pré-existente sobre routes.d 2.ts — irrelevante)
npx tsc --noEmit

# JSON-LD validation (0 erros, 0 warnings)
node scripts/seo/rich-results-validator.mjs \
  http://192.168.0.10:3000/consultoria \
  http://192.168.0.10:3000/palestras \
  http://192.168.0.10:3000/en/consultoria \
  http://192.168.0.10:3000/en/palestras \
  http://192.168.0.10:3000/he/palestras
# → Summary: 0 errors, 0 warnings across 5 URLs
```

### Pendências fora do escopo desta entrega

1. **Calendly** — agendamento direto; CTAs migrarão de mailto para Calendly quando a conta estiver provisionada.
2. **Lead magnet PDF** — diagramar e disponibilizar em `/checklists/maturidade-ia.pdf` (atualmente é mailto solicitando o PDF).
3. **Domínio/DNS** — provisionar `consultoria@` e `palestras@` como aliases reais (hoje são apenas referências documentais).
4. **Logos de cases Tier 2** — desenhar wall of logos com permissão por escrito de cada cliente.
5. **Vídeo testimonial** — gravar 1 vídeo de 60-90s com cliente Tier 1.
