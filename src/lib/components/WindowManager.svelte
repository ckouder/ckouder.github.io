<script lang="ts">
	import type Window from './Window.svelte';
	import { FULL_WINDOW_MARGIN, MIN_SIZE } from '../constant';

	enum WindowMode {
		NORMAL,
		SELECT
	}

	export let windows = [];

	let resizeController: HTMLDivElement;
	let shouldReposition: boolean;
	let windowComps = [];
	let selectDirection: string;
	let mode: WindowMode = WindowMode.NORMAL;
	let focusWindowIdx: number;
	let highestZIdx = 1;

	let AABB = {
		collide: function (el1, el2) {
			let rect1 = el1.getBoundingClientRect();
			let rect2 = el2.getBoundingClientRect();

			return !(
				rect1.top > rect2.bottom ||
				rect1.right < rect2.left ||
				rect1.bottom < rect2.top ||
				rect1.left > rect2.right
			);
		},

		inside: function (el1, el2) {
			let rect1 = el1.getBoundingClientRect();
			let rect2 = el2.getBoundingClientRect();

			return (
				rect2.top <= rect1.top &&
				rect1.top <= rect2.bottom &&
				rect2.top <= rect1.bottom &&
				rect1.bottom <= rect2.bottom &&
				rect2.left <= rect1.left &&
				rect1.left <= rect2.right &&
				rect2.left <= rect1.right &&
				rect1.right <= rect2.right
			);
		},

		pointInside: function (x, y, el) {
			let rect = el.getBoundingClientRect();
			return y >= rect.top && y <= rect.bottom && x >= rect.left && x <= rect.right;
		}
	};

	export function enterWindowSelectMode(dir: string, idx: number = undefined) {
		let candidateWindows = windowComps.filter((v, i) => i !== idx);
		let thisWindowSize = windowComps[idx].getWindowSize(),
			constrainX = Infinity,
			constrainY = Infinity,
			offsetX = 0,
			offsetY = 0;

		switch (dir) {
			case 'top':
				constrainY = window.innerHeight - thisWindowSize.bottom;
				offsetY = window.innerHeight / 2 + 1;
				break;
			case 'bottom':
				constrainY = window.innerHeight - thisWindowSize.top;
				break;
			case 'top-left':
			case 'bottom-left':
			case 'left':
				constrainX = window.innerWidth - thisWindowSize.right;
				offsetX = window.innerWidth / 2 + 1;
				break;
			case 'top-right':
			case 'bottom-right':
			case 'right':
				constrainX = window.innerWidth - thisWindowSize.left;
				break;
		}
		windows.forEach((w) => (w.disabled = true));
		layoutWindows(candidateWindows, constrainX, constrainY, offsetX, offsetY);
		mode = WindowMode.SELECT;
		selectDirection = dir;
	}

	export function exitWindowSelectMode(idx: number = undefined) {
		let v = windowComps[idx];
		let x = FULL_WINDOW_MARGIN,
			y = FULL_WINDOW_MARGIN;
		let newSize = {
			top: FULL_WINDOW_MARGIN,
			left: FULL_WINDOW_MARGIN,
			right: FULL_WINDOW_MARGIN,
			bottom: FULL_WINDOW_MARGIN
		};
		let children = [...resizeController.children];
		children.forEach((child: HTMLElement) => {
			child.style.background = '';
		});
		if (selectDirection.includes('left')) {
			newSize.left = window.innerWidth / 2 - 1;
			x = window.innerWidth / 2 - 1;
		}
		if (selectDirection.includes('right')) {
			newSize.right = window.innerWidth / 2 - 1;
			x = FULL_WINDOW_MARGIN;
		}
		if (selectDirection.includes('top')) {
			newSize.top = window.innerHeight / 2 - 1;
			if (!(selectDirection.includes('left') || selectDirection.includes('right'))) {
				y = window.innerHeight / 2 - 1;
			}
		}
		if (selectDirection.includes('bottom')) {
			newSize.bottom = window.innerHeight / 2 - 1;
			if (selectDirection.includes('left') || selectDirection.includes('right')) {
				y = window.innerHeight / 2 - 1;
			}
		}
		windowComps.forEach((v) => {
			v.transformAPI.reset();
		});
		v.resize(newSize, true, false);
		v.reposition(x, y, false);
		mode = WindowMode.NORMAL;
		selectDirection = '';
		setTimeout(() => {
			windows.forEach((w) => (w.disabled = false));
		}, 500);
	}

	function layoutWindows(
		windows: Array<Window>,
		constrainX: number,
		constrainY: number,
		offsetX: number,
		offsetY: number
	) {
		let toFillUp = Math.min(constrainX, constrainY);
		let originX = FULL_WINDOW_MARGIN,
			originY = FULL_WINDOW_MARGIN;
		let placedWindowsDimensions = [];

		windows.forEach((w: Window) => {
			let size = w.getWindowSize(),
				newSize = { ...size };
			let width = size.width,
				height = size.height,
				newWidth,
				newHeight,
				translateX,
				translateY;
			let scaleCoefficient = 0.7;
			if (toFillUp === constrainX) {
				scaleCoefficient =
					width * scaleCoefficient < MIN_SIZE
						? MIN_SIZE / width
						: width * scaleCoefficient > toFillUp
						? toFillUp / width
						: scaleCoefficient;
			} else {
				scaleCoefficient =
					height * scaleCoefficient < MIN_SIZE
						? MIN_SIZE / height
						: height * scaleCoefficient > toFillUp
						? toFillUp / height
						: scaleCoefficient;
			}
			newWidth = width * scaleCoefficient;
			newHeight = height * scaleCoefficient;
			newSize.right = window.innerWidth - newWidth - size.left;
			newSize.bottom = window.innerHeight - newHeight - size.top;

			if (newWidth + originX > constrainX) {
				let targetWindow = placedWindowsDimensions.reduce((pv, cv) => {
					if (pv === undefined) return cv;
					return cv.height + cv.top >= pv.height + pv.top ? cv : pv;
				}, undefined);

				originX = FULL_WINDOW_MARGIN;
				originY = targetWindow
					? targetWindow.top + targetWindow.height + FULL_WINDOW_MARGIN
					: FULL_WINDOW_MARGIN;
			}

			if (newHeight + originY > constrainY) {
				let targetWindow = placedWindowsDimensions.reduce((pv, cv) => {
					if (pv === undefined) return cv;
					return cv.width + cv.left >= pv.height + pv.left ? cv : pv;
				}, undefined);

				originX = targetWindow
					? targetWindow.left + targetWindow.width + FULL_WINDOW_MARGIN
					: FULL_WINDOW_MARGIN;
				originY = FULL_WINDOW_MARGIN;
			}

			translateX = (originX - newSize.left + offsetX) / scaleCoefficient;
			translateY = (originY - newSize.top + offsetY) / scaleCoefficient;

			w.transformAPI.transform(
				`
                scale(${scaleCoefficient}, ${scaleCoefficient})
                translate(${translateX}px, ${translateY}px)`,
				true
			);

			placedWindowsDimensions.push({
				left: originX,
				top: originY,
				height: newHeight,
				width: newWidth
			});
			if (toFillUp === constrainX) {
				originX += newWidth + FULL_WINDOW_MARGIN;
			} else {
				originY += newHeight + FULL_WINDOW_MARGIN;
			}
		});
	}

	function onWindowResize(dimension) {
		console.log('resize received: ', dimension);
	}

	function onWindowFocus(event: CustomEvent, idx: number) {
		if (mode === WindowMode.SELECT && focusWindowIdx !== idx) {
			exitWindowSelectMode(idx);
		} else {
			windows[idx].z = highestZIdx++;
			focusWindowIdx = idx;
		}
	}

	function onWindowClose(event: CustomEvent, idx: number) {
		windows.splice(idx, 1);
		windows = [...windows];
	}

	function onWindowRepositionStart(event: CustomEvent, idx: number) {
		shouldReposition = true;
	}

	function onWindowRepositionEnd(event: CustomEvent, idx: number) {
		let children = [...resizeController.children];
		let eventTargets = [];
		children.forEach((child: HTMLElement) => {
			if (AABB.collide(event.detail.target, child)) {
				eventTargets.push(child);
			}
			child.style.background = '';
		});

		if (eventTargets.length > 2 || eventTargets.length === 0) {
			return;
		}

		let containRight = eventTargets.filter((e) => e.dataset.tag.includes('right')).length > 0,
			containLeft = eventTargets.filter((e) => e.dataset.tag.includes('left')).length > 0,
			containTop = eventTargets.filter((e) => e.dataset.tag.includes('top')).length > 0,
			containBottom = eventTargets.filter((e) => e.dataset.tag.includes('bottom')).length > 0;
		let target = windowComps[idx];
		let newSize = {
			top: FULL_WINDOW_MARGIN,
			bottom: FULL_WINDOW_MARGIN,
			right: FULL_WINDOW_MARGIN,
			left: FULL_WINDOW_MARGIN
		};
		let verticalMode = containTop ? 'top' : containBottom ? 'bottom' : '',
			horizontalMode = containLeft ? 'left' : containRight ? 'right' : '',
			mode = verticalMode
				? horizontalMode
					? `${verticalMode}-${horizontalMode}`
					: verticalMode
				: horizontalMode
				? horizontalMode
				: '';
		if ((containBottom && containTop) || (containLeft && containRight)) {
			return;
		}

		if (containRight) {
			newSize.left = window.innerWidth / 2 - 1;
		}
		if (containLeft) {
			newSize.right = window.innerWidth / 2 - 1;
		}
		if (containBottom) {
			newSize.top = window.innerHeight / 2 - 1;
		}
		if (containTop) {
			newSize.bottom = window.innerHeight / 2 - 1;
		}

		target.resize(newSize, true, false);
		enterWindowSelectMode(mode, idx);
		focusWindowIdx = idx;
	}

	function onWindowRepositioning(event: CustomEvent, idx: number) {
		let children = [...resizeController.children];
		children.forEach((child: HTMLElement) => {
			if (AABB.collide(child, event.detail.target)) {
				child.style.background = 'rgba(0,0,0,0.3)';
			} else {
				child.style.background = 'rgba(0,0,0,0.1)';
			}
		});
	}
