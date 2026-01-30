<script lang='ts'>
  import Lobby from './Lobby.svelte';
  import Play from './Play.svelte';

  import { gameState } from './GameState';

  function changeState() {
    if ($gameState === 'lobby') {
      gameState.set('play');
    } else if ($gameState === 'play') {
      gameState.set('ended');
    } else {
      gameState.set('lobby');
    }
  }
</script>

<h1>Title</h1>

<button on:click={changeState}>Change State</button>


{#if $gameState === 'lobby'}
  <Lobby />
{:else if $gameState === 'play'}
  <Play />
{:else}
  <p>Game Ended</p>
{/if}