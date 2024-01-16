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

class UserService {
	baseUrl = 'http://localhost:3003';

	getHeaders() {
		const token = sessionStorage.getItem('token');
		return {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		};
	}

	// 유저 정보 조회
	async getProfile(): Promise<UserProfile> {
		const response = await fetch(`${this.baseUrl}/user/main`, {
			headers: this.getHeaders()
		});
		if (!response.ok) {
			throw new Error('Failed to fetch profile');
		}
		const data = await response.json();
		console.log(data);
		return data.data;
	}

	// 친구 요청 보내기
	// async sendFriendRequest(friendId: string): Promise<void> {
	// 	try {
	// 		const response = await fetch(`${this.baseUrl}/api/friends/requests/${friendId}`, {
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

	// // 친구 요청 수락
	// async acceptFriendRequest(requestId: string): Promise<void> {
	// 	try {
	// 		const response = await fetch(`${this.baseUrl}/api/friends/requests/${requestId}/accept`, {
	// 			method: 'POST',
	// 			headers: this.getHeaders()
	// 		});
	// 		if (!response.ok) {
	// 			throw new Error('Failed to accept friend request');
	// 		}
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// }

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
}

export const userService = new UserService();
