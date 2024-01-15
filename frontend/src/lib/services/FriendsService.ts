// // FriendsService.ts
// type Friend = {
//   id: string;
//   name: string;
//   email: string;
//   // 추가적인 친구 정보 필드
// };

// class FriendsService {
//   // 친구 목록 조회
//   async getFriends(): Promise<Friend[]> {
//     try {
//       const response = await fetch("/api/friends");
//       if (!response.ok) {
//         throw new Error("Failed to fetch friends");
//       }
//       const friends: Friend[] = await response.json();
//       return friends;
//     } catch (error) {
//       throw error;
//     }
//   }

//   // 친구 요청 보내기
//   async sendFriendRequest(friendId: string): Promise<void> {
//     try {
//       const response = await fetch(`/api/friends/requests/${friendId}`, {
//         method: "POST",
//       });
//       if (!response.ok) {
//         throw new Error("Failed to send friend request");
//       }
//     } catch (error) {
//       throw error;
//     }
//   }

//   // 친구 요청 수락
//   async acceptFriendRequest(requestId: string): Promise<void> {
//     try {
//       const response = await fetch(
//         `/api/friends/requests/${requestId}/accept`,
//         {
//           method: "POST",
//         },
//       );
//       if (!response.ok) {
//         throw new Error("Failed to accept friend request");
//       }
//     } catch (error) {
//       throw error;
//     }
//   }

//   // 친구 삭제
//   async removeFriend(friendId: string): Promise<void> {
//     try {
//       const response = await fetch(`/api/friends/${friendId}`, {
//         method: "DELETE",
//       });
//       if (!response.ok) {
//         throw new Error("Failed to remove friend");
//       }
//     } catch (error) {
//       throw error;
//     }
//   }
// }

// export const friendsService = new FriendsService();
