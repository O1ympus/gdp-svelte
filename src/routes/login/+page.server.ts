import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db, ensureUsersTable } from '$lib/server/db';
import bcrypt from 'bcrypt';
import { signToken } from '$lib/server/jwt.ts';
import { z } from 'zod';

const registerSchema = z.object({
	email: z
		.string({ error: 'Email is required' })
		.email({ error: 'Please enter a valid email address' }),
	password: z
		.string({ error: 'Password is required' })
		.min(8, { error: 'Password must be at least 8 characters long' })
		.max(20, { error: 'Password must be at most 20 characters long' })
		.trim()
});

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();

		const email = formData.get('email')?.toString() || '';
		const password = formData.get('password')?.toString() || '';

		try {
			registerSchema.parse({
				email,
				password
			});
		} catch (e: any) {
			const { fieldErrors: errors } = e.flatten();

			return {
				data: { email },
				errors
			};
		}

		try {
			await ensureUsersTable();
			
			const user = await db
				.selectFrom('users')
				.selectAll()
				.where('email', '=', email)
				.executeTakeFirst();

			if (!user) {
				return {
					data: { email },
					errors: { _errors: ['Invalid email or password!'] }
				};
			}

			const isValid = await bcrypt.compare(password, user.password);

			if (!isValid) {
				return {
					data: { email },
					errors: { password: ['Invalid password!'] }
				};
			}

			const token = signToken({ id: user.id!, username: user.username });

			cookies.set('jwt', token, {
				httpOnly: true,
				path: '/',
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 60 * 60 * 24
			});
		} catch (e: any) {
			return {
				data: { email },
				errors: { _errors: ['An unexpected error occurred. Please try again later.'] }
			};
		}

		throw redirect(303, '/');
	}
};
