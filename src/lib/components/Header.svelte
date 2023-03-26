<script lang="ts">
  import { db } from '$lib/db/db';
  const logOut = db.authStore?.clear();
</script>

<header>
  <a href="/" class="logo">🥘 Tastine</a>

  <button on:click={() => logOut}>Log Out</button>
  
</header>

<style>
  header {
    background-color: var(--color-gray-1);
    border-color: var(--color-orange-3);
    @apply border-b-2 px-2 py-4;
  }

  .logo {
    background-color: var(--color-orange-4);
    color: var(--color-orange-1);
    font-family: 'Megrim';
    @apply p-2 rounded text-2xl;
  }
</style>