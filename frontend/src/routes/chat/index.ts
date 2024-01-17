export interface CreateRoomResponse {
	success: boolean;
	payload: {
		roomId: string;
		// 기타 필요한 필드들...
	};
	// 에러 메시지나 기타 필드들...
}
