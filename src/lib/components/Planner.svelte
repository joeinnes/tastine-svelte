<script lang="ts">
	import { page } from '$app/stores';
	import { db } from '$lib/db/db';

	import dayjs from 'dayjs';
	import toast from 'svelte-french-toast';

	interface Meal {
		id: string;
		expand: {
			meal: {
				name: string;
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

	$: {
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
	}

	const handleDrop = async (
		e: DragEvent & { target: HTMLDivElement },
		i: number,
		day: dayjs.Dayjs
	) => {
		if (!e || !e.target) return;
		e.target.setAttribute('aria-busy', 'true');
		const id = e.dataTransfer?.getData('text/plain');
		if (!id) {
			toast.error('Something went wrong');
			return;
		}
		try {
			let date = day.toDate();
			await db.collection('meals').update(id, { date: day.toDate() });
			mealList = mealList.map((meal) => {
				if (meal.id === id) {
					meal.date = date;
				}
				return meal;
			});
		} catch (e) {
			console.error(e);
			toast.error('Something went wrong');
			return;
		} finally {
			e.target.setAttribute('aria-busy', 'false');
		}
	};

	const handleDragStart = (e: DragEvent, id: string) => {
		e.dataTransfer?.setData('text/plain', id);
	};

	function getDailyMeals(arr: Meal[] | undefined) {
		let newArr = arr?.slice(0, 7) || [];
		newArr.length = 7;
		return newArr;
	}
</script>

<div class="planner" style="transform: translateX(-50%) translateY(-100%);">
	<div class="week">
		{#each days as day}
			<div class="day">
				<hgroup>
					<h2>{day.date.format('ddd')}</h2>
					<small>{day.date.format('DD MMM')}</small>
				</hgroup>
				{#if 1 == 1}
					{@const theseMeals = getDailyMeals(mealMap.get(day.date.format('YYYYMMDD'))).sort(
						(a, b) => (a.sort < b.sort ? 1 : -1)
					)}
					{#each theseMeals as meal, i}
						<div
							class="meal"
							on:dragover|preventDefault
							on:drop|stopPropagation={(e) => handleDrop(e, i, day.date)}
						>
							<span draggable="true" on:dragstart={(e) => handleDragStart(e, meal.id)}
								>{#if meal?.expand?.meal?.name}{meal?.expand?.meal?.name}{:else}&nbsp;{/if}</span
							>
						</div>
					{/each}
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.planner {
		position: fixed;
		top: 100vh;
		left: 50vw;
		width: 90vw;
		margin: auto 0;
		background-color: var(--color-yellow-1);
		color: var(--color-yellow-5);
		border-radius: 2rem 2rem 0 0;
	}

	.week {
		display: grid;
		padding: var(--spacing);
		gap: var(--spacing);
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
	}

	.day h2 {
		font-size: larger;
	}

	.day {
		overflow: hidden;
	}

	.day small {
		color: var(--color-yellow-3);
	}

	.meal {
		border-bottom: 1px dashed var(--color-yellow-5);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		user-select: none;
		cursor: move;
	}
</style>
