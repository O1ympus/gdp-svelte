import type { PageServerLoad } from './$types';
import gdpData from '$lib/server/data/df_all_gdp.json';
import populationData from '$lib/server/data/df_all_population.json';
import summaryData from '$lib/server/data/summary.json';

type CountryData = { Country: string; [year: string]: number | string };
type SummaryData = {
	Country: string;
	growth_gdp: number | null;
	growth_population: number | null;
	growth_total: number | null;
};

export const load: PageServerLoad = async ({ params }) => {
	const countryName = decodeURIComponent(params.country).toLowerCase();

	const countryGDP: CountryData | undefined = gdpData.find(
		(c) => c.Country.toLowerCase() === countryName
	);

	const countryPopulation: CountryData | undefined = populationData.find(
		(c) => c.Country.toLowerCase() === countryName
	);

	const countrySummary: SummaryData | undefined = summaryData.find(
		(c) => c.Country.toLowerCase() === countryName
	);

	return {
		countryGDP,
		countryPopulation,
		countrySummary
	};
};
