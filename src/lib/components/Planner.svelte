<script lang="ts">
	import type { Meal, Day } from '../../app';
	import { onMount } from 'svelte';
	import PlannerDay from './PlannerDay.svelte';
	import { page } from '$app/stores';

	import dayjs from 'dayjs';
	import { db } from '$lib/db/db';

	let startDate = dayjs().subtract(1, 'day');

	let days: Day[] = [];
	let mealMap = new Map<string, Meal[]>();
	let mealList: Meal[] = $page.data.meals;

	let displayPlanner = false;
	let selectedDate: string | undefined;

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
	const onReset = () => {
		startDate = dayjs().subtract(1, 'day');
	};
	$: {
		if (selectedDate) {
			startDate = dayjs(selectedDate);
			selectedDate = undefined;
		} else {
			startDate = startDate;
		}
		updateMealMap();
	}
</script>

<div
	class="planner"
	style={`transition: transform var(--transition); transform: translateX(-50%) ${
		displayPlanner ? 'translateY(-100%)' : ''
	}`}
>
	<button
		class="control control-top"
		class:is-open={displayPlanner}
		on:click={() => (displayPlanner = !displayPlanner)}
	>
		<div>➜</div>
		<div>➜</div>
		<div>➜</div>
	</button>
	<div class="control control-back">
		<button class="reset outline" type="button" on:click|stopPropagation={onReset}>
			<svg
				viewBox="0 0 24 24"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				><title>home_3_line</title><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
					><g id="Building" fill-rule="nonzero"
						><g id="home_3_line"
							><path
								d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
								id="MingCute"
								fill-rule="nonzero"
							/><path
								d="M10.7722,2.68814 C11.4492625,2.16151813 12.3804168,2.12860426 13.0892408,2.5893984 L13.2279,2.68814 L21.6117,9.20884 C22.3334208,9.77022208 21.9818043,10.9006282 21.1132725,10.993854 L20.9971,11 L20.0001,11 L20.0001,19 C20.0001,20.0543909 19.1841589,20.9181678 18.1493537,20.9945144 L18.0001,21 L6.00005,21 C4.94568773,21 4.08188483,20.18415 4.00553573,19.1492661 L4.00005,19 L4.00005,11 L3.00297,11 C2.08960167,11 1.67147285,9.89241543 2.30039361,9.28508754 L2.38841,9.20884 L10.7722,2.68814 Z M12.0001,4.26685 L5.62546,9.22486 C5.85399,9.41004 6.00005,9.69297 6.00005,10.01 L6.00005,19 L9.00005,19 L9.00005,14 C9.00005,12.3431 10.3432,11 12.0001,11 C13.6569,11 15.0001,12.3431 15.0001,14 L15.0001,19 L18.0001,19 L18.0001,10.01 C18.0001,9.69295 18.1461,9.41003 18.3746,9.22486 L12.0001,4.26685 Z M12.0001,13 C11.4478,13 11.0001,13.4477 11.0001,14 L11.0001,19 L13.0001,19 L13.0001,14 C13.0001,13.4477 12.5523,13 12.0001,13 Z"
								fill="currentColor"
							/></g
						></g
					></g
				></svg
			>
		</button>
		<p />
		<button on:click={() => (startDate = startDate.subtract(1, 'day'))}>
			<div>➜</div>
			<div>➜</div>
			<div>➜</div></button
		>
	</div>
	<div class="control control-next">
		<details role="list">
			<!-- svelte-ignore a11y-no-redundant-roles -->
			<!-- This is inherited from PicoCSS, which required 'role=button' for proper styling even though summary is properly an A11Y friendly interactive element. -->
			<summary aria-haspopup="listbox" role="button" class="outline hide-dropdown">
				<svg
					viewBox="0 0 24 24"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					><title>calendar_month_line</title><g
						id="Icon"
						stroke="none"
						stroke-width="1"
						fill="none"
						fill-rule="evenodd"
						><g id="Business" transform="translate(-192.000000, -480.000000)" fill-rule="nonzero"
							><g id="calendar_month_line" transform="translate(192.000000, 480.000000)"
								><path
									d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5935,23.2578 L12.5819,23.2595 L12.5109,23.295 L12.4919,23.2987 L12.4767,23.295 L12.4057,23.2595 C12.3958,23.2564 12.387,23.259 12.3821,23.2649 L12.378,23.2758 L12.3609,23.7031 L12.3659,23.7235 L12.3769,23.7357 L12.4805,23.8097 L12.4953,23.8136 L12.5071,23.8097 L12.6107,23.7357 L12.6233,23.7197 L12.6267,23.7031 L12.6096,23.2758 C12.6076,23.2657 12.601,23.2593 12.5935,23.2578 Z M12.8584,23.1453 L12.8445,23.1473 L12.6598,23.2397 L12.6499,23.2499 L12.6472,23.2611 L12.6651,23.6906 L12.6699,23.7034 L12.6784,23.7105 L12.8793,23.8032 C12.8914,23.8069 12.9022,23.803 12.9078,23.7952 L12.9118,23.7812 L12.8777,23.1665 C12.8753,23.1546 12.8674,23.147 12.8584,23.1453 Z M12.143,23.1473 C12.1332,23.1424 12.1222,23.1453 12.1156,23.1526 L12.1099,23.1665 L12.0758,23.7812 C12.0751,23.7927 12.0828,23.8019 12.0926,23.8046 L12.1083,23.8032 L12.3092,23.7105 L12.3186,23.7024 L12.3225,23.6906 L12.3404,23.2611 L12.3372,23.2485 L12.3278,23.2397 L12.143,23.1473 Z"
									id="MingCute"
								/><path
									d="M19,3 C20.1046,3 21,3.89543 21,5 L21,19 C21,20.1046 20.1046,21 19,21 L5,21 C3.89543,21 3,20.1046 3,19 L3,5 C3,3.89543 3.89543,3 5,3 L19,3 Z M19,9 L5,9 L5,19 L19,19 L19,9 Z M8.5,15 C9.05228,15 9.5,15.4477 9.5,16 C9.5,16.5523 9.05228,17 8.5,17 L7.5,17 C6.94772,17 6.5,16.5523 6.5,16 C6.5,15.4477 6.94772,15 7.5,15 L8.5,15 Z M12.5,15 C13.0523,15 13.5,15.4477 13.5,16 C13.5,16.51285 13.113973,16.9355092 12.6166239,16.9932725 L12.5,17 L11.5,17 C10.9477,17 10.5,16.5523 10.5,16 C10.5,15.48715 10.886027,15.0644908 11.3833761,15.0067275 L11.5,15 L12.5,15 Z M8.5,11 C9.05228,11 9.5,11.4477 9.5,12 C9.5,12.51285 9.11395571,12.9355092 8.61662025,12.9932725 L8.5,13 L7.5,13 C6.94772,13 6.5,12.5523 6.5,12 C6.5,11.48715 6.88604429,11.0644908 7.38337975,11.0067275 L7.5,11 L8.5,11 Z M12.5,11 C13.0523,11 13.5,11.4477 13.5,12 C13.5,12.5523 13.0523,13 12.5,13 L11.5,13 C10.9477,13 10.5,12.5523 10.5,12 C10.5,11.4477 10.9477,11 11.5,11 L12.5,11 Z M16.5,11 C17.0523,11 17.5,11.4477 17.5,12 C17.5,12.51285 17.113973,12.9355092 16.6166239,12.9932725 L16.5,13 L15.5,13 C14.9477,13 14.5,12.5523 14.5,12 C14.5,11.48715 14.886027,11.0644908 15.3833761,11.0067275 L15.5,11 L16.5,11 Z M19,5 L5,5 L5,7 L19,7 L19,5 Z"
									fill="currentColor"
								/></g
							></g
						></g
					></svg
				>
			</summary>
			<ul role="listbox" class="align-to-end">
				<li><input type="date" bind:value={selectedDate} /></li>
			</ul>
		</details>
		<p />
		<button type="button" on:click={() => (startDate = startDate.add(1, 'day'))}>
			<div>➜</div>
			<div>➜</div>
			<div>➜</div>
		</button>
	</div>

	<div class="week">
		{#each days as day}
			<PlannerDay {day} />
		{/each}
	</div>
</div>

<style lang="scss">
	.align-to-end {
		left: unset;
	}
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

	.hide-dropdown::after {
		display: none;
	}

	button.control {
		border: none;
		color: var(--color-yellow-5);
		display: inline-block;
		width: auto;
		cursor: pointer;
		user-select: none;
		box-sizing: border-box;
		outline: none;
		&:focus {
			box-shadow: none;
		}
	}

	.control {
		& button,
		[role='button'] {
			padding: calc(0.5 * var(--spacing));
		}
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
		left: 0;
		transform: translateX(-100%) translateY(-50%);
		top: 50%;
		padding: var(--spacing) calc(0.5 * var(--spacing));
		background-color: var(--color-yellow-1);
		border-radius: var(--border-radius) 0 0 var(--border-radius);
		div {
			transform: rotate(-180deg);
		}
		.reset {
			transform: none;
		}
	}
	.control-next {
		padding: var(--spacing) calc(0.5 * var(--spacing));
		background-color: var(--color-yellow-1);
		border-radius: 0 var(--border-radius) var(--border-radius) 0;
		position: absolute;
		display: block;
		right: 0;
		transform: translateX(100%) translateY(-50%);
		top: 50%;
	}
</style>
