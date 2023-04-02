<script lang="ts">
	import RecipeList from '$lib/components/RecipeList.svelte';

	import type { PageData } from './$types';
	export let data: PageData;
	const recipes = data.query.items;
</script>

<RecipeList {recipes} />
