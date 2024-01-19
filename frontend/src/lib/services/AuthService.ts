// AuthService.ts
// type User = {
//   id: string;
//   email: string;
//   name: string;
//   // 추가적인 사용자 정보 필드
// };

// type LoginResponse = {
// 	token: string;
// 	user: User;
// };
class AuthService {
	async login(email: string, password: string): Promise<string> {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_HOST_URL}:${import.meta.env.VITE_HOST_PORT}/auth/signin`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ email, password })
				}
			);

			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(errorResponse.message || '로그인 실패');
			}

			const data = await response.json();
			const accessToken = data.data.accessToken;

			return accessToken;
		} catch (error) {
			console.error('Login error:', error);
			throw error;
		}
	}

	async signup(username: string, email: string, password: string) {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_HOST_URL}:${import.meta.env.VITE_HOST_PORT}/auth/signup`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ username, email, password })
				}
			);

			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(errorResponse.message || '회원가입 실패');
			}
		} catch (error) {
			console.error('Signup error:', error);
			throw error;
		}
	}

	// 사용자 인증 상태 확인 함수
	//   async checkAuth(): Promise<User | null> {
	//     try {
	//       // 여기에서는 예를 들어 서버에 저장된 인증 토큰을 확인하는 로직을 구현할 수 있습니다.
	//     } catch (error) {
	//       return null;
	//     }
	//   }

	//   // 로그아웃 함수
	//   logout(): void {
	//     // 로그아웃 처리 로직 구현
	//   }
}

export const authService = new AuthService();
