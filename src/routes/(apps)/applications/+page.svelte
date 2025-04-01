<script lang="ts">
	import { accounts, applications } from "./data.js";
	import Mail from "./(components)/application.svelte";

	export let data;
</script>

<Mail
	{accounts}
	{applications}
	defaultLayout={data.layout}
	defaultCollapsed={data.collapsed}
	navCollapsedSize={4}
/>
