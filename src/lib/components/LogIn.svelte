<script>
  import { db} from '$lib/db/db';
  let username = '';
  let password = '';

  const handleLogin = async () => {
    try {
      await db.collection('users').authWithPassword(username, password)
    } catch (e) {
      alert("Failed login");
    }
  }
</script>

<form class="container" on:submit={handleLogin}>
<h1 class="text-3xl mb-2 font-bold">Log In</h1>
<label>
Username
<input type="text" bind:value={username} />
</label>
<label>Password
<input type="password" bind:value={password} />
</label>
<button>Submit</button>
</form>

<style>
  .container {
    background-color: var(--color-orange-1);
    @apply w-full max-w-prose shadow rounded p-3;
  }
  button {
    background-color: var(--color-orange-4);
    color: var(--color-orange-1);
    @apply px-2 py-1 rounded transition-colors mt-2;
  }
  button:hover {
    background-color: var(--color-orange-5);
  }
  input {
    background-color: var(--color-orange-1);
    border: 1px solid var(--color-orange-6);
    outline-color: var(--color-orange-4);
    @apply px-2 py-1 rounded block w-full;
  }
</style>
