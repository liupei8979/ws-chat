<script lang="ts">
	import { totalUnreadStore } from '$lib/stores/totalUnreadStore';
	import { onMount, beforeUpdate, setContext } from 'svelte';
	import { socketStore } from '$lib/stores/socketStore';
	import io, { Socket } from 'socket.io-client';

	let pathname = '';
	let totalUnread = 0;
	$: totalUnread = $totalUnreadStore;
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
			sessionStorage.removeItem('userChatData');
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
							{#if btn.title === 'chatting' && totalUnread > 0}
								<!-- totalUnread가 0보다 크면 숫자 표시 -->
								<span class="unreadMessages">{totalUnread}</span>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</body>
<slot />

<style lang="scss">
	.Sidebar {
		position: fixed;
		top: 0;
		left: 0;
		width: 130px;
		height: 100%;
		min-height: 100vh;
		background: #dfdfdf;
		padding-top: 20px;
		z-index: 10000;

		.menuBtn {
			display: flex;
			align-items: center;
			justify-content: center;

			i {
				padding: 20px;
				font-size: 40px;
				cursor: pointer;
				&:hover {
					color: #888777;
				}
			}

			.activeIcon {
				color: black;
			}

			.Icon {
				color: #a6a7a8;
			}
		}

		.iconContainer {
			position: relative;
			display: flex;
			align-items: center;

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
		}
	}
</style>
