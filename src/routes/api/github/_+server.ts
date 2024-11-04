import { GITHUB_TOKEN } from "$env/static/private";
import type { RequestHandler } from "./$types";
import { repos } from "$lib/repos";

export const prerender = true;

// Definiere die bekannten Repos
const ALLOWED_REPOS = repos;

async function fetchGithubData(url: string) {
	const response = await fetch(url, {
		headers: {
			Authorization: `token ${GITHUB_TOKEN}`,
			"Access-Control-Allow-Origin": "*",
			"Cache-Control": `public, s-maxage=${60 * 60 * 24 * 365}`,
		},
	});
	if (!response.ok) {
		throw new Error(`Failed to fetch data: ${response.statusText}`);
	}
	return response.json();
}

async function getRepoData(owner: string, repo: string) {
	try {
		// Erst Releases versuchen
		let data = await fetchGithubData(
			`https://api.github.com/repos/${owner}/${repo}/releases?per_page=3`,
		);

		if (data.length === 0) {
			// Falls keine Releases, dann Tags holen
			data = await fetchGithubData(
				`https://api.github.com/repos/${owner}/${repo}/tags?per_page=3`,
			);

			// Für Tags brauchen wir zusätzlich die Commit-Daten für das Datum
			data = await Promise.all(
				data.map(async (tag) => {
					const commitData = await fetchGithubData(tag.commit.url);
					return {
						...tag,
						commit: commitData,
						published_at: commitData.commit.author.date,
					};
				}),
			);
		}
		return { status: 200, data };
	} catch (error) {
		console.error(`Error fetching data for ${owner}/${repo}:`, error);
		return { status: 500, error: "Failed to fetch data" };
	}
}

// Generiere alle Routen zur Build-Zeit
export const entries = () => {
	return ALLOWED_REPOS.map(({ owner, repo }) => ({
		owner,
		repo,
	}));
};

export const GET: RequestHandler = async ({ url }) => {
	const owner = url.searchParams.get("owner");
	const repo = url.searchParams.get("repo");

	if (!owner || !repo) {
		return new Response(
			JSON.stringify({ error: "Owner and repo are required" }),
			{ status: 400 },
		);
	}

	// Prüfe ob die Kombination erlaubt ist
	if (!ALLOWED_REPOS.some((r) => r.owner === owner && r.repo === repo)) {
		return new Response(
			JSON.stringify({ error: "Repository not allowed" }),
			{ status: 400 },
		);
	}

	const result = await getRepoData(owner, repo);

	return new Response(
		JSON.stringify(result.data),
		{
			status: result.status,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "public, max-age=3600",
			},
		},
	);
};
