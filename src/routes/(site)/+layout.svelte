<script lang="ts">
	import { progresso } from '#lib/progresso.svelte.ts';
	import { totalPublicadas } from '#lib/aulas.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	let confirmando = $state(false);
	const publicadas = totalPublicadas();
</script>

<header class="top">
	<div class="wrap">
		<a class="brand" href="/"><b aria-hidden="true">AI</b>Trilha AI Engineer</a>
		<nav aria-label="Principal">
			<a href="/">Mapa</a>
			{#if progresso.carregado}
				<span class="mono">{progresso.totalFeitas()} / {publicadas} aulas feitas</span>
			{/if}
		</nav>
	</div>
</header>

{#if progresso.salvaFalhou}
	<p class="aviso small">Seu progresso não será salvo neste navegador (armazenamento bloqueado).</p>
{/if}

<main>{@render children()}</main>

<footer>
	<div class="wrap">
		<span>Estrutura baseada no <a class="link" href="https://ai-engineer-roadmap-2026.vercel.app/" rel="noopener">AI Engineering Roadmap 2026</a>. Aulas próprias, em português.</span>
		{#if confirmando}
			<span class="confirma">
				Apagar todo o progresso deste navegador?
				<button class="btn btn-sm btn-secondary" onclick={() => (confirmando = false)}>Cancelar</button>
				<button class="btn btn-sm btn-primary" onclick={() => { progresso.zerar(); confirmando = false; }}>Zerar</button>
			</span>
		{:else}
			<button class="btn btn-sm btn-ghost" onclick={() => (confirmando = true)}>Zerar progresso</button>
		{/if}
	</div>
</footer>

<style>
	.top { border-bottom: 1px solid var(--color-divider); }
	.top .wrap { display: flex; align-items: center; justify-content: space-between; height: 64px; gap: var(--space-4); }
	.brand { display: flex; align-items: center; gap: var(--space-2); font-weight: var(--weight-bold); white-space: nowrap; }
	.brand b { width: 22px; height: 22px; border-radius: var(--radius-sm); background: var(--color-primary); display: inline-grid; place-items: center; color: var(--color-on-primary); font: var(--weight-medium) 11px/1 var(--font-mono); }
	nav { display: flex; align-items: center; gap: var(--space-6); font-size: var(--text-small); color: var(--color-text-muted); }
	nav a:hover { color: var(--color-text); }
	.aviso { text-align: center; padding: var(--space-2) var(--gutter); background: var(--color-fill-1); color: var(--color-text-muted); }
	footer { border-top: 1px solid var(--color-divider); margin-top: var(--space-16); }
	footer .wrap { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-4); padding-top: var(--space-6); padding-bottom: var(--space-8); font-size: var(--text-small); color: var(--color-text-muted); }
	.link { text-decoration: underline; text-underline-offset: 3px; text-decoration-color: var(--color-border-hover); }
	.confirma { display: inline-flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; color: var(--color-text); }
	@media (max-width: 600px) { nav .mono { display: none; } }
</style>
