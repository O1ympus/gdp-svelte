import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import DataTableActions from '$lib/components/data-table-actions.svelte';
import DataTableSortableHeader from '$lib/components/data-table-sortable-header.svelte';

export type Country = {
	Country: string;
	growth_gdp: number;
	growth_population: number;
	growth_total: number;
};

function percentSnippet(label: string, key: keyof Country) {
	return {
		accessorKey: key,
		header: ({ column }) => renderComponent(DataTableSortableHeader, { column, label }),
		enableSorting: true,
		cell: ({ row }: any) => {
			const cellSnippet = createRawSnippet<[{ value: number }]>((getValue) => {
				const { value } = getValue();
				const formatted = `${(value ?? 0).toFixed(2)}%`;
				return {
					render: () => `<div class="text-left font-medium">${formatted}</div>`
				};
			});
			return renderSnippet(cellSnippet, { value: row.original[key] });
		}
	};
}

export const columns: ColumnDef<Country>[] = [
	{
		accessorKey: 'Country',
		header: ({ column }) => renderComponent(DataTableSortableHeader, { column, label: 'Country' }),
		enableSorting: true,
		cell: ({ row }) => {
			const snippet = createRawSnippet(() => ({
				render: () => `<div>${row.original.Country}</div>`
			}));
			return renderSnippet(snippet);
		}
	},
	percentSnippet('GDP Growth', 'growth_gdp'),
	percentSnippet('Population Growth', 'growth_population'),
	percentSnippet('Total Growth', 'growth_total'),
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { Country: row.original.Country });
		}
	}
];
