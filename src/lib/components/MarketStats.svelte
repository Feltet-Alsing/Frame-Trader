<script lang="ts">
	const { totalItems, filteredCount } = $props();
</script>

<div class="stats-container">
	<div class="stat-card">
		<div class="stat-icon">📦</div>
		<div class="stat-content">
			<div class="stat-value">{totalItems.toLocaleString()}</div>
			<div class="stat-label">Total Items</div>
		</div>
	</div>

	<div class="stat-card">
		<div class="stat-icon">🔍</div>
		<div class="stat-content">
			<div class="stat-value">{filteredCount.toLocaleString()}</div>
			<div class="stat-label">Search Results</div>
		</div>
	</div>

	<div class="stat-card">
		<div class="stat-icon">🔥</div>
		<div class="stat-content">
			<div class="stat-value">Live</div>
			<div class="stat-label">Market Status</div>
		</div>
	</div>

	<div class="stat-card">
		<div class="stat-icon">📈</div>
		<div class="stat-content">
			<div class="stat-value">Active</div>
			<div class="stat-label">Trading</div>
		</div>
	</div>
</div>

<style>
	.stats-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
		width: 100%;
		margin-bottom: 32px;
	}

	.stat-card {
		background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
		border: 1px solid rgba(16, 185, 129, 0.2);
		border-radius: 16px;
		padding: 24px;
		display: flex;
		align-items: center;
		gap: 16px;
		transition: all 0.3s ease;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.3),
			0 2px 4px -1px rgba(0, 0, 0, 0.2);
	}

	.stat-card:hover {
		transform: translateY(-2px);
		border-color: #10b981;
		box-shadow:
			0 10px 15px -3px rgba(16, 185, 129, 0.2),
			0 4px 6px -2px rgba(16, 185, 129, 0.1);
	}

	.stat-icon {
		font-size: 32px;
		line-height: 1;
	}

	.stat-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.stat-value {
		color: #10b981;
		font-size: 28px;
		font-weight: 700;
		line-height: 1;
	}

	.stat-label {
		color: #9ca3af;
		font-size: 13px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	@media (max-width: 768px) {
		.stats-container {
			grid-template-columns: repeat(2, 1fr);
			gap: 12px;
		}

		.stat-card {
			padding: 16px;
		}

		.stat-icon {
			font-size: 24px;
		}

		.stat-value {
			font-size: 20px;
		}
	}
</style>
