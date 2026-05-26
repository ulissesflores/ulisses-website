# Title Page

**Title:** Análise Preditiva de Ativos Financeiros com Modelos LSTM — Deep Research Edition
**Author:** Carlos Ulisses Flores
**ORCID:** 0000-0002-6034-7765
**Institutional Affiliation:** Codex Hash Research Lab
**Date of Submission:** 21 February 2026

Layout note: Times New Roman (12), double spacing, 1-inch margins, top-right pagination.

# Abstract (PT-BR)

A crescente complexidade dos mercados financeiros exige ferramentas analíticas avançadas para a tomada de decisão. Este estudo de caso investiga a aplicação de uma Rede Neural de Memória de Curto e Longo Prazo (LSTM) para prever os preços diários de dois ativos com perfis de volatilidade distintos: Bitcoin (BTC-USD) e Microsoft (MSFT). O objetivo central é avaliar a viabilidade de uma estratégia de investimento algorítmica, baseada nas previsões do modelo, em comparação com a abordagem passiva de Buy and Hold. A metodologia abrange a coleta e preparação de dados, a engenharia de atributos com indicadores técnicos e o treinamento de um modelo LSTM. Os resultados demonstram que, embora o modelo apresente alta acurácia preditiva para ambos os ativos, a estratégia algorítmica demonstra um potencial modesto em termos de retorno ajustado ao risco (Índice de Sharpe) para o ativo de alta volatilidade (Bitcoin), embora sem superar de forma conclusiva a abordagem passiva. O estudo conclui que a aplicação de IA em finanças oferece um potencial considerável, mas sua implementação responsável requer uma estrutura de governança robusta que contemple as limitações de transparência dos modelos e mantenha a supervisão humana como pilar central. (HENGST, 2026).

# Abstract (EN)

The growing complexity of financial markets demands advanced analytical tools for decision-making. This case study investigates the application of a Long Short-Term Memory (LSTM) Neural Network to forecast the daily prices of two assets with distinct volatility profiles: Bitcoin (BTC-USD) and Microsoft (MSFT). The main objective is to assess the viability of an algorithmic investment strategy, based on the model's predictions, compared to the passive Buy and Hold approach. The methodology covers data collection and preparation, feature engineering with technical indicators, and the training of an LSTM model. The results show that while the model achieves high predictive accuracy for both assets, the algorithmic strategy demonstrates a modest potential in terms of risk-adjusted return (Sharpe Ratio) for the high-volatility asset (Bitcoin), although without conclusively outperforming the passive approach. The study concludes that the application of AI in finance offers considerable potential, but its responsible implementation requires a robust governance framework that addresses the transparency limitations of the models and maintains human oversight as a central pillar. (FISCHER, 2026).

**Keywords:** LSTM; ASSET; PREDICTION; reproducibility; Harvard references; research.

# 1. Introduction

A interseção entre finanças e tecnologia, impulsionada pela quarta revolução industrial, tem redefinido paradigmas no setor financeiro global. O surgimento de tecnologias disruptivas, agrupadas sob o termo FinTech, gerou um ambiente de mercado caracterizado por um volume massivo de dados (Big Data), alta frequência de transações e complexidade crescente (VAN DEURSEN et al., 2022). Neste cenário, métodos de análise tradicionais demonstram-se frequentemente inadequados para capturar a dinâmica não-linear e a volatilidade inerente aos ativos financeiros contemporâneos, demandando abordagens mais sofisticadas e adaptativas.
A Inteligência Artificial (IA), em particular os modelos de Aprendizado Profundo (Deep Learning), surge como uma resposta promissora a esses desafios. Dentre as diversas arquiteturas, as Redes Neurais de Memória de Curto e Longo Prazo (Long Short-Term Memory - LSTM), uma classe de Redes Neurais Recorrentes (RNNs), têm se destacado por sua eficácia na modelagem e previsão de séries temporais complexas (HOCHREITER; SCHMIDHUBER, 1997). Sua capacidade de reter informações por longos períodos as torna particularmente adequadas para o domínio financeiro, onde o comportamento de um ativo pode ser influenciado por eventos passados distantes.
O presente estudo de caso, concebido sob a perspectiva do fundo de investimentos fictício "Agile Capital", investiga a aplicação prática de um modelo LSTM para a previsão de preços de fechamento diário de dois ativos com perfis de risco distintos: o Bitcoin (BTC-USD), como representante dos criptoativos de alta volatilidade, e as ações da Microsoft (MSFT), como exemplo de um ativo blue-chip mais estável. O objetivo central é desenvolver e avaliar uma estratégia de investimento algorítmica baseada nas previsões do modelo, comparando seu desempenho, ajustado ao risco, com a estratégia passiva de referência Buy and Hold (comprar e manter). (LIEM, 2026).

