import { db } from '$lib/db/db';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (() => {
  try {
    return {
      diets: db.collection('diets').getFullList()
    }
  } catch {
    throw error(500, 'Unable to fetch list of diets. It\'s us, not you.');
  }
}) satisfies PageLoad;