</script>

<div class="container">
	<!-- {#each windows as w}
    <svelte:component this={w}/>
  {/each} -->
	<div bind:this={resizeController} class="resize-controller">
		<div class="ctrl" data-tag="left" />
		<div class="ctrl" data-tag="top" />
		<div class="ctrl" data-tag="right" />
		<div class="ctrl" data-tag="bottom" />
	</div>
</div>

<style lang="scss">
	$ctrl-short: 8px;
	$ctrl-long: calc(100% - $ctrl-short * 2);
	$ctrl-offset: $ctrl-short;
	$resizer-short: 14px;
	$resizer-long: 60px;
	@mixin resizer-style {
		box-sizing: border-box;
		display: block;
		position: absolute;
		border-radius: $resizer-short;
		background: white;
		border: 2px solid black;
		cursor: grab;
		content: '';
	}
	* {
		box-sizing: border-box;
	}
	.container {
		overflow: hidden;
	}
	.resize-controller {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		.ctrl {
			position: absolute;
			padding: 0;
			margin: 0;
			pointer-events: none;
			transform-style: preserve-3d;
			cursor: grabbing;
			&[data-tag='left'] {
				left: 0;
				top: $ctrl-offset;
				height: $ctrl-long;
				width: $ctrl-short;
			}
			&[data-tag='top'] {
				top: 0;
				left: $ctrl-offset;
				width: $ctrl-long;
				height: $ctrl-short;
			}
			&[data-tag='right'] {
				right: 0;
				top: $ctrl-offset;
				width: $ctrl-short;
				height: $ctrl-long;
			}
			&[data-tag='bottom'] {
				bottom: 0;
				left: $ctrl-offset;
				width: $ctrl-long;
				height: $ctrl-short;
			}
		}
	}
</style>
