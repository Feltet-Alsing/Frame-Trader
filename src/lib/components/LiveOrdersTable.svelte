<script lang="ts">
	const { item, orders, showMaxRank } = $props();

	const maxRank = $derived(item?.maxRank || 0);

	const copyWhisper = async (order: any) => {
		const itemName = item?.i18n?.en?.name || 'item';
		const rank = maxRank > 0 ? ` (Rank ${order.rank})` : '';
		const message = `/w ${order.user.ingameName} Hi! I would like to buy ${itemName}${rank} for ${order.platinum}p`;

		try {
			await navigator.clipboard.writeText(message);
			// Could add a toast notification here
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	};

	// Filter orders based on selected rank and online status
	const filteredOrders = $derived.by(() => {
		if (!orders?.data) return [];

		const targetRank = showMaxRank ? maxRank : 0;
		const allOrders = orders.data;

		// Check if this item has ranks
		const hasRanks = maxRank > 0;

		if (!hasRanks) {
			// For items without ranks (e.g., some arcanes), just show online sellers
			return allOrders
				.filter(
					(order: any) =>
						order.type === 'sell' &&
						(order.user.status === 'ingame' || order.user.status === 'online')
				)
				.sort((a: any, b: any) => a.platinum - b.platinum)
				.slice(0, 10);
		}

		// For items with ranks, filter by target rank
		const filtered = allOrders
			.filter(
				(order: any) =>
					order.type === 'sell' && order.user.status === 'ingame' && order.rank === targetRank
			)
			.sort((a: any, b: any) => a.platinum - b.platinum)
			.slice(0, 10);

		// If no orders at target rank, show rank 0 as fallback
		if (filtered.length === 0 && targetRank !== 0) {
			return allOrders
				.filter(
					(order: any) =>
						order.type === 'sell' &&
						(order.user.status === 'ingame' || order.user.status === 'online') &&
						order.rank === 0
				)
				.sort((a: any, b: any) => a.platinum - b.platinum)
				.slice(0, 10);
		}

		return filtered;
	});

	const displayRank = $derived.by(() => {
		if (filteredOrders.length === 0) return null;
		const targetRank = showMaxRank ? maxRank : 0;
		return targetRank;
	});
</script>

{#if filteredOrders.length > 0}
	<div class="sellers-table">
		<h2 class="table-title">
			Top Live Sell Orders (Online)
			{#if maxRank > 0 && displayRank !== null}
				<span class="rank-info">- Rank {displayRank}</span>
			{/if}
		</h2>
		<table>
			<thead>
				<tr>
					<th>Seller</th>
					<th>Price</th>
					<th>Quantity</th>
					{#if maxRank > 0}
						<th>Rank</th>
					{/if}
					<th>Status</th>
					<th>Buy</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredOrders as order}
					<tr>
						<td class="seller-name">{order.user?.ingameName || 'Unknown'}</td>
						<td class="price-cell">{order.platinum}p</td>
						<td>{order.quantity}</td>
						{#if maxRank > 0}
							<td>
								<span class="rank-badge">{order.rank}</span>
							</td>
						{/if}
						<td>
							<span class="status-badge {order.user.status}">
								● {order.user.status === 'ingame' ? 'In Game' : 'Online'}
							</span>
						</td>
						<td>
							<button
								class="copy-btn"
								onclick={() => copyWhisper(order)}
								title="Copy whisper message"
							>
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
									<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
									<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
								</svg>
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<div class="sellers-table">
		<p class="no-orders">
			{#if maxRank > 0}
				No live orders available for Rank {showMaxRank ? maxRank : 0}
			{:else}
				No live orders available
			{/if}
		</p>
	</div>
{/if}

<style>
	.sellers-table {
		width: 100%;
		background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
		border-radius: 16px;
		padding: 24px;
		border: 1px solid rgba(75, 85, 99, 0.3);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.3),
			0 4px 6px -2px rgba(0, 0, 0, 0.2);
	}

	.table-title {
		color: #f3f4f6;
		font-size: 20px;
		font-weight: 700;
		margin: 0 0 20px 0;
		letter-spacing: -0.02em;
	}

	.fallback-note {
		font-size: 13px;
		color: #9ca3af;
		font-weight: 400;
		margin-left: 8px;
	}

	.rank-info {
		font-size: 15px;
		color: #9ca3af;
		font-weight: 500;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	thead {
		background: rgba(0, 0, 0, 0.3);
		border-bottom: 2px solid rgba(75, 85, 99, 0.4);
	}

	th {
		text-align: left;
		padding: 16px;
		color: #9ca3af;
		font-size: 13px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	tbody tr {
		border-bottom: 1px solid rgba(75, 85, 99, 0.2);
		transition: background 0.2s ease;
	}

	tbody tr:hover {
		background: rgba(16, 185, 129, 0.05);
	}

	tbody tr:last-child {
		border-bottom: none;
	}

	td {
		padding: 16px;
		color: #d1d5db;
		font-size: 14px;
	}

	.seller-name {
		color: #f3f4f6;
		font-weight: 600;
	}

	.price-cell {
		color: #10b981;
		font-weight: 700;
		font-size: 16px;
	}

	.status-badge {
		color: #10b981;
		font-size: 13px;
		font-weight: 500;
		padding: 4px 10px;
		border-radius: 12px;
		background: rgba(16, 185, 129, 0.1);
		display: inline-block;
	}

	.rank-badge {
		background: rgba(59, 130, 246, 0.1);
		color: #3b82f6;
		padding: 4px 10px;
		border-radius: 6px;
		font-weight: 600;
		font-size: 13px;
	}

	.no-rank {
		color: #6b7280;
		font-size: 14px;
	}

	.no-orders {
		color: #9ca3af;
		text-align: center;
		padding: 32px;
	}

	.copy-btn {
		background: rgba(16, 185, 129, 0.1);
		border: 1px solid rgba(16, 185, 129, 0.2);
		color: #10b981;
		padding: 6px 8px;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.copy-btn:hover {
		background: rgba(16, 185, 129, 0.2);
		border-color: #10b981;
		transform: translateY(-1px);
	}

	.copy-btn:active {
		transform: translateY(0);
	}

	.copy-btn svg {
		width: 16px;
		height: 16px;
	}
</style>
