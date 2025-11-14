<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import SingleCountryChart from '$lib/components/single-country-chart.svelte';
	import SectionCards from '$lib/components/section-cards.svelte';
	
	export let data: {
		countryGDP?: { Country: string; [year: string]: number | string } | undefined;
		countryPopulation?: { Country: string; [year: string]: number | string } | undefined;
		countrySummary?: {
			Country: string;
			growth_gdp: number | null;
			growth_population: number | null;
			growth_total: number | null;
		};
	};
	
	$: cards = [
		{
			title: 'GDP Growth',
			description: 'GDP Growth (%)',
			value: (data.countrySummary?.growth_gdp ?? 0).toFixed(2) + '%',
			trending: `${Math.round(Math.abs(data.countrySummary?.growth_gdp ?? 0))}%`,
			trendingIcon: (data.countrySummary?.growth_gdp ?? 0) >= 0 ? 'up' : 'down',
			footer: 'Compared to last year'
		},
		{
			title: 'Population Growth',
			description: 'Population Growth (%)',
			value: (data.countrySummary?.growth_population ?? 0).toFixed(2) + '%',
			trending: `${Math.round(Math.abs(data.countrySummary?.growth_population ?? 0))}%`,
			trendingIcon: (data.countrySummary?.growth_population ?? 0) >= 0 ? 'up' : 'down',
			footer: 'Compared to last year'
		},
		{
			title: 'Total Growth',
			description: 'Total Growth (%)',
			value: (data.countrySummary?.growth_total ?? 0).toFixed(2) + '%',
			trending: `${Math.round(Math.abs(data.countrySummary?.growth_total ?? 0))}%`,
			trendingIcon: (data.countrySummary?.growth_total ?? 0) >= 0 ? 'up' : 'down',
			footer: 'Compared to last year'
		},
	];
	
	$: country = $page.params.country;
	
	let countryData = null;
	
	onMount(async () => {
		const res = await fetch('/countries');
		const data = await res.json();
		
		const decoded = decodeURIComponent(country);
		countryData = data.find((c: any) => c.Country === decoded);
	});
</script>

{#if data.countryGDP || data.countryPopulation}
	<h1 class="text-center text-3xl font-bold mb-4">{countryData?.Country}</h1>
	<h3 class="text-xl font-bold mb-4">General data</h3>
	{#if data.countrySummary}
		<SectionCards  cards={cards} />
	{/if}
	<h3 class="text-xl font-bold mb-4">Charts with data</h3>
	<div class="flex gap-8">
		{#if data.countryGDP}
			<SingleCountryChart data={{ type: 'GDP', dataset: data.countryGDP }} />
		{/if}
		
		{#if data.countryPopulation}
			<SingleCountryChart data={{ type: 'Population', dataset: data.countryPopulation }} />
		{/if}
	</div>
{:else}
	<p class="text-center text-gray-500 mt-8">Country data not found.</p>
{/if}
