import { db } from '$lib/db/db';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (() => {
  try {
    return {
      meals: db.collection('meals').getFullList({
        expand: "meal"
      })
    }
  } catch {
    throw error(500, 'Unable to fetch list of diets. It\'s us, not you.');
  }
}) satisfies LayoutServerLoad;
