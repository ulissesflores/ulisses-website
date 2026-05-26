# Detecção de Fraudes em Cartões com Redes Neurais: MLP versus Autoencoder, Regressão Logística e Isolation Forest

**Mestrando em IA: Carlos Ulisses Flores** — American Global Tech University (17/08/2025)

# Resumo

Este trabalho apresenta um estudo de caso de detecção de fraudes em cartões de crédito sob forte desbalanceamento, comparando um Perceptron Multi-Camadas (MLP) supervisionado às alternativas Autoencoder (AE), Regressão Logística (LR) e Isolation Forest (IF) no conjunto público ULB/Worldline. O protocolo prioriza métricas apropriadas a classes raras, em especial AUC-PR e F1 (além de Fβ), com thresholds calibrados na validação e aplicados no teste; reportamos curvas ROC/PR, matrizes de confusão, importância por permutação e teste de robustez a variações de prevalência. O MLP obteve o melhor F1 na classe positiva e AUC-PR competitiva, superando AE/IF e empatando/superando LR; discutimos escolha de limiar sensível a custos, calibração e governança, com artefatos completos para replicação (SAITO; REHMSMEIER, 2015; DAVIS; GOADRICH, 2006).

**Palavras-chave:** Fraude em cartão; Classe rara; Curva PR; F1-score; Calibração; Interpretação; PyTorch; Reprodutibilidade.

# Abstract

This paper presents a credit card fraud detection case study under severe class imbalance, benchmarking a supervised MLP against Autoencoder, Logistic Regression and Isolation Forest on the public ULB/Worldline dataset. The protocol emphasizes PR-AUC and F1/Fβ thresholds calibrated on validation; we report ROC/PR curves, confusion matrices, permutation feature importance and a prior-shift robustness test. The MLP achieved the best F1 on the positive class and competitive PR-AUC, surpassing AE/IF and matching/exceeding LR. We discuss cost-sensitive thresholding, calibration and governance, providing full artifacts for replication (IBM Skills Network, 2025a; SAITO; REHMSMEIER, 2015; DAVIS; GOADRICH, 2006).

**Keywords:** credit card fraud; imbalanced classification; precision–recall; F1-score; calibration; interpretability; reproducibility.

# Introdução

O objetivo deste trabalho é aplicar técnicas de Deep Learning, especificamente um Perceptron Multi-Camadas (MLP), para melhorar a detecção de fraudes em cartões de crédito, comparando-o com abordagens alternativas como Autoencoder, Regressão Logística e Isolation Forest, em um contexto de forte desbalanceamento de classes, utilizando o conjunto de dados público ULB/Worldline. Fraude em meios eletrônicos exige maximizar a sensibilidade sob baixas taxas de falsos positivos, alinhando risco operacional a precisão estatística, sobretudo quando a taxa base de fraude é ínfima. Este cenário motiva métricas mais informativas do que acurácia bruta. A avaliação deve refletir custo assimétrico FN>FP (HERNANDEZ AROS et al., 2024; CHERIF et al., 2023; CHEN et al., 2024).

Em classes raras, curvas PR e medidas F1/Fβ descrevem melhor o trade-off entre precisão e revocação do que ROC isolada. A leitura de PR evita superestimar desempenho por negativos abundantes (SAITO; REHMSMEIER, 2015; DAVIS; GOADRICH, 2006).

Estabelecemos baselines fortes (LR, IF), comparamos com AE não supervisionado e posicionamos MLP como candidato principal em pipeline reprodutível (KING; ZENG, 2001; LIU; TING; ZHOU, 2008).

### Fundamentação Teórica

Regressão Logística é referência clássica para eventos raros, fornecendo probabilidades calibráveis e fronteira linear interpretável. Com regularização adequada, evita sobreajuste e mantém estabilidade (KING; ZENG, 2001; NICULESCU-MIZIL; CARUANA, 2005).

Detectores não supervisionados capturam anomalias estruturais, porém falham quando fraudes são quase normais no espaço latente. Erro de reconstrução pode produzir muitos falsos positivos (LIU; TING; ZHOU, 2008; DAL POZZOLO, 2015).

Calibração de probabilidades (Platt/Temperature) impacta governança ao alinhar escores a probabilidades bem-comportadas (NICULESCU-MIZIL; CARUANA, 2005; GUO et al., 2017).