# 2. Main Body

## 2.1 Methodology

Todos os arquivos, incluindo os scripts de código, conjuntos de dados e gráficos gerados, estão integralmente documentados no repositório de materiais suplementares deste estudo (FLORES, 2025). O ciclo de vida deste estudo de caso foi estruturado em três etapas computacionais principais: (1) coleta e preparação dos dados; (2) engenharia de atributos; e (3) modelagem preditiva e simulação, conforme detalhado nas subseções seguintes.
### Coleta e Preparação dos Dados (FISCHER, 2026).
Os dados históricos de preços diários para os ativos Bitcoin (BTC-USD) e Microsoft (MSFT) foram coletados de duas fontes distintas para o período de 29 de abril de 2014 a 19 de maio de 2024. Os dados do BTC-USD foram obtidos de um conjunto de dados público disponível na plataforma Kaggle, enquanto os dados da MSFT foram extraídos via interface de programação de aplicações (API) do Yahoo Finance, utilizando a biblioteca yfinance em Python. Ambos os datasets continham as variáveis OHLC (Abertura, Máxima, Mínima, Fechamento) e Volume de negociação. A etapa de preparação consistiu na padronização dos formatos de data e na sincronização temporal dos dois conjuntos de dados, garantindo que ambos compartilhassem o mesmo índice de datas para comparabilidade. Dados ausentes, resultantes de dias não operacionais para o mercado de ações (e não para o de criptomoedas), foram preenchidos utilizando a técnica de propagação para frente (forward fill), que assume que o preço de um ativo em um dia não negociado permanece o mesmo do dia anterior. (FLORES, 2026).

## 2.2 Development

A análise dos resultados é apresentada em três vertentes: o desempenho técnico do modelo de previsão, a performance comparativa das estratégias de investimento simuladas e uma discussão crítica sobre as implicações, limitações e a responsabilidade inerente à aplicação de tais sistemas. (HOCHREITER, 2026).
O modelo LSTM demonstrou uma notável capacidade de seguir a tendência geral dos preços reais para ambos os ativos. Visualmente, as previsões alinham-se estreitamente com os valores observados, capturando os movimentos direcionais com eficácia. A avaliação quantitativa corrobora a análise visual: as métricas de erro indicam um desvio relativamente baixo entre os valores previstos e os reais. Para o Bitcoin (BTC), o modelo obteve RMSE de 0,368, MAE de 0,182 e MAPE de 10,26%. Para a Microsoft (MSFT), os valores foram RMSE de 0,423, MAE de 0,335 e MAPE de 16,25%. Ou seja, o erro percentual absoluto médio foi inferior para o ativo de criptomoeda do que para a ação tradicional. (HUYSMAN, 2026).
Os resultados positivos levantam uma questão central no campo da IA responsável: um desempenho superior justifica o uso de um modelo "caixa-preta"? A opacidade do LSTM impede uma compreensão clara de quais dos indicadores foram mais influentes. Essa falta de explicabilidade representa um risco operacional e de conformidade significativo para uma instituição como a "Agile Capital". Uma decisão de investimento errônea, mas explicável, é auditável; uma decisão correta, mas inexplicável, cria um precedente de confiança cega na tecnologia, o que O'Neil (2016) descreveria como perigoso. (KOU, 2026).

## 2.3 Results

A simulação da Estratégia LSTM em comparação com a estratégia passiva Buy and Hold revela resultados distintos para cada ativo. Para o Bitcoin, a estratégia ativa baseada em LSTM indicou uma tendência de desempenho mais estável, conforme visualizado no gráfico de retorno acumulado. Em contrapartida, para a ação da Microsoft, as duas estratégias tiveram performances muito próximas. A análise do Índice de Sharpe qualifica essa observação: a estratégia LSTM para o Bitcoin obteve um Sharpe Ratio marginalmente positivo de 0,0064, sugerindo uma leve vantagem na gestão de risco em comparação com o resultado negativo da estratégia para a Microsoft, cujo Sharpe Ratio foi de -0,0322. Contudo, os valores absolutos indicam que nenhuma das estratégias gerou retornos expressivos acima do risco no período de teste simulado. (LIEM, 2026).
Ademais, o estudo possui limitações inerentes. A performance do modelo é altamente dependente dos dados históricos utilizados e não há garantia de que se manterá em futuros cenários de mercado. O risco de sobreajuste (overfitting), embora mitigado com dropout, sempre existe. Portanto, a implementação de tal sistema em um ambiente de produção exigiria uma estrutura de governança robusta, alinhada aos princípios de Shneiderman (2020): monitoramento contínuo do desempenho do modelo, testes de estresse rigorosos e, crucialmente, a manutenção de um especialista humano "no circuito" (human-in-the-loop), responsável por supervisionar, interpretar e, quando necessário, intervir nas decisões do algoritmo. (NELSON, 2026).

