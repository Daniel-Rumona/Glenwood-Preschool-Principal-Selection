<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		auth,
		db,
		createUserWithEmailAndPassword,
		collection,
		addDoc,
		signInWithGoogle
	} from '$lib/firebase';
	import { doc, setDoc } from 'firebase/firestore';
	import { writable } from 'svelte/store';
	import { toast } from 'svelte-sonner';

	let fullName = '';
	let email = '';
	let password = '';
	const errorMessage = writable('');
	let loading = false;

	const adminEmails = ['helperzhou@gmail.com', 'danielrumona@gmail.com'];

	// 🔹 Friendly Firebase error messages
	function getFriendlyErrorMessage(code: string): string {
		switch (code) {
			case 'auth/email-already-in-use':
				return 'This email is already in use.';
			case 'auth/invalid-email':
				return 'Please enter a valid email address.';
			case 'auth/weak-password':
				return 'Password must be at least 6 characters.';
			case 'auth/popup-closed-by-user':
				return 'You closed the Google sign-in popup.';
			default:
				return 'Something went wrong. Please try again.';
		}
	}

	// 🔐 Handle Email/Password Signup
	async function handleSignup() {
		errorMessage.set('');
		loading = true;
		try {
			const userCred = await createUserWithEmailAndPassword(auth, email, password);
			const user = userCred.user;
			const isAdmin = adminEmails.includes(user.email ?? '');

			await setDoc(doc(db, 'Users', user.uid), {
				uid: user.uid,
				userEmail: user.email,
				fullName: fullName, // ⬅️ use entered name
				createdAt: new Date()
			});

			toast.success('Signed in successfully!', {
				description: isAdmin ? 'Welcome back, Admin.' : 'Welcome! Let’s get started.',
			});

			goto(isAdmin ? '/dashboard' : '/authentication/registration/details');
		} catch (err: any) {
			console.error('❌ Signup Error:', err);
			errorMessage.set(getFriendlyErrorMessage(err.code));
		} finally {
			loading = false;
		}
	}



	async function handleGoogleSignUp() {
		errorMessage.set('');
		try {
			const user = await signInWithGoogle();
			const isAdmin = adminEmails.includes(user.email ?? '');

			await setDoc(doc(db, 'Users', user.uid), {
				uid: user.uid,
				userEmail: user.email,
				fullName: user.displayName,
				createdAt: new Date(),
				provider: 'google'
			});

			toast.success('Signed in successfully!', {
				description: isAdmin ? 'Welcome back, Admin.' : 'Welcome! Let’s get started.',
			});

			goto(isAdmin ? '/dashboard' : '/authentication/registration/details');
		} catch (err: any) {
			console.error('❌ Google Sign-up Error:', err);
			errorMessage.set(getFriendlyErrorMessage(err.code));
		}
	}


	//Handle password visibility
	let showPassword = false;
	let passwordVisibilityTimer: NodeJS.Timeout | null = null;

	function togglePasswordVisibility() {
		showPassword = true;

		// Clear previous timer if any
		if (passwordVisibilityTimer) clearTimeout(passwordVisibilityTimer);

		// Auto-hide after 8 seconds
		passwordVisibilityTimer = setTimeout(() => {
			showPassword = false;
		}, 8000);
	}

</script>

<main class="registration-page">
	<img src="/QuantilytixO.png" alt="Logo" class="logo logo-bottom-right" />

	<div class="w-full max-w-md bg-gradient-to-br from-black/60 to-indigo-900/40 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-2xl text-white border border-white/10">
		<h1 class="text-2xl font-semibold text-center mb-6">Create Account</h1>

		<input
			type="text"
			placeholder="Full Name"
			bind:value={fullName}
			class="input"
		/>

		<input
			type="email"
			placeholder="Email"
			bind:value={email}
			class="input"
		/>

		<div class="relative mt-4">
			<input
				type={showPassword ? 'text' : 'password'}
				placeholder="Password"
				bind:value={password}
				class="input pr-12"
			/>

			<!-- 👁 Visibility Toggle -->
			<button
				type="button"
				on:click={togglePasswordVisibility}
				class="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-white/70 hover:text-white transition"
			>
				{showPassword ? 'Hide' : 'Show'}
			</button>
		</div>


		<button
			disabled={loading}
			on:click={handleSignup}
			class="w-full bg-green-500 hover:bg-green-600 transition px-4 py-2 mt-6 rounded font-medium flex items-center justify-center"
		>
			{#if loading}
				<!-- 🌀 Spinner -->
				<span class="loader mr-2"></span> Creating...
			{:else}
				Continue
			{/if}
		</button>



		<div class="text-center text-sm my-3 text-white/70">or</div>

		<button
			on:click={handleGoogleSignUp}
			class="w-full border border-white px-4 py-2 rounded hover:bg-white/10 transition"
		>
			Sign up with Google
		</button>

		{#if $errorMessage}
			<p class="text-red-400 text-sm mt-4 text-center">{$errorMessage}</p>
		{/if}

		<p class="mt-6 text-center text-sm">
			<span class="text-white/80">Already have an account?</span>
			<a href="/authentication/sign-in" class="underline font-semibold text-purple-400 hover:text-purple-300 transition"> Sign in</a>
		</p>
	</div>
</main>

<style>
    .registration-page {
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

    .logo-bottom-right {
        bottom: 20px;
        right: 20px;
        width: clamp(100px, 15vw, 200px);
    }
    .loader {
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        width: 1rem;
        height: 1rem;
        animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }


    .input {
        width: 100%;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        background: rgba(255, 255, 255, 0.15);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: border 0.2s ease;
				margin: 5px;
    }
    .input::placeholder {
        color: rgba(255, 255, 255, 0.6);
    }
    .input:focus {
        outline: none;
        border-color: white;
    }
</style>
