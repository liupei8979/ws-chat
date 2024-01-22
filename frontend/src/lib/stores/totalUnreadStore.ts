import { writable } from 'svelte/store';

// totalUnread 값을 관리할 스토어
export const totalUnreadStore = writable(0);
