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