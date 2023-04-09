<script lang="ts">
	import PlannerMeal from './PlannerMeal.svelte';

	import type dayjs from 'dayjs';

	export let day: Day;

	interface Day {
		date: dayjs.Dayjs;
		meals: Meal[] | undefined;
	}

	interface Meal {
		id: string;
		expand: {
			meal: {
				name: string;
				id: string;
			};
		};
		date: Date;
		sort: number;
	}

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
		h2 {
			font-size: larger;
		}
		small {
			color: var(--color-yellow-3);
		}
	}
</style>
