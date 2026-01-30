<script lang="ts">
  import { gameState, gameSession } from './GameState';

  import Canvas from '$lib/components/canvas/Canvas.svelte';
  import ChatBox from '$lib/components/chatbox/ChatBox.svelte';
  import Profiles from '$lib/components/profiles/Profiles.svelte';
</script>

<div class="game-container">
  <Profiles />
  <Canvas />
  <ChatBox />
</div>