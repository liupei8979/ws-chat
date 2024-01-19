<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	type User = {
		email: string;
		username: string;
		imgSrc?: string;
	};

	let users: User[] = [];
	let selectedUserId: string | null = null;

	onMount(() => {
		const userProfileString = sessionStorage.getItem('userProfile');
		if (userProfileString) {
			const userProfile = JSON.parse(userProfileString);
			users = Object.values(userProfile.friends || {}) as User[];
		}
	});

	function handleUserSelect(userId: string) {
		selectedUserId = userId;
		dispatch('select', { userId: userId });
	}

	function handleClose() {
		console.log('Modal closed');
		dispatch('close');
	}

	function handleConfirm() {
		if (selectedUserId) {
			console.log('Confirmed with user:', selectedUserId);
			dispatch('confirm', { userId: selectedUserId });
		}
	}
</script>

<div class="Wrapper">
	<div class="HeaderWrapper">
		<h4>대화 상대 선택</h4>
	</div>
	<div class="ContentWrapper">
		{#each users as user (user.email)}
			<button
				class="UserItem {selectedUserId === user.email ? 'selected' : ''}"
				on:click={() => handleUserSelect(user.email)}
			>
				<img src={user.imgSrc || '../../src/asset/img/base_profile.jpg'} alt={user.username} />
				<span class="UserName">{user.username}</span>
			</button>
		{/each}
	</div>
	<div class="FooterWrapper">
		<button class="cancel" on:click={handleClose}>취소</button>
		<button class="confirm {selectedUserId ? '' : 'disabled'}" on:click={handleConfirm}>확인</button
		>
	</div>
</div>

<style lang="scss">
	.Wrapper {
		position: relative;
		transform: translate(-50%, 0);
		width: 380px;
		border: 1px solid #969696;
		margin: auto;
		color: #000;
		background: #fff;
		overflow: hidden;

		.HeaderWrapper {
			width: 100%;
			height: 50px;
			font-size: 18px;
			text-align: center;
			border-bottom: 1px solid #dcdcdc;
		}

		.ContentWrapper {
			width: 100%;
		}

		.UserItem {
			display: flex;
			align-items: center;
			padding: 15px;
			font-size: 18px;
			cursor: pointer;
			border: none;
			background: none;
			border-bottom: 1px solid #f0f0f0;
			text-align: left;
			width: 100%;
			box-sizing: border-box;

			&.selected {
				background-color: #e0e0e0;
			}

			img {
				width: 40px;
				height: 40px;
				border-radius: 10px;
				object-fit: cover;
			}

			.UserName {
				margin-left: 15px;
			}
		}

		.FooterWrapper {
			bottom: 0;
			width: 100%;
			padding: 10px;
			text-align: right;

			.confirm {
				padding: 10px 20px;
				margin-right: 20px;
				background-color: #fee500;
				border: 1px solid #dcdcdc;
				cursor: pointer;

				&.disabled {
					background-color: #e2e2e2;
					color: #969696;
				}
			}

			.cancel {
				padding: 10px 20px;
				background-color: #fff;
				border: 1px solid #dcdcdc;
				cursor: pointer;
			}
		}
	}
</style>
