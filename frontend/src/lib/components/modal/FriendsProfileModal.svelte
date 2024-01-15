<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	export let onClose: () => void;
	export let friend: {
		name: string;
		email: string;
		statusMessage?: string;
	};

	type User = {
		email: string;
		name: string;
		imgSrc?: string;
	};

	const dispatch = createEventDispatcher();
	let users: User[] = [];
	let selectedUserId: string = '';

	// onMount(() => {
	//     const userProfileString = sessionStorage.getItem('userProfile')
	//     if (userProfileString) {
	//         const userProfile = JSON.parse(userProfileString)
	//         users = Object.values(userProfile.friends || {}) as User[]
	//     }
	// })

	function handleUserSelect(userEmail: string) {
		selectedUserId = userEmail;
		console.log('Selected User:', userEmail);
		dispatch('userSelected', { receiverId: userEmail }); // Dispatching event with receiverId
	}
</script>

<div class="Wrapper">
	<div class="BackgroundBase">
		<!-- 배경 이미지가 있다면 아래 img 태그에 삽입 -->
	</div>
	<div class="profile-container">
		<i class="fas fa-times" on:click={onClose}></i>
		<img
			src={'../../src/asset/img/base_profile.jpg'}
			alt={friend.name || '기본 프로필 이미지'}
			class="ProfileImage"
		/>
		<p class="ProfileName">
			<b>{friend.name || '이름 없음'}</b>
		</p>
		<p class="ProfileStatusMessage">
			{friend.statusMessage || '상태 메시지 없음'}
		</p>
	</div>
	<div class="chat-container" on:click={() => handleUserSelect(friend.email)}>
		<i class="fas fa-comment"></i>
		<p>1:1 채팅</p>
	</div>
</div>

<style>
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
		z-index: 10000; /* 다른 요소들 위에 위치 */
	}

	.BackgroundBase {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #848b91;
		z-index: -1;
		overflow: hidden;
		& img {
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
		position: absolute;
		top: 15px;
		right: 15px;
		font-size: 15px;
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
		margin-bottom: 30px;
	}
	.chat-container {
		border-top: 1px solid rgba(255, 255, 255, 0.5);
		display: flex;
		flex-direction: column; /* 세로 방향으로 스택 */
		align-items: center; /* 가로 축에서 중앙 정렬 */
	}

	.chat-container i {
		color: #fff;
		font-size: 30px;
		margin-top: 25px;
		margin-bottom: 10px;
	}

	.chat-container p {
		margin: 0; /* 필요에 따라 p 태그의 마진을 제거하거나 조정 */
	}
</style>
