<script>
	import { onMount } from 'svelte';
	import RepoCard from '$lib/components/RepoCard.svelte';
	import { repos } from '$lib/repos';

	let releases = $state({});

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
			}
		});

		// Warte auf alle Requests
		await Promise.all(promises);
	});
</script>

<div class="mx-auto px-4">
	<h1 class="mb-8 text-3xl font-bold">GitHub Release Watcher</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
		{#each repos as repo}
			<RepoCard {repo} releases={releases[`${repo.owner}/${repo.repo}`] || []} />
		{/each}
	</div>
</div>
