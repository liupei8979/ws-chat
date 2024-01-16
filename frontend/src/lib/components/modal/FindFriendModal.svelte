<script lang="ts">
	export let onClose: () => void;
	const redirectUrl = '/main/friends'; // 리디렉트할 URL

	let userId = '';
	let errorMessage = ''; // 실패 메시지를 위한 상태
	const MAX_LEN = 30;

	function onIdInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		userId = target.value;
	}

	function handleEnterKey(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			// onSubmit(event)
		}
	}

	function handleCloseClick() {
		onClose();
	}

	function handleCloseKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			onClose();
		}
	}
</script>

<div class="Wrapper">
	<button class="close-button" on:click={handleCloseClick} on:keypress={handleCloseKeyPress}>
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

<style>
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
		& h4 {
			padding: 25px 20px;
			font-size: 18px;
			font-weight: 600;
		}

		& form {
			width: 80%;
			border-bottom: 2px solid #000;
			margin: 30px auto;
			& input {
				outline: none;
				border: none;
				width: 250px;
			}
			& span {
				position: fixed;
			}
		}
	}
	.Menu {
		padding: 0 20px;
		border-bottom: 1px solid #dcdcdc;
		& span {
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
