<script lang="ts">
	import type { DragData, Recipe } from '../../app';
	import { db } from '$lib/db/db';
	export let recipe: Recipe;

	const handleDragStart = (e: DragEvent, data: DragData) => {
		const str = JSON.stringify(data);
		e.dataTransfer?.setData('text/plain', str);
	};
</script>

{#if recipe}
	<article draggable="true" on:dragstart={(e) => handleDragStart(e, { id: '-1', meal: recipe.id })}>
		<div class="image-holder">
			<img src={db.getFileUrl(recipe, recipe.image)} alt={recipe.name} />
		</div>
		<div class="text-holder">
			<h2>{recipe.name}</h2>
			<div class="desc-and-instr">
				{#if recipe.description.length > 200}
					{@html recipe.description.replace(/<\/?[^>]+(>|$)/g, '')}
				{:else if recipe.description}
					{@html (recipe.description + ' ' + recipe.recipeInstructions).replace(
						/<\/?[^>]+(>|$)/g,
						''
					)}
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
		margin-bottom: 0;
		line-height: 1.2;
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
		margin-bottom: var(--typography-spacing-vertical);
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
