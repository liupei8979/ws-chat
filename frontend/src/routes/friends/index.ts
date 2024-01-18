export interface Friend {
	username: string;
	email: string;
	statusMessage?: string;
}

export interface UserProfile {
	email: string;
	statusMessage: string;
	username: string;
	friends: Friend[];
	imgSrc?: string; // Add this line
}

export interface CreateRoomResponse {
	success: boolean;
	payload: {
		roomId: string;
		userId: string;
		receiverId: string;
		title: string;
		// 기타 필요한 필드들...
	};
	// 에러 메시지나 기타 필드들...
}
