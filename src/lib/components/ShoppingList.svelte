<script lang="ts">
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';

	import type { Control, RecipeIngredient } from '../../app';
	import mealMap from '$lib/stores/MealMap';
	import dayjs from 'dayjs';

	let startDate = dayjs();
	let endDate = dayjs().add(7, 'days');
	let ingredients: Map<string, Map<string, number>> = new Map();
	let tab: 'list' | 'controls' = 'list';
	let display = false;

	let controls: Control[] = $page.data.controls;

	$: {
		let i = 0;
		let currentDate = startDate.clone();
		while (i < 100 && $mealMap && currentDate.isBefore(endDate)) {
			if (i === 99) alert('problem!');
			let dateString = currentDate.format('YYYYMMDD');
			let meals = $mealMap.get(dateString);
			meals?.forEach((meal) => {
				meal?.expand?.meal?.expand['recipe_ingredients(recipe)']?.forEach(
					(ingredient: RecipeIngredient) => {
						const ingredientName = ingredient?.expand?.ingredient?.name;
						if (!ingredientName) return;
						if (ingredients.has(ingredientName)) {
							const currentQty = ingredients.get(ingredientName);
							if (currentQty && ingredient?.unit) {
								let newQty = (currentQty.get(ingredient.unit) ?? 0) + ingredient.quantity;
								currentQty.set(ingredient.unit, newQty);
							}
						} else {
							const thisQty = new Map();
							thisQty.set(ingredient.unit, ingredient.quantity);
							ingredients.set(ingredientName, thisQty);
						}
					}
				);
			});
			/*const thisMeal = meal.expand['recipe_ingredients(recipe)'].expand.ingredient.name
      ingredients.set(meal.expand['recipe_ingredients(recipe)'].expand.ingredient.name, )*/
			currentDate = currentDate.add(1, 'day');
			i++;
		}
	}
	const getTooltip = (ingredientPart: Map<string, number>) => {
		let string = '';
		for (const [k, v] of ingredientPart) {
			string += `${v} ${k}, `;
		}
		return string.substring(0, string.length - 2);
	};
</script>

<aside style="transform: translateY(-50%) {display ? '' : 'translateX(100%)'}">
	<div class="control">
		<!-- svelte-ignore a11y-no-redundant-roles -->
		<button on:click={() => (display = !display)} class="control" class:display role="button">
			<div>➜</div>
			<div>➜</div>
			<div>➜</div></button
		>
	</div>
	<div class="content-container">
		<h3>Shopping List</h3>

		<!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
		<nav class="tablist">
			<button role="tab" class:active={tab === 'list'} on:click={() => (tab = 'list')}>
				List
			</button>
			<button role="tab" class:active={tab === 'controls'} on:click={() => (tab = 'controls')}>
				Controls
			</button>
		</nav>
		{#if tab === 'list'}
			<div in:fly={{ x: 200, duration: 200, delay: 200 }} out:fly={{ x: 200, duration: 200 }}>
				{#each [...ingredients.entries()] as ingredient}
					<label for="ingredient" data-placement="left" data-tooltip={getTooltip(ingredient[1])}
						><input type="checkbox" id="ingredient" />{ingredient[0]}</label
					>
				{/each}
			</div>
		{:else}
			<div in:fly={{ x: 200, duration: 200, delay: 200 }} out:fly={{ x: 200, duration: 200 }}>
				Controls here
			</div>
		{/if}
	</div>
</aside>

<style>
	.content-container {
		padding: var(--spacing);
	}
	aside {
		position: fixed;
		right: 0;
		transition: transform var(--transition);
		width: 25ch;
		height: 80vh;
		top: 50%;
		background: radial-gradient(var(--color-yellow-2) 1px, var(--color-yellow-1) 1px) 0 0 / 40px
			40px;
		color: var(--color-yellow-5);
		border-radius: var(--border-radius) 0 0 var(--border-radius);
		text-align: left;
		box-sizing: border-box;
	}
	label {
		border-bottom: none;
		cursor: initial;
		user-select: none;
	}
	h3 {
		margin-bottom: calc(0.25 * var(--spacing));
	}

	nav.tablist {
		display: flex;
		justify-content: space-around;
		user-select: none;
		border-bottom: 1px solid var(--muted-border-color);
		margin-bottom: calc(0.55 * var(--spacing));
	}
	button[role='tab'] {
		background: none;
		display: inline-block;
		color: var(--form-element-disabled-border-color);
		border: 0px;
		border-bottom: 1px solid transparent;
		transition: all var(--transition);
		text-align: center;
		user-select: none;
		width: 100%;
		padding: 0;
		margin: 0;
	}

	button[role='tab'].active,
	button[role='tab']:hover {
		color: var(--contrast);
		border-radius: 0;
		border-bottom: 1px solid var(--contrast);
		outline: none;
	}
	button[role='tab']:focus {
		background: transparent;
		box-shadow: none;
	}

	.control {
		position: absolute;
		top: 50%;
		transform: translateX(-100%) translateY(-50%);
		border-radius: var(--border-radius) 0 0 var(--border-radius);
	}
	.control div {
		transform: rotate(180deg);
		display: inline-block;
		transition: transform var(--transition);
	}
	.control.display div {
		transform: rotate(0deg);
	}

	button.control {
		border: none;
		background-color: var(--color-yellow-1);
		color: var(--color-yellow-5);
		display: inline-block;
		width: auto;
		cursor: pointer;
		user-select: none;
		box-sizing: border-box;
		outline: none;
		&:focus {
			box-shadow: none;
		}
	}

	.control {
		& button,
		[role='button'] {
			padding: calc(0.5 * var(--spacing));
		}
	}
</style>
