<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, signInWithEmailAndPassword, signInWithGoogle } from '$lib/firebase';
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { writable } from 'svelte/store';

	let email = '';
	let password = '';
	let error = writable('');

	// 🔹 Friendly error messages
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

	const login = async () => {
		error.set('');
		try {
			await signInWithEmailAndPassword(auth, email, password);
			goto('/dashboard');
		} catch (err: any) {
			console.error(err);
			error.set(getFriendlyErrorMessage(err.code));
		}
	};

	const loginWithGoogle = async () => {
		error.set('');
		try {
			await signInWithGoogle();
			goto('/dashboard');
		} catch (err: any) {
			console.error(err);
			error.set(getFriendlyErrorMessage(err.code));
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
					<a href="/forgot-password" class="text-sm underline text-white/80 hover:text-white">Forgot?</a>
				</div>
				<Input
					id="password"
					type="password"
					bind:value={password}
					class="bg-white/20 text-white placeholder-white/70 border border-white/10 focus:ring-white"
				/>
			</div>

			<Button class="w-full" on:click={login}>Login</Button>

			<div class="text-center text-white/60 text-sm">or</div>

			<Button variant="outline" class="w-full text-white border-white/40 hover:bg-white/10" on:click={loginWithGoogle}>
				Login with Google
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
