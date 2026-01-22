<script lang="ts">
	import { onMount } from 'svelte';
	import { ArtistDrawer } from './Artist.svelte.ts';

	let canvas: HTMLCanvasElement;
	let drawer: ArtistDrawer;

	let strokeColor: string = '#000';
	let strokeWidth: number = 2;

	onMount(() => {
		drawer = new ArtistDrawer(canvas);
		drawer.setStroke(strokeColor, strokeWidth);

		window.addEventListener('keydown', drawer.keydownHandler.bind(drawer));

		return () => {
			window.removeEventListener('keydown', drawer.keydownHandler.bind(drawer));
		};
	});
</script>

<div class="canvas-app">
	<canvas
		bind:this={canvas}
    on:touchstart|preventDefault={() => {}}
    
		on:pointerdown={(e) => drawer?.startDrawing(e)}
		on:pointermove={(e) => drawer?.draw(e)}
		on:pointerup={() => drawer?.stopDrawing()}
    on:pointercancel={() => drawer?.stopDrawing()}
		style="border: 1px solid black;"
	></canvas>

	<div class="controls">
		<label>
			Stroke Color:
			<input
				type="color"
				bind:value={strokeColor}
				on:input={() => drawer?.setStroke(strokeColor, strokeWidth)}
			/>
		</label>
		<label>
			Stroke Width:
			<input
				type="range"
				min="1"
				max="100"
				bind:value={strokeWidth}
				on:input={() => drawer?.setStroke(strokeColor, strokeWidth)}
			/>
		</label>
		<button on:click={() => drawer?.undo()}>Undo</button>
		<button on:click={() => drawer?.redo()}>Redo</button>
		<button on:click={() => drawer?.clear()}>Clear</button>
		<button on:click={() => console.log(drawer?.getHistory())}>Log History</button>
		<button on:click={() => console.log(drawer?.getundoStack())}>Log Undo Stack</button>
	</div>
</div>

<style>
	canvas {
		width: 100%;

    touch-action: none;
    user-select: none;
	}

	.canvas-app {
		width: 100%;
		height: 100%;

    touch-action: none;
    user-select: none;
	}
</style>
