<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { site } from '$lib/content';

	let { children } = $props();

	inject({ mode: dev ? 'development' : 'production' });

	const navItems = [
		{ href: '/', label: 'Works' },
		{ href: '/statement', label: 'Statement' }
	];

	function isCurrent(href: string): boolean {
		return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
	}
</script>

<header>
	<h1><a href="/" style="text-decoration: none">{site.artist}</a></h1>
	<nav aria-label="Main">
		{#each navItems as item (item.href)}
			<a href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}>
				{item.label}
			</a>
		{/each}
	</nav>
</header>

<main>
	{@render children()}
</main>

<footer>
	<p class="meta">© {new Date().getFullYear()} {site.artist}</p>
	<p class="meta">
		Co-created by <a href="https://claude.ai/" rel="noreferrer">Claude Opus 4.8</a>
	</p>
</footer>
