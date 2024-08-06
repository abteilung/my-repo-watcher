import { GITHUB_TOKEN } from '$env/static/private';
import type { RequestHandler } from './$types';

async function fetchGithubData(url: string) {
	const response = await fetch(url, {
		headers: {
			Authorization: `token ${GITHUB_TOKEN}`,
			'Access-Control-Allow-Origin': '*',
			'Cache-Control': `public, s-maxage=${60 * 60 * 24 * 365}`
		}
	});
	if (!response.ok) {
		throw new Error(`Failed to fetch data: ${response.statusText}`);
	}
	return response.json();
}

export const GET: RequestHandler = async ({ url }) => {
	const owner = url.searchParams.get('owner');
	const repo = url.searchParams.get('repo');

	if (!owner || !repo) {
		return new Response(JSON.stringify({ error: 'Owner and repo are required' }), { status: 400 });
	}

	try {
		// First, try to fetch releases
		let data = await fetchGithubData(
			`https://api.github.com/repos/${owner}/${repo}/releases?per_page=3`
		);

		if (data.length === 0) {
			// If no releases, fetch the latest tags
			data = await fetchGithubData(`https://api.github.com/repos/${owner}/${repo}/tags?per_page=3`);

			// For tags, we need to fetch commit data to get the date
			data = await Promise.all(
				data.map(async (tag) => {
					const commitData = await fetchGithubData(tag.commit.url);
					return {
						...tag,
						commit: commitData,
						published_at: commitData.commit.author.date // Use commit date as published_at
					};
				})
			);
		}

		return new Response(JSON.stringify(data), { status: 200 });
	} catch (error) {
		console.error('Error fetching data:', error);
		return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
	}
};
