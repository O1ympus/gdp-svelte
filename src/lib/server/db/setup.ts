import { db } from './index.ts';

async function setup() {
	await db.schema
		.createTable('users')
		.ifNotExists()
		.addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
		.addColumn('username', 'text', (col) => col.notNull())
		.addColumn('email', 'text', (col) => col.notNull().unique())
		.addColumn('password', 'text', (col) => col.notNull())
		.addColumn('roles', 'text', (col) => col.notNull())
		.execute();

	await db.schema
		.createTable('saved_countries')
		.ifNotExists()
		.addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
		.addColumn('user_id', 'integer', (col) => col.notNull())
		.addColumn('country', 'text', (col) => col.notNull())
		.addColumn('growth_gdp', 'text', (col) => col.notNull())
		.addColumn('growth_population', 'text', (col) => col.notNull())
		.addColumn('growth_total', 'text', (col) => col.notNull())
		.addColumn('saved_at', 'text', (col) => col.notNull().defaultTo('CURRENT_TIMESTAMP'))
		.execute();

	await db.schema
		.createIndex('saved_countries_user_country_unique')
		.ifNotExists()
		.on('saved_countries')
		.columns(['user_id', 'country'])
		.unique()
		.execute();

	console.log('Database setup complete');
}

setup().catch(console.error);
