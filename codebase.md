# .gitignore

```
node_modules

# Output
.output
.vercel
/.svelte-kit
/build

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.*
!.env.example
!.env.test

# Vite
vite.config.js.timestamp-*
vite.config.ts.timestamp-*

```

# .npmrc

```
engine-strict=true

```

# .prettierignore

```
# Package Managers
package-lock.json
pnpm-lock.yaml
yarn.lock

```

# .prettierrc

```
{
	"useTabs": true,
	"singleQuote": true,
	"trailingComma": "none",
	"printWidth": 100,
	"plugins": ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
	"overrides": [
		{
			"files": "*.svelte",
			"options": {
				"parser": "svelte"
			}
		}
	]
}

```

# .vercel/project.json

```json
{"orgId":"team_8a3CvomXA8jPndoXRTdtVSi7","projectId":"prj_bn9DeiTfqIYn1KgXLSyeJ0dAb9zd"}
```

# .vercel/README.txt

```txt
> Why do I have a folder named ".vercel" in my project?
The ".vercel" folder is created when you link a directory to a Vercel project.

> What does the "project.json" file contain?
The "project.json" file contains:
- The ID of the Vercel project that you linked ("projectId")
- The ID of the user or team your Vercel project is owned by ("orgId")

> Should I commit the ".vercel" folder?
No, you should not share the ".vercel" folder with anyone.
Upon creation, it will be automatically added to your ".gitignore" file.

```

# eslint.config.js

```js
import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	}
];

```

# package.json

```json
{
	"name": "my-github-watcher",
	"version": "0.0.1",
	"private": true,
	"scripts": {
		"dev": "vite dev",
		"build": "vite build",
		"preview": "vite preview",
		"test": "npm run test:integration && npm run test:unit",
		"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
		"lint": "prettier --check . && eslint .",
		"format": "prettier --write .",
		"test:integration": "playwright test",
		"test:unit": "vitest"
	},
	"devDependencies": {
		"@playwright/test": "^1.48.2",
		"@sveltejs/adapter-auto": "^3.3.1",
		"@sveltejs/adapter-node": "^5.2.9",
		"@sveltejs/adapter-static": "^3.0.6",
		"@sveltejs/kit": "^2.7.4",
		"@sveltejs/vite-plugin-svelte": "^3.1.2",
		"@tailwindcss/typography": "^0.5.15",
		"@types/eslint": "^9.6.1",
		"autoprefixer": "^10.4.20",
		"clsx": "^2.1.1",
		"eslint": "^9.14.0",
		"eslint-config-prettier": "^9.1.0",
		"eslint-plugin-svelte": "^2.46.0",
		"globals": "^15.11.0",
		"postcss": "^8.4.47",
		"prettier": "^3.3.3",
		"prettier-plugin-svelte": "^3.2.7",
		"prettier-plugin-tailwindcss": "^0.6.8",
		"svelte": "^5.1.9",
		"svelte-check": "^3.8.6",
		"tailwind-merge": "^2.5.4",
		"tailwindcss": "^3.4.14",
		"typescript": "^5.6.3",
		"typescript-eslint": "^8.12.2",
		"vite": "^5.4.10",
		"vitest": "^2.1.4"
	},
	"type": "module"
}

```

# playwright.config.ts

```ts
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;

```

# postcss.config.js

```js
export default {
	plugins: {
		tailwindcss: {},
		autoprefixer: {}
	}
};

```

# README.md

```md
# My Repo Watcher

A simple tool to watch some Repos for their latest updates.

\`\`\`bash
# create a new project in the current directory
npm install
\`\`\`

\`\`\`bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
\`\`\`

## Building

To create a production version of your app:

\`\`\`bash
npm run build
\`\`\`

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

```

# src/app.css

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

```

# src/app.d.ts

```ts
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

```

# src/app.html

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>

```

# src/index.test.ts

```ts
import { describe, it, expect } from 'vitest';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});

```

# src/lib/components/RepoCard.svelte

