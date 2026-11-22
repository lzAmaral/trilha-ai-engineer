// Estrutura baseada no "AI Engineering Roadmap 2026" (CampusX), traduzida e resumida.
// As aulas são próprias (skill aula-interativa); este arquivo só descreve a trilha.

export type Modulo = {
	slug: string; // usado na URL e no nome do arquivo da aula
	titulo: string;
	topicos: string[];
	projeto?: boolean; // capstone "Ship it"
};

export type Nivel = {
	n: number;
	slug: string;
	titulo: string;
	resumo: string;
	fase: number;
	sessoes: number;
	entrevista: number; // peso em entrevista (0–10)
	trabalho: number; // peso no dia a dia (0–10)
	pressupoe: number[];
	modulos: Modulo[];
};

export type Fase = { n: number; titulo: string; tema: string };

export const fases: Fase[] = [
	{ n: 1, titulo: 'Fundamentos', tema: 'software, LLM 101, orquestração, prompts' },
	{ n: 2, titulo: 'Retrieval', tema: 'embeddings, busca vetorial, RAG' },
	{ n: 3, titulo: 'Agentes', tema: 'agentes e engenharia de contexto' },
	{ n: 4, titulo: 'Avaliação e confiança', tema: 'evals e segurança' },
	{ n: 5, titulo: 'Produção', tema: 'system design, LLMOps, plataformas gerenciadas' },
	{ n: 6, titulo: 'Fronteira e prova', tema: 'multimodal, fine-tuning, projetos' },
	{ n: 7, titulo: 'Entrevista', tema: 'posicionamento, cenários, simulados' }
];

const m = (slug: string, titulo: string, topicos: string[], projeto = false): Modulo => ({
	slug,
	titulo,
	topicos,
	...(projeto ? { projeto } : {})
});

