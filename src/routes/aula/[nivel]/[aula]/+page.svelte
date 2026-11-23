<script lang="ts">
	import { arquivoDaAula, numero, temAula } from '#lib/aulas.ts';
	import { progresso } from '#lib/progresso.svelte.ts';
	import type { PageProps } from './$types';

	type Licao = {
		ready: boolean;
		error?: string;
		readyPromise: Promise<unknown>;
		getState: () => { slide: number };
		getManifest: () => { slides: unknown[] };
		seek: (q: { slide: number; step?: number; time?: number }) => unknown;
		replay: () => void;
	};

	let { data }: PageProps = $props();
	let nivel = $derived(data.nivel);
	let modulo = $derived(data.modulo);
	let idx = $derived(nivel.modulos.indexOf(modulo));
	let seguinte = $derived(nivel.modulos[idx + 1]);
	let seguintePronta = $derived(seguinte ? temAula(nivel, seguinte) : false);
	let pronta = $derived(temAula(nivel, modulo));
	let registro = $derived(progresso.carregado ? progresso.de(nivel, modulo) : undefined);
	let feita = $derived(registro?.feita ?? false);

	let fase = $state<'carregando' | 'pronta' | 'erro'>('carregando');
	let tentativa = $state(0);
	let frame = $state<HTMLIFrameElement>();

	$effect(() => {
		// Reinicia ao trocar de aula ou ao tentar de novo.
		void modulo.slug;
		void tentativa;
		fase = 'carregando';
	});

	function conectar() {
		const win = frame?.contentWindow as (Window & { lesson?: Licao }) | null | undefined;
		let intervalo: ReturnType<typeof setInterval> | undefined;
		const limite = setTimeout(() => { if (fase === 'carregando') fase = 'erro'; }, 20000);
		const esperar = setInterval(() => {
			const lesson = win?.lesson;
			if (!lesson) return;
			clearInterval(esperar);
			lesson.readyPromise
				.then(() => {
					clearTimeout(limite);
					fase = 'pronta';
					// Setas do teclado só funcionam com o foco dentro da aula.
					setTimeout(() => frame?.contentWindow?.focus(), 0);
					const total = lesson.getManifest().slides.length;
					const antes = progresso.de(nivel, modulo);
					if (antes && !antes.feita && antes.tela > 0 && antes.tela < total) {
						// Retoma no começo da tela onde parou e toca o primeiro passo, como o player faz ao entrar numa tela.
						lesson.seek({ slide: antes.tela, step: 0, time: 0 });
						lesson.replay();
					}
					const marcar = () => progresso.registrar(nivel, modulo, lesson.getState().slide, total);
					marcar();
					intervalo = setInterval(marcar, 800);
				})
				.catch(() => { clearTimeout(limite); fase = 'erro'; });
		}, 100);
		return () => { clearInterval(esperar); clearInterval(intervalo); clearTimeout(limite); };
	}

	let desligar: (() => void) | undefined;
	function aoCarregar() {
		desligar?.();
		desligar = conectar();
	}
	$effect(() => () => desligar?.());
</script>

<svelte:head><title>{modulo.titulo} · L{nivel.n} · Trilha AI Engineer</title></svelte:head>

