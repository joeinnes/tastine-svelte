<script lang="ts">
import {db} from '$lib/db/db';
export let recipe;
</script>
<article>
<div class="image-holder">
<img src={db.getFileUrl(recipe, recipe.image)} alt={recipe.name} />
</div>
<div class="text-holder">
<h2 class="font-bold text-xl">{recipe.name}</h2>
<div class="desc-and-instr line-clamp-4 flex-1">
{@html recipe.recipeInstructions}
</div>
<button>Check out this recipe!</button>
</div>
</article>

<style>
 article {
   @apply grid grid-cols-2 h-48 overflow-hidden rounded shadow;
 }

 article img {
   @apply object-cover w-full h-full;
 }

 .image-holder {
   border-color: var(--color-orange-4);
   @apply h-full w-full relative border-r-4;
 }
 .text-holder {
   @apply p-2 flex flex-col items-start;
 }

 .button {

 }
</style>