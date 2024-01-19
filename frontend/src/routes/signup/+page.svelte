<script lang="ts">
	import { authService } from '$lib/services/AuthService';
	import { goto } from '$app/navigation';
	import './signup.scss';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let username = '';
	let isPasswordMatch = true;
	let errorMessage = ''; // 에러 메시지를 위한 변수

	$: isFormValid =
		email.length > 0 &&
		password.length > 0 &&
		confirmPassword.length > 0 &&
		username.length > 0 &&
		isPasswordMatch;

	$: isPasswordMatch = password === confirmPassword;

	function isValidEmail(email: string) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	async function handleSignup() {
		errorMessage = ''; // 에러 메시지 초기화
		if (!isFormValid) return;

		if (!isValidEmail(email)) {
			errorMessage = '유효하지 않은 이메일 형식입니다.';
			return;
		}

		try {
			const user = await authService.signup(username, email, password);
			goto('/'); // 회원가입 성공 후 처리 로직
		} catch (error) {
			console.error('Signup failed', error);
			// 오류가 Error 인스턴스인 경우에만 메시지 사용
			if (error instanceof Error) {
				errorMessage = error.message || '회원가입 중 오류가 발생했습니다.';
			} else {
				errorMessage = '회원가입 중 알 수 없는 오류가 발생했습니다.';
			}
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
				{#if errorMessage}
					<p class="error-message">{errorMessage}</p>
				{/if}

				<button class={!isFormValid ? 'disabled' : ''} disabled={!isFormValid}>가입하기</button>
			</form>
		</div>
	</div>
</div>
