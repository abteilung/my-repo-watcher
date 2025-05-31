export const prerender = true;

export async function GET() {
	return new Response(
		JSON.stringify({
			buildTime: new Date().toISOString(),
			version: '1.0.0',
			environment: 'production'
		}),
		{
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=86400'
			}
		}
	);
}
