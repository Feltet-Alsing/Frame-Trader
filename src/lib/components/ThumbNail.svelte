<script lang="ts">
	const { data } = $props();

	const core = $derived(data.i18n.en);
</script>

<a href="/item/{data.slug}">
	<div class="thumbnail-container">
		<div class="corner-accent top-left"></div>
		<div class="corner-accent top-right"></div>
		<div class="corner-accent bottom-left"></div>
		<div class="corner-accent bottom-right"></div>
		<div class="glow-effect"></div>
		<img class="image" src="https://warframe.market/static/assets/{core.icon}" alt={core.name} />
		<h1>{core.name}</h1>
	</div>
</a>

<style>
	a {
		text-decoration: none;
		color: inherit;
	}

	h1 {
		font-size: 15px;
		font-weight: 600;
		color: #f3f4f6;
		margin: 0;
		line-height: 1.3;
		z-index: 1;
	}

	img {
		max-width: 116px;
		max-height: 133px;
		object-fit: contain;
		z-index: 1;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
		transition: transform 0.3s ease;
	}

	.thumbnail-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 9px;
		background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
		padding: 2px;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.3),
			0 4px 6px -2px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(75, 85, 99, 0.3);
		flex-direction: column;
		min-height: 190px;
		text-align: center;
		overflow: visible;
		transition: all 0.3s ease;
		border-radius: 12px;
	}

	.thumbnail-container::before {
		content: '';
		position: absolute;
		inset: -1px;
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.1));
		border-radius: 12px;
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: -1;
	}

	.thumbnail-container:hover {
		transform: translateY(-4px);
		border-color: #10b981;
		box-shadow:
			0 20px 25px -5px rgba(16, 185, 129, 0.2),
			0 10px 10px -5px rgba(16, 185, 129, 0.1);
	}

	.thumbnail-container:hover::before {
		opacity: 1;
	}

	.thumbnail-container:hover img {
		transform: scale(1.05);
	}

	.thumbnail-container:hover .glow-effect {
		opacity: 0.15;
	}

	.thumbnail-container:hover .corner-accent {
		opacity: 1;
	}

	/* Animated glow effect on hover */
	.glow-effect {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%);
		transform: translate(-50%, -50%);
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
		z-index: 0;
	}

	/* Corner decorations */
	.corner-accent {
		position: absolute;
		width: 16px;
		height: 16px;
		border: 2px solid #10b981;
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 2;
	}

	.corner-accent.top-left {
		top: 10px;
		left: 10px;
		border-right: none;
		border-bottom: none;
	}

	.corner-accent.top-right {
		top: 10px;
		right: 10px;
		border-left: none;
		border-bottom: none;
	}

	.corner-accent.bottom-left {
		bottom: 10px;
		left: 10px;
		border-right: none;
		border-top: none;
	}

	.corner-accent.bottom-right {
		bottom: 10px;
		right: 10px;
		border-left: none;
		border-top: none;
	}
</style>
