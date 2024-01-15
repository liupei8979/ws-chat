<script lang="ts">
	import { writable } from 'svelte/store';
	import { searchQuery } from '../../lib/stores/searchStore';
	import Mainlayout from '$lib/Mainlayout.svelte';
	import './friends.css';

	type Friend = {
		name: string;
		email: string;
		statusMessage?: string;
	};

	const isModalOpen = writable(false);
	const profile = {
		name: '사용자 이름',
		imgSrc: '../../src/asset/img/base_profile.jpg',
		statusMessage: '상태 메시지'
	};
	const filteredFriendList = [
		{ name: '친구1', email: 'friend1@example.com', statusMessage: '친구1 상태 메시지' }
	];
	// 더미 함수 정의
	function openSecondModal(friend: Friend) {
		console.log('Second modal opened for:', friend.name);
	}

	// 모달 열기 함수
	function openModal() {
		isModalOpen.set(true);
	}

	// 모달 닫기 함수
	function closeModal() {
		isModalOpen.set(false);
	}
</script>

<Mainlayout>
	<div class="Container">
		<div class="MainHeader">
			<div class="TitleBlock">
				<h2>친구</h2>
				<i class="fas fa-user-plus" title="친구 추가" on:click={openModal}></i>
			</div>
			<input placeholder="이름 검색" bind:value={$searchQuery} />
		</div>
	</div>
	<div class="MainContent">
		<div class="MyProfileBlock" on:click={openModal}>
			<img src={profile.imgSrc || '/base_profile.jpg'} alt={profile.name || '기본 프로필 이미지'} />
			<p>
				<b>{profile.name || '이름 없음'}</b>
			</p>
			<p>{profile.statusMessage || '상태 메시지 없음'}</p>
		</div>
		<div class="FriendsBorder">
			<p>친구 {filteredFriendList.length}</p>
		</div>
		{#each filteredFriendList as friend (friend.email)}
			<li on:click={() => openSecondModal(friend)}>
				<img src={'../../src/asset/img/base_profile.jpg'} alt={friend.name} />
				<p><b>{friend.name}</b></p>
				<p>{friend.statusMessage || '상태 메시지 없음'}</p>
			</li>
		{/each}
	</div>
</Mainlayout>
