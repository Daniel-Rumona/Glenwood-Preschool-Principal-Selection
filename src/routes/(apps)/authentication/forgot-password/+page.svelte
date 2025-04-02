<script lang="ts">
	import { auth } from '$lib/firebase';
	import { sendPasswordResetEmail } from 'firebase/auth';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { showToast } from '$lib/stores/toast';
	import ToastDisplay from '$lib/components/ui/toast-display.svelte';

	let email = '';
	const loading = writable(false);
	const error = writable('');
	const success = writable('');

	const submit = async () => {
		error.set('');
		success.set('');
		loading.set(true);
		try {
			await sendPasswordResetEmail(auth, email);
			showToast('✅ Reset link sent to your email', 'success');
			success.set('Reset link sent to your email');
		} catch (err: any) {
			const msg = err.message || 'Something went wrong';
			showToast('⚠️ ' + msg, 'error');
			error.set(msg);
			console.error(err);
		} finally {
			loading.set(false);
		}
	};
</script>

<ToastDisplay />

<main class="forgot-page">
	<img src="/QuantilytixO.png" alt="Logo" class="logo logo-right" />

	<div class="w-full max-w-md bg-gradient-to-br from-black/60 to-indigo-900/40 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-2xl text-white border border-white/10">
		<h2 class="text-2xl font-bold text-center mb-2">Forgot Password</h2>
		<p class="text-center text-sm text-white/80 mb-6">Enter your email to receive a password reset link.</p>

		<div class="space-y-5">
			<div class="space-y-2">
				<Label for="email">Email</Label>
				<Input
					id="email"
					type="email"
					bind:value={email}
					placeholder="you@example.com"
					class="bg-white/20 text-white placeholder-white/70 border border-white/10 focus:ring-white"
				/>
			</div>

			<Button class="w-full" on:click={submit} disabled={$loading}>
				{#if $loading}
					<svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
					</svg>
				{:else}
					Send Reset Link
				{/if}
			</Button>

			<div class="text-center text-sm text-white/70 mt-2">
				<a href="/authentication/sign-in" class="underline hover:text-purple-300">← Back to Login</a>
			</div>
		</div>
	</div>
</main>

<style>
    .forgot-page {
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
