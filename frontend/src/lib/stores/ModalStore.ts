// src/stores/modalStore.ts
import { writable } from 'svelte/store';
import type { Friend } from '../../routes/friends/index';

export const isFindFriendModalOpen = writable(false);
export const isMyProfileModalOpen = writable(false);
export const isFriendsProfileModalOpen = writable(false);
export const selectedFriend = writable<{
	username: string;
	email: string;
	statusMessage?: string;
} | null>(null);

export function openFindFriendModal() {
	isFindFriendModalOpen.set(true);
}

export function openMyProfileModal() {
	isMyProfileModalOpen.set(true);
}

export function openFriendsProfileModal(friend: Friend) {
	selectedFriend.set(friend);
	isFriendsProfileModalOpen.set(true);
}

export function closeFindFriendModal() {
	isFindFriendModalOpen.set(false);
}

export function closeMyProfileModal() {
	isMyProfileModalOpen.set(false);
}

export function closeFriendsProfileModal() {
	selectedFriend.set(null);
	isFriendsProfileModalOpen.set(false);
}
