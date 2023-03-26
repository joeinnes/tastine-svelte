<script lang="ts">
  interface Recipe {
    id: string;
    name: string;
    description: string;
    recipeInstructions: string;
  }

  import { db } from '$lib/db/db';
  import RecipeList from '$lib/components/RecipeList.svelte';

  let recipes = [];
  let currPage = 1;
  let totalItems = 0;
  let totalPages = 0;
  const perPage = 9;
  const getRecipes = async (currPage) => {
    const resultList = await db.collection('recipes').getList<Recipe>(currPage, perPage);
    recipes = resultList.items;
    totalItems = resultList.totalItems;
    totalPages = resultList.totalPages;
  }
  getRecipes(currPage);
</script>

<RecipeList {recipes} />