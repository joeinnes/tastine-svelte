<script>
	import '/node_modules/@picocss/pico/css/pico.css';
	import '/node_modules/reasonable-colors/reasonable-colors.css';
	import './app.css';
	import { db } from '$lib/db/db';
	import Header from '$lib/components/Header.svelte';
	import LogIn from '$lib/components/LogIn.svelte';

	let isLoggedIn = null;
	isLoggedIn = db.authStore.isValid;
	db.authStore.onChange((token, model) => {
		console.log(token, model, db.authStore.isValid);
		isLoggedIn = db.authStore.isValid;
	}, true);
	// I won't bother using a special Log In route, it's not needed.
</script>

<div class="page-container">
	<Header />
	<main>
		{#if isLoggedIn === null}
			Loading...
		{:else if isLoggedIn}
			<slot />
		{:else}
			<LogIn />
		{/if}
	</main>
</div>

<style>
	:global(body) {
		background-color: var(--color-gray-1);
		min-height: 100vh;
	}

	.page-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		/* @apply min-h-screen flex flex-col; */
	}

	main {
		flex-basis: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
