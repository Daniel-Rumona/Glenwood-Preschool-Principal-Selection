<script lang="ts">
	import DateRangePicker from './DateRangePicker.svelte';
	import HighChart from './HighChart.svelte';

	const genderDistribution = {
		chart: { type: 'pie', backgroundColor: 'transparent' },
		title: { text: '' },
		series: [{
			name: 'Applicants',
			colorByPoint: true,
			data: [
				{ name: 'Female', y: 55 },
				{ name: 'Male', y: 40 }
			]
		}]
	};

	const genderVsAcceptance = {
		chart: { type: 'column', backgroundColor: 'transparent' },
			title: { text: '' },
		xAxis: { categories: ['Female', 'Male'] },
		yAxis: { title: { text: 'Count' } },
		series: [
			{ name: 'Accepted', data: [35, 25] },
			{ name: 'Rejected', data: [20, 15] }
		]
	};

	const experienceVsAcceptance = {
		chart: { type: 'bar', backgroundColor: 'transparent' },
			title: { text: '' },
		xAxis: { categories: ['0-2 yrs', '3-5 yrs', '6-10 yrs', '10+ yrs'] },
		yAxis: { title: { text: 'Count' } },
		series: [
			{ name: 'Accepted', data: [10, 18, 30, 20] },
			{ name: 'Rejected', data: [8, 12, 10, 5] }
		]
	};

	const recommendationInsights = {
		chart: { type: 'line', backgroundColor: 'transparent' },
			title: { text: '' },
		xAxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
		yAxis: { title: { text: 'Score' } },
		series: [{ name: 'Score', data: [72, 80, 78, 85] }]
	};
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
		<HighChart options={genderDistribution} />
	</div>

	<div class="glass-card">
		<h2 class="text-base font-semibold mb-2">Gender vs Acceptance</h2>
		<HighChart options={genderVsAcceptance} />
	</div>

	<div class="glass-card">
		<h2 class="text-base font-semibold mb-2">Experience vs Acceptance</h2>
		<HighChart options={experienceVsAcceptance} />
	</div>

	<div class="glass-card">
		<h2 class="text-base font-semibold mb-2">Quant AI Score Over Time</h2>
		<HighChart options={recommendationInsights} />
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
