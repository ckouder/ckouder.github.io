<script lang="ts">
	import type { WorkPiece } from '$lib/content';
	import ZoomImage from './ZoomImage.svelte';

	let { pieces }: { pieces: readonly WorkPiece[] } = $props();

	let index = $state(0);
	const count = $derived(pieces.length);

	function prev() {
		if (index > 0) index -= 1;
	}

	function next() {
		if (index < count - 1) index += 1;
	}
</script>

<div class="series" class:single={count <= 1}>
	{#if count > 1}
		<button
			class="series-nav series-prev"
			onclick={prev}
			disabled={index === 0}
			aria-label="Previous work">←</button
		>
	{/if}

	<div class="series-window">
		<div class="series-track" style="transform: translateX(-{index * 100}%);">
			{#each pieces as piece, i (piece.title + (piece.images[0]?.src ?? i))}
				<section class="series-slide" inert={i !== index}>
					<div class="series-figure">
						{#each piece.images as image (image.src)}
							<ZoomImage src={image.src} alt={image.alt} />
						{/each}
					</div>
					<div class="series-info">
						<h3>{piece.title}</h3>
						<p class="meta">{piece.medium}, {piece.year}</p>
						{#each piece.description ?? [] as paragraph (paragraph)}
							<p>{paragraph}</p>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	</div>

	{#if count > 1}
		<button
			class="series-nav series-next"
			onclick={next}
			disabled={index === count - 1}
			aria-label="Next work">→</button
		>
	{/if}
</div>
