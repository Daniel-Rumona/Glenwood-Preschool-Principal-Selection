<script lang="ts">
	import { goto } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { registrationForm } from '$lib/stores/registration';
	import { get } from 'svelte/store';

	let localUploads = { ...get(registrationForm).uploads };

	const handleNext = () => {
		registrationForm.update(data => {
			data.uploads = localUploads;
			return data;
		});
		goto('/authentication/registration/review');
	};

	const handleBack = () => goto('/authentication/registration/experience');
</script>

<main class="registration-page">
	<img src="/QuantilytixO.png" alt="Logo" class="logo logo-bottom-right" />

	<div class="w-full max-w-5xl bg-gradient-to-br from-black/60 to-indigo-900/40 backdrop-blur-xl p-6 sm:p-10 rounded-2xl mx-auto shadow-2xl text-white border border-white/10">
		<h2 class="text-2xl font-bold mb-6">Upload Documents</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each [
				{ label: 'ID Copy', key: 'idCopy' },
				{ label: 'Qualifications Certificates', key: 'certificates' },
				{ label: 'CV', key: 'cv' },
				{ label: 'Cover Letter', key: 'coverLetter' },
				{ label: 'Referral Letter (Principal 1)', key: 'referral1' },
				{ label: 'Referral Letter (Principal 2)', key: 'referral2' },
				{ label: 'Referral Letter (Pastor)', key: 'pastorLetter' },
				{ label: 'Professional Photo', key: 'profilePicture' },
			] as doc}
				<div>
					<Label for={doc.key}>{doc.label}</Label>
					<Input
						id={doc.key}
						type="file"
						on:change={(e) => (localUploads[doc.key] = e.target.files[0])}
						class="bg-white/20 text-white file:text-white file:bg-white/10 file:border-none file:rounded"
					/>
				</div>
			{/each}
		</div>

		<div class="mt-8 flex flex-col sm:flex-row justify-between gap-4">
			<Button variant="outline" on:click={handleBack}>← Back</Button>
			<Button on:click={handleNext}>Next →</Button>
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