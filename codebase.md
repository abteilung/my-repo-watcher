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

# tailwind.config.ts

```ts
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		container: {
			screens: {
				'3xl': '1500px',
				'2xl': '1400px'
			},
			center: true,
			padding: '1rem'
		},
		extend: {}
	},

	plugins: [require('@tailwindcss/typography')]
} as Config;

```

# svelte.config.js

```js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	}
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
		"@playwright/test": "^1.28.1",
		"@sveltejs/adapter-auto": "^3.0.0",
		"@sveltejs/kit": "^2.0.0",
		"@sveltejs/vite-plugin-svelte": "^3.0.0",
		"@tailwindcss/typography": "^0.5.13",
		"@types/eslint": "^9.6.0",
		"autoprefixer": "^10.4.19",
		"eslint": "^9.0.0",
		"eslint-config-prettier": "^9.1.0",
		"eslint-plugin-svelte": "^2.36.0",
		"globals": "^15.0.0",
		"postcss": "^8.4.38",
		"prettier": "^3.1.1",
		"prettier-plugin-svelte": "^3.1.2",
		"prettier-plugin-tailwindcss": "^0.6.4",
		"svelte": "^5.0.0-next.1",
		"svelte-check": "^3.6.0",
		"tailwindcss": "^3.4.4",
		"typescript": "^5.0.0",
		"typescript-eslint": "^8.0.0",
		"vite": "^5.0.3",
		"vitest": "^2.0.0"
	},
	"type": "module",
	"dependencies": {
		"axios": "^1.7.3"
	}
}

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

# .prettierignore

```
# Package Managers
package-lock.json
pnpm-lock.yaml
yarn.lock

```

# .npmrc

```
engine-strict=true

```

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

# tests/test.ts

```ts
import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});

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

# src/app.css

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

```

# static/favicon.png

This is a binary file of the type: Image

# src/routes/+page.svelte

```svelte
<script>
	import { onMount } from 'svelte';
	import RepoCard from '$lib/components/RepoCard.svelte';

	let repos = [
		{ owner: 'sveltejs', name: 'svelte' },
		{ owner: 'sveltejs', name: 'kit' },
		{ owner: 'tailwindlabs', name: 'tailwindcss' },
		{ owner: 'coollabsio', name: 'coolify' },
		{ owner: 'directus', name: 'directus' },
		{ owner: 'sanity-io', name: 'sanity' },
		{ owner: 'meilisearch', name: 'meilisearch' },
		{ owner: 'payloadcms', name: 'payload' },
		{ owner: 'strapi', name: 'strapi' },
		{ owner: 'TryGhost', name: 'Ghost' },
		{ owner: 'WordPress', name: 'WordPress' },
		{ owner: 'Lissy93', name: 'dashy' }
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

```

# src/routes/+layout.svelte

```svelte
<script>
	import '../app.css';
</script>

<slot></slot>

```

# src/lib/index.ts

```ts
// place files you want to import through the `$lib` alias in this folder.

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

# src/lib/components/RepoCard.svelte

```svelte
<script>
	export let repo;
	export let releases = [];

	function isLessThanWeekOld(dateString) {
		if (!dateString) return false;
		const releaseDate = new Date(dateString);
		const now = new Date();

		// one week means the repos are recently updated
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		return releaseDate > weekAgo;
	}

	$: isRelease = releases.length > 0 && 'published_at' in releases[0];
</script>

<div class="rounded-lg bg-white p-6 shadow">
	<h2 class="mb-2 text-2xl font-semibold">{repo.owner}/{repo.name}</h2>
	<a
		href="https://github.com/{repo.owner}/{repo.name}"
		target="_blank"
		rel="noopener noreferrer"
		class="mb-4 inline-block text-blue-500 hover:underline"
	>
		View on GitHub
	</a>

	<h3 class="mb-2 mt-4 text-xl font-semibold">{isRelease ? 'Latest Releases' : 'Latest Tags'}</h3>
	{#if releases.length > 0}
		<ul class="space-y-2">
			{#each releases as item}
				<li
					class="flex items-center rounded bg-gray-100 p-2 {isRelease &&
					isLessThanWeekOld(item.published_at)
						? 'border-r-4 border-green-300'
						: ''}"
				>
					<div class="flex-grow">
						<span class="font-medium">{item.name || item.tag_name}</span>
						{#if isRelease}
							<span class="ml-2 text-gray-600"
								>{new Date(item.published_at).toLocaleDateString()}</span
							>
						{/if}
					</div>
					{#if isRelease && isLessThanWeekOld(item.published_at)}
						<span class="ml-2 text-sm font-medium text-green-500">New</span>
					{/if}
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-gray-600">No releases or tags found.</p>
	{/if}
</div>

```

# src/routes/api/github/+server.ts

```ts
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

```

