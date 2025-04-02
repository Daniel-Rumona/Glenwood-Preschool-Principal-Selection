<script lang="ts">
	import Application from "./(components)/application.svelte";
	export let data;

</script>

<Application
	applications={data.applications}
	accounts={data.accounts}
	defaultLayout={data.layout}
	defaultCollapsed={data.collapsed}
	navCollapsedSize={4}
/>
