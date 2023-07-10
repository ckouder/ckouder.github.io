<script lang="ts">
	import { multiSelect } from '../../../actions/multiSelect';
	import type { Item } from './type';

	export let items: Item[] = [];
	export let selection: string[] = [];

	const rows = [
		{ label: 'Name', value: 'name' },
		{ label: 'Kind', value: 'kind' },
		{ label: 'Date Last Opened', value: 'dateLastOpened' },
		{ label: 'Date Created', value: 'dateCreated' },
		{ label: 'Date Modified', value: 'dateModified' },
		{ label: 'Date Added', value: 'dateAdded' },
		{ label: 'Size', value: 'size' },
		{ label: 'Tags', value: 'tags' },
		{ label: 'Comments', value: 'comments' }
	];

	let visibleRows = [
		{ label: 'Name', value: 'name' },
		{ label: 'Kind', value: 'kind' },
		{ label: 'Date Last Opened', value: 'dateLastOpened' }
	];
</script>

<div class="view-container" use:multiSelect={'tbody > tr'} on:multiSelect>
	<table>
		<thead>
			<tr>
				{#each visibleRows as row, i}
					<th>
						{#if row.value === 'name'}
							<span>
								<span class="icon" style="box-shadow:none; margin: 0px 6px;" />
								{row.label}
							</span>
						{:else}
							{row.label}
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each items as item}
				<tr
					class="row"
					class:active={selection.includes(item.name)}
					data-multi-select-value={item.name}
				>
					{#each visibleRows as row}
						<td>
							<span>
								{#if row.value === 'name'}
									<img class="icon" src={item.icon} alt={item.name} />
									{item[row.value]}
								{:else}
									{item[row.value]}
								{/if}
							</span>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style lang="scss">
	table {
		border-collapse: separate;
		border-spacing: 0;
		font-size: 12px;
		width: 100%;
	}

	th {
		padding-left: 4px;
		text-align: left;
		border-bottom: 1px solid #f4f5f5;
		font-weight: 400;
	}

	th > span,
	td > span {
		display: flex;
		align-items: center;
		padding: 3px;
		min-height: 22px;
	}

	thead {
		tr {
			position: sticky;
			width: 100%;
			background: white;
		}
	}

	.row {
		td {
			&:first-child span {
				margin-left: 5px;
				border-radius: 5px 0 0 5px;
			}

			&:last-child span {
				margin-right: 5px;
				border-radius: 0 5px 5px 0;
			}

			&:nth-child(n + 2) {
				color: #999;
			}
		}

		&:nth-child(even) span {
			background-color: #f4f5f5;
		}

		&.active {
			span {
				height: 100%;
				background: rgb(57, 100, 221);
				color: white;
			}

			td:nth-child(n + 2) span {
				color: lightblue;
			}

			&:has(+ .active) {
				td:first-child span {
					border-radius: 5px 0 0 0;
				}

				td:last-child span {
					border-radius: 0 5px 0 0;
				}
			}

			& + .active {
				td:first-child span {
					border-radius: 0 0 0 5px;
				}

				td:last-child span {
					border-radius: 0 0 5px 0;
				}
			}

			& + .active:has(+ .active) {
				td:first-child span {
					border-radius: 0;
				}

				td:last-child span {
					border-radius: 0;
				}
			}
		}
	}

	.view-container {
		height: 100%;
		width: 100%;
	}

	.icon {
		display: inline-block;
		margin: 0rem 0.4rem;
		height: 16px;
		width: 16px;
		box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.1);
	}
</style>
