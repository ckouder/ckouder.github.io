export const mouseTracker = (node: HTMLElement, controllerId: string = undefined) => {
	const controller = controllerId === undefined ? node : node.querySelector(`#${controllerId}`);

	let handleMousedown = (event: MouseEvent) => {
		node.dispatchEvent(
			new CustomEvent('trackStart', {
				detail: event
			})
		);

		window.addEventListener('mousemove', handleMousemove);
		window.addEventListener('mouseup', handleMouseup);
	};

	let handleMousemove = (event: MouseEvent) => {
		const x = event.clientX;
		const y = event.clientY;
		const dx = event.clientX - x;
		const dy = event.clientY - y;

		Object.assign(event, { dx, dy });
		node.dispatchEvent(
			new CustomEvent('trackUpdate', {
				detail: event
			})
		);
	};

	let handleMouseup = (event: MouseEvent) => {
		node.dispatchEvent(
			new CustomEvent('trackEnd', {
				detail: event
			})
		);

		window.removeEventListener('mousemove', handleMousemove);
		window.removeEventListener('mouseup', handleMouseup);
	};

	controller.addEventListener('mousedown', handleMousedown);

	return {
		destroy() {
			node.removeEventListener('mousedown', handleMousedown);
		}
	};
};
