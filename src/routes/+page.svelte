<script lang="ts">
	import { coverImage, site, works } from '$lib/content';
</script>

<svelte:head>
	<title>{site.title} — Works</title>
	<meta name="description" content={site.description} />
</svelte:head>

<h2>Works</h2>
<ul class="gallery">
	{#each works as work (work.slug)}
		{@const cover = coverImage(work)}
		<li>
			<a href="/works/{work.slug}">
				{#if cover}
					<img src={cover.src} alt={cover.alt} loading="lazy" />
				{/if}
				<span class="label">
					<span class="title">{work.title}</span>
					<span class="meta">{work.medium}, {work.year}</span>
				</span>
			</a>
		</li>
	{/each}
</ul>
