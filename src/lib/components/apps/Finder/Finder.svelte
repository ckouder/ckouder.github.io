<script lang="ts">
	import Window from '../../Window.svelte';
	import { switchable } from '../../../actions';
	import Foldable from '../../Foldable.svelte';
	import IconView from './IconView.svelte';
	import ListView from './ListView.svelte';
	import ColumnsView from './ColumnsView.svelte';
	import GallaryView from './GallaryView.svelte';
	import { contextMenu } from '../../../actions/contextMenu';

	export let title: string = 'Applications';
	export let viewMode: string = 'icon';

	export const APP_NAME = 'Finder';

	const HIDE_SEARCH_EP = 1100,
		HIDE_VIEW_EP = 1000,
		DELTA = 30,
		HIDE_MORE = 770,
		HIDE_TAG = HIDE_MORE - DELTA,
		HIDE_SHARE = HIDE_TAG - DELTA,
		HIDE_FILTER = HIDE_SHARE - DELTA,
		HIDE_VIEW = HIDE_FILTER - DELTA - 40,
		SIDEBAR_FOLDABLES = [
			{
				title: 'Favorites',
				items: [
					{
						icon: 'assets/airdrop@2x.png',
						title: 'AirDrop',
						items: []
					},
					{
						icon: 'assets/app@2x.png',
						title: 'Applications',
						items: [
							{
								name: 'Chess',
								icon: 'assets/chess-knight-2.png',
								alt: 'chess',
								kind: 'Application',
								dateLastOpened: '2021-01-01',
								dateCreated: '2021-01-01',
								dateModified: '2021-01-01',
								dateAdded: '2021-01-01',
								size: '1.2 MB',
								tags: [],
								comments: 'Chess game'
							},
							{
								name: 'Chess 1',
								icon: 'assets/chess-knight-2.png',
								alt: 'chess',
								kind: 'Application',
								dateLastOpened: '2021-01-01',
								dateCreated: '2021-01-01',
								dateModified: '2021-01-01',
								dateAdded: '2021-01-01',
								size: '1.2 MB',
								tags: [],
								comments: 'Chess game'
							},
							{
								name: 'Chess 2',
								icon: 'assets/chess-knight-2.png',
								alt: 'chess',
								kind: 'Application',
								dateLastOpened: '2021-01-01',
								dateCreated: '2021-01-01',
								dateModified: '2021-01-01',
								dateAdded: '2021-01-01',
								size: '1.2 MB',
								tags: [],
								comments: 'Chess game'
							}
						]
					},
					{
						icon: 'assets/menubar.dock.rectangle@2x.png',
						title: 'Desktop',
						items: []
					},
					{
						icon: 'assets/doc@2x.png',
						title: 'Documents',
						items: []
					}
				]
			},
			{
				title: 'iCloud',
				items: [
					{
						icon: 'assets/icloud@2x.png',
						title: 'iCloud Drive',
						items: []
					},
					{
						icon: 'assets/folder.badge.person.crop@2x.png',
						title: 'Shared',
						items: []
					}
				]
			}
		];
	const VIEW_MODES = [
		{ value: 'icon', icon: 'assets/square.grid.2x2@2x.png', label: 'as Icons', status: 'ENABLED' },
		{ value: 'list', icon: 'assets/list.bullet@2x.png', label: 'as List', status: 'ENABLED' },
		{
			value: 'column',
			icon: 'assets/rectangle.split.3x1@2x.png',
			label: 'as Columns',
			status: 'ENABLED'
		},
		{
			value: 'gallary',
			icon: 'assets/squares.below.rectangle@2x.png',
			label: 'as Gallary',
			status: 'ENABLED'
		}
	];

	let windowWidth = 800;
	let items = [];
	let menu = undefined;
	let selection = [];

	$: SIDEBAR_FOLDABLES.forEach((e) => {
		e.items.forEach((i) => {
			if (i.title === title) {
				items = i.items;
			}
		});
	});

	$: menu = {
		items: VIEW_MODES,
		selectable: true,
		focusedItem: viewMode,
		left: true,
		top: true
	};

	function onSidebarItemFocus(e: CustomEvent) {
		title = e.detail.dataset.value;
	}

	function onViewItemFocus(e: CustomEvent) {
		viewMode = e.detail.dataset.value;
	}

	function onWindowResize(e: CustomEvent) {
		windowWidth = e.detail.data.width;
	}

	function onMultiSelect(e: CustomEvent) {
		selection = e.detail;
	}
