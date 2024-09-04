<script>
	import { onMount } from 'svelte';
	import RepoCard from '$lib/components/RepoCard.svelte';

	let repos = [
		{ owner: 'coollabsio', name: 'coolify' },
		{ owner: 'dani-garcia', name: 'vaultwarden' },
		{ owner: 'directus', name: 'directus' },
		{ owner: 'duplicati', name: 'duplicati' },
		{ owner: 'elastic', name: 'elasticsearch' },
		{ owner: 'FredrikNoren', name: 'ungit' },
		{ owner: 'huntabyte', name: 'shadcn-svelte' },
		{ owner: 'Lissy93', name: 'dashy' },
		{ owner: 'louislam', name: 'uptime-kuma' },
		{ owner: 'makeplane', name: 'plane' },
		{ owner: 'meilisearch', name: 'meilisearch' },
		{ owner: 'nicolargo', name: 'glances' },
		{ owner: 'paul-gauthier', name: 'aider' },
		{ owner: 'payloadcms', name: 'payload' },
		{ owner: 'pi-hole', name: 'pi-hole' },
		{ owner: 'pocketbase', name: 'pocketbase' },
		{ owner: 'sanity-io', name: 'sanity' },
		{ owner: 'strapi', name: 'strapi' },
		{ owner: 'sveltejs', name: 'kit' },
		{ owner: 'sveltejs', name: 'svelte' },
		{ owner: 'tailwindlabs', name: 'tailwindcss' },
		{ owner: 'tinacms', name: 'tinacms' },
		{ owner: 'TryGhost', name: 'Ghost' },
		{ owner: 'twentyhq', name: 'twenty' },
		{ owner: 'TYPO3', name: 'typo3' },
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

<div class=" mx-auto px-4">
	<h1 class="mb-8 text-3xl font-bold">GitHub Release Watcher</h1>

	<div
		class="grid grid-cols-1 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
	>
		{#each repos as repo}
			<RepoCard {repo} releases={releases[`${repo.owner}/${repo.name}`] || []} />
		{/each}
	</div>
</div>
