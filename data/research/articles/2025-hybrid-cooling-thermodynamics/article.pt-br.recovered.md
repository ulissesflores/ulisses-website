# Relatório Técnico Avançado: Análise Termodinâmica, Econômica e de Engenharia de Sistemas Híbridos de Resfriamento em Edificações Residenciais Tropicais

**Autor:** Ulisses Flores — Codex Hash Research Laboratory

# Introdução

A gestão do conforto térmico em residências unifamiliares situadas em climas tropicais e subtropicais, como o predominante no território brasileiro, transcendeu a mera busca por bem-estar para se tornar uma questão de saúde pública e viabilidade econômica. Com o registro de verões sucessivamente mais quentes — o verão de 2024/2025 foi classificado como o sexto mais quente desde 1961, com anomalias de temperatura significativas no Rio Grande do Sul e outras regiões — a dependência de sistemas de climatização mecânica (Ar Condicionado - AC) impõe uma carga financeira insustentável para muitas famílias e uma pressão crítica sobre a infraestrutura elétrica nacional.

Este relatório técnico foi elaborado para responder a uma demanda específica: projetar, quantificar e validar cientificamente um sistema híbrido de resfriamento para uma residência de 180 m², comparando-o exaustivamente com soluções convencionais. A análise não se limita a estimativas superficiais; ela penetra na física da transferência de calor, na química dos materiais de refletância solar e na engenharia de automação baseada em microcontroladores (ESP32/Arduino), oferecendo um roteiro definitivo para a implementação de uma solução de "Teto Frio" (Cool Roof) assistida por evaporação.

A premissa central investigada é que o telhado atua como o principal vetor de ganho térmico em edificações térreas, absorvendo radiação solar e retransmitindo-a para o interior através de radiação de onda longa e condução. Neutralizar essa carga na fonte — a superfície externa da telha — é termodinamicamente mais eficiente do que remover o calor do ar interno após sua entrada, como fazem os sistemas de ar condicionado.

### Termodinâmica da Cobertura: O Telhado como Coletor de Calor

Em latitudes tropicais, a irradiância solar global em um plano horizontal pode atingir picos de 1.000 W/m². Telhas cerâmicas convencionais (barro vermelho/laranja) possuem uma absortância solar (α) que varia entre 0,65 e 0,85. Isso significa que, de cada 1.000 Watts de energia solar que atingem um metro quadrado de telhado, até 850 Watts são absorvidos e convertidos em calor sensível. A equação do balanço de energia na superfície externa (q_superfície) é dada por q_superfície = α·I_solar − ε·σ·(T_telha⁴ − T_céu⁴) − h_c·(T_telha − T_ar), onde α é a absortância solar, I_solar é a radiação solar incidente, ε é a emissividade térmica do material (capacidade de irradiar calor), T_céu é a temperatura efetiva do céu (frequentemente muito mais fria que o ar) e h_c é o coeficiente de transferência de calor convectivo.

O Fenômeno do Atraso Térmico (Thermal Lag): a massa térmica da cerâmica cria um atraso no fluxo de calor. O pico de temperatura interna não ocorre ao meio-dia, mas horas depois, frequentemente coincidindo com o momento em que os ocupantes retornam para casa. Estudos indicam que materiais de alta densidade, como concreto e cerâmica, podem atrasar o pico de calor em 3 a 8 horas. Isso invalida a estratégia de ligar o resfriamento apenas quando o ar interno esquenta; nesse momento, a estrutura já está saturada de energia térmica (gigajoules de calor armazenado).

### Resfriamento Radiativo Diurno Passivo (PDRC)

