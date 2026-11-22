import { error } from '@sveltejs/kit';
import { getNivel, niveis } from '#lib/roadmap.ts';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => niveis.map((n) => ({ nivel: n.slug }));

export const load: PageLoad = ({ params }) => {
	const nivel = getNivel(params.nivel);
	if (!nivel) error(404, 'Nível não encontrado');
	return { nivel };
};
