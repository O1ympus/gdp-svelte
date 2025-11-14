import type { Actions } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { db } from '$lib/server/db';
import { z } from 'zod';

const registerSchema = z.object({
	username: z
		.string({ error: 'Username is required' })
		.min(3, { error: 'Username must be at least 3 characters long' })
		.max(20, { error: 'Username must be at most 20 characters long' })
		.trim(),
	email: z
		.string({ error: 'Email is required' })
		.email({ error: 'Please enter a valid email address' }),
	password: z
		.string({ error: 'Password is required' })
		.min(8, { error: 'Password must be at least 8 characters long' })
		.max(20, { error: 'Password must be at most 20 characters long' })
		.trim(),
	confirmPassword: z
		.string({ error: 'Password confirmation is required' })
		.min(8, { error: 'Password must be at least 8 characters long' })
		.max(20, { error: 'Password must be at most 20 characters long' })
		.trim()
});

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const username = formData.get('username')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const password = formData.get('password')?.toString() || '';
		const confirmPassword = formData.get('confirm-password')?.toString() || '';

		try {
			registerSchema.parse({
				username,
				email,
				password,
				confirmPassword
			});
		} catch (e: any) {
			const { fieldErrors: errors } = e.flatten();

			return {
				data: { username, email },
				errors
			};
		}

		if (password !== confirmPassword) {
			return {
				data: { username, email },
				errors: { confirmPassword: ['Passwords do not match'] }
			};
		}

		try {
			const existingUser = await db
				.selectFrom('users')
				.select(['id'])
				.where('email', '=', email)
				.executeTakeFirst();

			if (existingUser) {
				return {
					data: { username, email },
					errors: { email: ['Email already registered'] }
				};
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			await db
				.insertInto('users')
				.values({
					username: username,
					email: email,
					password: hashedPassword,
					roles: 'user'
				})
				.execute();

			return { success: true };
		} catch (error: any) {
			console.error('Registration error:', error);
			return {
				data: { username, email },
				errors: { _errors: ['Registration failed. Please try again.'] }
			};
		}
	}
};
