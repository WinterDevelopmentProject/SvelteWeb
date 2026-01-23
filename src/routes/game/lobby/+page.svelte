<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { PUBLIC_API_URL } from '$env/static/public';
  import ChatBox from '$lib/components/chatbox/ChatBox.svelte';
  import Games from '$lib/components/games/Games.svelte';

  let roomId = $derived(page.url.searchParams.get('roomId'));
  let userName = $state();

  $effect(() => {
    if (!roomId) {
      createRoom();
    }
    if (!userName) {
      userName = prompt('Enter your name:') || 'Guest';
    }
  });

  async function createRoom() {
    try {
      const res = await fetch(`${PUBLIC_API_URL}/rooms`, { method: 'POST' });
      console.log('Create room response:', res);
      const data = await res.json();
      
      goto(`?roomId=${data.roomId}`, { replaceState: true });
    } catch (e) {
      console.error('Failed to create room:', e);
    }
  }
</script>

<h2>Lobby</h2>

{#if roomId}
  <p>Current Room ID: {roomId}</p>
  <p>User Name: {userName}</p>

  <Games />
  <ChatBox />
{:else}
  <p>Creating room...</p>
{/if}