<!-- src/lib/components/CacheInfo.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	let buildTime = $state<string | null>(null);
	let currentTime = $state(new Date());
	let error = $state<string | null>(null);

	// Fetch build time on mount
	onMount(async () => {
		try {
			const response = await fetch('/api/build-info');
			if (!response.ok) throw new Error('Failed to fetch build info');
			const data = await response.json();
			buildTime = data.buildTime;
		} catch (e) {
			error = 'Failed to load build time';
			console.error(e);
		}
	});

	// Update current time every second
	$effect(() => {
		const interval = setInterval(() => {
			currentTime = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});

	function getBuildAge() {
		if (!buildTime) return '...';

		const buildDate = new Date(buildTime);
		const diffInSeconds = Math.floor((currentTime - buildDate) / 1000);

		if (diffInSeconds < 60) return `${diffInSeconds}s`;
		if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
		if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
		return `${Math.floor(diffInSeconds / 86400)}d`;
	}
</script>

<div class="fixed bottom-4 right-4 rounded-lg bg-white p-4 shadow-lg">
	<div class="flex flex-col gap-1 text-sm">
		<div class="font-medium text-gray-700">Cache Age</div>
		{#if error}
			<div class="text-red-500">{error}</div>
		{:else}
			<div class="font-mono text-gray-600">{getBuildAge()}</div>
			{#if buildTime}
				<div class="text-xs text-gray-500">
					Built: {new Date(buildTime).toLocaleString()}
				</div>
			{/if}
		{/if}
	</div>
</div>
