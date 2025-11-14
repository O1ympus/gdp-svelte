<script lang="ts">
	import DataTable from '$lib/components/data-table.svelte';
	import { columns } from './columns.js';
	
	export let data: { summary: { Country: string; growth_gdp: number; growth_population: number; growth_total: number }[] };
	
	let sortedSummary = data.summary.sort((a, b) => b.growth_total - a.growth_total);
</script>

<DataTable data={sortedSummary} {columns} />
