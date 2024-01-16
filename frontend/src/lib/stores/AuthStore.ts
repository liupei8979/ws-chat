// // authStore.ts
// import { writable } from "svelte/store";

// const createAuthStore = () => {
//   const { subscribe, set, update } = writable({
//     isAuthenticated: false,
//     user: null,
//     token: null,
//   });

//   return {
//     subscribe,
//     login: (user, token) =>
//       update((store) => ({ isAuthenticated: true, user, token })),
//     logout: () => set({ isAuthenticated: false, user: null, token: null }),
//     // 추가적인 인증 관련 기능들을 여기에 구현할 수 있습니다.
//   };
// };

// export const authStore = createAuthStore();
