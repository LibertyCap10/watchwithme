<script>
  export let data;
  let items = data.items || []; // Default to empty array if data.items is undefined
  let newFor = 'Sarah'; // Default value for "For"
  let newUrl = ''; // URL input without "https://"
  let isMenuOpen = false;
  let isUrlChanged = false; // Track if URL input has changed

  // Local feedback state for each item
  let feedbackInputs = {};

  console.log('Initial items from server:', items);

  // Add a new item
  async function addItem() {
    if (newFor.trim() && newUrl.trim()) {
      // Prepend "https://" if not already present, avoiding duplication
      const url = newUrl.startsWith('http://') || newUrl.startsWith('https://') ? newUrl.trim() : `https://${newUrl.trim()}`;
      const newItem = { for: newFor.trim(), url, feedback: '', thumbsUp: false, thumbsDown: false };
      try {
        console.log('Adding item:', newItem);
        const res = await fetch('/api/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
        if (res.ok) {
          const data = await res.json();
          console.log('Add response:', data);
          items = data.items;
          newFor = 'Sarah'; // Reset to default
          newUrl = ''; // Clear URL input
          isUrlChanged = false; // Reset change tracker
          feedbackInputs = {}; // Reset local feedback state
        } else {
          console.error('Add failed:', res.status, res.statusText);
        }
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  }

  // Update an existing item
  async function updateItem(index, field, value) {
    const item = { ...items[index], [field]: value };
    try {
      console.log('Updating item:', item);
      const res = await fetch('/api/share', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Update response:', data);
        items = data.items;
        if (field === 'feedback') {
          feedbackInputs[item.id] = value; // Keep local state in sync
        }
      } else {
        console.error('Update failed:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }

  // Delete an item
  async function deleteItem(id) {
    try {
      console.log('Deleting item with id:', id);
      const res = await fetch('/api/share', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Delete response:', data);
        items = data.items;
        delete feedbackInputs[id]; // Clear local feedback state
      } else {
        console.error('Delete failed:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  // Check if feedback has changed
  function hasFeedbackChanged(id, savedFeedback) {
    const currentFeedback = feedbackInputs[id] || '';
    return currentFeedback !== savedFeedback;
  }

  // Format ISO date to a readable string
  function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  }

  // Handle URL input change
  function handleUrlChange(event) {
    newUrl = event.target.value;
    isUrlChanged = newUrl.trim() !== ''; // Show button if input is not empty
  }
</script>

<div class="bg-white">
  <header class="absolute inset-x-0 top-0 z-50">
    <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1"></div>
      <div class="flex lg:hidden">
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          on:click={() => (isMenuOpen = !isMenuOpen)}
        >
          <span class="sr-only">Open main menu</span>
          <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
      <div class="hidden lg:flex lg:gap-x-12"></div>
    </nav>
    {#if isMenuOpen}
      <div class="lg:hidden" role="dialog" aria-modal="true">
        <div class="fixed inset-0 z-50"></div>
        <div
          class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
        >
          <div class="flex items-center justify-between">
            <button
              type="button"
              class="-m-2.5 rounded-md p-2.5 text-gray-700"
              on:click={() => (isMenuOpen = false)}
            >
              <span class="sr-only">Close menu</span>
              <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-gray-500/10"></div>
          </div>
        </div>
      </div>
    {/if}
  </header>

  <div class="relative isolate px-6 pt-14 lg:px-8">
    <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
      <div
        class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
      ></div>
    </div>
    <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
      <div class="text-center">
        <h1 class="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          Watch With Me
        </h1>
        <div class="mt-8">
          <form on:submit|preventDefault={addItem} class="mb-8 space-y-4">
            <input
              type="text"
              bind:value={newFor}
              placeholder="For (e.g., 'Sarah')"
              class="border p-2 w-full rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <div class="flex items-center border rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
              <div class="bg-blue-100 text-blue-600 px-2 py-2 rounded-l-md font-medium sm:text-sm">
                https://
              </div>
              <input
                type="text"
                bind:value={newUrl}
                on:input={handleUrlChange}
                placeholder="example.com"
                class="flex-1 border-0 p-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0"
              />
            </div>
            <button
              type="submit"
              class="mt-4 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-opacity duration-300"
              class:opacity-0={!isUrlChanged}
              class:opacity-100={isUrlChanged}
            >
              Add URL
            </button>
          </form>

          {#if items.length === 0}
            <p class="text-lg font-medium text-gray-500">No items shared yet.</p>
          {:else}
            <ul class="space-y-6">
              {#each items as item, index}
                <li class="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors relative">
                  <div class="flex flex-col space-y-2">
                    <div class="flex justify-between items-start">
                      <p class="text-sm font-medium text-gray-700">For: {item.for}</p>
                      <button
                        type="button"
                        on:click={() => deleteItem(item.id)}
                        class="text-gray-500 hover:text-red-600"
                      >
                        <svg
                          class="size-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      class="text-indigo-600 hover:underline text-base font-medium break-all"
                    >
                      {item.url}
                    </a>
                    <div class="flex items-center space-x-2">
                      <input
                        type="text"
                        bind:value={feedbackInputs[item.id]}
                        placeholder="Add feedback..."
                        class="flex-1 border p-2 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {#if hasFeedbackChanged(item.id, item.feedback)}
                        <button
                          type="button"
                          on:click={() => updateItem(index, 'feedback', feedbackInputs[item.id] || '')}
                          class="rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                          Submit
                        </button>
                      {/if}
                    </div>
                    <div class="flex justify-between items-center">
                      <p class="text-xs text-gray-500">
                        {formatDate(item.createdAt)}
                      </p>
                      <div class="flex justify-center space-x-6">
                        <button
                          type="button"
                          on:click={() => updateItem(index, 'thumbsUp', !item.thumbsUp)}
                          class="text-gray-500 hover:text-indigo-600 focus:outline-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill={item.thumbsUp ? 'currentColor' : 'none'}
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          on:click={() => updateItem(index, 'thumbsDown', !item.thumbsDown)}
                          class="text-gray-500 hover:text-red-600 focus:outline-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill={item.thumbsDown ? 'currentColor' : 'none'}
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      </div>
    </div>
    <div
      class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      aria-hidden="true"
    >
      <div
        class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
      ></div>
    </div>
  </div>
</div>