O "estado da arte" em redução de temperatura superficial reside no Resfriamento Radiativo Diurno Passivo (PDRC). Esta tecnologia utiliza materiais que refletem intensamente a luz solar (visível e infravermelho próximo) e, simultaneamente, emitem calor fortemente na janela de transparência atmosférica (8–13 μm), permitindo que o calor escape diretamente para o espaço sideral, atravessando a atmosfera sem ser absorvido. Pesquisas da Universidade de Purdue demonstraram que tintas baseadas em Sulfato de Bário (BaSO₄) em alta concentração (60%) podem atingir refletâncias de 98,1%, mantendo superfícies até 4,5°C abaixo da temperatura ambiente sob sol direto. Diferente do dióxido de titânio (TiO₂) comum em tintas brancas, que absorve UV e aquece, o sulfato de bário reflete UV, maximizando o resfriamento. No Brasil, embora tintas comerciais de BaSO₄ de alta pureza ainda sejam raras, a aplicação de tintas térmicas brancas convencionais já reduz a temperatura superficial de 70°C para cerca de 40°C.

### Resfriamento Evaporativo: A Potência da Água

O resfriamento evaporativo baseia-se na mudança de fase da água. O calor latente de vaporização da água é extremamente alto (≈ 2.260 kJ/kg). Ao pulverizar água sobre uma telha a 60°C, a água absorve calor da telha para evaporar; a temperatura da telha tende a cair em direção à Temperatura de Bulbo Úmido (TBU) do ar local; e em um dia de 34°C e 50% de umidade relativa, a TBU é de aproximadamente 26°C. Estudos práticos no Brasil (Campinas e Nordeste) confirmam que a aspersão de água em telhados de fibrocimento e cerâmica pode reduzir a temperatura interna do teto em até 18,6°C e a temperatura do ar interno em até 5,1°C, dependendo do isolamento.

## Metodologia

Projetaremos um sistema para uma residência de 180 m² de área construída. Assumindo beirais e inclinação, a área real de telhado a ser tratada aproxima-se de 230 m². O sistema híbrido é composto por dois subsistemas: Passivo (Pintura) e Ativo (Nebulização Controlada).

### Subsistema Passivo: Revestimento de Alta Refletância

Antes de qualquer automação, a superfície deve ser preparada para rejeitar calor passivamente. Na Opção A (Tinta Térmica Comercial, alta durabilidade), produtos como a Metalatex Eco Telha Térmica (Sherwin Williams) ou Maxithermic possuem microesferas cerâmicas e resinas acrílicas que garantem refletância e durabilidade. Uma lata de 18L cobre aprox. 180 m² por demão; para 230 m² e 2 demãos (recomendado para cobrir a cor cerâmica), serão necessárias 3 latas de 18L, a um custo estimado de R$ 600,00 a R$ 800,00 por lata (total: R$ 1.800,00 a R$ 2.400,00).

Na Opção B (Receita Caseira Otimizada, baixo custo/manutenção alta), baseada em práticas de "caiação" melhorada e nos princípios de PDRC simplificados, os ingredientes incluem uma base de Cola Branca PVA de alta qualidade ou Resina Acrílica (melhor); pigmento de Cal Hidratada (Carbonato de Cálcio) ou Sulfato de Bário Precipitado (este último oferece desempenho superior, mas a Cal é amplamente acessível); e aditivos de Óleo de Linhaça (hidrorrepelente) e Cimento Branco (resistência mecânica). A receita base, em proporção, é 8kg de Cal + 1kg de Cimento Branco + 1L de Cola PVA + 150ml de Óleo de Linhaça + 16L de Água. O custo de materiais para cobrir 230 m² (múltiplas demãos) seria inferior a R$ 400,00. A contrapartida é a baixa resistência à chuva ácida e abrasão, exigindo repintura anual; a refletância inicial é alta (~85%), mas decai rapidamente com a sujeira se não houver resina acrílica de qualidade. Para um sistema híbrido onde haverá água constante (nebulização), a tinta caseira simples pode lixiviar rapidamente; recomenda-se o uso de tinta acrílica comercial ou, no mínimo, a adição de resina acrílica à mistura caseira em vez de apenas cola PVA.

### Subsistema Ativo: Nebulização de Alta Pressão

