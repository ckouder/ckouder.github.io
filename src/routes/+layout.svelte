<script lang="ts">
	import Deck from '$lib/components/apps/Deck/Deck.svelte';
	import Toolbar from '$lib/components/apps/Menubar/Menubar.svelte';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
 
	inject({ mode: dev ? 'development' : 'production' });
</script>

<main>
	<div class="toolbar-container">
		<Toolbar />
	</div>
	<div class="deck-container">
		<Deck />
	</div>
	<div id="root" />
    <slot/>
</main>

<style lang="scss">
	main {
		width: calc(100vw);
		height: calc(100vh);
		background: url('/assets/bg.jpg');
		background-size: cover;
		overflow: hidden;
	}

	.toolbar-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
	}

	.deck-container {
		position: fixed;
		bottom: 5px;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}
</style>
