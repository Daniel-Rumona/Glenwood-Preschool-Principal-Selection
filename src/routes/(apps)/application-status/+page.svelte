<script lang="ts">
	import { onMount } from 'svelte';
	import { getAuth } from 'firebase/auth';
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
			goto('/authentication/registration');
			return;
		}

		const appsRef = collection(db, `Users/${user.uid}/Applications`);
		const snapshot = await getDocs(appsRef);

		if (!snapshot.empty) {
			application.set(snapshot.docs[0].data());
		}

		loading.set(false);
	});
</script>

<main class="application-status-page">
	<div class="container max-w-3xl mx-auto bg-white/20 backdrop-blur-md p-6 rounded-xl text-white shadow-lg border border-white/10 mt-10">
		<h1 class="text-2xl font-bold mb-4">📋 Application Status</h1>

		{#if $loading}
			<p>Loading application...</p>
		{:else if $application}
			<p class="mb-4 text-sm">
				<strong>Status:</strong>
				<span class={$application.read ? 'text-green-400' : 'text-yellow-300'}>
					{$application.read ? 'Reviewed ✅' : 'Pending ⏳'}
				</span>
			</p>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<p><strong>Name:</strong> {$application.name} {$application.surname}</p>
				<p><strong>Email:</strong> {$application.email}</p>
				<p><strong>ID Number:</strong> {$application.idNumber}</p>
				<p><strong>Gender:</strong> {$application.gender}</p>
				<p><strong>Race:</strong> {$application.race}</p>
				<p><strong>Province:</strong> {$application.province}</p>
				<p><strong>Postal Code:</strong> {$application.postalCode}</p>
				<p class="col-span-full"><strong>Address:</strong> {$application.address}</p>
				<p class="col-span-full"><strong>Religion:</strong> {$application.religion}</p>
			</div>

			<hr class="my-4 border-white/20" />

			<div class="space-y-2">
				<p><strong>Qualifications:</strong></p>
				<ul class="list-disc list-inside">
					{#each $application.qualifications as q}
						<li>{q}</li>
					{/each}
				</ul>

				<p class="mt-2"><strong>Experience:</strong> {$application.experience} years</p>

				<p><strong>Work History:</strong></p>
				<ul class="list-disc list-inside">
					{#each $application.workHistory as job}
						<li>{job}</li>
					{/each}
				</ul>

				<p><strong>Motivation:</strong> {$application.motivation}</p>
				<p><strong>Achievements:</strong> {$application.achievements}</p>
			</div>

			{#if $application.uploads}
				<hr class="my-4 border-white/20" />
				<h2 class="font-semibold">Uploaded Documents</h2>
				<ul class="text-sm list-disc list-inside text-blue-200">
					{#each Object.entries($application.uploads) as [key, url]}
						<li>
							<a href={url} target="_blank" class="underline capitalize">
								{key}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		{:else}
			<p>No application found. Please <a href="/authentication/registration" class="underline text-blue-300">register here</a>.</p>
		{/if}
	</div>
</main>

<style>
    .application-status-page {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        background: url('/bg-image.jpg') no-repeat center center fixed;
        background-size: cover;
        padding: 2rem;
    }
</style>