Não utilizaremos aspersores de jardim comuns (que gastam muita água e molham o chão). O sistema deve criar uma névoa (mist) que evapore no ar ou ao tocar a telha quente. Para o dimensionamento hidráulico de 230 m² de telhado, recomenda-se uma malha de bicos na cumeeira e nas águas do telhado, com espaçamento de um bico a cada 1,5 a 2,0 metros lineares ou distribuídos em áreas de 6-8 m² por bico, estimando-se entre 30 a 40 bicos para cobertura total. Os bicos recomendados são de Latão com orifício de 0.3mm — bicos de 0.2mm entopem muito fácil e os de 0.5mm gastam muita água, sendo o 0.3mm o "ponto ideal" (sweet spot). As conexões usam Tubo de PU (Poliuretano) 8mm ou 1/4" de alta pressão (preto, para resistir a UV), com conectores "Slip-Lock" para facilitar a montagem.

A bomba de pressurização é necessária porque bicos de 0.3mm precisam de pressão para atomizar (mínimo 60 PSI, ideal 100+ PSI); bombas de aquário ou da rede de rua não funcionam bem. O modelo recomendado é uma Bomba de Diafragma 12V de 100 PSI (6.8 Bar), com vazão de 4 a 6 Litros/minuto, comumente usadas em pulverizadores agrícolas ou marine washdown, alimentada por uma fonte chaveada 12V 10A.

### Automação Inteligente (O Cérebro do Sistema)

A eficiência depende do controle: molhar um telhado frio é desperdício; molhar um telhado muito quente sem controle causa choque térmico. A solução mais robusta e acessível atualmente é baseada no chip ESP32 (Wi-Fi + Bluetooth), preferencialmente encapsulado em produtos comerciais como a linha Sonoff TH Elite, que já possui relés de alta potência, tela LCD e certificação elétrica. O controlador principal é o Sonoff TH Elite (THR316D), versão 16A ou 20A com contato seco. O sensor de temperatura é o DS18B20 (Waterproof), digital, preciso e extensível com cabos; sua instalação é crítica: o sensor não deve medir a temperatura do ar, mas ser fixado na superfície da telha com pasta térmica e coberto com fita de alumínio/isolante para ler a temperatura da telha e evitar a leitura direta do sol. Um módulo sensor de chuva simples (R$ 15,00) conectado ao ESP32 impede o acionamento em dias chuvosos.

A lógica de controle adota um algoritmo de histerese com ciclo de trabalho, cujo objetivo é manter a telha úmida o suficiente para evaporar sem escorrer água pelas calhas. O pseudocódigo para ESPHome ou Arduino define uma temperatura de gatilho para ligar (TEMP_GATILHO_LIGAR = 32.0°C, quando a telha começa a aquecer), uma temperatura de gatilho para desligar (TEMP_GATILHO_DESLIGAR = 28.0°C, próxima à temperatura de bulbo úmido), um tempo de pulso ligado (TEMPO_PULSO_ON = 45 segundos de spray) e um tempo de pulso desligado (TEMPO_PULSO_OFF = 10 minutos de evaporação, ajustável). No loop de controle, o sistema lê o sensor DS18B20 e o sensor de chuva; como condição de segurança, se chover, a bomba é desligada e o ciclo interrompido. Na lógica de resfriamento, se a temperatura da telha for maior ou igual ao gatilho de ligar, o sistema entra em modo de ciclo intermitente, acionando a bomba, esperando o tempo de pulso ON, desligando a bomba e aguardando o tempo de pulso OFF para a água evaporar e roubar calor; se a temperatura cair abaixo do alvo de desligar, os ciclos são interrompidos. Essa lógica intermitente (1 min ON / 10 min OFF) economiza 90% da água comparada a um sistema contínuo e evita o choque térmico, pois a água é aplicada em uma superfície que já está sendo mantida fresca (o sistema liga aos 32°C, impedindo que a telha chegue a 70°C).

## Resultados

Aqui confrontamos a realidade econômica do sistema híbrido versus a climatização mecânica (AC) para uma casa de 180 m².

