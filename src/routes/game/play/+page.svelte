<script lang="ts">
	import Profiles from '$lib/components/profiles/Profiles.svelte';
	import ChatBox from '$lib/components/chatbox/ChatBox.svelte';
	import Canvas from '$lib/components/canvas/Canvas.svelte';

	let canvasRef: Canvas;
</script>

<h2>Game Play</h2>

<div class="game-layout">
	<aside class="left"><Profiles /></aside>
	<main class="center"><Canvas /></main>
	<aside class="right"><ChatBox /></aside>
</div>
