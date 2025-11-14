import { db } from '../src/lib/server/db/index.ts';

await db
	.insertInto('users')
	.values({
		username: 'alice',
		email: 'alice2@gmail.com',
		password: '12345678',
		roles: 'user'
	})
	.execute();

const users = await db.selectFrom('users').selectAll().execute();

console.log(users);
