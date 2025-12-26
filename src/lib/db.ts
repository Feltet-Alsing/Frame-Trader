import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sveltekit_db';

if (!process.env.DATABASE_PUBLIC_URL && !process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_PUBLIC_URL and DATABASE_URL not set, using default localhost connection');
}

const sql = postgres(databaseUrl, {
    max: 10,
    idle_timeout: 20
});

export default sql;
