<script lang="ts">
	import type { Message } from '@just-chat/types';
	import { goto } from '$app/navigation';
	import './chattingRoom.scss';
	import { onMount } from 'svelte';
	import io, { Socket } from 'socket.io-client';
	import { socketStore } from '$lib/stores/socketStore';
	import { writable, get } from 'svelte/store';
	import { page } from '$app/stores';
	import { chatSession } from '$lib/stores/ChatStore';
	import { v4 } from 'uuid';

	// Socket 연결 및 채팅 관련 상태 변수 선언
	let socket: Socket | null = null;
	let isSending = false; // 메시지 전송 중인지 확인하는 플래그
	let title: string = get(chatSession).title;
	let userId: string = get(chatSession).userId;
	let receiverId: string = get(chatSession).receiverId;
	let messageContent = '';
	let messages: Message[] = [];
	let roomId: string = $page.params.slug;
	let chatContainer: HTMLElement | null = null;
	let recentUserRead = 0;

	// Socket 스토어 구독
	socketStore.subscribe((value) => {
		socket = value;
	});

	// 컴포넌트 마운트 시 채팅방 메시지 로딩 및 소켓 이벤트 설정
	onMount(() => {
		fetchRoomMessages();
		if (socket) {
			socket.emit('readRoom', { userId, roomId });
			socket.on('receiveMessage', (response) => {
				if (response.success && response.payload.timestamp) {
					const newMessage = {
						...response.payload,
						timestamp: new Date(response.payload.timestamp)
					};
					messages = [...messages, newMessage];
				}
				socket?.emit('readRoom', { userId, roomId });
			});
			socket.on('readRoomResponse', async (response) => {
				if (response.success) {
					await fetchRoomMessages();
				}
			});
		}
	});

	// 채팅방 메시지를 로드하는 함수
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
				recentUserRead = data.data.recentUserRead[receiverId];
				console.log(recentUserRead);
			} else {
				console.error('Failed to fetch room messages: ', data.message);
			}
		} catch (error) {
			console.error('Error fetching room messages:', error);
		}
	}

	// 메시지 전송 함수
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

	// 메시지가 현재 사용자에 의해 전송되었는지 확인하는 함수
	function isSentByCurrentUser(message: Message) {
		return message.senderId === userId;
	}

	// 채팅 컨테이너의 스크롤을 최신 메시지 위치로 업데이트하는 함수
	function updateScroll() {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}
	function goBack() {
		history.back();
	}

	// 키보드 이벤트 처리 함수
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault(); // Shift 키가 없이 Enter 키만 눌렸을 때 기본 동작 방지
			if (!isSending) {
				sendMessage(); // 메시지 전송 함수 호출
				messageContent = '';
			}
		}
	}
	// 메시지 전송을 위한 폼 제출 이벤트 처리 함수
	function handleSubmit(event: Event) {
		event.preventDefault(); // 폼 제출 기본 동작 방지
		if (messageContent.trim() !== '') {
			sendMessage();
			messageContent = '';
		}
	}

	// 메시지가 업데이트될 때마다 스크롤 업데이트
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
				<div class="message-info">
					{#if isSentByCurrentUser(message)}
						<span class="read-receipt">
							{message.msgSeq !== undefined && message.msgSeq <= recentUserRead ? '' : '1'}
						</span>
					{/if}
					<span class="timestamp">
						{new Date(message.timestamp || Date.now()).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit'
						})}
					</span>
				</div>
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
