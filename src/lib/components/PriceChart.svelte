<script lang="ts">
	import {
		Chart,
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		CategoryScale,
		Title,
		Tooltip,
		Legend
	} from 'chart.js';

	Chart.register(
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		CategoryScale,
		Title,
		Tooltip,
		Legend
	);

	let { item, data, orders, showMaxRank = $bindable() } = $props();

	let canvasElement: HTMLCanvasElement;
	let chart: Chart | null = null;

	// Transform the data for the chart
	const chartData = $derived.by(() => {
		const rawData = data?.payload?.statistics_live?.['48hours'] || [];

		// Filter to only show sell orders
		const filteredData = rawData.filter((d: any) => {
			// Always filter by sell orders
			if (d.order_type !== 'sell') return false;
			// For items without ranks (sets), mod_rank doesn't exist - include all
			if (!item?.maxRank) return true;
			// For items with ranks, filter by selected rank
			const targetRank = showMaxRank ? item.maxRank : 0;
			return d.mod_rank === targetRank;
		});

		return {
			labels: filteredData.map((d: any) => {
				const date = new Date(d.datetime);
				return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
			}),
			datasets: [
				{
					label: 'Lowest Sell Price',
					data: filteredData.map((d: any) => d.min_price),
					borderColor: '#10b981',
					backgroundColor: 'rgba(16, 185, 129, 0.1)',
					borderWidth: 2,
					tension: 0.4,
					fill: true,
					pointRadius: 0,
					pointHoverRadius: 4,
					pointBackgroundColor: '#10b981',
					pointBorderColor: '#064e3b',
					pointBorderWidth: 2
				}
			]
		};
	});

	// Calculate current stats
	const priceStats = $derived.by(() => {
		const rawData = data?.payload?.statistics_live?.['48hours'] || [];
		const filteredData = rawData.filter((d: any) => {
			if (d.order_type !== 'sell') return false;
			if (!item?.maxRank) return true;
			const targetRank = showMaxRank ? item.maxRank : 0;
			return d.mod_rank === targetRank;
		});

		if (filteredData.length === 0) return null;

		// Get current price from live orders (lowest sell)
		const liveOrders = orders?.payload?.orders || [];
		const targetRank = showMaxRank ? item?.maxRank || 0 : 0;

		const sellOrders = liveOrders.filter(
			(o: any) =>
				o.order_type === 'sell' &&
				o.user.status === 'ingame' &&
				(item?.maxRank ? o.mod_rank === targetRank : true)
		);

		const currentPrice =
			sellOrders.length > 0
				? Math.min(...sellOrders.map((o: any) => o.platinum))
				: filteredData[filteredData.length - 1].min_price;

		const oldest = filteredData[0];
		const change = currentPrice - oldest.min_price;
		const changePercent = oldest.min_price > 0 ? (change / oldest.min_price) * 100 : 0;

		return {
			current: currentPrice,
			low: Math.min(...filteredData.map((d: any) => d.min_price)),
			high: Math.max(...filteredData.map((d: any) => d.max_price)),
			change,
			changePercent
		};
	});

	$effect(() => {
		if (canvasElement && chartData.datasets[0].data.length > 0) {
			// Destroy existing chart if it exists
			if (chart) {
				chart.destroy();
			}

			// Create new chart
			chart = new Chart(canvasElement, {
				type: 'line',
				data: chartData,
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							position: 'top',
							labels: {
								color: '#d1d5db',
								font: {
									size: 13,
									family: "'Inter', sans-serif"
								},
								padding: 15
							}
						},
						title: {
							display: true,
							text: 'Price History (90 days)',
							color: '#f3f4f6',
							font: {
								size: 16,
								weight: 'bold',
								family: "'Inter', sans-serif"
							},
							padding: {
								top: 10,
								bottom: 20
							}
						},
						tooltip: {
							backgroundColor: 'rgba(17, 24, 39, 0.95)',
							titleColor: '#f3f4f6',
							bodyColor: '#d1d5db',
							borderColor: '#374151',
							borderWidth: 1,
							padding: 12,
							displayColors: true,
							callbacks: {
								label: function (context) {
									return context.dataset.label + ': ' + context.parsed.y + ' plat';
								}
							}
						}
					},
					scales: {
						y: {
							beginAtZero: false,
							grid: {
								color: 'rgba(75, 85, 99, 0.3)'
							},
							ticks: {
								color: '#9ca3af',
								font: {
									size: 12
								},
								callback: function (value) {
									return value + ' p';
								}
							},
							title: {
								display: true,
								text: 'Platinum',
								color: '#d1d5db',
								font: {
									size: 13,
									weight: 'bold'
								}
							}
						},
						x: {
							grid: {
								color: 'rgba(75, 85, 99, 0.2)'
							},
							ticks: {
								color: '#9ca3af',
								maxRotation: 45,
								minRotation: 45,
								font: {
									size: 11
								}
							}
						}
					}
				}
			});

			return () => {
				if (chart) {
					chart.destroy();
				}
			};
		}
	});
</script>

{#if chartData.datasets[0].data.length > 0}
	<div class="chart-wrapper">
		<div class="header">
			{#if priceStats}
				<div class="price-stats">
					<div class="stat-item current">
						<span class="stat-label">Current Price</span>
						<span class="stat-value">{priceStats.current.toFixed(0)} plat</span>
					</div>
					<div class="stat-item">
						<span class="stat-label">48h Change</span>
						<span
							class="stat-value"
							class:positive={priceStats.change > 0}
							class:negative={priceStats.change < 0}
						>
							{priceStats.change > 0 ? '+' : ''}{priceStats.change.toFixed(0)} plat ({priceStats.changePercent >
							0
								? '+'
								: ''}{priceStats.changePercent.toFixed(1)}%)
						</span>
					</div>
				</div>
			{/if}
			{#if item?.maxRank}
				<button class="rank-toggle" onclick={() => (showMaxRank = !showMaxRank)}>
					{showMaxRank ? `Max Rank (${item.maxRank})` : 'Rank 0'}
				</button>
			{/if}
		</div>
		<div class="chart-container">
			<canvas bind:this={canvasElement}></canvas>
		</div>
	</div>
{:else}
	<p class="no-data">No price data available</p>
{/if}

<style>
	.chart-wrapper {
		background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
		border-radius: 16px;
		padding: 24px;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.3),
			0 4px 6px -2px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(75, 85, 99, 0.3);
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		padding-bottom: 24px;
		border-bottom: 1px solid rgba(75, 85, 99, 0.3);
	}

	.price-stats {
		display: flex;
		gap: 32px;
	}

	.rank-toggle {
		background: rgba(16, 185, 129, 0.1);
		border: 1px solid #10b981;
		color: #10b981;
		padding: 8px 16px;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.2s;
	}

	.rank-toggle:hover {
		background: rgba(16, 185, 129, 0.2);
		transform: translateY(-1px);
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.stat-item.current .stat-value {
		color: #10b981;
		font-size: 1.5rem;
		font-weight: bold;
	}

	.stat-label {
		color: #9ca3af;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat-value {
		color: #f3f4f6;
		font-size: 1.125rem;
		font-weight: 600;
	}

	.stat-value.positive {
		color: #10b981;
	}

	.stat-value.negative {
		color: #ef4444;
	}

	.chart-container {
		height: 400px;
		position: relative;
	}

	.no-data {
		color: #9ca3af;
		text-align: center;
		padding: 48px;
		background: #1f2937;
		border-radius: 16px;
		border: 1px solid rgba(75, 85, 99, 0.3);
	}
</style>
