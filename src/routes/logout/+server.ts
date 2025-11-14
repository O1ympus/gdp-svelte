import type { RequestHandler } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = ({ cookies }) => {
	cookies.delete('jwt', { path: '/' });
	throw redirect(303, '/login');
};
