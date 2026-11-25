# Aulas do L0 · Fundamentos de engenharia de software

Especificação das 8 aulas do L0 (issue #1). A receita de produção é a mesma do L1 (veja `docs/aulas-pendentes.md` › "Como produzir uma aula").

| Item | Valor |
|---|---|
| Título no player | `title: 'L0 · Fundamentos'` |
| Pasta de trabalho | `~/ai-engineer-aulas-work/l0-NN-<slug>/` |
| Saída | `static/aulas/l0/NN-<slug>.html` |

## Caso que atravessa o nível: a API de pedidos da loja

É a mesma loja de roupas do bot do L1 (aulas 09 e 12):
- catálogo: camiseta, calça, vestido, bermuda e blusa;
- tamanhos: P, M, G e GG;
- o JSON que o bot extrai é `{"produto": "camiseta", "quantidade": 2, "tamanho": "M"}`.

No L0, o aluno constrói o serviço que recebe esses pedidos: um modelo em Python, uma rota HTTP, uma tabela no Postgres, um container e o deploy. Mais à frente, o LLM do L2 se encaixa na frente desse serviço.

Cada aula usa esse caso em pelo menos uma tela, com dados reais rodados na máquina. O nome da loja é genérico ("a loja"), sem marcas reais e sem dados pessoais.

## Cores dos diagramas no L0

O tema define a caixa escura do **modelo** (LLM). No L0, a mesma caixa escura é **o sistema**: servidor, banco ou container, com o nome em branco.

| Cor | Uso no L0 |
|---|---|
| Azul | O que entra: requisição, dados de entrada, contexto |
| Laranja | O passo que está acontecendo agora |
| Cinza | O que está fora de foco |
| Verde e vermelho | Só no feedback das práticas. Status HTTP 2xx/4xx **não** ganham verde e vermelho; use texto e número |

## Infra local (aulas rodando em paralelo)

- **Python:** `uv` (em `/opt/homebrew/bin`), com um venv dentro da pasta de trabalho de cada aula.
- **Docker:** 28 está disponível. Use imagens slim/alpine, `python:3.13-slim` e `postgres:17-alpine`.
- **Nomes e portas por aula, para não colidir:**
  - containers com o prefixo `l0-NN-`;
  - portas `80NN` (HTTP) e `54NN` (Postgres).
- **Limpeza:** ao terminar, remova os containers, volumes e imagens próprios da aula. O disco tem pouco espaço livre.

---

## L0 · Aula 01 · Python para AI Engineering (`python`)

- **Conteúdo do módulo:**
  - Python idiomático e estruturas de dados (list/dict comprehension, dataclass);
  - type hints;
  - modelos Pydantic, com validação e mensagem de erro;
  - arquivos, variáveis de ambiente, JSON e CSV;
  - sync vs async: async ajuda em espera de I/O, não em CPU;
  - ambientes com `uv`, módulos e pytest.
- **Objetivo:** o aluno escreve o modelo `Pedido` em Pydantic, diz quando async ajuda e monta um projeto com `uv` e um teste com pytest.
- **Dados reais:**
  - rodar no venv da aula o `ValidationError` real para `quantidade: "duas"` e para um `tamanho` fora do catálogo;
  - medir o tempo de 10 chamadas de I/O simuladas, em sequência vs `asyncio.gather`;
  - medir o mesmo para uma tarefa de CPU, para mostrar que não melhora;
  - saída real do `pytest` e o tempo do `uv add`.
- **Fontes:** docs.python.org (typing, asyncio, csv, json), docs do Pydantic, docs do uv (Astral), docs do pytest.
- **Ganchos:** aula 03 (FastAPI usa Pydantic), L2 (chamar API de LLM é I/O, então async; saída estruturada vira modelo Pydantic).

## L0 · Aula 02 · A Web: HTTP, REST e JSON (`web-http`)

- **Conteúdo do módulo:**
  - o ciclo request/response;
  - métodos (GET, POST, PUT, PATCH, DELETE) e idempotência;
  - status codes, headers e cookies;
  - design RESTful (recursos como `/pedidos/{id}`);
  - autenticação básica (API key no header, Bearer);
  - curl e Postman.
- **Objetivo:** o aluno lê uma troca HTTP crua, escolhe método e status para cada operação de pedidos e explica por que repetir um POST é diferente de repetir um PUT.
- **Dados reais:**
  - `curl -v` real contra uma API pública, com os headers reais;
  - chamada real à API da Anthropic **sem chave**, mostrando o 401 e o corpo JSON real: "uma API de LLM é só HTTP";
  - servidor local mínimo mostrando um POST repetido criando dois pedidos e um PUT repetido sem efeito novo.
- **Fontes:** RFC 9110 (semântica HTTP), MDN (HTTP), dissertação de Fielding (cap. 5, REST), RFC 6750 (Bearer).
- **Ganchos:** aula 03, L2 (APIs de LLM).

## L0 · Aula 03 · APIs com FastAPI (`fastapi`)

- **Conteúdo do módulo:**
  - rotas e validação com Pydantic (o 422 automático);
  - injeção de dependências (`Depends`);
  - respostas de erro (`HTTPException`, 404);
  - OpenAPI e `/docs` gerados sozinhos;
  - config (pydantic-settings) e middleware;
  - testes de endpoint com `TestClient`.
- **Objetivo:** o aluno escreve `POST /pedidos` e `GET /pedidos/{id}` com validação, erro e teste, e explica o que `Depends` resolve.
- **Dados reais:**
  - app real rodando com uvicorn na porta 8003;
  - `curl` com o corpo real do 422 para um pedido inválido;
  - trecho real do `openapi.json`;
  - saída real do pytest.
- **Fontes:** docs do FastAPI, Starlette, pydantic-settings, especificação OpenAPI.
- **Ganchos:** aula 01 (Pydantic), 04 (persistir), 07 (container), L2 (o serviço que chama o LLM).

## L0 · Aula 04 · Dados e persistência (`dados`)

- **Conteúdo do módulo:**
  - modelagem relacional: clientes, pedidos e itens, 1:N e chave estrangeira;
  - PostgreSQL e SQL: SELECT, JOIN, GROUP BY;
  - índices: o que custam e quando ajudam (EXPLAIN ANALYZE);
  - conexão a partir da aplicação: driver, pool e query parametrizada contra SQL injection;
  - credenciais fora do código (`DATABASE_URL` no ambiente).
- **Objetivo:** o aluno modela os pedidos em tabelas, escreve um JOIN com agregação, decide onde pôr um índice olhando o EXPLAIN e conecta sem expor a senha.
- **Dados reais:**
  - `postgres:17-alpine` em Docker, porta 5404;
  - algumas centenas de milhares de pedidos sintéticos;
  - EXPLAIN ANALYZE real antes e depois do índice, com os tempos;
  - injeção de SQL real numa query concatenada vs a parametrizada.
- **Fontes:** documentação do PostgreSQL (tutorial SQL, índices, EXPLAIN), docs do psycopg, OWASP (SQL Injection).
- **Ganchos:** aula 03 (persistir o pedido), 08 (projeto), níveis de RAG (pgvector guarda embeddings no Postgres).

## L0 · Aula 05 · Git e colaboração (`git`)

- **Conteúdo do módulo:**
  - branch → PR → merge;
  - commits atômicos com mensagens boas;
  - conflitos: o que os marcadores significam e como resolver;
  - `.gitignore` e README; nunca commitar `.env`, e o que fazer se acontecer;
  - code review.
- **Objetivo:** o aluno resolve um conflito real, escreve um `.gitignore` para o projeto de pedidos e descreve o fluxo issue → branch → PR → review → merge.
- **Dados reais:**
  - repositório temporário com saídas reais do git: conflito com marcadores, `git log --graph`;
  - um `.env` "vazado" e o que o histórico guarda;
  - o próprio repositório público desta trilha como exemplo de fluxo (issue #2 → PRs #17 e #19).
- **Fontes:** Pro Git (git-scm.com/book), docs do git, GitHub Docs (pull requests, code review, remover dados sensíveis).
- **Ganchos:** aula 06 (agentes de código abrem PRs), 08 (projeto).

## L0 · Aula 06 · Desenvolvimento assistido por IA (`dev-com-ia`)

- **Conteúdo do módulo:**
  - agentes de código e contexto mínimo útil;
  - CLAUDE.md e spec-driven development;
  - slash commands, Skills e subagentes;
  - MCP, hooks e plugins;
  - verificar cada diff: o agente erra com confiança.
- **Objetivo:** o aluno escreve um CLAUDE.md útil para o projeto de pedidos, escolhe a peça certa (skill, subagente, hook ou MCP) para cada necessidade e revisa um diff de agente antes de aceitar.
- **Dados reais:**
  - esta trilha foi feita assim: uma skill (`aula-interativa`) e um subagente por aula, com revisão humana pelas folhas de contato;
  - na aula 02 do L1, um colchete deslocado passou pelas checagens automáticas e foi pego na revisão humana;
  - fluxo issue → branch → PR, com autorização humana para o merge;
  - todos os nomes de recursos conferidos na documentação oficial do dia.
  - Sem dados pessoais, caminhos locais ou e-mails.
- **Fontes:** docs do Claude Code (memória/CLAUDE.md, slash commands, skills, subagentes, hooks, MCP, plugins), especificação do Model Context Protocol, documentação de outros agentes (Cursor, Codex, Copilot) só se for citada.
- **Ganchos:** L1·09 (o modelo falha com confiança), níveis de agentes e MCP mais adiante.

## L0 · Aula 07 · Containers e deploy (`containers`)

- **Conteúdo do módulo:**
  - imagem vs container;
  - Dockerfile: camadas, cache, base slim e multi-stage;
  - a API FastAPI de pedidos em container;
  - deploy numa URL pública (opções de hospedagem conferidas no dia);
  - variáveis e segredos em produção: nunca dentro da imagem.
- **Objetivo:** o aluno escreve o Dockerfile da API, explica a ordem das camadas para o cache funcionar e injeta segredos pelo ambiente.
- **Dados reais:**
  - imagem real da API, porta 8007;
  - tamanho real com `python:3.13` vs `python:3.13-slim`;
  - tempo de rebuild com cache vs sem cache ao mudar só o código;
  - `docker history` revelando uma chave falsa colocada em `ENV`.
  - Não é preciso fazer deploy público de verdade: mostre os passos conferidos na documentação.
- **Fontes:** docs do Docker (Dockerfile reference, build cache, multi-stage, secrets), docs do FastAPI (Deployment › Docker), docs dos provedores citados, The Twelve-Factor App (config).
- **Ganchos:** aula 03 (a API), 08 (compose com Postgres), níveis de deploy e LLMOps.

## L0 · Aula 08 · Projeto: um serviço REST sem IA (`projeto`)

- **Formato:** aula de projeto guiado. Ela mostra a construção com saídas reais e termina com a especificação e o checklist para o aluno fazer o dele.
- **Conteúdo do módulo:**
  - FastAPI + PostgreSQL + Git + Docker + deploy (docker compose);
  - CRUD de pedidos e uma integração externa real: ViaCEP para o endereço de entrega;
  - tratamento de falhas: timeout, API externa fora do ar, erro claro para o cliente;
  - testes e logs;
  - **uma falha de IA documentada:** um erro real do assistente de código durante a construção, registrado e corrigido. Por exemplo, um código sugerido que não rodava.
- **Objetivo:** o aluno sai com a especificação do serviço, os critérios de pronto e o plano de execução, e sabe o que conferir em cada etapa.
- **Dados reais:**
  - o agente constrói o serviço de verdade na pasta de trabalho, com compose nas portas 8008 e 5408;
  - testes passando;
  - chamada real ao ViaCEP;
  - timeout simulado com a resposta real do serviço;
  - um log estruturado real.
- **Fontes:** docs do FastAPI, PostgreSQL, Docker Compose e ViaCEP.
- **Ganchos:** recapitula 01–07 e abre o L1/L2: o LLM vai ficar na frente deste serviço, transformando a mensagem do cliente no JSON do pedido.
