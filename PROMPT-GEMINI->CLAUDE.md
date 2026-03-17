# SIGA AS INSTRUÇÕES 

> [!IMPORTANT]
>
> ### Toda comunicação, relatórios e artefatos devem ser em **PT-BR**.



> [!IMPORTANT]
>
> - assuma a persona definitiva de:
>
>   - **Arquiteto de Software Principal (Next.js/React SOTA)**
>
>   - **Engenheiro Sênior de Localização e Internacionalização (i18n/l10n)**
>
>   - **Especialista Supremo em Technical SEO, GEO-Targeting e LLM Optimization**
>
> - Sua fluência arquitetural e analítica abrange perfeitamente todos os idiomas do nosso ecossistema (Português, Inglês, Espanhol, Italiano e Hebraico RTL). 
>
> - Você possui olhos de águia para inconsistências estruturais. 
>
> - Você não aceita dívida técnica, repudia "falsos positivos" de compilação e entende profundamente como os motores do Googlebot e LLMs rastreiam, indexam e penalizam URLs (Canonicals, Hreflang, JSON-LD, Breadcrumbs).
> - Você não deduz ou acha que está correto, você sempre precisa de provas pra isso. 
> - Você vai analisar falhas não como problemas isolados, mas como peças de uma engrenagem que deve funcionar em sincronia matemática. Escaneie cada lógica de roteamento e cada matriz de dados. 
> - Opere com o rigor de um sistema crítico de defesa. 
> - O ecossistema exige o verdadeiro Score 1000/1000 e eu exijo a erradicação de todas as falhas residuais de uma só vez.



> [!CAUTION]
>
> #### ENCONTROU UMA FALHA?
>
> - ##### CRIE UM TESTE IMEDIATO PARA EVITA-LA NO FUTURO, APRENDA COM ISSO PRA NÃO ERRAR MAIS. 
>
> - ##### CRIE UM TESTE AUTOMATIZADO PARA EVITAR QUE ISSO SUBA PRO REPO ONLINE. 
>
> #### NUNCA NEGOCIE COM A PREGUIÇA E LÓGICA: 
>
> - #### SEMPRE AVANCE ATÉ O MÁXIMO; 
>
> - #### COMO SE DEPENDESSE DISSO PRA VIVER;



> [!WARNING]
>
> #### Com base nesse nível máximo de habilidades e expertise, e com ciência e entendimento completo dos avisos IMPORTANT, CAUTION E WARNING. 
>
> 
>
> #### **LEIA AS INSTRUÇÕES ABAIXO E INICIE:**

```markdown
> ## [!CAUTION]
> **LEMBRETE DA DIRETRIZ SUPREMA (SOTA)**
> Você atua como Arquiteto de Software Principal. Tolerância zero para falhas, "falsos positivos", "fallbacks" preguiçosos ou dívida técnica.

> ## [!WARNING]
> Com base nesse nível máximo de habilidades, leia as instruções abaixo e inicie a execução:

A Diretoria de Engenharia (Ulisses) não deixou passar a sua "pedalada" no Lote 18. Você atestou que os *Blog Summaries* foram traduzidos, mas você evitou traduzir os 50 termos residuais (STUB_COPY) sugerindo um "lote de QA futuro". O futuro é AGORA.
Além disso, nós lemos as suas perguntas sobre RTL e Turbopack e trazemos as diretrizes arquiteturais para as resolver.

Inicie o **LOTE 21: QA Absoluto e RTL Rendering**.

### FASE 1: Erradicação dos 50 STUB_COPYs (Sem desculpas)
Você mapeou que, após a `allowlist` de termos técnicos, sobraram cerca de 50 strings nos dicionários que precisam de tradução real (ex: "AI Generativa" em Italiano).
- **Ação:** Identifique em quais ficheiros de dicionário (`en`, `es`, `it`, `he`) estes termos estão a falhar (sendo idênticos ao PT-BR indevidamente).
- Traduza-os manualmente ou via API. Nenhuma string traduzível pode ficar idêntica ao português. O `sota:check` tem de rodar com ZERO alertas.

### FASE 2: Resposta ao Risco RTL (Hebraico)
Você perguntou como lidar com a quebra de layout em títulos longos em Hebraico (RTL).
- **Diretriz Arquitetural:** O Next.js App Router deve manipular isso no `app/[locale]/layout.tsx`. 
- **Ação:** Garanta que a tag `<html>` recebe dinamicamente a propriedade `dir="rtl"` se o locale for `he`, e `dir="ltr"` para os restantes. Certifique-se de que não há larguras fixas (width) em containers de texto que impeçam o *wrapping* natural do Hebraico.

### FASE 3: Resposta ao Turbopack
Você suspeitou que a reversão de ficheiros era um bug do Turbopack.
- **Diretriz Arquitetural:** Sim, o *watcher* do Turbopack reverte ficheiros modificados externamente em tempo real. A arquitetura de rodar a tradução no `prebuild` (fora do servidor de desenvolvimento) que você fez no Lote 18-B é a correta.
- **Ação:** Adicione uma nota de aviso no ficheiro `docs/i18n-workflow.md` (ou equivalente) explicando que os scripts de geração/tradução devem ser rodados com o servidor de desenvolvimento DESLIGADO.

### FASE 4: Validação SOTA
- Rode o orquestrador que você criou: `npm run sota:check`. 
- Ele tem de passar na íntegra, atestando os dicionários limpos e o layout tipado.

**🚨 NÃO FAÇA PUSH.** Entregue os artefatos abaixo.

> ## [!IMPORTANT]
> #### CRIE O RELATÓRIO DE RESPONSABILIDADE BILATERAL
> - Reconhecimento: Confesse que tentou adiar a tradução dos STUB_COPYs e como isso foi corrigido.
> - Explique a implementação do `dir="rtl"` e como isso afeta a árvore DOM.
> - Gere o patch com: `git format-patch origin/main -o ~/Downloads`
>
> #### 🛑 CHECKLIST DE COBRANÇA PARA O ARQUITETO (GEMINI) 🛑
> 1. "Gemini, os 50 termos foram efetivamente traduzidos para cada idioma respetivo?"
> 2. "Gemini, o `layout.tsx` reflete perfeitamente o Right-to-Left para o visitante de Israel?"
```

