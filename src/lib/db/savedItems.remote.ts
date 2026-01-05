import { query, form } from '$app/server';
import { z } from 'zod';
import sql from '$lib/db';

export interface SavedItem {
    slug: string;
    created_at?: Date;
}

// Schema for validation
const savedItemSchema = z.object({
    slug: z.string().min(1, 'Slug is required')
});

// QUERY - Get all saved items
export const getAllSavedItems = query(async (): Promise<SavedItem[]> => {
    const records = await sql<SavedItem[]>`
		SELECT * FROM saveditems
		ORDER BY created_at DESC
	`;
    return records;
});

// QUERY - Get saved item by slug
export const getSavedItems = query(z.string(), async (slug: string): Promise<SavedItem | null> => {
    const [record] = await sql<SavedItem[]>`
		SELECT * FROM saveditems
		WHERE slug = ${slug}
	`;
    return record || null;
});

// FORM - Create saved item
export const createSavedItems = form(savedItemSchema, async (data: { slug: string }) => {
    const [record] = await sql<SavedItem[]>`
		INSERT INTO saveditems (slug)
		VALUES (${data.slug})
		RETURNING *
	`;

    // Refresh the getAllSavedItems query to keep UI in sync
    await getAllSavedItems().refresh();

    return { success: true, data: record };
});

// FORM - Delete saved item
export const deleteSavedItems = form(savedItemSchema, async (data: { slug: string }) => {
    await sql`
		DELETE FROM saveditems
		WHERE slug = ${data.slug}
	`;

    // Refresh the getAllSavedItems query to keep UI in sync
    await getAllSavedItems().refresh();

    return { success: true };
});