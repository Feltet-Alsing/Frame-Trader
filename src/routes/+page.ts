import { getAllItems } from '$lib/db/items.remote';
import { getAllSavedItems } from '$lib/db/entities.remote';

export async function load() {
    const [fetchedItems, savedItems] = await Promise.all([
        getAllItems(),
        getAllSavedItems()
    ]);

    return {
        fetchedItems,
        savedItems
    };
}
