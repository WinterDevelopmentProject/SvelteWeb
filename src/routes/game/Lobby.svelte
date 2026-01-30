<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { gameSession } from './GameState';
	import Games from '$lib/components/games/Games.svelte';
	import ChatBox from '$lib/components/chatbox/ChatBox.svelte';
	import { createRoom } from './socket.svelte';

	$effect(() => {
		if (!$gameSession.roomId) {
			createRoom();
		}
		if (!$gameSession.username) {
			const userName = prompt('Enter your name:') || 'Guest';
			gameSession.update((session) => ({ ...session, username: userName }));
		}
	});
</script>

<h2>Lobby</h2>

{#if $gameSession.roomId}
	<p>Current Room ID: {$gameSession.roomId}</p>
	<p>User Name: {$gameSession.username}</p>

	<Games />
	<ChatBox />
{:else}
	<p>Creating room...</p>
{/if}
