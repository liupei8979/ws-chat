// // apiUtils.ts
// const BASE_URL = "https://your-api-domain.com";

// async function apiFetch(endpoint: string, options = {}) {
//   const response = await fetch(`${BASE_URL}${endpoint}`, {
//     ...options,
//     headers: {
//       ...options.headers,
//       Authorization: `Bearer ${yourAuthToken}`, // 예시로 토큰을 추가
//     },
//   });
//   if (!response.ok) {
//     throw new Error("API request failed");
//   }
//   return response.json();
// }

// export default apiFetch;
