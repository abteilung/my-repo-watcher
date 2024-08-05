<script>
	import { onMount } from 'svelte';
	import RepoCard from '$lib/components/RepoCard.svelte';

	let repos = [
		{ owner: 'sveltejs', name: 'svelte' },
		{ owner: 'sveltejs', name: 'kit' },
		{ owner: 'tailwindlabs', name: 'tailwindcss' },
		{ owner: 'directus', name: 'directus' },
		{ owner: 'sanity-io', name: 'sanity' },
		{ owner: 'payloadcms', name: 'payload' },
		{ owner: 'strapi', name: 'strapi' },
		{ owner: 'TryGhost', name: 'Ghost' },
		{ owner: 'WordPress', name: 'WordPress' }
	];
	let releases = {};

	onMount(async () => {
		for (let repo of repos) {
			const response = await fetch(`/api/github?owner=${repo.owner}&repo=${repo.name}`);
			releases[`${repo.owner}/${repo.name}`] = await response.json();
		}
	});
</script>

<div class="container mx-auto px-4">
	<h1 class="mb-8 text-3xl font-bold">GitHub Release Watcher</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each repos as repo}
			<RepoCard {repo} releases={releases[`${repo.owner}/${repo.name}`] || []} />
		{/each}
	</div>
</div>
