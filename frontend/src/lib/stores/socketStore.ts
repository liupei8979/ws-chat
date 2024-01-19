import { writable } from 'svelte/store';
import type { Socket } from 'socket.io-client';
import type { Writable } from 'svelte/store'; // 타입 전용 import

export const socketStore: Writable<Socket | null> = writable(null);