A literatura recente de desbalanceamento reforça PR-AUC como métrica primária e sugere protocolos específicos de avaliação (CHEN et al., 2024).

### Dados e Preparação

Utilizamos ULB/Worldline (284.807 transações; 30 variáveis PCA + Time/Amount; Class binário), cenário típico de classe rara com ≈0,173% de fraudes (ULB/Worldline, 2013; DAL POZZOLO, 2015).

Adotamos split estratificado 70/15/15, seed=42, e padronização ajustada somente no treino para evitar vazamento. A rotina de auditoria inclui hash do dataset e registro de versões. Todos os artefatos são exportados para validação independente (GOODFELLOW; BENGIO; COURVILLE, 2016).

Dado o severo desbalanceamento de classes (≈0,173% positivas), aplicou-se a técnica de sobreamostragem SMOTE (Synthetic Minority Over-sampling Technique) exclusivamente ao conjunto de treino. Este procedimento visa mitigar o viés do modelo em favor da classe majoritária, criando instâncias sintéticas da classe minoritária (fraude) para permitir um aprendizado mais robusto dos seus padrões (CHAWLA et al., 2002).

## Metodologia

Comparamos MLP (PyTorch, ReLU, dropout), AE (reconstrução), LR (baseline linear) e IF (isolamento) com hiperparâmetros conservadores e foco didático. Configurações estáveis foram priorizadas a tunings agressivos (GOODFELLOW; BENGIO; COURVILLE, 2016; LIU; TING; ZHOU, 2008; KING; ZENG, 2001).

O MLP foi implementado em PyTorch com a seguinte arquitetura: uma camada de entrada com 30 neurônios (correspondente às features PCA), duas camadas ocultas com 16 e 8 neurônios respectivamente, e uma camada de saída com 2 neurônios para classificação binária. A função de ativação ReLU foi utilizada nas camadas ocultas, e camadas de Dropout (p=0.2) foram inseridas após cada camada oculta para regularização. O modelo foi treinado com o otimizador Adam e a função de perda Cross-Entropy, monitorando a métrica F1 na classe positiva.

Avaliamos AUC-ROC/PR, precisão, recall, F1; calibramos thresholds por F1 e Fβ na validação e aplicamos no teste. Incluímos importância por permutação como interpretabilidade pragmática (SAITO; REHMSMEIER, 2015; DAVIS; GOADRICH, 2006).

Para calibração de probabilidades, aplicamos Platt Scaling à Regressão Logística e Temperature Scaling ao MLP, garantindo que as saídas probabilísticas sejam confiáveis e alinhadas com as exigências de governança (NICULESCU-MIZIL; CARUANA, 2005; GUO et al., 2017).

Executamos em Google Colab/CPU com PyTorch e scikit-learn, com controle de semente e isolamento de conjuntos para comparações justas (GOODFELLOW; BENGIO; COURVILLE, 2016). No protocolo de avaliação, priorizamos PR na leitura de desempenho; ROC é reportada por tradição, mas PR captura melhor a utilidade em classe rara (SAITO; REHMSMEIER, 2015; DAVIS; GOADRICH, 2006). Conduzimos também um stress test variando a prevalência positiva (1%→20%) para avaliar sensibilidade a prior shift e estabilidade de F1 (CHEN et al., 2024).

## Resultados

O MLP obteve o melhor F1 na classe positiva, com a LR ficando muito próxima; AE e IF ficaram abaixo, reforçando a superioridade do supervisionado com rótulos de fraude. Histogramas mostram separação de p̂ para a classe 1 no MLP (KING; ZENG, 2001; LIU; TING; ZHOU, 2008; CHEN et al., 2024). A importância por permutação destacou V14 e componentes PCA correlatas como determinantes; interpretamos como proxies latentes (BISHOP, 2006; DAL POZZOLO, 2015). Sob prior shift, MLP e LR mantiveram F1 estável; o IF degradou; o AE apresentou recall razoável porém precisão baixa (LIU; TING; ZHOU, 2008; CHEN et al., 2024).

