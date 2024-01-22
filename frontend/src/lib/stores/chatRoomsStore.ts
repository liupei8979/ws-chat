import { writable } from 'svelte/store';

// 채팅방 정보를 관리할 스토어
export const chatRoomsStore = writable([]);
