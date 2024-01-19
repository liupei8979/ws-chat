export interface CreateRoomResponse {
	success: boolean;
	payload: {
		userId: string;
		receiverId: string;
		roomId: string;
		title: string;
		// 여기에 필요한 다른 속성들을 추가할 수 있습니다.
	};
	// 에러 메시지나 기타 필드들...
}
export interface ChatRoom {
	title: string;
	roomId: string;
	name: string;
	date: string;
	preview: string;
	unreadMessages: number;
	imgSrc?: string;
	timestamp: number;
}
