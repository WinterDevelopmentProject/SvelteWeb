<script lang="ts">
	import Canvas from '$lib/Canvas.svelte';
	import { onMount } from 'svelte';

	let canvasRef: Canvas;
	let strokeColor: string = '#000';
	let strokeWidth: number = 2;

	onMount(() => {
		if (canvasRef) {
			canvasRef.setStroke(strokeColor, strokeWidth);
		}
	});
</script>

<div class="canvas" style="border: 1px solid black;">
	<Canvas bind:this={canvasRef}></Canvas>
</div>

<div class="tools">
	<label>
		Stroke Color:
		<input
			type="color"
			bind:value={strokeColor}
			on:input={() => canvasRef.setStroke(strokeColor, strokeWidth)}
		/>
	</label>
	<label>
		Stroke Width:
		<input
			type="range"
			min="1"
			max="20"
			bind:value={strokeWidth}
			on:input={() => canvasRef.setStroke(strokeColor, strokeWidth)}
		/>
	</label>
	<button on:click={() => canvasRef.clearCanvas()}>Clear Canvas</button>
	<button on:click={() => console.log(canvasRef.getBuffer())}>Log Buffer</button>
</div>

<style>
  .canvas {
    width: 100%;
    height: 600px;
  }
</style>
