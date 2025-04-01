<script lang="ts">
	import { goto } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { registrationForm } from '$lib/stores/registration';
	import { get } from 'svelte/store';

	let form = { ...get(registrationForm).experience }; // 👈 get existing experience data

	function goToUploads() {
		registrationForm.update(data => {
			data.experience = form;
			return data;
		});
		goto('/authentication/registration/uploads');
	}

	function goBack() {
		registrationForm.update(data => {
			data.experience = form;
			return data;
		});
		goto('/authentication/registration/details');
	}
</script>

<main class="registration-page">
	<img src="/QuantilytixO.png" alt="Logo" class="logo logo-bottom-right" />

	<div class="w-full max-w-7xl bg-gradient-to-br from-black/60 to-indigo-900/40 backdrop-blur-xl p-6 sm:p-10 rounded-2xl mx-auto shadow-2xl text-white border border-white/10 z-10">
		<h2 class="text-2xl mb-6 font-bold">Qualifications & Experience</h2>

		<!-- Qualifications -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
			{#each form.qualifications as qual, i (i)}
				<div>
					<Label for={`qual-${i}`}>Qualification {i + 1}</Label>
					<Input
						class="bg-white/20 text-white placeholder-white/70 border border-white/10 focus:ring-white"
						id={`qual-${i}`}
						bind:value={form.qualifications[i]}
						placeholder="e.g. B.Ed – University of X – 2018"
					/>
				</div>
			{/each}
		</div>

		<!-- Experience -->
		<div class="mb-6">
			<Label for="experience">Total Years of Experience</Label>
			<Input
				class="bg-white/20 text-white placeholder-white/70 border border-white/10 focus:ring-white"
				id="experience"
				bind:value={form.experience}
				placeholder="e.g. 12"
			/>
		</div>

		<!-- Work History -->
		<div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each form.workHistory as job, i (i)}
				<div>
					<Label for={`job-${i}`}>Place of Work {i + 1}</Label>
					<Input
						class="bg-white/20 text-white placeholder-white/70 border border-white/10 focus:ring-white"
						id={`job-${i}`}
						bind:value={form.workHistory[i]}
						placeholder="e.g. Glenwood PS - Principal - 2019–2023"
					/>
				</div>
			{/each}
		</div>

		<!-- Motivation -->
		<div class="mb-6">
			<Label for="motivation">Motivation (300+ words)</Label>
			<Textarea
				class="bg-white/20 text-white placeholder-white/70 border border-white/10 focus:ring-white"
				id="motivation"
				bind:value={form.motivation}
				rows="6"
				placeholder="Why are you applying for this position?"
			/>
		</div>

		<!-- Achievements -->
		<div class="mb-6">
			<Label for="achievements">Major Achievements in Previous Positions</Label>
			<Textarea
				class="bg-white/20 text-white placeholder-white/70 border border-white/10 focus:ring-white"
				id="achievements"
				bind:value={form.achievements}
				rows="4"
				placeholder="e.g. Raised learner performance by 30%"
			/>
		</div>

		<!-- Navigation Buttons -->
		<div class="mt-8 flex flex-col sm:flex-row justify-between gap-4">
			<Button variant="outline" on:click={goBack} class="w-full sm:w-auto">← Back</Button>
			<Button on:click={goToUploads} class="w-full sm:w-auto">Next →</Button>
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
