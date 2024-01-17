import { writable } from 'svelte/store';

export const chatSession = writable({
	userId: null,
	receiverId: null,
	roomId: null,
	messages: []
});
