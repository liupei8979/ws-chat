export interface Member {
	userId: string;
	username: string;
}
export interface Room {
	roomId: string;
	recentMsg: {
		senderId: string;
		receiverId: string;
	};
}
export interface Friend {
	email: string;
	// 기타 필요한 속성...
}
