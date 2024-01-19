<script lang="ts">
	// 필요한 모듈 및 스타일시트 임포트
	import { authService } from '$lib/services/AuthService';
	import { goto } from '$app/navigation';
	import './signup.scss';

	// 회원가입에 필요한 사용자 입력 데이터를 저장할 변수들
	let email = '';
	let password = '';
	let confirmPassword = '';
	let username = '';
	let isPasswordMatch = true; // 비밀번호 일치 여부
	let errorMessage = ''; // 에러 메시지를 위한 변수

	// 폼의 유효성을 확인하는 반응형 변수
	$: isFormValid =
		email.length > 0 &&
		password.length > 0 &&
		confirmPassword.length > 0 &&
		username.length > 0 &&
		isPasswordMatch;

	// 비밀번호와 확인 비밀번호의 일치 여부를 확인하는 반응형 변수
	$: isPasswordMatch = password === confirmPassword;

	// 이메일이 유효한 형식인지 검사하는 함수
	function isValidEmail(email: string) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	// 회원가입 처리를 담당하는 비동기 함수
	async function handleSignup() {
		errorMessage = ''; // 에러 메시지 초기화
		if (!isFormValid) return; // 폼의 유효성 검사

		if (!isValidEmail(email)) {
			errorMessage = '유효하지 않은 이메일 형식입니다.';
			return;
		}

		try {
			// authService를 사용하여 회원가입 요청
			const user = await authService.signup(username, email, password);
			alert('가입성공을 축하드립니다 !');
			goto('/'); // 회원가입 성공 후 처리 로직
		} catch (error) {
			console.error('Signup failed', error);
			// 오류가 Error 인스턴스인 경우 오류 메시지 표시
			if (error instanceof Error) {
				errorMessage = error.message || '회원가입 중 오류가 발생했습니다.';
			} else {
				// 오류 타입이 알려지지 않은 경우 일반 오류 메시지 표시
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
