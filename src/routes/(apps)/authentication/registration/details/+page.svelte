<script lang="ts">
	import { goto } from '$app/navigation';
	import { registrationForm } from '$lib/stores/registration';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { get } from 'svelte/store';

	let localForm = structuredClone(get(registrationForm).personal);
	$: birthYear = localForm.idNumber?.slice(0, 2);

	// Controlled values for custom Selects
	$: selectedGender = localForm.gender
		? { label: localForm.gender, value: localForm.gender }
		: undefined;

	$: selectedProvince = localForm.province
		? { label: localForm.province, value: localForm.province }
		: undefined;

	$: selectedRace = localForm.race
		? { label: localForm.race, value: localForm.race }
		: undefined;

	function saveAndContinue() {
		console.log('✅ Saving localForm:', localForm);
		registrationForm.update((data) => ({
			...data,
			personal: structuredClone(localForm)
		}));
		goto('/authentication/registration/experience');
	}
</script>

<main class="registration-page">
	<img src="/QuantilytixO.png" alt="Logo" class="logo logo-bottom-right" />

	<div class="w-full max-w-7xl bg-gradient-to-br from-black/60 to-indigo-900/40 backdrop-blur-xl p-6 sm:p-10 rounded-2xl mx-auto shadow-2xl text-white border border-white/10 z-10">
		<h2 class="text-2xl mb-6 font-bold">Personal Information</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<!-- Text Fields -->
			<div><Label for="name">Name</Label><Input id="name" value={localForm.name} on:input={(e) => localForm.name = e.target.value} /></div>
			<div><Label for="surname">Surname</Label><Input id="surname" value={localForm.surname} on:input={(e) => localForm.surname = e.target.value} /></div>
			<div><Label for="idNumber">ID Number</Label><Input id="idNumber" value={localForm.idNumber} on:input={(e) => localForm.idNumber = e.target.value} /></div>
			<div><Label for="birth">Birth Year</Label><Input id="birth" value={birthYear} readonly /></div>

			<!-- Gender Select -->
			<div>
				<Label>Gender</Label>
				<Select.Root
					selected={selectedGender}
					on:selectedChange={(val) => {
						if (val) {
							localForm.gender = val.value;
						}
					}}
				>
					<Select.Trigger class="bg-white/20 text-white border border-white/10" />
					<Select.Content>
						<Select.Item value="Male">Male</Select.Item>
						<Select.Item value="Female">Female</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Race Select -->
			<div>
				<Label>Race</Label>
				<Select.Root
					selected={selectedRace}
					on:selectedChange={(val) => {
						if (val) {
							localForm.race = val.value;
						}
					}}
				>
					<Select.Trigger class="bg-white/20 text-white border border-white/10" />
					<Select.Content>
						<Select.Item value="Black">Black</Select.Item>
						<Select.Item value="Coloured">Coloured</Select.Item>
						<Select.Item value="Indian">Indian</Select.Item>
						<Select.Item value="White">White</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>

			<!-- Province Select -->
			<div>
				<Label>Province</Label>
				<Select.Root
					selected={localForm.province ? { label: localForm.province, value: localForm.province } : undefined}
					on:selectedChange={(val) => {
			if (val) {
				localForm.province = val.value;
			}
		}}
				>
					<Select.Trigger class="bg-white/20 text-white border border-white/10" />
					<Select.Content>
						<Select.Item value="Eastern Cape">Eastern Cape</Select.Item>
						<Select.Item value="Free State">Free State</Select.Item>
						<Select.Item value="Gauteng">Gauteng</Select.Item>
						<Select.Item value="KwaZulu-Natal">KwaZulu-Natal</Select.Item>
						<Select.Item value="Limpopo">Limpopo</Select.Item>
						<Select.Item value="Mpumalanga">Mpumalanga</Select.Item>
						<Select.Item value="North West">North West</Select.Item>
						<Select.Item value="Northern Cape">Northern Cape</Select.Item>
						<Select.Item value="Western Cape">Western Cape</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>

			<div><Label for="postal">Postal Code</Label><Input id="postal" value={localForm.postalCode} on:input={(e) => localForm.postalCode = e.target.value} /></div>
			<div class="col-span-full"><Label for="address">Address</Label><Input id="address" value={localForm.address} on:input={(e) => localForm.address = e.target.value} /></div>
		</div>

		<!-- Religion -->
		<div class="mt-6">
			<Label for="religion">Religious Affiliation & Involvement</Label>
			<Textarea
				id="religion"
				rows="4"
				value={localForm.religion}
				on:input={(e) => localForm.religion = e.target.value}
			/>
		</div>

		<div class="mt-8 flex flex-col sm:flex-row justify-end gap-4">
			<Button class="w-full sm:w-auto" on:click={saveAndContinue}>Next →</Button>
		</div>
	</div>
</main>

<style>
    .registration-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('/bg-image.jpg') no-repeat center center fixed;
        background-size: cover;
        padding: 1.5rem;
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
