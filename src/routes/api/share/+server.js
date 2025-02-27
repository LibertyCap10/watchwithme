import { json } from '@sveltejs/kit';

// In-memory store (for simplicity)
let sharedUrls = [];

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { url } = await request.json();
  if (url && typeof url === 'string') {
    sharedUrls.push(url);
    return json({ success: true, urls: sharedUrls });
  }
  return json({ success: false, error: 'Invalid URL' }, { status: 400 });
}

// Optional: GET to retrieve the list
export async function GET() {
  return json({ urls: sharedUrls });
}