import { writable } from 'svelte/store';

export const toast = writable<{ message: string; type?: 'info' | 'error' | 'success' } | null>(null);

export function showToast(message: string, type: 'info' | 'error' | 'success' = 'info') {
	toast.set({ message, type });
	setTimeout(() => toast.set(null), 3000);
}