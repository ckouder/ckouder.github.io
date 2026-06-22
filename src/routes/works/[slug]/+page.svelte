<script lang="ts">
	import { firstSlideIndexForWork, site, viewerSlides } from '$lib/content';
	import WorkViewer from '$lib/WorkViewer.svelte';

	let { data } = $props();
	const work = $derived(data.work);
	const startIndex = $derived(Math.max(0, firstSlideIndexForWork(work.slug)));
</script>

<svelte:head>
	<title>{work.title} — {site.title}</title>
	<meta
		name="description"
		content={work.description[0] ?? `${work.title} — ${work.medium}, ${work.year}`}
	/>
</svelte:head>

<WorkViewer slides={viewerSlides} {startIndex} />
