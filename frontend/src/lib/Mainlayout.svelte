<script lang="ts">
	import { onMount, beforeUpdate, setContext } from 'svelte';
	import { socketStore } from '$lib/stores/socketStore';
	import io, { Socket } from 'socket.io-client';
	import type { UserChatInitial } from '../../../packages/types/ws-response';

	let pathname = '';
	let socket: Socket;

	const btns = [
		{
			title: 'friends',
			url: 'fas fa-user',
			activeUrl: 'fas fa-user',
			route: '/friends'
		},
		{
			title: 'chatting',
			url: 'fas fa-comment',
			activeUrl: 'fas fa-comment',
			route: '/chat'
		},
		{
			title: 'logout',
			url: 'fas fa-sign-out-alt',
			activeUrl: 'fas fa-sign-out-alt',
			route: '/',
			action: () => confirmLogout()
		}
	];

	function confirmLogout() {
		if (confirm('로그아웃 하시겠습니까?')) {
			sessionStorage.removeItem('token');
			sessionStorage.removeItem('userProfile');
			navigateTo('/');
		}
	}

	function handleKeydown(event: KeyboardEvent, btn: { route: string; action?: () => void }) {
		if (event.key === 'Enter') {
			btn.action ? btn.action() : navigateTo(btn.route);
		}
	}

	function navigateTo(route: string) {
		location.href = route;
	}
	

	onMount(() => {
		pathname = window.location.pathname;
		console.log('Current URL:', pathname);
		if (typeof window !== 'undefined' && sessionStorage.getItem('token')) {
			const accessToken = sessionStorage.getItem('token');
			const userProfileString = sessionStorage.getItem('userProfile');
			if (userProfileString) {
				const userProfile = JSON.parse(userProfileString);
				const userId = encodeURIComponent(userProfile.email);

				socket = io('http://localhost:3030/chat', {
					transports: ['websocket'],
					query: {
						accessToken: `Bearer ${accessToken}`,
						userId: userId
					}
				});
				console.log(socket);
			
				socket.on('connect', () => {
					console.log('Connected to the chat server', socket.id);
					socketStore.set(socket);
					// 서버로부터 받은 데이터 처리
					socket.on('connectResponse', (data: UserChatInitial) => {
						console.log('User Chat Data:', data);
						// 여기서 data를 사용하여 UI 업데이트 등의 로직 수행
					});
				});
			}
		}
	});
</script>

<body>
	<div class="Wrapper">
		<div class="Sidebar">
			{#each btns as btn}
				<div
					class="menuBtn"
					role="button"
					tabindex="0"
					on:click={() => (btn.action ? btn.action() : navigateTo(btn.route))}
					on:keydown={(event) => handleKeydown(event, btn)}
				>
					<div class="menuInner">
						<div class="iconContainer">
							{#if pathname === btn.route}
								<i class={`${btn.activeUrl} activeIcon`}></i>
							{:else}
								<i class={`${btn.url} Icon`}></i>
							{/if}
							{#if btn.title === 'chatting'}
								<!-- unreadMessages 는 값을 받아와서 적용시켜야됨 임의로 숫자 넣어둠-->
								<span class="unreadMessages">3</span>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</body>
<slot />

<style>
	.Sidebar {
		position: fixed;
		top: 0;
		left: 0;
		width: 130px;
		height: 100%;
		min-height: 100vh;
		background: #dfdfdf;
		padding-top: 20px;
		z-index: 2;
	}
	.menuBtn {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.menuBtn i {
		padding: 20px;
		font-size: 40px;
		cursor: pointer;
	}

	.menuBtn i:hover {
		color: #888777;
	}

	.activeIcon {
		color: black;
	}

	.Icon {
		color: #a6a7a8;
	}

	.iconContainer {
		position: relative;
		display: flex;
		align-items: center;
	}
	.unreadMessages {
		position: absolute;
		top: 15px;
		right: 0;
		background-color: red;
		color: white;
		font-size: 15px;
		padding: 4px 10px;
		border-radius: 10px;
		min-width: 16px;
		text-align: center;
	}
</style>
