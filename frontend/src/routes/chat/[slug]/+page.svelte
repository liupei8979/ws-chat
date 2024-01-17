<script lang="ts">
	import './chattingRoom.css';
	import { page } from '$app/stores';

	let roomId: string = $page.params.slug;
	$: roomId = $page.params.slug;
	// Define a type for the message structure
	type Message = {
		id: string;
		text: string;
		timestamp: Date;
		senderId: string;
	};

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
	<form>
		<textarea placeholder="메시지를 입력하세요..." />
		<button type="submit">전송</button>
	</form>
</div>
