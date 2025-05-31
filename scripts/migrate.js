import PocketBase from 'pocketbase';

const repoData = [
    { owner: "amerkurev", repo: "doku", categories: ["Monitoring"], priority: 6 },
    { owner: "bluewave-labs", repo: "checkmate", categories: ["Monitoring"], priority: 5 },
    { owner: "chatwoot", repo: "chatwoot", categories: ["Backend"], priority: 7 },
    { owner: "coollabsio", repo: "coolify", categories: ["DevOps"], priority: 9 },
    { owner: "CorentinTh", repo: "it-tools", categories: ["DevOps"], priority: 6 },
    { owner: "dani-garcia", repo: "vaultwarden", categories: ["Security"], priority: 8 },
    { owner: "directus", repo: "directus", categories: ["CMS", "Backend"], priority: 7 },
    { owner: "docker-mailserver", repo: "docker-mailserver", categories: ["DevOps"], priority: 6 },
    { owner: "docsifyjs", repo: "docsify", categories: ["Frontend"], priority: 5 },
    { owner: "dockur", repo: "windows", categories: ["DevOps"], priority: 4 },
    { owner: "dockur", repo: "windows-arm", categories: ["DevOps"], priority: 4 },
    { owner: "duplicati", repo: "duplicati", categories: ["DevOps", "Security"], priority: 6 },
    { owner: "elastic", repo: "elasticsearch", categories: ["Database"], priority: 8 },
    { owner: "formbricks", repo: "formbricks", categories: ["Backend"], priority: 6 },
    { owner: "gethomepage", repo: "homepage", categories: ["Monitoring"], priority: 6 },
    { owner: "hcengineering", repo: "platform", categories: ["Backend"], priority: 5 },
    { owner: "huntabyte", repo: "shadcn-svelte", categories: ["Frontend"], priority: 8 },
    { owner: "kimai", repo: "kimai", categories: ["Backend"], priority: 5 },
    { owner: "Lissy93", repo: "dashy", categories: ["Monitoring"], priority: 6 },
    { owner: "louislam", repo: "uptime-kuma", categories: ["Monitoring"], priority: 9 },
    { owner: "makeplane", repo: "plane", categories: ["Backend"], priority: 7 },
    { owner: "medusajs", repo: "medusa", categories: ["Backend"], priority: 7 },
    { owner: "meilisearch", repo: "meilisearch", categories: ["Database"], priority: 7 },
    { owner: "n8n-io", repo: "n8n", categories: ["Backend"], priority: 8 },
    { owner: "netdata", repo: "netdata", categories: ["Monitoring"], priority: 7 },
    { owner: "nicolargo", repo: "glances", categories: ["Monitoring"], priority: 5 },
    { owner: "outline", repo: "outline", categories: ["CMS"], priority: 7 },
    { owner: "paul-gauthier", repo: "aider", categories: ["AI/ML"], priority: 8 },
    { owner: "payloadcms", repo: "payload", categories: ["CMS", "Backend"], priority: 7 },
    { owner: "pimox", repo: "pimox7", categories: ["DevOps"], priority: 4 },
    { owner: "pocketbase", repo: "pocketbase", categories: ["Backend", "Database"], priority: 9 },
    { owner: "postalserver", repo: "postal", categories: ["DevOps"], priority: 5 },
    { owner: "QuivrHQ", repo: "quivr", categories: ["AI/ML"], priority: 6 },
    { owner: "renovatebot", repo: "renovate", categories: ["DevOps"], priority: 7 },
    { owner: "requarks", repo: "wiki", categories: ["CMS"], priority: 6 },
    { owner: "sanity-io", repo: "sanity", categories: ["CMS"], priority: 6 },
    { owner: "solidtime-io", repo: "solidtime", categories: ["Backend"], priority: 5 },
    { owner: "storybookjs", repo: "storybook", categories: ["Frontend"], priority: 7 },
    { owner: "strapi", repo: "strapi", categories: ["CMS", "Backend"], priority: 7 },
    { owner: "sveltejs", repo: "kit", categories: ["Frontend"], priority: 10 },
    { owner: "sveltejs", repo: "svelte", categories: ["Frontend"], priority: 10 },
    { owner: "tailwindlabs", repo: "tailwindcss", categories: ["Frontend"], priority: 9 },
    { owner: "thedaviddias", repo: "Front-End-Checklist", categories: ["Frontend"], priority: 4 },
    { owner: "toolbeam", repo: "openauth", categories: ["Security"], priority: 5 },
    { owner: "twentyhq", repo: "twenty", categories: ["Backend"], priority: 6 },
    { owner: "umami-software", repo: "umami", categories: ["Monitoring"], priority: 6 },
    { owner: "unsend-dev", repo: "unsend", categories: ["Backend"], priority: 5 },
    { owner: "TYPO3", repo: "typo3", categories: ["CMS"], priority: 5 },
    { owner: "zammad", repo: "zammad", categories: ["Backend"], priority: 6 }
];

const categories = [
    { name: "DevOps", color: "#2563eb", icon: "🚀" },
    { name: "Backend", color: "#dc2626", icon: "⚙️" },
    { name: "Frontend", color: "#16a34a", icon: "🎨" },
    { name: "Monitoring", color: "#ea580c", icon: "📊" },
    { name: "Security", color: "#7c3aed", icon: "🔒" },
    { name: "CMS", color: "#db2777", icon: "📝" },
    { name: "Database", color: "#0891b2", icon: "💾" },
    { name: "AI/ML", color: "#65a30d", icon: "🤖" }
];

async function migrate() {
    try {
        console.log('🔌 Connecting to PocketBase...');
        const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://localhost:8090');
        
        // Auth or create admin
        try {
            await pb.admins.authWithPassword(
                process.env.POCKETBASE_ADMIN_EMAIL,
                process.env.POCKETBASE_ADMIN_PASSWORD
            );
        } catch {
            await pb.admins.create({
                email: process.env.POCKETBASE_ADMIN_EMAIL,
                password: process.env.POCKETBASE_ADMIN_PASSWORD,
                passwordConfirm: process.env.POCKETBASE_ADMIN_PASSWORD
            });
            await pb.admins.authWithPassword(
                process.env.POCKETBASE_ADMIN_EMAIL,
                process.env.POCKETBASE_ADMIN_PASSWORD
            );
        }

        // Create collections
        const collections = [
            {
                name: 'categories',
                schema: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'color', type: 'text' },
                    { name: 'icon', type: 'text' }
                ]
            },
            {
                name: 'repos',
                schema: [
                    { name: 'owner', type: 'text', required: true },
                    { name: 'repo', type: 'text', required: true },
                    { name: 'categories', type: 'json' },
                    { name: 'priority', type: 'number' },
                    { name: 'active', type: 'bool' }
                ]
            }
        ];

        for (const col of collections) {
            try {
                await pb.collections.getOne(col.name);
            } catch {
                await pb.collections.create({
                    name: col.name,
                    type: 'base',
                    schema: col.schema
                });
                console.log(`✅ Created collection: ${col.name}`);
            }
        }

        // Import data
        for (const cat of categories) {
            try {
                await pb.collection('categories').create(cat);
            } catch (e) {
                if (e.status !== 409) throw e;
            }
        }

        for (const repo of repoData) {
            try {
                await pb.collection('repos').create({
                    ...repo,
                    active: true
                });
            } catch (e) {
                if (e.status !== 409) throw e;
            }
        }

        console.log('🎉 Migration completed!');
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

migrate();
