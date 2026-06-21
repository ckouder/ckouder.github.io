<script lang="ts">
	import { coverImage, site, works } from '$lib/content';

	const seriesWorks = works.filter((work) => work.pieces);
	const singleWorks = works.filter((work) => !work.pieces);
</script>

<svelte:head>
	<title>{site.title} — Works</title>
	<meta name="description" content={site.description} />
</svelte:head>

<h2>Works</h2>

<nav class="works-menu" aria-label="Works index">
	{#if seriesWorks.length > 0}
		<span class="works-menu-label">Series</span>
		{#each seriesWorks as work (work.slug)}
			<a href="/works/{work.slug}">{work.title}</a>
		{/each}
	{/if}
	<span class="works-menu-label">Works</span>
	{#each singleWorks as work (work.slug)}
		<a href="/works/{work.slug}">{work.title}</a>
	{/each}
</nav>

<ul class="gallery">
	{#each works as work (work.slug)}
		{@const cover = coverImage(work)}
		<li class:is-series={work.pieces}>
			<a href="/works/{work.slug}">
				{#if cover}
					<img src={cover.src} alt={cover.alt} loading="lazy" />
				{/if}
				<span class="label">
					{#if work.pieces}
						<span class="tag">Series · {work.pieces.length} works</span>
						<span class="title">{work.title}</span>
					{:else}
						<span class="title">{work.title}</span>
						<span class="meta">{work.medium}, {work.year}</span>
					{/if}
				</span>
			</a>
		</li>
	{/each}
</ul>
