import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import gdpData from '$lib/server/data/df_all_gdp.json';
import populationData from '$lib/server/data/df_all_population.json';

export const GET: RequestHandler = async () => {
	return json({ gdp: gdpData, population: populationData });
};
