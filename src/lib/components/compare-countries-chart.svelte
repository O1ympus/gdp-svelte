<script lang="ts">
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { scaleLinear, scaleUtc } from 'd3-scale';
	import { curveNatural } from 'd3-shape';
	import { Area, AreaChart, LinearGradient } from 'layerchart';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
	
	let {
		firstCountry,
		secondCountry,
		metric
	}: {
		firstCountry?: string;
		secondCountry?: string;
		metric?: string;
	} = $props();
	
  let chartData = $state<Array<{ date: Date; [key: string]: Date | number }>>([]);
	let isLoading = $state(false);
	
	function transformData(
		data: any[],
		country1: string,
		country2: string,
		metricType: string
	): Array<{ date: Date; [key: string]: Date | number }> {
		let country1Data = null;
		let country2Data = null;
		
		for (let i = 0; i < data.length; i++) {
			const item = data[i];
			if (item.Country && item.Country.trim() === country1.trim()) {
				country1Data = item;
			}
			if (item.Country && item.Country.trim() === country2.trim()) {
				country2Data = item;
			}
		}
		
		if (!country1Data || !country2Data) {
			return [];
		}
		
		const allKeys = Object.keys(country1Data);
		const yearKeys: string[] = [];
		
		for (let i = 0; i < allKeys.length; i++) {
			const key = allKeys[i];
			if (key !== 'Country') {
				if (/^\d{4}$/.test(key)) {
					yearKeys.push(key);
				}
			}
		}
		
		const yearNumbers: number[] = [];
		for (let i = 0; i < yearKeys.length; i++) {
			yearNumbers.push(parseInt(yearKeys[i]));
		}
		
		yearNumbers.sort((a, b) => {
			if (a < b) return -1;
			if (a > b) return 1;
			return 0;
		});
		
		const result: Array<{ date: Date; [key: string]: Date | number }> = [];
		
		for (let i = 0; i < yearNumbers.length; i++) {
			const year = yearNumbers[i];
			const yearStr = year.toString();
			const value1 = country1Data[yearStr];
			const value2 = country2Data[yearStr];
			
			if (value1 != null && value2 != null) {
				let key1 = '';
				for (let j = 0; j < country1.length; j++) {
					const char = country1[j];
					if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || (char >= '0' && char <= '9')) {
						key1 += char;
					} else {
						key1 += '_';
					}
				}
				
				let key2 = '';
				for (let j = 0; j < country2.length; j++) {
					const char = country2[j];
					if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || (char >= '0' && char <= '9')) {
						key2 += char;
					} else {
						key2 += '_';
					}
				}
				
				let numValue1 = 0;
				if (typeof value1 === 'number') {
					numValue1 = value1;
				} else {
					const parsed = parseFloat(value1);
					if (!isNaN(parsed)) {
						numValue1 = parsed;
					}
				}
				
				let numValue2 = 0;
				if (typeof value2 === 'number') {
					numValue2 = value2;
				} else {
					const parsed = parseFloat(value2);
					if (!isNaN(parsed)) {
						numValue2 = parsed;
					}
				}
				
				const dateObj = new Date(year, 0, 1);
				const dataPoint: any = { date: dateObj };
				dataPoint[key1] = numValue1;
				dataPoint[key2] = numValue2;
				result.push(dataPoint);
			}
		}
		
		return result;
	}
	
	$effect(() => {
		if (!firstCountry || !secondCountry || !metric) {
			chartData = [];
			return;
		}
		
		isLoading = true;
		
		const abortController = new AbortController();
		
		fetch('/compare', { signal: abortController.signal })
			.then((res) => {
				return res.json();
			})
			.then((allData) => {
				if (abortController.signal.aborted) {
					return;
				}
				
				let dataset: any[] = [];
				const metricLower = metric.toLowerCase();
				
				if (metricLower.includes('gdp')) {
					if (allData.gdp) {
						dataset = allData.gdp;
					} else {
						dataset = [];
					}
				} else if (metricLower.includes('population')) {
					if (allData.population) {
						dataset = allData.population;
					} else {
						dataset = [];
					}
				} else {
					if (allData.gdp) {
						dataset = allData.gdp;
					} else {
						dataset = [];
					}
				}
				
				const transformed = transformData(dataset, firstCountry, secondCountry, metric);
				chartData = transformed;
			})
			.catch((error) => {
				if (error.name !== 'AbortError') {
					console.error('Error fetching comparison data:', error);
					chartData = [];
				}
			})
			.finally(() => {
				if (!abortController.signal.aborted) {
					isLoading = false;
				}
			});
		
		return () => {
			abortController.abort();
		};
	});
	
	const color1 = "#3b82f6";
	const color2 = "#06b6d4";
	
	function sanitizeKey(country: string): string {
		let key = '';
		for (let i = 0; i < country.length; i++) {
			const char = country[i];
			if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || (char >= '0' && char <= '9')) {
				key += char;
			} else {
				key += '_';
			}
		}
		return key;
	}
	
	const chartConfig = $derived.by(() => {
		if (!firstCountry || !secondCountry) {
			return {
				country1: { label: "Country 1", color: color1 },
				country2: { label: "Country 2", color: color2 }
			};
		}
		
		const key1 = sanitizeKey(firstCountry);
		const key2 = sanitizeKey(secondCountry);
		
		const config: any = {};
		config[key1] = { label: firstCountry, color: color1 };
		config[key2] = { label: secondCountry, color: color2 };
		return config;
	});
	
	const chartSeries = $derived.by(() => {
		if (!firstCountry || !secondCountry) {
			return [
				{ key: "country1", label: "Country 1", color: color1 },
				{ key: "country2", label: "Country 2", color: color2 }
			];
		}
		
		const key1 = sanitizeKey(firstCountry);
		const key2 = sanitizeKey(secondCountry);
		
		return [
			{ key: key1, label: firstCountry, color: color1 },
			{ key: key2, label: secondCountry, color: color2 }
		];
	});
	
	const maxValue = $derived.by(() => {
		if (chartData.length === 0) {
			return 0;
		}
		
		let currentMax = 0;
		for (let i = 0; i < chartData.length; i++) {
			const entry = chartData[i];
			for (const key in entry) {
				if (key !== 'date') {
					const value = entry[key];
					if (typeof value === 'number') {
						if (value > currentMax) {
							currentMax = value;
						}
					}
				}
			}
		}
		return currentMax;
	});
	
	const yScale = $derived.by(() => {
		const topValue = maxValue * 1.1;
		return scaleLinear().domain([0, topValue]);
	});
  </script>
  
  <Card>
    <CardHeader>
      <CardTitle>Comparing Chart</CardTitle>
      {#if firstCountry && secondCountry}
        <CardDescription>
          Comparing <span class="text-medium dark:text-white text-black">{firstCountry} </span>
          and
          <span class="text-medium dark:text-white text-black"> {secondCountry} </span>
          by
          <span class="text-medium dark:text-white text-black"> {metric} </span>
        </CardDescription>
      {:else}
        <CardDescription>Please select two countries to compare</CardDescription>
      {/if}
    </CardHeader>
    <CardContent>
      {#if isLoading}
        <div class="flex items-center justify-center h-64">
          <p class="text-muted-foreground">Loading chart data...</p>
        </div>
      {:else if chartData.length === 0 && firstCountry && secondCountry}
        <div class="flex items-center justify-center h-64">
          <p class="text-muted-foreground">No data available for selected countries</p>
        </div>
      {:else if chartData.length > 0}
        <Chart.Container config={chartConfig}>
          <AreaChart
            data={chartData}
            x="date"
            xScale={scaleUtc()}
            yScale={yScale}
            yPadding={[20, 40]}
            series={chartSeries}
            seriesLayout="overlap"
            props={{
              area: {
                curve: curveNatural,
                "fill-opacity": 0.4,
                line: { class: "stroke-1" },
                motion: "tween",
              },
              xAxis: {
                format: (v: Date) => v.getFullYear().toString(),
              },
              yAxis: {
                format: (v: number) => {
                  if (v >= 1000000000) return (v / 1000000000).toFixed(0) + 'B';
                  if (v >= 1000000) return (v / 1000000).toFixed(0) + 'M';
                  if (v >= 1000) return (v / 1000).toFixed(0) + 'K';
									if (v < 0) return;
                  return v.toLocaleString();
                }
              },
            }}
          >
            {#snippet tooltip()}
              <Chart.Tooltip
                indicator="dot"
                labelFormatter={(v: Date) => {
                  return v.getFullYear().toString();
                }}
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
      {:else}
        <div class="flex items-center justify-center h-64">
          <p class="text-muted-foreground">Please select two countries and a metric to compare</p>
        </div>
      {/if}
    </CardContent>
  </Card>
