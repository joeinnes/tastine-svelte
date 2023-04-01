<script lang="ts">
	import { db } from '$lib/db/db';
	export let recipe;
</script>

<article>
	<div class="image-holder">
		<img src={db.getFileUrl(recipe, recipe.image)} alt={recipe.name} />
	</div>
	<div class="text-holder">
		<h2>{recipe.name}</h2>
		<div class="desc-and-instr">
			{@html recipe.recipeInstructions}
		</div>
		<button>Check out this recipe!</button>
	</div>
</article>

<style>
	article {
		display: grid;
		grid-template-columns: 1fr 1fr;
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
		border-right: 0.25rem solid var(--color-orange-3);
	}

	.text-holder {
		padding: var(--block-spacing-vertical) var(--block-spacing-horizontal);
	}

	.desc-and-instr {
		-webkit-line-clamp: 2;
	}

	button {
		margin: 0;
		margin-top: 1rem;
	}
</style>
