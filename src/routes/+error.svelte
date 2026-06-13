<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status}</title>
</svelte:head>

<h2>{page.status}</h2>
<p>{page.error?.message ?? 'Something went wrong.'}</p>
<p><a href="/">← Back to works</a></p>