Quanto ao custo de implementação (CapEx), a solução de Ar Condicionado (parcial) — composta por 3 splits de 12.000 BTU para os quartos, 1 split de 30.000 BTU para a sala, mais instalação e elétrica, cobrindo cerca de 90 m² climatizados — custa entre R$ 16.500,00 e R$ 19.000,00. O Sistema Híbrido na versão DIY completa — bomba 12V (R$ 150), kit de 40 bicos de latão e tubos (R$ 400), Sonoff e sensores (R$ 350), pintura caseira (R$ 500) e acessórios (R$ 200) — custa cerca de R$ 1.600,00. O Sistema Híbrido na versão Pro/Comercial — hardware de nebulização (R$ 1.100), tinta térmica comercial (R$ 2.400) e automação (R$ 450) — custa cerca de R$ 3.950,00. Em conclusão, o sistema híbrido profissional custa de 20% a 25% do valor de instalação de ar condicionado para cobrir a mesma área.

O custo operacional mensal (OpEx) é a comparação mais crítica a longo prazo. No cenário de Ar Condicionado, estima-se conservadoramente um consumo de 600 kWh/mês para climatizar 180 m² em um verão quente; com uma tarifa de energia (SP 2025) de aproximadamente R$ 1,10/kWh (base de R$ 0,72 + impostos + Bandeira Vermelha P2 de ~R$ 0,078), o custo mensal de energia é de 600 × 1,10 = R$ 660,00. No cenário do Sistema Híbrido (água + energia da bomba), o consumo de água parte de 35 bicos × 3 L/h (vazão máxima) = 105 L/h em fluxo contínuo, mas o regime de ciclo (1 min ON / 9 min OFF) reduz o uso a 10%, resultando em consumo real de 10,5 litros por hora de operação; considerando 8h de sol por dia × 30 dias = 240 horas, o total de água é de 10,5 × 240 = 2.520 litros/mês (2,52 m³). Ao custo marginal da Sabesp de ~R$ 8,00/m³ (água + esgoto), o custo da água é de 2,52 × 8,00 = R$ 20,16. A energia da bomba (12V 5A = 60W), ligada por 24 horas totais no mês (10% de 240h), consome 0,06 kW × 24 h = 1,44 kWh, a um custo de R$ 1,58. O custo mensal total do sistema híbrido é, portanto, de 20,16 + 1,58 = R$ 21,74.

No comparativo de custos acumulados em 5 anos, a linha do AC começa em R$ 18.000 (instalação) e sobe com uma inclinação íngreme (R$ 660/mês); em 5 anos, o custo total de propriedade (TCO) ultrapassa R$ 57.000,00. A linha híbrida começa em R$ 4.000 (instalação pro) e sobe quase horizontalmente (R$ 22/mês); em 5 anos, o TCO é de aproximadamente R$ 5.300,00. A economia é superior a 90% no custo mensal e 90% no custo total de propriedade em 5 anos.

## Recomendações

Aplicar Ventilação Noturna (Night Flushing): utilizar exaustores eólicos ou mecânicos controlados pelo mesmo sistema (ESP32) para trocar todo o ar da casa entre 02:00 e 05:00 da manhã, aproveitando a amplitude térmica diária para "resetar" a massa térmica das paredes e lajes — o que pode reduzir a temperatura de pico diurno em até 3°C adicionais.
Instalar Barreiras Radiantes no Ático: além de pintar a telha por fora, instalar uma manta térmica aluminizada (foil) sob o telhado (subcobertura) para refletir os 5-10% de calor que ainda passarem pela telha, criando uma segunda linha de defesa de baixo custo (R$ 5,00 a R$ 10,00/m²), com eficiência aumentada quando combinada com a ventilação do ático.
Considerar Materiais de Mudança de Fase (PCM) como estado da arte futuro: PCMs encapsulados no forro ou nas paredes (como parafinas especiais) derretem a 24°C, absorvendo grandes quantidades de calor latente sem aumentar a temperatura do ambiente, e solidificam novamente quando a ventilação noturna entra, liberando o calor para fora.

# Conclusão

