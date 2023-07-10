import ContextMenu from '../components/ContextMenu.svelte';

export const contextMenu = (node: HTMLElement, init: any) => {
	let menu = undefined;
	let props = init;

	const removeContextMenu = () => {
		if (menu) {
			menu.$destroy();
			menu = undefined;
		}
	};

	const setup = (props: any) => {
		const boundingRect = node.getBoundingClientRect();
		const { top, left, ...rest } = props;
		menu = new ContextMenu({
			target: document.body,
			props: {
				y: top ? boundingRect.top : boundingRect.bottom,
				x: left ? boundingRect.left : boundingRect.right,
				...rest
			}
		});

		menu.$on('switchable-focus', (e: CustomEvent) => {
			node.dispatchEvent(
				new CustomEvent('item-clicked', {
					detail: e.detail
				})
			);

			const backgroundColor = e.detail.style.backgroundColor;
			e.detail.style.backgroundColor = 'transparent';
			setTimeout(() => {
				e.detail.style.backgroundColor = backgroundColor;
			}, 100);
			setTimeout(() => {
				if (menu) {
					menu.$destroy();
				}
			}, 300);
		});

		menu.$on('destroy', () => {
			document.body.removeEventListener('mousedown', removeContextMenu);
		});

		document.body.addEventListener('mousedown', removeContextMenu);
	};

	node.addEventListener('click', (event: MouseEvent) => {
		event.preventDefault();
		setup(props);
	});

	return {
		update(newProps: any) {
			props = newProps;
		},
		destroy() {
			document.body.removeEventListener('mousedown', removeContextMenu);
		}
	};
};
