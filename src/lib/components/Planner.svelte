<script lang="ts">
	import { onMount } from 'svelte';
	import PlannerDay from './PlannerDay.svelte';
	import { page } from '$app/stores';

	import dayjs from 'dayjs';
	import { db } from '$lib/db/db';

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
	interface Day {
		date: dayjs.Dayjs;
		meals: Meal[] | undefined;
	}

	let startDate = dayjs().subtract(1, 'day');

	let days: Day[] = [];
	let mealMap = new Map<string, Meal[]>();
	let mealList: Meal[] = $page.data.meals;

	let displayPlanner = false;

	const updateMealMap = () => {
		mealMap.clear();
		mealList.forEach((meal) => {
			let key = dayjs(meal.date).format('YYYYMMDD');
			let oldVal = mealMap.get(key);
			let newVal = [meal];
			if (oldVal) {
				newVal = [...oldVal, meal];
			}
			mealMap.set(key, newVal);
		});
		days = [];
		for (let i = 0; i < 7; i++) {
			const thisDate = startDate.add(i, 'day');
			days.push({
				date: thisDate,
				meals: mealMap.get(thisDate.format('YYYYMMDD'))
			});
		}
	};

	updateMealMap();
	onMount(async () => {
		db.collection('meals').subscribe('*', async (e) => {
			try {
				if (e.action !== 'delete') {
					const record = await db.collection('meals').getOne<Meal>(e.record.id, {
						expand: 'meal'
					});
					switch (e.action) {
						case 'create':
							mealList = [...mealList, record];
							break;
						case 'update':
							const foundIndex = mealList.findIndex((element) => element.id === e.record.id);
							mealList.splice(foundIndex, 1, record);
							// Needed to let SvelteKit know that I've updated the array.
							mealList = mealList;
							break;
						default:
							console.error('Not sure what to do with this:', e);
					}
				} else {
					mealList = mealList.filter((el) => el.id !== e.record.id);
				}
				updateMealMap();
			} catch (e) {
				console.error(e);
			}
		});

		return db.collection('meals').unsubscribe;
	});
	$: {
		startDate = startDate;
		updateMealMap();
	}
</script>

<div
	class="planner"
	style={`transition: transform var(--transition); transform: translateX(-50%) ${
		displayPlanner ? 'translateY(-100%)' : ''
	}`}
>
	<div
		class="control control-top"
		class:is-open={displayPlanner}
		on:click={() => (displayPlanner = !displayPlanner)}
		on:keypress={() => (displayPlanner = !displayPlanner)}
	>
		<div>➜</div>
		<div>➜</div>
		<div>➜</div>
	</div>
	<div
		class="control control-back"
		on:click={() => (startDate = startDate.subtract(1, 'day'))}
		on:keypress={() => (startDate = startDate.subtract(1, 'day'))}
	>
		<div>➜</div>
		<div>➜</div>
		<div>➜</div>
	</div>
	<div
		class="control control-next"
		on:click={() => (startDate = startDate.add(1, 'day'))}
		on:keypress={() => (startDate = startDate.add(1, 'day'))}
	>
		<div>➜</div>
		<div>➜</div>
		<div>➜</div>
	</div>
	<div class="week">
		{#each days as day}
			<PlannerDay {day} />
		{/each}
	</div>
</div>

<style lang="scss">
	.planner {
		transition: transform var(--transition);
		position: fixed;
		top: 100vh;
		left: 50vw;
		width: 90vw;
		margin: auto 0;
		background-color: var(--color-yellow-1);
		color: var(--color-yellow-5);
		border-radius: 2rem 2rem 0 0;
		text-align: center;
		box-sizing: border-box;
	}

	.week {
		display: grid;
		padding: var(--spacing);
		gap: var(--spacing);
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
		text-align: initial;
	}

	.day {
		overflow: hidden;
		h2 {
			font-size: larger;
		}
		small {
			color: var(--color-yellow-3);
		}
	}

	.control {
		cursor: pointer;
		user-select: none;
		box-sizing: border-box;
	}

	.control-top {
		position: relative;
		display: inline-block;
		padding: 0 var(--spacing);
		background-color: var(--color-yellow-1);
		border-radius: var(--border-radius) var(--border-radius) 0 0;
		transform: translateY(-100%);
	}

	.control-top div {
		transition: transform var(--transition);
		display: inline-block;
		transform-origin: center;
		transform: rotate(-90deg);
	}

	.control-top.is-open div {
		transform: rotate(90deg);
	}

	.control-back {
		position: absolute;
		transform: translateX(-100%) translateY(-50%);
		top: 50%;
		padding: var(--spacing) calc(0.5 * var(--spacing));
		background-color: var(--color-yellow-1);
		border-radius: var(--border-radius) 0 0 var(--border-radius);
		div {
			transform: rotate(-180deg);
		}
	}
	.control-next {
		padding: var(--spacing) calc(0.5 * var(--spacing));
		background-color: var(--color-yellow-1);
		border-radius: 0 var(--border-radius) var(--border-radius) 0;
		position: absolute;
		right: 0;
		transform: translateX(100%) translateY(-50%);
		top: 50%;
	}
</style>