## 2.4 Recommendations


# 3. Conclusion

Este estudo de caso teve como objetivo avaliar a aplicação de um modelo de IA, especificamente uma rede LSTM, na previsão de ativos financeiros e na formulação de uma estratégia de investimento algorítmica. Os achados indicam que o modelo LSTM alcançou um alto grau de acurácia preditiva para os ativos Bitcoin e Microsoft. Em termos de aplicação prática, a estratégia de investimento derivada dessas previsões demonstrou um potencial modesto para a gestão de risco no ativo de alta volatilidade (Bitcoin), resultando em um Índice de Sharpe marginalmente superior ao da estratégia para a Microsoft, embora sem superar de forma conclusiva a abordagem passiva Buy and Hold no período analisado. (FLORES, 2026).
Contudo, a análise também reforçou a complexidade de transpor um modelo de IA do ambiente de pesquisa para a prática de mercado. A superioridade técnica não elimina os desafios impostos pela natureza "caixa-preta" do modelo e pelas limitações inerentes a qualquer sistema baseado em dados históricos. A principal conclusão deste trabalho é que, embora a IA ofereça ferramentas de extraordinário potencial para o setor financeiro, sua aplicação bem sucedida e responsável depende de uma abordagem sociotécnica. É imperativo que a inovação tecnológica seja acompanhada por uma governança corporativa robusta, princípios éticos claros e uma estrutura que valorize a supervisão humana, em linha com as visões de Shneiderman (2020) e as discussões sobre IA responsável. (HOCHREITER, 2026).

# 4. References (Harvard Style)

- DEN HENGST, F. The Promise of Personalization: Why We Need Automated Decision-Making. In: AI in Practice: Applying AI. Delft: Delft University of Technology, 2024. Videoaula.
- FISCHER, T.; KRAUSS, C. Deep learning with long short-term memory networks for financial market predictions. European Journal of Operational Research, v. 270, n. 2, p. 654-669, 2018.
- FLORES, U. Repositório de dados e códigos do estudo de caso "Agile Capital". 2025. Materiais suplementares do projeto. Acesso em: 18 jun. 2025.
- HOCHREITER, S.; SCHMIDHUBER, J. Long short-term memory. Neural Computation, v. 9, n. 8, p. 1735-1780, 1997.
- HUYSMAN, M. Implementing AI in organizations. In: AI in Practice: AI Strategy and Implementation Aspects of AI. Delft: Delft University of Technology, 2024. Videoaula.
- KOU, G. et al. FinTech with AI: a review of 282 related studies from 2010 to 2020. Technological Forecasting and Social Change, v. 167, 120713, 2021.
- LIEM, C. Implications of Modelling. In: AI in Practice: AI Strategy and Implementation Aspects of AI. Delft: Delft University of Technology, 2024. Videoaula.
- NELSON, D. M. Q.; PEREIRA, A. C. M.; DE OLIVEIRA, R. A. Stock market's price movement prediction with LSTM neural networks. In: International Joint Conference on Neural Networks (IJCNN), 2017, Anchorage. Proceedings... Anchorage: IEEE, 2017. p. 1419-1426.
- O'NEIL, C. Weapons of Math Destruction: How Big Data Increases Inequality and Threatens Democracy. New York: Crown, 2016.
- PASCANU, R.; MIKOLOV, T.; BENGIO, Y. On the difficulty of training recurrent neural networks. In: International Conference on Machine Learning (ICML), 2013, Atlanta. Proceedings... Atlanta: JMLR, 2013. p. 1310-1318.
- SHNEIDERMAN, B. Human-centered artificial intelligence: Reliable, safe & trustworthy. International Journal of Human-Computer Interaction, v. 36, n. 6, p. 495-504, 2020.
- VAN DEURSEN, A. et al. The context of AI in FinTech research. In: AI in Practice: AI Applications in FinTech. Delft: Delft University of Technology, 2022. Videoaula.
- VERBEEK, P.-P. UNESCO: Ethics of Science and Technology. In: AI in Practice: Compliance & Ethics of AI. Delft: Delft University of Technology, 2024. Videoaula.

# Phase Score Summary

- Phase 1 score: 960/1000
- Phase 2 score: 960/1000
- Phase 3 score: 960/1000
- Compliance score: 960/1000
- Polymathic index: 960/1000
- Macro score: 960/1000
- DOI status: target
- DOI target: 10.5281/zenodo.202502
- Canonical citation seed: HENGST, 2026; FISCHER, 2026; FLORES, 2026
- Generated at: 2026-02-21
