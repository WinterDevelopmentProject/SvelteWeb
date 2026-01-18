<script lang="ts">
	import { onMount } from 'svelte';

	interface DrawBuffer {
		type: 'start' | 'draw' | 'stop' | 'clear' | 'setStroke' | 'clear';
		data?: { x: number; y: number } | { color: string; width: number };
	}

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let isDrawing = false;
	let buffer: DrawBuffer[] = [];
	let currentAction: DrawBuffer[] = [];
	let undoStack: DrawBuffer[][] = [];
	let redoStack: DrawBuffer[][] = [];
	let currentStroke: { color: string; width: number } = { color: '#000', width: 2 };
	let appliedIndex = 0;

	const getPos = (e: MouseEvent) => {
		const rect = canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	};

	onMount(() => {
		const parent = canvas.parentElement!;
		canvas.width = parent.clientWidth;
		canvas.height = parent.clientHeight;
		if (canvas) {
			ctx = canvas.getContext('2d');
		}
	});

	function applyStroke(stroke: { color: string; width: number }) {
		if (!ctx) return;
		ctx.strokeStyle = stroke.color;
		ctx.lineWidth = stroke.width;
		ctx.fillStyle = stroke.color;
	}

	function startDrawing(e: MouseEvent) {
		if (!ctx) return;
		isDrawing = true;
		currentAction = [];
		const pos = getPos(e);
		currentAction.push({ type: 'start', data: { ...pos } });

		if (ctx?.strokeStyle !== currentStroke.color || ctx?.lineWidth !== currentStroke.width) {
			currentAction.push({ type: 'setStroke', data: { ...currentStroke } });
			applyStroke(currentStroke);

			ctx!.lineCap = 'round';
			ctx!.lineJoin = 'round';
		}

		ctx?.beginPath();
		ctx?.moveTo(pos.x, pos.y);
		drawCircle(pos.x, pos.y);
		draw(e);
	}

	function stopDrawing() {
		if (!isDrawing) return;
		isDrawing = false;
		currentAction.push({ type: 'stop' });
		commitAction(currentAction);
	}

	function drawCircle(x: number, y: number) {
		ctx?.arc(x, y, 1, 0, Math.PI * 2);
		ctx?.fill();
	}

	function draw(e: MouseEvent) {
		if (!isDrawing || !ctx) return;

		const { x, y } = getPos(e);
		currentAction.push({ type: 'draw', data: { x, y } });

		ctx.lineTo(x, y);
		ctx.stroke();
	}

	function commitAction(action: DrawBuffer[]) {
		if (!action.length) return;
		undoStack.push(action);
		redoStack = [];
		rebuildBuffer();
	}

	function rebuildBuffer() {
		buffer = undoStack.flat();
		drawFromBuffer(buffer);
	}

	export function clearCanvas() {
		if (ctx && canvas) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const action: DrawBuffer[] = [{ type: 'clear' }];
			undoStack.push(action);
			redoStack = [];
			rebuildBuffer();
		}
	}

	export function setStroke(color: string, width: number) {
		currentStroke = { color, width };
	}

	export function getBuffer() {
		return buffer;
	}

	export function drawFromBuffer(input: DrawBuffer[]) {
		if (!ctx) return;

		if (input.length < appliedIndex) {
			appliedIndex = 0;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

		for (let i = appliedIndex; i < input.length; i++) {
			const item = input[i];

			switch (item.type) {
				case 'clear':
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					break;

				case 'setStroke':
					applyStroke(item.data as { color: string; width: number });
					break;

				case 'start': {
					const { x, y } = item.data as { x: number; y: number };
					ctx.beginPath();
					ctx.moveTo(x, y);
					break;
				}

				case 'draw':
					const { x, y } = item.data as { x: number; y: number };
					ctx.lineTo(x, y);
					ctx.stroke();
					break;

				case 'stop':
					break;
			}
		}
		appliedIndex = input.length;
	}

	export function undo() {
		if (!undoStack.length) return;
		const action = undoStack.pop()!;
		redoStack.push(action);
		rebuildBuffer();
	}
	export function redo() {
		if (!redoStack.length) return;
		const action = redoStack.pop()!;
		undoStack.push(action);
		rebuildBuffer();
	}
</script>

<canvas
	bind:this={canvas}
	on:mousedown={startDrawing}
	on:mouseup={stopDrawing}
	on:mousemove={draw}
	on:mouseleave={stopDrawing}
></canvas>
