import type { Handle } from '@sveltejs/kit';
import sql from '$lib/db';
import type { User } from '$lib/db/users.remote';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get('session');

    if (sessionId) {
        // Verify session and get user
        const [session] = await sql<Array<{ user_id: number }>>`
			SELECT user_id FROM sessions WHERE id = ${sessionId}
		`;

        if (session) {
            const [user] = await sql<User[]>`
				SELECT id, username, created_at FROM users WHERE id = ${session.user_id}
			`;

            if (user) {
                event.locals.user = user;
            }
        }
    }

    return resolve(event);
};
