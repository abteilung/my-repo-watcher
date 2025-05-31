// src/routes/health/+server.js
export async function GET() {
	try {
		// Optional: Check if PocketBase is reachable
		const pbHealth = await fetch(process.env.POCKETBASE_URL + '/api/health').catch(() => null);

		return new Response(
			JSON.stringify({
				status: 'healthy',
				timestamp: new Date().toISOString(),
				services: {
					app: 'up',
					pocketbase: pbHealth?.ok ? 'up' : 'down'
				},
				version: '1.0.0'
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'no-cache'
				}
			}
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				status: 'error',
				error: error.message,
				timestamp: new Date().toISOString()
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
}
