import { writable } from 'svelte/store';

export const gameState = writable<'lobby' | 'play' | 'ended'>('lobby');
export const gameSession = writable({
	roomId: '',
	username: '',
	players: [] as string[]
});