<div class="tela">
	<header class="barra">
		<a class="voltar" href="/nivel/{nivel.slug}" aria-label="Voltar para L{nivel.n} · {nivel.titulo}">
			<span aria-hidden="true">←</span><span class="larga">L{nivel.n} · {nivel.titulo}</span>
		</a>
		<div class="titulo">
			<span class="mono">Aula {numero(nivel, modulo)} de {nivel.modulos.length}</span>
			<span class="nome">{modulo.titulo}</span>
			{#if feita}<span class="pill ok">✓ Feita</span>{/if}
		</div>
		<div class="direita">
			{#if !seguinte}
				<a class="btn btn-sm {feita ? 'btn-primary' : 'btn-secondary'}" href="/">Voltar ao mapa</a>
			{:else if seguintePronta}
				<a class="btn btn-sm {feita ? 'btn-primary' : 'btn-secondary'}" href="/aula/{nivel.slug}/{seguinte.slug}">
					<span class="larga">Próxima aula</span> →
				</a>
			{:else}
				<span class="btn btn-sm" aria-disabled="true"><span class="larga">Próxima: em breve</span><span class="curta">Em breve</span></span>
			{/if}
		</div>
	</header>

	{#if !pronta}
		<section class="estado">
			<span class="pill">Em breve</span>
			<h2>Esta aula ainda está em produção.</h2>
			<p class="muted">{modulo.topicos.join(' · ')}</p>
			<a class="btn btn-secondary" href="/nivel/{nivel.slug}">Voltar ao nível</a>
		</section>
	{:else}
		<div class="palco">
			{#key tentativa}
				<iframe
					bind:this={frame}
					src={arquivoDaAula(nivel, modulo)}
					title="Aula: {modulo.titulo}"
					onload={aoCarregar}
					class:oculto={fase !== 'pronta'}
				></iframe>
			{/key}
			{#if fase === 'carregando'}
				<div class="esqueleto" aria-live="polite"><span class="sr-only">Carregando a aula…</span><i></i><i></i><i></i></div>
			{:else if fase === 'erro'}
				<section class="estado" role="alert">
					<h2>Não foi possível abrir esta aula.</h2>
					<p class="muted">Verifique sua conexão e tente de novo.</p>
					<div class="acoes">
						<button class="btn btn-primary" onclick={() => tentativa++}>Tentar de novo</button>
						<a class="btn btn-secondary" href="/nivel/{nivel.slug}">Voltar ao nível</a>
					</div>
				</section>
			{/if}
		</div>
	{/if}
</div>

<style>
	.tela { height: 100dvh; display: grid; grid-template-rows: 56px minmax(0, 1fr); }
	.barra { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: var(--space-4); padding: 0 var(--space-4); border-bottom: 1px solid var(--color-divider); background: var(--color-page); }
	.voltar { display: inline-flex; align-items: center; gap: var(--space-2); min-height: 36px; padding: 0 var(--space-3); border-radius: var(--radius-md); font-size: var(--text-small); color: var(--color-text-muted); justify-self: start; min-width: 0; }
	.voltar:hover { background: var(--color-tint-hover); color: var(--color-text); }
	.voltar .larga { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.titulo { display: flex; align-items: center; gap: var(--space-3); min-width: 0; }
	.nome { font-size: var(--text-small); font-weight: var(--weight-medium); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 44ch; }
	.direita { justify-self: end; }
	.curta { display: none; }
	.palco { position: relative; min-height: 0; background: var(--color-page); }
	iframe { width: 100%; height: 100%; border: 0; display: block; background: #f7f7f5; }
	iframe.oculto { visibility: hidden; }
	.esqueleto { position: absolute; inset: 0; display: grid; grid-template-rows: 40px 1fr 72px; gap: var(--space-4); padding: var(--space-6) clamp(16px, 3vw, 44px); max-width: 1360px; margin: 0 auto; }
	.esqueleto i { background: var(--color-fill-1); border-radius: var(--radius-lg); }
	.esqueleto i:first-child { width: 40%; }
	.estado { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: var(--space-3); text-align: center; padding: var(--space-6); }
	.tela > .estado { position: static; }
	.estado p { max-width: 52ch; }
	.acoes { display: flex; gap: var(--space-3); flex-wrap: wrap; justify-content: center; margin-top: var(--space-2); }
	@media (max-width: 700px) {
		.barra { padding: 0 var(--space-2); gap: var(--space-2); }
		.voltar .larga, .nome, .titulo .pill { display: none; }
		.larga { display: none; }
		.curta { display: inline; }
	}
</style>
