<script lang='ts'>
  import { goto } from '$app/navigation';

  function join() {
    const roomId = prompt('Enter Room ID: (나중에 바꿈ㅋㅋ)');

    if (roomId && roomId.trim() !== '') {
      goto(`game/lobby?roomId=${roomId.trim()}`);
    }
  }
</script>

<h1>Title</h1>

<a href="game/lobby">Create</a>
<button on:click={join}>Join</button>