<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, getDocs } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import DateRangePicker from './DateRangePicker.svelte';
	import HighChart from './HighChart.svelte';

	let genderDistribution;
	let genderVsAcceptance;
	let experienceVsAcceptance;

	const experienceRanges = ['0-2 yrs', '3-5 yrs', '6-10 yrs', '10+ yrs'];

	function bucketExperience(years) {
		if (years <= 2) return '0-2 yrs';
		if (years <= 5) return '3-5 yrs';
		if (years <= 10) return '6-10 yrs';
		return '10+ yrs';
	}

	onMount(async () => {
		console.log('🔄 Fetching users...');
		const usersSnapshot = await getDocs(collection(db, 'Users'));
		const allApps = [];

		for (const userDoc of usersSnapshot.docs) {
			console.log(`👤 User: ${userDoc.id}`);
			const appsSnapshot = await getDocs(collection(db, `Users/${userDoc.id}/Applications`));

			console.log(`📦 Applications for ${userDoc.id}:`, appsSnapshot.docs.length);

			for (const appDoc of appsSnapshot.docs) {
				const appData = appDoc.data();
				console.log(`📄 Application ${appDoc.id}:`, appData);
				allApps.push(appData);
			}
		}

		console.log('🔥 All loaded applications:', allApps);

		// Aggregate logs
		let genderCounts = { Male: 0, Female: 0 };
		let genderStatus = { Male: { Accepted: 0, Rejected: 0 }, Female: { Accepted: 0, Rejected: 0 } };
		let experienceStatus = {};
		for (const label of experienceRanges) {
			experienceStatus[label] = { Accepted: 0, Rejected: 0 };
		}

		allApps.forEach(app => {
			const gender = app.gender ?? 'Unknown';
			const status = app.status ?? 'Unknown';
			const years = parseInt(app.experience) || 0;
			const range = bucketExperience(years);

			if (!(gender in genderCounts)) genderCounts[gender] = 0;
			genderCounts[gender]++;

			if (!(gender in genderStatus)) {
				genderStatus[gender] = { Accepted: 0, Rejected: 0 };
			}
			if (status in genderStatus[gender]) {
				genderStatus[gender][status]++;
			}

			if (status in experienceStatus[range]) {
				experienceStatus[range][status]++;
			}
		});

		console.log('📊 Gender Counts:', genderCounts);
		console.log('📊 Gender Status Breakdown:', genderStatus);
		console.log('📊 Experience Breakdown:', experienceStatus);

		// Set chart data
		genderDistribution = {
			chart: { type: 'pie', backgroundColor: 'transparent' },
			title: { text: '' },
			legend: {
				itemStyle: { color: '#ffffff' }
			},
			series: [{
				name: 'Applicants',
				colorByPoint: true,
				data: Object.entries(genderCounts).map(([name, y]) => ({ name, y }))
			}]
		};

		genderVsAcceptance = {
			chart: { type: 'column', backgroundColor: 'transparent' },
			title: { text: '' },
			xAxis: {
				categories: Object.keys(genderStatus),
				labels: {
					style: {
						color: '#ffffff'
					}
				}
			},
			yAxis: { title: { text: 'Count' },
				labels: {
					style: {
						color: '#ffffff'
					}
				}
			},
			legend: {
				itemStyle: { color: '#ffffff' }
			},
			series: [
				{ name: 'Accepted', data: Object.values(genderStatus).map(s => s.Accepted) },
				{ name: 'Rejected', data: Object.values(genderStatus).map(s => s.Rejected) }
			]
		};

		experienceVsAcceptance = {
			chart: { type: 'bar', backgroundColor: 'transparent' },
			title: { text: '' },
			xAxis: { categories: experienceRanges,labels: {
					style: {
						color: '#ffffff'
					}
				}
			},
			yAxis: { title: { text: 'Count' },labels: {
					style: {
						color: '#ffffff'
					}
				}
			},
			legend: {
				itemStyle: { color: '#ffffff' }
			},

			series: [
				{ name: 'Accepted', data: experienceRanges.map(label => experienceStatus[label].Accepted) },
				{ name: 'Rejected', data: experienceRanges.map(label => experienceStatus[label].Rejected) }
			]
		};
	});

</script>

<!-- Header -->
<div class="flex justify-between items-center mb-8 px-4 md:px-8">
	<h1 class="text-2xl font-bold text-foreground">Analytics</h1>
	<DateRangePicker />
</div>

<!-- Grid Layout -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-8 pb-12">
	<!-- Card -->
	<div class="glass-card">
		<h2 class="text-base font-semibold mb-2">Gender Distribution</h2>
		{#if genderDistribution}
			{#if genderDistribution.series[0].data.length > 0}
				<HighChart options={genderDistribution} />
			{:else}
				<p class="text-sm text-muted-foreground italic">No gender data available</p>
			{/if}
		{:else}
			<div class="animate-pulse text-sm text-muted-foreground">Loading chart...</div>
		{/if}
	</div>

	<div class="glass-card">
		<h2 class="text-base font-semibold mb-2">Gender vs Acceptance</h2>
		{#if genderVsAcceptance}
			{#if genderVsAcceptance.series[0].data.length > 0}
				<HighChart options={genderVsAcceptance} />
			{:else}
				<p class="text-sm text-muted-foreground italic">No gender data available</p>
			{/if}
		{:else}
			<div class="animate-pulse text-sm text-muted-foreground">Loading chart...</div>
		{/if}

	</div>
</div>
<div class="md:grid-cols-2 gap-8 px-4 md:px-8 pb-12">
<div class="glass-card">
	<h2 class="text-base font-semibold mb-2">Experience vs Acceptance</h2>
	{#if experienceVsAcceptance}
		{#if experienceVsAcceptance.series[0].data.length > 0}
			<HighChart options={experienceVsAcceptance} />
		{:else}
			<p class="text-sm text-muted-foreground italic">No data available</p>
		{/if}
	{:else}
		<div class="animate-pulse text-sm text-muted-foreground">Loading chart...</div>
	{/if}

</div>
</div>


<style>
    :global(.highcharts-credits) {
        display: none !important;
    }

    .glass-card {
        background-color: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: 12px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        color: var(--foreground);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    :global(.dark) .glass-card {
        background-color: rgba(17, 24, 39, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
</style>
