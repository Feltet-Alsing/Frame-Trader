import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL not set, using default localhost connection');
}

const sql = postgres(process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sveltekit_db', {
    max: 10,
    idle_timeout: 20
});

export default sql;
