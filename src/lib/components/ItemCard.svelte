<script lang="ts">
	import { createSavedItems, deleteSavedItems, getSavedItems } from '$lib/db/entities.remote';

	const { core, savedSlugs } = $props();

	const itemData = $derived(core.core.i18n.en);

	let item = $derived((await getSavedItems(core.core.slug)) ?? '');

	const isLiked = $derived(item.slug !== undefined);

	let liked = $state(isLiked);

	// Check if item is part of a set (prime parts, blueprints, components)
	const isSetItem = $derived.by(() => {
		const name = itemData.name.toLowerCase();
		const isPrime = core.core.tags.includes('prime');
		const hasPartName =
			/\s(blueprint|blade|barrel|chassis|systems|neuroptics|handle|receiver|grip|link|stock|upper limb|lower limb|string)\s*$/i.test(
				itemData.name
			);
		return isPrime && hasPartName;
	});

	// Extract set name from item name (e.g., "Reaper Prime Blade" -> "reaper_prime_set")
	const setSlug = $derived.by(() => {
		if (!isSetItem) return null;
		const name = itemData.name.toLowerCase();
		// Extract prime/base name before the part name
		const match = name.match(
			/^(.+?)\s(prime)\s(?:blueprint|blade|barrel|chassis|systems|neuroptics|handle|receiver|grip|link|stock|upper limb|lower limb|string)/
		);
		if (match) {
			return match[1].replace(/\s+/g, '_') + '_prime_set';
		}
		return null;
	});
</script>

<div class="card">
	<div class="image-container">
		<img
			class="image"
			src="https://warframe.market/static/assets/{itemData.icon}"
			alt={itemData.name}
		/>
	</div>
	<div class="flex-box">
		<h1 class="title">{itemData.name}</h1>
		{#if !isLiked}
			<form {...createSavedItems}>
				<input type="hidden" name="slug" value={core.core.slug} />
				<button
					class="pin"
					class:liked
					type="submit"
					aria-label={liked ? 'Unlike item' : 'Like item'}
				>
					<ion-icon name={liked ? 'heart' : 'heart-outline'}></ion-icon>
				</button>
			</form>
		{:else}
			<form {...deleteSavedItems}>
				<input type="hidden" name="slug" value={core.core.slug} />
				<button
					class="pin"
					class:liked
					type="submit"
					aria-label={liked ? 'Unlike item' : 'Like item'}
				>
					<ion-icon name={liked ? 'heart' : 'heart-outline'}></ion-icon>
				</button>
			</form>
		{/if}
	</div>
	{#if isSetItem && setSlug}
		<a href="/item/{setSlug}" class="set-link" data-sveltekit-reload>
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
				<rect x="3" y="3" width="7" height="7"></rect>
				<rect x="14" y="3" width="7" height="7"></rect>
				<rect x="14" y="14" width="7" height="7"></rect>
				<rect x="3" y="14" width="7" height="7"></rect>
			</svg>
			View Complete Set
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
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
	{/if}

	<p class="description">{@html itemData.description}</p>

	<div class="tags">
		{#each core.core.tags as tag}
			<span class="tag">{tag.replace(/_/g, ' ')}</span>
		{/each}
	</div>
</div>

<style>
	.card {
		max-width: 400px;
		display: flex;
		flex-direction: column;
		background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.3),
			0 4px 6px -2px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
		padding: 32px;
		border-radius: 16px;
		border: 1px solid rgba(75, 85, 99, 0.3);
		padding-top: 15px;
	}

	.image-container {
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 12px;
		padding: 20px;
		margin-bottom: 24px;
		border: 1px solid rgba(75, 85, 99, 0.2);
	}

	.image {
		max-width: 200px;
		height: auto;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
	}

	.title {
		color: #f3f4f6;
		font-size: 28px;
		font-weight: 700;
		margin: 0 0 12px 0;
		letter-spacing: -0.02em;
	}

	.set-link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: #10b981;
		text-decoration: none;
		font-size: 14px;
		font-weight: 600;
		padding: 8px 16px;
		background: rgba(16, 185, 129, 0.1);
		border: 1px solid rgba(16, 185, 129, 0.3);
		border-radius: 8px;
		transition: all 0.2s ease;
		margin-bottom: 16px;
	}

	.set-link:hover {
		background: rgba(16, 185, 129, 0.2);
		border-color: rgba(16, 185, 129, 0.5);
		transform: translateX(2px);
	}

	.set-link svg {
		flex-shrink: 0;
	}

	.description {
		color: #d1d5db;
		font-size: 15px;
		line-height: 1.6;
		margin: 0 0 20px 0;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tag {
		background: rgba(16, 185, 129, 0.15);
		border: 1px solid rgba(16, 185, 129, 0.3);
		color: #10b981;
		padding: 6px 14px;
		border-radius: 20px;
		font-size: 13px;
		font-weight: 600;
		text-transform: capitalize;
		transition: all 0.2s ease;
	}

	.tag:hover {
		background: rgba(16, 185, 129, 0.25);
		border-color: rgba(16, 185, 129, 0.5);
		transform: translateY(-1px);
	}
	.pin {
		background: none;
		border-style: none;
		text-align: start;
		padding: 5px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.pin:hover {
		transform: scale(1.1);
	}

	.pin.liked ion-icon {
		color: #ef4444;
		filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.6));
	}

	ion-icon {
		font-size: 32px;
		color: #9ca3af;
		transition: color 0.2s ease;
	}

	.pin:hover ion-icon {
		color: #ef4444;
	}
	.flex-box {
		display: flex;
		align-items: center;
	}
</style>
