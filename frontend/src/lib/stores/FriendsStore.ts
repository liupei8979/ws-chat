// // friendsStore.ts
// import { writable } from "svelte/store";

// const createFriendsStore = () => {
//   const { subscribe, set, update } = writable({
//     friends: [],
//     pendingRequests: [],
//     sentRequests: [],
//   });

//   return {
//     subscribe,
//     setFriends: (friends) => update((store) => ({ ...store, friends })),
//     addFriend: (friend) =>
//       update((store) => ({ ...store, friends: [...store.friends, friend] })),
//     removeFriend: (friendId) =>
//       update((store) => ({
//         ...store,
//         friends: store.friends.filter((f) => f.id !== friendId),
//       })),
//     // 여기에 더 많은 친구 관련 기능을 추가할 수 있습니다.
//   };
// };

// export const friendsStore = createFriendsStore();
