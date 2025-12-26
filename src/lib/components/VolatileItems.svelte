<script lang="ts">
	import ThumbNail from './ThumbNail.svelte';

	const { items } = $props();
</script>

<div class="volatile-section">
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
					<path d="M3 3v18h18"></path>
					<path d="M7 12l4-4 4 4 5-5"></path>
					<circle cx="7" cy="12" r="1"></circle>
					<circle cx="11" cy="8" r="1"></circle>
					<circle cx="15" cy="12" r="1"></circle>
					<circle cx="20" cy="7" r="1"></circle>
				</svg>
			</div>
			<div>
				<h2 class="section-title">Price Movers</h2>
				<p class="section-subtitle">Items with significant price changes</p>
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

	<div class="volatile-grid">
		{#each items as item}
			<ThumbNail data={item} />
		{/each}
	</div>
</div>

<style>
	.volatile-section {
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
		background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1));
		border: 1px solid rgba(245, 158, 11, 0.3);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #f59e0b;
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
		color: #f59e0b;
		text-decoration: none;
		font-size: 14px;
		font-weight: 600;
		padding: 8px 16px;
		border-radius: 8px;
		transition: all 0.2s ease;
		border: 1px solid transparent;
	}

	.view-all-link:hover {
		background: rgba(245, 158, 11, 0.1);
		border-color: rgba(245, 158, 11, 0.3);
		transform: translateX(2px);
	}

	.volatile-grid {
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
		scrollbar-color: rgba(245, 158, 11, 0.5) rgba(31, 41, 55, 0.3);
	}

	.volatile-grid::-webkit-scrollbar {
		height: 8px;
	}

	.volatile-grid::-webkit-scrollbar-track {
		background: rgba(31, 41, 55, 0.3);
		border-radius: 4px;
		margin: 0 20px;
	}

	.volatile-grid::-webkit-scrollbar-thumb {
		background: rgba(245, 158, 11, 0.5);
		border-radius: 4px;
		transition: background 0.2s ease;
	}

	.volatile-grid::-webkit-scrollbar-thumb:hover {
		background: rgba(245, 158, 11, 0.7);
	}

	.volatile-grid > :global(*) {
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
	}
</style>