```svelte
<script lang="ts">
	import { cn } from '$lib/utils';
	let { repo, releases = [] } = $props();

	function getUpdateDaysAgo(dateString) {
		if (!dateString) return 'none';
		const releaseDate = new Date(dateString);
		const now = new Date();
		const diffInDays = (now - releaseDate) / (1000 * 60 * 60 * 24);

		return parseInt(diffInDays);
	}

	function getUpdateStatus(dateString) {
		if (!dateString) return 'none';
		const releaseDate = new Date(dateString);
		const now = new Date();
		const diffInDays = (now - releaseDate) / (1000 * 60 * 60 * 24);

		if (diffInDays <= 3) return 'very-recent';
		if (diffInDays <= 7) return 'recent';
		if (diffInDays <= 14) return 'somewhat-recent';
		return 'old';
	}

	let isRelease = $derived(releases.length > 0 && 'published_at' in releases[0]);
</script>

<div class="rounded-lg bg-white p-3 shadow">
	<h2 class="mb-0 text-2xl font-semibold">
		<a
			href="https://github.com/{repo.owner}/{repo.name}"
			target="_blank"
			rel="noopener noreferrer"
			class="inline-block text-blue-500 hover:underline"
		>
			{repo.owner}/{repo.name}
		</a>
	</h2>
	<h3 class="mb-2 mt-4 text-xl font-semibold">{isRelease ? 'Latest Releases' : 'Latest Tags'}</h3>
	{#if releases.length > 0}
		<ul class="space-y-2">
			{#each releases as item}
				{@const updateStatus = getUpdateStatus(item.published_at)}
				<li
					class="relative flex items-center rounded bg-gray-100 p-2 {isRelease
						? `update-${updateStatus}`
						: ''}"
				>
					<div class="flex-grow">
						<a
							href={isRelease
								? item.html_url
								: `https://github.com/${repo.owner}/${repo.name}/releases/tag/${item.name}`}
							target="_blank"
							rel="noopener noreferrer"
							class="font-medium text-blue-600 hover:underline"
						>
							{item.name || item.tag_name}
						</a>

						{#if isRelease}
							<span class="ml-2 text-gray-600"
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
	<div
		class="absolute bottom-0 left-0 grid h-1 w-full grid-cols-20 divide-x divide-black/10 bg-gray-200"
	>
		{#each Array(days) as _, i}
			<div
				class={cn(i < 7 || i >= 14 ? 'bg-gray-300' : '', i === 20 - daysAgo ? 'bg-green-500' : '')}
			></div>
		{/each}
	</div>
{/snippet}

<style>
	.update-very-recent {
		@apply border-r-4 border-green-500 bg-green-100;
	}
	.update-recent {
		@apply border-r-4 border-green-300;
	}
	.update-somewhat-recent {
		@apply border-r-4 border-orange-300;
	}
	.update-old {
		@apply border-r-4 border-gray-300;
	}
</style>

```

# src/lib/index.ts

```ts
// place files you want to import through the `$lib` alias in this folder.

```

# src/lib/repos.ts

```ts
// repos.ts
export interface GithubRepo {
    owner: string;
    repo: string; // Geändert von 'name' zu 'repo'
}

export const repos: GithubRepo[] = [
    { owner: "coollabsio", repo: "coolify" },
    { owner: "dani-garcia", repo: "vaultwarden" },
    { owner: "directus", repo: "directus" },
    { owner: "docsifyjs", repo: "docsify" },
    { owner: "duplicati", repo: "duplicati" },
    { owner: "elastic", repo: "elasticsearch" },
    { owner: "formbricks", repo: "formbricks" },
    { owner: "FredrikNoren", repo: "ungit" },
    { owner: "gitbutlerapp", repo: "gitbutler" },
    { owner: "huntabyte", repo: "shadcn-svelte" },
    { owner: "Lissy93", repo: "dashy" },
    { owner: "louislam", repo: "uptime-kuma" },
    { owner: "makeplane", repo: "plane" },
    { owner: "meilisearch", repo: "meilisearch" },
    { owner: "nicolargo", repo: "glances" },
    { owner: "paul-gauthier", repo: "aider" },
    { owner: "payloadcms", repo: "payload" },
    { owner: "pocketbase", repo: "pocketbase" },
    { owner: "sanity-io", repo: "sanity" },
    { owner: "strapi", repo: "strapi" },
    { owner: "sveltejs", repo: "kit" },
    { owner: "sveltejs", repo: "svelte" },
    { owner: "tailwindlabs", repo: "tailwindcss" },
    { owner: "twentyhq", repo: "twenty" },
    { owner: "umami-software", repo: "umami" },
    { owner: "TYPO3", repo: "typo3" },
] as const;

```

# src/lib/utils.ts

```ts
// Combine ClassNames
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

```

# src/routes/+layout.svelte

```svelte
<script>
	import '../app.css';
</script>

<slot></slot>

```

# src/routes/+layout.ts

```ts
export const prerender = true;

```

# src/routes/+page.svelte

```svelte
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

```

# src/routes/api/github/_+server.ts

```ts
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

```

# src/routes/api/github/[owner]/[repo]/+server.ts

```ts
// routes/api/github/[owner]/[repo]/+server.ts
import { GITHUB_TOKEN } from "$env/static/private";
import type { RequestHandler } from "./$types";
import { repos } from "$lib/repos";

export const prerender = true;

async function fetchGithubData(url: string) {
    const response = await fetch(url, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": `public, s-maxage=${60 * 60 * 24}`,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return response.json();
}

async function getRepoData(owner: string, repo: string) {
    try {
        let data = await fetchGithubData(
            `https://api.github.com/repos/${owner}/${repo}/releases?per_page=3`,
        );

        if (data.length === 0) {
            data = await fetchGithubData(
                `https://api.github.com/repos/${owner}/${repo}/tags?per_page=3`,
            );

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
export function entries() {
    return repos.map(({ owner, repo }) => ({
        owner,
        repo,
    }));
}

export const GET: RequestHandler = async ({ params }) => {
    const { owner, repo } = params;

    // Prüfe ob die Kombination erlaubt ist
    if (!repos.some((r) => r.owner === owner && r.repo === repo)) {
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

```

# static/favicon.png

This is a binary file of the type: Image

# svelte.config.js

```js
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
	},
};

export default config;

```

# tailwind.config.ts

```ts
import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],

	theme: {
		container: {
			screens: {
				"3xl": "1500px",
				"2xl": "1400px",
			},
			center: true,
			padding: "1rem",
		},
		extend: {
			gridTemplateColumns: {
				// Simple 16 column grid
				"14": "repeat(14, minmax(0, 1fr))",
				"21": "repeat(21, minmax(0, 1fr))",
				"20": "repeat(20, minmax(0, 1fr))",
			},
		},
	},

	plugins: [require("@tailwindcss/typography")],
} as Config;

```

# tests/test.ts

```ts
import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});

```

# tsconfig.json

```json
{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"sourceMap": true,
		"strict": true,
		"moduleResolution": "bundler"
	}
	// Path aliases are handled by https://kit.svelte.dev/docs/configuration#alias
	// except $lib which is handled by https://kit.svelte.dev/docs/configuration#files
	//
	// If you want to overwrite includes/excludes, make sure to copy over the relevant includes/excludes
	// from the referenced tsconfig.json - TypeScript does not merge them in
}

```

# vite.config.ts

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});

```

