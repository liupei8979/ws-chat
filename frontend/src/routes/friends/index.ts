export interface Friend {
	username: string;
	email: string;
	statusMessage?: string;
}

export interface UserProfile {
	email: string;
	statusMessage: string;
	username: string;
	friends: Friend[];
	imgSrc?: string; // Add this line
}
