import {PUBLIC_API_URL} from '$env/static/public';
import { gameSession } from './GameState';

export const createRoom = async function createRoom() {
  try {
    const res = await fetch(`${PUBLIC_API_URL}/rooms`, {method: 'POST'});
    console.log('Create room response:', res);
    const data = await res.json();
    gameSession.update((session) => ({ ...session, roomId: data.roomId }));
    
  } catch (e) {
    console.error('Failed to create room:', e);
  }
}