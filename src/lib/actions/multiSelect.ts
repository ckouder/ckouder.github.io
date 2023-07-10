import { pointInside, rectAreOverlapping } from '../util';
import { mouseTracker } from './mouseTracker';

export let selection = [];

export const multiSelect = (node: HTMLElement, itemIdentifier: string) => {
	const tracker = mouseTracker(node);
	let div = document.createElement('div');
	let originX: number;
	let originY: number;
	let items: NodeList;

	node.addEventListener('trackStart', (event: CustomEvent) => {
		let rect = node.getBoundingClientRect();
		let offsetX = rect.left,
			offsetY = rect.top,
			width = rect.width,
			height = rect.height;
		items = node.querySelectorAll(itemIdentifier);

		node.appendChild(div);
		originX = event.detail.x;
		originY = event.detail.y;
		div.style.position = 'absolute';
		div.style.left = `${originX - offsetX}px`;
		div.style.top = `${originY - offsetY}px`;
		div.style.bottom = `${height - (originY - offsetY)}px`;
		div.style.right = `${width - (originX - offsetX)}px`;
		div.style.border = '1px solid rgba(0, 0, 0, 0.3)';
		div.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';

		items.forEach((item: HTMLElement) => {
			let rect = item.getBoundingClientRect();
			if (!pointInside(originX, originY, rect.left, rect.top, rect.right, rect.bottom)) {
				item.classList.remove('active');
			} else {
				item.classList.add('active');
				selection.push(item.dataset.multiSelectValue);
			}
		});

		node.dispatchEvent(
			new CustomEvent('multiSelect', {
				detail: selection
			})
		);
	});

	node.addEventListener('trackUpdate', (event: CustomEvent) => {
		let rect = node.getBoundingClientRect();
		let offsetX = rect.left,
			offsetY = rect.top;

		div.style.width = `${Math.abs(event.detail.x - originX)}px`;
		div.style.height = `${Math.abs(event.detail.y - originY)}px`;
		div.style.left = `${Math.min(event.detail.x, originX) - offsetX}px`;
		div.style.top = `${Math.min(event.detail.y, originY) - offsetY}px`;

		items.forEach((item: HTMLElement) => {
			item.classList.remove('active');
		});

		selection = [];
		Array.from(items)
			.filter((item: HTMLElement) => {
				let itemRect = item.getBoundingClientRect();
				return rectAreOverlapping(
					itemRect.left,
					itemRect.right,
					itemRect.top,
					itemRect.bottom,
					Math.min(event.detail.x, originX),
					Math.max(event.detail.x, originX),
					Math.min(event.detail.y, originY),
					Math.max(event.detail.y, originY)
				);
			})
			.forEach((item: HTMLElement) => {
				item.classList.add('active');
				selection.push(item.dataset.multiSelectValue);
			});
	});

	node.addEventListener('trackEnd', (event: CustomEvent) => {
		node.removeChild(div);
		node.dispatchEvent(
			new CustomEvent('multiSelect', {
				detail: selection
			})
		);

		div = document.createElement('div');
		originX = null;
		originY = null;
		items = null;
		selection = [];
	});

	return {
		destroy() {
			tracker.destroy();
		}
	};
};
