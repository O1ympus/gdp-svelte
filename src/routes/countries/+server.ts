import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import summaryData from '$lib/server/data/summary.json';

export const GET: RequestHandler = async () => {
	return json(summaryData);
};
