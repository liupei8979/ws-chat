import { writable } from 'svelte/store';

export const chatSession = writable({
	title: '',
	userId: '', // 초기값으로 빈 문자열
	receiverId: '', // 초기값으로 빈 문자열
	roomId: '', // 초기값으로 빈 문자열
	messages: [] // 초기값으로 빈 배열
});
