<script lang="ts">
	import Canvas from '$lib/Canvas.svelte';
	import { onMount } from 'svelte';

	interface DrawBuffer {
		type: 'start' | 'draw' | 'stop' | 'clear' | 'setStroke' | 'clear';
		data?: { x: number; y: number } | { color: string; width: number };
	}

	let canvasRef: Canvas;
	let strokeColor: string = '#000';
	let strokeWidth: number = 2;

	let savedBuffer: DrawBuffer[] = [];

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
	<button
		on:click={() => {
			savedBuffer = canvasRef.getBuffer();
			console.log(savedBuffer);
		}}
	>
		Save Buffer
	</button>
	<button on:click={() => canvasRef.drawFromBuffer(savedBuffer)}> Draw From Buffer </button>
</div>

<style>
	.canvas {
		width: 100%;
		height: 600px;
	}
</style>
