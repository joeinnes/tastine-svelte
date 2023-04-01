<script lang="ts">
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	export let recipes = [];
</script>

<div class="recipe-grid container-fluid">
	{#each recipes as recipe}
		<RecipeCard {recipe} />
	{:else}
		No recipes
	{/each}
</div>

<style>
	.recipe-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		padding: 0rem 2rem;
	}
</style>
