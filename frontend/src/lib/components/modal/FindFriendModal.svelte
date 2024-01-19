<script lang="ts">
	export let onClose: () => void;
	const redirectUrl = '/friends'; // 리디렉트할 URL

	let userId = '';
	let errorMessage = ''; // 실패 메시지를 위한 상태
	const MAX_LEN = 30;

	async function onSubmit(event: Event) {
		event.preventDefault();
		errorMessage = ''; // 초기화
		const accessToken = sessionStorage.getItem('token');
		if (accessToken && userId) {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_HOST_URL}:${import.meta.env.VITE_HOST_PORT}/user/friend`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${accessToken}`
						},
						body: JSON.stringify({ email: userId })
					}
				);

				if (response.ok) {
					window.location.href = redirectUrl; // 성공 시 리디렉트
					onClose(); // 성공 시 창 닫기
				} else {
					const data = await response.json();
					errorMessage = data.message || '친구 추가 실패'; // 실패 메시지 설정
				}
			} catch (error) {
				console.error('친구 추가 중 오류 발생:', error);
				errorMessage = '오류가 발생했습니다. 다시 시도해주세요.'; // 오류 메시지 설정
			}
		} else {
			errorMessage = '유효한 이메일을 입력해주세요.'; // 입력 오류 메시지 설정
		}
	}

	function onIdInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		userId = target.value;
	}

	function handleEnterKey(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			onSubmit(event);
		}
	}

	function handleCloseClick() {
		onClose();
	}
</script>

<div class="Wrapper">
	<button class="close-button" on:click={handleCloseClick}>
		<i class="fas fa-times"></i>
	</button>
	<h4>친구 추가</h4>
	<div class="Menu">
		<span>Email로 추가</span>
	</div>
	<form>
		<input
			bind:value={userId}
			maxLength={MAX_LEN}
			on:change={onIdInputChange}
			on:keydown={handleEnterKey}
		/>
		<span>{`${userId.length}/${MAX_LEN}`}</span>
	</form>
	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{/if}
</div>

<style lang="scss">
	.Wrapper {
		position: fixed;
		left: 50%;
		top: 30%;
		transform: translate(-50%, -50%);
		width: 360px;
		height: 450px;
		border: 1px solid #646464;
		background-color: #fff;
		z-index: 10000;
		overflow: auto;

		h4 {
			padding: 25px 20px;
			font-size: 18px;
			font-weight: 600;
		}

		form {
			width: 80%;
			border-bottom: 2px solid #000;
			margin: 30px auto;

			input {
				outline: none;
				border: none;
				width: 250px;
			}

			span {
				position: fixed;
			}
		}
	}

	.Menu {
		padding: 0 20px;
		border-bottom: 1px solid #dcdcdc;

		span {
			display: inline-block;
			font-size: 13px;
			font-weight: bold;
			border-bottom: 1px solid #000;
			padding: 10px 0;
		}
	}

	.error-message {
		color: #000;
		text-align: center;
		margin-top: 70px;
		font-size: 20px;
		font-weight: bold;
		padding: 10px;
	}

	.close-button {
		background: none;
		border: none;
		position: absolute;
		top: 15px;
		right: 15px;
		font-size: 15px;
		color: #000;
		z-index: 100;
		cursor: pointer;
	}
</style>
