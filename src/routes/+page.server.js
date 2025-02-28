import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  const sharedUrl = event.url.searchParams.get('url') || event.url.searchParams.get('text');
  if (sharedUrl) {
    await event.fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ for: 'Shared via URL', url: sharedUrl }),
    });
    throw redirect(303, '/');
  }
  try {
    console.log('Fetching items from /api/share...');
    const res = await event.fetch('/api/share');
    if (!res.ok) {
      console.error('API fetch failed:', res.status, res.statusText);
      return { items: [] };
    }
    const data = await res.json();
    console.log('Server response:', data);
    if (!Array.isArray(data.items)) {
      console.error('Items is not an array:', data.items);
      return { items: [] };
    }
    console.log('Returning items to client:', data.items);
    return { items: data.items };
  } catch (error) {
    console.error('Error fetching items:', error);
    return { items: [] };
  }
}