<script lang="ts">
	import { Area, AreaChart, LinearGradient } from 'layerchart';
	import { curveNatural } from 'd3-shape';
	import { scaleLinear, scaleUtc } from 'd3-scale';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.ts';
	
	let { data }: {
		data: {
			type: 'GDP' | 'Population';
			dataset: { Country: string; [year: string]: number | string };
		};
	} = $props();
	
	const countryData = $derived(data.dataset);
	
	let chartData = $state<Array<{ date: Date; value: number }>>([]);
	let maxValue = $state(0);
	let yScale = $state<any>(null);
	
	const chartColor = "#3b82f6";
	
	const chartConfig = {
		value: { label: data.type, color: chartColor }
	} satisfies Chart.ChartConfig;
	
	$effect(() => {
		const currentData = countryData;
		const entries = Object.entries(currentData);
		const dataPoints: Array<{ date: Date; value: number }> = [];
		
		for (let i = 0; i < entries.length; i++) {
			const key = entries[i][0];
			const value = entries[i][1];
			
			if (!isNaN(Number(key))) {
				const year = Number(key);
				const numValue = Number(value);
				const dateObj = new Date(year + '-01-01');
				dataPoints.push({
					date: dateObj,
					value: numValue
				});
			}
		}
		
		chartData = dataPoints;
		
		if (dataPoints.length > 0) {
			let currentMax = 0;
			for (let i = 0; i < dataPoints.length; i++) {
				if (dataPoints[i].value > currentMax) {
					currentMax = dataPoints[i].value;
				}
			}
			maxValue = currentMax;
		} else {
			maxValue = 0;
		}
		
		const topValue = maxValue * 1.1;
		yScale = scaleLinear().domain([0, topValue]);
	});
</script>

{#if countryData}
	<Card class="w-full shadow-lg dark:bg-[#191919]">
		<CardHeader>
			<CardTitle>{countryData.Country} {data.type}</CardTitle>
			<CardDescription>{data.type} over time</CardDescription>
		</CardHeader>
		<CardContent>
			<Chart.Container config={chartConfig}>
				<AreaChart
					data={chartData}
					x="date"
					xScale={scaleUtc()}
					yScale={yScale}
					yPadding={[20, 40]}
					series={[
					{
						key: 'value',
						label: chartConfig.value.label,
						color: chartConfig.value.color
					}
				]}
					props={{
					area: {
						curve: curveNatural,
						'fill-opacity': 0.4,
						line: { class: 'stroke-1' },
						motion: 'tween'
					},
					xAxis: {
						format: (v: Date) => v.getFullYear().toString()
					},
					yAxis: {
						format: (v: number) => {
							if (v < 0) return '';
							if (v >= 1000000000) return (v / 1000000000).toFixed(0) + 'B';
							if (v >= 1000000) return (v / 1000000).toFixed(0) + 'M';
							if (v >= 1000) return (v / 1000).toFixed(0) + 'K';
							return v.toLocaleString();
						}
					}
				}}
				>
					{#snippet tooltip()}
						<Chart.Tooltip
							labelFormatter={(v: Date) => v.getFullYear().toString()}
							indicator="dot"
						/>
					{/snippet}
					{#snippet marks({ series, getAreaProps })}
						{#each series as s, i (s.key)}
							<LinearGradient
								stops={[
									s.color ?? "",
									"color-mix(in srgb, " + s.color + " 15%, transparent)",
								]}
								vertical
							>
								{#snippet children({ gradient })}
									<Area {...getAreaProps(s, i)} fill={gradient} />
								{/snippet}
							</LinearGradient>
						{/each}
					{/snippet}
				</AreaChart>
			</Chart.Container>
		</CardContent>
		<CardFooter>
		</CardFooter>
	</Card>
{:else}
	<p class="text-center text-gray-500 mt-8">Country not found.</p>
{/if}
