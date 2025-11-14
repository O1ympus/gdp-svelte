import { writable } from 'svelte/store';

export interface User {
	id: number;
	username: string;
}

export const user = writable<User | null>(null);
