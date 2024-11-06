// src/routes/api/build-info/+server.ts
let BUILD_TIME = new Date().toISOString();

export function GET() {
    return new Response(JSON.stringify({ buildTime: BUILD_TIME }), {
        headers: {
            "content-type": "application/json",
            // Lange Cache-Zeit, da sich die Build-Zeit nicht ändert
            "cache-control": "public, max-age=31536000",
        },
    });
}
