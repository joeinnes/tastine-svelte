<script>
  let username = '';
  let password = '';
</script>

<div class="container">
<label>
Username
<input type="text" />
</label>
<label>Password
<input type="password" />
</label>
</div>

<button>Submit</button>

<style>
  .container {
    @apply w-prose shadow rounded;
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
    @apply px-2 py-1 rounded block w-full;
  }
</style>
