---
title: "Ulisses Flores — Sovereign UPKF (Universal Personal Knowledge Framework)"
version: "3.3"
generated_at: "2026-02-21"
schema_target: "Schema.org JSON-LD via deterministic derivation"
languages: [pt-BR, en, es, he, it]
source_files:
  - ulissesflores-sovereign-graph-claude.jsonld (v3, 217 nodes)
  - ulissesflores-sovereign-graph-gpt.jsonld (v3, 215 nodes)
  - aboutme.md (professional taxonomy & skills)
  - scientificproductions.md (40 ORCID works)
  - auditoriagenealogica.md (forensic genealogical audit v1.0)
  - ulisses-flores-upkf_v1.2.md (original UPKF)
derivation_rule: >
  This .md is the CANONICAL SOURCE OF TRUTH. Any JSON-LD must be derived
  deterministically from the sections below. Never edit JSON-LD directly;
  always edit this file first. The generator script reads this file and
  outputs conforming JSON-LD per W3C TR/json-ld (2024-07-24 Recommendation).
  JSON-LD serialization rules (e.g., @context, @graph, @id, @type,
  @value/@language arrays) belong EXCLUSIVELY in the generator, not here.
  This file defines WHAT; the generator defines HOW.

# ---------- GOVERNANCE & SECURITY POLICIES ----------

security_policy:
  - "No secrets (passwords, seeds, private keys, API tokens) stored."
  - "No standalone hash manifests stored (per user request). Cryptographic digests
    computed transiently during JWS signing are permitted — they are never persisted in the UPKF."
  - "Ultra-sensitive documents (e.g., tax returns) indexed only, never transcribed."
  - "Private identifiers masked; full values held offline."

data_classification_policy: >
  Every field or section carries one of three classification levels:
    PUBLIC     — Indexable by crawlers. Included in public.jsonld.
    PRIVATE    — Excluded from public.jsonld. Included in private.jsonld only.
    RESTRICTED — Never serialized. Reference-only for offline use.
  DEFAULT BEHAVIOR: Fields are PUBLIC unless explicitly marked otherwise,
  EXCEPT for the following field types which are PRIVATE by default
  and require explicit PUBLIC_OVERRIDE to be published:
    - email (all types)
    - phone / telephone
    - address / homeLocation / postalAddress
    - birth_date (day-level granularity; birth year is PUBLIC)
    - tax identifiers of individuals (CPF)
    - genealogical data (Heritage section)
  The generator MUST enforce these defaults even if a field lacks
  an explicit classification comment.

public_override_registry:
  - section: "Forensic Heritage & Genealogical Audit"
    override: "PUBLIC_OVERRIDE: HERITAGE_PUBLIC"
    scope: "Publish only structured lineage summary fields in public.jsonld by explicit subject decision."
    approved_at: "2026-02-28"

pending_and_undated_policy: >
  PENDING  = Data exists somewhere but has not yet been collected. Will be filled.
  UNDATED  = No source has this data. It may never be filled.
  Handling varies by build mode (see contracts below):
    public  → OMIT both (never expose incomplete data to crawlers).
    private → Serialize PENDING as `"PENDING"` string (aids manual completion); OMIT UNDATED.
    full    → Serialize both markers verbatim (backup/audit record).

build_modes:
  - name: public
    output: public.jsonld
    description: "Deploy to site. Strips all PRIVATE/RESTRICTED fields."
    contract:
      exclude_types: [email, phone, address, genealogy, tax_id_individual]
      exclude_sections: ["Forensic Heritage", "Contact Points", "Addresses"]
      exclude_fields_containing: ["RESTRICTED", "PRIVATE"]
      pending_rule: "Omit any field with value PENDING or UNDATED."
  - name: private
    output: private.jsonld
    description: "Internal use. Includes PUBLIC + PRIVATE. Strips RESTRICTED."
    contract:
      exclude_types: [RESTRICTED]
      pending_rule: "Serialize PENDING as literal string \"PENDING\"; omit UNDATED."
  - name: full
    output: full.jsonld
    description: "All fields. Never deploy publicly. For backup/audit only."
    contract:
      exclude_types: []
      pending_rule: "Serialize all fields including PENDING/UNDATED markers."

integrity_policy: >
  The generator SHOULD produce a detached JSON Web Signature (JWS, RFC 7515)
  over the canonical JSON-LD output using the subject's PGP key
  (fingerprint: af30 44aa df8b d6cc 16a9 5750 d4e0 4e74 2ac8 f678).
  The signature file (e.g., public.jsonld.jws) is published alongside
  the JSON-LD but is NOT part of the UPKF source. The UPKF stores no
  secrets — only the fingerprint reference. Verification flow:
    1. Fetch public.jsonld + public.jsonld.jws from ulissesflores.com
    2. Fetch PGP public key from keybase.io/ul1ss3sfl0r3s
    3. Verify JWS against the JSON-LD payload
  This provides non-repudiation without storing private keys in the repo.
---


# Core Identity & Heritage

## Canonical Identity
<!-- classification: PUBLIC -->

- canonical_legal_name: Carlos Ulisses Flores
- preferred_name: Ulisses
- alternate_names: ["Carlos Ulisses Flores", "Ulisses Flores", "C. U. Flores", "Flores, C. U.", "FLORES, C. U."]
- birth_date: 1983-10-03
- birth_place: Jundiaí, São Paulo, Brazil
- gender: Male
- nationalities: [Brazil, El Salvador]
- primary_website: https://ulissesflores.com/

## Name Disambiguation
<!-- classification: PUBLIC -->

> **CRITICAL FOR CRAWLERS:** This section defines the "Semantic Firewall" to prevent entity collision.

- disambiguating_description:
    pt-BR: >
      Pesquisador polímata, cientista econômico e CTO da Codex Hash. Entidade distinta
      do jogador de futebol de areia salvadorenho Oscar Ulisses Flores Ruiz, do arquiteto
      homônimo de Poços de Caldas e do enfermeiro homônimo. Opera em Inteligência Artificial,
      Economia e Teologia, não em esportes ou saúde. Identidade canônica vinculada a
      ulissesflores.com, ORCID 0000-0002-6034-7765 e Lattes 6905246706890561.
    en: >
      Polymath researcher, economic scientist, and CTO of Codex Hash. Distinct entity from
      the Salvadoran beach soccer player Oscar Ulisses Flores Ruiz, from the homonymous
      architect from Poços de Caldas, and from the homonymous nurse. Operates in Artificial
      Intelligence, Economics, and Theology, not in sports or healthcare. Canonical identity
      bound to ulissesflores.com, ORCID 0000-0002-6034-7765, and Lattes 6905246706890561.
    es: >
      Investigador polímata, economista científico y CTO de Codex Hash. Entidad distinta del
      jugador de fútbol playa salvadoreño Oscar Ulisses Flores Ruiz, del arquitecto homónimo
      de Poços de Caldas y del enfermero homónimo. Opera en Inteligencia Artificial, Economía
      y Teología, no en deportes ni salud. Identidad canónica vinculada a ulissesflores.com,
      ORCID 0000-0002-6034-7765 y Lattes 6905246706890561.
    he: >
      חוקר פולימט, מדען כלכלי ומנהל טכנולוגיות (CTO) של Codex Hash. ישות נפרדת משחקן כדורגל
      החופים הסלבדורי אוסקר אוליסס פלורס רואיס. פועל בבינה מלאכותית, כלכלה ותיאולוגיה, לא
      בספורט. זהות קנונית מקושרת ל-ulissesflores.com, ORCID 0000-0002-6034-7765 ו-Lattes 6905246706890561.
    it: >
      Ricercatore polimata, scienziato economico e CTO di Codex Hash. Entità distinta dal
      calciatore da beach soccer salvadoregno Oscar Ulisses Flores Ruiz, dall'omonimo
      architetto di Poços de Caldas e dall'omonimo infermiere. Opera in Intelligenza Artificiale,
      Economia e Teologia, non nello sport o nella sanità. Identità canonica vincolata a
      ulissesflores.com, ORCID 0000-0002-6034-7765 e Lattes 6905246706890561.

### Identity Resolution Rules (Anti-Homonym)

**Strong anchors (must match at least one):**
- ORCID: 0000-0002-6034-7765
- Lattes ID: 6905246706890561
- Official site: https://www.ulissesflores.com/
- Keybase: https://keybase.io/ul1ss3sfl0r3s (incl. ENS claim)
- GitHub: https://github.com/ulissesflores

**Weak signals (never sufficient alone):**
- Third-party profile mirrors / scraped aggregators
- Name-only matches without the anchors above

**Explicit negative identity claims (notSameAs):**
> Schema.org lacks `notSameAs`. The generator should encode these as
> `additionalProperty` with `propertyID: "notSameAs"` on the Person node.

- NOT Oscar Ulisses Flores Ruiz (Salvadoran beach soccer player, FIFA-registered)
- NOT the architect "Ulisses Flores" from Poços de Caldas, MG (CAU/MG registry)
- NOT the nurse "Ulisses Flores" in Brazilian healthcare registries (COREN)
- NOT any entity lacking at least one strong anchor listed above

## Description (Multilingual)
<!-- classification: PUBLIC -->

- description:
    pt-BR: >
      Cientista econômico, analista de sistemas e pesquisador polímata, atuando na interseção
      entre sistemas complexos, resiliência ciberfinanceira, economia austríaca, sistemas
      distribuídos e teologia histórica. Co-fundador e CTO da Codex Hash Ltda.
    en: >
      Economic scientist, systems analyst, and polymath researcher operating at the intersection
      of complex adaptive systems, cyber-financial resilience, Austrian economics, distributed
      systems, and historical theology. Co-founder and CTO of Codex Hash Ltda.
    es: >
      Científico económico, analista de sistemas e investigador polímata, que opera en la
      intersección de sistemas complejos, resiliencia ciberfinanciera, economía austríaca,
      sistemas distribuidos y teología histórica. Cofundador y CTO de Codex Hash Ltda.
    he: >
      מדען כלכלי, מנתח מערכות וחוקר פולימט, הפועל בצומת שבין מערכות מורכבות, חוסן סייבר-פיננסי,
      כלכלה אוסטרית, מערכות מבוזרות ותיאולוגיה היסטורית. מייסד שותף ומנהל טכנולוגיות של Codex Hash Ltda.
    it: >
      Scienziato economico, analista di sistemi e ricercatore polimata, operante all'intersezione
      tra sistemi complessi, resilienza cyber-finanziaria, economia austríaca, sistemi distribuiti
      e teologia storica. Co-fondatore e CTO di Codex Hash Ltda.

## Narrative Metaphor (Odysseus)
<!-- classification: PUBLIC -->

- metaphor:
    pt-BR: >
      Ulisses é também o nome culturalmente associado a Odisseu (Odysseus), protagonista da
      Odisseia atribuída a Homero: o arquétipo do estrategista que atravessa ambientes incertos
      com método, inteligência e persistência. Aqui isso é usado apenas como metáfora, para
      explicar um estilo de trabalho: navegar sistemas complexos (cripto, IA, identidade,
      economia), reduzir ambiguidade e construir confiança por engenharia e evidência.
    en: >
      Ulisses is also the name culturally associated with Odysseus, protagonist of Homer's
      Odyssey: the archetype of the strategist who navigates uncertain environments with method,
      intelligence, and persistence. Here this is used only as a metaphor to explain a working
      style: navigating complex systems (crypto, AI, identity, economics), reducing ambiguity,
      and building trust through engineering and evidence.
    es: >
      Ulisses es también el nombre culturalmente asociado a Odiseo (Odysseus), protagonista de
      la Odisea atribuida a Homero: el arquetipo del estratega que navega entornos inciertos con
      método, inteligencia y persistencia. Aquí se usa solo como metáfora para explicar un estilo
      de trabajo: navegar sistemas complejos (cripto, IA, identidad, economía), reducir ambigüedad
      y construir confianza mediante ingeniería y evidencia.
    he: >
      אוליסס הוא גם השם התרבותי של אודיסאוס, גיבור האודיסיאה: אב-הטיפוס של האסטרטג שמנווט
      בסביבות של אי-ודאות בשיטתיות, אינטליגנציה והתמדה. כאן משמש רק כמטאפורה לסגנון עבודה:
      ניווט במערכות מורכבות, הפחתת עמימות ובניית אמון באמצעות הנדסה וראיות.
    it: >
      Ulisses è anche il nome culturalmente associato a Odisseo (Odysseus), protagonista
      dell'Odissea attribuita a Omero: l'archetipo dello stratega che naviga ambienti incerti
      con metodo, intelligenza e perseveranza. Qui è usato solo come metafora per spiegare uno
      stile di lavoro: navigare sistemi complessi (cripto, IA, identità, economia), ridurre
      l'ambiguità e costruire fiducia attraverso ingegneria e prove.

