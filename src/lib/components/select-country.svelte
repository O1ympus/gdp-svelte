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
		countries,
		placeholder = "Select country"
	}: {
		value?: string | undefined;
		countries: string[];
		placeholder?: string;
	} = $props();
</script>

<Select type="single" bind:value>
	<SelectTrigger class="w-[180px] min-w-[180px] max-w-[180px]">
		<span class="truncate">{value || placeholder}</span>
	</SelectTrigger>
	<SelectContent>
		<SelectGroup>
			<SelectLabel>Countries</SelectLabel>
			{#each countries as country (country)}
				<SelectItem
					value={country}
					label={country}
				>
					{country}
				</SelectItem>
			{/each}
		</SelectGroup>
	</SelectContent>
</Select>
