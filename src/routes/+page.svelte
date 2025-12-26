<script lang="ts">
	import ThumbNail from '$lib/components/ThumbNail.svelte';
	import { getAllSavedItems } from '$lib/db/entities.remote.js';
	import { getItems } from '$lib/db/items.remote';

	const { data } = $props();
	const fetchedItems = $derived(data.fetchedItems);
	const savedItems = $derived(data.savedItems);

	let items: any = $state([]);
	let searchTerm = $state('');
	let selectedCategory = $state('all');
	let displayCount = $state(50);

	let savedItemLength = $state((await getAllSavedItems()).length);

	const categories = [
		{ id: 'all', label: 'All Items', icon: '📦' },
		{ id: 'mod', label: 'Mods', icon: '⚡' },
		{ id: 'arcane_enhancement', label: 'Arcanes', icon: '✨' },
		{ id: 'set', label: 'Sets', icon: '🎁' },
		{ id: 'prime', label: 'Prime', icon: '👑' }
	];

	function search() {
		if (searchTerm !== '' || selectedCategory !== 'all') {
			items = [];
			for (const item of fetchedItems) {
				const matchesSearch =
					searchTerm === '' || item.i18n.en.name.toLowerCase().includes(searchTerm.toLowerCase());
				const matchesCategory = selectedCategory === 'all' || item.tags.includes(selectedCategory);

				if (matchesSearch && matchesCategory) {
					items.push(item);
				}
			}
		} else {
			items = fetchedItems;
		}
		displayCount = 50;
	}
</script>

<div class="container">
	<div class="hero-section">
		<h1 class="page-title">Frametrader</h1>
		<p class="page-subtitle">Real-time trading intelligence</p>

		<div class="search-wrapper">
			<svg
				class="search-icon"
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="11" cy="11" r="8"></circle>
				<path d="m21 21-4.35-4.35"></path>
			</svg>
			<input
				oninput={() => {
					search();
				}}
				class="searchBar"
				bind:value={searchTerm}
				type="search"
				placeholder="Search for items, mods, arcanes..."
			/>
		</div>
		{#if searchTerm !== ''}
			<div class="category-filters">
				{#each categories as category}
					<button
						class="category-btn"
						class:active={selectedCategory === category.id}
						onclick={() => {
							selectedCategory = category.id;
							search();
						}}
					>
						<span class="category-icon">{category.icon}</span>
						{category.label}
					</button>
				{/each}
			</div>
		{:else if savedItemLength !== 0}
			<div class="saved-items-section">
				<h2 class="section-title">
					<span class="title-icon">❤️</span>
					Saved Items
				</h2>
				<div class="item-grid">
					{#each savedItems as savedItem}
						{#await getItems(savedItem.slug) then item}
							{#if item?.core?.i18n?.en}
								<ThumbNail data={item.core} />
							{/if}
						{:catch error}
							<!-- Skip failed loads -->
						{/await}
					{/each}
				</div>
			</div>
		{/if}
	</div>

	{#if searchTerm !== ''}
		<div class="results-header">
			<h2 class="section-title">
				{searchTerm || selectedCategory !== 'all' ? 'Search Results' : 'All Items'}
			</h2>
			<span class="item-count">{items.length.toLocaleString()} items</span>
		</div>
	{/if}
	{#if searchTerm !== ''}
		<div class="item-grid">
			{#each items.slice(0, displayCount) as item}
				<ThumbNail data={item} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		min-height: 100vh;
		background: #0f172a;
		padding: 40px 20px;
		max-width: 1400px;
		margin: 0 auto;
	}

	.hero-section {
		text-align: center;
		margin-bottom: 48px;
	}

	.page-title {
		color: #f3f4f6;
		font-size: 48px;
		font-weight: 800;
		margin: 0 0 8px 0;
		letter-spacing: -0.03em;
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.page-subtitle {
		color: #9ca3af;
		font-size: 18px;
		margin: 0 0 32px 0;
		font-weight: 500;
	}

	.search-wrapper {
		position: relative;
		max-width: 700px;
		margin: 0 auto 24px;
	}

	.search-icon {
		position: absolute;
		left: 20px;
		top: 50%;
		transform: translateY(-50%);
		color: #6b7280;
		pointer-events: none;
		z-index: 1;
	}

	.searchBar {
		width: 100%;
		font-size: 16px;
		background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
		border: 2px solid rgba(75, 85, 99, 0.3);
		border-radius: 16px;
		color: white;
		height: 64px;
		padding: 0 24px 0 52px;
		transition: all 0.3s ease;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.3),
			0 2px 4px -1px rgba(0, 0, 0, 0.2);
	}

	.searchBar:focus {
		outline: none;
		border-color: #10b981;
		box-shadow:
			0 0 0 3px rgba(16, 185, 129, 0.1),
			0 10px 15px -3px rgba(16, 185, 129, 0.2);
	}

	.searchBar::placeholder {
		color: #6b7280;
	}

	.category-filters {
		display: flex;
		gap: 12px;
		justify-content: center;
		flex-wrap: wrap;
	}

	.category-btn {
		background: rgba(31, 41, 55, 0.5);
		border: 1px solid rgba(75, 85, 99, 0.3);
		color: #d1d5db;
		padding: 10px 20px;
		border-radius: 12px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.category-btn:hover {
		border-color: #10b981;
		background: rgba(16, 185, 129, 0.1);
		transform: translateY(-1px);
	}

	.category-btn.active {
		background: rgba(16, 185, 129, 0.15);
		border-color: #10b981;
		color: #10b981;
	}

	.category-icon {
		font-size: 16px;
	}
	.results-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		padding: 0 4px;
	}

	.section-title {
		color: #f3f4f6;
		font-size: 24px;
		font-weight: 700;
		margin: 0;
		letter-spacing: -0.02em;
	}

	.item-count {
		color: #9ca3af;
		font-size: 14px;
		font-weight: 500;
		padding: 6px 12px;
		background: rgba(31, 41, 55, 0.5);
		border-radius: 8px;
		border: 1px solid rgba(75, 85, 99, 0.3);
	}

	.item-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 220px));
		gap: 20px;
		animation: s-y_bCXRrkrYfP-fadeIn 0.5s ease;
		align-items: center;
		justify-content: center;
	}

	.saved-items-section {
		margin-top: 32px;
		padding: 32px;
		background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
		border-radius: 16px;
		border: 1px solid rgba(75, 85, 99, 0.3);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.3),
			0 4px 6px -2px rgba(0, 0, 0, 0.2);
	}

	.saved-items-section .section-title {
		display: flex;
		align-items: center;
		gap: 12px;
		color: #f3f4f6;
		font-size: 28px;
		font-weight: 700;
		margin: 0 0 24px 0;
		letter-spacing: -0.02em;
	}

	.title-icon {
		font-size: 32px;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
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
		.page-title {
			font-size: 32px;
		}

		.page-subtitle {
			font-size: 16px;
		}

		.searchBar {
			height: 56px;
			font-size: 15px;
		}

		.category-filters {
			gap: 8px;
		}

		.category-btn {
			padding: 8px 14px;
			font-size: 13px;
		}

		.item-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			gap: 12px;
		}

		.results-header {
			flex-direction: column;
			gap: 12px;
			align-items: flex-start;
		}
	}
</style>
