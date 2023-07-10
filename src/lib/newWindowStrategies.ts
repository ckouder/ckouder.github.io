import type { ComponentType } from 'svelte';
import { appIsOpen, appWindows } from './appManager';
import { currentWindow } from './store';

export type NewWindowStrategy = (component: ComponentType) => boolean;

export function onlyOneWindowOfInstance(component: ComponentType): boolean {
	let shouldOpen = true;
	let appEl = appWindows.get(component);
	if (appIsOpen(component)) {
		shouldOpen = false;
		currentWindow.set(appEl!);
	}
	return shouldOpen;
}

export function alwaysNewWindow(_: ComponentType): boolean {
	return true;
}
