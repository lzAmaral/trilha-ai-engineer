<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head><title>Não encontrado · Trilha AI Engineer</title></svelte:head>

<main class="erro">
	<span class="mono">{page.status}</span>
	<h1>{page.status === 404 ? 'Esta página não existe.' : 'Algo deu errado.'}</h1>
	<p class="lead">{page.error?.message}</p>
	<a class="btn btn-primary" href="/">Voltar ao mapa</a>
</main>

<style>
	.erro { min-height: 100dvh; display: grid; place-content: center; justify-items: center; gap: var(--space-4); text-align: center; padding: var(--gutter); }
</style>
