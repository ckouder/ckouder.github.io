<script lang="ts">
	import TextView from '../../TextView.svelte';
	import Window from '../../Window.svelte';
</script>

<Window
	config={{ x: 100, y: 100, z: 0, width: 260, height: 400 }}
	on:ready
	on:destroy
	noResize
	blur
>
	<TextView slot="content">
		<h3>About</h3>
		<p>This project attempts to create a mock MacOS UI using svelte kit.</p>
		<hr />
		<h3>Progress</h3>
		<ul>
			<li>
				<s>Window</s>
				<ul>
					<s><li>Full screen</li></s>
					<s><li>Close</li></s>
					<s><li>Minimize</li></s>
					<s><li>Resize</li></s>
				</ul>
			</li>
			<li>
				Apps
				<ul>
					<li>Finder</li>
					<li>Chess</li>
				</ul>
			</li>
			<li>
				Dock
				<ul>
					<s><li>UI</li></s>
					<li>Tooltip</li>
					<s><li>Open App</li></s>
				</ul>
			</li>
			<li>
				Toolbar
				<ul>
					<s><li>UI</li></s>
					<s><li>Time</li></s>
					<li>Control Center</li>
					<li>Notification Center</li>
				</ul>
			</li>
		</ul>
		<hr />
		<h3>Contact</h3>
		<p><a href="mailto:bingjiguo@icloud.com">Email</a></p>
		<p><a href="https://github.com/ckouder">Github</a></p>
		<p><a href="https://linkedin.com/in/bingji-guo">Linkedin</a></p>
		<hr />
		<h3>Legal Disclaimer</h3>
		<p>
			The website <a href="https://ckouder.github.io" target="_blank" rel="noreferrer"
				>ckouder.github.io</a
			>
			("the Website") is a non-commercial, fan-created project intended for entertainment and educational
			purposes only. It is not affiliated with, endorsed by, or sponsored by Apple Inc. or any of its
			subsidiaries or affiliates. The MacOS name, logo, and related trademarks are the exclusive property
			of Apple Inc.
			<br /><br />
			All art assets, images, icons, and other visual elements displayed on the Website are either original
			creations, used under a license, or are reproduced under the fair use doctrine. The use of these
			assets is not intended to infringe upon the rights of the respective copyright owners. The purpose
			of using these art assets is solely to create a parody or a transformative work that pays homage
			to MacOS Ventura and does not seek to compete with or undermine the original product.
			<br /><br />
			If you are a copyright holder and believe that any art asset, image, or visual element used on
			the Website infringes upon your rights, please contact us at [bingjiguo@icloud.com]. Upon receiving
			a valid and complete notice of claimed infringement, we will promptly remove the concerned material
			and take appropriate action in accordance with applicable laws.
			<br /><br />
			By using or accessing the Website, you agree to acknowledge and respect the intellectual property
			rights of the original creators and owners. You also agree not to use any art asset, image, or
			visual element displayed on the Website for any commercial purpose or in a manner that could infringe
			upon the rights of the copyright owners.
			<br /><br />
			Please note that the Website and its content are provided "as is" without any warranties, express
			or implied, including, but not limited to, the implied warranties of merchantability, fitness for
			a particular purpose, or non-infringement. The creator(s) and administrator(s) of the Website shall
			not be held liable for any damages, losses, or expenses arising out of or in connection with the
			use of the Website or its content.
		</p>
	</TextView>
</Window>

<style lang="scss">
	hr {
		margin: 10px 0;
	}

	p,
	li {
		font-size: 12px;
	}

	li {
		margin-left: 20px;
	}
</style>
