<script lang="ts">
	import { site } from '$lib/content';
	import WorkViewer, { type ViewerSlide } from '$lib/WorkViewer.svelte';

	let { data } = $props();
	const work = $derived(data.work);

	const slides = $derived<ViewerSlide[]>(
		work.pieces
			? work.pieces.map((piece) => ({
					image: piece.images[0],
					title: piece.title,
					meta: `${piece.medium}, ${piece.year}`,
					description: piece.description ?? []
				}))
			: (work.images.length > 0 ? work.images : [undefined]).map((image) => ({
					image,
					title: work.title,
					meta: `${work.medium}, ${work.year}`,
					description: work.description,
					links: work.links,
					acknowledgements: work.acknowledgements
				}))
	);
</script>

<svelte:head>
	<title>{work.title} — {site.title}</title>
	<meta
		name="description"
		content={work.description[0] ?? `${work.title} — ${work.medium}, ${work.year}`}
	/>
</svelte:head>

<WorkViewer {slides} />
