<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	export let onClose: () => void;
	export let friend: {
		username: string;
		email: string;
		statusMessage?: string;
	};

	type User = {
		email: string;
		username: string;
		imgSrc?: string;
	};

	const dispatch = createEventDispatcher();
	let users: User[] = [];
	let selectedUserId: string = '';

	onMount(() => {
		const userProfileString = sessionStorage.getItem('userProfile');
		if (userProfileString) {
			const userProfile = JSON.parse(userProfileString);
			users = Object.values(userProfile.friends || {}) as User[];
		}
	});

	function handleUserSelect(userEmail: string) {
		selectedUserId = userEmail;
		console.log('Selected User:', userEmail);
		dispatch('userSelected', { receiverId: userEmail }); // Dispatching event with receiverId
	}

	function handleKeyPress(event: KeyboardEvent, action: Function) {
		if (event.key === 'Enter' || event.key === ' ') {
			action();
		}
	}
</script>

<div class="Wrapper">
	<div class="BackgroundBase">
		<!-- 배경 이미지가 있다면 아래 img 태그에 삽입 -->
	</div>
	<div class="profile-container">
		<button class="icon-button" on:click={onClose} on:keypress={(e) => handleKeyPress(e, onClose)}>
			<i class="fas fa-times" aria-hidden="true"></i>
		</button>
		<img
			src={'../../src/asset/img/base_profile.jpg'}
			alt={friend.username || '기본 프로필 이미지'}
			class="ProfileImage"
		/>
		<p class="ProfileName">
			<b>{friend.username || '이름 없음'}</b>
		</p>
		<p class="ProfileStatusMessage">
			{friend.statusMessage || '상태 메시지 없음'}
		</p>
	</div>
	<button
		class="chat-container"
		on:click={() => handleUserSelect(friend.email)}
		on:keypress={(e) => handleKeyPress(e, () => handleUserSelect(friend.email))}
	>
		<i class="fas fa-comment" aria-hidden="true"></i>
		<p>1:1 채팅</p>
	</button>
</div>

<style lang="scss">
	.Wrapper {
		position: fixed;
		top: 30%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 360px;
		height: 580px;
		margin: auto;
		color: #fff;
		text-align: center;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		z-index: 10000; // 다른 요소들 위에 위치

		.BackgroundBase {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: #848b91;
			z-index: -1;
			overflow: hidden;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				opacity: 0.6;
			}
		}

		.profile-container {
			margin-top: 225px;
		}

		i.fas.fa-times {
			top: 10px;
			right: 15px;
			font-size: 20px;
			color: #fff;
			z-index: 100;
			cursor: pointer;
		}

		.ProfileImage {
			width: 100px;
			height: 100px;
			border-radius: 20px;
			margin-top: 30px;
			object-fit: cover;
			cursor: pointer;
		}

		.ProfileName {
			font-size: 24px;
			color: #fff;
			margin: 10px 0;
		}

		.ProfileStatusMessage {
			font-size: 18px;
			color: #fff;
		}

		.chat-container {
			background: none;
			border: none;
			i {
				color: #fff;
				font-size: 30px;
				margin-top: 25px;
				margin-bottom: 10px;
			}

			p {
				margin: 0;
				color: #fff;
			}

			.icon-button {
				background: none;
				border: none;
				cursor: pointer;
				font-size: 20px;
				color: #fff;
			}
		}

		.icon-button {
			position: absolute;
			top: 15px;
			right: 15px;
			font-size: 15px;
			color: #fff;
			z-index: 100;
		}
	}
</style>
