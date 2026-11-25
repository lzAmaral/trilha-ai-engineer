# Aulas pendentes do L1 · LLM 101

As aulas 01–09 foram produzidas em 22/11/2026 e as **10, 11 e 12** em 23–24/11/2026: o L1 está completo.
Este arquivo fica como registro da receita e das especificações das 10–12, e como modelo para os próximos níveis. Issue: #2.

## Como produzir uma aula (receita usada nas 01–09)

- Skill: `~/.claude/skills/aula-interativa` (origem: `gabrielgreco1/skills`). Pipeline completo com portões P1–P5 e rubrica ≥ 4.
- Entrada da skill: **Português (Brasil)**, **profundidade 2** (18–26 telas).
- Pasta de trabalho: `~/ai-engineer-aulas-work/l1-NN-<slug>/`. Nunca dentro do repositório nem da skill.
- Tema: siga `~/ai-engineer-aulas-work/_tema/README.md` à risca (theme.css, fontes Geist e convenções de cor dos diagramas). Aula de referência: `~/ai-engineer-aulas-work/l1-01-o-que-e-um-llm/source/lesson.html`.
- Ferramentas: `LESSON_NODE_MODULES=/Users/luizamaral/Luiz-Skill/carrossel/node_modules` e sempre `--channel chrome`.
- Modelo local para dados reais: o venv e o cache do Qwen2.5-0.5B (Instruct e base) ficam em `~/ai-engineer-aulas-work/l1-01-o-que-e-um-llm/tooling/` (veja como os scripts de `research/` da aula 01 chamam esse venv, com HF_HOME e modo offline).
- Player: `window.lesson = LessonPlayer.create({ root: '#lesson', title: 'L1 · LLM 101', lang: 'pt-BR', sources: SOURCES, slides: [...] })`. A plataforma lê isso pelo iframe.
- Saída: `pack.mjs` gera `static/aulas/l1/NN-<slug>.html`. Depois, acrescente o slug em `src/lib/aulas.ts`.
- Revisão humana antes de publicar: olhe o **quadro final de todos os passos** em tamanho real (folhas de contato), além do storyboard da skill. Na aula 02, um colchete deslocado em uma peça passou pelas checagens automáticas.

### Caso que atravessa a série (use como gancho)

Pergunta: "Qual é a capital da Austrália? Responda em uma frase." Modelo: Qwen2.5-0.5B-Instruct local.
Próximo token: Canberra 50,5%, Sydney 10,0%, Melbourne 7,8%. O contexto tem 54 tokens. O país inexistente "Valdóvia" virou "Vila Velha".
O que já foi ensinado e não deve ser repetido:

| Aula | Conteúdo |
|---|---|
| 01 | Loop de próximo token |
| 02 | Tokens e custo |
| 03 | Embeddings, atenção e MoE |
| 04 | Treino: base, SFT e RLHF |
| 05 | Prefill/decode, KV cache e preços |
| 06 | Sampling |
| 07 | Raciocínio |
| 08 | Janela de contexto |
| 09 | Falhas e confiabilidade |

---

## L1 · Aula 10 · Panorama de modelos (`panorama`)

- **Arquivo:** `static/aulas/l1/10-panorama.html`
- **Conteúdo do módulo:**
  - os três jeitos de consumir um modelo:
    - API fechada (Anthropic, OpenAI, Google);
    - modelo open-weight que você mesmo hospeda (Qwen, Llama, Mistral, DeepSeek, Gemma);
    - plataformas gerenciadas (Bedrock, Vertex AI, Azure AI Foundry; só um gancho para o L11);
  - knowledge cutoff: o modelo não sabe do que veio depois do treino;
  - fixar a versão (snapshot com data vs alias que muda sozinho) e o ciclo de deprecação;
  - licenças open-weight: Apache-2.0 vs licenças próprias com restrições, como Llama e Gemma. Open-weight não é a mesma coisa que open source.
- **Objetivo:** o aluno escolhe o tipo de acesso para um cenário (privacidade, custo, controle, esforço de operação), explica por que fixar a versão e lê a licença de um modelo open-weight antes de usar.
- **Dados reais sugeridos:**
  - perguntar ao Qwen local sobre um evento posterior ao cutoff dele;
  - ler o `config.json` e a licença do Qwen2.5 no cache;
  - comparar o identificador com data e o alias nas páginas oficiais de modelos (verificar no dia);
  - mostrar a página de deprecações de um provedor.
