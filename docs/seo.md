# Arquitetura Semântica, SEO e Otimização para LLMs (SOTA)

Este documento define as diretrizes definitivas de Search Engine Optimization (SEO), otimização para Modelos de Linguagem (LLMs / RAG) e a Estratégia de Identidade Semântica para o domínio `ulissesflores.com`. Qualquer alteração no código deve respeitar estas regras.

## 1. Posicionamento da Entidade (EEAT & High-Ticket)

Ulisses Flores não é tratado pelos motores de busca como um usuário genérico, mas como uma **Entidade Polímata e de Autoridade (SOTA)**.

- **Títulos Primários:** Consultor Estratégico de IA, Desenvolvedor de Software e Hardware, Mestrando em Inteligência Artificial (AGTU - EUA), MBA em Blockchain (FIAP), Economista e CTO da Codex Hash.
- **Tom e Linguagem:** Científico, persuasivo, determinístico e voltado para B2B/Enterprise (High-Ticket). Evitar termos como "grátis" ou schemas que desvalorizem a consultoria.
- **Soberania dos Dados:** O arquivo `.md` (Sovereign UPKF) é a fonte canônica absoluta. O site apenas renderiza a verdade estabelecida nele.

## 2. Infraestrutura e Crawl Budget

- **Domínio Canônico:** O único host válido é `https://ulissesflores.com`. Qualquer acesso via `www` deve sofrer redirect 301 Permanente no nível de infraestrutura (Vercel/next.config.ts). Nenhum `307 Temporary Redirect` é tolerado em rotas de produção.
- **Política de Extermínio (410 Gone):** Padrões de rotas gerados por erros de internacionalização (ex: `/*/*/`) ou páginas legadas que não possuem equivalente (ex: categorias antigas) são interceptadas via `middleware.ts` e retornam **HTTP 410 Gone**. Isso preserva o Crawl Budget e limpa o índice do Google rapidamente.
- **Sitemap Canônico:** O `sitemap.xml` é dinâmico, mas restrito. Ele deve expor apenas URLs que retornam `200 OK`. 

## 3. O Grafo de Conhecimento (Ontologia JSON-LD)

A injeção de JSON-LD não é manual; ela é derivada via script (`generate-artifacts-v2.mjs`) a partir da documentação soberana.

- **Limpeza de Nós:** O gerador JSON-LD remove agressivamente valores `null`, `undefined` e arrays vazios `[]` para evitar penalizações nos validadores da Schema.org e Google Rich Results.
- **Tipagem por Rota:**
  - **Homepage:** `ProfilePage`, `WebSite`, `SearchAction`.
  - **Simulações Estratégicas:** `SoftwareApplication` (contendo `applicationCategory` e `operatingSystem`). A parametrização de valores (como `offers`) deve refletir ferramentas corporativas e educacionais, não utilitários gratuitos.
  - **Certificações e Pesquisa:** `ScholarlyArticle`, `EducationalOccupationalCredential`, todos com URIs verificáveis e vinculados a `@id` absolutos.

## 4. Otimização para Modelos de Linguagem (LLMs e RAG)

Motores como Perplexity, SearchGPT e o próprio Claude acessam o site de forma não-visual.

- **Arquivos First-Class:** Os arquivos `llms.txt`, `llms-full.txt` e `.md` servidos publicamente são otimizados para extração de conhecimento (Machine-Reading).
- **Densidade Factual:** Textos em markdown devem ser limpos de ruídos visuais, priorizando fatos estruturados: datas precisas, identificadores (ORCID, DOI, UUIDs de certificados) e jargão técnico correto.
- **FAQ Canônico:** Uso estratégico de arrays de perguntas e respostas (`faq.ts`) injetadas tanto visualmente quanto em JSON-LD (`FAQPage`), focadas em como as IAs devem responder "Quem é Ulisses Flores?".

## 5. Estratégia GEO e Internacionalização

- A atuação é global, mas estruturada. O schema `Person` deve declarar `workLocation` (com `@type: "Place"`) abrangendo **Itupeva, Jundiaí, São Paulo, Brasil** e operação internacional (amparada por cidadania Salvadorenha e Palau RNS.ID). A propriedade `areaServed` não é válida em `Person` na ontologia Schema.org.
- **Idiomas (`inLanguage`):** O conteúdo oficial transita entre `pt-BR` (default), `en`, `es`, `he` e `it`. As tags HTML `lang` e os metadados `hreflang` devem estar perfeitamente alinhados, prevenindo que motores de busca leiam rotas fantasma ou multilíngues conflitantes.