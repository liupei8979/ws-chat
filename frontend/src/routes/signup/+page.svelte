<script lang="ts">
	import './signup.css';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let name = '';
	let isPasswordMatch = true;

	// 입력값에 따라 버튼 활성화 상태를 업데이트
	$: isFormValid =
		email.length > 0 &&
		password.length > 0 &&
		confirmPassword.length > 0 &&
		name.length > 0 &&
		isPasswordMatch;

	// 비밀번호 확인 절차를 업데이트
	$: isPasswordMatch = password === confirmPassword;
</script>

<div class="Container">
	<div class="MainContainer">
		<div class="HeaderContainer">
			<img src="../../src/asset/img/kakao_logo.png" alt="logo" />
		</div>
		<div class="SignupContainer">
			<input type="text" placeholder="이메일" maxLength="30" bind:value={email} />
			<input type="password" placeholder="비밀번호" maxLength="30" bind:value={password} />
			<input
				type="password"
				placeholder="비밀번호 재확인"
				maxLength="30"
				bind:value={confirmPassword}
			/>
			<input type="text" placeholder="이름" maxLength="30" bind:value={name} />
			{#if !isPasswordMatch}
				<p>비밀번호가 일치하지 않습니다.</p>
			{/if}
			<button class={!isFormValid ? 'disabled' : ''} disabled={!isFormValid}>가입하기</button>
		</div>
	</div>
</div>
