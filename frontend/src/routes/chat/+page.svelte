<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount, beforeUpdate } from 'svelte';
	import { goto } from '$app/navigation';
	import { socketStore } from '$lib/stores/socketStore';
	import { Socket } from 'socket.io-client';
	import Mainlayout from '$lib/Mainlayout.svelte';
	import NewChattingModal from '$lib/components/modal/NewChattingModal.svelte';
	import { chatSession } from '$lib/stores/ChatStore';
	import type { CreateRoomResponse, ChatRoom } from './index';
	import './chat.css';

	let socket: Socket | null = null;
	let isChattingWindowOpen = false;
	const userChatDataString = writable(sessionStorage.getItem('userChatData'));
	socketStore.subscribe((value) => {
		socket = value;
	});
	let userId: string;
	// 더미 데이터 정의
	let chatRooms: ChatRoom[] = [];

	beforeUpdate(() => {
		const userProfileString = sessionStorage.getItem('userProfile');

		if (userProfileString) {
			userId = JSON.parse(userProfileString).email;
		}
		
	});
	
    // $: {
    //     const chatData = $userChatDataString;
    //     if (chatData) {
    //         const userChatData = JSON.parse(chatData);
    //         chatRooms = userChatData.payload.rooms.map((room) => {
    //             return {
    //                 title: room.title,
    //                 roomId: room.roomId,
    //                 name: room.recentMsg.senderId,
    //                 date: new Date(room.recentMsg.timestamp).toLocaleDateString(),
    //                 preview: room.recentMsg.content,
    //                 unreadMessages: room.userUnread
    //             };
    //         });
    //     }
    // }

	onMount(() => {
		// 세션 스토리지에서 userChatData 가져오기
		const userChatDataString = sessionStorage.getItem('userChatData');
		if (userChatDataString) {
			const userChatData = JSON.parse(userChatDataString);

			// 채팅방 데이터를 chatRooms 배열로 변환
			chatRooms = userChatData.payload.rooms.map((room) => {
				return {
					title: room.title,
					roomId: room.roomId,
					name: room.recentMsg.senderId, // 채팅방 이름 (예: senderId)
					date: new Date(room.recentMsg.timestamp).toLocaleDateString(), // 날짜 변환
					preview: room.recentMsg.content, // 최근 메시지 내용
					unreadMessages: room.userUnread // 안 읽은 메시지 수
				};
			});
		}
	});

	function openChattingWindow() {
		isChattingWindowOpen = true;
	}

	function handleConfirmUser(event: CustomEvent) {
		const receiverId: string = event.detail.userId;
		createOrJoinRoom(receiverId);
		isChattingWindowOpen = false;
	}
	function createOrJoinRoom(receiverId: string) {
		if (socket && userId && receiverId) {
			console.log('Calling socket.emit with:', { userId, receiverId });

			// 서버에 방 생성 요청
			socket.emit('createRoom', { userId, receiverId });

			// 응답 핸들러 정의
			const createRoomResponseHandler = (response: CreateRoomResponse) => {
				if (response.success) {
					chatSession.set({
						title: '임시 값',
						userId: response.payload.userId,
						receiverId: response.payload.receiverId,
						roomId: response.payload.roomId,
						messages: []
					});
					console.log('Room created successfully:', response.payload.roomId);
					goto(`/chat/${response.payload.roomId}`);
				} else {
					console.error('Failed to create room:', response);
					// 실패 처리 로직을 여기에 구현합니다.
				}
			};

			// 이벤트 리스너 등록
			socket.once('createRoomResponse', createRoomResponseHandler);
		} else {
			console.error('Socket, User ID, or Receiver ID is missing');
		}
	}

	function navigateToRoom(roomId: string) {
		const userChatDataString = sessionStorage.getItem('userChatData');
		if (userChatDataString) {
			const userChatData = JSON.parse(userChatDataString);
			const room = userChatData.payload.rooms.find((room) => room.roomId === roomId);

			if (room) {
				// 이 부분은 실제 사용자 ID와 상대방 ID를 어떻게 구분하는지에 따라 다를 수 있습니다.
				// 예시에서는 recentMsg의 senderId와 receiverId를 사용합니다.
				chatSession.set({
					title: room.title,
					userId: userId,
					receiverId: room.recentMsg.receiverId,
					roomId: roomId,
					messages: [] // 필요에 따라 초기 메시지 설정
				});

				goto(`/chat/${roomId}`);
			} else {
				console.error('Chat room not found');
			}
		} else {
			console.error('User chat data not found in sessionStorage');
		}
	}

	function handleCloseChattingWindow() {
		isChattingWindowOpen = false;
	}
	function updateChatData(newChatData) {
    sessionStorage.setItem('userChatData', JSON.stringify(newChatData));
    userChatDataString.set(sessionStorage.getItem('userChatData'));
}

</script>

<Mainlayout>
	<div class="MainHeader">
		<div class="TitleBlock">
			<h2>채팅</h2>
			<button class="icon-button" on:click={openChattingWindow} aria-label="새로운 채팅">
				<i class="fas fa-comment-medical" title="새로운 채팅"></i>
			</button>
		</div>
		<input placeholder="채팅방 이름, 참여자 검색" />

		{#if isChattingWindowOpen}
			<NewChattingModal on:confirm={handleConfirmUser} on:close={handleCloseChattingWindow} />
		{/if}
	</div>
	<div class="MainContent">
		{#each chatRooms as chatRoom}
			<li class="chat-room-item" on:click={() => navigateToRoom(chatRoom.roomId)}>
				<img
					src={chatRoom.imgSrc || '../../src/asset/img/base_profile.jpg'}
					alt={chatRoom.name || 'Profile Image'}
				/>
				<p class="room-block-top">
					<b>{chatRoom.title}</b>
					<span>{chatRoom.date}</span>
					{#if chatRoom.unreadMessages > 0}
						<span class="unread-messages">{chatRoom.unreadMessages}</span>
					{/if}
				</p>
				<p class="preview">
					{chatRoom.preview}
				</p>
			</li>
		{/each}
	</div>
</Mainlayout>
