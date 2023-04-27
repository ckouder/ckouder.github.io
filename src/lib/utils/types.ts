import type About from "../apps/About.svelte";
import type Finder from "../apps/Finder.svelte";

export type WindowConfig = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
}

export type App = About | Finder;