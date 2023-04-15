<script lang="ts">
	import type { RecipeIngredient } from '../../app';
	import mealMap from '$lib/stores/MealMap';
	import dayjs from 'dayjs';

	let startDate = dayjs();
	let endDate = dayjs().add(7, 'days');
	let ingredients: Map<string, Map<string, number>> = new Map();

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

<aside>
	{#each [...ingredients.entries()] as ingredient}
		<label for="ingredient" data-tooltip={getTooltip(ingredient[1])}
			><input type="checkbox" id="ingredient" />{ingredient[0]}</label
		>
	{/each}
</aside>

<style>
	aside {
		margin-top: 5rem;
	}
	label {
		border-bottom: none;
		cursor: initial;
		user-select: none;
	}
</style>
