<script lang="ts">
	import { site } from '$lib/content';

	let { data } = $props();
	const work = $derived(data.work);
</script>

<svelte:head>
	<title>{work.title} — {site.title}</title>
	<meta
		name="description"
		content={work.description[0] ?? `${work.title} — ${work.medium}, ${work.year}`}
	/>
</svelte:head>

<h2>{work.title} ({work.year})</h2>
<p class="meta">
	{work.medium}{#if work.dimensions}
		· {work.dimensions}{/if}
</p>

{#each work.images as image (image.src)}
	<figure>
		{#if image.href}
			<a href={image.href} rel="noreferrer">
				<img src={image.src} alt={image.alt} loading="lazy" />
			</a>
		{:else}
			<img src={image.src} alt={image.alt} loading="lazy" />
		{/if}
		<figcaption>{image.alt}</figcaption>
	</figure>
{/each}

{#each work.description as paragraph (paragraph)}
	<p>{paragraph}</p>
{/each}

{#if work.links.length > 0}
	<p>
		{#each work.links as link (link.href)}
			<a href={link.href} rel="noreferrer">{link.label}</a>{' '}
		{/each}
	</p>
{/if}

{#if work.acknowledgements && work.acknowledgements.length > 0}
	<h2>Acknowledgement</h2>
	<ul class="plain">
		{#each work.acknowledgements as person (person.href)}
			<li><a href={person.href} rel="noreferrer">{person.label}</a></li>
		{/each}
	</ul>
{/if}

<p><a href="/">← All works</a></p>
