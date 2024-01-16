<script lang="ts">
	import { authService } from '$lib/services/AuthService';
	import { goto } from '$app/navigation';
	import './signup.css';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let username = '';
	let isPasswordMatch = true;

	$: isFormValid =
		email.length > 0 &&
		password.length > 0 &&
		confirmPassword.length > 0 &&
		username.length > 0 &&
		isPasswordMatch;

	$: isPasswordMatch = password === confirmPassword;

	// 폼 제출을 처리하는 함수
	async function handleSignup() {
		if (!isFormValid) return; // 유효성 검사

		try {
			const user = await authService.signup(username, email, password);
			// 회원가입 성공 후 처리 로직, 예: 로그인 페이지로 리디렉션
			goto('/');
		} catch (error) {
			console.error('Signup failed', error);
			// 오류 처리 로직
		}
	}
</script>

<div class="Container">
	<div class="MainContainer">
		<div class="HeaderContainer">
			<img src="../../src/asset/img/kakao_logo.png" alt="logo" />
		</div>
		<div class="SignupContainer">
			<form on:submit|preventDefault={handleSignup}>
				<input type="text" placeholder="이메일" maxLength="30" bind:value={email} />
				<input type="password" placeholder="비밀번호" maxLength="30" bind:value={password} />
				<input
					type="password"
					placeholder="비밀번호 재확인"
					maxLength="30"
					bind:value={confirmPassword}
				/>
				<input type="text" placeholder="이름" maxLength="30" bind:value={username} />
				{#if !isPasswordMatch}
					<p>비밀번호가 일치하지 않습니다.</p>
				{/if}
				<button class={!isFormValid ? 'disabled' : ''} disabled={!isFormValid}>가입하기</button>
			</form>
		</div>
	</div>
</div>
