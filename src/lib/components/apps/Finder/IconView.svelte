<script lang="ts">
	import { multiSelect } from '../../../actions/multiSelect';
	import type { Item as ItemType } from './type';

	export let items: ItemType[] = [];
	export let selection: string[] = [];
</script>

<div class="view-container" use:multiSelect={'.item'} on:multiSelect>
	{#each items as item}
		<div class="item-container">
			<div
				class="item"
				class:active={selection.includes(item.name)}
				data-multi-select-value={item.name}
			>
				<div class="icon">
					<img src={item.icon} alt={item.name} height="60px" width="60px" />
				</div>
				<div class="name">{item.name}</div>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.view-container {
		display: flex;
		height: 100%;
		width: 100%;
	}

	.item-container {
		width: 100px;
		height: 120px;
		position: relative;
	}

	.item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 5px 10px;

		&.active {
			.icon {
				background: rgba(0, 0, 0, 0.1);
			}
			.name {
				background: rgb(57, 100, 221);
				color: white;
			}
		}
		.icon {
			width: 72px;
			height: 72px;
			margin-bottom: 2px;
			border-radius: 5px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.name {
			font-size: 13px;
			padding: 0.5px 5px;
			border-radius: 3px;
		}
	}
</style>
