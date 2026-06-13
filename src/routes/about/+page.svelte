<script lang="ts">
	import { contact, site } from '$lib/content';
</script>

<svelte:head>
	<title>About — {site.title}</title>
	<meta name="description" content="About and contact information for {site.artist}." />
</svelte:head>

<h2>About</h2>
<p>
	{site.artist} is an artist and engineer working with the web as a medium — building interactive pieces
	about memory, permanence, and the places technology touches ordinary life.
</p>

<h2>Contact</h2>
<ul class="plain">
	<li><a href="mailto:{contact.email}">{contact.email}</a></li>
	<li><a href={contact.github} rel="noreferrer">GitHub</a></li>
	<li><a href={contact.linkedin} rel="noreferrer">LinkedIn</a></li>
</ul>
