import type { ComponentProps, ComponentType } from 'svelte';
import type { App } from './type';
import About from './components/apps/About/About.svelte';
import Finder from './components/apps/Finder/Finder.svelte';
import { onlyOneWindowOfInstance, type NewWindowStrategy } from './newWindowStrategies';
import { currentWindow } from './store';
import { visit } from './navigation';

export const appOnNewWindow = new Map<ComponentType, NewWindowStrategy>([
	[About, onlyOneWindowOfInstance],
	[Finder, onlyOneWindowOfInstance]
]);

export const URL_APP = new Map<string, ComponentType>([
	['about', About],
	['finder', Finder]
])

export const getAppUrl = (appComp: ComponentType<App>) => {
	return `/${appComp.name.toLowerCase().split(/proxy<(.*)>/)[1]}`;
}

export let appWindows = new Map<ComponentType<App>, HTMLElement | null>();

export const appIsOpen = (appComp: ComponentType<App>) => {
	let appWindow = appWindows.get(appComp);
	return !Object.is(appWindow, undefined);
}

export function tryOpenApp(
	appComp: ComponentType<App> | undefined, 
	props: ComponentProps<App> = {}
) {
	if (!appComp) return;

	function getAppContainer() {
		return document.getElementById('root');
	}

	if (!getAppContainer()) {
		throw new Error('App container not found');
	}

	const canOpenNewWindow = appOnNewWindow.get(appComp)!;
	if ((canOpenNewWindow(appComp))!) {
		let comp = new appComp({
			target: getAppContainer()!,
			props
		});

		appWindows.set(appComp, null);
		comp.$on('ready', (event: CustomEvent<HTMLElement>) => {
			appWindows.set(appComp, event.detail);
			currentWindow.set(event.detail);
		});

		comp.$on('destroy', () => {
			appWindows.delete(appComp);
			comp.$destroy();
			currentWindow.set(null);
			visit('/');
		});
	}
}

currentWindow.subscribe((w) => {
	if (w) {
		// console.log(window.location.pathname);
		for (let [compType, el] of appWindows) {
			if (el === w && window.location.pathname !== getAppUrl(compType)) {
				visit(getAppUrl(compType));
				break;
			}
		}
	}
});
