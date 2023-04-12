<script lang="ts">
	import type { Ingredient } from '../../app';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let open = false;
	type NewIngredient = Omit<Ingredient, 'id'>;
	let ingredient: NewIngredient = {
		name: '',
		defaultUnit: '',
		defaultQty: 0,
		defaultUnitPlural: ''
	};

	const handleSubmit = async () => {
		console.log(ingredient);
	};

	const handleClose = () => dispatch('close');
</script>

<dialog {open}>
	<form on:submit|preventDefault|stopPropagation={handleSubmit}>
		<article>
			<h3>New Ingredient</h3>
			<label>
				Name
				<input type="text" placeholder="cheese" bind:value={ingredient.name} />
			</label>
			<label>
				Default Quantity
				<input type="number" placeholder="1" bind:value={ingredient.defaultQty} />
			</label>
			<div class="grid">
				<label>
					Default Unit
					<input type="text" placeholder="slice" bind:value={ingredient.defaultUnit} />
				</label>

				<label>
					Default Unit Plural
					<input type="text" placeholder="slices" bind:value={ingredient.defaultUnitPlural} />
				</label>
			</div>

			<footer>
				<button type="reset" on:click={handleClose} class="secondary outline">Cancel</button>
				<button type="submit">Save</button>
			</footer>
		</article>
	</form>
</dialog>
