<script lang="ts">
	import { site, works } from '$lib/content';
</script>

<svelte:head>
	<title>{site.title} — Works</title>
	<meta name="description" content={site.description} />
</svelte:head>

<h2>Works</h2>
<ul class="plain">
	{#each works as work (work.slug)}
		<li>
			<a href="/works/{work.slug}">{work.title}</a>
			<span class="meta">({work.year})</span>
			<div class="meta">{work.medium}</div>
		</li>
	{/each}
</ul>
