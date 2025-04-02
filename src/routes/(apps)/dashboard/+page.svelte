<script lang="ts">
	import Activity from 'lucide-svelte/icons/activity';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import DollarSign from 'lucide-svelte/icons/dollar-sign';
	import Users from 'lucide-svelte/icons/user-check';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import ApplicationsCharts from '$lib/components/ui/applications-chart/applications-charts.svelte';

	import { writable } from 'svelte/store';
	import { collection, getDocs } from "firebase/firestore";
	import { db } from "$lib/firebase";

	const totalApplications = writable<number>(0);
	const averageYearsOfExperience = writable<number>(0);
	const averageApplicantAge = writable<number>(0);
	const genderStats = writable<Record<string, number>>({}); // e.g. { Male: 12, Female: 18 }

	const fetchAllApplications = async () => {
		try {
			const usersRef = collection(db, "Users");
			const usersSnapshot = await getDocs(usersRef);

			let totalApps = 0;
			let totalExperience = 0;
			let experienceCount = 0;

			let totalAge = 0;
			let ageCount = 0;

			let genderMap: Record<string, number> = {};

			for (const userDoc of usersSnapshot.docs) {
				const userID = userDoc.id;
				const applicationsRef = collection(db, `Users/${userID}/Applications`);
				const applicationsSnapshot = await getDocs(applicationsRef);

				applicationsSnapshot.forEach((appDoc) => {
					const appData = appDoc.data();
					totalApps++;

					// ✅ Years of experience
					if (appData.experience && !isNaN(+appData.experience)) {
						totalExperience += parseInt(appData.experience);
						experienceCount++;
					}

					// ✅ Age from ID Number
					if (appData.idNumber && /^\d{6}/.test(appData.idNumber)) {
						const birth = appData.idNumber.substring(0, 6); // YYMMDD
						const year = parseInt(birth.substring(0, 2), 10);
						const month = parseInt(birth.substring(2, 4), 10);
						const day = parseInt(birth.substring(4, 6), 10);

						// Normalize year
						const fullYear = year < 30 ? 2000 + year : 1900 + year;

						const birthDate = new Date(fullYear, month - 1, day);
						const age = Math.floor((Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));

						if (!isNaN(age)) {
							totalAge += age;
							ageCount++;
						}
					}

					// ✅ Gender distribution
					if (appData.gender) {
						const gender = appData.gender;
						genderMap[gender] = (genderMap[gender] || 0) + 1;
					}
				});
			}

			// 🔄 Update stores
			totalApplications.set(totalApps);
			averageYearsOfExperience.set(experienceCount ? +(totalExperience / experienceCount).toFixed(1) : 0);
			averageApplicantAge.set(ageCount ? +(totalAge / ageCount).toFixed(1) : 0);
			genderStats.set(genderMap);

			console.log("✅ Metrics updated from Firestore");
		} catch (error) {
			console.error("🔥 Error Fetching Applications:", error);
		}
	};
	// Fetch applications on component mount
	fetchAllApplications();
</script>

<div class="flex min-h-screen w-full flex-col">
	<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
		<div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
			<!-- Applications -->
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Total Applications</Card.Title>
					<Users class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">{$totalApplications}</div>
				</Card.Content>
			</Card.Root>

			<!-- Avg Years of Experience -->
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Avg Experience (Years)</Card.Title>
					<Activity class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">{$averageYearsOfExperience}</div>
				</Card.Content>
			</Card.Root>

			<!-- Avg Age -->
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Avg Applicant Age</Card.Title>
					<Users class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">{$averageApplicantAge}</div>
				</Card.Content>
			</Card.Root>

			<!-- Placeholder for future: Gender or Province -->
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Gender Distribution</Card.Title>
					<CreditCard class="h-4 w-4 text-muted-foreground" />
				</Card.Header>
				<Card.Content>
					{#each Object.entries($genderStats) as [gender, count]}
						<p class="text-sm">{gender}: {count}</p>
					{/each}
				</Card.Content>
			</Card.Root>
		</div>

		<div class=" gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
			<Card.Root class=" xl:col-span-2">
				<Card.Header class="flex flex-row items-center">
					<div class="mb-2 grid gap-2">
						<Card.Title>Applications</Card.Title>
						<Card.Description>Recent applications to the program.</Card.Description>
					</div>
					<Button href="/applications" size="sm" class="ml-auto gap-1">
						View All
						<ArrowUpRight class="h-4 w-4" />
					</Button>
				</Card.Header>
				<ApplicationsCharts />
			</Card.Root>
		</div>
	</main>
</div>

