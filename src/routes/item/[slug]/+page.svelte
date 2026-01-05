<script lang="ts">
	import { page } from '$app/state';
	import Goback from '$lib/components/Goback.svelte';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import PriceSection from '$lib/components/PriceSection.svelte';
	import LiveOrdersTable from '$lib/components/LiveOrdersTable.svelte';
	import MarketActivity from '$lib/components/MarketActivity.svelte';
	import { getItems } from '$lib/db/items.remote';
	import { getAllSavedItems } from '$lib/db/savedItems.remote';

	const responsePromise = getItems(page.params.slug ?? '');
	const savedItemsPromise = getAllSavedItems();

	let showMaxRank = $state(false);
</script>

{#await Promise.all([responsePromise, savedItemsPromise])}
	<p>Loading...</p>
{:then [response, savedItems]}
	{@const savedSlugs = new Set(savedItems.map((item) => item.slug))}
	<div class="container">
		<Goback />
		<div class="top-section">
			<ItemCard core={response} {savedSlugs} />
			<PriceSection
				item={response.core}
				stats={response.salesData}
				orders={response.ordersData}
				bind:showMaxRank
			/>
		</div>
		<MarketActivity stats={response.salesData} orders={response.ordersData} />
		<LiveOrdersTable item={response.core} orders={response.ordersData} {showMaxRank} />
	</div>
{:catch error}
	<p>Error: {error.message}</p>
{/await}

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 32px;
		max-width: 1400px;
		margin: 0 auto;
		padding: 32px 20px;
		background: #0f172a;
		min-height: 100vh;
	}

	.top-section {
		display: flex;
		gap: 32px;
	}
</style>
