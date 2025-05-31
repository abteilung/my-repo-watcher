// standalone-migrate.js - Run this directly with Node.js
import PocketBase from 'pocketbase';

const POCKETBASE_URL = 'http://localhost:8090';
const ADMIN_EMAIL = 'kontakt@abteilung.ch';
const ADMIN_PASSWORD = 'zH(UVM:ND!j9iYV';

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

async function migrate() {
    try {
        console.log('🔌 Connecting to PocketBase...');
        const pb = new PocketBase(POCKETBASE_URL);
        
        // Create admin if needed and authenticate
        try {
            await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
            console.log('✅ Admin authenticated');
        } catch {
            console.log('🔧 Creating admin user...');
            await pb.admins.create({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                passwordConfirm: ADMIN_PASSWORD
            });
            await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
            console.log('✅ Admin created and authenticated');
        }

        // Create Categories Collection
        try {
            await pb.collections.getOne('categories');
            console.log('📂 Categories collection exists');
        } catch {
            console.log('🔧 Creating categories collection...');
            await pb.collections.create({
                name: 'categories',
                type: 'base',
                schema: [
                    {
                        name: 'name',
                        type: 'text',
                        required: true,
                        options: { max: 50 }
                    },
                    {
                        name: 'color',
                        type: 'text',
                        required: false,
                        options: { max: 7, pattern: '^#[0-9A-Fa-f]{6}$' }
                    },
                    {
                        name: 'icon',
                        type: 'text',
                        required: false,
                        options: { max: 50 }
                    }
                ],
                indexes: ['CREATE UNIQUE INDEX `idx_category_name` ON `categories` (`name`)'],
                listRule: '',
                viewRule: '',
                createRule: '',
                updateRule: '',
                deleteRule: ''
            });
            console.log('✅ Categories collection created');
        }

        // Create Repos Collection
        try {
            await pb.collections.getOne('repos');
            console.log('📂 Repos collection exists');
        } catch {
            console.log('🔧 Creating repos collection...');
            await pb.collections.create({
                name: 'repos',
                type: 'base',
                schema: [
                    {
                        name: 'owner',
                        type: 'text',
                        required: true,
                        options: { max: 100, pattern: '^[a-zA-Z0-9\\-_]+$' }
                    },
                    {
                        name: 'repo',
                        type: 'text',
                        required: true,
                        options: { max: 100, pattern: '^[a-zA-Z0-9\\-_\\.]+$' }
                    },
                    {
                        name: 'categories',
                        type: 'json',
                        required: false
                    },
                    {
                        name: 'description',
                        type: 'text',
                        required: false,
                        options: { max: 500 }
                    },
                    {
                        name: 'priority',
                        type: 'number',
                        required: false,
                        options: { min: 1, max: 10 }
                    },
                    {
                        name: 'active',
                        type: 'bool',
                        required: false
                    },
                    {
                        name: 'last_checked',
                        type: 'date',
                        required: false
                    }
                ],
                indexes: [
                    'CREATE UNIQUE INDEX `idx_owner_repo` ON `repos` (`owner`, `repo`)',
                    'CREATE INDEX `idx_active` ON `repos` (`active`)',
                    'CREATE INDEX `idx_priority` ON `repos` (`priority`)'
                ],
                listRule: '',
                viewRule: '',
                createRule: '',
                updateRule: '',
                deleteRule: ''
            });
            console.log('✅ Repos collection created');
        }

        // Import categories
        console.log('📝 Importing categories...');
        for (const category of categories) {
            try {
                await pb.collection('categories').create(category);
                console.log(`  ✅ Added category: ${category.name}`);
            } catch (e) {
                if (e.status === 409) {
                    console.log(`  ⚠️  Category exists: ${category.name}`);
                } else {
                    console.error(`  ❌ Failed to create category ${category.name}:`, e.message);
                }
            }
        }

        // Import repositories
        console.log('📝 Importing repositories...');
        let added = 0, existing = 0;
        
        for (const repo of repoData) {
            try {
                await pb.collection('repos').create({
                    owner: repo.owner,
                    repo: repo.repo,
                    categories: repo.categories || [],
                    priority: repo.priority || 1,
                    active: true
                });
                console.log(`  ✅ Added: ${repo.owner}/${repo.repo}`);
                added++;
            } catch (e) {
                if (e.status === 409) {
                    console.log(`  ⚠️  Exists: ${repo.owner}/${repo.repo}`);
                    existing++;
                } else {
                    console.error(`  ❌ Failed: ${repo.owner}/${repo.repo}:`, e.message);
                }
            }
        }
        
        console.log(`🎉 Migration completed! Added: ${added}, Existing: ${existing}`);
        console.log('🌐 PocketBase Admin UI: http://localhost:8090/_/');
        
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

migrate();