<script lang="ts">
	const { stats, orders } = $props();

	const activityMetrics = $derived.by(() => {
		const rawData = stats?.payload?.statistics_live?.['90days'] || [];
		const sellData = rawData.filter((d: any) => d.order_type === 'sell');

		if (sellData.length === 0) {
			return null;
		}

		// Calculate average daily volume for different periods
		const last7Days = sellData.slice(-7);
		const last30Days = sellData.slice(-30);

		const avgVolume7d =
			last7Days.reduce((sum: number, d: any) => sum + d.volume, 0) / last7Days.length;
		const avgVolume30d =
			last30Days.reduce((sum: number, d: any) => sum + d.volume, 0) / last30Days.length;

		// Calculate trend (is it trading faster recently?)
		const volumeTrend = avgVolume30d > 0 ? ((avgVolume7d - avgVolume30d) / avgVolume30d) * 100 : 0;

		// Count live sellers
		const liveSellerCount =
			orders?.data?.filter((order: any) => order.type === 'sell' && order.user.status === 'ingame')
				.length || 0;

		// Determine activity level
		let activityLevel: 'hot' | 'active' | 'moderate' | 'slow';
		let activityLabel: string;
		let activityIcon: string;

		if (avgVolume7d > 1000) {
			activityLevel = 'hot';
			activityLabel = 'Hot';
			activityIcon = '🔥';
		} else if (avgVolume7d > 500) {
			activityLevel = 'active';
			activityLabel = 'Active';
			activityIcon = '📈';
		} else if (avgVolume7d > 150) {
			activityLevel = 'moderate';
			activityLabel = 'Moderate';
			activityIcon = '📊';
		} else {
			activityLevel = 'slow';
			activityLabel = 'Slow';
			activityIcon = '🐌';
		}

		// Calculate estimated time to clear current supply in minutes
		let timeToSell = null;
		let timeLabel = '';
		if (liveSellerCount > 0 && avgVolume7d > 0) {
			const daysToSell = liveSellerCount / avgVolume7d;
			const minutesToSell = daysToSell * 24 * 60;

			if (minutesToSell < 60) {
				timeToSell = Math.round(minutesToSell);
				timeLabel = `${timeToSell} min`;
			} else if (minutesToSell < 1440) {
				// Less than 24 hours, show in hours
				const hours = (minutesToSell / 60).toFixed(1);
				timeToSell = parseFloat(hours);
				timeLabel = `${hours} hrs`;
			} else {
				// Show in days for very long times
				const days = (minutesToSell / 1440).toFixed(1);
				timeToSell = parseFloat(days);
				timeLabel = `${days} days`;
			}
		}

		return {
			avgVolume7d: Math.round(avgVolume7d),
			avgVolume30d: Math.round(avgVolume30d),
			volumeTrend,
			liveSellerCount,
			activityLevel,
			activityLabel,
			activityIcon,
			timeToSell,
			timeLabel
		};
	});
</script>

{#if activityMetrics}
	<div class="market-activity">
		<h3 class="activity-title">Market Activity</h3>

		<div class="activity-badge {activityMetrics.activityLevel}">
			<span class="badge-icon">{activityMetrics.activityIcon}</span>
			<span class="badge-label">{activityMetrics.activityLabel}</span>
		</div>

		<div class="metrics-grid">
			<div class="metric">
				<span class="metric-label">Avg Daily Volume (7d)</span>
				<span class="metric-value">{activityMetrics.avgVolume7d} trades/day</span>
			</div>

			<div class="metric">
				<span class="metric-label">Avg Daily Volume (30d)</span>
				<span class="metric-value">{activityMetrics.avgVolume30d} trades/day</span>
			</div>

			<div class="metric">
				<span class="metric-label">Volume Trend</span>
				<span
					class="metric-value"
					class:positive={activityMetrics.volumeTrend > 0}
					class:negative={activityMetrics.volumeTrend < 0}
				>
					{activityMetrics.volumeTrend > 0 ? '+' : ''}{activityMetrics.volumeTrend.toFixed(1)}%
				</span>
			</div>

			<div class="metric">
				<span class="metric-label">Live Sellers</span>
				<span class="metric-value">{activityMetrics.liveSellerCount}</span>
			</div>

			{#if activityMetrics.timeToSell}
				<div class="metric full-width">
					<span class="metric-label">Estimated Time to Clear</span>
					<span class="metric-value">{activityMetrics.timeLabel}</span>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.market-activity {
		width: 100%;
		background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
		border-radius: 16px;
		padding: 24px;
		border: 1px solid rgba(75, 85, 99, 0.3);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.3),
			0 4px 6px -2px rgba(0, 0, 0, 0.2);
	}

	.activity-title {
		color: #f3f4f6;
		font-size: 20px;
		font-weight: 700;
		margin: 0 0 20px 0;
		letter-spacing: -0.02em;
	}

	.activity-badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		border-radius: 12px;
		font-weight: 600;
		font-size: 15px;
		margin-bottom: 24px;
	}

	.activity-badge.hot {
		background: rgba(239, 68, 68, 0.15);
		color: #ef4444;
		border: 1px solid rgba(239, 68, 68, 0.3);
	}

	.activity-badge.active {
		background: rgba(16, 185, 129, 0.15);
		color: #10b981;
		border: 1px solid rgba(16, 185, 129, 0.3);
	}

	.activity-badge.moderate {
		background: rgba(59, 130, 246, 0.15);
		color: #3b82f6;
		border: 1px solid rgba(59, 130, 246, 0.3);
	}

	.activity-badge.slow {
		background: rgba(156, 163, 175, 0.15);
		color: #9ca3af;
		border: 1px solid rgba(156, 163, 175, 0.3);
	}

	.badge-icon {
		font-size: 20px;
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	.metric {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.metric.full-width {
		grid-column: 1 / -1;
	}

	.metric-label {
		color: #9ca3af;
		font-size: 13px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.metric-value {
		color: #f3f4f6;
		font-size: 18px;
		font-weight: 700;
	}

	.metric-value.positive {
		color: #10b981;
	}

	.metric-value.negative {
		color: #ef4444;
	}

	@media (max-width: 768px) {
		.metrics-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
