<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from '@lucide/svelte';
	import type { Column } from '@tanstack/table-core';
	
	let { column, label }: { column: Column<any, unknown>; label: string } = $props();
	
	function handleClick() {
		column.toggleSorting();
	}
</script>

<Button
	variant="ghost"
	class="text-left justify-start w-full h-auto p-0 hover:bg-transparent dark:hover:bg-transparent hover:text-foreground"
	onclick={handleClick}
>
	{label}
	{#if column.getIsSorted() === 'asc'}
		<ArrowUpIcon class="ml-2 h-4 w-4" />
	{:else if column.getIsSorted() === 'desc'}
		<ArrowDownIcon class="ml-2 h-4 w-4" />
	{:else}
		<ArrowUpDownIcon class="ml-2 h-4 w-4 opacity-50" />
	{/if}
</Button>
