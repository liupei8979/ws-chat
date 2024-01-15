<script lang="ts">
	import { onMount } from 'svelte';

	let pathname = '';

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
						<div style="display:flex; align-items:center;">
							{#if pathname === btn.route}
								<i class={`${btn.activeUrl} activeIcon`}></i>
							{:else}
								<i class={`${btn.url} Icon`}></i>
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
</style>
