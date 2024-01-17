<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount, beforeUpdate } from 'svelte';
	import { searchQuery } from '../../lib/stores/searchStore';
	import Mainlayout from '$lib/Mainlayout.svelte';
	import FindFriendModal from '$lib/components/modal/FindFriendModal.svelte';
	import FriendsProfileModal from '$lib/components/modal/FriendsProfileModal.svelte';
	import MyprofileModal from '$lib/components/modal/MyprofileModal.svelte';
	import { userService } from '$lib/services/UserService';
	import type { UserProfile, Friend } from '.';
	import './friends.css';
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

	let userProfile: UserProfile = {
		email: '',
		statusMessage: '',
		username: '',
		friends: []
	};

	onMount(async () => {
		try {
			const profileData = await userService.getProfile();
			userProfile = profileData;
			filteredFriendList = userProfile.friends;
		} catch (error) {
			console.error(error);
		}
	});

	$: friendList = userProfile.friends
		? Object.values(userProfile.friends).sort((a, b) => a.username.localeCompare(b.username))
		: [];
	$: filteredFriendList = $searchQuery
		? friendList.filter((friend) =>
				friend.username.toLowerCase().includes($searchQuery.toLowerCase())
			)
		: friendList;
</script>

<Mainlayout>
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
				alt={userProfile.username || '기본 프로필 이미지'}
			/>
			<p><b>{userProfile.username || '이름 없음'}</b></p>
			<p>{userProfile.statusMessage || '상태 메시지 없음'}</p>
		</button>
		<div class="FriendsBorder">
			<p>친구 {filteredFriendList.length}</p>
		</div>
		{#each filteredFriendList as friend (friend.email)}
			<button class="MyProfileBlock" on:click={() => openFriendsProfileModal(friend)}>
				<img src={'../../src/asset/img/base_profile.jpg'} alt={friend.username} />
				<p><b>{friend.username}</b></p>
				<p>{friend.statusMessage || '상태 메시지 없음'}</p>
			</button>
		{/each}
	</div>
</Mainlayout>

{#if $isFindFriendModalOpen}
	<FindFriendModal onClose={closeFindFriendModal} />
{/if}

{#if $isMyProfileModalOpen}
	<MyprofileModal {userProfile} {closeMyProfileModal} />
{/if}

{#if $isFriendsProfileModalOpen && $selectedFriend}
	<FriendsProfileModal friend={$selectedFriend} onClose={closeFriendsProfileModal} />
{/if}
