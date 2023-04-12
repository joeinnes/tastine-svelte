<script lang="ts">
	import type { Meal, Day, DragData } from '../../app';
	import { page } from '$app/stores';
	import { db } from '$lib/db/db';

	import dayjs from 'dayjs';
	import toast from 'svelte-french-toast';

	let startDate = dayjs().subtract(1, 'day');

	let days: Day[] = [];
	let mealMap = new Map<string, Meal[]>();
	let mealList: Meal[] = $page.data.meals;

	const handleDrop = async (e: DragEvent, i: number, day: dayjs.Dayjs) => {
		if (!e || !e.target || !(e.target instanceof HTMLDivElement)) return;
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

	const handleDragStart = (e: DragEvent, data: DragData) => {
		const str = JSON.stringify(data);
		e.dataTransfer?.setData('text/plain', str);
	};

	const handleDel = (id: string) => {
		db.collection('meals').delete(id);
	};
	export let meal: Meal;
	export let day: Day;
	export let i: number;
</script>

<div
	class="meal"
	on:dragover|preventDefault
	on:drop|stopPropagation={(e) => handleDrop(e, i, day.date)}
	draggable="true"
	on:dragstart={(e) => handleDragStart(e, { id: meal.id, meal: meal?.expand?.meal?.id })}
>
	<span class="meal-name"
		>{#if meal?.expand?.meal?.name}{meal?.expand?.meal?.name}{:else}&nbsp;{/if}</span
	>
	{#if meal}
		<button class="del" on:click={() => handleDel(meal.id)}>ⓧ</button>
	{/if}
</div>

<style lang="scss">
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
	.del {
		cursor: pointer;
		background: none;
		border: none;
		color: inherit;
		padding: 0;
		margin: 0;
		width: auto;
	}
</style>
