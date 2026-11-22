# DESIGN.md · Trilha AI Engineer

> If this file and the code disagree, the code wins until the person decides. Note the conflict under Open questions.

## Product
Plataforma de estudo pessoal, em português, para virar AI Engineer. Segue a estrutura do roadmap
"AI Engineering Roadmap 2026" (16 níveis, L0–L15, em 7 fases), mas troca os vídeos por **aulas interativas
próprias** (uma por módulo, 18–26 telas, feitas com a skill `aula-interativa`). Site estático na Vercel.
Usada principalmente no notebook; precisa funcionar no celular.
Tela mais usada: a **trilha** — ver onde estou, o que já concluí e abrir a próxima aula em um clique.

## Audience and voice
O Luiz: desenvolvedor (SvelteKit, Python, deploy), não é iniciante em código, é iniciante em IA.
Voz direta, técnica sem ser seca, frases curtas, "você". Termos técnicos em inglês quando é o termo
de mercado (token, embedding, RAG), sempre explicados. Português do Brasil; datas 22/11/2026.

## Mood
Words: técnico e preciso, motivador e com energia. Never like: gamificado infantil (mascote, confete,
medalha por tudo, estilo Duolingo).

## Brand
Nada existente; tudo abaixo é proposta (assumed).
- Nome: "Trilha AI Engineer" (assumed).
- Superfícies neutras grafite/quase-branco; **um acento laranja vivo** só para ação principal e progresso — aprovado 22/11 (tokens em `design/tokens.css`).
- 7 fases com uma cor de identificação cada, usada só em marcadores pequenos da trilha (assumed).
- Fontes: Geist (texto e títulos) + Geist Mono (números, códigos de nível como `L1`, metadados) — aprovado 22/11.
- As aulas usam os mesmos tokens de cor e fonte da plataforma, para parecer um produto só (assumed).

## References
- Brilliant.org — take: trilha visual de progresso (feito marcado, próximo passo em destaque); cards de curso grandes e clicáveis; avoid: nada específico (mas sem streak/XP, pelo "never like").

## Constraints
Desktop primeiro (1440 px), funcionando bem em 390 px. Claro e escuro seguindo o sistema.
WCAG AA de contraste. Progresso salvo só no navegador (localStorage), sem login.
Motion contido na plataforma (o movimento fica dentro das aulas). Ícones: um conjunto de traço (assumed: Lucide).

## Decisions log
- 2026-11-22 — Começar pelo L1 · LLM 101, 12 aulas médias — base de tudo; L0 o Luiz já domina em boa parte.
- 2026-11-22 — Níveis sem aula aparecem no mapa como "em breve", com o conteúdo do módulo listado — a estrutura completa fica visível desde o dia 1.
- 2026-11-22 — Repositório público no GitHub, uma issue por nível, branch + PR por issue.
- 2026-11-22 — Mapa = trilha vertical (direção A): nós ligados por linha, cards grandes por nível, card "Continuar" no topo — é a referência Brilliant e dá sensação de jornada; o atalho "Continuar" compensa a rolagem longa.
- 2026-11-22 — Nível = lista de cards de aula (número/✓, título, tópicos, ação à direita); próxima aula com borda laranja e barra de telas.
- 2026-11-22 — Aula = barra fina de 56px (voltar, "Aula X de N", próxima) + aula em iframe; aula marcada como feita ao chegar na última tela; "Próxima aula" vira primária quando a aula está feita.
- 2026-11-22 — Nível só vira "em andamento" quando há progresso registrado nele; na primeira visita o destaque é "Comece por aqui" no card do topo.
- 2026-11-22 — Aulas só no tema claro (o player da skill é claro); a plataforma segue o tema do sistema.
- 2026-11-22 — Total de módulos = 165 (soma real dos níveis), não o 172 do site original.

## Open questions
- Nome "Trilha AI Engineer" serve? (assumed)
