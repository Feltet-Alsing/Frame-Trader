import { form } from "$app/server";
import { error, redirect } from "@sveltejs/kit";
import sql from "$lib/db";
import { z } from "zod";

export interface User {
    id?: number;
    username: string;
    password: string;
    created_at?: Date;
}

const userSchema = z.object({
    username: z.string().min(1, 'username is required'),
    password: z.string().min(1, 'password is required')
});

export const createNewUser = form(userSchema, async ({ username, password }) => {
    const [record] = await sql<User[]>`
        INSERT INTO users (username, password)
        VALUES (${username}, ${password})
        RETURNING *
    `;

    return { success: true, data: record };
});


export const login = form(userSchema, async ({ username, password }) => {
    const [user] = await sql<User[]>`
        SELECT * FROM users 
        WHERE username = ${username} 
        AND password = ${password}
    `;

    if (!user) {
        error(401, 'Invalid credentials');
    }

    // Redirect to home page on successful login
    redirect(303, '/');
});