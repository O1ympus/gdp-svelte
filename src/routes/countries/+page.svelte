<script lang="ts">
	import DataTable from '$lib/components/data-table.svelte';
	import { columns } from './columns.js';
	
	let { data }: { data: { summary: { Country: string; growth_gdp: number; growth_population: number; growth_total: number }[] } } = $props();
	
	const sortedSummary = $derived.by(() => {
		if (data.summary && Array.isArray(data.summary)) {
			return [...data.summary].sort((a, b) => b.growth_total - a.growth_total);
		}
		return [];
	});
</script>

<DataTable data={sortedSummary} {columns} />
