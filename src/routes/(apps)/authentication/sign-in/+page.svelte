<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, db, signInWithEmailAndPassword, signInWithGoogle } from '$lib/firebase';
	import { collection, getDocs } from 'firebase/firestore';
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { writable } from 'svelte/store';

	let email = '';
	let password = '';
	let error = writable('');

	const adminEmails = ['helperzhou@gmail.com', 'danielrumona@gmail.com'];

	function getFriendlyErrorMessage(code: string) {
		switch (code) {
			case 'auth/invalid-email':
				return 'Please enter a valid email address.';
			case 'auth/user-not-found':
				return 'No user found with that email.';
			case 'auth/wrong-password':
				return 'Incorrect password. Please try again.';
			case 'auth/network-request-failed':
				return 'Network error. Check your connection.';
			case 'auth/popup-closed-by-user':
				return 'Google sign-in was cancelled.';
			case 'auth/too-many-requests':
				return 'Too many attempts. Please try again later.';
			default:
				return 'Something went wrong. Please try again.';
		}
	}

	const redirectBasedOnRole = async (userId: string, userEmail: string) => {
		const applicationsRef = collection(db, `Users/${userId}/Applications`);
		const snapshot = await getDocs(applicationsRef);

		const hasApplications = !snapshot.empty;
		const isAdmin = adminEmails.includes(userEmail);

		if (isAdmin) {
			goto('/dashboard');
		} else if (hasApplications) {
			goto('/application-status'); // or any user portal
		} else {
			goto('/authentication/registration');
		}
	};

	const login = async () => {
		error.set('');
		try {
			const result = await signInWithEmailAndPassword(auth, email, password);
			const user = result.user;
			await redirectBasedOnRole(user.uid, user.email ?? '');
		} catch (err: any) {
			console.error(err);
			error.set(getFriendlyErrorMessage(err.code));
		}
	};

	const loginWithGoogle = async () => {
		error.set('');
		try {
			const result = await signInWithGoogle();
			const user = result.user;
			await redirectBasedOnRole(user.uid, user.email ?? '');
		} catch (err: any) {
			console.error(err);
			error.set(getFriendlyErrorMessage(err.code));
		}
	};
</script>