## Motto (Palau Pledge)
<!-- classification: PUBLIC -->

- motto:
    pt-BR: >
      Prometo caminhar com leveza, agir com gentileza e explorar com consciência. Não tomarei
      o que não me for dado. Não causarei dano ao que não me fere. As únicas pegadas que
      deixarei são aquelas que serão lavadas pelas águas.
    en: >
      I vow to tread lightly, act kindly and explore mindfully. I shall not take what is not
      given. I shall not harm what does not harm me. The only footprints I shall leave are
      those that will be washed away.
    es: >
      Prometo caminar con ligereza, actuar con amabilidad y explorar con conciencia. No tomaré
      lo que no me sea dado. No causaré daño a lo que no me hiere. Las únicas huellas que
      dejaré son aquellas que serán borradas por las aguas.
    he: >
      אני מתחייב לצעוד בקלילות, לפעול בחסד ולחקור במודעות. לא אקח מה שלא ניתן לי. לא אפגע
      במה שאינו פוגע בי. העקבות היחידות שאשאיר הן אלו שיישטפו על ידי המים.
    it: >
      Prometto di camminare con leggerezza, agire con gentilezza ed esplorare con consapevolezza.
      Non prenderò ciò che non mi sarà dato. Non causerò danno a ciò che non mi ferisce. Le
      uniche impronte che lascerò sono quelle che saranno lavate via dalle acque.
- motto_source: "Palau Pledge (adapted)"
- motto_references:
    - https://www.nationalgeographic.com/travel/article/passport-stamp-ecotourism-pledge
    - https://news.trust.org/item/20180720090326-gzoq8


## Forensic Heritage & Genealogical Audit
<!-- classification: PRIVATE; PUBLIC_OVERRIDE: HERITAGE_PUBLIC -->

> Source: `auditoriagenealogica.md` v1.0 (compiled 2026-02-03). This section contains
> forensic-grade genealogical research for citizenship and identity purposes.
> CLASSIFICATION: PRIVATE with explicit public override for structured lineage summary in public.jsonld.

### Paternal Lineage — Flores / Benavides / Zapata (El Salvador — Sephardic)

- cluster: A — PATERNA (El Salvador)
- key_surnames: Flores, Benavides, Zapata
- ancestors: Juan Felix Flores & Maria Gregoria Benavides
- region: San Miguel, El Salvador
- probability_score: HIGH
- thesis_pt-BR: >
    A região de San Miguel, El Salvador, serviu como "fronteira segura" para famílias fugindo
    da Inquisição do México (Nova Espanha), especialmente após a "Grande Conspiração" de 1642
    contra judeus portugueses. A fusão de três sobrenomes de judaizantes em área isolada indica
    casamento intracomunitário para preservação de sangue. "Benavides" é historicamente ligado
    à linhagem "Ben David". "Zapata" e "Benavides" são nomes recorrentes nos tribunais do México.
- next_step: Buscar registros de dispensa de consanguinidade nos arquivos paroquiais de San Miguel.

### Maternal Lineage — Rodrigues Galvão / Ribeiro / Mendonça (Brasil — Sephardic)

- cluster: B — MATERNA (Brasil — Sefardita)
- key_surnames: Rodrigues Galvão, Ribeiro, Mendonça
- ancestors: Pedro Dionisio Ribeiro & Divina Mendonça
- region: Minas Gerais → Jundiaí, São Paulo
- probability_score: HIGH
- thesis_pt-BR: >
    Migração clássica de Cristãos-Novos saindo de Minas Gerais para o "Oeste Paulista" (Jundiaí)
    no séc. XIX. O uso do nome "Antônio Tobias" (bisavô) é um marcador raro de cripto-judaísmo,
    referenciando o Livro de Tobias (fé no exílio). Conexão direta com o núcleo "Bnei Anusim"
    do Seridó/MG. Marcador "Galvão": sobrenome de alta densidade sefardita no Seridó e Minas.
- next_step: Localizar certidão de batismo ou óbito de Antônio Tobias Mendonça em Minas Gerais.

### Maternal Lineage — Di Bartolomeo (Brasil — Italiana)

- cluster: C — MATERNA (Brasil — Italiana)
- ancestor: Elizabete Bartolomeu (Matriarca Imigrante)
- probable_original_surname: Di Bartolomeo (Campania/Nápoles) ou Bartolommei (Vêneto/Toscana)
- immigration_period: 1880–1910 (Porto de Santos, ciclo do café)
- probability_score: N/A (Origem Católica Europeia)
- thesis_pt-BR: >
    "Bartolomeu" é a aportuguesação cartorial. O original "Di Bartolomeo" aponta para a região
    da Campania (Nápoles). É a chave para a Cidadania Italiana (Jure Sanguinis).
- next_step: Busca no Museu da Imigração de SP por "Bartolomeo", "Bartolommei" ou "Di Bartolomeo" (1888–1910).

### Strategic Synthesis

- sephardic_identity: Dupla convergência (Paterna + Materna) de alta probabilidade.
- italian_identity: Reconstrução do sobrenome Bartolomeu → Di Bartolomeo.


---


# Professional Taxonomy
<!-- classification: PUBLIC -->

## Current Occupations

### 1. Co-founder, CTO and Chief Researcher — Codex Hash Ltda
- schema_id: https://ulissesflores.com/#occupation-codexhash-cto
- schema_type: Occupation
- organization_ref: https://ulissesflores.com/#codexhash
- location: Brazil (remote/global)
- applied_skills: [Python, Distributed systems, Security engineering, Quantitative finance, Blockchain, IoT/Embedded systems]

### 2. Economic Scientist and Systems Analyst
- schema_id: https://ulissesflores.com/#occupation-economic-scientist
- schema_type: Occupation
- location: Brazil
- applied_skills: [Econometrics, Austrian economics, Complex systems, Data science]

### 3. Researcher in Historical Theology and Textual Criticism
- schema_id: https://ulissesflores.com/#occupation-theology-researcher
- schema_type: Occupation
- location: Brazil
- applied_skills: [Textual criticism, Historiography, Archaeology, Hermeneutics]

## Professional Experience (Chronological)

### Codex Hash Ltda — Co-founder, CTO & Chief Researcher
- schema_id: https://ulissesflores.com/#role-codexhash
- period: 2020–present (brand since 2020; CNPJ registered 2024-01-16)
- location: São Paulo, SP, Brazil
- type: Entrepreneurship / R&D
- description:
    pt-BR: >
      Laboratório de P&D (deep tech) focado em finanças quantitativas/Web3, engenharia de
      hardware IoT (arquiteturas cloudless/edge) e IA aplicada para resiliência ciberfinanceira.
      Desenvolvimento de pipelines científicos (LR-BLSTM), algo-trading, privacidade financeira
      (ring signatures), e engenharia de identidade soberana.
    en: >
      R&D deep-tech lab focused on quantitative finance/Web3, IoT hardware engineering
      (cloudless/edge architectures), and applied AI for cyber-financial resilience. Development
      of scientific pipelines (LR-BLSTM), algo-trading, financial privacy (ring signatures),
      and sovereign identity engineering.
- applied_skills: [Python, LSTM, Bayesian inference, Solidity, Monero, Ring signatures, Edge computing, Zero Trust, Docker, CI/CD, SimPy, Apache-2.0]

### Prefeitura de Itupeva — Analista de Planejamento Estratégico Financeiro
- schema_id: https://ulissesflores.com/#role-prefeitura-itupeva
- period: Mar 2020 – Dec 2023
- location: Itupeva, SP, Brazil (on-site)
- type: Government / Public Sector
- organization_ref: https://ulissesflores.com/#prefeitura-itupeva
- description:
    pt-BR: >
      Aplicação de conhecimentos de matemática, lógica e finanças para o desenvolvimento
      socioeconômico. Responsável pelo planejamento estratégico, orçamento e gestão financeira.
      Coleta e análise de dados para fundamentar ações.
- applied_skills: [Gestão de Pessoas, Docência, Political Science, Political Communication, Political Consulting, Political Philosophy, International Relations, Comunicação Interna]

### C3 Group Administração De Negócios — Sócio Proprietário
- schema_id: https://ulissesflores.com/#role-c3group
- period: Jan 2016 – Dec 2020
- location: Curitiba, Paraná, Brazil (hybrid)
- type: Entrepreneurship / Consulting
- description:
    pt-BR: >
      Gestão de negócios e assessoria tecnológica. Pesquisa e desenvolvimento de negócios,
      apoiando empresas na implementação de soluções estratégicas e inovadoras.
- applied_skills: [Scrum, Agile Project Management, Google Ads, Google Analytics, Google Webmaster Tools, Business Analysis, Desenvolvedor WEB]

### Econofísica Consultoria — Sócio Proprietário
- schema_id: https://ulissesflores.com/#role-econofisica
- period: 2015
- location: Brazil
- type: Entrepreneurship / Consulting
- description:
    pt-BR: Consultoria focada em estratégia, econometria e auditoria de algoritmos de alta sensibilidade.

### MV9 Web e Sistemas — Sócio Proprietário
- schema_id: https://ulissesflores.com/#role-mv9
- period: Jan 2012 – Dec 2016
- location: Curitiba e Região, Brasil (hybrid)
- type: Entrepreneurship / Software Development
- description:
    pt-BR: >
      Desenvolvimento de soluções web inovadoras. Parceria com o Google para criação de produto.
      Criação do ERP-SIS para gestão financeira e sistema de cálculo de aposentadoria.
- applied_skills: [Software, API Development, Node.js, Data Structures, Algorithms, CI/CD, Visual Basic, Ethereum, Python, ESP8266, SQL, Docker, Criptografia, API REST]

### JUNIFER FERRAGENS — Analista Financeiro
- schema_id: https://ulissesflores.com/#role-junifer
- period: Dec 2009 – Dec 2012
- location: Itupeva, São Paulo, Brazil
- type: Corporate / Financial Analysis
- description:
    pt-BR: >
      Estruturação e desenvolvimento do departamento gerencial/operacional. Implantação de
      processos administrativos e desenvolvimento de sistemas em VBA e PHP para controle
      financeiro. Criação de software de gestão integrada.
- applied_skills: [Software, Gestão de Contratos, ERP Software, ERP Implementations, Business Intelligence (BI)]

### Grupo Wizard — Professor e Coordenador
- schema_id: https://ulissesflores.com/#role-wizard
- period: 2005–2009
- location: Brazil
- type: Education

### Grupo Skam Empilhadeiras Elétricas — Coordenador Técnico
- schema_id: https://ulissesflores.com/#role-skam
- period: 2008–2009
- location: Brazil
- type: Technical Coordination

### Movimater Movimentação — Diretor Financeiro
- schema_id: https://ulissesflores.com/#role-movimater
- period: Jan 2007 – Dec 2009
- location: Jundiaí, São Paulo, Brazil (on-site)
- type: Corporate / Finance
- description:
    pt-BR: >
      Re-implantação da rotina financeira, custos, controle de compras e metas. Implantação
      de controle fiscal, contas a pagar/receber e plano de contas. Análise financeira mensal
      e projeções.
- applied_skills: [Management, Operations Management, Structured Finance, Project Finance]

### Bemarco Industrial — Financeiro / Compras
- schema_id: https://ulissesflores.com/#role-bemarco
- period: 1998–2005
- location: Brazil
- type: Corporate / Finance

