<script lang="ts">
	import { page } from '$app/stores';
	import Stepper from '$lib/components/ui/stepper.svelte';
	import '../../../../app.css';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { ModeWatcher } from 'mode-watcher';
	import { goto } from '$app/navigation';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { showToast } from '$lib/stores/toast';
	import ToastDisplay from '$lib/components/ui/toast-display.svelte'; // 👈 Toast component

	const steps = ['Personal Info', 'Experience', 'Uploads', 'Review', 'Submit'];
	const getStep = (path: string) => {
		if (path.endsWith('/details')) return 1;
		if (path.endsWith('/experience')) return 2;
		if (path.endsWith('/uploads')) return 3;
		if (path.endsWith('/review')) return 4;
		if (path.endsWith('/submit')) return 5;
		return 1;
	};

	const scrolled = writable(false);
	const hiddenRoutes = ['/', '/authentication/registration'];

	onMount(() => {
		// 🧠 Scroll tracking
		const handleScroll = () => scrolled.set(window.scrollY > 10);
		window.addEventListener('scroll', handleScroll);

		// 🔐 Login enforcement (client-side)
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (!user && !hiddenRoutes.includes(window.location.pathname)) {
				showToast('⚠️ Please log in before continuing your application.', 'error');
				setTimeout(() => goto('/authentication/registration'), 1500);
			}
		});

		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<style>
    .stepper-transition {
        transition: all 0.2s ease-in-out;
    }
</style>

<ModeWatcher />
<ToastDisplay /> <!-- ✅ Include toast handler -->

<div class="bg-background relative flex min-h-screen flex-col" id="registration-page">
	<!-- Sticky Stepper Strip -->
	<div
		class="sticky top-0 z-50 w-full bg-black bg-opacity-30 border-b border-white/10 backdrop-blur-md stepper-transition"
		class:py-1={$scrolled}
		class:py-2={!$scrolled}
	>
		{#if !hiddenRoutes.includes($page.url.pathname)}
			<div
				class="hidden sm:block sticky top-0 z-50 w-full bg-black bg-opacity-30 border-b border-white/10 backdrop-blur-md stepper-transition"
				class:py-1={$scrolled}
				class:py-2={!$scrolled}
			>
				<Stepper current={getStep($page.url.pathname)} {steps} shrink={$scrolled} />
			</div>
		{/if}
	</div>

	<!-- Page Content -->
	<div class="flex-1 w-full">
		<slot />
	</div>
</div>
