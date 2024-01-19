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
}

export const authService = new AuthService();
