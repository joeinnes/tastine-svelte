<script lang="ts">
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';

	import toast from 'svelte-french-toast';

	import { db } from '$lib/db/db';

	import type { PageData } from './$types';
	export let data: PageData;
	const { diets } = data;
	dayjs.extend(duration);

	interface Recipe {
		name: String;
		image: null | File;
		description: String;
		recipeInstructions: String;
		recipeYield: String;
		prepTime: String;
		cookTime: String;
		suitableForDiet: String[];
		author: String | null;
	}

	let recipe: Recipe = {
		name: '',
		image: null,
		description: '',
		recipeInstructions: '',
		recipeYield: '',
		prepTime: '',
		cookTime: '',
		suitableForDiet: [],
		author: db.authStore.model?.id ?? null
	};

	const handleSubmit = async () => {
		let errorCount = 0;
		const formData = new FormData();
		for (const [key, value] of Object.entries(recipe)) {
			if (value === undefined) {
				errors.push(key);
				errorCount++;
			} else {
				// Handle arrays (like the suitableForDiet array). https://github.com/pocketbase/pocketbase/issues/655#issuecomment-1259512353
				if (Array.isArray(value)) {
					for (const val of value) {
						formData.append(key, val);
					}
				} else {
					formData.append(key, value);
				}
			}
		}
		if (errorCount) {
			toast.error(`${errorCount} error${errorCount > 1 ? 's were' : 'was'} found.`);
			return;
		}

		toast.promise(db.collection('recipes').create(formData), {
			loading: 'Saving...',
			success: 'Recipe saved!',
			error: 'Could not save recipe.'
		});
	};

	let prep = 0;
	let cook = 0;
	let isHover = false;
	let preview: null | string = null;
	let errors: string[] = [];
	let img: FileList | null;

	$: {
		recipe.prepTime = dayjs.duration(prep, 'm').toISOString();
		recipe.cookTime = dayjs.duration(cook, 'm').toISOString();
		recipe.image = img?.length ? img[0] : null;
		preview = recipe.image && URL.createObjectURL(recipe.image);
	}
</script>

