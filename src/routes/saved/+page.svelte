<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { BookmarkCheckIcon, ExternalLinkIcon } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	
	interface SavedCountry {
		country: string;
		growthGDP: number | null;
		growthPopulation: number | null;
		growthTotal: number | null;
		saved_at: string;
	}
	
	let savedCountries = $state<SavedCountry[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);
	
	async function fetchSavedCountries() {
		isLoading = true;
		error = null;
		try {
			const [savedResponse, summaryResponse] = await Promise.all([
				fetch('/saved'),
				fetch('/countries')
			]);
			
			if (savedResponse.ok) {
				const savedData = await savedResponse.json();
				const summaryData = summaryResponse.ok ? await summaryResponse.json() : null;
				
				const growthMap = new Map();
				if (summaryData && Array.isArray(summaryData)) {
					for (let i = 0; i < summaryData.length; i++) {
						const country = summaryData[i];
						growthMap.set(country.Country, {
							growthGDP: country.growth_gdp,
							growthPopulation: country.growth_population,
							growthTotal: country.growth_total
						});
					}
				}
				
				const countriesList = savedData.countries || [];
				const result: SavedCountry[] = [];
				
				for (let i = 0; i < countriesList.length; i++) {
					const c = countriesList[i];
					const countryGrowth = growthMap.get(c.country);
					
					let gdpValue = null;
					if (c.growth_gdp != null) {
						gdpValue = c.growth_gdp;
					} else if (c.growthGDP != null) {
						gdpValue = c.growthGDP;
					} else if (countryGrowth && countryGrowth.growthGDP != null) {
						gdpValue = countryGrowth.growthGDP;
					}
					
					let popValue = null;
					if (c.growth_population != null) {
						popValue = c.growth_population;
					} else if (c.growthPopulation != null) {
						popValue = c.growthPopulation;
					} else if (countryGrowth && countryGrowth.growthPopulation != null) {
						popValue = countryGrowth.growthPopulation;
					}
					
					let totalValue = null;
					if (c.growth_total != null) {
						totalValue = c.growth_total;
					} else if (c.growthTotal != null) {
						totalValue = c.growthTotal;
					} else if (countryGrowth && countryGrowth.growthTotal != null) {
						totalValue = countryGrowth.growthTotal;
					}
					
					result.push({
						country: c.country,
						growthGDP: gdpValue,
						growthPopulation: popValue,
						growthTotal: totalValue,
						saved_at: c.saved_at
					});
				}
				
				savedCountries = result;
			} else {
				const data = await savedResponse.json();
				if (savedResponse.status === 401) {
					error = 'Please log in to view your saved countries';
				} else {
					error = data.error || 'Failed to fetch saved countries';
				}
			}
		} catch (err) {
			error = 'Failed to fetch saved countries. Please try again.';
			console.error('Error fetching saved countries:', err);
		} finally {
			isLoading = false;
		}
	}
	
	async function unsaveCountry(country: string) {
		const previousCountry = savedCountries.find(c => c.country === country);
		if (!previousCountry) return;
		
		savedCountries = savedCountries.filter(c => c.country !== country);
		
		try {
			const response = await fetch('/saved', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ country, action: 'unsave' })
			});
			
			if (response.ok) {
				toast.success(`Country "${country}" has been removed`, {
					action: {
						label: 'Undo',
						onClick: async () => {
							savedCountries = [previousCountry, ...savedCountries];
							
							await fetch('/saved', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ country, action: 'save' })
							});
						}
					}
				});
			} else {
				const data = await response.json();
				toast.error(data.error || 'Failed to unsave country');
				savedCountries = [previousCountry, ...savedCountries];
			}
		} catch (err) {
			console.error('Error unsaving country:', err);
			toast.error('Failed to unsave country. Please try again.');
			savedCountries = [previousCountry, ...savedCountries];
		}
	}
	
	function formatDate(dateString: string) {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
		} catch {
			return dateString;
		}
	}
	
	onMount(() => {
		fetchSavedCountries();
	});
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Your saved countries list</h1>
		</div>
	</div>

	{#if isLoading}
		<div class="flex items-center justify-center py-12">
			<p class="text-muted-foreground">Loading saved countries...</p>
		</div>
	{:else if error}
		<Card>
			<CardHeader>
				<CardTitle>Error</CardTitle>
				<CardDescription>{error}</CardDescription>
			</CardHeader>
			<CardContent>
				{#if error.includes('log in')}
					<Button href="/login">Go to Login</Button>
				{:else}
					<Button onclick={fetchSavedCountries}>Try Again</Button>
				{/if}
			</CardContent>
		</Card>
	{:else if savedCountries.length === 0}
		<Card class="darkL:bg-[#171717]">
			<CardHeader>
				<CardTitle>No saved countries</CardTitle>
				<CardDescription class="dark:text-[#A1A1A1]">
					You haven't saved any countries yet. Go to the countries page to save some!
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Button href="/countries">Browse Countries</Button>
			</CardContent>
		</Card>
	{:else}
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each savedCountries as savedCountry}
				<Card class="dark:bg-[#171717] border dark:border-[#333333] shadow-lg transition-transform hover:scale-105 duration-300 ease-in-out">
					<CardHeader>
						<div class="flex items-start justify-between">
							<div>
								<CardTitle class="text-xl mb-4">{savedCountry.country}</CardTitle>
								<CardDescription class="dark:text-[#A1A1A1] text-sm">
									<p>
										<span class="dark:text-white">GDP Growth: </span>
										{savedCountry.growthGDP != null ? `${savedCountry.growthGDP.toFixed(2)}%` : 'N/A'}
									</p>
									<p>
										<span class="dark:text-white">Population Growth: </span>
										{savedCountry.growthPopulation != null ? `${savedCountry.growthPopulation.toFixed(2)}%` : 'N/A'}
									</p>
									<p class="mb-6">
										<span class="dark:text-white">Total Growth: </span>
										{savedCountry.growthTotal != null ? `${savedCountry.growthTotal.toFixed(2)}%` : 'N/A'}
									</p>
									<p>Saved on {formatDate(savedCountry.saved_at)}</p>
								</CardDescription>
							</div>
							<BookmarkCheckIcon class="size-5 text-primary" />
						</div>
					</CardHeader>
					<CardContent class="flex gap-2 mt-auto">
						<Button
							href={`/countries/${encodeURIComponent(savedCountry.country)}`}
							variant="default"
							class="flex-1"
						>
							<ExternalLinkIcon class="mr-2 size-4" />
							View Details
						</Button>
						<Button
							onclick={() => unsaveCountry(savedCountry.country)}
							variant="outline"
							class="cursor-pointer"
						>
							Unsave
						</Button>
					</CardContent>
				</Card>
			{/each}
		</div>
	{/if}
</div>

