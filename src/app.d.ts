// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

declare namespace svelteHTML {
	interface HTMLAttributes<T> {
		'on:switchable-focus'?: (e: CustomEvent) => void;
		'on:item-clicked'?: (e: CustomEvent) => void;
		'on:ready'?: (e: CustomEvent) => void;
		'on:destroy'?: (e: CustomEvent) => void;
		'on:trackStart'?: (e: CustomEvent) => void;
		'on:trackUpdate'?: (e: CustomEvent) => void;
		'on:trackEnd'?: (e: CustomEvent) => void;
		'on:multiSelect'?: (e: CustomEvent) => void;
	}
}

export { };
