<script lang="ts">
	import { applicationStore } from "../store.js";
	import type { Application } from "../data.js";
	import { formatTimeAgo } from "../utils.js";
	import { cn } from "$lib/utils.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";


	export let items: Application[];
	export let onSelect: (app: Application) => void = () => {};

	function getBadgeVariant(key: string) {
		if (!key) return "secondary";
		const lower = key.toLowerCase();
		if (["gauteng", "western cape", "kwazulu-natal"].includes(lower)) return "default";
		if (["limpopo", "free state"].includes(lower)) return "outline";
		return "secondary";
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

				<!-- Badges for Province and Experience -->
				<div class="flex flex-wrap gap-2 mt-1">
					{#if item?.province}
						<Badge variant={getBadgeVariant(item.province)}>{item.province}</Badge>
					{/if}
					{#if item?.experience}
						<Badge variant="secondary">{item.experience} yrs exp</Badge>
					{/if}
				</div>
			</button>
		{/each}
	</div>
</ScrollArea>
