<script lang="ts">
	import type { Recipe } from '../../app';
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	export let recipes: Recipe[];
</script>

<div class="recipe-grid container-fluid">
	{#each recipes as recipe}
		<RecipeCard {recipe} />
	{:else}
		No recipes
	{/each}
	<div class="add-new">
		<a href="/recipes/new" role="button">&plus; New recipe</a>
	</div>
</div>

<style>
	.recipe-grid {
		display: grid;
		grid-template-columns: 1fr;
		padding: 0rem 0.5rem;
	}

	.add-new {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	@media (min-width: 600px) {
		.recipe-grid {
			grid-template-columns: 1fr 1fr;
			padding: 0rem 1rem;
		}
	}

	@media (min-width: 900px) {
		.recipe-grid {
			grid-template-columns: 1fr 1fr 1fr;
			padding: 0rem 2rem;
		}
	}
</style>
