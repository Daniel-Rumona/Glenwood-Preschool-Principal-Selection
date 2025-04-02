<script lang="ts">
	import { get } from 'svelte/store';
	import { registrationForm } from '$lib/stores/registration';
	import { getAuth } from 'firebase/auth';
	import { db, storage } from '$lib/firebase';
	import { getDocs, collection, addDoc, doc, setDoc } from "firebase/firestore";
	import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';

	let loading = true;
	let success = false;
	let error: string | null = null;

	const auth = getAuth();


	onMount(async () => {
		const user = auth.currentUser;
		if (!user) return goto('/authentication/registration');

		// 🔁 Get current application count to generate APP### ID
		const appsRef = collection(db, `Users/${user.uid}/Applications`);
		const appsSnap = await getDocs(appsRef);
		const newAppId = `APP${String(appsSnap.size + 1).padStart(3, '0')}`;

		const form = get(registrationForm);
		const uploads = form.uploads;


		// ✅ Only allow these 5 specific keys
		const requiredKeys = ['cv', 'coverLetter', 'referral1', 'referral2', 'pastorLetter'];

		// 🔎 Check for missing keys
		for (const key of requiredKeys) {
			if (!uploads[key]) {
				error = `Missing required document: ${key}`;
				loading = false;
				return;
			}
			const file = uploads[key];
			if (!(file instanceof File)) {
				error = `Invalid file upload for: ${key}`;
				loading = false;
				return;
			}
			if (!file.name.toLowerCase().endsWith('.pdf')) {
				error = `Only PDF files are allowed for: ${key}`;
				loading = false;
				return;
			}
		}
		const uploadURLs: Record<string, string> = {};
		// 🔁 Upload to Firebase Storage
		for (const [key, file] of Object.entries(uploads)) {
			if (file instanceof File) {
				const storageRef = ref(storage, `uploads/${user.uid}/${key}`);
				await uploadBytes(storageRef, file);
				const url = await getDownloadURL(storageRef);
				uploadURLs[key] = url;
			}
		}

		// 🔁 Prepare API form data
		const apiFormData = new FormData();
		apiFormData.append('job_id', 'Principal Vacancy');
		apiFormData.append('job_description', `Glenwood Community Pre-School
2025

Suitable candidates, meeting the following qualifications and requirements, are invited to apply for the above position commencing------------2025

Criteria for Application:

Must have a 4 year full time post Matric qualification in ECD.
Age group 40-50 yrs???
4yrs + proven Management experience in a Pre-Primary setting, at a well reputed school.
Have a working knowlege of Department of Basic Education (DBE) systems, regulations/laws/and rules, governing the running of a registered, privately run, Community Pre-School.
Provide excellent, strong, strategic leadership, management and vision for the school, upholding its strong Christian ethos.
Manage and encourage an environment of on-going team work.
Be responsible for developing and implementing policies, procedures, curriculum and budgeting, which align with our Christian values and mission, and promote the school's on-going development and growth.
Monitoring and assessing all staff performances, and facilitating opportunities for on-going growth, and development of all Educators.
Have innovative problem solving skills, adaptability, and at all times maintaining harmonious relationships with staff, parents and the community.
Promote intellectual, social, physical and spiritual development of learners.
Effectively supervise learner discipline, drive learner growth and facilitate parent education and involvement.
Work in consultation with the Management Committee, to recruit and retain suitably qualified staff.
Reporting and working colloboratively with the Pastor and Management Committee, on all matters, relating to the effective running of the school.
Candidate is required to be a committed Christian, who is an active member of an evangelistic church.

Attach to your CV:
A Cover letter
2 Traceable Management Referral letters from previous Principals.
A traceable referral letter from your Pastor.`);

		apiFormData.append('applicant_id', form.personal.name || user.email || 'Unknown');

		// 📄 Append each uploaded file to the API
		Object.values(uploads).forEach(file => {
			if (file instanceof File) {
				apiFormData.append('files', file); // 🔑 API expects key to be 'files'
			}
		});

		// 🔁 Send to external API
		let apiResponse = null;
		try {
			const res = await fetch('https://rairo-recruitment-api.hf.space/process-application', {
				method: 'POST',
				body: apiFormData
			});
			if (res.ok) {
				apiResponse = await res.json();
			} else {
				error = "AI service failed to process the application.";
			}
		} catch (err) {
			console.error('Failed to send to external API:', err);
			error = "Unable to connect to the AI service.";
		}


		// 🔁 Save to Firestore
		await addDoc(appsRef, {
			id: newAppId,
			userId: user.uid,
			email: user.email,
			...form.personal,
			...form.experience,
			uploads: uploadURLs,
			read: false,
			archived: false,
			stared: false,
			dateSubmitted: new Date(),
			status: 'Pending',
			aiResponse: apiResponse,
			// 🧠 AI evaluation fields
			aiJustification: apiResponse?.justification || null,
			aiRecommendation: apiResponse?.recommendation || null,
			aiScore: apiResponse?.score || null
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
