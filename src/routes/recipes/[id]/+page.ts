import { db } from '$lib/db/db';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Diet, Recipe, RecipeIngredient, User } from '../../../app';

type DetailedRecipe = Recipe & {
	expand: {
		author: User;
		'recipe_ingredients(recipe)': RecipeIngredient[];
		suitableForDiet: Diet | Diet[];
	};
	created: string;
};

export const load = (({ params }) => {
	try {
		if (params.id) {
			return {
				recipe: db.collection('recipes').getOne<DetailedRecipe>(params.id, {
					expand:
						'suitableForDiet,author,recipe_ingredients(recipe),recipe_ingredients(recipe).ingredient,recipe_ingredients(recipe).ingredient.satisfiesControls'
				})
			};
		}
		throw error(404, 'Not found');
	} catch {
		throw error(404, 'Not found');
	}
}) satisfies PageLoad;
