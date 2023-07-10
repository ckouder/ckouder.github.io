export const switchable = (node: HTMLElement, child: string) => {
	let children = node.querySelectorAll(child);

	let focusFn = (i: number) => (e: MouseEvent) => {
		node.dispatchEvent(
			new CustomEvent('switchable-focus', {
				detail: children[i]
			})
		);
	};

	let mouseDownFn = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	let onChildFocusFn = (e: CustomEvent) => {
		children.forEach((child: HTMLElement) => child.classList.remove('focused'));
		e.detail.classList.add('focused');
	};

	let mount = () => {
		children.forEach((child: HTMLElement, i: number) => {
			child.addEventListener('mousedown', mouseDownFn);
			child.addEventListener('click', focusFn(i));
		});

		node.addEventListener('switchable-focus', onChildFocusFn);
	};

	mount();

	return {
		destroy: () => {
			children.forEach((e: HTMLElement, i: number) => {
				e.removeEventListener('mousedown', mouseDownFn);
				e.removeEventListener('click', focusFn(i));
			});
			node.removeEventListener('switchable-focus', onChildFocusFn);
		}
	};
};
