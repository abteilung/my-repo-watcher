// src/routes/api/repos/+server.js
import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '$env/static/private';

const pb = new PocketBase(POCKETBASE_URL || 'http://pocketbase:8090');

export async function GET({ url }) {
    try {
        // Query parameters für Filtering
        const category = url.searchParams.get('category');
        const active = url.searchParams.get('active') !== 'false'; // Default: nur aktive
        const sortBy = url.searchParams.get('sort') || 'priority'; // Default: nach Priorität
        const order = url.searchParams.get('order') || 'desc'; // Default: absteigend
        
        // Filter aufbauen
        let filter = [];
        
        if (active) {
            filter.push('active = true');
        }
        
        if (category) {
            filter.push(`categories ~ '${category}'`);
        }
        
        const filterString = filter.length > 0 ? filter.join(' && ') : '';
        
        // Repos aus PocketBase holen
        const repos = await pb.collection('repos').getFullList({
            filter: filterString,
            sort: `${order === 'desc' ? '-' : ''}${sortBy}`,
            expand: '' // Keine Relationen expandieren
        });
        
        // Daten für Frontend formatieren
        const formattedRepos = repos.map(repo => ({
            owner: repo.owner,
            repo: repo.repo,
            categories: repo.categories || [],
            priority: repo.priority || 1,
            description: repo.description || '',
            active: repo.active !== false,
            lastChecked: repo.last_checked
        }));
        
        return new Response(JSON.stringify({
            repos: formattedRepos,
            total: repos.length,
            filters: {
                category,
                active,
                sortBy,
                order
            }
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300' // 5 Minuten Cache
            }
        });
        
    } catch (error) {
        console.error('Error fetching repos from PocketBase:', error);
        
        // Fallback zu hardcodierten Repos bei Fehler
        const { repos: fallbackRepos } = await import('$lib/repos');
        
        return new Response(JSON.stringify({
            repos: fallbackRepos,
            total: fallbackRepos.length,
            fallback: true,
            error: 'PocketBase connection failed'
        }), {
            status: 200, // Trotzdem 200, da wir Fallback-Daten haben
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
    }
}