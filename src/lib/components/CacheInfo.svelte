<!-- src/lib/components/CacheInfo.svelte -->
<script lang="ts">
	let buildTime = $state(new Date().toISOString());
	let currentTime = $state(new Date());

	// Update current time every second
	$effect(() => {
		const interval = setInterval(() => {
			currentTime = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});

	function getBuildAge() {
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
		<div class="font-mono text-gray-600">{getBuildAge()}</div>
		<div class="text-xs text-gray-500">
			Built: {new Date(buildTime).toLocaleString()}
		</div>
	</div>
</div>
