import { json } from '@sveltejs/kit';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const filePath = join(process.cwd(), 'sharedItems.json');

async function loadItems() {
  try {
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('No existing file or invalid JSON, starting with empty array');
    return [];
  }
}

async function saveItems(items) {
  await writeFile(filePath, JSON.stringify(items, null, 2), 'utf-8');
}

export async function POST({ request }) {
  const { for: forText, url, feedback = '', thumbsUp = false, thumbsDown = false } = await request.json();
  if (url && typeof url === 'string' && forText && typeof forText === 'string') {
    const sharedItems = await loadItems();
    const newItem = {
      id: Date.now().toString(),
      for: forText,
      url,
      feedback,
      thumbsUp,
      thumbsDown,
      createdAt: new Date().toISOString() // ISO format for consistency
    };
    sharedItems.push(newItem);
    await saveItems(sharedItems);
    console.log('Item added:', newItem);
    return json({ success: true, items: sharedItems });
  }
  return json({ success: false, error: 'Invalid input: "for" and "url" are required' }, { status: 400 });
}

export async function PUT({ request }) {
  const { id, for: forText, url, feedback, thumbsUp, thumbsDown, createdAt } = await request.json();
  if (!id || typeof id !== 'string') {
    console.error('PUT failed: Invalid or missing "id"');
    return json({ success: false, error: 'Invalid or missing "id"' }, { status: 400 });
  }
  const sharedItems = await loadItems();
  const index = sharedItems.findIndex(item => item.id === id);
  if (index === -1) {
    console.error('PUT failed: Item not found for id:', id);
    return json({ success: false, error: 'Item not found' }, { status: 404 });
  }
  sharedItems[index] = { id, for: forText, url, feedback, thumbsUp, thumbsDown, createdAt };
  await saveItems(sharedItems);
  console.log('Item updated:', sharedItems[index]);
  return json({ success: true, items: sharedItems });
}

export async function DELETE({ request }) {
  const { id } = await request.json();
  if (!id || typeof id !== 'string') {
    console.error('DELETE failed: Invalid or missing "id"');
    return json({ success: false, error: 'Invalid or missing "id"' }, { status: 400 });
  }
  const sharedItems = await loadItems();
  const updatedItems = sharedItems.filter(item => item.id !== id);
  if (updatedItems.length === sharedItems.length) {
    console.error('DELETE failed: Item not found for id:', id);
    return json({ success: false, error: 'Item not found' }, { status: 404 });
  }
  await saveItems(updatedItems);
  console.log('Item deleted, id:', id);
  return json({ success: true, items: updatedItems });
}

export async function GET() {
  const sharedItems = await loadItems();
  console.log('GET items:', sharedItems);
  return json({ items: sharedItems });
}