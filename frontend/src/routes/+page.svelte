<script lang="ts">
	import { authService } from '$lib/services/AuthService';
	import { goto } from '$app/navigation';
	import './login.css';

	let email = '';
	let password = '';
	$: isButtonDisabled = !email || !password;

	// 로그인 처리 함수
	async function handleLogin() {
		try {
			const token = await authService.login(email, password);
			sessionStorage.setItem('token', token); // 세션 스토리지에 토큰 저장
			// 로그인 성공 후 처리, 예: 홈페이지로 리디렉션
			goto('/friends');
		} catch (error) {
			console.error('Login failed', error);
			// 로그인 실패 시 처리 로직
		}
	}
</script>

<div class="Container">
	<div class="MainContainer">
		<div class="HeaderrContainer">
			<img src="../../src/asset/img/kakao_logo.png" alt="logo" />
		</div>
		<div class="LoginContainer">
			<form on:submit|preventDefault={handleLogin}>
				<input type="text" name="email" placeholder="계정" maxLength="30" bind:value={email} />
				<!-- 이메일 입력 필드에 bind:value 추가 -->
				<input
					type="password"
					name="password"
					autoComplete="new-password"
					placeholder="비밀번호"
					maxLength="30"
					bind:value={password}
				/>
				<!-- 비밀번호 입력 필드에 bind:value 추가 -->
				<button type="submit" disabled={isButtonDisabled}>
					<!-- 버튼에 disabled 속성 추가 -->
					<span>로그인</span>
				</button>
				<!-- 로그인 실패 메시지가 표시될 곳 -->
			</form>
			<ul>
				<li>
					<a href="/signup">회원 가입</a>
				</li>
			</ul>
		</div>
	</div>
</div>
