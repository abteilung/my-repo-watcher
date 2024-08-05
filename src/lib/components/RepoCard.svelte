<script>
	export let repo;
	export let releases = [];

	function isLessThanWeekOld(dateString) {
		if (!dateString) return false;
		const releaseDate = new Date(dateString);
		const now = new Date();

		// one week means the repos are recently updated
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		return releaseDate > weekAgo;
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
				<li
					class="flex items-center rounded bg-gray-100 p-2 {isRelease &&
					isLessThanWeekOld(item.published_at)
						? 'border-r-4 border-green-300'
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
					{#if isRelease && isLessThanWeekOld(item.published_at)}
						<span class="ml-2 text-sm font-medium text-green-500">New</span>
					{/if}
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-gray-600">No releases or tags found.</p>
	{/if}
</div>
