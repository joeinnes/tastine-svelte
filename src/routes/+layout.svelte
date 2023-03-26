<script>
	import './app.css';
	import '/node_modules/reasonable-colors/reasonable-colors.css';
	import { db } from '$lib/db/db';
	import LogIn from '$lib/components/LogIn.svelte'

	let isLoggedIn = null;
	isLoggedIn = db.authStore.isValid;
	db.authStore.onChange(() => {
		isLoggedIn = pb.authStore.isValid;
	})
	// I won't bother using a special Log In route, it's not needed.
</script>
{#if isLoggedIn === null}
	Loading...
{:else if isLoggedIn}
	Logged In
	<slot />
{:else}
	<LogIn />
{/if}

<style>
:global(body) {
	background-color: var(--color-gray-1);
}
</style>