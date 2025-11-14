<script lang="ts">
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import {
		BookmarkCheckIcon,
		BookmarkIcon,
		EllipsisIcon
	} from '@lucide/svelte';
	import { user } from '$lib/stores/user';
	
	let { Country, growthGDP, growthPopulation, growthTotal }: {
		Country: string;
		growthGDP: number | null;
		growthPopulation: number | null;
		growthTotal: number | null;
	} = $props();
	
	let isSaved = $state(false);
	let isLoading = $state(false);
	let checkPromise: Promise<void> | null = null;
	
	async function checkIfSaved() {
		if (!$user) {
			isSaved = false;
			return;
		}
		
		if (checkPromise) {
			return checkPromise;
		}
		
		checkPromise = (async () => {
			try {
				const response = await fetch('/saved');
				if (response.ok) {
					const data = await response.json();
					isSaved = data.countries?.some((c: { country: string }) => c.country === Country) ?? false;
				} else if (response.status === 401) {
					isSaved = false;
				}
			} catch (error) {
			} finally {
				checkPromise = null;
			}
		})();
		
		return checkPromise;
	}
	
	$effect(() => {
		if ($user) {
			checkIfSaved();
		} else {
			isSaved = false;
		}
	});
	
	async function toggleSave() {
		if (!$user) {
			toast.error('Please log in to save countries');
			return;
		}
		
		if (isLoading) {
			return;
		}
		
		isLoading = true;
		const previousState = isSaved;
		let action = 'save';
		
		if (isSaved) {
			action = 'unsave';
		} else {
			action = 'save';
		}
		
		try {
			const requestBody = {
				country: Country,
				growthGDP: growthGDP,
				growthPopulation: growthPopulation,
				growthTotal: growthTotal,
				action: action
			};
			
			const response = await fetch('/saved', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});
			
			if (response.ok) {
				if (isSaved) {
					isSaved = false;
				} else {
					isSaved = true;
				}
				
				let descriptionText = '';
				if (action === 'save') {
					descriptionText = Country + ' added to your saved list';
				} else {
					descriptionText = Country + ' removed from your saved list';
				}
				
				toast.success('Country has been ' + action + 'd', {
					description: descriptionText,
					action: {
						label: 'Undo',
						onClick: async () => {
							isSaved = previousState;
							
							let undoAction = 'save';
							if (previousState) {
								undoAction = 'save';
							} else {
								undoAction = 'unsave';
							}
							
							const undoBody = {
								country: Country,
								growthGDP: growthGDP,
								growthPopulation: growthPopulation,
								growthTotal: growthTotal,
								action: undoAction
							};
							
							await fetch('/saved', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify(undoBody)
							});
						}
					}
				});
			} else {
				const data = await response.json();
				let errorMessage = 'Failed to save country';
				if (data.error) {
					errorMessage = data.error;
				}
				toast.error(errorMessage);
			}
		} catch (error) {
			toast.error('Failed to save country. Please try again.');
		} finally {
			isLoading = false;
		}
	}
</script>

<DropdownMenu>
	<DropdownMenuTrigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				size="icon"
				class="relative size-8 p-0"
			>
				<span class="sr-only">Open menu</span>
				<EllipsisIcon />
			</Button>
		{/snippet}
	</DropdownMenuTrigger>
	<DropdownMenuContent class="dark:bg-[#171717]">
		<DropdownMenuGroup>
			<DropdownMenuLabel>Actions</DropdownMenuLabel>
			<DropdownMenuItem>
				<a href={`/countries/${encodeURIComponent(Country)}`}>Go to {Country} details</a>
			</DropdownMenuItem>
			<DropdownMenuItem
				onSelect={toggleSave}
				disabled={isLoading || !$user}
			>
				{#if isSaved}
					<BookmarkCheckIcon class="mr-2 size-4" />
					<span>Unsave country</span>
				{:else}
					<BookmarkIcon class="mr-2 size-4" />
					<span>Save country</span>
				{/if}
			</DropdownMenuItem>
		</DropdownMenuGroup>
	</DropdownMenuContent>
</DropdownMenu>
