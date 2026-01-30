import { writable } from 'svelte/store';

export const gameState = writable<'lobby' | 'play' | 'ended'>('lobby');