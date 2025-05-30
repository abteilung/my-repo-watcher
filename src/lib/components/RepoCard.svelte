<script lang="ts">
	import type { GithubRepo } from '$lib/repos';

	interface Release {
		name: string;
		published_at: string;
		html_url: string;
	}

	let { repo, releases = [] as Release[] } = $props();

	function getUpdateDaysAgo(dateString: string | null): number {
		if (!dateString) return Number.MAX_SAFE_INTEGER;

		try {
			const releaseDate = new Date(dateString);
			const now = new Date();
			return Math.floor((now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24));
		} catch {
			return Number.MAX_SAFE_INTEGER;
		}
	}

	function getUpdateStatus(dateString: string | null): string {
		if (!dateString) return 'none';
		const releaseDate = new Date(dateString);
		const now = new Date();
		const diffInDays = (now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24);

		if (diffInDays <= 3) return 'very-recent';
		if (diffInDays <= 7) return 'recent';
		if (diffInDays <= 14) return 'somewhat-recent';
		return 'old';
	}

	let isRelease = $derived(releases.length > 0 && 'published_at' in releases[0]);
</script>

<div class="rounded-lg bg-white p-3 drop-shadow-lg dark:bg-gray-900 dark:text-white">
	<h2 class="mb-0 text-2xl font-semibold">
		<a
			href="https://github.com/{repo.owner}/{repo.repo}"
			target="_blank"
			rel="noopener noreferrer"
			class="inline-block text-blue-500 hover:underline dark:text-blue-300"
		>
			{repo.owner}/{repo.repo}
		</a>
	</h2>
	<h3 class="mb-2 mt-4 text-xl font-semibold">{isRelease ? 'Latest Releases' : 'Latest Tags'}</h3>
	{#if releases.length > 0}
		<ul class="space-y-2">
			{#each releases as item}
				{@const updateStatus = getUpdateStatus(item.published_at)}
				<li
					class="relative flex items-center rounded border-r-4 bg-gray-100 p-2 dark:bg-gray-900
				{updateStatus === 'very-recent' ? 'border-green-500 bg-green-100 dark:bg-green-800 ' : ''}
				{updateStatus === 'somewhat-recent' ? 'border-orange-300 dark:border-orange-500' : ''}
				{updateStatus === 'old' ? 'border-gray-300 dark:border-gray-700' : ''}"
				>
					<div class="flex-grow">
						<a
							href={isRelease
								? item.html_url
								: `https://github.com/${repo.owner}/${repo.name}/releases/tag/${item.name}`}
							target="_blank"
							rel="noopener noreferrer"
							class="cursor-pointer font-medium text-blue-600 hover:underline dark:text-white"
						>
							{item.name || item.tag_name}
						</a>

						{#if isRelease}
							<span class="ml-2 cursor-pointer text-gray-600 dark:text-gray-400"
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
	{@const position = daysAgo <= 19 ? 19 - daysAgo : -1}

	<div
		class="absolute bottom-0 left-0 grid h-1 w-full grid-cols-20 divide-x divide-black/10 bg-gray-200"
	>
		{#each Array(days) as _, i}
			<div class={i === position ? 'bg-green-500' : 'bg-gray-300'}></div>
		{/each}
	</div>
{/snippet}

<style>
	.update-very-recent {
		@apply border-r-4 border-green-500 bg-green-100;
	}
	.dark .update-very-recent {
		@apply bg-green-500;
	}

	.update-somewhat-recent {
		@apply border-r-4 border-orange-300;
	}
	.dark .update-somewhat-recent {
		@apply border-orange-500;
	}

	.update-old {
		@apply border-r-4 border-gray-300;
	}
	.dark .update-old {
		@apply border-gray-700;
	}
</style>
