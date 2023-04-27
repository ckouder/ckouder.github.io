import type { ComponentProps, ComponentType, SvelteComponent } from "svelte";
import { writable } from "svelte/store";
import { onNewWindow } from "../apps/hooks";
import type { App } from "../utils/types";

export const currentWindow = writable<HTMLElement>(null);
export const topZIndex = writable(10);
export const appWindowMap = writable<Map<SvelteComponent, HTMLElement>>(new Map());

export const appNameMap = new Map<ComponentType, string>();

export function getRoot() {
  return document.getElementById("root");
}

export function tryOpenNewApp(component: ComponentType<App>, props: ComponentProps<App>) {
  if (!component) return;
  
  const appName = appNameMap.get(component);
  if (onNewWindow.get(appName)(component)) {
    let comp = new component({
      target: getRoot(),
      props,
    });
  
    comp.$on("ready", (event: CustomEvent<HTMLElement>) => {
      currentWindow.set(event.detail);
      appWindowMap.update((map) => {
        map.set(comp, event.detail);
        currentWindow.set(event.detail);
        return map;
      });
    });
  
    comp.$on("destroy", () => {
      appWindowMap.update((map) => {
        map.delete(comp);
        return map;
      });
      comp.$destroy();
    });
  }
}
