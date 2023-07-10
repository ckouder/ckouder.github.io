<script lang="ts">
	import { visit } from '../../../navigation';
	export let href: string;
	export let iconSrc: string;

</script>

<button
	class="item"
	style="background-image: url({iconSrc});"
	on:dblclick={visit(href)}
/>

<style lang="scss">
	.item {
		height: 60px;
		width: 60px;
		background-repeat: no-repeat;
		background-size: cover;
		background-color: transparent;
		border: none;
		appearance: none;
		-webkit-appearance: none;
	}
</style>
