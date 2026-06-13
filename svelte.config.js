import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// Static output for GitHub Pages. The site is fully prerendered;
		// 404.html lets GitHub Pages serve unknown routes via the app shell.
		adapter: adapter({ fallback: '404.html' }),
		// ckouder.github.io is a user page served from the domain root,
		// so no base path is needed.
		paths: { base: '' }
	}
};

export default config;
