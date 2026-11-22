# Trilha AI Engineer

Plataforma pessoal de estudo para virar **AI Engineer**, em português.

A estrutura segue o [AI Engineering Roadmap 2026](https://ai-engineer-roadmap-2026.vercel.app/): 16 níveis em 7 fases, 165 módulos. A diferença é que cada módulo vira uma **aula interativa própria**, feita com a skill [`aula-interativa`](https://github.com/gabrielgreco1/skills/tree/main/aula-interativa), em vez de links para vídeos. Cada aula tem telas curtas, diagramas animados, mocks e prática com feedback.

## Stack

- SvelteKit (Svelte 5) com prerender, deploy na Vercel (`@sveltejs/adapter-vercel`)
- Progresso salvo no navegador (`localStorage`), sem login
- Design: `DESIGN.md` (brief) + `design/tokens.css` (tokens) + `design/guide-foundations.html` (guia)

## Rodar

```bash
npm i
npm run dev
```

## Estrutura

| Caminho | O que é |
|---|---|
| `src/lib/roadmap.ts` | Fases, níveis e módulos (títulos e tópicos em PT-BR) |
| `src/lib/aulas.ts` | Quais aulas já estão publicadas |
| `src/lib/progresso.svelte.ts` | Progresso por aula (tela atual, feita) no `localStorage` |
| `src/routes/(site)/+page.svelte` | Mapa: a trilha vertical |
| `src/routes/(site)/nivel/[nivel]` | Página do nível com as aulas |
| `src/routes/aula/[nivel]/[aula]` | A aula em tela cheia (iframe) com barra de navegação |
| `static/aulas/<nivel>/<NN>-<slug>.html` | Aulas empacotadas (HTML único, offline) |

## Publicar uma aula nova

1. Gere a aula com a skill `aula-interativa` (idioma PT-BR, profundidade 2) usando o tema em `ai-engineer-aulas-work/_tema/`.
2. Empacote com `pack.mjs` para `static/aulas/<nivel>/<NN>-<slug>.html`. `NN` é a posição do módulo no nível e `slug` vem de `roadmap.ts`.
3. Acrescente o `slug` em `publicadas` (`src/lib/aulas.ts`).
4. Abra um PR que referencia a issue do nível.

A plataforma lê `window.lesson` (o player da skill) dentro do iframe para saber a tela atual e marcar a aula como feita ao chegar na última tela.
