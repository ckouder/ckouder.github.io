<script lang="ts">
	import DeckItem from './DeckItem.svelte';

	const apps = [
		{ iconSrc: 'assets/finder.png', href: '/finder' },
		{ iconSrc: 'assets/launchpad.png', href: '/' },
		{ iconSrc: 'assets/safari.png', href: '/' },
		{ iconSrc: 'assets/system-preferences.png', href: '/' }
	];
</script>

<div class="deck">
	{#each apps as app}
		<DeckItem {...app} />
	{/each}
</div>

<style lang="scss">
	.deck {
		box-sizing: border-box;
		display: inline-flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 0px 4px;
		height: 68px;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 18px;
		backdrop-filter: blur(25px);
		-webkit-backdrop-filter: blur(25px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
</style>
