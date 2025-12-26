<button onclick={() => history.back()} class="back-button">
	<svg
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
		<path d="M19 12H5M12 19l-7-7 7-7" />
	</svg>
	Back
</button>

<style>
	.back-button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 12px 24px;
		background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
		color: #f3f4f6;
		text-decoration: none;
		font-size: 15px;
		font-weight: 600;
		border-radius: 8px;
		border: 1px solid rgba(75, 85, 99, 0.3);
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.3),
			0 2px 4px -1px rgba(0, 0, 0, 0.2);
		transition: all 0.2s ease;
		width: 115px;
		cursor: pointer;
	}

	.back-button:hover {
		background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
		border-color: #10b981;
		color: #10b981;
		transform: translateX(-2px);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.3),
			0 4px 6px -2px rgba(0, 0, 0, 0.2);
	}

	.back-button svg {
		transition: transform 0.2s ease;
	}

	.back-button:hover svg {
		transform: translateX(-3px);
	}
</style>
