<script lang="ts" generics="TData, TValue">
	import { ChevronDownIcon } from "@lucide/svelte";
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import {
		DropdownMenu,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuCheckboxItem,
	} from '$lib/components/ui/dropdown-menu';
	import { Input } from "$lib/components/ui/input";
	import { Button } from '$lib/components/ui/button';
	import {
		type ColumnDef,
		type ColumnFiltersState,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		type PaginationState,
		type SortingState,
		type VisibilityState,
	} from '@tanstack/table-core';
	import {
		createSvelteTable,
		FlexRender
	} from '$lib/components/ui/data-table';
	
	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
	};
	
	let { columns, data }: DataTableProps<TData, TValue> = $props();
	
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	
	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: (updater) => {
			if (typeof updater === "function") {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onPaginationChange: (updater) => {
			if (typeof updater === "function") {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === "function") {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === "function") {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnVisibility() {
				return columnVisibility;
			},
		},
	});
</script>

<div>
	<div class="flex items-center py-4">
		<Input
			placeholder="Filter countries..."
			value={(table.getColumn("Country")?.getFilterValue() as string) ?? ""}
			onchange={(e) => {
        table.getColumn("Country")?.setFilterValue(e.currentTarget.value);
      }}
			oninput={(e) => {
        table.getColumn("Country")?.setFilterValue(e.currentTarget.value);
      }}
			class="max-w-sm dark:text-white text-black placeholder:text-[#A0A0A0]"
		/>
		<DropdownMenu>
			<DropdownMenuTrigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline" class="ml-auto cursor-pointer">Columns <ChevronDownIcon class="ml-2 size-4" /></Button>
				{/snippet}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" class="dark:bg-[#171717]">
				{#each table
					.getAllColumns()
					.filter((col) => col.getCanHide()) as column (column.id)}
					<DropdownMenuCheckboxItem
						class="capitalize dark:hover:bg-[#1E1E1E]"
						bind:checked={
              () => column.getIsVisible(), (v) => column.toggleVisibility(!!v)
            }
					>
						{column.id}
					</DropdownMenuCheckboxItem>
				{/each}
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
	<div class="rounded-md border">
		<Table class="dark:bg-[#0A0A0A]">
			<TableHeader>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<TableRow class="hover:[&,&>svelte-css-wrapper]:[&>th,td]:!bg-transparent">
						{#each headerGroup.headers as header (header.id)}
							<TableHead class="px-2" colspan={header.colSpan}>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</TableHead>
						{/each}
					</TableRow>
				{/each}
			</TableHeader>
			<TableBody>
				{#each table.getRowModel().rows as row (row.id)}
					<TableRow data-state={row.getIsSelected() && "selected"} class="dark:hover:[&,&>svelte-css-wrapper]:[&>th,td]:!bg-[#161616]">
						{#each row.getVisibleCells() as cell (cell.id)}
							<TableCell class="px-5">
								<FlexRender
									content={cell.column.columnDef.cell}
									context={cell.getContext()}
								/>
							</TableCell>
						{/each}
					</TableRow>
				{:else}
					<TableRow>
						<TableCell colspan={columns.length} class="h-24 text-center">
							No results.
						</TableCell>
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	</div>
	<div class="flex items-center justify-end space-x-2 py-4">
		<Button
			variant="outline"
			size="sm"
			onclick={() => table.previousPage()}
			disabled={!table.getCanPreviousPage()}
			class="cursor-pointer"
		>
			Previous
		</Button>
		<Button
			variant="outline"
			size="sm"
			onclick={() => table.nextPage()}
			disabled={!table.getCanNextPage()}
			class="cursor-pointer"
		>
			Next
		</Button>
	</div>
</div>
