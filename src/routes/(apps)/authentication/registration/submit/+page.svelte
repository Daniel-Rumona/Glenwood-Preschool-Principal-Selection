<script lang="ts">
	import { get } from 'svelte/store';
	import { registrationForm } from '$lib/stores/registration';
	import { getAuth } from 'firebase/auth';
	import { db, storage } from '$lib/firebase';
	import { collection, addDoc } from 'firebase/firestore';
	import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button'


	let loading = true;
	let success = false;
	let error: string | null = null;

	const auth = getAuth();

	onMount(async () => {
		const user = auth.currentUser;
		if (!user) return goto('/authentication/registration');

		const form = get(registrationForm);
		const uploads = form.uploads;
		const uploadURLs: Record<string, string> = {};

		// ✅ Upload files to Firebase Storage
		for (const [key, file] of Object.entries(uploads)) {
			if (file instanceof File) {
				const storageRef = ref(storage, `uploads/${user.uid}/${key}`);
				await uploadBytes(storageRef, file);
				const url = await getDownloadURL(storageRef);
				uploadURLs[key] = url;
			}
		}

		// ✅ Build payload for external API
		const apiFormData = new FormData();
		if (uploads.cv) apiFormData.append('cv', uploads.cv);
		if (uploads.coverLetter) apiFormData.append('cover_letter', uploads.coverLetter);
		if (uploads.referral1) apiFormData.append('referral_1', uploads.referral1);
		if (uploads.referral2) apiFormData.append('referral_2', uploads.referral2);
		if (uploads.pastorLetter) apiFormData.append('pastor_referral', uploads.pastorLetter);

		let apiResponse = null;
		try {
			const res = await fetch('https://rairo-recruitment-api.hf.space/process-application', {
				method: 'POST',
				body: apiFormData
			});
			apiResponse = await res.json();
		} catch (err) {
			console.error('Failed to send to external API:', err);
		}

		// ✅ Save everything to Firestore
		await addDoc(collection(db, `Users/${user.uid}/Applications`), {
	...form.personal,
	...form.experience,
			uploads: uploadURLs,
			read: false,
			apiResult: apiResponse,
			dateSubmitted: new Date()
	});

	goto('/application-status');
	});
</script>
<main class="registration-page">
	<img src="/QuantilytixO.png" alt="Logo" class="logo logo-bottom-right" />

	<div class="w-full max-w-3xl bg-gradient-to-br from-black/60 to-indigo-900/40 backdrop-blur-xl p-6 sm:p-10 rounded-2xl mx-auto shadow-2xl text-white border border-white/10 text-center">
		{#if loading}
			<h2 class="text-2xl font-bold mb-4">⏳ Submitting your application...</h2>
			<p>Please wait while we upload your documents and save your application.</p>
		{:else if success}
			<h2 class="text-3xl font-bold mb-4">🎉 Application Submitted</h2>
			<p class="mb-6">Thank you for applying. You will receive a confirmation email and be notified regarding next steps.</p>
			<Button on:click={() => goto('/')}>Back to Home</Button>
		{:else}
			<h2 class="text-2xl font-bold text-red-500 mb-4">🚫 Submission Failed</h2>
			<p class="mb-4">{error}</p>
			<Button variant="outline" on:click={() => goto('/authentication/registration/review')}>← Back to Review</Button>
		{/if}
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
</style>
