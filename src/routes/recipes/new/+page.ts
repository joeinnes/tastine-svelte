import type { Diet, Ingredient } from '../../../app';
import { db } from '$lib/db/db';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (() => {
	try {
		return {
			diets: db.collection('diets').getFullList<Diet>(),
			ingredients: db.collection('ingredients').getFullList<Ingredient>({ sort: 'name' })
		};
	} catch {
		throw error(500, "Unable to fetch list of diets. It's us, not you.");
	}
}) satisfies PageLoad;