### Mercado de Ações e Moedas Internacionais — Investidor
- schema_id: https://ulissesflores.com/#role-trader
- period: 2002–2008
- type: Personal / Trading
- description:
    pt-BR: Investimento ativo em ações e câmbio internacional.

## Flagship Project: Silk Road Vault (FIAP)
<!-- classification: PUBLIC — HIGH ONTOLOGICAL RELEVANCE -->

> **Ontological Relevance: EXTREMELY HIGH.** Developed during the MBA in Blockchain at FIAP.
> Achieved **Top 10** position. This project is a career milestone demonstrating cutting-edge
> engineering capability in competitive academic innovation environments.

- project_name: Silk Road Vault
- schema_id: https://ulissesflores.com/#project-silk-road-vault
- institution_ref: https://ulissesflores.com/#fiap
- achievement: Top 10 position
- domain: Blockchain / Web3 / Security
- description:
    pt-BR: >
      Projeto desenvolvido durante o MBA em Blockchain na FIAP, alcançando posição Top 10.
      Representa a aplicação prática de competências em criptografia, smart contracts,
      arquitetura de sistemas distribuídos e segurança.
    en: >
      Project developed during the MBA in Blockchain at FIAP, achieving Top 10 position.
      Represents practical application of cryptography, smart contracts, distributed systems
      architecture, and security engineering competencies.
    es: >
      Proyecto desarrollado durante el MBA en Blockchain en FIAP, alcanzando posición Top 10.
      Representa la aplicación práctica de competencias en criptografía, contratos inteligentes,
      arquitectura de sistemas distribuidos y seguridad.


---


# Academic Background
<!-- classification: PUBLIC -->

## Formal Degrees

### M.Sc. in Artificial Intelligence (in progress)
- schema_id: https://ulissesflores.com/#cred-msc-ai
- schema_type: EducationalOccupationalCredential
- institution: American Global Tech University (AGTU)
- institution_ref: https://ulissesflores.com/#agtu
- institution_url: https://www.agtu.us/
- period: Apr 2025 – Apr 2027
- credentialStatus: InProgress
- credentialCategory: Master's program
- thesis_title:
    pt-BR: "Resiliência em Sistemas Complexos: Uma Abordagem Híbrida via Inteligência Artificial e Economia Praxeológica"
    en: "Resilience in Complex Systems: A Hybrid Approach via Artificial Intelligence and Praxeological Economics"
