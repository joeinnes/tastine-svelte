<script lang="ts">
  import RecipeCard from '$lib/components/RecipeCard.svelte';
  export let recipes = [];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
{#each recipes as recipe}
  <RecipeCard {recipe} />
{:else}
  No recipes
{/each}
</div>