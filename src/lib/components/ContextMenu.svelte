<script lang="ts">
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { switchable } from '../actions';

	export let items: any[] = [];
	export let selectable: boolean = false;
	export let x: number = 0;
	export let y: number = 0;
	export let focusedItem: string = '';
	const dispatch = createEventDispatcher();
	let thisEl: HTMLElement;

	onMount(async () => {
		await tick();
		thisEl.style.left = `${x}px`;
		thisEl.style.top = `${y}px`;
	});

	function onMouseUp(e: MouseEvent) {
		dispatch('switchable-focus', e.target);
	}
</script>

{#if selectable}
	<ul bind:this={thisEl} use:switchable={'li'} on:switchable-focus>
		{#each items as item}
			<li
				class="selectable"
				class:focused={item.value === focusedItem}
				class:disabled={item.status === 'DISABLED'}
				data-value={item.value}
			>
				{item.label}
			</li>
		{/each}
	</ul>
{:else}
	<ul bind:this={thisEl}>
		{#each items as item}
			<li
				class:disabled={item.status === 'DISABLED'}
				data-value={item.value}
				on:mousedown={onMouseUp}
			>
				{item.label}
			</li>
		{/each}
	</ul>
{/if}

<style lang="scss">
	ul {
		position: absolute;
		list-style: none;
		text-align: left;
		min-width: 100px;
		padding: 5px;
		margin: 0;
		z-index: 9999;

		background-color: #f5f5f5a5;
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
		border: solid 1px #0000002f;
		border-radius: 5px;
		box-shadow: 5px 5px 20px 0px #00000022;

		li {
			padding: 2px 5px;
			font-size: 0.8rem;
			line-height: 150%;
			border-radius: 5px;

			&:hover {
				background-color: #0000001f;
			}

			&.disabled {
				opacity: 0.5;
			}

			&.selectable {
				padding-left: 1.6rem;
			}

			&.focused {
				background-image: url('/assets/checkmark.svg');
				background-repeat: no-repeat;
				background-size: 0.7rem 0.7rem;
				background-position: 0.5rem center;
			}
		}
	}
</style>
