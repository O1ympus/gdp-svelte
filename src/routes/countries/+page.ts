import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/countries');
	const summary = await res.json();
	return { summary };
};
