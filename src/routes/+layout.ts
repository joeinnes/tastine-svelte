import type { Meal, Recipe } from '../app';

import { db } from '$lib/db/db';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

type DetailedMeal = Meal & {
	expand: {
		meal: Recipe;
	};
};

export const load = (() => {
	try {
		return {
			meals: db.collection('meals').getFullList<DetailedMeal>({
				expand: 'meal'
			})
		};
	} catch {
		throw error(500, "Unable to fetch list of diets. It's us, not you.");
	}
}) satisfies LayoutLoad;
