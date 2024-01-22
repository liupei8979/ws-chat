<script lang="ts">
	import { page } from '$app/stores';
	import Mainlayout from '$lib/Mainlayout.svelte';

	// 현재 경로를 구독합니다.
	let currentPath = '';
	$: currentPath = $page.url.pathname;

	// 특정 경로에서 Mainlayout을 숨길지 여부를 결정하는 함수
	function shouldHideLayout(path: any) {
		// 숨기고 싶은 특정 경로를 정의합니다.
		const hidePaths = ['/signup', '/'];
		const isChatSlugPath = path.startsWith('/chat/');
		return hidePaths.includes(path) || isChatSlugPath;
	}
</script>

{#if !shouldHideLayout(currentPath)}
	<Mainlayout>
		<slot />
	</Mainlayout>
{:else}
	<slot />
{/if}
