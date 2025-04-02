<script lang="ts">
	import { onMount } from 'svelte';
	import { getAuth, signOut } from 'firebase/auth';
	import { db } from '$lib/firebase';
	import { collection, getDocs } from 'firebase/firestore';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';

	const application = writable<any>(null);
	const loading = writable(true);

	onMount(async () => {
		const auth = getAuth();
		const user = auth.currentUser;

		if (!user) {
			goto('/authentication/sign-in');
			return;
		}

		const appsRef = collection(db, `Users/${user.uid}/Applications`);
		const snapshot = await getDocs(appsRef);

		if (!snapshot.empty) {
			application.set(snapshot.docs[0].data());
		}

		loading.set(false);
	});

	const handleLogout = async () => {
		await signOut(getAuth());
		goto('/authentication/sign-in');
	};
</script>

<!-- 🔝 Top bar -->
<div class="topbar w-full flex justify-between items-center px-6 py-4 bg-black/60 text-white backdrop-blur-sm border-b border-white/10 fixed top-0 left-0 right-0 z-50">
	<h1 class="text-lg font-semibold">Glenwood Community Preschool</h1>
	<button on:click={handleLogout} class="text-sm px-4 py-1 rounded bg-white/10 hover:bg-white/20 transition">Logout</button>
</div>

<main class="application-status-page pt-[5.5rem]">
	<div class="container max-w-5xl mx-auto bg-white/20 backdrop-blur-md p-6 rounded-xl text-white shadow-lg border border-white/10">

		<h1 class="text-2xl font-bold mb-6">📋 Application Status</h1>

		{#if $application}
			<!-- ✅ Safe Status -->
			<p class="mb-6 text-sm">
				<strong>Status:</strong>
				<span class={$application.read ? 'text-green-400' : 'text-yellow-300'}>
					{$application.read ? 'Reviewed ✅' : 'Pending ⏳'}
				</span>
			</p>

			<!-- Split columns -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
				<!-- Left column -->
				<div class="space-y-2 pr-4">
					<p><strong>Name:</strong> {$application.name}</p>
					<p><strong>Email:</strong> {$application.email}</p>
					<p><strong>ID Number:</strong> {$application.idNumber}</p>
					<p><strong>Gender:</strong> {$application.gender}</p>
					<p><strong>Race:</strong> {$application.race}</p>
					<p><strong>Province:</strong> {$application.province}</p>
					<p><strong>Postal Code:</strong> {$application.postalCode}</p>
					<p><strong>Address:</strong><br />{$application.address}</p>
					<p><strong>Religion:</strong><br />{$application.religion}</p>
					{#if $application.qualifications}
						<div>
							<p><strong>Qualifications:</strong></p>
							<ul class="list-disc list-inside ml-4">
								{#each $application.qualifications as q}
									<li>{q}</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>

				<!-- Vertical Divider -->
				<div class="hidden md:block absolute left-1/2 top-0 h-full w-px bg-white/20 translate-x-[-50%]"></div>

				<!-- Right column -->
				<div class="space-y-4 pl-4">


					{#if $application.experience}
						<p><strong>Experience:</strong> {$application.experience} years</p>
					{/if}

					{#if $application.workHistory}
						<div>
							<p><strong>Work History:</strong></p>
							<ul class="list-disc list-inside ml-4">
								{#each $application.workHistory as job}
									<li>{job}</li>
								{/each}
							</ul>
						</div>
					{/if}

					{#if $application.motivation}
						<p><strong>Motivation:</strong><br />{$application.motivation}</p>
					{/if}

					{#if $application.achievements}
						<p><strong>Achievements:</strong><br />{$application.achievements}</p>
					{/if}

					{#if $application.uploads}
						<div>
							<h2 class="font-semibold">Uploaded Documents</h2>
							<ul class="list-disc list-inside text-blue-200 ml-4">
								{#each Object.entries($application.uploads) as [key, url]}
									<li>
										<a href={url} target="_blank" class="underline capitalize">{key}</a>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			</div>
		{:else if !$loading}
			<p>No application found. <a href="/authentication/registration" class="underline text-blue-300">Register here</a>.</p>
		{/if}
	</div>
</main>

<style>
    .application-status-page {
        min-height: 100vh;
        background: url('/bg-image.jpg') no-repeat center center fixed;
        background-size: cover;
        padding: 2rem;
        padding-top: 5.5rem; /* for topbar */
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }
</style>
