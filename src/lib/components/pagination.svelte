<script lang="ts">
	import {
		Pagination,
		PaginationContent,
		PaginationItem,
		PaginationLink,
		PaginationNextButton,
		PaginationPrevButton
	} from '$lib/components/ui/pagination/index.ts';
	
	let {
		totalPages,
		currentPage = $bindable(1)
	}: {
		totalPages: number;
		currentPage?: number;
	} = $props();
	
	const pages = $derived(
		Array.from({ length: totalPages }, (_, i) => ({
			type: 'page' as const,
			value: i + 1
		}))
	);
</script>

<Pagination count={totalPages} perPage={1} bind:page={currentPage}>
	<PaginationContent>
		<PaginationItem>
			<PaginationPrevButton />
		</PaginationItem>
		
		{#each pages as pageObj (pageObj.value)}
			<PaginationItem>
				<PaginationLink
					page={pageObj}
					isActive={currentPage === pageObj.value}
				>
					{pageObj.value}
				</PaginationLink>
			</PaginationItem>
		{/each}
		
		<PaginationItem>
			<PaginationNextButton />
		</PaginationItem>
	</PaginationContent>
</Pagination>
