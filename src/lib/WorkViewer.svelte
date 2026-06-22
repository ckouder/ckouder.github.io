<script lang="ts">
	import { untrack } from 'svelte';
	import { goto, replaceState } from '$app/navigation';
	import { site, type ViewerSlide } from '$lib/content';

	// `slides` is the static global sequence and `startIndex` only seeds the
	// initial position, so both are read once (untracked) on mount.
	let { slides, startIndex = 0 }: { slides: readonly ViewerSlide[]; startIndex?: number } =
		$props();

	let index = $state(untrack(() => startIndex));
	let collapsed = $state(false);

	const count = untrack(() => slides.length);
	const current = $derived(slides[index]);
	const hasPrev = $derived(index > 0);
	const hasNext = $derived(index < count - 1);

	// Label a neighbouring slide: its work title when it belongs to a different
	// work (a cross-work jump), otherwise its own piece title.
	function labelFor(i: number): string {
		const target = slides[i];
		if (!target) return '';
		return target.workSlug === current.workSlug ? target.title : target.workTitle;
	}
	const prevLabel = $derived(hasPrev ? labelFor(index - 1) : '');
	const nextLabel = $derived(hasNext ? labelFor(index + 1) : '');

	function prev() {
		if (hasPrev) index -= 1;
	}

	function next() {
		if (hasNext) index += 1;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') goto('/');
		else if (event.key === 'ArrowLeft') prev();
		else if (event.key === 'ArrowRight') next();
	}

	// Keep the address bar and document title in sync as navigation crosses works.
	let syncedSlug = untrack(() => slides[startIndex]?.workSlug);
	$effect(() => {
		const slug = current.workSlug;
		if (slug !== syncedSlug) {
			syncedSlug = slug;
			replaceState(`/works/${slug}`, {});
			document.title = `${current.workTitle} — ${site.title}`;
		}
	});

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

	{#if hasPrev}
		<div class="viewer-nav viewer-nav-prev">
			<button class="viewer-btn" onclick={prev} aria-label="Previous: {prevLabel}">←</button>
			<span class="viewer-nav-label">{prevLabel}</span>
		</div>
	{/if}

	{#if hasNext}
		<div class="viewer-nav viewer-nav-next">
			<button class="viewer-btn" onclick={next} aria-label="Next: {nextLabel}">→</button>
			<span class="viewer-nav-label">{nextLabel}</span>
		</div>
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

	<div class="viewer-info" class:collapsed>
		<button
			class="viewer-toggle"
			onclick={() => (collapsed = !collapsed)}
			aria-expanded={!collapsed}
			aria-label={collapsed ? 'Show details' : 'Hide details'}>{collapsed ? '▴' : '▾'}</button
		>

		{#if !collapsed}
			<div class="viewer-info-body">
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
			</div>
		{/if}
	</div>
</div>
