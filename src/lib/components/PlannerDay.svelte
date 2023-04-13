<script lang="ts">
	import PlannerMeal from './PlannerMeal.svelte';

	import type { Day, Meal } from '../../app';

	export let day: Day;

	function getDailyMeals(arr: Meal[] | undefined) {
		let newArr = arr?.slice(0, 7) || [];
		newArr.length = 7;
		return newArr;
	}
</script>

<div class="day">
	<hgroup>
		<h2>{day.date.format('ddd')}</h2>
		<small>{day.date.format('DD MMM')}</small>
	</hgroup>
	{#each getDailyMeals(day.meals) as meal, i}
		<PlannerMeal {meal} {day} {i} />
	{/each}
</div>

<style lang="scss">
	.day {
		overflow: hidden;
		user-select: none;
		h2 {
			font-size: larger;
		}
		small {
			color: var(--color-yellow-3);
		}
	}
</style>
