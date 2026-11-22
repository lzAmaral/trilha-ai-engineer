<script lang="ts">
	import { fase, niveis } from '#lib/roadmap.ts';
	import { aulasDoNivel, numero, temAula } from '#lib/aulas.ts';
	import { progresso } from '#lib/progresso.svelte.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let nivel = $derived(data.nivel);
	let f = $derived(fase(nivel.fase));
	let pub = $derived(aulasDoNivel(nivel).length);
	let feitas = $derived(progresso.carregado ? progresso.feitasNoNivel(nivel) : 0);
	let proxima = $derived(progresso.carregado ? progresso.proxima() : undefined);
	let anterior = $derived(niveis.find((n) => n.n === nivel.n - 1));
	let seguinte = $derived(niveis.find((n) => n.n === nivel.n + 1));
</script>

<svelte:head><title>L{nivel.n} · {nivel.titulo} · Trilha AI Engineer</title></svelte:head>

<div class="wrap">
	<a class="voltar small muted" href="/">← Mapa</a>

	<header class="head">
		<div>
			<div class="kicker">
				<span class="dot" style="background:var(--phase-{f.n})"></span>
				<span class="mono">Fase {f.n} · {f.titulo} · Nível {nivel.n}</span>
			</div>
			<h1>{nivel.titulo}</h1>
			<p class="lead">{nivel.resumo}</p>
			<div class="meta">
				<span class="mono">{nivel.modulos.length} módulos</span>
				<span class="mono">{nivel.sessoes} sessões</span>
				<span class="mono">Entrevista {nivel.entrevista}/10</span>
				<span class="mono">Dia a dia {nivel.trabalho}/10</span>
			</div>
			{#if nivel.pressupoe.length}
				<p class="small muted pre">
					Pressupõe:
					{#each nivel.pressupoe as p, i (p)}
						{@const req = niveis[p]}
						<a href="/nivel/{req.slug}">L{req.n} · {req.titulo}</a>{i < nivel.pressupoe.length - 1 ? ', ' : ''}
					{/each}
				</p>
			{/if}
		</div>
		<div class="stat">
			{#if pub === 0}
				<span class="pill">Em breve</span>
				<p class="small muted">As aulas deste nível ainda estão em produção. Os módulos abaixo mostram o que vai ser coberto.</p>
			{:else}
				<span class="big">{feitas}<span class="muted">/{nivel.modulos.length}</span></span>
				<div class="bar {feitas === nivel.modulos.length ? 'ok' : ''}"><i style="width:{(feitas / nivel.modulos.length) * 100}%"></i></div>
				<span class="mono">aulas feitas · {pub} de {nivel.modulos.length} prontas</span>
			{/if}
		</div>
	</header>

	<ol class="aulas">
		{#each nivel.modulos as mod (mod.slug)}
			{@const pronta = temAula(nivel, mod)}
			{@const reg = progresso.carregado ? progresso.de(nivel, mod) : undefined}
			{@const ehProxima = proxima?.nivel.slug === nivel.slug && proxima?.modulo.slug === mod.slug}
			{@const st = !pronta ? 'soon' : reg?.feita ? 'done' : ehProxima ? 'next' : 'open'}
			<li>
				<svelte:element
					this={pronta ? 'a' : 'div'}
					class="card aula {st}"
					href={pronta ? `/aula/${nivel.slug}/${mod.slug}` : undefined}
				>
					<span class="num mono {st === 'done' ? 'ok' : ''}">{st === 'done' ? '✓' : numero(nivel, mod)}</span>
					<div class="body">
						<div class="t">
							{#if mod.projeto}<span class="pill proj">Projeto</span>{/if}
							<h3>{mod.titulo}</h3>
						</div>
						<p class="small muted">{mod.topicos.join(' · ')}</p>
						{#if st === 'next' && reg && !reg.feita}
							<div class="andamento"><div class="bar"><i style="width:{((reg.tela + 1) / reg.total) * 100}%"></i></div><span class="mono">tela {reg.tela + 1} de {reg.total}</span></div>
						{/if}
					</div>
					<div class="acao">
						{#if st === 'soon'}
							<span class="pill">Em breve</span>
						{:else if st === 'done'}
							<span class="pill ok">Feita</span>
						{:else if st === 'next'}
							<span class="btn btn-primary btn-sm">{reg ? 'Continuar' : 'Começar'}</span>
						{:else}
							<span class="btn btn-secondary btn-sm">{reg ? 'Continuar' : 'Abrir aula'}</span>
						{/if}
					</div>
				</svelte:element>
			</li>
		{/each}
	</ol>

	<nav class="pager" aria-label="Níveis">
		{#if anterior}<a class="card" href="/nivel/{anterior.slug}"><span class="mono">← L{anterior.n}</span><span>{anterior.titulo}</span></a>{:else}<span></span>{/if}
		{#if seguinte}<a class="card prox" href="/nivel/{seguinte.slug}"><span class="mono">L{seguinte.n} →</span><span>{seguinte.titulo}</span></a>{/if}
	</nav>
</div>

<style>
	.voltar { display: inline-block; margin-top: var(--space-8); }
	.voltar:hover { color: var(--color-text); }
	.head { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: var(--space-12); align-items: end; padding: var(--space-6) 0 var(--space-8); }
	.kicker { display: flex; align-items: center; gap: var(--space-2); }
	.head h1 { margin: var(--space-2) 0 var(--space-3); }
	.head .lead { max-width: 62ch; }
	.head .meta { margin-top: var(--space-4); }
	.pre { margin-top: var(--space-3); }
	.pre a { color: var(--color-text); text-decoration: underline; text-underline-offset: 3px; text-decoration-color: var(--color-border-hover); }
	.stat { display: grid; gap: var(--space-3); align-content: end; }
	.stat .big { font: var(--weight-bold) var(--text-display)/1 var(--font-mono); letter-spacing: -.04em; }
	.stat .pill { justify-self: start; }
	.aulas { list-style: none; display: grid; gap: var(--space-3); }
	.aula { display: grid; grid-template-columns: 48px minmax(0, 1fr) auto; gap: var(--space-4); align-items: center; padding: var(--space-4) var(--space-6) var(--space-4) var(--space-4); }
	.aula.next { padding: calc(var(--space-4) - 1px) calc(var(--space-6) - 1px) calc(var(--space-4) - 1px) calc(var(--space-4) - 1px); }
	.num { width: 40px; height: 40px; border-radius: var(--radius-md); display: grid; place-items: center; background: var(--color-fill-1); color: var(--color-text-muted); font-size: var(--text-small); }
	.num.ok { background: var(--color-success-bg); color: var(--color-success-text); }
	.aula.next .num { background: var(--color-primary-bg); color: var(--color-primary-text); }
	.aula.soon .num { background: transparent; border: 1px dashed var(--color-border); }
	.aula.soon h3 { color: var(--color-text-muted); }
	.t { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; }
	.body { display: grid; gap: var(--space-1); }
	.andamento { display: grid; grid-template-columns: minmax(0, 240px) auto; align-items: center; gap: var(--space-3); margin-top: var(--space-2); }
	.pager { display: flex; justify-content: space-between; gap: var(--space-4); margin-top: var(--space-12); }
	.pager .card { display: grid; gap: var(--space-1); padding: var(--space-4) var(--space-6); min-width: 0; max-width: 48%; }
	.pager .prox { text-align: right; margin-left: auto; }

	@media (max-width: 900px) {
		.head { grid-template-columns: 1fr; gap: var(--space-6); }
	}
	@media (max-width: 600px) {
		.aula { grid-template-columns: 40px minmax(0, 1fr); padding: var(--space-4); }
		.aula.next { padding: calc(var(--space-4) - 1px); }
		.acao { grid-column: 2; }
		.pager .card { max-width: none; flex: 1; }
	}
</style>
