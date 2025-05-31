<script>
	import { onMount } from 'svelte';
	import RepoCard from '$lib/components/RepoCard.svelte';
	import CacheInfo from '$lib/components/CacheInfo.svelte';

	let repos = $state([]);
	let categories = $state([]);
	let releases = $state({});
	let isLoading = $state(true);
	let selectedCategory = $state('');
	let sortBy = $state('priority');
	let error = $state(null);

	async function loadData() {
		try {
			isLoading = true;

			// Repos und Kategorien parallel laden
			const [reposResponse, categoriesResponse] = await Promise.all([
				fetch(`/api/repos?category=${selectedCategory}&sort=${sortBy}`),
				fetch('/api/categories')
			]);

			if (!reposResponse.ok) throw new Error('Failed to fetch repos');
			if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');

			const reposData = await reposResponse.json();
			const categoriesData = await categoriesResponse.json();

			repos = reposData.repos;
			categories = categoriesData.categories;

			// GitHub Release-Daten für alle Repos laden
			await loadGitHubReleases();
		} catch (err) {
			console.error('Error loading data:', err);
			error = err.message;
		} finally {
			isLoading = false;
		}
	}

	async function loadGitHubReleases() {
		// Reset releases für neue Repo-Liste
		releases = {};

		const promises = repos.map(async (repo) => {
			try {
				const response = await fetch(`/api/github/${repo.owner}/${repo.repo}`);
				if (!response.ok) throw new Error('Failed to fetch releases');
				const data = await response.json();
				releases[`${repo.owner}/${repo.repo}`] = data;
			} catch (error) {
				console.error(`Error fetching ${repo.owner}/${repo.repo}:`, error);
				releases[`${repo.owner}/${repo.repo}`] = [];
			}
		});

		await Promise.all(promises);
	}

	function sortReposByReleases() {
		if (sortBy === 'latest_release') {
			repos = [...repos].sort((a, b) => {
				const aReleases = releases[`${a.owner}/${a.repo}`] || [];
				const bReleases = releases[`${b.owner}/${b.repo}`] || [];

				const aDate = aReleases[0]?.published_at
					? new Date(aReleases[0].published_at)
					: new Date(0);
				const bDate = bReleases[0]?.published_at
					? new Date(bReleases[0].published_at)
					: new Date(0);

				return bDate - aDate; // Neueste zuerst
			});
		}
	}

	// Filter-Handler
	async function handleCategoryChange() {
		await loadData();
	}

	async function handleSortChange() {
		if (sortBy === 'latest_release') {
			// Nur frontend-seitig sortieren wenn GitHub-Daten schon da sind
			sortReposByReleases();
		} else {
			// Für andere Sortierungen neue Daten von PocketBase holen
			await loadData();
		}
	}

	onMount(() => {
		loadData();
	});
</script>

<svelte:head>
	<title>GitHub Release Watcher</title>
	<meta name="description" content="Track latest releases from your favorite GitHub repositories" />
</svelte:head>

{#if error}
	<div class="mx-auto max-w-2xl px-4 py-12">
		<div class="rounded-lg bg-red-50 border border-red-200 p-4">
			<h2 class="text-lg font-semibold text-red-800 mb-2">⚠️ Error Loading Data</h2>
			<p class="text-red-600">{error}</p>
			<button
				class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
				onclick={() => window.location.reload()}
			>
				Retry
			</button>
		</div>
	</div>
{:else if isLoading}
	<div class="flex justify-center py-12">
		<div class="text-center">
			<div
				class="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4"
			></div>
			<p class="text-gray-600">Loading repositories...</p>
		</div>
	</div>
{:else}
	<div class="mx-auto px-4">
		<div class="mb-8">
			<h1 class="text-3xl font-bold mb-4">GitHub Release Watcher</h1>
			<p class="text-gray-600 mb-6">Track the latest releases from {repos.length} repositories</p>

			<!-- Filter & Sort Controls -->
			<div class="flex flex-wrap gap-4 items-center">
				<!-- Category Filter -->
				<div class="flex items-center gap-2">
					<label for="category" class="text-sm font-medium text-gray-700">Category:</label>
					<select
						id="category"
						bind:value={selectedCategory}
						onchange={handleCategoryChange}
						class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">All Categories</option>
						{#each categories as category}
							<option value={category.name}>
								{category.icon}
								{category.name}
							</option>
						{/each}
					</select>
				</div>

				<!-- Sort Control -->
				<div class="flex items-center gap-2">
					<label for="sort" class="text-sm font-medium text-gray-700">Sort:</label>
					<select
						id="sort"
						bind:value={sortBy}
						onchange={handleSortChange}
						class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="priority">Priority</option>
						<option value="owner">Owner</option>
						<option value="repo">Repository</option>
						<option value="latest_release">Latest Release</option>
					</select>
				</div>

				<!-- Category Legend -->
				{#if categories.length > 0}
					<div class="flex flex-wrap gap-2 ml-auto">
						{#each categories as category}
							<span
								class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
								style="background-color: {category.color}"
							>
								{category.icon}
								{category.name}
							</span>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Repository Grid -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
			{#each repos as repo}
				<RepoCard {repo} releases={releases[`${repo.owner}/${repo.repo}`] || []} {categories} />
			{/each}
		</div>

		{#if repos.length === 0}
			<div class="text-center py-12">
				<p class="text-gray-500 text-lg">No repositories found for the selected filters.</p>
				<button
					class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					onclick={() => {
						selectedCategory = '';
						handleCategoryChange();
					}}
				>
					Show All Repositories
				</button>
			</div>
		{/if}

		<CacheInfo />
	</div>
{/if}
