import type { Meal } from '../../app';
import { writable } from "svelte/store";

const mealMap = writable(new Map<string, Meal[]>());
export default mealMap; 