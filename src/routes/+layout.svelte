<script lang="ts">
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { progresso } from '#lib/progresso.svelte.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	onMount(() => progresso.carregar());
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;650&family=Geist+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
	<meta name="description" content="Trilha para virar AI Engineer, com aulas interativas em português." />
</svelte:head>

{@render children()}
