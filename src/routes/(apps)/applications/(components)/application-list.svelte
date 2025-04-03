<script lang="ts">
	import { applicationStore } from "../store.js";
	import type { Application } from "../data.js";
	import { formatTimeAgo } from "../utils.js";
	import { cn } from "$lib/utils.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";


	export let items: Application[];
	export let onSelect: (app: Application) => void = () => {};

	function calculateAge(idNumber: string): number {
		if (!idNumber || idNumber.length < 2) return 0;
		const year = parseInt(idNumber.slice(0, 2), 10);
		const currentYear = new Date().getFullYear();
		const fullYear = year > 30 ? 1900 + year : 2000 + year;
		return currentYear - fullYear;
	}

	function getAgeBadgeVariant(age: number): "secondary" | "outline" {
		return age >= 40 && age <= 50 ? "secondary" : "outline";
	}


</script>

<ScrollArea class="h-screen">
	<div class="flex flex-col gap-2 p-4 pt-0">
		{#each items as item}
			<!-- instead of just calling applicationStore.setApplication -->
			<button
				class={cn(
		"hover:bg-accent flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all",
		$applicationStore.selected === item.id && "bg-muted"
	)}
				on:click={() => {
					console.log("🔍 App clicked:", item);
		applicationStore.setApplication(item.id);
		onSelect(item); // ← new line
	}}
			>
			<!-- Name & Date -->
				<div class="flex w-full flex-col gap-1">
					<div class="flex items-center">
						<div class="flex items-center gap-2">
							<div class="font-semibold">
								{item?.name ?? "Unknown"} {item?.surname ?? ""}
							</div>
							{#if !item?.read}
								<span class="flex h-2 w-2 rounded-full bg-blue-600" />
							{/if}
						</div>
						<div
							class={cn(
								"ml-auto text-xs",
								$applicationStore.selected === item.id
									? "text-foreground"
									: "text-muted-foreground"
							)}
						>
							{formatTimeAgo(new Date(item?.dateSubmitted))}
						</div>
					</div>
				</div>

				<!-- Motivation preview -->
				<div class="text-muted-foreground line-clamp-2 text-xs">
					{item?.motivation?.substring(0, 150) ?? "No motivation provided"}...
				</div>

				<!-- Badges for Age, Experience and Status -->
				<div class="flex flex-wrap gap-2 mt-1">
					{#if item?.experience}
						<Badge variant="secondary">{item.experience} yrs exp</Badge>
					{/if}
					{#if item?.idNumber}
						{@const age = calculateAge(item.idNumber)}
						<Badge variant={getAgeBadgeVariant(age)}>{age} yrs old</Badge>
					{/if}
				</div>
<!-- Status badge -->
{#if item?.status}
	<Badge
		variant="outline"
		class={cn(
			"text-xs",
			item.status === 'Accepted' && 'bg-green-100 text-green-800 border-green-300',
			item.status === 'Rejected' && 'bg-red-100 text-red-800 border-red-300',
			item.status === 'Pending' && 'bg-yellow-100 text-yellow-800 border-yellow-300'
		)}
	>
		{item.status}
	</Badge>
{/if}


			</button>
		{/each}
	</div>
</ScrollArea>
