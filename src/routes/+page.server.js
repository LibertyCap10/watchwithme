import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  const sharedUrl = url.searchParams.get('url') || url.searchParams.get('text');
  if (sharedUrl) {
    // Send the URL to the API
    await fetch('http://localhost:5173/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: sharedUrl }),
    });
    throw redirect(303, '/'); // Redirect to clear query params
  }
  // Fetch the current list
  const res = await fetch('http://localhost:5173/api/share');
  const data = await res.json();
  return { urls: data.urls };
}