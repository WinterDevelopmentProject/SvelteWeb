export interface DrawBuffer {
	type: 'start' | 'draw' | 'stop' | 'clear' | 'setStroke';
	data?: { x: number; y: number } | { color: string; width: number };
}

export class Drawer {
	protected canvas: HTMLCanvasElement;
	protected ctx: CanvasRenderingContext2D;
	protected stroke = { color: '#000', width: 2 };
	protected curStroke = { color: '#000', width: 2 };

	readonly CANVASWIDTH = 1500;
	readonly CANVASHEIGHT = 800;
	readonly LINECAP: CanvasLineCap = 'round';
	readonly LINEJOIN: CanvasLineJoin = 'round';

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.canvas.width = this.CANVASWIDTH;
		this.canvas.height = this.CANVASHEIGHT;

		const context = canvas.getContext('2d');
		if (!context) throw new Error('Could not get context');
		this.ctx = context;

		this.ctx.lineCap = this.LINECAP;
		this.ctx.lineJoin = this.LINEJOIN;
	}

	protected applyStroke() {
		this.ctx.strokeStyle = this.stroke.color;
		this.ctx.lineWidth = this.stroke.width;
		this.ctx.fillStyle = this.stroke.color;
	}

	private drawCircle(pos: { x: number; y: number }) {
		this.ctx.beginPath();
		this.ctx.arc(pos.x, pos.y, this.stroke.width / 2, 0, Math.PI * 2);
		this.ctx.fill();
		this.ctx.closePath();
	}

	protected drawLine(pos: { x: number; y: number }) {
		this.ctx.lineTo(pos.x, pos.y);
		this.ctx.stroke();
	}

	protected start(pos: { x: number; y: number }) {
		this.ctx.moveTo(pos.x, pos.y);
		this.drawCircle(pos);
		this.ctx.beginPath();
	}

	protected drawFromBuffer(actions: DrawBuffer[]) {
		for (const action of actions) {
			switch (action.type) {
				case 'setStroke': {
					this.stroke = { ...(action.data as { color: string; width: number }) };
					this.applyStroke();
					break;
				}

				case 'start': {
					const startPos = action.data as { x: number; y: number };
					this.start(startPos);
					break;
				}

				case 'draw': {
					const drawPos = action.data as { x: number; y: number };
					this.drawLine(drawPos);
					break;
				}

				case 'stop': {
					break;
				}

				case 'clear': {
					this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
					break;
				}
			}
		}
	}
}
