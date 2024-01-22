<script lang="ts">
	import { totalUnreadStore } from '$lib/stores/totalUnreadStore';
	import { chatRoomsStore } from '$lib/stores/chatRoomsStore';
	import { onMount, beforeUpdate } from 'svelte';
	import { goto } from '$app/navigation';
	import { socketStore } from '$lib/stores/socketStore';
	import { Socket } from 'socket.io-client';
	import Mainlayout from '$lib/Mainlayout.svelte';
	import NewChattingModal from '$lib/components/modal/NewChattingModal.svelte';
	import { chatSession } from '$lib/stores/ChatStore';
	import type { CreateRoomResponse, ChatRoom } from './index';
	import './chat.scss';

	// Socket 연결 및 채팅 관련 상태 변수 선언
	let socket: Socket | null = null;
	let isChattingWindowOpen = false;
	let searchQuery = ''; // 검색어 상태 변수
	let userId: string;
	let chatRooms: ChatRoom[] = [];

	// Socket 스토어 구독
	socketStore.subscribe((value) => {
		socket = value;
	});

	// 페이지 업데이트 전 사용자 프로필 정보를 세션 스토리지에서 불러오기
	beforeUpdate(() => {
		const userProfileString = sessionStorage.getItem('userProfile');

		if (userProfileString) {
			userId = JSON.parse(userProfileString).email;
		}
	});

	// 컴포넌트 마운트 시 채팅방 데이터 불러오기
	onMount(() => {
		if (socket) {
			socket.on('updateChatLobbyStatus', (data) => {
				// 서버로부터 받은 데이터 처리
				console.log('User Chat:', data);
				sessionStorage.setItem('userChatData', JSON.stringify(data));
				totalUnreadStore.set(data.payload.totalUnread || 0);
				updateChatRooms(data);
			});
		}

		loadChatRooms();
	});

	// 채팅방 데이터를 로컬 상태로 불러오는 함수
	function loadChatRooms() {
		if (typeof window !== 'undefined') {
			const userChatDataString = sessionStorage.getItem('userChatData');
			if (userChatDataString) {
				const userChatData = JSON.parse(userChatDataString);
				updateChatRooms(userChatData);
			}
		}
	}

	function updateChatRooms(userChatData: any) {
		chatRooms = userChatData.payload.rooms
			.map((room: any) => ({
				title: room.title,
				roomId: room.roomId,
				name: room.recentMsg.senderId,
				timestamp: room.recentMsg.timestamp,
				date: new Date(room.recentMsg.timestamp).toLocaleDateString(),
				preview: room.recentMsg.content,
				unreadMessages: room.userUnread
			}))
			.sort((a: ChatRoom, b: ChatRoom) => b.timestamp - a.timestamp);
	}

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
						title: response.payload.title,
						userId: response.payload.userId,
						receiverId: response.payload.receiverId,
						roomId: response.payload.roomId,
						messages: []
					});
					console.log('Room created successfully:', response.payload.roomId);
					goto(`/chat/${response.payload.roomId}`);
				} else {
					console.error('Failed to create room:', response);
					//실패
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
			const room = userChatData.payload.rooms.find((room: any) => room.roomId === roomId);
			if (room) {
				chatSession.set({
					title: room.title,
					userId: userId,
					receiverId: room.recentMsg.userId,
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

	// $: filteredChatRooms = chatRooms.filter((room) =>
	// 	room.title.toLowerCase().includes(searchQuery.toLowerCase())
	// );

	$: chatRooms = $chatRoomsStore.filter((room: any) =>
		room.title.toLowerCase().includes(searchQuery.toLowerCase())
	);
</script>

<div class="Container">
	<div class="MainHeader">
		<div class="TitleBlock">
			<h2>채팅</h2>
			<button class="icon-button" on:click={openChattingWindow} aria-label="새로운 채팅">
				<i class="fas fa-comment-medical" title="새로운 채팅"></i>
			</button>
		</div>
		<input placeholder="채팅방 이름, 참여자 검색" bind:value={searchQuery} />
		{#if isChattingWindowOpen}
			<NewChattingModal on:confirm={handleConfirmUser} on:close={handleCloseChattingWindow} />
		{/if}
	</div>
	<div class="MainContent">
		{#each chatRooms as chatRoom}
			<button class="chat-room-item" on:click={() => navigateToRoom(chatRoom.roomId)}>
				<img src={chatRoom.imgSrc || '../../src/asset/img/base_profile.jpg'} alt={chatRoom.name} />
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
			</button>
		{/each}
	</div>
</div>