export const niveis: Nivel[] = [
	{
		n: 0, slug: 'l0', fase: 1, sessoes: 22, entrevista: 9, trabalho: 10, pressupoe: [],
		titulo: 'Fundamentos de engenharia de software',
		resumo: 'Python, HTTP, APIs com FastAPI, banco de dados, Git e deploy: a base para construir qualquer sistema de IA.',
		modulos: [
			m('python', 'Python para AI Engineering', ['Python idiomático e estruturas de dados', 'Type hints e modelos estilo Pydantic', 'Arquivos, env, JSON e CSV', 'Sync vs async', 'Ambientes com uv, módulos e pytest']),
			m('web-http', 'A Web: HTTP, REST e JSON', ['Ciclo request/response', 'Métodos e idempotência', 'Status codes, headers e cookies', 'Design RESTful', 'Autenticação básica, curl e Postman']),
			m('fastapi', 'APIs com FastAPI', ['Rotas e validação com Pydantic', 'Injeção de dependências', 'Respostas de erro e OpenAPI', 'Config, middleware e testes de endpoint']),
			m('dados', 'Dados e persistência', ['Modelagem relacional', 'PostgreSQL e SQL', 'Índices', 'Conexão a partir da aplicação', 'Credenciais fora do código']),
			m('git', 'Git e colaboração', ['Branch → PR → merge', 'Commits e conflitos', '.gitignore e README', 'Code review']),
			m('dev-com-ia', 'Desenvolvimento assistido por IA', ['Agentes de código e contexto mínimo útil', 'CLAUDE.md e spec-driven development', 'Slash commands, Skills e subagentes', 'MCP, hooks e plugins', 'Verificar cada diff']),
			m('containers', 'Containers e deploy', ['Imagens vs containers', 'Dockerfile e FastAPI em container', 'Deploy em URL pública', 'Variáveis e segredos em produção']),
			m('projeto', 'Projeto: um serviço REST sem IA', ['FastAPI + PostgreSQL + Git + Docker + deploy', 'CRUD e uma integração externa', 'Tratamento de falhas, testes e logs', 'Uma falha de IA documentada'], true)
		]
	},
	{
		n: 1, slug: 'l1', fase: 1, sessoes: 15, entrevista: 8, trabalho: 7, pressupoe: [],
		titulo: 'LLM 101',
		resumo: 'O que um LLM é por dentro, como aprende, como gera texto e como escolher o modelo certo para cada tarefa.',
		modulos: [
			m('o-que-e-um-llm', 'O que um LLM realmente é', ['Previsão do próximo token', 'O que um LLM não é']),
			m('tokenizacao', 'Tokenização', ['Tokens vs caracteres e palavras', 'Impacto em custo e latência']),
			m('dentro-de-um-llm', 'Dentro de um LLM', ['Embeddings, attention e transformers', 'Denso vs Mixture-of-Experts', 'Parâmetros totais vs ativos']),
			m('como-llms-aprendem', 'Como LLMs aprendem', ['Pré-treino', 'Pós-treino: SFT, RLHF e RLAIF', 'Por que modelos de chat se comportam assim']),
			m('inferencia', 'Como a inferência funciona', ['Prefill vs decode', 'TTFT e KV cache', 'O que encarece a inferência']),
			m('sampling', 'Sampling e parâmetros de geração', ['Temperature, top-p e top-k', 'Penalidades', 'Ajustar a aleatoriedade à tarefa']),
			m('raciocinio', 'Modelos de raciocínio e test-time compute', ['Orçamento de raciocínio', 'Quando raciocinar ajuda e quando desperdiça']),
			m('janela-de-contexto', 'A janela de contexto', ['O que ocupa a janela', 'Contexto ≠ conhecimento ≠ memória', 'Lost in the middle']),
			m('falhas', 'Capacidades e modos de falha', ['Alucinação e fragilidade', 'A pergunta certa: com que confiabilidade?']),
			m('panorama', 'Panorama de modelos', ['API fechada vs open-weight vs plataformas', 'Knowledge cutoff e versão fixada', 'Licenças open-weight']),
			m('benchmarks', 'Benchmarks e leaderboards', ['MMLU, GPQA e afins', 'Contaminação', 'Por que o ranking raramente se transfere']),
			m('escolher-modelo', 'Escolhendo o modelo certo', ['Oito dimensões: capacidade, qualidade, latência, custo, contexto, modalidades, privacidade, recursos', 'O fluxo de seleção'])
		]
	},
	{
		n: 2, slug: 'l2', fase: 1, sessoes: 19, entrevista: 8, trabalho: 10, pressupoe: [1],
		titulo: 'Trabalhando com APIs de LLM',
		resumo: 'Chamadas, streaming, saídas estruturadas, tool calling e robustez: orquestrar LLMs dentro de software de verdade.',
		modulos: [
			m('primeiras-chamadas', 'Primeiras chamadas e estado da conversa', ['Chamadas pelo SDK', 'A API não guarda estado', 'Chaves de API e o objeto de resposta']),
			m('streaming', 'Streaming', ['Renderização incremental', 'TTFT', 'Streams interrompidos']),
			m('langchain', 'Fundamentos de LangChain', ['Models, templates, parsers e runnables', 'SDK puro vs LangChain']),
			m('saidas-estruturadas', 'Saídas estruturadas', ['Geração guiada por schema', 'Pydantic e JSON Schema', 'Gerar → validar → reparar']),
			m('tool-calling', 'Function e tool calling', ['O loop completo', 'IDs de tool call', 'Chamadas sequenciais e paralelas', 'Falhas de ferramenta']),
			m('boas-ferramentas', 'Projetando boas ferramentas', ['Nomes e descrições', 'Ferramentas sobrepostas', 'Argumentos como entrada não confiável']),
			m('workflows', 'Workflows de várias etapas', ['Sequencial, roteado e fan-out', 'Workflows vs agentes']),
			m('concorrencia', 'Async, concorrência e batching', ['Concorrência limitada', 'Rate limits', 'Throughput vs custo']),
			m('robustez', 'Robustez', ['Retries, backoff e jitter', 'Timeouts e fallbacks', 'Onde mora a lógica de confiabilidade']),
			m('custo-observabilidade', 'Custo, uso e observabilidade', ['Custo por requisição', 'Traces', 'Depurar sem print()']),
			m('frameworks', 'Outros frameworks de orquestração', ['LlamaIndex, LangGraph e DSPy', 'Como escolher']),
			m('projeto', 'Projeto: assistente com streaming e ferramentas', ['2–3 ferramentas reais', 'Saídas estruturadas, retries e timeouts', 'Log de uso, latência e custo', 'Sem RAG e sem agentes'], true)
		]
	},
	{
		n: 3, slug: 'l3', fase: 1, sessoes: 11, entrevista: 5, trabalho: 8, pressupoe: [2],
		titulo: 'Engenharia de prompt',
		resumo: 'Anatomia de um prompt, few-shot, system prompts, controle de saída e como medir se um prompt é melhor que outro.',
		modulos: [
			m('anatomia', 'Anatomia de um prompt', ['Instruções, contexto, restrições e exemplos', 'Papéis', 'Separar instruções de dados']),
			m('few-shot', 'Zero-shot e few-shot', ['Desenho, qualidade e ordem dos exemplos', 'Few-shot vs fine-tuning']),
			m('decomposicao', 'Raciocínio e decomposição', ['Quando raciocinar ajuda', 'Quebrar a tarefa em partes']),
			m('system-prompt', 'Projetando o system prompt', ['Regras estáveis vs instruções da tarefa', 'Entradas fora do escopo']),
			m('controle-de-saida', 'Controlando a saída', ['Estilo, tamanho e formato', 'Quando schema vence o prompt']),
			m('confiabilidade', 'Confiabilidade e depuração de prompts', ['Conjuntos de teste', 'Comparar versões nos mesmos exemplos', 'Reduzir variância']),
			m('versionamento', 'Versionamento, custo e cache', ['Prompt versionado como código', 'Enxugar contexto', 'Prompt caching']),
			m('injecao', 'Noções de prompt injection', ['Entrada não confiável', 'Texto não é fronteira de segurança']),
			m('projeto', 'Projeto: otimizar um prompt real', ['Conjunto de teste e versões concorrentes', 'Medir correção, formato, consistência, tokens e custo'], true)
		]
	},
	{
		n: 4, slug: 'l4', fase: 2, sessoes: 27, entrevista: 10, trabalho: 9, pressupoe: [3],
		titulo: 'RAG',
		resumo: 'Da ingestão de documentos à busca híbrida e ao RAG avançado com citações: o nível mais cobrado em entrevistas.',
		modulos: [
			m('ingestao', 'Ingestão e processamento de documentos', ['PDF, HTML e DOCX', 'OCR e limpeza', 'Duplicatas e reindexação']),
			m('chunking', 'Estratégias de chunking', ['Fixo, recursivo, estrutural e semântico', 'Tamanho, overlap e metadados']),
			m('embeddings', 'Fundamentos de embeddings', ['Escolher o modelo', 'Embeddings de modelos diferentes não se misturam']),
			m('busca-semantica', 'Similaridade e busca semântica', ['Cosseno, produto escalar e euclidiana', 'Busca semântica do zero', 'Onde ela falha']),
			m('vector-db', 'Bancos vetoriais e busca ANN', ['pgvector ou Qdrant', 'HNSW vs IVF', 'Filtros por metadados']),
			m('hibrida', 'Busca esparsa e híbrida', ['BM25', 'Denso vs esparso', 'Híbrida com RRF']),
			m('projeto-busca', 'Projeto: motor de busca híbrida', ['Ingerir, dividir, embedar e indexar', 'Denso + BM25 + híbrido', 'Deploy de API ou UI'], true),
			m('arquitetura-rag', 'Arquitetura RAG e quando usar', ['O pipeline central', 'Quando não usar RAG', 'Falha de busca vs falha de geração']),
			m('rag-do-zero', 'RAG básico do zero', ['Pipeline feito à mão', 'Prompt ancorado no contexto', 'Contexto fraco e o efeito do k']),
			m('reranking', 'Reranking', ['Buscar muitos → reordenar → enviar os melhores', 'Cross-encoders', 'Quando reranking agrega pouco']),
			m('query-transform', 'Transformação de consulta e RAG-Fusion', ['Reescrita e multi-query', 'HyDE e RAG-Fusion', 'Custos']),
			m('citacoes', 'Ancoragem, citações e abstenção', ['Citação ≠ ancoragem', 'Abster-se com evidência insuficiente']),
			m('rag-avancado', 'Variações e padrões avançados de RAG', ['Naive → Advanced → Adaptive', 'Self-RAG, CRAG e multi-hop', 'Graph RAG', 'Escolher pelo modo de falha']),
			m('rag-frameworks', 'RAG com frameworks', ['Refazer com LlamaIndex ou LangChain', 'Framework vs feito à mão']),
			m('projeto-rag', 'Projeto: aplicação RAG avançada em produção', ['Q&A sobre documentos com citações e abstenção', 'Baseline + uma melhoria real', 'Custo, latência e degradação graciosa'], true)
		]
	},
	{
		n: 5, slug: 'l5', fase: 3, sessoes: 22, entrevista: 9, trabalho: 7, pressupoe: [4],
		titulo: 'Agentes de IA',
		resumo: 'O loop do agente, ferramentas, MCP, memória, multiagentes e LangGraph, com confiabilidade e execução isolada.',
		modulos: [
			m('o-que-e-agente', 'O que é um agente?', ['O loop do agente', 'Workflow vs agente', 'Quando não construir um']),
			m('react', 'ReAct, planejamento e reflexão', ['Loop escrito à mão primeiro', 'Planejar antes vs passo a passo', 'Condições de parada']),
			m('ferramentas', 'Ferramentas para agentes', ['Recuperar de falhas', 'Limitar o tamanho do resultado', 'Ferramentas só leitura vs com consequência']),
			m('mcp', 'MCP (Model Context Protocol)', ['Host → client → server', 'Construir servidor e cliente', 'Permissões e servidores não confiáveis']),
			m('memoria', 'Noções de memória', ['Curto vs longo prazo', 'Escrever → buscar → atualizar → esquecer', 'Resumir e cortar']),
			m('multiagentes', 'Arquiteturas multiagente', ['Orquestrador → workers, handoffs, supervisor', 'A2A vs MCP', 'Quando um agente forte basta']),
			m('langgraph', 'Agentes com LangGraph', ['Estado, nós e arestas', 'Checkpoints e humano no loop', 'Execuções retomáveis']),
			m('sandbox', 'Execução isolada (sandbox)', ['E2B, Modal e containers', 'Restringir arquivos, rede e tempo']),
			m('confiabilidade', 'Confiabilidade, UX e recuperação de falhas', ['Orçamentos de passos, tempo e custo', 'Operações idempotentes e retomada', 'Cancelar, pausar e redirecionar']),
			m('frameworks', 'Frameworks e bibliotecas de agentes', ['LangGraph, Google ADK, CrewAI, Agno, OpenAI Agents SDK', 'Comparar pela arquitetura']),
			m('projeto', 'Projeto: um agente estilo produção', ['Pesquisa, MCP ou agente de código', '3+ ferramentas, estado explícito e parada', 'Recuperação de falhas e aprovação humana'], true)
		]
	},
	{
		n: 6, slug: 'l6', fase: 3, sessoes: 13, entrevista: 6, trabalho: 8, pressupoe: [5],
		titulo: 'Engenharia de contexto',
		resumo: 'Tratar a janela de contexto como orçamento: selecionar, comprimir, guardar fora e montar o harness do agente.',
		modulos: [
			m('contexto-recurso', 'A janela de contexto como recurso', ['Contexto como orçamento', 'Context rot', 'Distribuir o orçamento']),
			m('selecao', 'Seleção e montagem de contexto', ['Sempre presente, buscado ou excluído', 'Prioridade e ordem', 'Cortar o que envelheceu']),
			m('compressao', 'Compressão e compactação', ['Resumir histórico', 'Compactar saídas de ferramentas', 'Preservar dados exatos']),
			m('memoria-estado', 'Memória e estado fora do contexto', ['Scratchpads e arquivos', 'Agentes que tomam notas']),
			m('longo-contexto', 'Estratégias para contexto longo', ['Encher vs buscar vs resumir', 'Lost in the middle']),
			m('contexto-ferramentas', 'Contexto das ferramentas', ['Definições disputam espaço', 'Expor só o relevante', 'Filtrar saídas']),
			m('cache', 'Cache de contexto e eficiência', ['Contexto estável vs variável', 'Medir acertos de cache']),
			m('harness', 'Harness engineering', ['Loop, system prompt, ferramentas, estado e permissões', 'Trabalhar em várias janelas', 'AGENTS.md e subagentes']),
			m('projeto', 'Projeto: agente de longo horizonte com contexto gerenciado', ['Ingênuo vs gerenciado', 'Orçamento explícito, compactação e offloading', 'Arquivo de progresso e limites'], true)
		]
	},
	{
		n: 7, slug: 'l7', fase: 4, sessoes: 17, entrevista: 8, trabalho: 10, pressupoe: [4, 5],
		titulo: 'Avaliação de LLMs (evals)',
		resumo: 'Trocar o "parece bom" por medição: métodos, datasets dourados, regressão em CI e evals de RAG e de agentes.',
		modulos: [
			m('intro-evals', 'Introdução a evals', ['O problema do vibe testing', 'Determinístico vs probabilístico', 'Evals de modelo vs de aplicação']),
			m('metodos', 'Métodos e paradigmas de avaliação', ['Programático, humano e LLM-as-judge', 'Com e sem referência', 'Datasets dourados']),
			m('offline-online', 'Avaliação offline vs online', ['Suites antes do release', 'Monitorar produção e alertar', 'Falhas voltam para o dataset']),
			m('benchmarking', 'Avaliação de modelos e benchmarking', ['Anatomia de um benchmark', 'Leaderboards e armadilhas']),
			m('evolucao-benchmarks', 'A evolução dos benchmarks de conhecimento', ['MMLU e TruthfulQA → AGIEval', 'GPQA, MMLU-Pro, SimpleQA e HLE']),
			m('evals-custom', 'Avaliações customizadas', ['Eval na sua tarefa (ex.: Text-to-SQL)', 'Comparação justa', 'Qualidade × latência × custo']),
			m('suite-regressao', 'Suite de evals e testes de regressão', ['Componente, pipeline e app', 'Baselines e quality gates no CI', 'Dataset dourado que melhora sozinho']),
			m('evals-rag', 'Evals de RAG', ['Buscador e gerador', 'RAG Triad', 'DeepEval e RAGAS']),
			m('evals-agentes', 'Evals de agentes', ['Escolha e argumentos de ferramenta', 'Qualidade da trajetória', 'Conclusão, recuperação, segurança e eficiência'])
		]
	},
	{
		n: 8, slug: 'l8', fase: 4, sessoes: 15, entrevista: 5, trabalho: 7, pressupoe: [7],
		titulo: 'Segurança em IA',
		resumo: 'Modelo de ameaças, prompt injection, guardrails, segurança de agentes e RAG, privacidade e red teaming.',
		modulos: [
			m('ameacas', 'Modelo de ameaças em IA', ['Nova superfície de ataque', 'Fronteiras de confiança', 'Saída do modelo não é confiável']),
			m('injecao', 'Prompt injection e exfiltração', ['Direta vs indireta', 'Defesas em camadas', 'Por que "ignore instruções maliciosas" falha']),
			m('guardrails', 'Jailbreaks, guardrails e moderação', ['Jailbreak vs injection', 'Guardrails de entrada e saída', 'Entradas ofuscadas']),
			m('agentes-seguros', 'Segurança de agentes e ferramentas', ['Menor privilégio', 'Validar uso de ferramenta fora do LLM', 'Aprovação humana e sandbox']),
			m('rag-seguro', 'Segurança de RAG e conhecimento', ['Documentos buscados são dados', 'Envenenamento da busca', 'Permissões por documento e vazamento entre clientes']),
			m('privacidade', 'Privacidade, PII e segredos', ['Identificar e mascarar PII', 'Logs, traces e retenção', 'Proteger segredos']),
			m('red-team', 'Red teaming de sistemas de IA', ['Suites adversariais', 'Atacar RAG pelo corpus e agentes pelas ferramentas', 'Testes de regressão']),
			m('governanca', 'IA responsável e governança', ['Viés, transparência e documentação', 'EU AI Act e LGPD', 'Auditabilidade']),
			m('projeto', 'Projeto: atacar e proteger um RAG com agentes', ['Atacar um app feito antes', 'Menor privilégio, guardrails, PII e aprovação', 'Testes de regressão de segurança'], true)
		]
	},
	{
		n: 9, slug: 'l9', fase: 5, sessoes: 16, entrevista: 9, trabalho: 8, pressupoe: [8],
		titulo: 'System design de IA',
		resumo: 'Projetar sistemas de IA completos: requisitos, roteamento, cache, latência, confiabilidade e estudos de caso.',
		modulos: [
			m('framework', 'O framework de system design de IA', ['Requisitos', 'Prompt vs RAG vs agentes vs fine-tuning', 'Qualidade ↔ latência ↔ custo', 'Baseline primeiro']),
			m('conhecimento', 'Arquitetura de contexto e conhecimento', ['Fontes de conhecimento', 'Ingestão → busca → rerank → montagem', 'Atualização, acesso e procedência']),
			m('roteamento', 'Roteamento de modelos e gateways', ['Rotear por tarefa, custo e risco', 'Cascatas e fallback entre provedores']),
			m('latencia', 'Latência e otimização de inferência', ['Onde vai o tempo', 'Streaming e paralelismo', 'Modelos menores e batching']),
			m('cache', 'Arquitetura de cache', ['Exato, de prompt, de busca e semântico', 'Invalidação e taxa de acerto']),
			m('confiabilidade', 'Confiabilidade e degradação graciosa', ['Timeouts, retries e circuit breakers', 'Filas', 'Caminhos de degradação e SLAs']),
			m('orquestracao', 'Orquestração de pipelines de IA', ['Decisão determinística vs delegada ao modelo', 'Síncrono, assíncrono e em fila']),
			m('monitoramento', 'Monitoramento, feedback e melhoria contínua', ['Métricas', 'Feedback explícito e implícito', 'Deploy → observar → melhorar']),
			m('casos', 'Estudos de caso', ['Copiloto de suporte', 'Assistente de código', 'Agente de pesquisa profunda']),
			m('projeto', 'Projeto: documento de system design de IA', ['Design completo com diagrama', 'Orçamentos, segurança e evals', 'Alternativas rejeitadas'], true)
		]
	},
	{
		n: 10, slug: 'l10', fase: 5, sessoes: 23, entrevista: 7, trabalho: 9, pressupoe: [0, 4, 5, 7, 8],
		titulo: 'LLMOps: do desenvolvimento à produção',
		resumo: 'Versionar prompts, barrar regressões no CI, servir com streaming, publicar na AWS e operar com métricas e runbooks.',
		modulos: [
			m('o-que-e-llmops', 'O que o LLMOps acrescenta', ['LLMOps vs MLOps', 'O que é um release: código, prompts, modelo, índice, ferramentas']),
			m('preparar-apps', 'Preparando apps para produção', ['Config em vez de código', 'Versões fixadas', 'Trace por requisição']),
			m('experimentos', 'Rastreio de experimentos e versionamento de prompts', ['MLflow', 'Registro de prompts (Langfuse)', 'Rollback trocando um rótulo']),
			m('eval-gate', 'Avaliação como portão de release', ['DeepEval no CI', 'Limites por métrica', 'Lidar com não determinismo']),
			m('guardrails-runtime', 'Guardrails em tempo de execução', ['Guardrails AI e NeMo Guardrails', 'Limites de passos e gasto do agente']),
			m('servir', 'Servir a aplicação e containers', ['FastAPI com SSE', 'Health checks', 'Docker Compose e segredos']),
			m('ci-cd', 'CI/CD com GitHub Actions', ['Testes → eval gate → build', 'Imagens por commit', 'Aprovação manual e rollback']),
			m('aws', 'Deploy na AWS', ['EC2, IAM e Secrets Manager', 'CodeDeploy e blue/green', 'ALB, Auto Scaling e rate limits']),
			m('observabilidade', 'Monitoramento e observabilidade', ['Prometheus e Grafana', 'Alertas', 'Tracing com Langfuse e evals online']),
			m('incidentes', 'Incidentes, rollbacks e gestão de mudança', ['Incidentes típicos de LLM', 'Runbooks', 'Reavaliar ao trocar de modelo']),
			m('projeto', 'Projeto de LLMOps', ['Prompts versionados e CI que barra regressão', 'CI/CD até a EC2', 'Dashboards, alertas, um rollback e um runbook'], true)
		]
	},
	{
		n: 11, slug: 'l11', fase: 5, sessoes: 18, entrevista: 6, trabalho: 7, pressupoe: [9, 10],
		titulo: 'Plataformas de IA gerenciadas',
		resumo: 'Bedrock, Vertex AI e Azure AI Foundry, open-weight hospedado, gateways e o custo real de cada caminho.',
		modulos: [
			m('tres-caminhos', 'Os três jeitos de consumir um modelo', ['API pública', 'Plataforma gerenciada na sua nuvem', 'Open-weight hospedado']),
			m('anatomia', 'Anatomia das plataformas', ['Bedrock, Vertex AI e Azure AI Foundry', 'Catálogo, endpoints, identidade e billing']),
			m('identidade-rede', 'Identidade, rede e isolamento', ['Identidade da nuvem em vez de chave', 'Conectividade privada', 'Chaves gerenciadas pelo cliente']),
			m('regioes', 'Regiões, residência de dados e compliance', ['Modelos por região', 'Residência de dados', 'Termos de retenção e treino']),
			m('capacidade', 'Capacidade, cotas e custo', ['On-demand vs throughput provisionado', 'Custo por requisição e orçamentos']),
			m('open-weight', 'Plataformas de modelos open-weight', ['Do hub ao vLLM/TGI/Ollama', 'Por token vs por hora de GPU', 'Cold start e dimensionar hardware']),
			m('gateways', 'Roteadores de modelo e gateways', ['OpenRouter, Portkey e LiteLLM', 'Failover, chaves virtuais e cache', 'O gateway como ponto crítico']),
			m('comprar-construir', 'Blocos gerenciados: comprar ou construir', ['Busca, agentes, guardrails e evals gerenciados', 'Fine-tuning gerenciado']),
			m('portabilidade', 'Portabilidade, lock-in e migração', ['O que viaja e o que não viaja', 'Trade-offs de multicloud']),
			m('projeto', 'Projeto: publicar numa plataforma gerenciada', ['Identidade sem chave de API', 'Um componente comprado e um construído', 'Gateway com fallback e alerta de orçamento'], true)
		]
	},
	{
		n: 12, slug: 'l12', fase: 6, sessoes: 20, entrevista: 4, trabalho: 5, pressupoe: [1, 2, 4],
		titulo: 'Multimodal 101: além do texto',
		resumo: 'Visão, documentos, geração de imagem, áudio, agentes de voz em tempo real e busca entre modalidades.',
		modulos: [
			m('o-que-e', 'O que é um modelo multimodal', ['Nativo vs pipeline acoplado', 'Texto como língua franca']),
			m('visao-tokens', 'Visão: como imagens viram tokens', ['Patches e encoders de visão', 'Por que imagens custam muitos tokens', 'Tiling e perda ao reduzir']),
			m('visao-falhas', 'Visão: capacidades e modos de falha', ['Contagem e raciocínio espacial', 'Detalhe visual inventado']),
			m('visao-documentos', 'Visão: documentos, gráficos e RAG visual', ['OCR vs visão nativa', 'Tabelas e formulários', 'Extração guiada por schema']),
			m('geracao-imagem', 'Visão: geração de imagem e vídeo', ['Denoising e controle por prompt', 'Inpainting e outpainting', 'Procedência e direitos']),
			m('audio-tokens', 'Áudio: como som vira tokens', ['Onda → espectrograma → tokens', 'Custo por segundo']),
			m('stt-tts', 'Áudio: fala para texto e texto para fala', ['Transcrição, diarização e WER', 'TTS e síntese em streaming']),
			m('voz-tempo-real', 'Áudio: agentes de voz em tempo real', ['Orçamento de latência', 'Cascata vs speech-to-speech', 'VAD, barge-in e silêncio de tool call']),
			m('busca-cross-modal', 'Busca entre modalidades', ['Espaço de embedding compartilhado', 'Embeddings estilo CLIP']),
			m('escolher', 'Escolhendo um modelo multimodal', ['Preço por imagem e por minuto', 'Latência por modalidade', 'Privacidade de voz e rosto']),
			m('deep-research', 'Pesquisa profunda e tarefas longas', ['Amplitude e depois profundidade', 'Ler fontes criticamente', 'Relatórios auditáveis']),
			m('on-device', 'Modalidades no dispositivo e na borda', ['Quantização', 'Limites de celular e notebook']),
			m('projeto', 'Projeto: algo multimodal publicado', ['Duas modalidades com entradas reais', 'Latência e custo por modalidade', 'README que outra pessoa consegue rodar'], true)
		]
	},
	{
		n: 13, slug: 'l13', fase: 6, sessoes: 16, entrevista: 7, trabalho: 3, pressupoe: [1, 7, 11],
		titulo: 'Fine-tuning',
		resumo: 'Quando vale ajustar um modelo, como montar os dados, SFT, LoRA/QLoRA, DPO, destilação e como servir o resultado.',
		modulos: [
			m('vale-a-pena', 'Vale a pena fazer fine-tuning?', ['A escada de custo: prompt → busca → ferramentas → modelo maior → fine-tune', 'Para que serve e para que não serve']),
			m('dados', 'Curadoria de dados para fine-tuning', ['Especificar o comportamento', 'Chat templates', 'Poucos exemplos limpos vencem muitos sujos']),
			m('sft', 'Supervised fine-tuning (SFT)', ['O loop de treino e hiperparâmetros', 'Primeira execução com TRL', 'Curvas de loss e esquecimento']),
			m('lora', 'LoRA e QLoRA', ['Adapters', 'Rank, alpha e módulos-alvo', 'Unsloth ou Axolotl e memória de GPU']),
			m('dpo', 'Preference tuning e DPO', ['Demonstrações vs preferências', 'Montar pares', 'Quando SFT basta']),
			m('rft', 'Reinforcement fine-tuning (RFT)', ['Ajuste por recompensa', 'Tarefas avaliáveis', 'Reward hacking']),
			m('destilacao', 'Destilação', ['Professor → aluno', 'Filtrar saídas do professor', 'Erros copiados e termos de uso']),
			m('avaliar', 'Avaliando fine-tunes', ['Baseline antes de treinar', 'Mesmo conjunto e mesmo juiz', 'Regressões fora da tarefa']),
			m('servir', 'Servindo o adapter', ['Pesos separados vs mesclados', 'vLLM multi-LoRA e Ollama', 'Rollout gradual via gateway']),
			m('projeto', 'Projeto: um LoRA que vence o prompt', ['Falha medida com meta definida antes', 'Baseline forte com prompt', 'Execução reproduzível e registro da decisão'], true)
		]
	},
	{
		n: 14, slug: 'l14', fase: 6, sessoes: 16, entrevista: 10, trabalho: 6, pressupoe: [4, 5, 10, 12],
		titulo: 'Projetos',
		resumo: 'Sete projetos de portfólio que juntam tudo. Publique de 3 a 5.',
		modulos: [
			m('qa-documentos', 'Plataforma de perguntas sobre documentos', ['RAG + FastAPI + eval de busca', 'Deploy público'], true),
			m('triagem-curriculo', 'Agente de triagem currículo ↔ vaga', ['Tool calling e saída estruturada num caso de negócio'], true),
			m('pesquisa-multiagente', 'Sistema multiagente de relatórios de pesquisa', ['Orquestração e estado com LangGraph'], true),
			m('mcp-real', 'Servidor MCP para uma ferramenta real', ['Conectar um modelo a agenda, CRM ou tarefas'], true),
			m('api-monitorada', 'API em produção monitorada', ['Roteamento, fallback, limite de custo e tracing'], true),
			m('voz-multimodal', 'Projeto de voz ou multimodal', ['Agente de voz em tempo real ou pipeline de visão'], true),
			m('portfolio', 'Portfólio e posicionamento', ['Write-ups, GitHub, demos e apresentação'])
		]
	},
	{
		n: 15, slug: 'l15', fase: 7, sessoes: 16, entrevista: 9, trabalho: 1, pressupoe: [14],
		titulo: 'Preparação para entrevista de AI Engineer',
		resumo: 'Posicionamento, cenários de RAG, agentes, fine-tuning e LLMOps, system design e um simulado completo.',
		modulos: [
			m('estrategia', 'Estratégia de entrevista e posicionamento', ['Como as entrevistas mudaram', 'Ler uma vaga', 'AI Engineer vs GenAI DS vs DS']),
			m('cenarios-rag', 'Cenários de entrevista: RAG em produção', ['Ingestão bagunçada e escala', '"A qualidade caiu depois de uma semana"']),
			m('cenarios-agentes', 'Cenários de entrevista: agentes', ['Workflow vs agente autônomo', 'Loops, custo e permissões demais']),
			m('cenarios-fine-tuning', 'Cenários de entrevista: fine-tuning', ['Prompt vs RAG vs fine-tuning', '"A acurácia caiu depois do deploy"']),
			m('cenarios-llmops', 'Cenários de entrevista: LLMOps e depuração', ['Picos de latência, quedas e custo explodindo', 'Alertar, reverter ou investigar']),
			m('system-design', 'Entrevistas de system design de IA', ['Premissas a partir da ambiguidade', 'Arquitetura mais simples primeiro', 'Sistemas para praticar']),
			m('atualizado', 'Manter-se atualizado sem correr atrás de hype', ['Benchmarks → shortlist → evals próprios → rollout controlado']),
			m('defesa-projetos', 'Defesa de projetos e portfólio', ['Problema → arquitetura → resultado', '"O que quebra primeiro com 100× de tráfego?"']),
			m('comportamental', 'Comunicação comportamental', ['Explicitar premissas e trade-offs', 'Medir em vez de blefar']),
			m('projeto', 'Projeto: simulado completo de entrevista', ['Cenários rápidos de produção', 'System design a partir de um brief ambíguo', 'Defesa profunda de projeto'], true)
		]
	}
];

export const totalModulos = niveis.reduce((s, n) => s + n.modulos.length, 0);
export const getNivel = (slug: string) => niveis.find((n) => n.slug === slug);
export const fase = (n: number) => fases.find((f) => f.n === n)!;
