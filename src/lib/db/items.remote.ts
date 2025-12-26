import { query } from "$app/server"
import z from "zod";

export const getAllItems = query(async () => {
    const response = await fetch("https://api.warframe.market/v2/items")

    const data = await response.json();

    console.log(data.data);

    return data.data;
})

export const getItems = query(z.string(), async (slug) => {
    const response = await fetch(`https://api.warframe.market/v2/item/${slug}`)
    const sales_response = await fetch(`https://api.warframe.market/v1/items/${slug}/statistics`)
    const orders_response = await fetch(`https://api.warframe.market/v2/orders/item/${slug}`)

    const data = await response.json();
    const sales_data = await sales_response.json();
    const orders_data = await orders_response.json();

    return {
        core: data.data,
        salesData: sales_data,
        ordersData: orders_data
    };
});

export const getSalesData = query(z.string(), async (slug) => {
    const sales_response = await fetch(`https://api.warframe.market/v1/items/${slug}/statistics`)
    const sales_data = await sales_response.json();
    return sales_data;
})
