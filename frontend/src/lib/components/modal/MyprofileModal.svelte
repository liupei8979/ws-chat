<script lang="ts">
	export let closeMyProfileModal: () => void;
	export let profile: {
		name?: string;
		statusMessage?: string;
		imgSrc?: string;
		friends?: { [key: string]: { name: string; email: string; statusMessage?: string } };
	} = {};

	console.log('MyprofileModal 렌더링', { profile });
	// // 초기 상태를 저장하여 변경 감지에 활용
	// let initialName: string = profile.name || '';
	// let initialStatusMessage: string = profile.statusMessage || '';
</script>

<div class="Wrapper">
	<div class="BackgroundBase">
		<!-- 배경 이미지가 있다면 아래 img 태그에 삽입 -->
	</div>
	<div class="profile-container">
		<i class="fas fa-times" on:click={closeMyProfileModal}></i>
		<img
			src={profile.imgSrc || '../../src/asset/img/base_profile.jpg'}
			alt={profile.name || '기본 프로필 이미지'}
			class="ProfileImage"
		/>
		<p class="ProfileName">
			<b>{profile.name || '이름 없음'}</b>
		</p>
		<p class="ProfileStatusMessage">
			{profile.statusMessage || '상태 메시지 없음'}
		</p>
		<input type="text" placeholder="새 이름" />
		<input type="text" placeholder="새 상태 메시지" />
		<button>프로필 수정</button>
	</div>
</div>

<style>
	.Wrapper {
		position: fixed;
		top: 30%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 360px;
		height: 580px;
		margin: auto;
		color: #fff;
		text-align: center;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		z-index: 10000;
	}
	.BackgroundBase {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #848b91;
		z-index: -1;
		overflow: hidden;
		& img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			opacity: 0.6;
		}
	}
	.profile-container {
		margin-top: 300px;
	}
	i.fas.fa-times {
		position: absolute;
		top: 15px;
		right: 15px;
		font-size: 15px;
		color: #fff;
		z-index: 100;
		cursor: pointer;
	}
	.ProfileImage {
		width: 100px;
		height: 100px;
		border-radius: 20px;
		margin-top: 30px;
		object-fit: cover;
		cursor: pointer;
	}
	.ProfileName {
		font-size: 24px;
		color: #fff;
		margin: 10px 0;
	}
	.ProfileStatusMessage {
		font-size: 18px;
		color: #fff;
		margin-bottom: 30px;
	}
</style>
