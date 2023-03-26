<script>
	import './app.css';
	import '/node_modules/reasonable-colors/reasonable-colors.css';
	import { db } from '$lib/db/db';
	import Header from '$lib/components/Header.svelte'
	import LogIn from '$lib/components/LogIn.svelte'

	let isLoggedIn = null;
	isLoggedIn = db.authStore.isValid;
	db.authStore.onChange((token, model) => {
		console.log(token, model, db.authStore.isValid)
		isLoggedIn = db.authStore.isValid;
	}, true)
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
	@apply min-h-screen;
}

.page-container {
	@apply min-h-screen flex flex-col;
}

main {
	@apply p-2 flex-1 flex flex-col justify-center;
}
</style>