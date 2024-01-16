<script lang="ts">
	import './login.css';

	let email = '';
	let password = '';
	$: isButtonDisabled = !email || !password;
</script>

<div class="Container">
	<div class="MainContainer">
		<div class="HeaderContainer">
			<img src="../../src/asset/img/kakao_logo.png" alt="logo" />
		</div>
		<div class="LoginContainer">
			<form>
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
