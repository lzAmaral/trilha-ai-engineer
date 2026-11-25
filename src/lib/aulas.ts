import { niveis, type Modulo, type Nivel } from './roadmap.ts';

// Aulas já produzidas (arquivo em static/aulas/<nivel>/<NN>-<slug>.html).
// Ao publicar uma aula nova, acrescente o slug do módulo aqui.
export const publicadas: Record<string, string[]> = {
	l0: ['python', 'web-http', 'fastapi', 'dados', 'git', 'dev-com-ia', 'containers', 'projeto'],
	l1: ['o-que-e-um-llm', 'tokenizacao', 'dentro-de-um-llm', 'como-llms-aprendem', 'inferencia', 'sampling', 'raciocinio', 'janela-de-contexto', 'falhas', 'panorama', 'benchmarks', 'escolher-modelo'],
	l2: ['primeiras-chamadas', 'streaming', 'langchain', 'saidas-estruturadas']
};

export const numero = (nivel: Nivel, modulo: Modulo) =>
	String(nivel.modulos.indexOf(modulo) + 1).padStart(2, '0');

export const arquivoDaAula = (nivel: Nivel, modulo: Modulo) =>
	`/aulas/${nivel.slug}/${numero(nivel, modulo)}-${modulo.slug}.html`;

export const temAula = (nivel: Nivel, modulo: Modulo) =>
	(publicadas[nivel.slug] ?? []).includes(modulo.slug);

export const aulasDoNivel = (nivel: Nivel) => nivel.modulos.filter((m) => temAula(nivel, m));

export const nivelTemAulas = (nivel: Nivel) => aulasDoNivel(nivel).length > 0;

export const totalPublicadas = () => niveis.reduce((s, n) => s + aulasDoNivel(n).length, 0);

/** Ordem global das aulas publicadas, para achar "a próxima". */
export const sequencia = () =>
	niveis.flatMap((n) => aulasDoNivel(n).map((m) => ({ nivel: n, modulo: m })));
