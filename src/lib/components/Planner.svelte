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
		try {
			const data = e.dataTransfer?.getData('text/plain');
			if (!data) {
				throw new Error('No data');
			}
			const { id, meal } = JSON.parse(data);
			if (!id) {
				toast.error('Something went wrong');
				throw new Error('Dropped data did not have ID');
			}

			let date = day.toDate();
			if (id === -1) {
				const newMeal = (await db.collection('meals').create(
					{ date: day.toDate(), meal, sort: i, created_by: db?.authStore?.model?.id },
					{
						expand: 'meal'
					}
				)) satisfies Meal;
				mealList = [...mealList, newMeal];
			} else {
				await db.collection('meals').update(id, { date: day.toDate() });
				mealList = mealList.map((meal) => {
					if (meal.id === id) {
						meal.date = date;
					}
					return meal;
				});
			}
		} catch (e) {
			console.error(e);
			toast.error('Something went wrong');
			return;
		} finally {
			e.target.setAttribute('aria-busy', 'false');
		}
	};

	interface DragData {
		id: string;
		meal: string;
	}

	const handleDragStart = (e: DragEvent, data: DragData) => {
		const str = JSON.stringify(data);
		e.dataTransfer?.setData('text/plain', str);
	};

	function getDailyMeals(arr: Meal[] | undefined) {
		let newArr = arr?.slice(0, 7) || [];
		newArr.length = 7;
		return newArr;
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
							<span
								class="meal-name"
								draggable="true"
								on:dragstart={(e) =>
									handleDragStart(e, { id: meal.id, meal: meal?.expand?.meal?.id })}
								>{#if meal?.expand?.meal?.name}{meal?.expand?.meal?.name}{:else}&nbsp;{/if}</span
							>
							{#if meal}
								<span class="del">ⓧ</span>
							{/if}
						</div>
					{/each}
				{/if}
			</div>
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

	.meal {
		border-bottom: 1px dashed var(--color-yellow-5);
		user-select: none;
		cursor: move;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.meal-name {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.control {
		cursor: pointer;
		user-select: none;
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
