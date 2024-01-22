<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { socketStore } from '$lib/stores/socketStore';
	import io, { Socket } from 'socket.io-client';
	import Mainlayout from '$lib/Mainlayout.svelte';
	import { totalUnreadStore } from '$lib/stores/totalUnreadStore';

	// 현재 경로를 구독합니다.
	let currentPath = '';
	let socket: Socket;
	let totalUnread = 0;
	// $: totalUnread = $totalUnreadStore;
	$: currentPath = $page.url.pathname;

	// 특정 경로에서 Mainlayout을 숨길지 여부를 결정하는 함수
	function shouldHideLayout(path: any) {
		// 특정 경로 숨기기.
		const hidePaths = ['/signup', '/'];
		const isChatSlugPath = path.startsWith('/chat/');
		return hidePaths.includes(path) || isChatSlugPath;
	}

	onMount(() => {
		if (typeof window !== 'undefined' && sessionStorage.getItem('token')) {
			const accessToken = sessionStorage.getItem('token');
			socket = io(`${import.meta.env.VITE_HOST_URL}:${import.meta.env.VITE_HOST_WS_PORT}/chat`, {
				transports: ['websocket'],
				query: {
					accessToken: `Bearer ${accessToken}`
				}
			});

			socket.on('connect', () => {
				console.log('Connected to the chat server', socket.id);
				socket.on('updateChatLobbyStatus', (data) => {
					console.log('User Chat Data:', data);
					sessionStorage.setItem('userChatData', JSON.stringify(data));
					totalUnreadStore.set(data.payload.totalUnread || 0);
				});
			});
			socketStore.set(socket);
		}
		const userChatDataString = sessionStorage.getItem('userChatData');
		if (userChatDataString) {
			const userChatData = JSON.parse(userChatDataString);
			totalUnread = userChatData.payload.totalUnread || 0;
		}
	});
</script>

{#if !shouldHideLayout(currentPath)}
	<Mainlayout>
		<slot />
	</Mainlayout>
{:else}
	<slot />
{/if}
