import sql from './src/lib/db.js';

async function test() {
    console.log('Testing users table...\n');

    // Insert a test user
    const [newUser] = await sql`
        INSERT INTO users (username, password)
        VALUES ('testuser', 'testpass123')
        RETURNING *
    `;
    console.log('Created user:', newUser);

    // Query all users
    const users = await sql`SELECT * FROM users`;
    console.log('\nAll users:', users);

    await sql.end();
}

test();
