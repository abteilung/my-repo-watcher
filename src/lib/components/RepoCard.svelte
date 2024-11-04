<script lang="ts">
	import { cn } from '$lib/utils';
	let { repo, releases = [] } = $props();

	function getUpdateDaysAgo(dateString) {
		if (!dateString) return 'none';
		const releaseDate = new Date(dateString);
		const now = new Date();
		const diffInDays = (now - releaseDate) / (1000 * 60 * 60 * 24);

		return parseInt(diffInDays);
	}

	function getUpdateStatus(dateString) {
		if (!dateString) return 'none';
		const releaseDate = new Date(dateString);
		const now = new Date();
		const diffInDays = (now - releaseDate) / (1000 * 60 * 60 * 24);

		if (diffInDays <= 3) return 'very-recent';
		if (diffInDays <= 7) return 'recent';
		if (diffInDays <= 14) return 'somewhat-recent';
		return 'old';
	}

	let isRelease = $derived(releases.length > 0 && 'published_at' in releases[0]);
</script>

<div class="rounded-lg bg-white p-3 shadow">
	<h2 class="mb-0 text-2xl font-semibold">
		<a
			href="https://github.com/{repo.owner}/{repo.name}"
			target="_blank"
			rel="noopener noreferrer"
			class="inline-block text-blue-500 hover:underline"
		>
			{repo.owner}/{repo.name}
		</a>
	</h2>
	<h3 class="mb-2 mt-4 text-xl font-semibold">{isRelease ? 'Latest Releases' : 'Latest Tags'}</h3>
	{#if releases.length > 0}
		<ul class="space-y-2">
			{#each releases as item}
				{@const updateStatus = getUpdateStatus(item.published_at)}
				<li
					class="relative flex items-center rounded bg-gray-100 p-2 {isRelease
						? `update-${updateStatus}`
						: ''}"
				>
					<div class="flex-grow">
						<a
							href={isRelease
								? item.html_url
								: `https://github.com/${repo.owner}/${repo.name}/releases/tag/${item.name}`}
							target="_blank"
							rel="noopener noreferrer"
							class="font-medium text-blue-600 hover:underline"
						>
							{item.name || item.tag_name}
						</a>

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
					{@render daysAgo(getUpdateDaysAgo(item.published_at))}
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-gray-600">No releases or tags found.</p>
	{/if}
</div>

{#snippet daysAgo(daysAgo)}
	{@const days = 20}
	<div
		class="absolute bottom-0 left-0 grid h-1 w-full grid-cols-20 divide-x divide-black/10 bg-gray-200"
	>
		{#each Array(days) as _, i}
			<div
				class={cn(i < 7 || i >= 14 ? 'bg-gray-300' : '', i === 20 - daysAgo ? 'bg-green-500' : '')}
			></div>
		{/each}
	</div>
{/snippet}

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
