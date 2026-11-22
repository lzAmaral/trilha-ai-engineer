<script lang="ts">
	import { fases, niveis, totalModulos, type Nivel } from '#lib/roadmap.ts';
	import { aulasDoNivel, numero, totalPublicadas } from '#lib/aulas.ts';
	import { progresso } from '#lib/progresso.svelte.ts';

	const publicadas = totalPublicadas();
	let proxima = $derived(progresso.carregado ? progresso.proxima() : undefined);
	let comecou = $derived(progresso.carregado && Object.keys(progresso.estado.aulas).length > 0);
	let registro = $derived(proxima ? progresso.de(proxima.nivel, proxima.modulo) : undefined);

	function situacao(n: Nivel): 'soon' | 'done' | 'now' | 'open' {
		const pub = aulasDoNivel(n).length;
		if (pub === 0) return 'soon';
		if (!progresso.carregado) return 'open';
		if (progresso.feitasNoNivel(n) === n.modulos.length) return 'done';
		if (proxima?.nivel.slug === n.slug && n.modulos.some((m) => progresso.de(n, m))) return 'now';
		return 'open';
	}
</script>

<svelte:head><title>Trilha AI Engineer</title></svelte:head>

<div class="wrap">
	<section class="hero">
		<div>
			<span class="mono">16 níveis · 7 fases · {totalModulos} módulos</span>
			<h1>Da base ao primeiro sistema de IA em produção.</h1>
			<p class="lead">Uma aula interativa por módulo, em português. Faça um nível por vez e termine cada um construindo algo.</p>
		</div>

		{#if !progresso.carregado}
			<div class="card resume skeleton" aria-hidden="true"></div>
		{:else if publicadas === 0}
			<div class="card resume">
				<span class="pill">Em produção</span>
				<h2>A primeira aula está sendo preparada.</h2>
				<p class="small muted">Enquanto isso, explore os níveis abaixo para ver o que vem pela frente.</p>
			</div>
		{:else if proxima}
			<a class="card next resume" href="/aula/{proxima.nivel.slug}/{proxima.modulo.slug}">
				<div class="row">
					<span class="pill now">{comecou ? 'Continuar' : 'Comece por aqui'} · L{proxima.nivel.n} · Aula {numero(proxima.nivel, proxima.modulo)}</span>
					{#if registro}<span class="mono">tela {registro.tela + 1} de {registro.total}</span>{/if}
				</div>
				<h2>{proxima.modulo.titulo}</h2>
				{#if registro}
					<div class="bar"><i style="width:{((registro.tela + 1) / registro.total) * 100}%"></i></div>
				{:else if !comecou}
					<p class="small muted">Já programa? Pode pular o L0 e começar pelo LLM 101.</p>
				{/if}
				<div class="row">
					<span class="small muted">{proxima.modulo.topicos.join(' · ')}</span>
					<span class="btn btn-primary">{registro ? 'Continuar aula' : 'Começar aula'}</span>
				</div>
			</a>
		{:else}
			<div class="card resume">
				<span class="pill ok">Tudo em dia</span>
				<h2>Você concluiu todas as aulas disponíveis.</h2>
				<p class="small muted">As próximas aulas ainda estão em produção.</p>
			</div>
		{/if}
	</section>

	{#each fases as f (f.n)}
		<section class="fase" aria-labelledby="fase-{f.n}">
			<div class="phase-h">
				<span class="dot" style="background:var(--phase-{f.n})"></span>
				<span class="mono">Fase {f.n}</span>
				<h3 id="fase-{f.n}">{f.titulo}</h3>
				<span class="small muted tema">{f.tema}</span>
			</div>
			<ol class="trail">
				{#each niveis.filter((n) => n.fase === f.n) as n (n.slug)}
					{@const st = situacao(n)}
					{@const feitas = progresso.carregado ? progresso.feitasNoNivel(n) : 0}
					{@const pub = aulasDoNivel(n).length}
					<li class="lvl">
						<span class="node {st}" aria-hidden="true">{st === 'done' ? '✓' : `L${n.n}`}</span>
						<a class="card lc {st}" style="--lc:var(--phase-{n.fase})" href="/nivel/{n.slug}">
							<div>
								<span class="mono">Nível {n.n}</span>
								<h2>{n.titulo}</h2>
								<p class="muted">{n.resumo}</p>
								<div class="meta">
									<span class="mono">{n.modulos.length} módulos</span>
									<span class="mono">{n.sessoes} sessões</span>
									<span class="mono">Entrevista {n.entrevista}/10</span>
								</div>
							</div>
							<div class="side">
								{#if st === 'soon'}
									<span class="pill">Em breve</span>
								{:else if st === 'done'}
									<span class="pill ok">Concluído</span>
									<div class="prog"><span class="mono">{feitas} de {n.modulos.length} aulas</span><div class="bar ok"><i style="width:100%"></i></div></div>
								{:else}
									<span class="pill {st === 'now' ? 'now' : ''}">{st === 'now' ? 'Em andamento' : `${pub} de ${n.modulos.length} aulas prontas`}</span>
									<div class="prog">
										<span class="mono">{feitas} de {n.modulos.length} feitas</span>
										<div class="bar"><i style="width:{(feitas / n.modulos.length) * 100}%"></i></div>
									</div>
								{/if}
							</div>
						</a>
					</li>
				{/each}
			</ol>
		</section>
	{/each}
</div>

<style>
	.hero { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: var(--space-12); align-items: end; padding: var(--space-16) 0 var(--space-8); }
	.hero h1 { margin: var(--space-3) 0 var(--space-4); }
	.resume { padding: var(--space-6); display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-4); align-content: start; }
	.resume.skeleton { min-height: 214px; background: var(--color-fill-1); border-color: transparent; }
	.resume .row { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); }
	.resume .row .small { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
	.resume .row .btn { flex: none; }
	.resume .pill { justify-self: start; }
	.phase-h { display: flex; align-items: baseline; flex-wrap: wrap; gap: var(--space-1) var(--space-3); padding: var(--space-12) 0 var(--space-4) 56px; }
	.trail { list-style: none; position: relative; display: grid; gap: var(--space-4); }
	.trail::before { content: ''; position: absolute; left: 19px; top: 0; bottom: 0; width: 2px; background: var(--color-divider); }
	.lvl { position: relative; display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: var(--space-4); align-items: start; }
	.node { position: relative; z-index: 1; width: 40px; height: 40px; margin-top: var(--space-6); border-radius: var(--radius-full); display: grid; place-items: center; background: var(--color-page); border: 2px solid var(--color-border); font: var(--weight-medium) var(--text-caption)/1 var(--font-mono); color: var(--color-text-muted); }
	.node.now { border-color: var(--color-primary); color: var(--color-primary-text); background: var(--color-surface); }
	.node.done { border-color: var(--color-success); background: var(--color-success); color: var(--color-on-dark); font-size: var(--text-small); }
	.node.soon { border-style: dashed; }
	.lc { display: grid; grid-template-columns: minmax(0, 1fr) 220px; gap: var(--space-8); padding: var(--space-6); border-left: 4px solid var(--lc); }
	.lc.soon { border-left-color: var(--color-border); }
	.lc.now { border-color: var(--color-primary); }
	.lc h2 { margin-top: var(--space-1); }
	.lc p { margin-top: var(--space-2); max-width: 60ch; }
	.lc .meta { margin-top: var(--space-4); }
	.side { display: grid; align-content: space-between; justify-items: end; gap: var(--space-4); }
	.prog { width: 100%; display: grid; gap: var(--space-2); }
	.prog .mono { text-align: right; }

	@media (max-width: 900px) {
		.hero { grid-template-columns: 1fr; gap: var(--space-8); padding-top: var(--space-12); }
		.lc { grid-template-columns: 1fr; gap: var(--space-4); }
		.side { justify-items: start; }
		.prog .mono { text-align: left; }
	}
	@media (max-width: 600px) {
		.phase-h { padding-left: 0; }
		.phase-h .tema { width: 100%; }
		.trail::before { display: none; }
		.lvl { grid-template-columns: minmax(0, 1fr); }
		.node { display: none; }
		.lc { padding: var(--space-4); }
		.resume .row { flex-wrap: wrap; }
		.resume .row .small { white-space: normal; }
	}
</style>