- thesis_topics: [Artificial Intelligence, Cyber-financial resilience, Little's Law, LSTM neural networks, Complex adaptive systems]
- **NOTE:** credentialStatus MUST be "InProgress" — representing as completed violates trust signals.

### MBA — Blockchain Development & Technologies
- schema_id: https://ulissesflores.com/#cred-mba-blockchain
- schema_type: EducationalOccupationalCredential
- institution: FIAP
- institution_ref: https://ulissesflores.com/#fiap
- institution_url: https://www.fiap.com.br/
- institution_sameAs: https://www.wikidata.org/entity/Q10269779
- period: May 2018 – May 2020
- credentialStatus: Completed
- credentialCategory: MBA
- skills_acquired: [Competências Interpessoais, Habilidades Analíticas, Node.js, Docker, Algorithms, SQL, Software, Economic Analysis, API REST, Ethereum, Docência, Visual Basic, API Development, Data Structures, Criptografia]
- flagship_project_ref: https://ulissesflores.com/#project-silk-road-vault

### Bacharelado em Economia (B.A. in Economics)
- schema_id: https://ulissesflores.com/#cred-bachelor-economics
- schema_type: EducationalOccupationalCredential
- institution: Centro Universitário Padre Anchieta
- institution_ref: https://ulissesflores.com/#padre-anchieta
- institution_url: https://www.anchieta.br/
- period: 2002 – 2017
- credentialStatus: Completed
- credentialCategory: Bachelor's degree
- topics: [Economics, Chaos theory, Austrian School, Nonlinear systems]

### Análise e Desenvolvimento de Sistemas (ADS)
- schema_id: https://ulissesflores.com/#cred-ads
- schema_type: EducationalOccupationalCredential
- institution: Universidade Paulista (UNIP)
- institution_ref: https://ulissesflores.com/#unip
- institution_url: https://www.unip.br/
- institution_sameAs: https://www.wikidata.org/entity/Q2301653
- period: Jan 2018 – Jan 2020
- credentialStatus: Completed
- credentialCategory: Higher education
- topics: [Software engineering, Systems analysis, Information systems]

### Estágio — Ciências Políticas e Leis
- schema_id: https://ulissesflores.com/#cred-cefor
- schema_type: EducationalOccupationalCredential
- institution: CEFOR — Congresso Nacional — Câmara dos Deputados
- institution_ref: https://ulissesflores.com/#cefor
- institution_url: https://www2.camara.leg.br/a-camara/programas-institucionais/educacao-para-a-cidadania
- credentialStatus: Completed
- credentialCategory: Internship
- skills_acquired: [Administrative Law, Political Consulting]

## International Extensions

### History and Philosophy of Science and Technology
- schema_id: https://ulissesflores.com/#cred-edinburgh-extension
- schema_type: EducationalOccupationalCredential
- institution: The University of Edinburgh
- institution_ref: https://ulissesflores.com/#edinburgh
- institution_url: https://www.ed.ac.uk/
- institution_sameAs: https://www.wikidata.org/entity/Q160302
- period: Jan 2016 – Apr 2016
- credentialCategory: International extension
- skills_acquired: [Science, Philosophy, Philosophy of Religion, Philosophy of Science, Political Philosophy]

### Learning Sciences
- schema_id: https://ulissesflores.com/#cred-ucsd-extension
- schema_type: EducationalOccupationalCredential
- institution: California College San Diego
- institution_ref: https://ulissesflores.com/#ucsd
- institution_url: https://www.cc-sd.edu/
- period: Jan 2015 – Apr 2015
- credentialCategory: International extension
- skills_acquired: [Teaching, Memorization, Photographic Memory, Memory Management]

## Licenses & Certifications
<!-- classification: PUBLIC -->

### edX
- cert_name: AI in Practice: Preparing for AI
- cert_id: 2f268caff8444004be14eedb309b1d9c
- verify_url: https://courses.edx.org/certificates/2f268caff8444004be14eedb309b1d9c
- issuer_ref: https://ulissesflores.com/#edx

### Coursera
- cert_name: Philosophy, Science and Religion: Science and Philosophy
- cert_id: MYG9K9GQRP6W
- verify_url: https://www.coursera.org/account/accomplishments/verify/MYG9K9GQRP6W
- issuer_ref: https://ulissesflores.com/#coursera

### Alura (32 certifications)
- issuer_ref: https://ulissesflores.com/#alura
- verify_base_url: https://cursos.alura.com.br/certificate/

> **SOTA field mapping:** `verify_url` maps to `url` on `EducationalOccupationalCredential`
> in Schema.org JSON-LD. This aligns with W3C Verifiable Credentials (VC Data Model 2.0)
> where the credential `id` is a dereferenceable verification URL. The generator should
> produce `"url": "<verify_url>"` on each credential node.

| # | Certification | Certificate ID | verify_url |
|:--|:---|:---|:---|
| 1 | Entrega Contínua: confiabilidade e qualidade | d9007353-b9db-4db2-99de-303fca241275 | https://cursos.alura.com.br/certificate/d9007353-b9db-4db2-99de-303fca241275 |
| 2 | Formação Engenharia de software | 5305169e-3597-4c80-b8b5-703da11b943b | https://cursos.alura.com.br/certificate/5305169e-3597-4c80-b8b5-703da11b943b |
| 3 | Integração Contínua: qualidade e menos risco | 1fa80160-ea76-45e2-98e6-854119a5b1ba | https://cursos.alura.com.br/certificate/1fa80160-ea76-45e2-98e6-854119a5b1ba |
| 4 | Microsserviços na prática | f0ee7e80-1355-4646-aba3-81419f961b50 | https://cursos.alura.com.br/certificate/f0ee7e80-1355-4646-aba3-81419f961b50 |
| 5 | Microsserviços: explorando conceitos | 141db7ae-325b-4bbc-9e29-1b7b086545f9 | https://cursos.alura.com.br/certificate/141db7ae-325b-4bbc-9e29-1b7b086545f9 |
| 6 | Microsserviços: padrões de projeto | eb7851a8-5ad1-4187-a2a1-a852bc7c55ee | https://cursos.alura.com.br/certificate/eb7851a8-5ad1-4187-a2a1-a852bc7c55ee |
| 7 | Extreme Programming: metodologia ágil | 5f6f8b86-d216-4ab6-b63e-7f784665ab5e | https://cursos.alura.com.br/certificate/5f6f8b86-d216-4ab6-b63e-7f784665ab5e |
| 8 | Organização de Equipes Ágeis | f593bd0c-29d9-4a17-9142-3ce9d0847ba8 | https://cursos.alura.com.br/certificate/f593bd0c-29d9-4a17-9142-3ce9d0847ba8 |
| 9 | Scrum: agilidade em seu projeto | a4ef2164-8f95-4dd4-8ae9-2f7064363e0c | https://cursos.alura.com.br/certificate/a4ef2164-8f95-4dd4-8ae9-2f7064363e0c |
| 10 | Quality Assurance: plano de testes e bugs | 30528766-c2e1-49e6-a1cf-28bc60d418dd | https://cursos.alura.com.br/certificate/30528766-c2e1-49e6-a1cf-28bc60d418dd |
| 11 | Blockchain para Negócios | 71f544df-579b-4da6-9b2c-6f720314448b | https://cursos.alura.com.br/certificate/71f544df-579b-4da6-9b2c-6f720314448b |
| 12 | Blockchain: aumente a confiança | 0443c7b1-d93c-4008-acf7-fcf7e175c430 | https://cursos.alura.com.br/certificate/0443c7b1-d93c-4008-acf7-fcf7e175c430 |
| 13 | IA Generativa: Midjourney e ChatGPT | bc4ff00f-d3c1-457a-ab15-b3c78ab55770 | https://cursos.alura.com.br/certificate/bc4ff00f-d3c1-457a-ab15-b3c78ab55770 |
| 14 | Value Stream Mapping (VSM): desenhe mapa | 17172eb2-7589-4243-899e-bd1ebdb2001c | https://cursos.alura.com.br/certificate/17172eb2-7589-4243-899e-bd1ebdb2001c |
| 15 | Value Stream Mapping (VSM): conheça fluxo | ec0351b4-1a4d-4722-be3d-48addce732d7 | https://cursos.alura.com.br/certificate/ec0351b4-1a4d-4722-be3d-48addce732d7 |
| 16 | RPA: aplicações gerais | 8498ab7f-6167-48d5-a416-756bc7e75590 | https://cursos.alura.com.br/certificate/8498ab7f-6167-48d5-a416-756bc7e75590 |
| 17 | Bizagi: mapeamento com BPMN | b45495dd-a17b-4ebb-ae03-89cf9d3fbc39 | https://cursos.alura.com.br/certificate/b45495dd-a17b-4ebb-ae03-89cf9d3fbc39 |
| 18 | UML: modelagem de diagramas | 5acd569d-4c75-47d1-b3ed-9dc51c3e6812 | https://cursos.alura.com.br/certificate/5acd569d-4c75-47d1-b3ed-9dc51c3e6812 |
| 19 | UML: modelagem de soluções | 808d0a16-fbdb-45eb-9df0-e0d6ce18213f | https://cursos.alura.com.br/certificate/808d0a16-fbdb-45eb-9df0-e0d6ce18213f |
| 20 | Linux Onboarding: CLI rápida e prática | 7c1e8280-1f67-49e2-bf86-aa24fe674921 | https://cursos.alura.com.br/certificate/7c1e8280-1f67-49e2-bf86-aa24fe674921 |
| 21 | Aprenda Java com Orientação a Objetos | 60a265dd-c87a-4f00-91e5-c1e0680c1efc | https://cursos.alura.com.br/certificate/60a265dd-c87a-4f00-91e5-c1e0680c1efc |
| 22 | Java: criando primeira aplicação | cb6ebd04-fc02-4c2b-bb30-87e61b3796d8 | https://cursos.alura.com.br/certificate/cb6ebd04-fc02-4c2b-bb30-87e61b3796d8 |
| 23 | Java: Orientação a Objetos | 379a0ba4-997c-4cd6-90c3-c5eb8e48b3c6 | https://cursos.alura.com.br/certificate/379a0ba4-997c-4cd6-90c3-c5eb8e48b3c6 |
| 24 | Java: listas e coleções de dados | 96742210-b3e7-4fc7-8b7b-7b3d3e6e82b8 | https://cursos.alura.com.br/certificate/96742210-b3e7-4fc7-8b7b-7b3d3e6e82b8 |
| 25 | Java: API, arquivos e erros | e3e64464-cc6a-43cb-8d02-ee48dc7fb75c | https://cursos.alura.com.br/certificate/e3e64464-cc6a-43cb-8d02-ee48dc7fb75c |
| 26 | C++: linguagem e STL | 2c3f2ae7-f7b4-4cc0-8862-7ff38a8b51bb | https://cursos.alura.com.br/certificate/2c3f2ae7-f7b4-4cc0-8862-7ff38a8b51bb |
| 27 | SOLID com PHP: princípios OOP | 0a1776a5-2796-4c23-b0f1-78b2a9162ef2 | https://cursos.alura.com.br/certificate/0a1776a5-2796-4c23-b0f1-78b2a9162ef2 |
| 28 | Avançando OOP com PHP | 09a0fb74-75f6-44b5-8544-60585d6de6e4 | https://cursos.alura.com.br/certificate/09a0fb74-75f6-44b5-8544-60585d6de6e4 |
| 29 | Design Patterns em PHP | 160ab564-9b24-4e0c-9f71-146a3fd571e5 | https://cursos.alura.com.br/certificate/160ab564-9b24-4e0c-9f71-146a3fd571e5 |
| 30 | Orientação a Objetos com PHP | d2d1ec5d-ed0b-454a-bf0a-1db9ade28831 | https://cursos.alura.com.br/certificate/d2d1ec5d-ed0b-454a-bf0a-1db9ade28831 |
| 31 | JavaScript e HTML: desenvolva um jogo | 3912a7ca-edaa-4fee-9269-500620545693 | https://cursos.alura.com.br/certificate/3912a7ca-edaa-4fee-9269-500620545693 |
| 32 | MongoDB: banco de dados NoSQL | 7f84cff8-cc22-44eb-af57-906e0866c2b3 | https://cursos.alura.com.br/certificate/7f84cff8-cc22-44eb-af57-906e0866c2b3 |


---


# Skills Taxonomy
<!-- classification: PUBLIC -->

> Source: `aboutme.md` — Exhaustive taxonomy. Skills linked to roles/institutions where declared.

## Computer Science & Software Engineering
Software Architecture, AI Context Generator, Software Engineering Practices, API Development, API REST, Node.js, PHP, Java, C#, C++, C, JavaScript, HTML, Python, Rust, Visual Basic, VBA, SQL, MySQL, MongoDB, Data Structures, Algorithms.

## Blockchain & Web3
Blockchain Technology, Bitcoin, Ethereum, Solidity, Criptografia.

## Hardware & Embedded Systems
Desenvolvedor de Hardware, Criador de Protótipos Eletrônicos, Desenvolvedor de Software Embarcado, Arduino, ESP8266 / ESP-8266.

## DevOps & Infrastructure
Docker, Linux, Operating Systems (Sistemas Operacionais), Integração e Entrega Contínuas (CI/CD).

## Agile, Product & Management
Scrum, Agile Project Management, Operations Management, Business Analysis, Human Resources (HR), Account Management, Negociação, Liderança de Equipe, Gestão de Pessoas, Gestão de Contratos, Desenvolvimento de Gestão, Comunicação Interna, Consulting.

## Finance, Economics & Trading
Economic Analysis, Financial Analysis, Structured Finance, Project Finance, Foreign Exchange (FX) Trading, Technical Analysis, Stock Market, Stock Exchange, Stock Management, Options Strategies, Candlestick Analysis (Candles), MetaTrader, Finance, Accountability.

## Humanities, Sciences & Cognitive Abilities
Political Science, Political Philosophy, Political Consulting, Political Communication, Philosophy of Science, Philosophy of Religion, Philosophy, Science, International Relations, Administrative Law, Teaching (Docência), Palestras, Memorization, Photographic Memory, Memory Management.

## Corporate Tools & Marketing
Google Ads, Google Analytics, Google Webmaster Tools, ERP Software, ERP Implementations, Business Intelligence (BI), Microsoft Office (Excel, Word, PowerPoint).

## Soft Skills
Competências Interpessoais, Habilidades Analíticas.

## Languages
- Português (native)
- English (Inglês para Negócios — business level)
- Español (Spanish)
- Hebrew (basic/liturgical)
- Italian (basic/heritage)

## Knowledge Domains (DefinedTerms → Wikidata)

| Domain | Wikidata | Wikipedia |
|:---|:---|:---|
| Austrian School of economics | Q203411 | https://en.wikipedia.org/wiki/Austrian_School |
| Chaos theory | Q254 | https://en.wikipedia.org/wiki/Chaos_theory |
| Econophysics | Q932628 | https://en.wikipedia.org/wiki/Econophysics |
| Complex adaptive system | Q581233 | https://en.wikipedia.org/wiki/Complex_adaptive_system |
| Little's law | Q679586 | https://en.wikipedia.org/wiki/Little%27s_law |
| Long short-term memory (LSTM) | Q6673524 | https://en.wikipedia.org/wiki/Long_short-term_memory |
| Anomaly detection | Q3560506 | https://en.wikipedia.org/wiki/Anomaly_detection |
| Market microstructure | Q6053360 | https://en.wikipedia.org/wiki/Market_microstructure |
| Distributed computing | Q13136 | https://en.wikipedia.org/wiki/Distributed_computing |
| Edge computing | Q226494 | https://en.wikipedia.org/wiki/Edge_computing |
| Internet of things | Q251620 | https://en.wikipedia.org/wiki/Internet_of_things |
| Zero trust security model | Q111664727 | https://en.wikipedia.org/wiki/Zero_trust_security_model |
| Smart contract | Q1585649 | https://en.wikipedia.org/wiki/Smart_contract |
| Monero | Q19893485 | https://en.wikipedia.org/wiki/Monero |
| Ring signature | Q707714 | https://en.wikipedia.org/wiki/Ring_signature |
| Secure multi-party computation | Q2891896 | https://en.wikipedia.org/wiki/Secure_multi-party_computation |


---


# Publications & Scientific Productions
<!-- classification: PUBLIC -->

> Source: `scientificproductions.md` — All 40 ORCID works mapped. 18 publications + 22 software programs.
> Repositories with DOI are "citable artifacts" with full metadata.

## GitHub Repositories & Zenodo DOIs (Citable Artifacts)

### 1. cyberfinancial-resilience-lrblstm
- schema_id: https://ulissesflores.com/#sw-lrblstm
- schema_type: SoftwareSourceCode
- repo: https://github.com/ulissesflores/cyberfinancial-resilience-lrblstm
- codeRepository: https://github.com/ulissesflores/cyberfinancial-resilience-lrblstm
- version: 0.1.1
- doi: 10.5281/zenodo.18275035
- doi_url: https://doi.org/10.5281/zenodo.18275035
- license: Apache-2.0
- license_url: https://spdx.org/licenses/Apache-2.0.html
- programmingLanguage: Python
- runtimePlatform: Google Colab / Python 3.10+
- name:
    pt-BR: Resiliência Ciberfinanceira via Lei de Little e LSTM Bayesiano (LR-BLSTM)
    en: Cyber-Financial Resilience via Little's Law and Bayesian LSTM (LR-BLSTM)
    es: Resiliencia Ciberfinanciera vía Ley de Little y LSTM Bayesiano (LR-BLSTM)
- description:
    en: >
      Reproducible scientific pipeline for cyber-financial resilience analysis using
      Little's Law proxies and Bayesian LSTM for anomaly detection in high-frequency trading.
    pt-BR: >
      Pipeline científico reprodutível para análise de resiliência ciberfinanceira usando
      proxies da Lei de Little e LSTM Bayesiano para detecção de anomalias em trading de alta frequência.
- keywords: [cyber-financial resilience, Little's Law, Bayesian LSTM, anomaly detection, Python, SimPy]

### 2. llm-contextizer
- schema_id: https://ulissesflores.com/#sw-llm-contextizer
- schema_type: SoftwareSourceCode
- repo: https://github.com/ulissesflores/llm-contextizer
- releases:
  - version: 0.1.1 | doi: 10.5281/zenodo.18343438 | doi_url: https://doi.org/10.5281/zenodo.18343438
  - version: 0.1.2 | doi: 10.5281/zenodo.18343563 | doi_url: https://doi.org/10.5281/zenodo.18343563
- name:
    en: LLM Contextizer — Semantic Context Generator and Prompt Engineering for LLMs
    pt-BR: Gerador de Contexto Semântico e Engenharia de Prompt para LLMs

### 3. mit507-yape-architecture-sim
- schema_id: https://ulissesflores.com/#sw-mit507-yape
- schema_type: SoftwareSourceCode
- repo: https://github.com/ulissesflores/mit507-yape-architecture-sim
- releases:
  - version: 1.0.0 | doi: 10.5281/zenodo.18641336 | doi_url: https://doi.org/10.5281/zenodo.18641336
  - version: 2.0.0 | doi: 10.5281/zenodo.18645894 | doi_url: https://doi.org/10.5281/zenodo.18645894
- name:
    en: MIT-507 Yape Architecture Simulation — Discrete Event Simulation for Cell-Based Systems
    pt-BR: Simulação de Arquitetura Yape MIT-507 — Simulação de Eventos Discretos para Sistemas Cell-Based

## ORCID Works — Complete Inventory (40/40)

> Notation: `[J]` = Journal article (ScholarlyArticle), `[R]` = Report, `[S]` = Software (SoftwareSourceCode).
> Items with `url` have canonical URIs at ulissesflores.com. Items marked `[S]` without DOI are
> registered in ORCID/Lattes but not yet deposited in Zenodo.
>
> **Provenance:** All 40 items sourced from ORCID 0000-0002-6034-7765 and cross-referenced
> against Lattes CV 6905246706890561. Items with DOI have independent verification via Zenodo.
> The `url` field points to the author's canonical publication page (ulissesflores.com) where
> available. Source retrieval date: 2026-02-20.

### 2025 (11 items)

| # | T | Title | datePublished | inLanguage | url |
|:--|:--|:---|:---|:---|:---|
| 1 | J | A Lei de Little como Vetor de Resiliência e Qualidade | 2025 | pt-BR | https://ulissesflores.com/research/2025-little-law-resilience |
| 2 | J | Análise Preditiva de Ativos Financeiros com Modelos LSTM | 2025 | pt-BR | https://ulissesflores.com/research/2025-lstm-asset-prediction |
| 3 | R | Análise Termodinâmica e Engenharia de Sistemas Híbridos de Resfriamento | 2025 | pt-BR | https://ulissesflores.com/whitepapers/2025-hybrid-cooling-thermodynamics |
| 4 | R | Arquiteturas Cloudless e Soberania de Dados em IoT | 2025 | pt-BR | https://ulissesflores.com/whitepapers/2025-iot-data-sovereignty |
| 5 | S | Clube Santo: Plataforma Digital de Ensino Teológico e Comunidade | 2025 | pt-BR | — |
| 6 | J | Detecção de Fraudes em Cartões com Redes Neurais | 2025 | pt-BR | https://ulissesflores.com/research/2025-fraud-detection-mlp |
| 7 | S | Gerador de Contexto Semântico e Engenharia de Prompt para LLMs | 2025 | pt-BR | — |
| 8 | S | Orquestração de Ambientes Inteligentes: Integração Tuya, Zigbee e Home Assistant | 2025 | pt-BR | — |
| 9 | S | Pipeline de Extração e Estruturação de Conhecimento de Mídias Audiovisuais | 2025 | pt-BR | — |
| 10 | S | Prototipagem de Estruturas Modulares em Alumínio e Painéis Digitais | 2025 | pt-BR | — |
| 11 | S | Simulação de Inteligência de Enxame e Autômatos Celulares | 2025 | pt-BR | — |

### 2024 (13 items)

| # | T | Title | datePublished | inLanguage | url |
|:--|:--|:---|:---|:---|:---|
| 12 | J | Análise Historiográfica e Arqueológica Exaustiva: A Historicidade de Jesus | 2024 | pt-BR | https://ulissesflores.com/research/2024-historicity-jesus-archaeology |
| 13 | S | Arquitetura de Microsserviços em Ambiente Serverless e Conteinerização | 2024 | pt-BR | — |
| 14 | J | Bitcoin como Ativo de Reserva e a Teoria da Moeda na Escola Austríaca | 2024 | pt-BR | https://ulissesflores.com/research/2024-bitcoin-praxeology |
| 15 | J | Canonização Escribal: Análise Histórico-Crítica da Formação do Cânon | 2024 | pt-BR | https://ulissesflores.com/research/2024-scribal-canonization-ezra |
| 16 | S | Codex Hash Algo-Trading: Sistema Estocástico de Arbitragem | 2024 | pt-BR | — |
| 17 | J | Fundamentos Transcendentes da Ordem Econômica | 2024 | pt-BR | https://ulissesflores.com/essays/2024-theology-economic-order |
| 18 | R | Implementação de Ring Signatures e Endereços Furtivos | 2024 | pt-BR | https://ulissesflores.com/whitepapers/2024-ring-signatures-privacy |
| 19 | S | Interface de Conversação Natural via Integração de APIs de LLM | 2024 | pt-BR | — |
| 20 | S | Interface de Conversação Natural (Módulo II) | 2024 | pt-BR | — |
| 21 | S | Plataforma de Análise de Dados Políticos e Monitoramento Legislativo | 2024 | pt-BR | — |
| 22 | S | Protocolo de Crowdfunding Privativo | 2024 | pt-BR | — |
| 23 | R | Transformação Ágil e Engenharia de Fluxo em Data Science | 2024 | pt-BR | https://ulissesflores.com/whitepapers/2024-agritech-agile-flow |
| 24 | J | Tratado Exegético sobre a Representação da Moralidade e Antropologia | 2024 | pt-BR | https://ulissesflores.com/essays/2024-exegetical-treatise-anthropology |

### 2023 (6 items)

| # | T | Title | datePublished | inLanguage | url |
|:--|:--|:---|:---|:---|:---|
| 25 | J | A Coroa e a Cruz: Análise Teológica e Fenomenológica das Aparições Marianas | 2023 | pt-BR | https://ulissesflores.com/research/2023-marian-apparitions-critique |
| 26 | S | BioBytes: Sistema de Preservação Digital de Memória | 2023 | pt-BR | — |
| 27 | R | Desafios da Herança Digital: Preservação de Memória Pós-Mortem | 2023 | pt-BR | https://ulissesflores.com/whitepapers/2023-digital-legacy |
| 28 | S | Gerador de Entropia e Gestão de Chaves Privadas | 2023 | pt-BR | — |
| 29 | J | O Clube Santo: Arqueologia Espiritual, Teológica e Visual do Metodismo | 2023 | pt-BR | https://ulissesflores.com/research/2023-holy-club-methodism |
| 30 | S | Time-Ledger System: Plataforma de Tokenização para Economia do Cuidado | 2023 | pt-BR | — |

### 2022–1998 (10 items)

| # | T | Year | Title | inLanguage | url |
|:--|:--|:--|:---|:---|:---|
| 31 | J | 2022 | A Teologia da Esperança em Tempos de Crise | pt-BR | https://ulissesflores.com/essays/2022-theology-of-hope |
| 32 | S | 2022 | Sistema de Validação Estocástica e Análise Combinatória | pt-BR | — |
| 33 | J | 2020 | Metodologias Ativas no Ensino de Lógica de Programação | pt-BR | https://ulissesflores.com/essays/2020-robotics-education |
| 34 | S | 2020 | Robótica Educacional e Lógica de Programação para Jovens | pt-BR | — |
| 35 | S | 2019 | Implementação de DLT Permissionada para Aplicações Bancárias | pt-BR | — |
| 36 | S | 2018 | GoldenLeaf: Sistema Embarcado para Controle Ambiental | pt-BR | — |
| 37 | J | 2017 | Teoria do Caos: Emergência e Auto-organização em Mercados | pt-BR | https://ulissesflores.com/essays/2017-chaos-theory-economics |
| 38 | S | 2016 | Algoritmo de Cálculo Atuarial e Simulação de Aposentadoria | pt-BR | — |
| 39 | S | 2015 | ERP-SIS: Sistema Integrado de Gestão Financeira | pt-BR | — |
| 40 | S | 1998 | Sistemas de Processamento de Dados Financeiros em Ambientes Legados | pt-BR | — |

**Total: 40/40 ORCID works mapped.** ✓


---


# Active Research Projects
<!-- classification: PUBLIC -->

## 1. Resiliência e Antifragilidade em Sistemas Complexos
- schema_id: https://ulissesflores.com/#project-resilience-antifragility
- schema_type: ResearchProject
- status: In progress (since 2024)
- funder_ref: https://ulissesflores.com/#codexhash
- outputs_refs: [https://ulissesflores.com/#sw-lrblstm]
- name:
    pt-BR: Resiliência e Antifragilidade em Sistemas Complexos — Uma Abordagem Híbrida via IA e Economia Praxeológica
    en: Resilience and Antifragility in Complex Systems — A Hybrid Approach via AI and Praxeological Economics
    es: Resiliencia y Antifragilidad en Sistemas Complejos — Un Enfoque Híbrido mediante IA y Economía Praxeológica
- description:
    pt-BR: >
      Pesquisa multidisciplinar na fronteira entre Ciência da Computação e Economia teórica,
      estudando antifragilidade em sistemas distribuídos (Blockchain/DeFi) via agentes autônomos
      baseados em LSTM, lógica fuzzy e otimização de fluxo pela Lei de Little, com restrições
      praxeológicas da Escola Austríaca.
    en: >
      Multidisciplinary research at the boundary between Computer Science and theoretical Economics,
      studying antifragility in distributed systems (Blockchain/DeFi) via LSTM-based autonomous agents,
      fuzzy logic, and Little's Law flow optimization, with praxeological constraints from the Austrian School.

## 2. Arqueologia Cognitiva e Crítica Textual
- schema_id: https://ulissesflores.com/#project-cognitive-archaeology-textual-criticism
- schema_type: ResearchProject
- status: In progress (since 2023)
- publisher_ref: https://ulissesflores.com/#instituto-clube-santo
- name:
    pt-BR: Arqueologia Cognitiva e Crítica Textual — Evidências Históricas na Formação do Cânon Bíblico
    en: Cognitive Archaeology and Textual Criticism — Historical Evidence in Biblical Canon Formation
    es: Arqueología Cognitiva y Crítica Textual — Evidencias Históricas en la Formación del Canon Bíblico
- description:
    pt-BR: >
      Pesquisa histórico-crítica sobre origens documentais e materiais de textos bíblicos,
      combinando crítica textual, arqueologia do Levante e análise de fontes extrabíblicas
      sobre o Jesus histórico, com implicações para a formação ética ocidental.
    en: >
      Historical-critical research on documentary and material origins of biblical texts, combining textual
      criticism, Levant archaeology, and analysis of extrabiblical sources on the historical Jesus, with
      implications for Western ethical formation.

## 3. Arquiteturas de Edge Computing e Criptografia em Hardware (IoT)
- schema_id: https://ulissesflores.com/#project-edge-crypto-iot
- schema_type: ResearchProject
- status: In progress (since 2024)
- funder_ref: https://ulissesflores.com/#codexhash
- name:
    pt-BR: Arquiteturas de Edge Computing e Criptografia em Hardware (IoT) para Confiança Zero
    en: Edge Computing Architectures and Hardware Cryptography (IoT) for Zero Trust Environments
    es: Arquitecturas de Edge Computing y Criptografía en Hardware (IoT) para Confianza Cero
- description:
    pt-BR: >
      Desenvolvimento e validação de hardware embarcado cloudless (ESP32/Arduino) para soberania
      de dados, operação zero-trust e criptografia de curvas elípticas em microcontroladores de
      baixa potência; inclui sensoriamento industrial e automação de precisão (GoldenLeaf).
    en: >
      Development and validation of cloudless embedded hardware (ESP32/Arduino) for data sovereignty,
      zero-trust operation, and elliptic-curve cryptography on low-power microcontrollers; includes
      industrial sensing and precision automation (GoldenLeaf).


---


### Top 10 Publications — Multilingual Titles (EN/ES)

> **Rationale:** The 10 most disruptive works are translated for international discoverability.
> The generator should produce `name` as `@value/@language` arrays for these items.
> Selection criteria: cross-disciplinary novelty, methodological contribution, or
> strategic importance to the Codex Hash Research program.

| # | Title (pt-BR) | Title (en) | Title (es) |
|:--|:---|:---|:---|
| 1 | Análise Preditiva de Ativos Financeiros com Modelos LSTM | Predictive Analysis of Financial Assets Using LSTM Models | Análisis Predictivo de Activos Financieros con Modelos LSTM |
| 2 | Detecção de Fraudes em Cartões com Redes Neurais | Credit Card Fraud Detection Using Neural Networks | Detección de Fraudes en Tarjetas con Redes Neuronales |
| 3 | Arquiteturas Cloudless e Soberania de Dados em IoT | Cloudless Architectures and Data Sovereignty in IoT | Arquitecturas Cloudless y Soberanía de Datos en IoT |
| 4 | A Lei de Little como Vetor de Resiliência e Qualidade | Little's Law as a Vector for Resilience and Quality | La Ley de Little como Vector de Resiliencia y Calidad |
| 5 | Bitcoin como Ativo de Reserva e a Teoria da Moeda na Escola Austríaca | Bitcoin as a Reserve Asset and Monetary Theory in the Austrian School | Bitcoin como Activo de Reserva y la Teoría Monetaria de la Escuela Austríaca |
| 6 | Implementação de Ring Signatures e Endereços Furtivos | Implementation of Ring Signatures and Stealth Addresses | Implementación de Ring Signatures y Direcciones Furtivas |
| 7 | Análise Historiográfica e Arqueológica Exaustiva: A Historicidade de Jesus | Comprehensive Historiographic and Archaeological Analysis: The Historicity of Jesus | Análisis Historiográfico y Arqueológico Exhaustivo: La Historicidad de Jesús |
| 8 | Canonização Escribal: Análise Histórico-Crítica da Formação do Cânon | Scribal Canonization: A Historical-Critical Analysis of Canon Formation | Canonización Escribal: Análisis Histórico-Crítico de la Formación del Canon |
| 9 | Análise Termodinâmica e Engenharia de Sistemas Híbridos de Resfriamento | Thermodynamic Analysis and Engineering of Hybrid Cooling Systems | Análisis Termodinámico e Ingeniería de Sistemas Híbridos de Enfriamiento |
| 10 | Transformação Ágil e Engenharia de Fluxo em Data Science | Agile Transformation and Flow Engineering in Data Science | Transformación Ágil e Ingeniería de Flujo en Data Science |


---


# Organizations & Affiliations
<!-- classification: PUBLIC (except where marked PRIVATE) -->

## Codex Hash Ltda (Primary)
- schema_id: https://ulissesflores.com/#codexhash
- schema_type: Organization
- legal_name: CODEX HASH LTDA
- alternate_names: [CODEX HASH, Codex Hash Research Labs]
- cnpj: 53.520.203/0001-75 <!-- classification: PUBLIC (government registry) -->
- founding_date: 2024-01-16
- url: https://codexhash.com
- email: contato@codexhash.com <!-- classification: PUBLIC -->
- address: Avenida Itacira, 2689, Planalto Paulista, São Paulo/SP, CEP 04061-003, BR <!-- classification: PUBLIC (gov registry) -->
- capital: R$ 10.000,00
- cnae_primary: 74.90-1-04
- cnae_secondary: 63.19-4-00
- description:
    pt-BR: >
      Laboratório de P&D (deep tech) focado em finanças quantitativas/Web3, engenharia de
      hardware IoT (arquiteturas cloudless/edge) e IA aplicada para resiliência ciberfinanceira.
    en: >
      R&D deep-tech lab focused on quantitative finance/Web3, IoT hardware engineering
      (cloudless/edge architectures), and applied AI for cyber-financial resilience.
    es: >
      Laboratorio de I+D (deep tech) enfocado en finanzas cuantitativas/Web3, ingeniería de
      hardware IoT (arquitecturas cloudless/edge) e IA aplicada para resiliencia ciberfinanciera.
    he: >
      מעבדת מו"פ (דיפ-טק) המתמקדת בפיננסים כמותיים/Web3, הנדסת חומרה IoT (ארכיטקטורות
      ענן-ללא/קצה) ובינה מלאכותית לחוסן סייבר-פיננסי.
    it: >
      Laboratorio R&S (deep tech) focalizzato su finanza quantitativa/Web3, ingegneria hardware
      IoT (architetture cloudless/edge) e IA applicata alla resilienza cyber-finanziaria.

### Sub-Organization: Codex Hash Research
- schema_id: https://ulissesflores.com/#codexhash-research
- schema_type: Organization
- parentOrganization_ref: https://ulissesflores.com/#codexhash
- name:
    pt-BR: Codex Hash Research
    en: Codex Hash Research
- url: https://codexhash.com/research
- description:
    pt-BR: Braço de pesquisa aplicada — publicações técnicas, software registrado com DOI e colaboração acadêmica.
    en: Applied research arm — technical publications, DOI-registered software, and academic collaboration.
    es: Brazo de investigación aplicada — publicaciones técnicas, software registrado con DOI y colaboración académica.
    he: זרוע מחקר יישומי — פרסומים טכניים, תוכנה רשומה עם DOI ושיתוף פעולה אקדמי.
    it: Braccio di ricerca applicata — pubblicazioni tecniche, software registrato con DOI e collaborazione accademica.

### Sub-Organization: Codex Hash Labs
- schema_id: https://ulissesflores.com/#codexhash-labs
- schema_type: Organization
- parentOrganization_ref: https://ulissesflores.com/#codexhash
- name:
    pt-BR: Codex Hash Labs
    en: Codex Hash Labs
- url: https://codexhash.com/labs
- description:
    pt-BR: Engenharia de sistemas e prototipagem — hardware IoT/edge, arquiteturas cloudless e segurança embarcada.
    en: Systems engineering and prototyping — IoT/edge hardware, cloudless architectures, embedded security.
    es: Ingeniería de sistemas y prototipado — hardware IoT/edge, arquitecturas cloudless y seguridad embebida.
    he: הנדסת מערכות ואב-טיפוס — חומרת IoT/edge, ארכיטקטורות ללא ענן ואבטחה מוטמעת.
    it: Ingegneria dei sistemi e prototipazione — hardware IoT/edge, architetture cloudless e sicurezza embedded.

### Sub-Organization: Codex Hash Education
- schema_id: https://ulissesflores.com/#codexhash-education
- schema_type: Organization
- parentOrganization_ref: https://ulissesflores.com/#codexhash
- name:
    pt-BR: Codex Hash Education
    en: Codex Hash Education
- url: https://codexhash.com/education
- description:
    pt-BR: Conteúdo, mentoria e educação técnica — cursos, workshops e engajamento comunitário.
    en: Content, mentoring, and technical education — courses, workshops, and community engagement.
    es: Contenido, mentoría y educación técnica — cursos, talleres y compromiso comunitario.
    he: תוכן, חונכות וחינוך טכני — קורסים, סדנאות ומעורבות קהילתית.
    it: Contenuti, mentoring e formazione tecnica — corsi, workshop e coinvolgimento della comunità.

## Instituto Clube Santo
- schema_id: https://ulissesflores.com/#instituto-clube-santo
- schema_type: Organization
- url: https://clubesanto.org
- description:
    pt-BR: Instituto de pesquisa em Teologia Histórica, Arqueologia Cognitiva e tradição Metodista Wesleyana.
    en: Research institute for Historical Theology, Cognitive Archaeology, and the Wesleyan Methodist tradition.
    es: Instituto de investigación en Teología Histórica, Arqueología Cognitiva y tradición Metodista Wesleyana.
    he: מכון מחקר לתיאולוגיה היסטורית, ארכיאולוגיה קוגניטיבית ומסורת מתודיסטית וסליאנית.
    it: Istituto di ricerca in Teologia Storica, Archeologia Cognitiva e tradizione Metodista Wesleyana.

## Prefeitura Municipal de Itupeva
- schema_id: https://ulissesflores.com/#prefeitura-itupeva
- schema_type: GovernmentOrganization
- name: Prefeitura Municipal de Itupeva
- url: https://itupeva.sp.gov.br/
- sameAs:
    - https://www.wikidata.org/entity/Q734333
    - https://en.wikipedia.org/wiki/Itupeva

## Igreja do Evangelho Quadrangular — Vila Helena
- schema_id: https://ulissesflores.com/#quadrangular-vila-helena
- schema_type: Organization
- url: https://www.youtube.com/@quadrangularvilahelena
- relation: Pastoral ministry and sermon collection publisher


---


# Digital Assets & Web3 Identifiers

## Public Identifiers
<!-- classification: PUBLIC -->

| Identifier | Value | Verifiable URL | Notes |
|:---|:---|:---|:---|
| ORCID | 0000-0002-6034-7765 | https://orcid.org/0000-0002-6034-7765 | Strong anchor |
| Lattes | 6905246706890561 | http://lattes.cnpq.br/6905246706890561 | Strong anchor |
| DID | did:web:ulissesflores.com | https://ulissesflores.com/.well-known/did.json | W3C DID |
| RNS.ID (Palau) | LUA3604A | https://rns.id/ | National digital ID (Palau) |
| ENS | ulissesflores.eth | https://app.ens.domains/ulissesflores.eth | Ethereum Name Service |
| Ethereum | 0x2b146dc6Ea5C2385c7EfFF10a09a96955E96F3C3 | https://etherscan.io/address/0x2b146dc6Ea5C2385c7EfFF10a09a96955E96F3C3 | Primary wallet (L1) |
| Ethereum (Base L2) | 0x2b146dc6Ea5C2385c7EfFF10a09a96955E96F3C3 | https://basescan.org/address/0x2b146dc6Ea5C2385c7EfFF10a09a96955E96F3C3 | Base chain attestations |
| BTC | bc1qqddqpxufw7d2utfav2qa0mwe9ztkwx6qqe5t4g | https://mempool.space/address/bc1qqddqpxufw7d2utfav2qa0mwe9ztkwx6qqe5t4g | Bitcoin address |
| IPFS CID | bafybeiefgqaigidav2fnccz57s4tr2fb6eapv3qmwxpnvl73s3adi5thjy | https://bafybeiefgqaigidav2fnccz57s4tr2fb6eapv3qmwxpnvl73s3adi5thjy.ipfs.dweb.link/ | Site pinned (IPFS gateway) |
| Keybase | ul1ss3sfl0r3s | https://keybase.io/ul1ss3sfl0r3s | PGP + social proofs |
| Gitcoin Passport | 39 | https://passport.gitcoin.co/ | Sybil resistance score |
| Humanity Score | 39.7 | https://base.easscan.org/address/0x2b146dc6Ea5C2385c7EfFF10a09a96955E96F3C3 | Base EAS attestation |
| PGP Fingerprint | af30 44aa df8b d6cc 16a9 5750 d4e0 4e74 2ac8 f678 | https://keybase.io/ul1ss3sfl0r3s/pgp_keys.asc | Public key via Keybase |

## sameAs (Canonical Profile Links)
<!-- classification: PUBLIC -->

- https://www.linkedin.com/in/ulisses-flores-75961921
- https://github.com/ulissesflores
- https://orcid.org/0000-0002-6034-7765
- http://lattes.cnpq.br/6905246706890561
- https://www.tiktok.com/@ulissesflores
- https://www.instagram.com/ulissesflores
- https://www.facebook.com/ulissesflores
- https://ulissesflores.com/
- https://keybase.io/ul1ss3sfl0r3s
- https://gist.github.com/ulissesflores/
- https://ulissesflores.eth.limo
- https://gravatar.com/ulissesflores
- https://ulisses.omg.lol
- https://groups.google.com/g/androidbrasil/c/d7onDwJ5ekA?pli=1
- gitperson (user-declared identity anchor)

## Domain Inventory (Hub & Spoke — 15 domains)
<!-- classification: PUBLIC -->

| # | Domain | URL | Category | Purpose |
|:--|:---|:---|:---|:---|
| 1 | ulissesflores.com | https://ulissesflores.com/ | **HUB (canonical)** | Primary sovereign site |
| 2 | ulissesflor.es | https://ulissesflor.es/ | Brand protection | Vanity redirect |
| 3 | ulisses.digital | https://ulisses.digital/ | Brand protection | Redirect |
| 4 | ulissesflores.org | https://ulissesflores.org/ | Brand protection | Redirect |
| 5 | carlosulisses.com.br | https://carlosulisses.com.br/ | Brand protection | BR legacy |
| 6 | carlosulissesflores.com.br | https://carlosulissesflores.com.br/ | Brand protection | BR legacy |
| 7 | ulissesflores.com.br | https://ulissesflores.com.br/ | Brand protection | BR legacy |
| 8 | cuf.dev.br | https://cuf.dev.br/ | Brand protection | Dev initials |
| 9 | ulisses.solutions | https://ulisses.solutions/ | Deep link | Service page |
| 10 | ulissesflores.dev | https://ulissesflores.dev/ | Deep link | Developer profile |
| 11 | ulisses.ia.br | https://ulisses.ia.br/ | Deep link | AI focus |
| 12 | 11-97272-7532.me | https://11-97272-7532.me/ | Deep link | Phone-to-web |
| 13 | ul1ss.es | https://ul1ss.es/ | Infrastructure | Vanity / shortener |
| 14 | anamnese.cc | https://anamnese.cc/ | Project | Isolated project |
| 15 | horarionibus.com.br | https://horarionibus.com.br/ | Project | Isolated project |

### Web3 Presence

| Identifier | URL |
|:---|:---|
| ulisses.omg.lol | https://ulisses.omg.lol |
| ulissesflores.eth.limo | https://ulissesflores.eth.limo |
| ulissesflores.eth | ENS domain (censorship-resistant) |

## Contact Points
<!-- classification: PRIVATE -->

- email_personal: c.ulisses@gmail.com
- email_public: hello@ulissesflores.com
- email_business: contato@codexhash.com
- phone: +55-11-97272-7532

## Addresses
<!-- classification: PRIVATE -->

- home: Bairro Santa Fé, Itupeva-SP, 13295-570, BR
- business: Avenida Itacira, 2689, Planalto Paulista, São Paulo-SP, 04061-003, BR


---


# Mundo Político — Blog Posts (19 articles, itemized)
<!-- classification: PUBLIC -->
<!-- schema_type: Blog → BlogPosting -->

- blog_url: https://mundopolitico.com.br/
- blog_schema_id: https://mundopolitico.com.br/#blog
- author_page: https://mundopolitico.com.br/artigos/autor/ulisses-flores
- inLanguage: pt-BR
- total_articles: 19

> **URL Strategy:** `@id` anchored at ulissesflores.com (semantic identity); `url` points to
> mundopolitico.com.br (actual resource location). The generator must produce both.

| # | datePublished | headline_pt-BR | url |
|:--|:---|:---|:---|
| 1 | 2026-01-15 | Campanha do governo Lula para reconstruir confiança no Pix: detalhes e impactos | https://mundopolitico.com.br/campaigno-do-governo-lula-para-reconstruir-confianca-no-pix-detalhes-e-impactos |
| 2 | 2026-01-15 | Conflito nas redes sociais: moderação de conteúdo vs. liberdade de expressão | https://mundopolitico.com.br/conflito-nas-redes-sociais-moderacao-de-conteudo-versus-liberdade-de-expressao |
| 3 | 2026-01-15 | Desaprovação de Lula cresce no Nordeste: mudanças na lealdade política | https://mundopolitico.com.br/desaprovacao-de-lula-cresce-no-nordeste-mudancas-na-lealdade-politica |
| 4 | 2026-01-15 | Pacote fiscal de Lula: expectativas e desafios para a economia brasileira | https://mundopolitico.com.br/pacote-fiscal-de-lula-expectativas-e-desafios-para-a-economia-brasileira-em-2023 |
| 5 | 2026-01-15 | Preservação de valores tradicionais na era da diversidade | https://mundopolitico.com.br/preservacao-de-valores-tradicionais-na-era-da-diversidade |
| 6 | 2026-01-16 | Análise das consequências dos perdões de Trump e paralelos com o Brasil | https://mundopolitico.com.br/analise-das-consequencias-dos-perdoes-de-trump-e-paralelos-com-o-brasil |
| 7 | 2026-01-16 | Discrepâncias no Brasil: análise crítica da economia e política atuais | https://mundopolitico.com.br/discrepancias-no-brasil-analise-critica-da-economia-e-politica-atuais |
| 8 | 2026-01-16 | Insatisfação popular cresce: como um vídeo viral no Instagram expõe gastos governamentais | https://mundopolitico.com.br/insatisfacao-popular-cresce-como-um-video-viral-no-instagram-explora-gastos-governamentais |
| 9 | 2026-01-16 | Reforma eleitoral no Brasil: necessidade de maior transparência e comparação com os EUA | https://mundopolitico.com.br/reforma-eleitoral-no-brasil-a-necessidade-de-maior-transparencia-e-comparacao-com-os-eua |
| 10 | 2026-01-17 | Fiscalização do Pix: estratégia do governo Lula contra a sonegação | https://mundopolitico.com.br/fiscalizacao-do-pix-estrategia-do-governo-lula-contra-a-sonegacao |
| 11 | 2025-02-20 | Impacto da geopolítica nos mercados: tensões EUA–China e o futuro econômico | https://mundopolitico.com.br/impacto-da-geopolitica-nos-mercados-analise-das-tensoes-eua-china-e-futuro-economico |
| 12 | 2025-02-09 | Combate à inflação no governo Lula: estratégias e impactos nos gastos públicos | https://mundopolitico.com.br/combate-a-inflacao-no-governo-lula-estrategias-e-impactos-nos-gastos-publicos |
| 13 | 2025-02-18 | Governo Lula confronta alta dos preços de alimentos: estratégias e impactos internos | https://mundopolitico.com.br/governo-lula-confronta-alta-dos-precos-de-alimentos-estrategias-e-impactos-internos |
| 14 | 2025-02-18 | Lewandowski desafia EUA sobre deportações algemadas: impacto nas relações Brasil-EUA | https://mundopolitico.com.br/lewandowski-desafia-eua-sobre-deportacoes-algemadas-impacto-nas-relacoes-brasil-eua |
| 15 | 2025-02-17 | Polêmica em Porto Alegre: performance de "Jesus" no Carnaval reacende debate | https://mundopolitico.com.br/polemica-em-porto-alegre-performance-de-jesus-em-carnaval-desperta-debate-sobre-liberdade-e-respeito-religioso |
| 16 | 2025-02-12 | Relação Brasil–EUA: impacto de Trump e Eduardo Bolsonaro na política global | https://mundopolitico.com.br/relacao-brasil-eua-impacto-de-trump-e-eduardo-bolsonaro-na-politica-global |
| 17 | 2025-02-20 | Tancredo Neves e o impacto no 40º aniversário de uma transição democrática | https://mundopolitico.com.br/tancredo-neves-e-o-impacto-no-40o-aniversario-de-uma-transicao-democratica-no-brasil |
| 18 | 2025-02-18 | Vigilância do governo Lula e liberdade de expressão: impacto no Brasil moderno | https://mundopolitico.com.br/vigilancia-do-governo-lula-e-liberdade-de-expressao-impacto-no-brasil-moderno |
| 19 | 2025-02-18 | Análise atual: impacto dos eventos históricos na política contemporânea | https://mundopolitico.com.br/analise-atual-impacto-dos-eventos-historicos-na-politica-contemporanea |

> **NOTE:** All 19 posts now have `datePublished` filled (ISO-8601).
> If the generator encounters any future UNDATED items, it MUST omit `datePublished` (never serialize as empty string).


---


# Sermons & Theological Talks (56 items, itemized)
<!-- classification: PUBLIC -->
<!-- schema_type: Collection → CreativeWorkSeries → Sermon -->

- collection_schema_id: https://ulissesflores.com/#sermons
- publisher_ref: https://ulissesflores.com/#quadrangular-vila-helena
- channel_url: https://www.youtube.com/@quadrangularvilahelena
- inLanguage: pt-BR (all sermons; no translations applicable)
- period: Jul 2022 – Feb 2023
- total: 56

> **URL Strategy:** `@id` anchored at ulissesflores.com; `url` should point to individual
> YouTube video URLs when available.

## Collection: Jejum da Vitória 2023 (21 devotionals)
- series_schema_id: https://ulissesflores.com/#sermons#jejumdavitoria

| # | name_pt-BR | datePublished | youtube_url |
|:--|:---|:---|:---|
| 1 | Dia 1 — O Despertar da Fé | 2023-01-02 | https://www.youtube.com/watch?v=NLAIyBqC4HU |
| 2 | Dia 2 — Vencendo as Batalhas da Mente | 2023-01-03 | https://www.youtube.com/watch?v=9YY1_EbBk_o |
| 3 | Dia 3 — A Resiliência do Cristão | 2023-01-04 | https://www.youtube.com/watch?v=UD8W6bm_nys |
| 4 | Dia 4 — Quebrando as Muralhas Pela Oração | 2023-01-05 | https://www.youtube.com/watch?v=x4C_bJBXmAE |
| 5 | Dia 5 — O Poder da Unidade | 2023-01-06 | https://www.youtube.com/watch?v=TLNNov8cBPs |
| 6 | Dia 6 — Restituição Divina | 2023-01-07 | https://www.youtube.com/watch?v=mtkDxX2XiEU |
| 7 | Dia 7 — A Plenitude do Espírito | 2023-01-08 | https://www.youtube.com/watch?v=jv0PsLg8cho |
| 8 | Dia 8 — Tempo de Renovo | 2023-01-09 | https://www.youtube.com/watch?v=XODx3VUZp1Y |
| 9 | Dia 9 — Frutos de Uma Vida com Deus | 2023-01-10 | https://www.youtube.com/watch?v=3jLWYAOdorE |
| 10 | Dia 10 — Autoridade Espiritual | 2023-01-11 | https://www.youtube.com/watch?v=CC4pY7oXU3w |
| 11 | Dia 11 — A Força da Palavra | 2023-01-12 | https://www.youtube.com/watch?v=wiK8Ckj24XQ |
| 12 | Dia 12 — Alinhamento Profético | 2023-01-13 | https://www.youtube.com/watch?v=i4pcggtnSko |
| 13 | Dia 13 — Ousadia para Romper Limites | 2023-01-14 | https://www.youtube.com/watch?v=PLXuFzpR6XY |
| 14 | Dia 14 — A Recompensa da Fidelidade | 2023-01-15 | https://www.youtube.com/watch?v=ui-xDNtmpYw |
| 15 | Dia 15 — Proteção e Escudo | 2023-01-16 | https://www.youtube.com/watch?v=iZSbu2u0ORo |
| 16 | Dia 16 — Avançando em Meio às Oposições | 2023-01-17 | https://www.youtube.com/watch?v=7jXjSGKuaEs |
| 17 | Dia 17 — Celebração Antecipada | 2023-01-18 | https://www.youtube.com/watch?v=B_q2gnCx6H0 |
| 18 | Dia 18 — Destravando Promessas | 2023-01-19 | https://www.youtube.com/watch?v=e2e_npI5Tqg |
| 19 | Dia 19 — O Fogo Que Não se Apaga | 2023-01-20 | https://www.youtube.com/watch?v=7F2l5DD3NuM |
| 20 | Dia 20 — Preparando o Altar | 2023-01-21 | https://www.youtube.com/watch?v=Yt7HU3NwJAw |
| 21 | Dia 21 — O Selo da Vitória | 2023-01-22 | https://www.youtube.com/watch?v=qLH3tloXWXE |



## Collection: Cultos Online (27 services)
- series_schema_id: https://ulissesflores.com/#sermons#cultosonline

| # | name_pt-BR | datePublished | youtube_url |
|:--|:---|:---|:---|
| 1 | Presença e Avivamento | 2022-10-30 | https://www.youtube.com/watch?v=Y7A6q62VpJM |
| 2 | O Chamado Inabalável — 07/08/22 | 2022-08-07 | https://www.youtube.com/watch?v=6fRWwVcf-k0 |
| 3 | Firmes na Promessa — 14/08/22 | 2022-08-14 | https://www.youtube.com/watch?v=BdLM6uzBFgI |
| 4 | A Importância da Intimidade — 18/08/2022 | 2022-08-18 | https://www.youtube.com/watch?v=Wc2WCYiM3Gc |
| 5 | Construindo Uma Vida com Propósito — 21/08/2022 | 2022-08-21 | https://www.youtube.com/watch?v=TyHh01KaXGw |
| 6 | Restaurando o Altar — 25/08/2022 | 2022-08-25 | https://www.youtube.com/watch?v=u1v4oAamxUg |
| 7 | O Agir Invisível de Deus — 28/08/2022 | 2022-08-28 | https://www.youtube.com/watch?v=cOZnirlxr8U |
| 8 | Atravessando Tempestades com Fé — 04/09/2022 | 2022-09-04 | https://www.youtube.com/watch?v=4Hg6UHYXENY |
| 9 | O Perdão que Liberta — 11/09/2022 | 2022-09-11 | https://www.youtube.com/watch?v=pTAJOi1--tY |
| 10 | Vencendo o Medo Pela Graça — 15/09/2022 | 2022-09-15 | https://www.youtube.com/watch?v=ariz4Xm4lks |
| 11 | Chamados Para Fazer a Diferença — 18/09/2022 | 2022-09-18 | https://www.youtube.com/watch?v=4lxzEWZ4AN8 |
| 12 | Batismo nas águas: Nova Vida em Cristo — 25/09/2022 | 2022-09-25 | https://www.youtube.com/watch?v=D6pF7ZMa9UM |
| 13 | Semeando em Boa Terra — 02/10/2022 | 2022-10-02 | https://www.youtube.com/watch?v=Xl95QoBBQdo |
| 14 | A Cruz e o Seu Significado Hoje — 23/10/2022 | 2022-10-23 | https://www.youtube.com/watch?v=kQIEbtM57Go |
| 15 | Caminhando em Sobrenaturalidade — 06/11/2022 | 2022-11-06 | https://www.youtube.com/watch?v=YQrIOabiMoQ |
| 16 | Identidade: Quem Somos em Cristo? — 13/11/2022 | 2022-11-13 | https://www.youtube.com/watch?v=CJPxc-6fy04 |
| 17 | Cultivando um Coração Grato — 20/11 | 2022-11-20 | https://www.youtube.com/watch?v=kaKPhbBvo04 |
| 18 | Renovando as Forças no Altar — 27/11/2022 | 2022-11-27 | https://www.youtube.com/watch?v=vhFhr1Qxyw4 |
| 19 | A Esperança Que Não Decepciona — 04/12/2022 | 2022-12-04 | https://www.youtube.com/watch?v=s5oh63j0Itc |
| 20 | Preparando o Coração Para o Novo Ano — 11/12/2022 | 2022-12-11 | https://www.youtube.com/watch?v=gkeiRaXiCMI |
| 21 | Fortalecendo as Bases da Fé — 15/01/2023 | 2023-01-15 | https://www.youtube.com/watch?v=aSSpJn9ggaw |
| 22 | O Agir do Espírito em Nossas Vidas — 22/01/2023 | 2023-01-22 | https://www.youtube.com/watch?v=O9HCFQI4rK4 |
| 23 | Aprendendo a Ouvir a Voz de Deus — 29/01/2023 | 2023-01-29 | https://www.youtube.com/watch?v=WYOYxtc5OUM |
| 24 | Comunhão e Crescimento Espiritual — 05/02/2023 | 2023-02-05 | https://www.youtube.com/watch?v=t9wESfLpYrc |
| 25 | Quebrando Cadeias Invisíveis — 12/02/2023 | 2023-02-12 | https://www.youtube.com/watch?v=iLDmtOS8DT4 |
| 26 | Viver em Santidade no Século XXI — 19/02/2023 | 2023-02-19 | https://www.youtube.com/watch?v=Dtli1GcgBKA |
| 27 | Festival de dança: Expressão de Adoração e Arte Profética | 2022-08-20 | https://www.youtube.com/watch?v=wN4FlJtEHuY |

## Collection: Cultos (3 services)
- series_schema_id: https://ulissesflores.com/#sermons#cultos

| # | name_pt-BR | datePublished | youtube_url |
|:--|:---|:---|:---|
| 1 | Restaurando o Primeiro Amor — 24/07/22 | 2022-07-24 | https://www.youtube.com/watch?v=rm5_xlw-JH4 |
| 2 | O Poder Transformador da Graça — 31/07/22 | 2022-07-31 | https://www.youtube.com/watch?v=SJ_8fliMJoE |
| 3 | Culto regional de casais: Edificando a Família Sobre a Rocha — 03/09/2022 | 2022-09-03 | https://www.youtube.com/watch?v=ny5D6FRIUgo |

## Collection: Outros (5 specials)
- series_schema_id: https://ulissesflores.com/#sermons#outros

| # | name_pt-BR | datePublished | youtube_url |
|:--|:---|:---|:---|
| 1 | Janeiro Profético: Consagrando o Novo Ano (Dia 1) — 01/01/2023 | 2023-01-01 | https://www.youtube.com/watch?v=YEzeDRZTkDk |
| 2 | Perseverança e Resposta (Dia 8) | 2023-01-08 | https://www.youtube.com/watch?v=eUuMWxIqUFY |
| 3 | O Selo Profético Para os 12 Meses de Vitória (Dia 12) | 2023-01-12 | https://www.youtube.com/watch?v=eJRJDpo0V7s |
| 4 | O Grande Rompimento: Celebração dos Testemunhos (Dia 40) | 2022-09-21 | https://www.youtube.com/watch?v=Y8vCcqbQgns |
| 5 | Cantata de Natal: O Verbo que se Fez Carne e Habitou Entre Nós — 18/12/2022 | 2022-12-18 | https://www.youtube.com/watch?v=Ci0Bc1TQkN4 |

---


# Provenance & Derivation Specification

## Source-of-Truth Mapping

| UPKF Section | JSON-LD Target | Schema Type |
|:---|:---|:---|
| Core Identity > Canonical Identity | `#person` node | Person |
| Core Identity > Disambiguation | `disambiguatingDescription` | Person |
| Core Identity > Heritage | EXCLUDED from public.jsonld | — |
| Professional Taxonomy > Occupations | `hasOccupation` | Occupation |
| Professional Taxonomy > Experience | `worksFor`, `affiliation` | Organization |
| Academic Background > Degrees | `hasCredential`, `alumniOf` | EducationalOccupationalCredential |
| Skills Taxonomy > Knowledge Domains | `knowsAbout` (DefinedTerm → Wikidata) | DefinedTerm |
| Publications > ORCID Works | Individual nodes | ScholarlyArticle / Report / SoftwareSourceCode |
| Digital Assets > Identifiers | `identifier` | PropertyValue |
| Digital Assets > sameAs | `sameAs` array on Person | — |
| Domain Inventory | `ItemList` of `WebSite` nodes | WebSite |
| Mundo Político > Posts | `BlogPosting` under `Blog` | BlogPosting |
| Sermons > Items | `Sermon` under `Collection` | Sermon |

## Deterministic Derivation Rules

1. **Dates:** ISO-8601 (`YYYY-MM-DD`). Fields marked `PENDING` → omit from JSON-LD (do not fabricate).
2. **Names:** Preserve `canonical_legal_name` + `preferred_name` + `alternate_names`.
3. **Do not infer.** If not explicit in this file, omit from JSON-LD.
4. **Third-party graphs** (Wikidata, etc.) are weak signals unless referenced by strong anchors.
5. **Multilingual:** Use `@value` + `@language` arrays. Only serialize languages actually present — never duplicate strings across languages.
6. **Classification:** Respect `PUBLIC/PRIVATE/RESTRICTED` markers. Generator must support `--mode=public|private|full`.
7. **Trust signal triangulation:** CNPJ (government) + Lattes (academic) + DOI (scientific) = high-confidence entity.
8. **URL strategy:** `@id` = semantic anchor at ulissesflores.com; `url` = actual resource location (may differ).

## Derivation Architecture

```
┌─────────────────────┐
│  THIS FILE (.md)    │  ← Human edits HERE (canonical source)
│  UPKF v3.3          │
└────────┬────────────┘
         │ parse
         ▼
┌─────────────────────┐
│  Generator Script   │  ← JSON-LD serialization rules live HERE
│  (upkf-to-jsonld)   │     W3C TR/json-ld conformance
│                     │     @context, @graph, @id, @type
│                     │     @value/@language arrays
└────────┬────────────┘
         │ --mode=public|private|full
         ▼
┌─────────────────────────────────────────┐
│  public.jsonld   │  private.jsonld  │  full.jsonld  │
│  (deploy to site) │  (internal only) │  (never deploy)│
└──────────────────┴──────────────────┴───────────────┘
```

## Validation Checklist (for JSON-LD derivation)

- [ ] Google Rich Results Test: https://search.google.com/test/rich-results
- [ ] Schema Markup Validator: https://validator.schema.org/
- [ ] JSON-LD Playground: https://json-ld.org/playground/
- [ ] Verify all `sameAs` URLs resolve (HTTP 200)
- [ ] Verify all DOI links resolve (doi.org → Zenodo)
- [ ] Confirm `credentialStatus` for MSc is "InProgress"
- [ ] Confirm `disambiguatingDescription` mentions Oscar Ulisses Flores Ruiz in all 5 languages
- [ ] Confirm PENDING fields are OMITTED (not serialized as empty strings)
- [ ] Confirm Heritage section is EXCLUDED from public.jsonld
- [ ] Confirm Contact Points are EXCLUDED from public.jsonld
- [ ] Run JSON Schema validation on generated output
- [ ] Verify all `schema_id` references resolve within the graph (no orphans)
- [ ] Verify all `parentOrganization_ref` and `institution_ref` resolve to defined nodes
- [ ] Verify all `institution_url` and `institution_sameAs` resolve (HTTP 200)
- [ ] Verify all Web3 explorer URLs resolve to correct addresses
- [ ] Verify notSameAs properties are serialized as additionalProperty on Person node
- [ ] Verify UNDATED items have NO datePublished in output
- [ ] Verify PENDING items have NO field serialized in public mode
- [ ] Verify default-deny PII fields (email/phone/address) are stripped in public mode
- [ ] Generate and attach JWS detached signature for public.jsonld
- [ ] Verify all `verify_url` links resolve (HTTP 200) for certificates
- [ ] Verify top 10 publications have EN/ES title translations in output
- [ ] Verify Jejum da Vitória dates (2023-01-02 through 2023-01-22) match 21-day series

## Changelog

### v3.3 (2026-02-21)
- **NEW:** All 32 Alura certifications now have individual `verify_url` (full dereferenceable URLs)
- **NEW:** edX certification now has `verify_url`
- **NEW:** SOTA mapping note for `verify_url` → Schema.org `url` on `EducationalOccupationalCredential` + W3C VC alignment
- **NEW:** Top 10 disruptive publications translated to EN and ES (cross-disciplinary selection)
- **NEW:** Jejum da Vitória 21 devotionals: ISO dates assigned (2023-01-02 through 2023-01-22)
- **NEW:** Validation checklist expanded to 23 items
- **FIX:** PENDING/UNDATED contract contradiction resolved — per-mode rules now unambiguous (public: omit both; private: serialize PENDING, omit UNDATED; full: serialize all)
- **FIX:** "No file hashes" policy clarified — transient digests for JWS signing are permitted; no standalone manifests stored
- **FIX:** Derivation diagram updated from v3.1 → v3.3
- **FIX:** Footer updated from v3.1 → v3.3

### v3.2 (2026-02-21)
- **NEW:** Default-deny PII policy — email/phone/address/genealogy are PRIVATE by default
- **NEW:** Build mode contracts with explicit field exclusion rules per mode
- **NEW:** PENDING vs UNDATED semantics formalized in governance section
- **NEW:** Integrity policy — JWS detached signature spec (RFC 7515) for published JSON-LD
- **NEW:** All Web3 identifiers now have verifiable explorer URLs (etherscan, mempool.space, ENS app, IPFS dweb gateway, basescan, Keybase PGP, Gitcoin Passport)
- **NEW:** Ethereum Base L2 identifier added (same address, basescan explorer)
- **NEW:** Institution URLs added: AGTU, Padre Anchieta, UNIP, CEFOR, California College San Diego
- **NEW:** Institution Wikidata sameAs added: FIAP (Q10269779), UNIP (Q2301653), Edinburgh (Q160302)
- **NEW:** Sub-organizations (Research/Labs/Education) now have 5-language descriptions (pt-BR/en/es/he/it)
- **NEW:** Instituto Clube Santo: 5-language description + URL
- **NEW:** Structured negative identity claims (notSameAs) with 4 explicit negative assertions
- **NEW:** Provenance attribution block for publications (source + retrieval date)
- **NEW:** Sermon tables now include datePublished column (29 ISO dates, 21 year-level, 6 UNDATED)
- **NEW:** Validation checklist expanded to 21 items (from 13 in v3.1)
- **FIX:** Blog posts without dates changed from PENDING to UNDATED (honest: no source has these dates)
- **FIX:** Duplicate "Collection: Outros" editorial error removed
- **FIX:** Generator MUST omit UNDATED/PENDING fields (never serialize as empty string)
- **FIX:** "Culto online — 20/11" resolved to 2022-11-20

### v3.1 (2026-02-20)
- **NEW:** Data classification policy (PUBLIC/PRIVATE/RESTRICTED) with build modes
- **NEW:** All 19 Mundo Político posts itemized with URLs and dates (9 dates PENDING)
- **NEW:** All 56 sermons itemized by collection with youtube_url placeholder (PENDING)
- **NEW:** Sub-organizations (Research/Labs/Education) promoted to first-class nodes with schema_id + parentOrganization_ref
- **NEW:** Publications enriched with datePublished, inLanguage, type indicator per item
- **NEW:** Derivation architecture diagram (MD → Generator → JSON-LD)
- **NEW:** schema_id added to all roles, occupations, and credentials
- **NEW:** institution_ref cross-references added to all academic entries
- **NEW:** Multilingual fields normalized as objects `{ pt-BR: ..., en: ..., es: ... }` instead of flat `_pt-BR` suffixes
- **NEW:** Extended validation checklist (13 items vs. 7 in v3.0)
- **FIX:** Silk Road Vault description now includes EN and ES translations
- **FIX:** Research projects now include output_refs linking to software artifacts
- **FIX:** Heritage section explicitly marked PRIVATE
- **FIX:** Contact points and addresses explicitly marked PRIVATE

### v3.0 (2026-02-20)
- Initial sovereign UPKF merge from 5 source files
- 40/40 ORCID works mapped
- 15/15 domains inventoried
- 32 Alura certifications with UUIDs
- 5-language disambiguation firewall
- Odysseus metaphor and Palau Pledge motto
- Genealogical audit (3 clusters)

---

*End of Sovereign UPKF v3.3 — Generated 2026-02-21.*
*This file is the canonical source of truth. All JSON-LD must be derived from it.*
*JSON-LD serialization rules belong in the generator, not in this file.*
