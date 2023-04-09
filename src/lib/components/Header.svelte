<script lang="ts">
	import { db } from '$lib/db/db';
	const logOut = () => db.authStore?.clear();
</script>

<nav>
	<ul>
		<li><a href="/" role="button">🥘 Tastine</a></li>
	</ul>
	<ul>
		<li>
			{#if db.authStore.isValid}<button on:click={logOut}>Log Out</button>{/if}
		</li>
	</ul>
</nav>

<style>
	nav {
		padding: 0rem 0.5rem;
		border-bottom: 0.25rem solid var(--primary-hover);
		background-color: var(--primary-focus);
	}

	a {
		font-family: 'Megrim';
		font-size: xx-large;
		white-space: nowrap;
	}
</style>
