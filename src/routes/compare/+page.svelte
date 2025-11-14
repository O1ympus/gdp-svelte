<script lang="ts">
	import type { PageData } from './$types';
	import CompareCountriesChart
		from '$lib/components/compare-countries-chart.svelte';
	import SelectCountry from '$lib/components/select-country.svelte';
	import SelectMetrics from '$lib/components/select-metric.svelte';
	
	let { data }: { data: PageData } = $props();
	let { countries, metrics } = data;
	
	let currentMetric = $state<string | undefined>(undefined);
	let firstListValue = $state<string | undefined>(undefined);
	let secondListValue = $state<string | undefined>(undefined);
	
	const firstListCountries = $derived(countries.filter(c => c !== secondListValue));
	const secondListCountries = $derived(countries.filter(c => c !== firstListValue));
</script>

<div class="flex gap-4 my-8">
	<SelectCountry
		bind:value={firstListValue}
		countries={firstListCountries}
		placeholder="Select 1st country"
	/>
	
	<SelectCountry
		bind:value={secondListValue}
		countries={secondListCountries}
		placeholder="Select 2nd country"
	/>
	
	<SelectMetrics
		bind:value={currentMetric}
		metrics={metrics}
		placeholder="Select metric"
	/>
</div>

<CompareCountriesChart
	firstCountry={firstListValue}
	secondCountry={secondListValue}
	metric={currentMetric}
/>

