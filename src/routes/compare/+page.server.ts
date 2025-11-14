import type { PageServerLoad } from './$types';
import summaryData from '$lib/server/data/summary.json';

export const load: PageServerLoad = async () => {
	const countries = summaryData.map((country: { Country: string }) => country.Country);
	const metrics = Object.keys(summaryData[0])
		.filter((metric: string) => metric !== 'Country' && metric !== 'growth_total')
		.map((metric: string) => metric.replace('growth_', ''))
		.map((metric: string) => metric.charAt(0).toUpperCase() + metric.slice(1));

	return { countries, metrics };
};
