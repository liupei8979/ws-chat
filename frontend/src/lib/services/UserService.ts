type Friend = {
	username: string;
	email: string;
	statusMessage?: string;
};

type UserProfile = {
	email: string;
	statusMessage: string;
	username: string;
	friends: Friend[];
};

let userProfile: UserProfile;

class UserService {
	getHeaders() {
		const token = sessionStorage.getItem('token');
		return {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		};
	}

	// 유저 정보 조회
	async getProfile(): Promise<UserProfile> {
		const response = await fetch(
			`${import.meta.env.VITE_HOST_URL}:${import.meta.env.VITE_HOST_PORT}/user/main`,
			{
				headers: this.getHeaders()
			}
		);
		if (!response.ok) {
			throw new Error('Failed to fetch profile');
		}
		const data = await response.json();
		userProfile = data.data; // 사용자 프로필 데이터 업데이트
		sessionStorage.setItem('userProfile', JSON.stringify(userProfile)); // 세션 스토리지에 저장
		console.log(data);
		return userProfile;
	}

	// 친구 요청 보내기
	// async sendFriendRequest(friendId: string): Promise<void> {
	// 	try {
	// 		const response = await fetch(`${import.meta.env.VITE_HOST_URL}:${import.meta.env.VITE_HOST_PORT}/api/friends/requests/${friendId}`, {
	// 			method: 'POST',
	// 			headers: this.getHeaders()
	// 		});
	// 		if (!response.ok) {
	// 			throw new Error('Failed to send friend request');
	// 		}
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// }

	// 친구 요청 수락
	async updateProfile(username: string, statusMessage: string): Promise<void> {
		const response = await fetch(
			`${import.meta.env.VITE_HOST_URL}:${import.meta.env.VITE_HOST_PORT}/user/profile`,
			{
				method: 'PATCH',
				headers: this.getHeaders(),
				body: JSON.stringify({ username, statusMessage })
			}
		);
		if (!response.ok) {
			throw new Error('Failed to accept friend request');
		}
	}
}

// // 친구 삭제
// async removeFriend(friendId: string): Promise<void> {
// 	try {
// 		const response = await fetch(`${this.baseUrl}/api/friends/${friendId}`, {
// 			method: 'DELETE',
// 			headers: this.getHeaders()
// 		});
// 		if (!response.ok) {
// 			throw new Error('Failed to remove friend');
// 		}
// 	} catch (error) {
// 		throw error;
// 	}
// }

export const userService = new UserService();
