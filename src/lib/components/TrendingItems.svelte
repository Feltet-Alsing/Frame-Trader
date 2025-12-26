<script lang="ts">
	import ThumbNail from './ThumbNail.svelte';

	const { items } = $props();

	// Get top trending items (you can modify logic to sort by actual market data)
	const trendingItems = $derived(items.slice(0, 12));
</script>

<div class="trending-section">
	<div class="section-header">
		<div class="header-content">
			<div class="icon-wrapper">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
					<polyline points="16 7 22 7 22 13"></polyline>
				</svg>
			</div>
			<div>
				<h2 class="section-title">Trending Now</h2>
				<p class="section-subtitle">Most active items on the market</p>
			</div>
		</div>
		<a href="#" class="view-all-link">
			View All
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="9 18 15 12 9 6"></polyline>
			</svg>
		</a>
	</div>

	<div class="trending-grid">
		{#each trendingItems as item}
			<ThumbNail data={item} />
		{/each}
	</div>
</div>

<style>
	.trending-section {
		margin-bottom: 64px;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32px;
		padding: 0 4px;
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.icon-wrapper {
		width: 48px;
		height: 48px;
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1));
		border: 1px solid rgba(16, 185, 129, 0.3);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #10b981;
	}

	.section-title {
		color: #f3f4f6;
		font-size: 28px;
		font-weight: 700;
		margin: 0 0 4px 0;
		letter-spacing: -0.02em;
	}

	.section-subtitle {
		color: #9ca3af;
		font-size: 14px;
		margin: 0;
		font-weight: 500;
	}

	.view-all-link {
		display: flex;
		align-items: center;
		gap: 6px;
		color: #10b981;
		text-decoration: none;
		font-size: 14px;
		font-weight: 600;
		padding: 8px 16px;
		border-radius: 8px;
		transition: all 0.2s ease;
		border: 1px solid transparent;
	}

	.view-all-link:hover {
		background: rgba(16, 185, 129, 0.1);
		border-color: rgba(16, 185, 129, 0.3);
		transform: translateX(2px);
	}

	.trending-grid {
		display: flex;
		gap: 20px;
		overflow-x: auto;
		overflow-y: hidden;
		padding: 4px;
		margin: 0 -20px;
		padding-left: 20px;
		padding-right: 20px;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: thin;
		scrollbar-color: rgba(16, 185, 129, 0.5) rgba(31, 41, 55, 0.3);
	}

	.trending-grid::-webkit-scrollbar {
		height: 8px;
	}

	.trending-grid::-webkit-scrollbar-track {
		background: rgba(31, 41, 55, 0.3);
		border-radius: 4px;
		margin: 0 20px;
	}

	.trending-grid::-webkit-scrollbar-thumb {
		background: rgba(16, 185, 129, 0.5);
		border-radius: 4px;
		transition: background 0.2s ease;
	}

	.trending-grid::-webkit-scrollbar-thumb:hover {
		background: rgba(16, 185, 129, 0.7);
	}

	.trending-grid > :global(*) {
		flex-shrink: 0;
		width: 220px;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.section-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 16px;
		}

		.section-title {
			font-size: 22px;
		}

		.icon-wrapper {
			width: 40px;
			height: 40px;
		}

		.trending-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			gap: 12px;
		}
	}
</style>
