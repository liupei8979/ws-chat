// // chatStore.ts
// import { writable } from "svelte/store";

// const createChatStore = () => {
//   const { subscribe, set, update } = writable({
//     messages: [],
//     chatRooms: [],
//     activeChatRoom: null,
//   });

//   return {
//     subscribe,
//     setMessages: (messages) => update((store) => ({ ...store, messages })),
//     addMessage: (message) =>
//       update((store) => ({ ...store, messages: [...store.messages, message] })),
//     setActiveChatRoom: (chatRoom) =>
//       update((store) => ({ ...store, activeChatRoom: chatRoom })),
//     // 여기에 더 많은 기능을 추가할 수 있습니다.
//   };
// };

// export const chatStore = createChatStore();
