<script lang="ts">
	//	import '/node_modules/@picocss/pico/css/pico.css';

	import '/node_modules/reasonable-colors/reasonable-colors.css';
	import { Toaster } from 'svelte-french-toast';

	import './app.scss';
	import { db } from '$lib/db/db';

	import Header from '$lib/components/Header.svelte';
	import Planner from '$lib/components/Planner.svelte';
	import LogIn from '$lib/components/LogIn.svelte';

	let isLoggedIn: null | Boolean = null;
	isLoggedIn = db.authStore.isValid;
	db.authStore.onChange((token, model) => {
		isLoggedIn = db.authStore.isValid;
	}, true);
	// I won't bother using a special Log In route, it's not needed.
</script>

{#if isLoggedIn}
	<Planner />
{/if}

<svelte:head><title>Tastine</title></svelte:head>
<header>
	<Header />
</header>
<main>
	{#if isLoggedIn === null}
		Loading...
	{:else if isLoggedIn}
		<slot />
	{:else}
		<LogIn />
	{/if}
</main>
<footer />
<Toaster />
