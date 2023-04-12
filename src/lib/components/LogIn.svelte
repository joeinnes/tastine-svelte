<script>
	import { db } from '$lib/db/db';
	let username = '';
	let password = '';

	const handleLogin = async () => {
		try {
			await db.collection('users').authWithPassword(username, password);
		} catch (e) {
			alert('Failed login');
		}
	};
</script>

<form class="container" on:submit={handleLogin}>
	<h1>Log In</h1>
	<label>
		Username
		<input type="text" bind:value={username} />
	</label>
	<label
		>Password
		<input type="password" bind:value={password} />
	</label>
	<button>Submit</button>
</form>
