<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, db, signInWithEmailAndPassword, signInWithGoogle } from '$lib/firebase';
	import { collection, getDocs } from 'firebase/firestore';
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { writable } from 'svelte/store';
	import { showToast } from '$lib/stores/toast';

	let email = '';
	let password = '';
	let loading = writable(false);
	let error = writable('');
	let showPassword = false;


	const adminEmails = ['helperzhou@gmail.com', 'danielrumona@gmail.com'];

	function getFriendlyErrorMessage(code: string) {
		switch (code) {
			case 'auth/invalid-email':
				return 'Please enter a valid email address.';
			case 'auth/user-not-found':
				return 'No user found with that email.';
			case 'auth/invalid-credential':
				return 'Invalid credentials, check your details and try again.';
			case 'auth/wrong-password':
				return 'Incorrect password. Please try again.';
			case 'auth/network-request-failed':
				return 'Network error. Check your connection.';
			case 'auth/popup-closed-by-user':
				return 'Google sign-in was cancelled.';
			case 'auth/too-many-requests':
				return 'Too many attempts. Please try again later.';
			case 'auth/unauthorized-domain':
				return 'Sign-in from this domain is not allowed. Contact support.';
			case 'auth/weak-password':
				return 'Password must be at least 6 characters long.';
			case 'auth/internal-error':
				return 'Something went wrong on our side. Please try again.';
			case 'auth/account-exists-with-different-credential':
				return 'An account already exists with a different sign-in method.';
			case 'auth/email-already-in-use':
				return 'This email is already in use. Try logging in.';
			case 'auth/operation-not-allowed':
				return 'Sign-in method is not allowed. Contact support.';
			case 'auth/missing-password':
				return 'Please enter your password.';
			default:
				// Catch-all for unexpected errors
				return `Unexpected error: ${code}. Please try again or contact support.`;
		}
	}

	const redirectBasedOnRole = async (userId: string, userEmail: string) => {
		const appsRef = collection(db, `Users/${userId}/Applications`);
		const snapshot = await getDocs(appsRef);

		const isAdmin = adminEmails.includes(userEmail);
		const hasApplications = !snapshot.empty;

		showToast('✅ Login successful!', 'success');

		if (isAdmin) goto('/dashboard');
		else if (hasApplications) goto('/application-status');
		else goto('/authentication/registration/details');
	};

	const login = async () => {
		error.set('');
		loading.set(true);
		try {
			const result = await signInWithEmailAndPassword(auth, email, password);
			await redirectBasedOnRole(result.user.uid, result.user.email ?? '');
		} catch (err: any) {
			console.error(err);
			error.set(getFriendlyErrorMessage(err.code));
			showToast(getFriendlyErrorMessage(err.code), 'error');
		} finally {
			loading.set(false);
		}
	};

	const loginWithGoogle = async () => {
		error.set('');
		loading.set(true);
		try {
			const result = await signInWithGoogle();
			await redirectBasedOnRole(result.user.uid, result.user.email ?? '');
		} catch (err: any) {
			console.error(err);
			error.set(getFriendlyErrorMessage(err.code));
			showToast(getFriendlyErrorMessage(err.code), 'error');
		} finally {
			loading.set(false);
		}
	};
</script>

<main class="login-page">
	<img src="/QuantilytixO.png" alt="Logo" class="logo logo-right" />

	<div class="w-full max-w-md bg-gradient-to-br from-black/60 to-indigo-900/40 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-2xl text-white border border-white/10">
		<h2 class="text-2xl font-bold text-center mb-2">Login</h2>
		<p class="text-center text-sm text-white/80 mb-6">Welcome to Glenwood Community Preschool. Access your account below</p>

		{#if $error}
			<div class="mb-4 text-sm text-red-400 text-center">{$error}</div>
		{/if}

		<div class="space-y-5">
			<div class="space-y-2">
				<Label for="email">Email</Label>
				<Input
					id="email"
					type="email"
					bind:value={email}
					placeholder="m@example.com"
					class="bg-white/20 text-white placeholder-white/70 border border-white/10 focus:ring-white"
				/>
			</div>

			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<Label for="password">Password</Label>
					<a href="/authentication/forgot-password" class="text-sm underline text-white/80 hover:text-white">Forgot?</a>
				</div>
				<div class="relative">
					<Input
						id="password"
						type={showPassword ? 'text' : 'password'}
						bind:value={password}
						class="bg-white/20 text-white placeholder-white/70 border border-white/10 focus:ring-white pr-10"
					/>
					<button
						type="button"
						class="absolute inset-y-0 right-2 flex items-center text-white/70 hover:text-white text-sm"
						on:click={() => (showPassword = !showPassword)}
					>
						{showPassword ? 'Hide' : 'Show'}
					</button>
				</div>

			</div>

			<Button class="w-full" on:click={login} disabled={$loading}>
				{#if $loading}
					<svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
					</svg>
				{:else}
					Login
				{/if}
			</Button>


			<div class="text-center text-white/60 text-sm">or</div>


			<Button variant="outline" class="w-full text-white border-white/40 hover:bg-white/10" on:click={loginWithGoogle} disabled={$loading}>
					{#if $loading}
						<svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
						</svg>
					{:else}
						Login with Google
					{/if}
				</Button>

		</div>

		<p class="mt-6 text-center text-sm text-white/70">
			Don't have an account?
			<a href="/authentication/registration" class="underline hover:text-purple-300 transition">Sign up</a>
		</p>
	</div>
</main>

<style>
    .login-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background: url('/bg-image.jpg') no-repeat center center fixed;
        background-size: cover;
        padding: 1.5rem;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .logo {
        position: fixed;
        object-fit: contain;
        z-index: 10;
    }
    .logo-right {
        bottom: 20px;
        right: 20px;
        width: clamp(100px, 15vw, 200px);
    }
</style>
