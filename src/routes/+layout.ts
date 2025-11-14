import type { LayoutLoad } from '@sveltejs/kit';
import { user } from '$lib/stores/user';

export const load: LayoutLoad = ({ data }) => {
	user.set(data.user ?? null);
	
	return {};
};

