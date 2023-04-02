<script lang="ts">
	import { db } from '$lib/db/db';
	const logOut = () => db.authStore?.clear();
</script>

<nav>
	<ul>
		<li><a href="/" role="button">🥘 Tastine</a></li>
	</ul>
	<ul>
		<li><button on:click={logOut}>Log Out</button></li>
	</ul>
</nav>

<style>
	nav {
		padding: 0rem 0.5rem;
		border-bottom: 0.25rem solid var(--color-orange-3);
	}

	a {
		font-family: 'Megrim';
		padding: 0.5rem;
		font-size: xx-large;
		white-space: nowrap;
	}
</style>
