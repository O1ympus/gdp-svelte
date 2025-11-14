import { Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';
import type { DB } from '../../../generated/db';
import { env } from '$env/dynamic/private';
import path from 'path';
import fs from 'fs';

function getDbPath() {
	if (env.DATABASE_PATH) {
		return env.DATABASE_PATH;
	}
	
	const dataDir = path.join(process.cwd(), 'data');
	if (!fs.existsSync(dataDir)) {
		fs.mkdirSync(dataDir, { recursive: true });
	}
	
	return path.join(dataDir, 'users.db');
}

const dbPath = getDbPath();
const sqliteDb = new Database(dbPath);

export const db = new Kysely<DB>({
	dialect: new SqliteDialect({
		database: sqliteDb
	})
});

let setupPromise: Promise<void> | null = null;

async function ensureTableExists() {
	if (setupPromise) return setupPromise;
	
	setupPromise = (async () => {
		try {
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
				.addColumn('growth_gdp', 'real', (col) => col)
				.addColumn('growth_population', 'real', (col) => col)
				.addColumn('growth_total', 'real', (col) => col)
				.addColumn('saved_at', 'text', (col) => col.notNull().defaultTo('CURRENT_TIMESTAMP'))
				.execute();

			await db.schema
				.createIndex('saved_countries_user_country_unique')
				.ifNotExists()
				.on('saved_countries')
				.columns(['user_id', 'country'])
				.unique()
				.execute();
			
			console.log('Database tables ensured');
		} catch (error) {
			console.error('Error ensuring database tables:', error);
			throw error;
		}
	})();
	
	return setupPromise;
}

ensureTableExists().catch(console.error);

export async function ensureUsersTable() {
	await ensureTableExists();
}