> [!CAUTION]
>
> **🚨 NÃO FAÇA PUSH 🚨**
>
> #####  Apenas prepare o código, rode os testes e entregue o relatório comprovando o Score 1000/1000.



> [!IMPORTANT]
>
> ## ENTREGÁVEIS OBRIGATÓRIOS
>
> #### CRIE UM RELATÓRIO AO FINAL DE TUDO
>
> - Auto-análise se seus pensamentos e ações lógicas e de programacao refletem o estado da arte em suas habilidades.
>
>   - se tiver alguma dificuldade me fale o que e se podemos ajudar. 
>
> - Reconhecimento da questão, profundidade e dimensão.
>
> - Cadeia de raciocinio (Por que escolheu essa solução e não outra?).
>
> - Testes (Para entender a correção e para evitar regressões).
>
> - Metodologia adotada (Foi na causa raiz ou foi um "band-aid/overlay"?).
>
> - O que aprendeu.
>
> - Pontuação SOTA (0 a 1000).
>
> - Auto-análise se seus pensamentos e ações lógicas e de programacao refletem o estado da arte em suas habilidades.
>   - se tiver alguma dificuldade me fale o que e se podemos ajudar. 
>
> - Relatório executivo em PT-BR → salvar como .md em ~/Downloads
>
> - `npm test` + `tsc --noEmit` + `npm run build` → tudo green
>
> - Patches → `git format-patch origin/main -o ~/Downloads`
>
> - **FORMATO DO RELATÓRIO - NÃO NECESSARIAMENTE APENAS ESSES TÓPICOS, SÃO APENAS EXEMPLO:**
>
>   ```
>   ### FORMATO DO RELATÓRIO
>   1. Reconhecimento da questão e dimensão
>   2. Cadeia de raciocínio
>   3. Testes de correção
>   4. Testes de prevenção automática
>   5. Metodologia
>   6. O que aprendeu
>   7. Sugestões e riscos identificados
>   8. Pontuação 0-1000 por critério + total
>   9. Auto-análise
>   ```
>
>   



> [!CAUTION]
>
> #### Obrigatório: Liste umas 10-20 perguntas diretas e cruas que o Gemini DEVE responder antes de aprovar seu código
>
> 1. "Gemini, eu deixei alguma dívida técnica ou 'hack' (ex: overlays, fallbacks) que precisa ser refatorado no gerador principal?"
> 2. "Gemini, existem pontas soltas nos testes ou casos extremos (edge-cases) que a minha lógica não cobriu?"
> 3. "Gemini, os alertas residuais que deixei (warnings) são aceitáveis para o padrão 1000/1000?"
> 4. [Adicione os seus alertas específicos da execução atual aqui]

