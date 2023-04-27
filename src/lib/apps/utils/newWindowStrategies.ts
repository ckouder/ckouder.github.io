import type { ComponentType } from "svelte";
import { currentWindow, appWindowMap } from "../../stores/windows";
import { get } from "svelte/store";

export type NewWindowStrategy = (component: ComponentType) => boolean;

export function onlyOneWindowOfInstance(component: ComponentType): boolean {
  const maps = get(appWindowMap);
  let shouldOpen = true;
  maps.forEach((value, key) => {
    if (key instanceof component) {
      currentWindow.set(value);
      shouldOpen = false;
    }
  });
  return shouldOpen;
}

export function alwaysNewWindow(_: ComponentType): boolean {
  return true;
}