<script lang="ts">
	export let title: string;

	let fold = false;
	let showFoldBtn = false;
</script>

<div class="foldable-container">
	<slot name="controller">
		<h5 on:mouseenter={() => (showFoldBtn = true)} on:mouseleave={() => (showFoldBtn = false)}>
			{title}
			{#if showFoldBtn}
				<button
					on:click={() => {
						fold = !fold;
					}}
				>
					<img src="assets/chevron.down@2x.png" class:folded={fold} alt="show more" />
				</button>
			{/if}
		</h5>
	</slot>
	<div hidden={fold}>
		<slot name="itemsToFold" />
	</div>
</div>

<style lang="scss">
	.foldable-container {
		padding-bottom: 20px;
	}

	.folded {
		transform: rotate(-90deg);
	}

	h5 {
		font-size: 11.5px;
		padding-bottom: 2px;
		padding-left: 5px;
		opacity: 0.6;
	}

	button {
		margin-right: 10px;
		background: none;
		border: none;
		float: right;
	}

	img {
		height: 6px;
		width: auto;
	}
</style>
