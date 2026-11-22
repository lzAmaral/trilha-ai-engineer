import { browser } from '$app/env';
import { sequencia } from './aulas.ts';
import type { Modulo, Nivel } from './roadmap.ts';

// Progresso salvo só neste navegador (localStorage). Sem login.
export type RegistroAula = { tela: number; total: number; feita: boolean; em: number };
type Estado = { aulas: Record<string, RegistroAula>; ultima?: string };

const CHAVE = 'trilha-ai-engineer:v1';

export const chave = (nivel: Nivel, modulo: Modulo) => `${nivel.slug}/${modulo.slug}`;

function ler(): Estado {
	try {
		const bruto = localStorage.getItem(CHAVE);
		return bruto ? (JSON.parse(bruto) as Estado) : { aulas: {} };
	} catch {
		return { aulas: {} };
	}
}

class Progresso {
	estado = $state<Estado>({ aulas: {} });
	carregado = $state(false);
	salvaFalhou = $state(false);

	carregar() {
		if (!browser || this.carregado) return;
		this.estado = ler();
		this.carregado = true;
		try {
			localStorage.setItem(CHAVE + ':teste', '1');
			localStorage.removeItem(CHAVE + ':teste');
		} catch {
			this.salvaFalhou = true;
		}
	}

	private salvar() {
		try {
			localStorage.setItem(CHAVE, JSON.stringify(this.estado));
			this.salvaFalhou = false;
		} catch {
			this.salvaFalhou = true;
		}
	}

	de(nivel: Nivel, modulo: Modulo): RegistroAula | undefined {
		return this.estado.aulas[chave(nivel, modulo)];
	}

	registrar(nivel: Nivel, modulo: Modulo, tela: number, total: number) {
		const k = chave(nivel, modulo);
		const antes = this.estado.aulas[k];
		const feita = (antes?.feita ?? false) || tela >= total - 1;
		if (antes && antes.tela === tela && antes.total === total && antes.feita === feita && this.estado.ultima === k) return;
		this.estado.aulas[k] = { tela, total, feita, em: Date.now() };
		this.estado.ultima = k;
		this.salvar();
	}

	feitasNoNivel(nivel: Nivel) {
		return nivel.modulos.filter((m) => this.de(nivel, m)?.feita).length;
	}

	totalFeitas() {
		return Object.values(this.estado.aulas).filter((a) => a.feita).length;
	}

	/** A aula para "Continuar": a última aberta se não terminou, senão a primeira publicada não feita. */
	proxima() {
		const seq = sequencia();
		const ultima = this.estado.ultima;
		if (ultima) {
			const item = seq.find((s) => chave(s.nivel, s.modulo) === ultima);
			if (item && !this.de(item.nivel, item.modulo)?.feita) return item;
		}
		return seq.find((s) => !this.de(s.nivel, s.modulo)?.feita);
	}

	zerar() {
		this.estado = { aulas: {} };
		this.salvar();
	}
}

export const progresso = new Progresso();
