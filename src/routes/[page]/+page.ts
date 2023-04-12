import { db } from '$lib/db/db';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Recipe } from '../../app';

const perPage = 9;

export const load = (({ params }) => {
	try {
		if (params.page) {
			const currPage = parseInt(params.page, 10);
			return {
				query: db.collection('recipes').getList<Recipe>(currPage, perPage)
			};
		} else {
			throw error(404, 'Not found');
		}
	} catch {
		throw error(404, 'Not found');
	}
}) satisfies PageLoad;
