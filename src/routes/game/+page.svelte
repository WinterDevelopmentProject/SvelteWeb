<script lang='ts'>
  import Lobby from './Lobby.svelte';
  import Play from './Play.svelte';

  import { gameState } from './GameState';
</script>

<h1>Title</h1>

{#if $gameState === 'lobby'}
  <Lobby />
{:else if $gameState === 'play'}
  <Play />
{:else}
  <p>Game Ended</p>
{/if}