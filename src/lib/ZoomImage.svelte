<script lang="ts">
	let { src, alt }: { src: string; alt: string } = $props();

	let open = $state(false);
	let dialog = $state<HTMLDivElement | null>(null);
	let trigger = $state<HTMLButtonElement | null>(null);

	function show() {
		open = true;
	}

	function hide() {
		open = false;
		trigger?.focus();
	}

	function onKeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') hide();
	}

	$effect(() => {
		if (open) dialog?.focus();
	});
</script>

<svelte:window onkeydown={onKeydown} />

<button
	type="button"
	class="zoom-trigger"
	onclick={show}
	bind:this={trigger}
	aria-label="View larger: {alt}"
>
	<img {src} {alt} loading="lazy" />
</button>

{#if open}
	<div
		class="lightbox"
		role="dialog"
		aria-modal="true"
		aria-label={alt}
		tabindex="-1"
		bind:this={dialog}
		onclick={hide}
		onkeydown={onKeydown}
	>
		<img {src} {alt} />
		<button type="button" class="lightbox-close" onclick={hide} aria-label="Close">×</button>
	</div>
{/if}
