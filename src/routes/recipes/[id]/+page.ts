import { db } from '$lib/db/db';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (({ params }) => {
	try {
		if (params.id) {
			return {
				recipe: db.collection('recipes').getOne(params.id, {
					expand: 'suitableForDiet,author'
				})
			};
		}
		throw error(404, 'Not found');
	} catch {
		throw error(404, 'Not found');
	}
}) satisfies PageLoad;
