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
	// Base URL for the API
	baseUrl = 'http://localhost:3003';

	async login(email: string, password: string): Promise<string> {
		try {
			const response = await fetch(`${this.baseUrl}/auth/signin`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			if (!response.ok) {
				throw new Error('Login failed');
			}

			const data = await response.json();
			return data.token;
		} catch (error) {
			console.error('Login error:', error);
			throw error;
		}
	}

	async signup(name: string, email: string, password: string) {
		try {
			const response = await fetch(`${this.baseUrl}/auth/signup`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name, email, password })
			});

			if (!response.ok) {
				throw new Error('Signup failed');
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
