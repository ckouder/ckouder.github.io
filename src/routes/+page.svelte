<script lang="ts">
	import { site, works } from '$lib/content';
</script>

<svelte:head>
	<title>{site.title} — Works</title>
	<meta name="description" content={site.description} />
</svelte:head>

<h2>Works</h2>
<ul class="gallery">
	{#each works as work (work.slug)}
		<li>
			<a href="/works/{work.slug}">
				{#if work.images.length > 0}
					<img src={work.images[0].src} alt={work.images[0].alt} loading="lazy" />
				{/if}
				<span class="label">
					<span class="title">{work.title}</span>
					<span class="meta">{work.medium}, {work.year}</span>
				</span>
			</a>
		</li>
	{/each}
</ul>
