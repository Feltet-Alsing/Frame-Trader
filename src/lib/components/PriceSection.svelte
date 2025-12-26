<script lang="ts">
	import PriceChart from './PriceChart.svelte';

	let { item, stats, orders, showMaxRank = $bindable() } = $props();
</script>

<div class="price-section">
	<PriceChart {item} data={stats} {orders} bind:showMaxRank />
</div>

<style>
	.price-section {
		width: 100%;
	}
</style>
