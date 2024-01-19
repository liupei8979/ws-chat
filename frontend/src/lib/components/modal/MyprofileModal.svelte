<script lang="ts">
	import type { UserProfile } from '../../../routes/friends/index';
	import { userService } from '$lib/services/UserService';
	export let closeMyProfileModal: () => void;
	export let userProfile: UserProfile;

	let newUsername = '';
	let newStatusMessage = '';
	let editingUsername = false;
	let editingStatusMessage = false;

	async function updateProfile() {
		const updatedUsername = newUsername || userProfile.username;
		const updatedStatusMessage = newStatusMessage || userProfile.statusMessage;

		try {
			await userService.updateProfile(updatedUsername, updatedStatusMessage);
			window.location.href = '/friends';
			closeMyProfileModal();
		} catch (error) {
			console.error('Profile update failed:', error);
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			closeMyProfileModal();
		}
	}

	function handleEnterPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			updateProfile();
		}
	}

	function enableEditUsername() {
		editingUsername = true;
		newUsername = userProfile.username;
	}

	function enableEditStatusMessage() {
		editingStatusMessage = true;
		newStatusMessage = userProfile.statusMessage;
	}

	function handleKeyPressOnUsername(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			enableEditUsername();
		}
	}

	function handleKeyPressOnStatusMessage(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			enableEditStatusMessage();
		}
	}
</script>

<div class="Wrapper">
	<div class="BackgroundBase">
		<!-- 배경 이미지가 있다면 아래 img 태그에 삽입 -->
	</div>
	<div class="profile-container">
		<button class="icon-button" on:click={closeMyProfileModal} on:keypress={handleKeyPress}>
			<i class="fas fa-times" aria-hidden="true"></i>
		</button>
		<img
			src={userProfile.imgSrc || '../../src/asset/img/base_profile.jpg'}
			alt={userProfile.username || '기본 프로필 이미지'}
			class="ProfileImage"
		/>
		<p class="ProfileName">
			{#if editingUsername}
				<input type="text" bind:value={newUsername} on:keyup={handleEnterPress} />
			{:else}
				<b
					role="button"
					on:click={enableEditUsername}
					on:keypress={handleKeyPressOnUsername}
					tabindex="0">{userProfile.username || '이름 없음'}</b
				>
			{/if}
		</p>
		<p class="ProfileStatusMessage">
			{#if editingStatusMessage}
				<input type="text" bind:value={newStatusMessage} on:keyup={handleEnterPress} />
			{:else}
				<span
					role="button"
					on:click={enableEditStatusMessage}
					on:keypress={handleKeyPressOnStatusMessage}
					tabindex="0">{userProfile.statusMessage || '상태 메시지 없음'}</span
				>
			{/if}
		</p>
	</div>
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
		z-index: 10000;

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
			margin-top: 300px;
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

		.icon-button {
			background: none;
			border: none;
			cursor: pointer;
			position: absolute;
			top: 15px;
			right: 15px;
			font-size: 20px;
			color: #fff;
			z-index: 100;
		}

		input[type='text'] {
			width: 70%; // 너비 조정
			padding: 2px;
			margin: 10px 0; // 상하 여백
			border: 1px solid #ddd;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // 그림자 추가
		}
	}
</style>
