<!-- src/lib/components/CacheInfo.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	let buildTime = $state<string | null>(null);
	let lastModified = $state<string | null>(null);
	let maxAge = $state<number | null>(null);
	let currentTime = $state(new Date());
	let error = $state<string | null>(null);

	// Fetch build time and cache info on mount
	onMount(async () => {
		try {
			// Fetch first repo to get cache headers
			const repoResponse = await fetch('/api/github/sveltejs/svelte');
			if (!repoResponse.ok) throw new Error('Failed to fetch repo data');

			// Get cache information from headers
			const cacheControl = repoResponse.headers.get('cache-control');
			if (cacheControl) {
				const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
				if (maxAgeMatch) {
					maxAge = parseInt(maxAgeMatch[1]);
				}
			}
			lastModified = repoResponse.headers.get('last-modified');

			// Get build time
			const buildResponse = await fetch('/api/build-info');
			if (!buildResponse.ok) throw new Error('Failed to fetch build info');
			const data = await buildResponse.json();
			buildTime = data.buildTime;
		} catch (e) {
			error = 'Failed to load cache info';
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

	function getNextRefresh() {
		if (!lastModified || !maxAge) return '...';

		const lastModifiedDate = new Date(lastModified);
		const nextRefresh = new Date(lastModifiedDate.getTime() + maxAge * 1000);
		const diffInSeconds = Math.floor((nextRefresh - currentTime) / 1000);

		if (diffInSeconds <= 0) return 'Cache expired';

		const minutes = Math.floor(diffInSeconds / 60);
		const seconds = diffInSeconds % 60;
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}

	function getProgressPercentage() {
		if (!lastModified || !maxAge) return 0;

		const lastModifiedDate = new Date(lastModified);
		const elapsed = currentTime.getTime() - lastModifiedDate.getTime();
		const percentage = (elapsed / (maxAge * 1000)) * 100;

		return Math.min(100, Math.max(0, percentage));
	}
</script>

<div class="fixed bottom-4 right-4 rounded-lg bg-white p-4 shadow-lg">
	<div class="flex flex-col gap-1 text-sm">
		<div class="font-medium text-gray-700">Cache Status</div>
		{#if error}
			<div class="text-red-500">{error}</div>
		{:else}
			<div class="font-mono text-gray-600">Age: {getBuildAge()}</div>
			<div class="font-mono text-gray-600">Next refresh: {getNextRefresh()}</div>
			<div class="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-200">
				<div
					class="h-full bg-blue-500 transition-all duration-1000"
					style="width: {getProgressPercentage()}%"
				/>
			</div>
			{#if lastModified}
				<div class="text-xs text-gray-500">
					Last Modified: {new Date(lastModified).toLocaleString()}
				</div>
			{/if}
			{#if buildTime}
				<div class="text-xs text-gray-500">
					Built: {new Date(buildTime).toLocaleString()}
				</div>
			{/if}
		{/if}
	</div>
</div>
