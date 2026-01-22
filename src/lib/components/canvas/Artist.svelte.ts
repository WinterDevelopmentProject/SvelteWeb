import type { DrawBuffer } from './Drawer.svelte.ts';
import { Drawer } from './Drawer.svelte.ts';

export class ArtistDrawer extends Drawer {
	private isDrawing = false;
	public socketBuffer: DrawBuffer[] = [];
	public history: DrawBuffer[][][] = [[]];

	private undoStack: DrawBuffer[][] = [];

	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		this.history
			.at(-1)
			?.at(-1)
			?.push({ type: 'setStroke', data: { ...this.stroke } });
		this.socketBuffer.push({ type: 'setStroke', data: { ...this.stroke } });
		this.applyStroke();
	}

	public keydownHandler(e: KeyboardEvent) {
		const target = e.target as HTMLElement;
		if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
			return;
		}

		const isMod = e.ctrlKey || e.metaKey;

		if (isMod && e.key.toLowerCase() === 'z') {
			e.preventDefault();
			if (e.shiftKey) {
				this.redo();
			} else {
				this.undo();
			}
		} else if (isMod && e.key.toLowerCase() === 'd') {
			e.preventDefault();
			this.clear();
		}
	}

	private getPos(e: MouseEvent) {
		const rect = this.canvas.getBoundingClientRect();
		return {
			x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
			y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
		};
	}

	public setStroke(color: string, width: number) {
		this.curStroke = { color, width };
		this.undoStack = [];
	}

	public startDrawing(e: MouseEvent) {
		this.isDrawing = true;
		const pos = this.getPos(e);

		this.history.at(-1)?.push([]);

		this.history
			.at(-1)
			?.at(-1)
			?.push({ type: 'setStroke', data: { ...this.curStroke } });
		this.socketBuffer.push({ type: 'setStroke', data: { ...this.curStroke } });
		this.stroke = { ...this.curStroke };
		this.applyStroke();

		this.history
			.at(-1)
			?.at(-1)
			?.push({ type: 'start', data: { ...pos } });
		this.socketBuffer.push({ type: 'start', data: { ...pos } });

		this.start(pos);

		this.undoStack = [];
	}

	public draw(e: MouseEvent) {
		if (!this.isDrawing) return;

		const pos = this.getPos(e);
		this.history
			.at(-1)
			?.at(-1)
			?.push({ type: 'draw', data: { ...pos } });
		this.socketBuffer.push({ type: 'draw', data: { ...pos } });

		this.drawLine(pos);
	}

	public stopDrawing() {
		if (!this.isDrawing) return;
		this.isDrawing = false;
		this.history.at(-1)?.at(-1)?.push({ type: 'stop' });
		this.socketBuffer.push({ type: 'stop' });
	}

	public clear() {
		if (this.history.at(-1)?.length === 1 && (this.history.at(-1)?.at(0)?.length ?? 0) <= 2) return;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.history.push([[]]);

		this.socketBuffer.push({ type: 'clear' });
		this.history.at(-1)?.at(-1)?.push({ type: 'clear' });
		this.history
			.at(-1)
			?.at(-1)
			?.push({ type: 'setStroke', data: { ...this.stroke } });

		this.undoStack = [];
	}

	public undo() {
		const actions = this.history.at(-1)?.pop();
		if (!actions) return;
		this.undoStack.push(actions!);

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		if (this.history.at(-1)?.length === 0) {
			this.history.pop();
		}

		for (const lastActions of this.history.at(-1) ?? []) {
			this.drawFromBuffer(lastActions);
		}

		if (this.history.length === 0) {
			this.history.push([]);
		}
	}

	public redo() {
		if (this.undoStack.length === 0) return;

		const actions = this.undoStack.pop();
		if (!actions) return;

		if (actions[0]?.type === 'clear') {
			this.history.push([]);
		}
		this.history.at(-1)?.push(actions);
		this.drawFromBuffer(actions);
	}

	public getHistory() {
		return this.history;
	}

	public getundoStack() {
		return this.undoStack;
	}
}