Quanto à comparação de modelos por threshold (validação/teste), o efeito do limiar é determinante. No threshold padrão de 0,5, o MLP atingiu alta acurácia (≈98,9% no teste) mas F1 baixo na classe positiva (≈0,210, com precisão de 0,12 e recall de 0,85), refletindo muitos falsos positivos. Ao elevar o corte para 0,99, o MLP obteve F1 de 0,686 na validação e 0,747 no teste (precisão 0,674, recall 0,838). O threshold calibrado por Fβ=2 produziu resultados idênticos ao corte 0,99 no MLP. A Regressão Logística no corte 0,99 obteve F1 de 0,659 na validação e 0,736 no teste — próxima ao MLP. O Autoencoder, no corte ótimo de F1, alcançou apenas F1 de 0,215 no teste (precisão 0,130, recall 0,608), e o Isolation Forest ficou ainda abaixo, com F1 de 0,179 no teste (precisão 0,111, recall 0,459).

As matrizes de confusão confirmam esse quadro. No teste, o MLP no corte 0,5 produziu 462 falsos positivos e 11 falsos negativos (63 verdadeiros positivos). Já no corte 0,99, os falsos positivos caíram drasticamente para 30, com 12 falsos negativos e 62 verdadeiros positivos — uma redução de mais de 90% nos alarmes falsos ao custo de apenas um verdadeiro positivo a menos. O Autoencoder no teste apresentou 300 falsos positivos e 29 falsos negativos (45 verdadeiros positivos), evidenciando sua menor precisão.

O stress test com variação de prevalência (prior shift, de 1% a 20% de positivos) confirmou a estabilidade dos modelos supervisionados. O MLP manteve F1 entre ≈0,71 e ≈0,75 ao longo de todos os cenários de prevalência (0,747 em 1%, 0,744 em 5%, 0,713 em 10% e 0,734 em 20%). A LR exibiu comportamento semelhante, oscilando entre ≈0,68 e ≈0,78 (chegando a superar o MLP em 10%, com F1 de 0,780). O Isolation Forest permaneceu consistentemente baixo (F1 entre 0,179 e 0,194), demonstrando degradação e inadequação ao problema.

A importância por permutação, calculada na validação, identificou a variável V14 como de longe a mais determinante, com importância de 0,073 — cerca de cinco vezes superior à segunda colocada, V2 (0,015), seguida por V22 (0,014), V24 (0,007) e V25 (0,006). Diversas variáveis apresentaram importância próxima de zero ou levemente negativa (por exemplo V13, com -0,004, e V26, com -0,002), indicando contribuição marginal ou nula para a discriminação da classe positiva.

Quanto às figuras principais, observa-se que a curva de Precisão-Recall (PR) do MLP domina as demais abordagens em praticamente todo o espaço de recall. Esse resultado é particularmente relevante em cenários de forte desbalanceamento, como no presente estudo, em que a AUC-PR fornece uma avaliação mais confiável da capacidade do modelo de identificar fraudes. O desempenho superior do MLP nesta métrica confirma sua adequação para o problema, evidenciando maior robustez na detecção da classe minoritária em comparação com os demais modelos.

# Discussão

A performance robusta do MLP, que não apenas superou os modelos não supervisionados, mas também competiu de perto com a Regressão Logística, demonstra sua capacidade de aprender padrões não-lineares complexos. O uso estratégico de Dropout foi fundamental para controlar o risco de overfitting, garantindo que o modelo generalizasse bem para o conjunto de teste, como evidenciado pela proximidade entre as métricas de validação e teste.

Em dados tabulares com PCA, a LR já captura muito do sinal; o MLP adiciona não-linearidade útil aumentando F1 e AUC-PR (HASTIE; TIBSHIRANI; FRIEDMAN, 2009; GOODFELLOW; BENGIO; COURVILLE, 2016).

A escolha de threshold deve refletir custo de negócio; recomenda-se manter cortes F1-ótimo e Fβ, revisados periodicamente conforme drift (SAITO; REHMSMEIER, 2015; DAVIS; GOADRICH, 2006).

Para governança, recomenda-se calibração de probabilidades e validação de estabilidade de importância (bootstrap) e SHAP para explicações locais (NICULESCU-MIZIL; CARUANA, 2005; GUO et al., 2017; BISHOP, 2006).

Limitamo-nos a um dataset; a generalização requer validação externa e possível ajuste fino de hiperparâmetros e limiares (CHEN et al., 2024). Não realizamos busca exaustiva nem calibração nesta versão; priorizamos replicabilidade e clareza didática conforme diretrizes do curso. Adicionalmente, os dados PCA podem introduzir vieses latentes não explorados; sugerimos experimentos futuros com undersampling ou ensembles (como Random Forest com SMOTE) para maior robustez.

