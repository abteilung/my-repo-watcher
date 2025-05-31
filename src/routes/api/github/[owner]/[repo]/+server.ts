// routes/api/github/[owner]/[repo]/+server.js
import { GITHUB_TOKEN, POCKETBASE_URL, REDIS_URL } from '$env/static/private';
import PocketBase from 'pocketbase';
import { createClient } from 'redis';

export const prerender = false;

// Constants
const RELEASES_PER_PAGE = 3;
const CACHE_DURATION = 60 * 60; // 1 hour in seconds

// PocketBase client
const pb = new PocketBase(POCKETBASE_URL || 'http://pocketbase:8090');

// Redis client
let redisClient = null;
if (REDIS_URL) {
	redisClient = createClient({ url: REDIS_URL });
	redisClient.on('error', (err) => console.log('Redis Client Error', err));
	redisClient.connect().catch(console.error);
}

/**
 * Get cached GitHub data from Redis
 */
async function getCachedData(owner, repo) {
	if (!redisClient) return null;

	try {
		const cached = await redisClient.get(`github:${owner}:${repo}`);
		return cached ? JSON.parse(cached) : null;
	} catch (error) {
		console.warn('Redis get error:', error);
		return null;
	}
}

/**
 * Cache GitHub data in Redis
 */
async function setCachedData(owner, repo, data) {
	if (!redisClient) return;

	try {
		await redisClient.setEx(`github:${owner}:${repo}`, CACHE_DURATION, JSON.stringify(data));
	} catch (error) {
		console.warn('Redis set error:', error);
	}
}
class GithubApiError extends Error {
	constructor(status, message) {
		super(message);
		this.name = 'GithubApiError';
		this.status = status;
	}
}

// Validate GitHub token
if (!GITHUB_TOKEN || typeof GITHUB_TOKEN !== 'string') {
	throw new Error('GitHub token is not configured properly');
}

/**
 * Fetches data from GitHub API with proper error handling
 */
async function fetchGithubData(url) {
	const response = await fetch(url, {
		headers: {
			Authorization: `token ${GITHUB_TOKEN}`,
			Accept: 'application/vnd.github.v3+json',
			'Cache-Control': `public, s-maxage=${CACHE_DURATION}`
		}
	});

	if (!response.ok) {
		if (response.status === 403) {
			const rateLimitReset = response.headers.get('X-RateLimit-Reset');
			throw new GithubApiError(
				response.status,
				`Rate limit exceeded. Resets at ${new Date(Number(rateLimitReset) * 1000).toISOString()}`
			);
		}
		throw new GithubApiError(response.status, `GitHub API error: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Validates owner and repo name format
 */
function validateRepoParams(owner, repo) {
	return /^[\w.-]+$/.test(owner) && /^[\w.-]+$/.test(repo);
}

// Cache für erlaubte Repos
let allowedReposCache = null;
let cacheExpiry = 0;
const REPO_CACHE_DURATION = 5 * 60 * 1000; // 5 Minuten

/**
 * Get cached allowed repos list
 */
async function getAllowedRepos() {
	const now = Date.now();

	// Return cached data if still valid
	if (allowedReposCache && now < cacheExpiry) {
		return allowedReposCache;
	}

	try {
		console.log('🔄 Refreshing allowed repos cache...');
		const allRepos = await pb.collection('repos').getFullList();

		// Cache the repo list
		allowedReposCache = new Set(allRepos.map((r) => `${r.owner}/${r.repo}`));
		cacheExpiry = now + REPO_CACHE_DURATION;

		console.log(`✅ Cached ${allowedReposCache.size} allowed repos`);
		return allowedReposCache;
	} catch (error) {
		console.error('Failed to load allowed repos:', error.message);

		// Return empty set if failed and no cache available
		if (!allowedReposCache) {
			allowedReposCache = new Set();
		}
		return allowedReposCache;
	}
}

/**
 * Checks if repo exists in cached allowed repos
 */
async function isRepoAllowed(owner, repo) {
	try {
		const allowedRepos = await getAllowedRepos();
		const repoKey = `${owner}/${repo}`;
		const found = allowedRepos.has(repoKey);

		console.log(`Repo ${repoKey}: ${found ? 'allowed' : 'not found'}`);
		return found;
	} catch (error) {
		console.error('Repo validation failed:', error.message);
		throw new Error(`Repository validation failed: ${error.message}`);
	}
}

/**
 * Fetches repository data from GitHub API with Redis caching
 */
async function getRepoData(owner, repo) {
	try {
		// Check cache first
		const cached = await getCachedData(owner, repo);
		if (cached) {
			console.log(`💾 Cache hit for ${owner}/${repo}`);
			return { status: 200, data: cached };
		}

		console.log(`🌐 Fetching fresh data for ${owner}/${repo}`);

		// Validate input parameters
		if (!validateRepoParams(owner, repo)) {
			return {
				status: 400,
				error: 'Invalid repository or owner name format'
			};
		}

		// Check if repo is allowed
		const allowed = await isRepoAllowed(owner, repo);
		if (!allowed) {
			return {
				status: 403,
				error: 'Repository not in allowed list'
			};
		}

		// Try to fetch releases first
		let data = await fetchGithubData(
			`https://api.github.com/repos/${owner}/${repo}/releases?per_page=${RELEASES_PER_PAGE}`
		);

		// If no releases found, fetch tags
		if (data.length === 0) {
			const tags = await fetchGithubData(
				`https://api.github.com/repos/${owner}/${repo}/tags?per_page=${RELEASES_PER_PAGE}`
			);

			// Fetch commit data for each tag in parallel
			data = await Promise.all(
				tags.map(async (tag) => {
					const commitData = await fetchGithubData(tag.commit.url);
					return {
						...tag,
						commit: commitData,
						published_at: commitData.commit.author.date,
						html_url: commitData.html_url
					};
				})
			);
		}

		// Cache the result
		if (data && data.length > 0) {
			await setCachedData(owner, repo, data);
		}

		return { status: 200, data };
	} catch (error) {
		console.error('GitHub API Error:', {
			owner,
			repo,
			error: error instanceof Error ? error.message : String(error)
		});

		const status = error instanceof GithubApiError ? error.status : 500;
		return {
			status,
			error: error instanceof Error ? error.message : 'Failed to fetch data'
		};
	}
}

export const GET = async ({ params }) => {
	const { owner, repo } = params;

	const result = await getRepoData(owner, repo);

	// Build response headers
	const responseHeaders = {
		'Content-Type': 'application/json',
		'Cache-Control': `public, max-age=${CACHE_DURATION}`
	};

	// Add Last-Modified header if applicable
	if (result.data?.[0]?.published_at) {
		responseHeaders['Last-Modified'] = result.data[0].published_at;
	}

	// Add CORS headers for frontend
	responseHeaders['Access-Control-Allow-Origin'] = '*';
	responseHeaders['Access-Control-Allow-Methods'] = 'GET';

	// Prepare response payload
	const responsePayload = result.data ?? { error: result.error };

	return new Response(JSON.stringify(responsePayload), {
		status: result.status,
		headers: responseHeaders
	});
};
