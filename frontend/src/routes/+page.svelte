<script lang="ts">
	import { authService } from '$lib/services/AuthService';
	import { goto } from '$app/navigation';
	import './login.scss';

	let email = '';
	let password = '';
	$: isButtonDisabled = !email || !password;

	// 로그인 처리 함수
	async function handleLogin() {
		try {
			const token = await authService.login(email, password);
			sessionStorage.setItem('token', token);
			window.location.href = '/friends';
		} catch (error) {
			console.error('Login failed', error);
			if (error instanceof Error) {
				alert(error.message); // 서버에서 받은 오류 메시지를 표시
			} else {
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
