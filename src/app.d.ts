// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export interface Meal {
	id: string;
	expand?: {
		meal: {
			name: string;
			id: string;
			expand?: any;
		};
	};
	meal: string;
	date: Date;
	sort: number;
}

export interface Day {
	date: dayjs.Dayjs;
	meals: Meal[] | undefined;
}

export interface DragData {
	id: string;
	meal: string;
}

export interface Recipe {
	id: string;
	name: string;
	image: null | file;
	description: string;
	recipeInstructions: string;
	recipeYield: string;
	prepTime: string;
	cookTime: string;
	suitableForDiet: string[];
	author: string | null;
	collectionId: string;
	collectionName: string;
}

export interface RecipeIngredient {
	id: string;
	recipe: string;
	ingredient: string;
	unit: string;
	quantity: number;
	expand?: {
		recipe: Recipe;
		ingredient: Ingredient;
	};
}

export interface Ingredient {
	id: string;
	name: string;
	defaultUnit: string;
	defaultUnitPlural: string;
	defaultQty: number;
}

export interface User {
	id: string;
	collectionId: string;
	collectionName: string;
	name: string;
	avatar: string;
}

export interface Diet {
	id: string;
	name: string;
	enum: string;
	hue: number;
}