<div class="container">
	<article>
		<h1>New Recipe</h1>
		<form on:submit|preventDefault={handleSubmit}>
			<label for="name"
				>Name
				<input
					id="name"
					type="text"
					bind:value={recipe.name}
					required
					aria-invalid={errors.includes('name') || undefined}
				/>
			</label>
			<label
				for="image"
				class:is-hover={isHover}
				on:dragenter|preventDefault={() => (isHover = true)}
				on:dragover|preventDefault={() => (isHover = true)}
				on:dragstart|preventDefault={() => (isHover = true)}
				on:dragexit|preventDefault={() => (isHover = false)}
				on:dragleave|preventDefault={() => (isHover = false)}
				on:dragend|preventDefault={() => (isHover = false)}
				on:drop|preventDefault={(e) => {
					isHover = false;
					img = e.dataTransfer?.files ?? null;
				}}
			>
				Image
				<div class="grid">
					<div class="preview-container">
						{#if preview}<img src={preview} alt="Preview" />{:else}<svg
								width="25%"
								height="auto"
								viewBox="0 0 24 24"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								><title>pic_fill</title><g
									stroke="none"
									stroke-width="1"
									fill="none"
									fill-rule="evenodd"
									><g id="File" transform="translate(-912.000000, -48.000000)" fill-rule="nonzero"
										><g id="pic_fill" transform="translate(912.000000, 48.000000)"
											><path
												d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
												fill-rule="nonzero"
											/><path
												d="M20,3 C21.1046,3 22,3.89543 22,5 L22,19 C22,20.1046 21.1046,21 20,21 L4,21 C2.89543,21 2,20.1046 2,19 L2,5 C2,3.89543 2.89543,3 4,3 L20,3 Z M20,5 L4,5 L4,15.1005 L8.9948,10.1057 C9.48296,9.61757 10.2744,9.61757 10.7626,10.1057 L14.8284,14.1716 L16.0659,12.9342 C16.554,12.446 17.3455,12.446 17.8336,12.9342 L20,15.1005 L20,5 Z M15.5,7 C16.3284,7 17,7.67157 17,8.5 C17,9.32843 16.3284,10 15.5,10 C14.6716,10 14,9.32843 14,8.5 C14,7.67157 14.6716,7 15.5,7 Z"
												fill="currentColor"
											/></g
										></g
									></g
								></svg
							>{/if}
					</div>
					<div class="dropzone">
						<svg
							width="25%"
							height="auto"
							viewBox="0 0 24 24"
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							><title>upload_3_line</title><g
								stroke="none"
								stroke-width="1"
								fill="none"
								fill-rule="evenodd"
								><g transform="translate(-48.000000, -192.000000)"
									><g transform="translate(48.000000, 192.000000)"
										><path
											d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
											fill-rule="nonzero"
										/><path
											d="M11.5,4 C8.85134,4 6.73903,6.38087 7.02729,8.99923 C7.08294,9.50471 6.75509,9.9678 6.26851,10.0896 C4.96468,10.4159 4,11.5965 4,13 C4,14.6569 5.34315,16 7,16 L8,16 C8.55228,16 9,16.4477 9,17 C9,17.5523 8.55228,18 8,18 L7,18 C4.23858,18 2,15.7614 2,13 C2,10.9486 3.23468,9.18749 5.00053,8.41614 C5.04543,4.86494 7.93814,2 11.5,2 C14.2856,2 16.66,3.75154 17.5856,6.21198 C20.13,6.90766 22,9.23462 22,12 C22,15.3137 19.3137,18 16,18 C15.4477,18 15,17.5523 15,17 C15,16.4477 15.4477,16 16,16 C18.2091,16 20,14.2091 20,12 C20,10.0145 18.5524,8.36524 16.6552,8.05324 C16.2653,7.98913 15.9477,7.70323 15.8441,7.32051 C15.326,5.40663 13.576,4 11.5,4 Z M13.0000009,12.4162 L14.2934,13.7077 C14.6843,14.0979 15.3174,14.0974 15.7077,13.7066 C16.0979,13.3157 16.0974,12.6826 15.7066,12.2923 L12.8832,9.47341 C12.3952,8.98618 11.6048,8.98618 11.1168,9.47341 L8.29345,12.2923 C7.90262,12.6826 7.90212,13.3157 8.29234,13.7066 C8.68256,14.0974 9.31572,14.0979 9.70655,13.7077 L11.0000009,12.4162 L11.0000009,21 C11.0000009,21.5523 11.4477,22 12.0000009,22 C12.5523,22 13.0000009,21.5523 13.0000009,21 L13.0000009,12.4162 Z"
											fill="currentColor"
										/></g
									></g
								></g
							></svg
						>
						Click or drop file here
					</div>
				</div>
			</label>
			<input type="file" id="image" bind:files={img} style="display:none" />
			<label for="description"
				>Description
				<textarea
					id="description"
					bind:value={recipe.description}
					required
					aria-invalid={errors.includes('description') || undefined}
				/>
			</label>
			<label for="recipeInstructions"
				>Method
				<textarea
					id="recipeInstructions"
					bind:value={recipe.recipeInstructions}
					aria-invalid={errors.includes('recipeInstructions') || undefined}
					required
				/>
			</label>
			<div class="grid">
				<label for="recipeYield"
					>Yield
					<input
						id="recipeYield"
						type="text"
						bind:value={recipe.recipeYield}
						required
						placeholder="e.g. 1 slice/2 plates etc."
						aria-invalid={errors.includes('recipeYield') || undefined}
					/>
				</label>
				<label for="prepTime"
					>Prep Time (mins)
					<input
						id="prepTime"
						type="number"
						bind:value={prep}
						required
						aria-invalid={errors.includes('prepTime') || undefined}
					/>
				</label>
				<label for="cookTime"
					>Cook Time (mins)
					<input
						id="cookTime"
						type="number"
						bind:value={cook}
						required
						aria-invalid={errors.includes('cookTime') || undefined}
					/>
				</label>
			</div>

			<fieldset>
				<legend>Suitable for the following diets</legend>
				<div class="diets">
					{#each diets as diet}
						<label for={diet.enum}>
							<input
								type="checkbox"
								id={diet.id}
								bind:group={recipe.suitableForDiet}
								value={diet.id}
							/>
							{diet.name}
						</label>
					{/each}
				</div>
			</fieldset>
			<button type="submit">Save</button>
		</form>
	</article>
</div>

<style>
	.diets {
		display: grid;
		grid-template-columns: 1fr;
	}

	.preview-container img {
		object-fit: cover;
		width: 100%;
	}
	.is-hover .dropzone {
		background-color: var(--secondary-hover);
		color: var(--secondary-inverse);
		outline-color: var(--secondary-inverse);
	}
	.preview-container,
	.dropzone {
		border-radius: var(--border-radius);
		color: var(--secondary);
		background-color: var(--secondary-focus);
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: var(--spacing);
		overflow: hidden;
		aspect-ratio: 21/9;
	}

	.dropzone {
		padding: var(--block-spacing-vertical) var(--block-spacing-horizontal);
		outline-style: dashed;
		outline-color: var(--secondary);
		outline-offset: calc(-2 * var(--border-radius));
		transition: color var(--transition), background-color var(--transition);
		display: flex;
		flex-direction: column;
	}

	@media (min-width: 600px) {
		.diets {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 900px) {
		.diets {
			grid-template-columns: 1fr 1fr 1fr 1fr;
		}
	}
</style>
