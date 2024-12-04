// routes/api/github/[owner]/[repo]/+server.ts
import { GITHUB_TOKEN } from "$env/static/private";
import type { RequestHandler } from "./$types";
import { repos } from "$lib/repos";

export const prerender = true;

// Constants
const RELEASES_PER_PAGE = 3;
const CACHE_DURATION = 60 * 60; // 1 hour in seconds

// Types
interface GithubRelease {
    tag_name: string;
    published_at: string;
    html_url: string;
    body: string;
}

interface GithubTag {
    name: string;
    commit: {
        url: string;
        sha: string;
    };
}

interface GithubCommit {
    commit: {
        author: {
            date: string;
        };
        message: string;
    };
    html_url: string;
}

interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
}

// Custom error class for GitHub API errors
class GithubApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "GithubApiError";
    }
}

// Validate GitHub token
if (!GITHUB_TOKEN || typeof GITHUB_TOKEN !== "string") {
    throw new Error("GitHub token is not configured properly");
}

/**
 * Fetches data from GitHub API with proper error handling
 * @param url - GitHub API endpoint URL
 * @returns Promise with parsed JSON response
 */
async function fetchGithubData<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "Cache-Control": `public, s-maxage=${CACHE_DURATION}`,
        },
    });

    if (!response.ok) {
        if (response.status === 403) {
            const rateLimitReset = response.headers.get("X-RateLimit-Reset");
            throw new GithubApiError(
                response.status,
                `Rate limit exceeded. Resets at ${
                    new Date(Number(rateLimitReset) * 1000).toISOString()
                }`,
            );
        }
        throw new GithubApiError(
            response.status,
            `GitHub API error: ${response.statusText}`,
        );
    }

    return response.json();
}

/**
 * Validates owner and repo name format
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns boolean indicating if names are valid
 */
function validateRepoParams(owner: string, repo: string): boolean {
    return /^[\w-]+$/.test(owner) && /^[\w-]+$/.test(repo);
}

/**
 * Fetches repository data from GitHub API
 * @param owner - Repository owner
 * @param repo - Repository name
 * @returns Promise with repository data or error response
 */
async function getRepoData(
    owner: string,
    repo: string,
): Promise<
    ApiResponse<GithubRelease[] | (GithubTag & Partial<GithubCommit>)[]>
> {
    try {
        // Validate input parameters
        if (!validateRepoParams(owner, repo)) {
            return {
                status: 400,
                error: "Invalid repository or owner name format",
            };
        }

        // Try to fetch releases first
        let data = await fetchGithubData<GithubRelease[]>(
            `https://api.github.com/repos/${owner}/${repo}/releases?per_page=${RELEASES_PER_PAGE}`,
        );

        // If no releases found, fetch tags
        if (data.length === 0) {
            const tags = await fetchGithubData<GithubTag[]>(
                `https://api.github.com/repos/${owner}/${repo}/tags?per_page=${RELEASES_PER_PAGE}`,
            );

            // Fetch commit data for each tag in parallel
            data = await Promise.all(
                tags.map(async (tag) => {
                    const commitData = await fetchGithubData<GithubCommit>(
                        tag.commit.url,
                    );
                    return {
                        ...tag,
                        commit: commitData,
                        published_at: commitData.commit.author.date,
                        html_url: commitData.html_url,
                    };
                }),
            );
        }

        return { status: 200, data };
    } catch (error) {
        console.error("GitHub API Error:", {
            owner,
            repo,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });

        const status = error instanceof GithubApiError ? error.status : 500;
        return {
            status,
            error: error instanceof Error
                ? error.message
                : "Failed to fetch data",
        };
    }
}

// Generate all routes at build time
export function entries() {
    return repos.map(({ owner, repo }) => ({
        owner,
        repo,
    }));
}

export const GET: RequestHandler = async ({ params }) => {
    const { owner, repo } = params;

    // Check if the combination is allowed
    if (!repos.some((r) => r.owner === owner && r.repo === repo)) {
        return new Response(
            JSON.stringify({ error: "Repository not allowed" }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store", // Prevent caching invalid requests
                },
            },
        );
    }

    const result = await getRepoData(owner, repo);

    // Build response headers
    const responseHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${CACHE_DURATION}`,
    };

    // Add Last-Modified header if applicable
    if (result.data?.[0]?.published_at) {
        responseHeaders["Last-Modified"] = result.data[0].published_at;
    }

    // Prepare response payload
    const responsePayload = result.data ?? { error: result.error };

    return new Response(JSON.stringify(responsePayload), {
        status: result.status,
        headers: responseHeaders,
    });
};
