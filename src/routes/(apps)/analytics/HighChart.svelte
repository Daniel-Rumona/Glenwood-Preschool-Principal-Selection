<script lang="ts">
	import Chart from '@highcharts/svelte';
	import type { Options } from 'highcharts';

	export let options: Options;
</script>

<Chart {options} />
