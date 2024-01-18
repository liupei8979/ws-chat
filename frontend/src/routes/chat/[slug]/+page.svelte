<script lang="ts">
	import type { Message } from '@just-chat/types';
	import { goto } from '$app/navigation';
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
	let isSending = false; // 메시지 전송 중인지 확인하는 플래그
	let title: string = get(chatSession).title;
	let userId: string = get(chatSession).userId;
	let receiverId: string = get(chatSession).receiverId;
	let messageContent = '';
	let messages: Message[] = [];
	let roomId: string = $page.params.slug;
	let chatContainer: HTMLElement | null = null;

	onMount(() => {
		fetchRoomMessages();
		if (socket) {
			socket.on('receiveMessage', (response) => {
				if (response.success && response.payload.timestamp) {
					const newMessage = {
						...response.payload,
						timestamp: new Date(response.payload.timestamp)
					};
					messages = [...messages, newMessage];
				}
			});
		}
	});

	async function fetchRoomMessages() {
		const token = sessionStorage.getItem('token');
		if (!token) {
			console.error('No token found');
			return;
		}

		try {
			const response = await fetch(
				`${import.meta.env.VITE_HOST_URL}:${import.meta.env.VITE_HOST_PORT}/room/${roomId}?page=0`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);

			if (!response.ok) {
				throw new Error('Failed to fetch room messages');
			}

			const data = await response.json();
			if (data.success) {
				messages = data.data.messages.reverse().map((msg: Message) => ({
					...msg,
					timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
				}));
			} else {
				console.error('Failed to fetch room messages: ', data.message);
			}
		} catch (error) {
			console.error('Error fetching room messages:', error);
		}
	}

	function sendMessage() {
		const msgId = v4();
		if (socket && !isSending) {
			isSending = true; // 메시지 전송 시작

			const trimmedContent = messageContent.trim();
			if (trimmedContent !== '') {
				console.log('Sending message:', {
					msgId,
					senderId: userId,
					receiverId: receiverId,
					roomId,
					content: trimmedContent
				});

				socket.emit('sendMessage', {
					msgId,
					senderId: userId,
					receiverId: receiverId,
					roomId,
					content: trimmedContent
				});
			}
			setTimeout(() => {
				isSending = false; // 메시지 전송 완료 후 상태 변경
				messageContent = '';
				messageContent = messageContent;
			}, 0);
		}
	}

	// Use the Message type for the parameter
	function isSentByCurrentUser(message: Message) {
		return message.senderId === userId;
	}

	function updateScroll() {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}
	function goBack() {
		history.back();
	}
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault(); // Shift 키가 없이 Enter 키만 눌렸을 때 기본 동작 방지
			if (!isSending) {
				sendMessage(); // 메시지 전송 함수 호출
				messageContent = '';
			}
		}
	}
	function handleSubmit(event: Event) {
		event.preventDefault(); // 폼 제출 기본 동작 방지
		if (messageContent.trim() !== '') {
			sendMessage();
			messageContent = '';
		}
	}

	$: if (messages.length > 0) {
		setTimeout(updateScroll, 0); // 비동기적으로 스크롤 업데이트 호출
	}
</script>

<div class="ChatContainer">
	<div class="ChatHeader">
		<button type="button" on:click={goBack}>
			<i class="fas fa-arrow-left" />
		</button>
		<span>{title}</span>
	</div>
	<div class="Chatting" bind:this={chatContainer}>
		{#each messages as message (message.msgId)}
			<div class="Message {isSentByCurrentUser(message) ? 'sent' : 'received'}">
				<div class="bubble">
					<p>{message.content}</p>
				</div>
				<span class="timestamp">
					{new Date(message.timestamp || Date.now()).toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit'
					})}
				</span>
			</div>
		{/each}
	</div>
	<div class="ChattingMessage">
		<form on:submit={handleSubmit}>
			<textarea
				placeholder="메시지를 입력하세요..."
				bind:value={messageContent}
				on:keydown={handleKeyDown}
			></textarea>
			<button type="submit">전송</button>
		</form>
	</div>
</div>
