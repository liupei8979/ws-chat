<script lang="ts">
	import type { Message } from '@just-chat/types';
	import './chattingRoom.css';
	import { onMount } from 'svelte';
	import io, { Socket } from 'socket.io-client';
	import { socketStore } from '$lib/stores/socketStore';
	import { writable, get } from 'svelte/store';
	import { page } from '$app/stores';
	import { chatSession } from '$lib/stores/ChatStore';
	import { v4 } from 'uuid';

	let socket: Socket | null = null;

	socketStore.subscribe((value) => {
		socket = value;
	});

	let userId: string = get(chatSession).userId;
	let receiverId: string = get(chatSession).receiverId;
	let messageContent = '';
	let messages: Message[] = [];
	let roomId: string = $page.params.slug;
	$: roomId = $page.params.slug;

	const currentUserID = 'user123'; // 현재 사용자의 ID

	// 메시지 더미 데이터 with the defined type
	const sortedMessages: Message[] = [
		{
			id: 'msg1',
			text: '안녕하세요!',
			timestamp: new Date('2024-01-16T09:00'),
			senderId: 'user123'
		},
		{ id: 'msg2', text: '반가워요!', timestamp: new Date('2024-01-16T09:05'), senderId: 'user456' }
	];

	onMount(() => {
		if (socket) {
			console.log('mounting socket on chatting room:', socket);
			// 서버로부터 메시지 수신
			socket.on('receiveMessage', (response) => {
				// 여기에 로그 추가
				if (response.success) {
					console.log('Received message response:', response.payload);
					messages = [...messages, response.payload];
				}
			});
		}
	});

	function sendMessage() {
		const msgId = v4();
		if (socket && messageContent.trim() !== '') {
			console.log('Sending message:', {
				msgId,
				senderId: userId,
				receiverId: receiverId,
				roomId,
				content: messageContent
			});

			socket.emit('sendMessage', {
				msgId,
				senderId: userId,
				receiverId: receiverId,
				roomId,
				content: messageContent
			});

			messageContent = ''; // 메시지 전송 후 입력 필드 초기화
		}
	}
	// Use the Message type for the parameter
	function isSentByCurrentUser(message: Message) {
		return message.senderId === currentUserID;
	}
</script>

<div class="ChatContainer">
	<!-- 채팅방 이름 -->
	<div class="ChatHeader">
		<button type="button">
			<i class="fas fa-arrow-left" />
		</button>
		<span>방 이름</span>
	</div>
	<!--메시지 내역 -->
	<div class="Chatting">
		{#each sortedMessages as message (message.id)}
			<div class="Message {isSentByCurrentUser(message) ? 'sent' : 'received'}">
				<div class="bubble">
					<p>{message.text}</p>
				</div>
				<span class="timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
			</div>
		{/each}
	</div>
</div>
<!-- 메시지 입력창 -->
<div class="ChattingMessage">
	<form on:submit|preventDefault={sendMessage}>
		<textarea placeholder="메시지를 입력하세요..." bind:value={messageContent}></textarea>
		<button type="submit">전송</button>
	</form>
</div>
