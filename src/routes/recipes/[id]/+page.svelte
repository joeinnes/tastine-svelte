<script lang="ts">
	import { db } from '$lib/db/db';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);

	import type { PageData } from './$types';
	export let data: PageData;
	const recipe = data.recipe;
</script>

<div class="container">
	<article>
		<img src={db.getFileUrl(recipe, recipe.image)} alt={recipe.name} class="featured-image" />

		<div class="text-content">
			<div class="recipe-header">
				<hgroup class="header">
					<h1>{recipe.name}</h1>

					{@html recipe.description}
				</hgroup>
				{#if !Array.isArray(recipe.expand.author)}
					{@const avatar = db.getFileUrl(recipe.expand.author, recipe.expand.author.avatar)}
					<hgroup>
						<div class="author">
							<img src={avatar} alt={recipe.expand.author.name} class="avatar" />
							{recipe.expand.author.name}
						</div>
						<small>{dayjs().to(dayjs(recipe.created))}</small>
					</hgroup>
				{/if}
			</div>

			{@html recipe.recipeInstructions}

			{#if Array.isArray(recipe.expand.suitableForDiet)}
				{#each recipe.expand.suitableForDiet as diet}
					<span
						class="chip"
						style="background-color: hsl({diet.hue} 100% 85%); color: hsl({diet.hue} 100% 15%)"
					>
						#{diet.name.toLowerCase()}
					</span>
				{/each}
			{:else}
				<span style="background-color: hsl({recipe.expand.suitableForDiet.hue} 100% 80%)">
					#{recipe.expand.suitableForDiet.name}
				</span>
			{/if}
		</div>
	</article>
</div>

<style>
	article {
		padding: 0;
		overflow: hidden;
	}

	.featured-image {
		object-fit: cover;
		width: 100%;
		aspect-ratio: 21/9;
		border-bottom: 0.25rem solid var(--primary);
	}

	.text-content {
		padding: var(--block-spacing-horizontal) var(--block-spacing-vertical);
	}

	.chip {
		margin-right: 0.5rem;
		border-radius: 100rem;
		padding: 0.25rem 0.5rem;
	}

	.recipe-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.avatar {
		border-radius: 100%;
		aspect-ratio: 1/1;
		height: 2rem;
	}
</style>
