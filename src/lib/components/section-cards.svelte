<script lang="ts">
	import TrendingUpIcon from '@tabler/icons-svelte/icons/trending-up';
	import TrendingDownIcon from '@tabler/icons-svelte/icons/trending-down';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import {
		Card,
		CardAction,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.ts';
	
	export let cards: {
		title: string;
		description: string;
		value: string;
		trending: string;
		trendingIcon: 'up' | 'down';
		footer: string;
	}[];
</script>
<div
	class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
>
	{#each cards as card (card.title)}
		<Card class="@container/card dark:bg-[#191919] transition-transform hover:scale-105 duration-300 ease-in-out">
			<CardHeader>
				<CardDescription class="dark:text-[#A1A1A1]">{card.description}</CardDescription>
				<CardTitle class="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">{card.value}</CardTitle>
				<CardAction>
					<Badge variant="outline">
						{#if card.trendingIcon === 'up'}
							<TrendingUpIcon />
						{:else}
							<TrendingDownIcon />
						{/if}
						{card.trending}
					</Badge>
				</CardAction>
			</CardHeader>
			<CardFooter class="flex-col items-start gap-1.5 text-sm">
				<div class="line-clamp-1 flex gap-2 font-medium">{card.footer}</div>
			</CardFooter>
		</Card>
	{/each}
</div>
