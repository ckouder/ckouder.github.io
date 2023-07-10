<script lang="ts">
	import { contextMenu } from '../../../actions';
	import { visit } from '$lib/navigation';

	const menu = {
		items: [{ label: 'About This Mac', value: 'about', action: () => visit('/about') }],
		selectable: false,
		top: false,
		left: true
	};
	let time = setupTime();

	setInterval(() => {
		time = setupTime();
	}, 1000);

	function setupTime() {
		const dateTime = new Date();
		const weekday = dateTime.toLocaleDateString(undefined, {
			weekday: "short",
		});
		const date = dateTime.toLocaleDateString(undefined, {
			month: "short", 
			day: "numeric",
		});
		const time = dateTime.toLocaleTimeString(undefined, {
			hour: 'numeric',
			minute: 'numeric',
		});
		const str = `${weekday} ${date} ${time}`;
		return str;
	}

	function onItemClicked(e: CustomEvent) {
		menu.items.find((i) => i.value === e.detail.dataset.value).action();
	}
</script>

<div class="toolbar">
	<div class="app-toolbar-container">
		<button use:contextMenu={menu} on:item-clicked={onItemClicked}>
			<img src="assets/apple.logo.svg" alt="apple" />
		</button>
		<slot />
	</div>
	<div class="status-container">
		<button>
			<img src="assets/battery.100.svg" alt="battery" />
		</button>
		<button>
			<img src="assets/wifi.svg" alt="wifi" />
		</button>
		<button>
			<img src="assets/magnifyingglass.svg" alt="search" />
		</button>
		<button>
			<img src="assets/switch.2.svg" alt="switch" />
		</button>
		<button>
			<span>{time}</span>
		</button>
	</div>
</div>

<style lang="scss">
	.toolbar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 24px;
		background-color: rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(25px);
		-webkit-backdrop-filter: blur(25px);
	}

	.status-container,
	.app-toolbar-container {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: inherit;
		padding: 0px 20px 0px 0px;
	}

	.status-container img {
		max-height: 50%;
	}

	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: inherit;
		padding: 0px 10px;
		border-radius: 5px;
		border: 0px;
		font-size: 13px;
		color: white;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
		background: transparent;
		appearance: none;
		-webkit-appearance: none;

		&:active {
			background: rgba(255, 255, 255, 0.3);
		}
	}

	img {
		max-height: 60%;
		max-width: 100%;
		filter: invert(100%) drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));
	}
</style>
