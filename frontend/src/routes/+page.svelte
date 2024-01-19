<script lang="ts">
	// authService 및 navigation 모듈 임포트
	import { authService } from '$lib/services/AuthService';
	import { goto } from '$app/navigation';
	import './login.scss';

	// 이메일과 비밀번호를 저장할 로컬 상태 변수
	let email = '';
	let password = '';

	// 이메일과 비밀번호가 모두 입력되었는지 확인하여 로그인 버튼 활성화 상태 결정
	$: isButtonDisabled = !email || !password;

	// 로그인 처리 함수
	async function handleLogin() {
		try {
			// authService를 사용하여 로그인 요청
			const token = await authService.login(email, password);
			// 성공적으로 로그인하면 받은 토큰을 sessionStorage에 저장
			sessionStorage.setItem('token', token);
			// 사용자를 친구 목록 페이지로 리디렉션
			window.location.href = '/friends';
		} catch (error) {
			// 로그인 실패시 오류 메시지 출력
			console.error('Login failed', error);
			// 오류가 Error 인스턴스인 경우 오류 메시지 표시
			if (error instanceof Error) {
				alert(error.message); // 서버에서 받은 오류 메시지를 표시
			} else {
				// 오류 타입이 알려지지 않은 경우 일반 오류 메시지 표시
				alert('로그인 중 알 수 없는 오류가 발생했습니다.');
			}
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
