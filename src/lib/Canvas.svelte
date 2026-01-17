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
  let currentStroke: { color: string; width: number } = { color: '#000', width: 2 };

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

	function startDrawing(e: MouseEvent) {
		isDrawing = true;
		const pos = getPos(e);
		buffer.push({ type: 'start', data: { ...pos } });

    if (ctx?.strokeStyle !== currentStroke.color || ctx?.lineWidth !== currentStroke.width) {
      ctx!.strokeStyle = currentStroke.color;
      ctx!.lineWidth = currentStroke.width;
      buffer.push({ type: 'setStroke', data: { ...currentStroke } });

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
    buffer.push({ type: 'stop' });
	}

  function drawCircle(x: number, y: number) {
    ctx?.arc(x, y, 1, 0, Math.PI * 2);
    ctx?.fill();
  }

	function draw(e: MouseEvent) {
		if (!isDrawing || !ctx) return;

		const { x, y } = getPos(e);
    buffer.push({ type: 'draw', data: { x, y } });
    
		ctx.lineTo(x, y);
    ctx.stroke();
	}

  export function clearCanvas() {
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      buffer = [{ type: 'clear' }];
    }
  }

  export function setStroke(color: string, width: number) {
    currentStroke = { color, width };
  }

  export function getBuffer() {
    return buffer;
  }
</script>

<canvas
  bind:this={canvas}
  on:mousedown={startDrawing}
  on:mouseup={stopDrawing}
  on:mousemove={draw}
  on:mouseleave={stopDrawing}
></canvas>