Apesar dos resultados promissores, algumas limitações devem ser consideradas para aplicação prática. Em ambientes reais de transações financeiras, o custo computacional do treinamento de redes neurais profundas pode ser elevado, especialmente quando há necessidade de reprocessamento frequente de grandes volumes de dados. Além disso, a ocorrência de concept drift — isto é, a mudança gradual no padrão das transações legítimas e fraudulentas ao longo do tempo — pode comprometer a generalização do modelo, exigindo monitoramento contínuo e atualizações periódicas para manter sua acurácia. Dessa forma, embora o MLP tenha demonstrado resultados superiores, sua adoção em produção deve ser acompanhada de estratégias de manutenção e validação contínua.

## Recomendações

Adotar o MLP como modelo principal e a LR como baseline explicável.
Definir threshold sensível a custo de negócio, mantendo cortes F1-ótimo e Fβ revisados periodicamente conforme drift.
Aplicar calibração de probabilidades (Platt/Temperature) para alinhar escores às exigências de governança.
Validar a estabilidade da importância de atributos via bootstrap e empregar SHAP para explicações locais.
Integrar o modelo a sistemas de monitoramento em tempo real, com alertas baseados em thresholds calibrados para minimizar impactos operacionais.
Disponibilizar notebook único, figuras/tabelas exportadas e sumário JSON (versões/seed/hash) garantindo auditoria ponta-a-ponta.

# Conclusão

Recomendamos o MLP como modelo principal e a LR como baseline explicável; sugere-se threshold sensível a custo, calibração e monitoramento de drift em produção (KING; ZENG, 2001; NICULESCU-MIZIL; CARUANA, 2005; GUO et al., 2017). Para aplicações reais, integre o modelo a sistemas de monitoramento em tempo real, com alertas baseados em thresholds calibrados para minimizar impactos operacionais. Disponibilizamos notebook único, figuras/tabelas exportadas e sumário JSON (versões/seed/hash) garantindo auditoria ponta-a-ponta (FLORES, 2025).

# Referencias

- SAITO, T.; REHMSMEIER, M. The Precision-Recall Plot Is More Informative than the ROC Plot on Imbalanced Datasets. PLoS ONE, 2015.
- DAVIS, J.; GOADRICH, M. The Relationship Between Precision-Recall and ROC Curves. In: ICML, 2006.
- KING, G.; ZENG, L. Logistic Regression in Rare Events Data. Political Analysis, 2001.
- NICULESCU-MIZIL, A.; CARUANA, R. Predicting Good Probabilities with Supervised Learning. In: ICML, 2005.
- GUO, C.; PLEISS, G.; SUN, Y.; WEINBERGER, K. On Calibration of Modern Neural Networks. In: ICML, 2017.
- LIU, F. T.; TING, K. M.; ZHOU, Z.-H. Isolation Forest. In: ICDM, 2008.
- CHAWLA, N. V. et al. SMOTE: Synthetic Minority Over-sampling Technique. JAIR, 2002.
- DAL POZZOLO, A. Adaptive Machine Learning for Credit Card Fraud Detection. PhD Thesis, 2015.
- ULB/WORLDLINE. Credit Card Fraud Dataset. Kaggle mirror, 2013.
- GOODFELLOW, I.; BENGIO, Y.; COURVILLE, A. Deep Learning. MIT Press, 2016.
- BISHOP, C. Pattern Recognition and Machine Learning. Springer, 2006.
- HASTIE, T.; TIBSHIRANI, R.; FRIEDMAN, J. The Elements of Statistical Learning. Springer, 2009.
- MURPHY, K. Machine Learning: A Probabilistic Perspective. MIT Press, 2012.
- CHEN, W. et al. A survey on imbalanced learning: latest research. Artificial Intelligence Review, 2024.
- HERNANDEZ AROS, L. et al. Financial fraud detection through ML. Humanities and Social Sciences Communications, 2024.
- CHERIF, A. et al. Credit card fraud detection in the era of disruptive technologies. JISA, 2023.
- IBM Skills Network. AI Development — Estudo de Caso (Diretrizes). 2025.
- IBM Skills Network. Unit 3.x — Laboratórios de Métricas, Treinamento e Avaliação. 2025.
- FLORES, Carlos Ulisses. Notebook estudo_caso_fraude_cartao_pytorch_v3p2_final_full.ipynb. Colab, 2025. Acesso em: 16/08/2025.
