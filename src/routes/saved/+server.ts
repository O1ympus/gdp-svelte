import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { verifyToken } from '$lib/server/jwt';
import { db } from '$lib/server/db';

async function ensureTable() {
	try {
		await (db as any).schema
			.createTable('saved_countries')
			.ifNotExists()
			.addColumn('id', 'integer', (col: any) => col.primaryKey().autoIncrement())
			.addColumn('user_id', 'integer', (col: any) => col.notNull())
			.addColumn('country', 'text', (col: any) => col.notNull())
			.addColumn('growth_gdp', 'real', (col: any) => col)
			.addColumn('growth_population', 'real', (col: any) => col)
			.addColumn('growth_total', 'real', (col: any) => col)
			.addColumn('saved_at', 'text', (col: any) => col.notNull().defaultTo('CURRENT_TIMESTAMP'))
			.execute();
	} catch (error) {}
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	const token = cookies.get('jwt');

	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const payload = verifyToken(token);

	if (!payload) {
		return json({ error: 'Invalid token' }, { status: 401 });
	}

	const { country, growthGDP, growthPopulation, growthTotal, action } = await request.json();

	if (!country || typeof country !== 'string') {
		return json({ error: 'Country is required' }, { status: 400 });
	}

		if (action === 'save') {
		try {
			await ensureTable();
			let values: any = {
				user_id: payload.id,
				country: country,
				saved_at: new Date().toISOString()
			};

			if (growthGDP !== null && growthGDP !== undefined) {
				values.growth_gdp = growthGDP;
			}
			if (growthPopulation !== null && growthPopulation !== undefined) {
				values.growth_population = growthPopulation;
			}
			if (growthTotal !== null && growthTotal !== undefined) {
				values.growth_total = growthTotal;
			}

			try {
				await (db as any).insertInto('saved_countries').values(values).execute();
			} catch (insertError: any) {
				const errorMsg = insertError?.message || '';
				const hasColumnError = errorMsg.includes('no such column');
				const hasGrowthError = errorMsg.includes('growth_');
				
				if (hasColumnError || hasGrowthError) {
					values = {
						user_id: payload.id,
						country: country,
						saved_at: new Date().toISOString()
					};
					await (db as any).insertInto('saved_countries').values(values).execute();
				} else {
					throw insertError;
				}
			}

			return json({ success: true, message: 'Country saved' });
		} catch (error: any) {
			const errorMessage = error?.message || '';
			const errorCode = error?.code || '';
			
			const isUniqueError = errorCode === 'SQLITE_CONSTRAINT_UNIQUE';
			const hasUniqueInMessage = errorMessage.includes('UNIQUE constraint') || errorMessage.includes('UNIQUE');
			
			if (isUniqueError || hasUniqueInMessage) {
				return json({ error: 'Country already saved' }, { status: 409 });
			}
			
			console.error('Error saving country:', error);
			return json({ error: 'Failed to save country' }, { status: 500 });
		}
	} else if (action === 'unsave') {
		try {
			await ensureTable();
			await (db as any)
				.deleteFrom('saved_countries')
				.where('user_id', '=', payload.id)
				.where('country', '=', country)
				.execute();

			return json({ success: true, message: 'Country unsaved' });
		} catch (error) {
			console.error('Error unsaving country:', error);
			return json({ error: 'Failed to unsave country' }, { status: 500 });
		}
	} else {
		return json({ error: 'Invalid action. Use "save" or "unsave"' }, { status: 400 });
	}
};

export const GET: RequestHandler = async ({ cookies }) => {
	const token = cookies.get('jwt');

	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const payload = verifyToken(token);

	if (!payload) {
		return json({ error: 'Invalid token' }, { status: 401 });
	}

	try {
		await ensureTable();
		let savedCountries;
		
		try {
			savedCountries = await (db as any)
				.selectFrom('saved_countries')
				.select(['country', 'growth_gdp', 'growth_population', 'growth_total', 'saved_at'])
				.where('user_id', '=', payload.id)
				.orderBy('saved_at', 'desc')
				.execute();
		} catch (selectError: any) {
			const errorMsg = selectError?.message || '';
			const hasColumnError = errorMsg.includes('no such column');
			const hasGrowthError = errorMsg.includes('growth_');
			
			if (hasColumnError || hasGrowthError) {
				savedCountries = await (db as any)
					.selectFrom('saved_countries')
					.select(['country', 'saved_at'])
					.where('user_id', '=', payload.id)
					.orderBy('saved_at', 'desc')
					.execute();
			} else {
				throw selectError;
			}
		}

		return json({ countries: savedCountries });
	} catch (error: any) {
		console.error('Error fetching saved countries:', error);
		let errorMessage = 'Unknown error';
		if (error?.message) {
			errorMessage = error.message;
		}
		return json({ error: 'Failed to fetch saved countries: ' + errorMessage }, { status: 500 });
	}
};