- **Fontes primárias:** páginas oficiais de modelos e deprecações (Anthropic, OpenAI, Google), model cards do Hugging Face, textos das licenças (Apache-2.0, Llama Community License, Gemma Terms), Open Source Initiative (definição de open source AI).
- **Ganchos:** aula 04 (o treino define o cutoff), 08 (contexto ≠ conhecimento), 12 (escolher), L11 (plataformas gerenciadas), L13 (fine-tuning exige pesos abertos).

## L1 · Aula 11 · Benchmarks e leaderboards (`benchmarks`)

- **Arquivo:** `static/aulas/l1/11-benchmarks.html`
- **Conteúdo do módulo:**
  - o que é um benchmark: conjunto fixo, métrica e protocolo (few-shot, CoT, pass@k);
  - exemplos:
    - MMLU / MMLU-Pro (conhecimento);
    - GPQA (perguntas à prova de Google);
    - SWE-bench (código real);
    - HLE;
    - AIME (matemática);
  - leaderboards: LMArena (preferência humana em pares, Elo) vs tabelas de acurácia;
  - contaminação: o teste vazou para o treino;
  - saturação: todos tiram mais de 90%;
  - por que a posição no ranking raramente se transfere para a sua tarefa e o caminho certo: shortlist por benchmark e depois um eval próprio (gancho para o L7).
- **Objetivo:** o aluno lê uma tabela de benchmark criticamente (métrica, protocolo, data, contaminação) e explica por que precisa de um eval próprio.
- **Dados reais sugeridos:**
  - rodar no Qwen local 20–30 questões de um benchmark público pequeno com 2 protocolos diferentes (com e sem few-shot, ou ordem das alternativas trocada) e mostrar como a nota muda;
  - tabelas oficiais dos papers e model cards, com data.
- **Fontes primárias:** papers do MMLU (Hendrycks), MMLU-Pro, GPQA (Rein et al.), SWE-bench, Humanity's Last Exam, LMArena / Chatbot Arena (Chiang et al.), estudos de contaminação (por exemplo, Golchin & Surdeanu), Epoch AI.
- **Ganchos:** aula 07 (AIME e raciocínio), 09 (confiabilidade medida), 12 (escolher), L7 (evals).

## L1 · Aula 12 · Escolhendo o modelo certo (`escolher-modelo`)

- **Arquivo:** `static/aulas/l1/12-escolher-modelo.html` (fecha o L1)
- **Conteúdo do módulo:**
  - as oito dimensões:
    1. capacidade;
    2. qualidade na sua tarefa;
    3. latência (TTFT e tokens/s);
    4. custo (entrada/saída, cache, batch);
    5. tamanho de contexto;
    6. modalidades;
    7. privacidade e deploy (dados, região, self-hosted);
    8. recursos do produto (tool use, saída estruturada, streaming, caching);
  - o fluxo de seleção:
    1. requisitos e restrições duras;
    2. shortlist por benchmark e preço;
    3. eval próprio com 20–50 exemplos;
    4. comparar qualidade × custo × latência;
    5. começar pelo menor que passa;
    6. fixar a versão e reavaliar ao trocar;
  - o modelo maior não é o padrão; roteamento é um gancho para o L9.
- **Objetivo:** o aluno faz uma seleção completa para um caso concreto (por exemplo, um chatbot de loja em português) e justifica a escolha pelas dimensões, com números.
- **Dados reais sugeridos:**
  - um mini-eval no Qwen 0.5B vs 1.5B (se estiver no cache) numa tarefa de extração em português: acerto, latência medida e custo estimado;
  - preços oficiais do dia (Anthropic, OpenAI, Google) para montar a tabela de decisão.
- **Fontes primárias:** páginas oficiais de preços e modelos (verificar no dia), guia da Anthropic sobre escolher modelo, guias de "model selection" da OpenAI, Artificial Analysis (secundária, para latência e preço comparados).
- **Ganchos:** recapitula o L1 inteiro (custo da 02/05, contexto da 08, raciocínio da 07, confiabilidade da 09, panorama da 10, benchmarks da 11). Abre o L2 (APIs de LLM).

---

## Depois do L1

Os próximos níveis seguem o mesmo processo, uma issue por nível (#1 = L0 … #16 = L15).
A lista de módulos de cada nível está em `src/lib/roadmap.ts` e no checklist de cada issue.
