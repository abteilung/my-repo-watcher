<script>
	import { onMount } from 'svelte';
	import RepoCard from '$lib/components/RepoCard.svelte';
	import CacheInfo from '$lib/components/CacheInfo.svelte'; // Neue Import
	import { repos } from '$lib/repos';

	let releases = $state({});
	let isLoading = $state(true);

	onMount(async () => {
		// Alle Requests parallel ausführen für bessere Performance
		const promises = repos.map(async (repo) => {
			try {
				const response = await fetch(`/api/github/${repo.owner}/${repo.repo}`);
				if (!response.ok) throw new Error('Failed to fetch');
				const data = await response.json();
				releases[`${repo.owner}/${repo.repo}`] = data;
			} catch (error) {
				console.error(`Error fetching ${repo.owner}/${repo.repo}:`, error);
				releases[`${repo.owner}/${repo.repo}`] = []; // Leeres Array bei Fehler
			} finally {
				isLoading = false;
			}
		});

		// Warte auf alle Requests
		await Promise.all(promises);
	});
</script>

{#if isLoading}
	<div class="flex justify-center py-12">
		<div
			class="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
		></div>
	</div>
{:else}
	<div class="mx-auto px-4">
		<h1 class="my-8 text-3xl font-bold">GitHub Release Watcher</h1>

		<div <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			>
			{#each repos as repo}
				<RepoCard {repo} releases={releases[`${repo.owner}/${repo.repo}`] || []} />
			{/each}
		</div>
		<CacheInfo />
	</div>
{/if}
