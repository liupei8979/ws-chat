// // chatService.ts
// type Message = {
//   id: string;
//   senderId: string;
//   content: string;
//   timestamp: Date;
// };

// class ChatService {
//   // 메시지를 불러오는 함수
//   async getMessages(chatRoomId: string): Promise<Message[]> {
//     try {
//       const response = await fetch(`/api/chatrooms/${chatRoomId}/messages`);
//       if (!response.ok) {
//         throw new Error("Server error");
//       }
//       const messages = await response.json();
//       return messages;
//     } catch (error) {
//       console.error("Failed to fetch messages:", error);
//       return [];
//     }
//   }

//   // 새 메시지를 보내는 함수
//   async sendMessage(chatRoomId: string, message: string): Promise<void> {
//     try {
//       const response = await fetch(`/api/chatrooms/${chatRoomId}/messages`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ content: message }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to send message");
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   }
// }

// export const chatService = new ChatService();
