<script>
	export let repo;
	export let releases = [];

	function getUpdateStatus(dateString) {
		if (!dateString) return 'none';
		const releaseDate = new Date(dateString);
		const now = new Date();
		const diffInDays = (now - releaseDate) / (1000 * 60 * 60 * 24);

		if (diffInDays <= 1) return 'very-recent';
		if (diffInDays <= 7) return 'recent';
		if (diffInDays <= 14) return 'somewhat-recent';
		return 'old';
	}

	$: isRelease = releases.length > 0 && 'published_at' in releases[0];
</script>

<div class="rounded-lg bg-white p-6 shadow">
	<h2 class="mb-2 text-2xl font-semibold">{repo.owner}/{repo.name}</h2>
	<a
		href="https://github.com/{repo.owner}/{repo.name}"
		target="_blank"
		rel="noopener noreferrer"
		class="mb-4 inline-block text-blue-500 hover:underline"
	>
		View on GitHub
	</a>

	<h3 class="mb-2 mt-4 text-xl font-semibold">{isRelease ? 'Latest Releases' : 'Latest Tags'}</h3>
	{#if releases.length > 0}
		<ul class="space-y-2">
			{#each releases as item}
				{@const updateStatus = getUpdateStatus(item.published_at)}
				<li
					class="flex items-center rounded bg-gray-100 p-2 {isRelease
						? `update-${updateStatus}`
						: ''}"
				>
					<div class="flex-grow">
						<span class="font-medium">{item.name || item.tag_name}</span>
						{#if isRelease}
							<span class="ml-2 text-gray-600"
								>{new Date(item.published_at).toLocaleDateString()}</span
							>
						{/if}
					</div>
					{#if isRelease && updateStatus !== 'old'}
						<span class="ml-2 text-sm font-medium">
							{#if updateStatus === 'very-recent'}
								Very Recent
							{:else if updateStatus === 'recent'}
								Recent
							{:else}
								Somewhat Recent
							{/if}
						</span>
					{/if}
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-gray-600">No releases or tags found.</p>
	{/if}
</div>

<style>
	.update-very-recent {
		@apply border-r-4 border-green-500 bg-green-100;
	}
	.update-recent {
		@apply border-r-4 border-green-300;
	}
	.update-somewhat-recent {
		@apply border-r-4 border-orange-300;
	}
	.update-old {
		@apply border-r-4 border-gray-300;
	}
</style>
