<script lang="ts">
	import './chat.css';
	import Mainlayout from '$lib/Mainlayout.svelte';
	import NewChattingModal from '$lib/components/modal/NewChattingModal.svelte';

	let isChattingWindowOpen = false;
	// 더미 데이터 정의
    const chatRooms = [
        {
            name: 'Room 1',
            date: '2024-01-16',
            imgSrc: '../../src/asset/img/base_profile.jpg',
            preview: 'Last message in Room 1',
            unreadMessages: 3 // 안 읽은 메시지 수
        },
        {
            name: 'Room 2',
            date: '2024-01-15',
            imgSrc: '../../src/asset/img/base_profile.jpg',
            preview: 'Last message in Room 2',
            unreadMessages: 5 // 안 읽은 메시지 수
        }
    ];

	function openChattingWindow() {
		isChattingWindowOpen = true;
	}

    function handleConfirmUser(event: CustomEvent) {
        const receiverId: string = event.detail.userId
        // createOrJoinRoom(receiverId)
        isChattingWindowOpen = false
    }

    function handleCloseChattingWindow() {
        isChattingWindowOpen = false
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
            <li>
                <img src={chatRoom.imgSrc} alt={chatRoom.name || 'Profile Image'} />
                <p class="room-block-top">
                    <b>{chatRoom.name}</b>
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
