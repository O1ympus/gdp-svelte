import type { RequestHandler } from './$types';
import path from 'path';
import { json } from '@sveltejs/kit';

const dataFile = path.resolve('src/lib/server/data/summary.json');

export const GET: RequestHandler = async () => {
	const summary = await import(dataFile).then((m) => m.default);
	return json(summary);
};
