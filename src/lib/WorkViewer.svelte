<script lang="ts">
	import { goto } from '$app/navigation';

	export interface ViewerLink {
		readonly href: string;
		readonly label: string;
	}

	export interface ViewerSlide {
		readonly image?: { readonly src: string; readonly alt: string; readonly href?: string };
		readonly title: string;
		readonly meta: string;
		readonly description: readonly string[];
		readonly links?: readonly ViewerLink[];
		readonly acknowledgements?: readonly ViewerLink[];
	}

	let { slides }: { slides: readonly ViewerSlide[] } = $props();

	let index = $state(0);
	const count = $derived(slides.length);
	const current = $derived(slides[index]);

	function prev() {
		if (index > 0) index -= 1;
	}

	function next() {
		if (index < count - 1) index += 1;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') goto('/');
		else if (event.key === 'ArrowLeft') prev();
		else if (event.key === 'ArrowRight') next();
	}

	// Lock background scroll while the full-screen viewer is open.
	$effect(() => {
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previous;
		};
	});
</script>

<svelte:window onkeydown={onKeydown} />

<div class="viewer">
	<a class="viewer-btn viewer-close" href="/" aria-label="Close and return home">×</a>

	{#if count > 1}
		<button
			class="viewer-btn viewer-prev"
			onclick={prev}
			disabled={index === 0}
			aria-label="Previous work">←</button
		>
		<button
			class="viewer-btn viewer-next"
			onclick={next}
			disabled={index === count - 1}
			aria-label="Next work">→</button
		>
	{/if}

	<div class="viewer-stage">
		{#if current.image}
			{#if current.image.href}
				<a href={current.image.href} rel="noreferrer">
					<img src={current.image.src} alt={current.image.alt} />
				</a>
			{:else}
				<img src={current.image.src} alt={current.image.alt} />
			{/if}
		{/if}
	</div>

	<div class="viewer-info">
		<p class="viewer-title">{current.title}</p>
		{#if current.meta}<p class="viewer-meta">{current.meta}</p>{/if}
		{#each current.description as paragraph (paragraph)}
			<p class="viewer-desc">{paragraph}</p>
		{/each}
		{#if current.links && current.links.length > 0}
			<p class="viewer-links">
				{#each current.links as link (link.href)}
					<a href={link.href} rel="noreferrer">{link.label}</a>{' '}
				{/each}
			</p>
		{/if}
		{#if current.acknowledgements && current.acknowledgements.length > 0}
			<p class="viewer-ack">
				Acknowledgement:
				{#each current.acknowledgements as person (person.href)}
					<a href={person.href} rel="noreferrer">{person.label}</a>{' '}
				{/each}
			</p>
		{/if}
		{#if count > 1}<p class="viewer-count">{index + 1} / {count}</p>{/if}
	</div>
</div>
