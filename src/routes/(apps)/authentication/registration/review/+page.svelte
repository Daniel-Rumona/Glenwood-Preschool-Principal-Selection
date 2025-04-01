<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { registrationForm } from '$lib/stores/registration';
	import { get } from 'svelte/store';

	const form = get(registrationForm);

	const handleNext = () => goto('/authentication/registration/submit');
	const handleBack = () => goto('/authentication/registration/uploads');
</script>

<main class="registration-page">
	<img src="/QuantilytixO.png" alt="Logo" class="logo logo-bottom-right" />

	<div class="w-full max-w-4xl bg-gradient-to-br from-black/60 to-indigo-900/40 backdrop-blur-xl p-6 sm:p-10 rounded-2xl mx-auto shadow-2xl text-white border border-white/10">
		<h2 class="text-2xl font-bold mb-6">Review Your Application</h2>

		<p class="mb-4">Please review your submitted information before proceeding. Once submitted, you won't be able to edit it.</p>

		<!-- Summary Sections -->
		<div class="grid grid-cols-1 gap-4">
			<!-- Personal Info -->
			<div class="bg-white/10 p-4 rounded">
				<h3 class="font-semibold mb-2">📋 Personal Details</h3>
				<ul class="text-sm leading-relaxed space-y-1">
					<li><strong>Name:</strong> {form.personal.name} {form.personal.surname}</li>
					<li><strong>ID Number:</strong> {form.personal.idNumber}</li>
					<li><strong>Gender:</strong> {form.personal.gender}</li>
					<li><strong>Race:</strong> {form.personal.race}</li>
					<li><strong>Province:</strong> {form.personal.province}</li>
					<li><strong>Postal Code:</strong> {form.personal.postalCode}</li>
					<li><strong>Address:</strong> {form.personal.address}</li>
					<li><strong>Religion:</strong> {form.personal.religion}</li>
				</ul>
			</div>

			<!-- Experience -->
			<div class="bg-white/10 p-4 rounded">
				<h3 class="font-semibold mb-2">💼 Experience</h3>
				<ul class="text-sm leading-relaxed space-y-1">
					<li><strong>Qualifications:</strong></li>
					<ul class="list-disc list-inside">
						{#each form.experience.qualifications as qual}
							<li>{qual}</li>
						{/each}
					</ul>
					<li><strong>Total Years of Experience:</strong> {form.experience.experience}</li>
					<li><strong>Work History:</strong></li>
					<ul class="list-disc list-inside">
						{#each form.experience.workHistory as job}
							<li>{job}</li>
						{/each}
					</ul>
					<li><strong>Motivation:</strong> {form.experience.motivation}</li>
					<li><strong>Achievements:</strong> {form.experience.achievements}</li>
				</ul>
			</div>

			<!-- Uploads -->
			<div class="bg-white/10 p-4 rounded">
				<h3 class="font-semibold mb-2">📎 Uploaded Documents</h3>
				<ul class="text-sm leading-relaxed space-y-1">
					{#each Object.entries(form.uploads || {}) as [key, file]}
						<li>
							<strong>{key}:</strong> {file?.name || 'Not uploaded'}
						</li>
					{/each}
				</ul>
			</div>

		</div>

		<!-- Navigation Buttons -->
		<div class="mt-8 flex flex-col sm:flex-row justify-between gap-4">
			<Button variant="outline" on:click={handleBack}>← Back</Button>
			<Button on:click={handleNext}>Submit →</Button>
		</div>
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
