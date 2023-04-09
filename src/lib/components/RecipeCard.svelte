<script lang="ts">
	import { db } from '$lib/db/db';
	export let recipe;
</script>

{#if recipe}
	<article>
		<div class="image-holder">
			<img src={db.getFileUrl(recipe, recipe.image)} alt={recipe.name} />
		</div>
		<div class="text-holder">
			<h2>{recipe.name}</h2>
			<div class="desc-and-instr">
				{#if recipe.description.length > 200}
					{@html recipe.description.replace(/<\/?[^>]+(>|$)/g, '')}
				{:else if recipe.description}
					{@html recipe.description.replace(/<\/?[^>]+(>|$)/g, '')}
					{@html recipe.recipeInstructions.replace(/<\/?[^>]+(>|$)/g, '')}
				{:else}
					{@html recipe.recipeInstructions.replace(/<\/?[^>]+(>|$)/g, '')}
				{/if}
			</div>
			<a href="recipes/{recipe.id}" role="button">Check out this recipe!</a>
		</div>
	</article>
{/if}

<style>
	article {
		display: grid;
		grid-template-columns: 1fr;
		overflow: hidden;
		padding: 0;
		border-radius: var(--border-radius);
		--typography-spacing-vertical: 0.2em;
	}

	article h2 {
		--typography-spacing-vertical: 0.5em;
		line-height: normal;
	}

	article img {
		object-fit: cover;
		height: 100%;
		width: 100%;
	}

	.image-holder {
		border-bottom: 0.25rem solid var(--primary);
	}

	.text-holder {
		padding: var(--spacing);
	}

	.desc-and-instr {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		padding-bottom: var(--spacing);
	}

	@media (min-width: 600px) {
		article {
			grid-template-columns: 1fr 1fr;
		}
		.image-holder {
			border-right: 0.25rem solid var(--primary);
			border-bottom: none;
		}
	}
</style>