A análise científica e econômica demonstra inequivocamente que, para o contexto de uma residência de 180 m² no Brasil, a dependência exclusiva de ar condicionado é financeira e energeticamente ineficiente. O sistema híbrido (Pintura Reflexiva + Nebulização Controlada) não é uma "gambiarra", mas uma aplicação robusta de princípios termodinâmicos avançados. Em resumo de eficiência: a temperatura do telhado é reduzida de ~70°C para ~28°C-30°C; a temperatura interna tem redução estimada de 6°C a 10°C, dependendo da ventilação e isolamento complementar; e o custo mensal é de ~R$ 22,00 (Híbrido) contra ~R$ 660,00 (AC).

O roteiro prático de implementação prevê: na semana 1 (imediato), aplicar tinta térmica branca (comercial ou caseira com resina) em todo o telhado e instalar manta térmica sob as telhas se houver acesso ao ático; na semana 2 (hardware), adquirir bomba 12V 100PSI, 40 bicos de latão 0.3mm, tubulação PU 8mm, Sonoff TH Elite e sensor DS18B20; na semana 3 (instalação), montar a linha de nebulização na cumeeira, colar o sensor na telha e configurar a automação no app eWeLink/ESPHome com a lógica de histerese (ligar acima de 32°C); e, de forma contínua (otimização), ajustar os tempos de pulso (spray) para garantir que a água evapore antes de escorrer para a calha.

# Referencias

