<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount, beforeUpdate } from 'svelte';
	import { goto } from '$app/navigation';
	import { socketStore } from '$lib/stores/socketStore';
	import { Socket } from 'socket.io-client';
	import { searchQuery } from '../../lib/stores/searchStore';
	import Mainlayout from '$lib/Mainlayout.svelte';
	import FindFriendModal from '$lib/components/modal/FindFriendModal.svelte';
	import FriendsProfileModal from '$lib/components/modal/FriendsProfileModal.svelte';
	import MyprofileModal from '$lib/components/modal/MyprofileModal.svelte';
	import { userService } from '$lib/services/UserService';
	import { chatSession } from '$lib/stores/ChatStore';
	import type { UserProfile, Friend, CreateRoomResponse } from '.';
	import './friends.scss';
	import {
		isFindFriendModalOpen,
		isMyProfileModalOpen,
		isFriendsProfileModalOpen,
		selectedFriend,
		openFindFriendModal,
		openMyProfileModal,
		openFriendsProfileModal,
		closeFindFriendModal,
		closeMyProfileModal,
		closeFriendsProfileModal
	} from '$lib/stores/ModalStore';

	let socket: Socket | null = null;
	let userId: string | null = null;

	socketStore.subscribe((value) => {
		socket = value;
	});

	let userProfile: UserProfile = {
		email: '',
		statusMessage: '',
		username: '',
		friends: []
	};
	beforeUpdate(() => {
		const userProfileString = sessionStorage.getItem('userProfile');

		if (userProfileString) {
			userId = JSON.parse(userProfileString).email;
		}
	});

	onMount(async () => {
		try {
			const profileData = await userService.getProfile();
			userProfile = profileData;
			filteredFriendList = userProfile.friends;
		} catch (error) {
			console.error(error);
		}
	});

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
					console.log('Room created successfully:', response.payload);
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

	function handleUserSelected(event: CustomEvent) {
		const receiverId = event.detail.receiverId;
		createOrJoinRoom(receiverId);
	}

	$: friendList = userProfile.friends
		? Object.values(userProfile.friends).sort((a, b) => a.username.localeCompare(b.username))
		: [];
	$: filteredFriendList = $searchQuery
		? friendList.filter((friend) =>
				friend.username.toLowerCase().includes($searchQuery.toLowerCase())
			)
		: friendList;
</script>

<div class="Container">
	<div class="MainHeader">
		<div class="TitleBlock">
			<h2>친구</h2>
			<button class="icon-button" title="친구 추가" on:click={openFindFriendModal}>
				<i class="fas fa-user-plus"></i>
			</button>
		</div>
		<input placeholder="이름 검색" bind:value={$searchQuery} />
	</div>
</div>
<div class="MainContent">
	<button class="MyProfileBlock" on:click={openMyProfileModal}>
		<img
			src={userProfile.imgSrc || '../../src/asset/img/base_profile.jpg'}
			alt={userProfile.username}
		/>
		<p><b>{userProfile.username}</b></p>
		<p>{userProfile.statusMessage || '.'}</p>
	</button>
	<div class="FriendsBorder">
		<p>친구 {filteredFriendList.length}</p>
	</div>
	{#each filteredFriendList as friend (friend.email)}
		<button class="MyProfileBlock" on:click={() => openFriendsProfileModal(friend)}>
			<img src={'../../src/asset/img/base_profile.jpg'} alt={friend.username} />
			<p><b>{friend.username}</b></p>
			<p>{friend.statusMessage || '.'}</p>
		</button>
	{/each}
</div>

{#if $isFindFriendModalOpen}
	<FindFriendModal onClose={closeFindFriendModal} />
{/if}

{#if $isMyProfileModalOpen}
	<MyprofileModal {userProfile} {closeMyProfileModal} />
{/if}

{#if $isFriendsProfileModalOpen && $selectedFriend}
	<FriendsProfileModal
		friend={$selectedFriend}
		onClose={closeFriendsProfileModal}
		on:userSelected={handleUserSelected}
	/>
{/if}
