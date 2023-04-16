import type { Control, Meal, Recipe, RecipeIngredient } from '../app';

import { db } from '$lib/db/db';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

type DetailedMeal = Meal & {
	expand: {
		meal: Recipe & {
			expand: {
				'recipe_ingredients(recipe)': RecipeIngredient[]
			};
		};
	}
};

export const load = (() => {
	try {
		let meals = db.collection('meals').getFullList<DetailedMeal>(undefined, {
			expand: 'meal,meal.recipe_ingredients(recipe).ingredient'
		});
		let controls = db.collection('controls').getFullList<Control>();
		return {
			meals
		};
	} catch {
		throw error(500, "Unable to load data. It's us, not you.");
	}
}) satisfies LayoutLoad;