</script>

<Window
	on:resize={onWindowResize}
	on:ready
	on:destroy
	config={{ x: 100, y: 100, z: 0, width: 800, height: 600 }}
>
	<div class="toolbar" slot="toolbar">
		<button class="btn btn-backwards">
			<img src="assets/chevron.backward@2x.png" alt="backward" />
		</button>
		<button class="btn btn-forwards">
			<img src="assets/chevron.forward@2x.png" alt="forward" />
		</button>
		<h4>{title}</h4>
		<div class="btn-group-container">
			<div class="btn-group btn-group-view mr-40" class:no-visibility={windowWidth <= HIDE_VIEW}>
				{#if windowWidth <= HIDE_VIEW_EP}
					<button class="btn" use:contextMenu={menu} on:item-clicked={onViewItemFocus}>
						<img
							src={VIEW_MODES.find((e) => e.value === viewMode).icon}
							alt={VIEW_MODES.find((e) => e.value === viewMode).value}
							data-value={VIEW_MODES.find((e) => e.value === viewMode).value}
						/>
						<img
							src="assets/chevron.up.chevron.down@2x.png"
							alt="view up"
							style="height:13px; width:7px;"
						/>
					</button>
				{:else}
					<span class="btn-group" use:switchable={'button'} on:switchable-focus={onViewItemFocus}>
						{#each VIEW_MODES as mode, i}
							<button class="btn" class:focused={viewMode === mode.value} data-value={mode.value}>
								<img src={mode.icon} alt={mode.value} />
							</button>
							{#if i < VIEW_MODES.length - 1}
								<span class="vertical-sep" />
							{/if}
						{/each}
					</span>
				{/if}
			</div>
			<div class="btn-group btn-group-others mr-40">
				<button class="btn btn-filter" class:no-visibility={windowWidth <= HIDE_FILTER}>
					<img src="assets/square.grid.3x1.below.line.grid.1x2@2x.png" alt="panel" />
					<img src="assets/chevron.down@2x.png" alt="more" />
				</button>
				<button class="btn btn-share" class:no-visibility={windowWidth <= HIDE_SHARE}>
					<img src="assets/square.and.arrow.up@2x.png" alt="up" />
				</button>
				<button class="btn btn-tag" class:no-visibility={windowWidth <= HIDE_TAG}>
					<img src="assets/tag@2x.png" alt="tag" />
				</button>
				<button class="btn btn-more" class:no-visibility={windowWidth <= HIDE_MORE}>
					<img src="assets/ellipsis.circle@2x.png" alt="more" />
					<img src="assets/chevron.down@2x.png" alt="more" />
				</button>
			</div>
			{#if windowWidth > HIDE_SEARCH_EP}
				<div class="inflator-lg" />
			{:else}
				<div class="inflator-sm" />
			{/if}
		</div>
		<div class="search-group">
			{#if windowWidth <= HIDE_MORE}
				<button class="btn btn-hide">
					<img src="assets/chevron.forward.2@2x.png" alt="forward" />
				</button>
			{/if}
			<button class="btn btn-search" class:no-display={windowWidth > HIDE_SEARCH_EP}>
				<img src="assets/magnifyingglass@2x.png" alt="search" />
			</button>
			<div class="input-search" class:no-display={windowWidth <= HIDE_SEARCH_EP}>
				<input type="text" placeholder="Search" />
			</div>
		</div>
	</div>
	<div
		class="sidebar"
		slot="sidebar"
		use:switchable={'li'}
		on:switchable-focus={onSidebarItemFocus}
	>
		{#each SIDEBAR_FOLDABLES as foldable}
			<Foldable title={foldable.title}>
				<ul slot="itemsToFold">
					{#each foldable.items as item}
						<li class:focused={title === item.title} data-value={item.title}>
							<div>
								<img class="sidebar-icon" src={item.icon} alt={item.title} />
							</div>
							<span>{item.title}</span>
						</li>
					{/each}
				</ul>
			</Foldable>
		{/each}
	</div>
	<div slot="content">
		{#if viewMode === 'icon'}
			<IconView {items} {selection} on:multiSelect={onMultiSelect} />
		{:else if viewMode === 'list'}
			<ListView {items} {selection} on:multiSelect={onMultiSelect} />
		{:else if viewMode === 'column'}
			<ColumnsView {items} />
		{:else if viewMode === 'gallary'}
			<GallaryView {items} />
		{/if}
	</div>
</Window>

<style lang="scss">
	@mixin transition-property {
		transition: opacity 0.3s, transform 0.3s;
	}
	.focused {
		background: #0000001f;
	}
	.no-display,
	.no-display * {
		display: none !important;
	}
	.no-visibility {
		@include transition-property;
		opacity: 0 !important;
		transform: scale(0);
		pointer-events: none;
	}
	.mr-40 {
		margin-right: 40px;
	}
	.btn {
		@include transition-property;
		display: flex;
		gap: 5px;
		height: 26px;
		align-items: center;
		justify-content: center;
		img {
			height: 16px;
			max-width: 20px;
			width: auto;
		}
		&.btn-filter img:nth-child(2),
		&.btn-more img:nth-child(2) {
			height: 6px;
			width: 8px;
		}
	}
	.search-group {
		position: absolute;
		top: 12px;
		right: 13px;
		height: 100%;
		display: flex;
		.input-search {
			position: relative;
			padding: 0;
			margin-top: -1px;
			height: 100%;
			input {
				height: 26px;
				width: 150px;
				border: 1px solid #e1dfe1;
				background: transparent;
				border-radius: 5px;
				margin: 0;
				padding: 0 0 0 20px;
			}
		}
		.input-search::before {
			position: absolute;
			display: block;
			top: 7px;
			left: 5px;
			height: 12px;
			width: 12px;
			background: url('/assets/magnifyingglass@2x.png');
			background-size: cover;
			content: '';
		}
	}
	.btn-group {
		@include transition-property;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		&.btn-group-others {
			gap: 7px;
		}
		&.btn-group-view {
			border-radius: 5px;
			&:hover {
				background: rgb(234, 234, 234);
			}
			.vertical-sep {
				height: 18px;
				border-right: 1px solid #e1dfe1;
			}
		}
	}
	.sidebar {
		padding: 7px;
		ul {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			li {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 24px;
				border-radius: 5px;
				div {
					width: 24px;
					padding: 3px 3px 3px 10px;
					margin-right: 5px;
					display: flex;
					align-items: center;
					justify-content: center;
					img {
						max-height: 13px;
						max-width: 13px;
						width: auto;
						height: auto;
					}
				}
			}
			span {
				display: inline-block;
				flex-grow: 2;
				font-size: 12px;
			}
		}
	}
	.toolbar {
		display: flex;
		flex-direction: row;
		margin-top: 12px;
		padding-left: 10px;
		opacity: 0.7;
		overflow: hidden;
		h4 {
			margin-left: 8px;
			line-height: 160%;
			min-width: 215px;
			flex-grow: 1;
		}
		.btn-group-container {
			display: flex;
			flex-shrink: 1;
			.inflator-lg {
				width: 150px;
			}
			.inflator-sm {
				width: 40px;
			}
		}
		button {
			-webkit-appearance: none;
			appearance: none;
			padding: 3px 5px;
			text-align: center;
			background-color: transparent;
			border: none;
			border-radius: 5px;
			z-index: 1001;
			&:hover {
				background-color: rgb(209, 209, 209);
			}
			&:active {
				background-color: rgb(197, 197, 197);
			}
			&.focused {
				background-color: rgb(209, 209, 209);
			}
		}
		.btn-backwards,
		.btn-forwards {
			padding: 5px 10px;
		}
	}
	div[slot='content'] {
		height: 100%;
		width: 100%;
	}
</style>
