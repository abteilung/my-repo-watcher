// src/routes/api/categories/+server.js
import PocketBase from 'pocketbase';
import { POCKETBASE_URL } from '$env/static/private';

const pb = new PocketBase(POCKETBASE_URL || 'http://pocketbase:8090');

export async function GET() {
	try {
		// Kategorien aus PocketBase holen
		const categories = await pb.collection('categories').getFullList({
			sort: 'name'
		});

		return new Response(
			JSON.stringify({
				categories: categories.map((cat) => ({
					name: cat.name,
					color: cat.color,
					icon: cat.icon
				}))
			}),
			{
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'public, max-age=3600' // 1 Stunde Cache
				}
			}
		);
	} catch (error) {
		console.error('Error fetching categories from PocketBase:', error);

		// Fallback Kategorien
		const fallbackCategories = [
			{ name: 'DevOps', color: '#2563eb', icon: '🚀' },
			{ name: 'Backend', color: '#dc2626', icon: '⚙️' }
		];

		return new Response(
			JSON.stringify({
				categories: fallbackCategories,
				fallback: true
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'no-cache'
				}
			}
		);
	}
}
