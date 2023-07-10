import { writable } from 'svelte/store';

export const currentWindow = writable<HTMLElement | null>(null);
