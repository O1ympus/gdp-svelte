<script lang="ts">
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectLabel,
		SelectTrigger
	} from '$lib/components/ui/select/index.js';
	
	let {
		value = $bindable(),
		metrics,
		placeholder = "Select metric"
	}: {
		value?: string | undefined;
		metrics: string[];
		placeholder?: string;
	} = $props();
</script>

<Select type="single" bind:value>
	<SelectTrigger class="w-[180px] min-w-[180px] max-w-[180px]">
		<span class="truncate">{value || placeholder}</span>
	</SelectTrigger>
	<SelectContent>
		<SelectGroup>
			<SelectLabel>Metrics</SelectLabel>
			{#each metrics as metric (metric)}
				<SelectItem
					value={metric}
					label={metric}
				>
					{metric}
				</SelectItem>
			{/each}
		</SelectGroup>
	</SelectContent>
</Select>