- Verão 2024/2025 foi um dos mais quentes da história no Brasil desde 1961 - Portal Gov.br, https://www.gov.br/secom/pt-br/assuntos/noticias/2025/03/verao-2024-2025-foi-um-dos-mais-quentes-da-historia-no-brasil-desde-1961
- Verão 2024-2025 foi o sexto mais quente no Brasil desde 1961 - INMET, https://portal.inmet.gov.br/noticias/
- Otimização de Resfriamento de Ambientes.pdf
- Temperature Damping & Thermal Lag - CMACN, https://cmacn.org/energy/basics/thermal-movements/temperature-damping-thermal-lag/
- Thermal Lag - Calculating Heat Loss Into the Ground - One Community Global, https://onecommunityglobal.org/thermal-lag/
- Cooling Performance of TiO2-Based Radiative Cooling Coating in Tropical Conditions - ACS Omega, https://pubs.acs.org/doi/10.1021/acsomega.4c07223
- Radiative sky cooling: Fundamental principles, materials, and applications - AIP Publishing, https://pubs.aip.org/aip/apr/article/6/2/021306/570227/Radiative-sky-cooling-Fundamental-principles
- The whitest paint is here – and it's the coolest. Literally. - Purdue University News, https://www.purdue.edu/newsroom/archive/releases/2021/Q2/the-whitest-paint-is-here-and-its-the-coolest.-literally..html
- Tintas Reflexivas para Telhados: Combate ao Calor - Blog Moderna Telhados, https://modernatelhados.com.br/blog/tintas-reflexivas-para-telhados-combate-ao-calor
- Cool Roofs in Hot Climate Countries: a Study - Sika, https://www.sika.com/en/knowledge-hub/cool-roofs-in-hot-climate.html
- Study of Evaporative Cooling Roofing in Sub-tropical Climate - UFS, https://dau.ufs.br/uploads/page_attach/path/1119/Barbosa_Teixeira.pdf
- O que é a tinta térmica e ela funciona? - Blog Leroy Merlin, https://blog.leroymerlin.com.br/tinta-termica-funciona/
- Tinta Isolante Termico 18 Lts - Magazine Luiza, https://www.magazineluiza.com.br/busca/tinta+isolante+termico+18+lts/
- Cooling Paint You Can Actually Make - Hackaday, https://hackaday.com/2023/07/03/cooling-paint-you-can-actually-make/
- Pintura à base de cal como alternativa de revestimento frio - SciELO, https://www.scielo.br/j/ac/a/ZvCrp85KbDJR65WW3JvzcHk/
- PAINTING YOUR ROOF AT HOME LIME AND WHITE CEMENT COOLS THE ROOF, https://www.youtube.com/watch?v=jupzU4nohg4
- Pintura com Cal: como preparar e o que fazer para fixar melhor - Sienge, https://sienge.com.br/blog/pintura-com-cal-como-preparar/
- Pintura à base de cal como alternativa de revestimento frio - SciSpace, https://scispace.com/pdf/pintura-a-base-de-cal-como-alternativa-de-revestimento-frio-1ieagnmw26.pdf
- Mist System Nozzle Space - Patio Misting System Installation, https://patiomistingsysteminstallation.com/mist-system-nozzle-space
- Kit de bico de nebulização de pátio - Leroy Merlin, https://www.leroymerlin.pt/produtos/kit-de-bico-de-nebulizacao-de-patio-de-20-pecas-88786588.html
- Motor Pulverizador Eletrico 12v - Mercado Livre, https://lista.mercadolivre.com.br/motor-pulverizador-eletrico-12v
- Motor Bomba Diafragma 12v 3,0ah 100psi Pulverizador Elétrico, https://www.nauticarefrigeracao.com.br/MLB-3933089026
- Fonte 12v 10A - Shopee 2025, https://shopee.com.br/list/Fonte/12v/10A
- SONOFF TH Elite Smart Temperature and Humidity Monitoring Switch - Itead, https://itead.cc/product/sonoff-th-elite-smart-temperature-and-humidity-monitoring-switch/
- Sonoff TH Elite 20A Smart Temperature and Humidity Monitoring Switch - isphome, https://isphome.co.za/shop/works-with-ewelink/sonoff-th-elite/
- Sensor de Temperatura Digital DS18B20 à Prova d'Água - AF Eletrônica, https://www.afeletronica.com.br/sensor-temperatura-digital-ds18b20-encapsulado-prova-de-agua
- Calculadora de consumo de ar-condicionado - Clarke Energia, https://clarke.com.br/calculadora-de-consumo-de-ar-condicionado/
- Qual Consumo Ar-Condicionado 30000 BTUs - WebAr, https://www.webarcondicionado.com.br/qual-o-consumo-de-um-ar-condicionado-de-30-000-btu
- Quanto custa instalar um ar-condicionado em 2025? - Revista Oeste, https://revistaoeste.com/oestegeral/2025/12/19/quanto-custa-instalar-um-ar-condicionado-em-2025-valores-fatores-e-como-economizar/
- Confira o ranking das tarifas de energia mais caras do Brasil em 2025 - Portal Solar, https://www.portalsolar.com.br/noticias/mercado/consumidor/confira-o-ranking-das-tarifas-de-energia-mais-caras-do-brasil-em-2025
- Bandeira Vermelha patamar 2 é mantida em setembro - ANEEL, https://www.gov.br/aneel/pt-br/assuntos/noticias/2025/bandeira-vermelha-patamar-2-e-mantida-em-setembro
- Revisão da Estrutura Tarifária da SABESP - Mziq, https://api.mziq.com/mzfilemanager/v2/d/9e47ee51-f833-4a23-af98-2bac9e54e0b3/e6692b22-95ea-749a-6f9c-58b4e0f5d841
- Night Vent Cooling - 2030 Palette, https://2030palette.org/night-vent-cooling/
- Evaluation of the Effect of Passive Cooling Techniques on Thermal Comfort Using Test Cells in the Northern Region of Brazil - MDPI, https://www.mdpi.com/2076-3417/12/3/1546
- Radiant Barriers - Department of Energy, https://www.energy.gov/energysaver/radiant-barriers
- FAQ's About Reflective Insulation, Radiant Barriers and IRCCs - RIMA-I, https://rimainternational.org/myths/faqs/
- What are the key considerations for integrating phase change materials with building envelopes in tropical climates? - Consensus, https://consensus.app/
- Numerical Assessment of Different Phase Change Materials as a Passive Strategy to Reduce Energy Consumption in Buildings under Tropical Climates - MDPI, https://www.mdpi.com/2075-5309/12/7/906
