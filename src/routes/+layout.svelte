<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if data.user}
	<div style="padding: 1rem; background: #f0f0f0;">
		Logged in as: <strong>{data.user.username}</strong>
	</div>
{/if}

{@render children()}
