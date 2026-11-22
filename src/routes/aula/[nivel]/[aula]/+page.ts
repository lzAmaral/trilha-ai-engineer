import { error } from '@sveltejs/kit';
import { getNivel, niveis } from '#lib/roadmap.ts';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	niveis.flatMap((n) => n.modulos.map((m) => ({ nivel: n.slug, aula: m.slug })));

export const load: PageLoad = ({ params }) => {
	const nivel = getNivel(params.nivel);
	const modulo = nivel?.modulos.find((m) => m.slug === params.aula);
	if (!nivel || !modulo) error(404, 'Aula não encontrada');
	return { nivel, modulo };
};
