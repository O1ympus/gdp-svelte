import type { LayoutServerLoad } from '@sveltejs/kit';
import { verifyToken } from '$lib/server/jwt';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const token = cookies.get('jwt');
	
	if (!token) {
		return {
			user: null
		};
	}

	const payload = verifyToken(token);
	
	if (!payload) {
		return {
			user: null
		};
	}

	return {
		user: {
			id: payload.id,
			username: payload.username
		}
	};
};

