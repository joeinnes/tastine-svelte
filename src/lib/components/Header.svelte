<script lang="ts">
	import { db } from '$lib/db/db';
	const logOut = () => db.authStore?.clear();
</script>

<header>
	<a href="/" class="logo">🥘 Tastine</a>

	<button on:click={logOut}>Log Out</button>
</header>

<style>
	button {
		margin-bottom: 0;
		width: auto;
	}
	header {
		background-color: var(--color-gray-1);
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 0.5rem;
		border-bottom: 0.25rem solid var(--color-orange-3);
	}

	.logo {
		background-color: var(--color-orange-4);
		color: var(--color-orange-1);
		font-family: 'Megrim';
		padding: 0.5rem;
		border-radius: var(--border-radius);
		font-size: xx-large;
		white-space: nowrap;
		line-height: 1em;
	}

	.logo:hover {
		text-decoration: none;
		background-color: var(--color-orange-3);
	}
</style>
