#!/bin/bash

# Erforderliche Dateien generieren, falls fehlend
if [ ! -f "package.json" ]; then
  echo '{"private": true, "scripts": {"dev": "vite dev", "build": "vite build", "preview": "vite preview"}}' > package.json
fi

if [ ! -f "package-lock.json" ]; then
  echo '{}' > package-lock.json
fi

# Starte Container
docker-compose up -d --build

# Warte auf PocketBase
echo "Warte auf PocketBase..."
while ! docker-compose exec -T pocketbase curl -s http://localhost:8090/api/health > /dev/null; do
  sleep 5
done

# Initialdaten importieren
docker-compose exec -T app node <<'EOF'
const { repos } = require('./src/lib/repos.js');
const PocketBase = require('pocketbase/cjs');

(async () => {
  try {
    const pb = new PocketBase('http://pocketbase:8090');
    await pb.admins.authWithPassword('admin@example.com', 'adminpassword');
    
    for (const repo of repos) {
      try {
        await pb.collection('repos').create({
          owner: repo.owner,
          repo: repo.repo,
          categories: repo.categories || [],
          priority: 1
        });
        console.log(`Added: ${repo.owner}/${repo.repo}`);
      } catch (e) {
        if (e.status !== 409) throw e;
        console.log(`Exists: ${repo.owner}/${repo.repo}`);
      }
    }
    console.log('Migration completed!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
})();
EOF