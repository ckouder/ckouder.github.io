export const switchable = (node: HTMLElement, child: string) => {
    let children = node.querySelectorAll(child);

    let focusFn = (i: number) => () => {
        node.dispatchEvent(new CustomEvent('focus', {
            detail: children[i]
        }));
    };

    let onChildFocusFn = (e: CustomEvent) => {
        children.forEach((child: HTMLElement) => child.classList.remove('focused'));
        e.detail.classList.add('focused');
    };

    let mount = () => {
        children.forEach((child: HTMLElement, i: number) => {
            child.addEventListener('click', focusFn(i));
        });

        node.addEventListener('focus', onChildFocusFn);
    };

    mount();

    return {
        destroy: () => {
            children.forEach((e: HTMLElement, i: number) =>
                e.removeEventListener('click', focusFn(i)));
            node.removeEventListener('focus', onChildFocusFn);
        },
    };
}

export const mouseTracker = (node: HTMLElement, controllerId: string = undefined) => {
    const controller = controllerId === undefined ? node : node.querySelector(`#${controllerId}`);
    let x;
    let y;

    let handleMousedown = (event: MouseEvent) => {
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(new CustomEvent('trackStart', {
			detail: { x, y }
		}));

		window.addEventListener('mousemove', handleMousemove);
		window.addEventListener('mouseup', handleMouseup);
	}

	let handleMousemove = (event: MouseEvent) => {
		const dx = event.clientX - x;
		const dy = event.clientY - y;
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(new CustomEvent('trackUpdate', {
			detail: { x, y, dx, dy }
		}));
	}

	let handleMouseup = (event: MouseEvent) => {
		x = event.clientX;
		y = event.clientY;

		node.dispatchEvent(new CustomEvent('trackEnd', {
			detail: { x, y }
		}));

		window.removeEventListener('mousemove', handleMousemove);
		window.removeEventListener('mouseup', handleMouseup);
	}

	controller.addEventListener('mousedown', handleMousedown);

	return {
		destroy() {
			node.removeEventListener('mousedown', handleMousedown);
		}
	};
}
