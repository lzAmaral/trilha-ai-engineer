# Aulas do L2 · Trabalhando com APIs de LLM

Especificação das 12 aulas do L2 (issue #3). A receita de produção é a mesma do L1 e do L0 (veja `docs/aulas-pendentes.md` › "Como produzir uma aula").

| Item | Valor |
|---|---|
| Título no player | `title: 'L2 · APIs de LLM'` |
| Pasta de trabalho | `~/ai-engineer-aulas-work/l2-NN-<slug>/` |
| Saída | `static/aulas/l2/NN-<slug>.html` |

## O LLM das aulas: um servidor local, sem chave e sem custo

Decisão de 25/11/2026: o L2 usa **só modelo local**. Não há chave de API de provedor.

- **Servidor:** `~/ai-engineer-aulas-work/_llm/servidor.py`, com o Qwen2.5-1.5B-Instruct (e o 0.5B) do cache local. Ele fala o formato **Chat Completions da OpenAI**. Um servidor compartilhado fica em `http://127.0.0.1:8100/v1`, e a aula o chama com o SDK oficial `openai` (`base_url=...`, `api_key="local"`).
- **O que ele tem:**
  - `/v1/models`;
  - `/v1/chat/completions` com `stream`, `stream_options.include_usage`, `tools` (com `tool_calls`, `id` e `finish_reason: "tool_calls"`), `temperature`, `seed`, `max_tokens` e `stop`;
  - `usage` real, contado pelo tokenizer do Qwen.
- **O que ele não tem:** `response_format: json_schema`, ou seja, a decodificação guiada, que volta como 400 explicando isso. `n>1`, imagens e prompt caching também ficam de fora.
- **Extras só para as aulas,** que uma API real não tem; a aula diz isso na tela:
  - `--rpm N` devolve 429 com `retry-after` e headers `x-ratelimit-*`;
  - o header `x-simular` aceita os valores abaixo.

  | `x-simular` | Efeito |
  |---|---|
  | `500` | O servidor devolve um erro 500 |
  | `429` | Devolve um 429 uma vez |
  | `lento:S` | Espera S segundos antes de responder |
  | `cortar:N` | Derruba o stream depois de N pedaços |
- **Uma geração por vez:** o servidor processa uma requisição de cada vez; as outras esperam na fila. Com várias aulas rodando juntas, os tempos medidos no servidor compartilhado incluem fila. Quando o número importa (TTFT, throughput, concorrência, custo × latência), a aula sobe **a própria instância**:
  - porta `81NN`;
  - de preferência `--modelo qwen2.5-0.5b`, para caber na memória;
  - derrubada ao terminar.
- **Honestidade nas telas:**
  - todo dado executado vem do Qwen local no formato da OpenAI, e a tela diz isso;
  - formatos de outros provedores (Messages API da Anthropic, Gemini) aparecem **citados da documentação oficial do dia**, nunca como se tivessem sido executados;
  - custo em dólar é **estimativa**: tokens contados pelo tokenizer do Qwen × preço oficial do dia de um modelo citado;
  - os erros do modelo pequeno são dados reais e bons, por exemplo quando ele não chama a ferramenta ou inventa um argumento. Mostre-os como o que são, sem esconder e sem exagerar.

## Caso que atravessa o nível: o assistente da loja

É a mesma loja do L0 e do L1:
- catálogo: camiseta, calça, vestido, bermuda e blusa;
- tamanhos: P, M, G e GG;
- o pedido: `{"produto": "camiseta", "quantidade": 2, "tamanho": "M"}`.

No L1, o bot extraía esse JSON. No L0, o aluno construiu a API de pedidos (FastAPI + Postgres + ViaCEP). No L2, o aluno constrói **o assistente que fica na frente dessa API**:
- conversa com o cliente;
- transforma a mensagem num pedido validado;
- chama ferramentas: `consultar_estoque`, `criar_pedido`, `buscar_cep`;
- responde em streaming;
- aguenta falhas;
- registra custo e latência.

O código do serviço do L0 está em `~/ai-engineer-aulas-work/l0-08-projeto/`, como referência e só para leitura.

## Cores dos diagramas no L2

Iguais às do L1: o tema define a caixa escura do **modelo** (LLM).

| Cor | Uso no L2 |
|---|---|
| Caixa escura | O modelo |
| Azul | O que entra: mensagens, contexto, schema de ferramentas |
| Laranja | O passo que está acontecendo agora |
| Cinza | O que está fora de foco |
| Verde e vermelho | Só no feedback das práticas. Status HTTP e erros não ganham verde e vermelho; use texto e número |

## Infra local (aulas rodando em paralelo)

- **Python:** `uv`, com um venv na pasta de trabalho de cada aula. O SDK é o `openai` (versão do dia).
- **Disco e memória:** o disco tem uns 15 GB livres e a máquina tem 16 GB de RAM, compartilhados com o servidor do modelo. Rode no máximo uma instância própria do modelo por aula, e só enquanto mede.
- **Limpeza:** ao terminar, apague venvs grandes que não sejam mais necessários e derrube as instâncias próprias. Não mexa no servidor compartilhado da porta 8100.
- **Docker:** nenhuma aula do L2 precisa de Docker. Se usar, prefixo `l2-NN-`, e nunca toque em containers que não sejam da aula.

---

## L2 · Aula 01 · Primeiras chamadas e estado da conversa (`primeiras-chamadas`)

- **Conteúdo:**
  - chamar pelo SDK: cliente, modelo, mensagens e papéis (system, user, assistant);
  - o objeto de resposta: `choices`, `message`, `finish_reason` e `usage`;
  - a API não guarda estado: o histórico é reenviado a cada chamada e cresce;
  - chave de API: no ambiente e nunca no código. A chave fica no servidor, nunca no navegador.
- **Objetivo:** o aluno faz uma chamada, lê cada campo da resposta e explica por que a segunda pergunta "e em G?" só funciona se o histórico for reenviado.
- **Dados reais:**
  - a resposta crua (JSON) do servidor local;
  - a conversa de 3 turnos com `prompt_tokens` crescendo a cada turno;
  - a mesma pergunta sem histórico, em que o modelo perde o contexto;
  - `finish_reason: "length"` com um `max_tokens` baixo.
- **Fontes:** API reference da OpenAI (Chat Completions), docs da Anthropic (Messages API, para comparar o formato citado), boas práticas de segurança de chave da OpenAI e da Anthropic.
- **Ganchos:** L1·02 (tokens e custo), L1·08 (janela de contexto), aula 02.

## L2 · Aula 02 · Streaming (`streaming`)

- **Conteúdo:**
  - por que fazer streaming: percepção de velocidade;
  - TTFT vs tempo total;
  - SSE: `data:` e `[DONE]`, pedaços (`delta`);
  - renderização incremental no front;
  - stream interrompido: detectar, mostrar o que chegou e repetir ou avisar;
  - usage no fim do stream.
- **Objetivo:** o aluno consome um stream, mede TTFT e tempo total e trata um stream cortado no meio.
- **Dados reais:**
  - instância própria (porta 8102) para medir TTFT vs tempo total com e sem stream na mesma resposta longa;
  - os eventos SSE crus via `curl -N`;
  - `x-simular: cortar:N` com o erro real do SDK e o texto parcial recebido.
- **Fontes:** OpenAI (streaming), especificação HTML de Server-Sent Events (WHATWG), docs da Anthropic (streaming, eventos citados), MDN (EventSource, fetch com ReadableStream).
- **Ganchos:** L1·05 (prefill/decode explica o TTFT), aula 12.

## L2 · Aula 03 · Fundamentos de LangChain (`langchain`)

- **Conteúdo:**
  - chat models, prompt templates, output parsers e runnables;
  - LCEL (`prompt | model | parser`);
  - o mesmo fluxo em SDK puro vs LangChain: o que ganha (troca de provedor, composição) e o que custa (abstração e depuração);
  - versões mudam rápido: confira a doc do dia.
- **Objetivo:** o aluno monta uma chain que extrai o pedido, compara com a versão em SDK puro e decide quando a abstração vale a pena.
- **Dados reais:**
  - `langchain-openai` apontando para o servidor local;
  - a mesma tarefa nas duas versões, com as linhas de código contadas;
  - um erro real de parser quando o modelo devolve texto fora do formato.
- **Fontes:** docs do LangChain (Python, versão do dia), LangChain Expression Language, API do `langchain-openai`.
- **Ganchos:** aula 04 (saídas estruturadas), aula 11 (outros frameworks).

## L2 · Aula 04 · Saídas estruturadas (`saidas-estruturadas`)

- **Conteúdo:**
  - texto livre vs JSON;
  - geração guiada por schema (o modo strict dos provedores, decodificação restrita);
  - Pydantic → JSON Schema;
  - o padrão gerar → validar → reparar (devolver o erro de validação ao modelo);
  - quando o schema vence o prompt.
- **Objetivo:** o aluno define o modelo `Pedido`, gera o JSON Schema, valida a saída do LLM e implementa um laço de reparo com limite de tentativas.
- **Dados reais:**
  - N mensagens reais de clientes ("quero duas camisetas M", "uma calça tamanho 42"...) com a taxa real de JSON válido e de schema válido no modelo local;
  - o `ValidationError` real;
  - o reparo funcionando, ou não, com números;
  - o 400 do servidor local para `json_schema`, como gancho para explicar que os provedores fazem isso no decoder (citado da doc).
- **Fontes:** OpenAI (Structured Outputs), Anthropic (structured outputs / tool use para JSON, citado), docs do Pydantic (JSON Schema), especificação JSON Schema.
- **Ganchos:** L0·01 (Pydantic), L1·09 (falhas), aula 05.

## L2 · Aula 05 · Function e tool calling (`tool-calling`)

- **Conteúdo:**
  - o loop completo:
    1. definir as ferramentas (schema);
    2. o modelo pede (`tool_calls`, `finish_reason`);
    3. o seu código executa;
    4. devolve com `role: "tool"` + `tool_call_id`;
    5. o modelo responde;
  - IDs de tool call;
  - chamadas sequenciais e paralelas;
  - falha de ferramenta: devolver o erro como resultado, não quebrar o loop;
  - o modelo nunca executa nada.
- **Objetivo:** o aluno escreve o loop com `consultar_estoque` e `criar_pedido` e trata uma ferramenta que falha.
- **Dados reais:**
  - o loop real no servidor local, com as mensagens cruas de cada volta;
  - o modelo de 1,5B às vezes não chama a ferramenta: medir a taxa em N perguntas;
  - uma ferramenta que levanta exceção e o modelo lidando com o erro.
- **Fontes:** OpenAI (function calling), Anthropic (tool use, citado), docs do Qwen2.5 (function calling).
- **Ganchos:** aula 06, aula 07, L5 (agentes).

## L2 · Aula 06 · Projetando boas ferramentas (`boas-ferramentas`)

- **Conteúdo:**
  - nomes e descrições: a descrição é prompt;
  - parâmetros com enum e tipos;
  - ferramentas sobrepostas confundem o modelo;
  - granularidade;
  - argumentos como entrada não confiável: validar antes de executar e nunca passar direto para SQL ou shell;
  - mensagens de erro úteis ao modelo.
- **Objetivo:** o aluno reescreve um conjunto ruim de ferramentas e valida os argumentos antes de executar.
- **Dados reais:**
  - um experimento real com o mesmo conjunto de perguntas, com ferramentas de nome e descrição ruins vs boas, e a taxa de escolha certa;
  - duas ferramentas sobrepostas e a confusão medida;
  - um argumento inválido gerado pelo modelo e barrado pela validação.
- **Fontes:** Anthropic ("Writing tools for agents", guia de tool use), OpenAI (function calling best practices), OWASP (LLM Top 10: insecure output handling / excessive agency).
- **Ganchos:** L0·04 (SQL injection), aula 05, L8 (segurança).

## L2 · Aula 07 · Workflows de várias etapas (`workflows`)

- **Conteúdo:**
  - padrões: sequencial (prompt chaining), roteado (routing) e fan-out/paralelo, com agregação;
  - checagens entre etapas (gates);
  - workflow (caminho definido pelo código) vs agente (o modelo decide o caminho);
  - quando cada um compensa.
- **Objetivo:** o aluno monta um workflow que roteia a mensagem do cliente (pedido, dúvida de troca, reclamação) e escolhe workflow vs agente para três casos.
- **Dados reais:**
  - o roteador real no modelo local com acurácia em N mensagens;
  - uma cadeia de 3 etapas com tempo e tokens de cada uma;
  - um fan-out em que o tempo cai com paralelismo, ou não, por causa da fila do servidor. Explique.
- **Fontes:** Anthropic ("Building effective agents"), OpenAI (guia de agentes, citado), docs do LangGraph (workflows vs agents).
- **Ganchos:** aula 08 (paralelismo), L5 (agentes).

## L2 · Aula 08 · Async, concorrência e batching (`concorrencia`)

- **Conteúdo:**
  - chamar LLM é I/O, então async;
  - concorrência limitada (semáforo);
  - rate limits (RPM/TPM, headers);
  - throughput vs latência vs custo;
  - batching: APIs de batch dos provedores (desconto, horas de espera) vs mandar em paralelo.
- **Objetivo:** o aluno processa 50 mensagens com `asyncio` e semáforo respeitando um rate limit e escolhe entre tempo real, paralelo e batch.
- **Dados reais:**
  - instância própria (porta 8108) com `--rpm`;
  - tempos reais com concorrência 1, 4 e 16 (o servidor serializa: mostre honestamente o que isso significa);
  - 429 reais e os headers;
  - preços e desconto da Batch API citados da doc do dia.
- **Fontes:** docs do Python (asyncio), OpenAI (rate limits, Batch API), Anthropic (rate limits, Message Batches, citado).
- **Ganchos:** L0·01 (async), aula 09, L1·05 (custo).

## L2 · Aula 09 · Robustez (`robustez`)

- **Conteúdo:**
  - quais erros repetir (429, 5xx, timeout) e quais não (400, 401);
  - retry com backoff exponencial e jitter;
  - respeitar o `retry-after`;
  - timeouts;
  - fallback de modelo;
  - idempotência ao repetir (o POST da L0·02);
  - onde mora a lógica de confiabilidade: SDK (`max_retries`), sua camada ou gateway.
- **Objetivo:** o aluno implementa retry com backoff e jitter, configura timeout e decide o fallback para um caso.
- **Dados reais:**
  - instância própria (porta 8109);
  - `x-simular: 500`, `429` e `lento:S`;
  - os retries reais do SDK `openai` (`max_retries`, logs com os intervalos);
  - timeout real disparando;
  - fallback do 1.5B para o 0.5B;
  - um retry que duplicaria o pedido sem chave de idempotência.
- **Fontes:** AWS Architecture Blog ("Exponential Backoff and Jitter"), docs do SDK `openai` (retries, timeouts), RFC 9110 (Retry-After), Google SRE book (cascading failures, citado).
- **Ganchos:** L0·02 (idempotência), L0·08 (timeout do ViaCEP), aula 10.

## L2 · Aula 10 · Custo, uso e observabilidade (`custo-observabilidade`)

- **Conteúdo:**
  - custo por requisição (`usage` × preço);
  - custo por conversa e por usuário;
  - logs estruturados por chamada (modelo, tokens, latência, custo, erro);
  - traces: span por etapa e ferramenta (OpenTelemetry, convenções GenAI);
  - depurar sem `print()`;
  - ferramentas de mercado (Langfuse, LangSmith, Phoenix) só citadas.
- **Objetivo:** o aluno instrumenta o assistente com log por chamada e um trace por conversa e responde "quanto custou e onde demorou" a partir dos dados.
- **Dados reais:**
  - uma conversa real com ferramentas instrumentada;
  - as linhas JSON reais;
  - um trace real (OpenTelemetry console exporter ou equivalente) com spans e tempos;
  - custo estimado com preços oficiais do dia de um modelo citado, rotulado como estimativa.
- **Fontes:** OpenTelemetry (semantic conventions for GenAI), docs de preços oficiais (Anthropic e OpenAI, verificar no dia), docs do Langfuse/LangSmith (citado).
- **Ganchos:** L1·12 (custo na escolha), aula 12, L10 (LLMOps).

## L2 · Aula 11 · Outros frameworks de orquestração (`frameworks`)

- **Conteúdo:**
  - LlamaIndex (dados e RAG);
  - LangGraph (grafos com estado);
  - DSPy (programas e otimização de prompts);
  - o que cada um resolve e o que custa;
  - como escolher: pela arquitetura do problema, não pela popularidade; SDK puro como padrão até doer.
- **Objetivo:** o aluno reconhece o problema que cada framework resolve e escolhe (ou recusa) um para três cenários.
- **Dados reais:**
  - a mesma tarefa mínima (extrair o pedido) rodando de verdade em pelo menos dois frameworks contra o servidor local, com linhas de código, dependências instaladas (tamanho em disco) e tempo de import;
  - versões e datas conferidas no dia.
- **Fontes:** docs oficiais do LlamaIndex, LangGraph e DSPy (versão do dia), paper do DSPy (Khattab et al.).
- **Ganchos:** aula 03 (LangChain), L4 (RAG), L5 (agentes com LangGraph).

## L2 · Aula 12 · Projeto: assistente com streaming e ferramentas (`projeto`)

- **Formato:** projeto guiado, como a L0·08. A aula mostra a construção real com saídas reais e termina com a especificação, os critérios de pronto e o plano de execução para o aluno fazer o dele.
- **Conteúdo:**
  - um assistente da loja com 2–3 ferramentas reais (`consultar_estoque`, `criar_pedido` e `buscar_cep` via ViaCEP);
  - saídas estruturadas;
  - streaming;
  - retries e timeouts;
  - log de uso, latência e custo;
  - sem RAG e sem agentes autônomos;
  - **uma falha de IA documentada**: um erro real do modelo local ou do assistente de código durante a construção, registrado e tratado.
- **Objetivo:** o aluno sai com a especificação, os critérios de pronto e o plano, e sabe o que conferir em cada etapa.
- **Dados reais:**
  - o assistente construído de verdade na pasta de trabalho, contra o servidor local;
  - uma conversa completa real com ferramentas;
  - os testes passando;
  - os logs com custo e latência.
- **Fontes:** as das aulas 01–10 e a API do ViaCEP.
- **Ganchos:** recapitula as aulas 01–11 do L2 e abre o L3 (engenharia de prompt) e o L5 (agentes).
