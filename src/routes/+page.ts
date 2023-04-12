import type { Recipe } from '../app';

import { db } from '$lib/db/db';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

const currPage = 1;
const perPage = 9;

export const load = (() => {
	try {
		return {
			query: db.collection('recipes').getList<Recipe>(currPage, perPage)
		};
	} catch {
		throw error(404, 'Not found');
	}
}) satisfies PageLoad;
