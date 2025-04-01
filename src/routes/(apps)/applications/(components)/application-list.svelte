<script lang="ts">
	import { applicationStore } from "../store.js";
	import type { Application } from "../data.js";
	import { formatTimeAgo } from "../utils.js";
	import { cn } from "$lib/utils.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

	export let items: Application[];

	function getBadgeVariant(key: string) {
		if (["gauteng", "western cape", "kwazulu-natal"].includes(key.toLowerCase())) return "default";
		if (["limpopo", "free state"].includes(key.toLowerCase())) return "outline";
		return "secondary";
	}
</script>

<ScrollArea class="h-screen">
	<div class="flex flex-col gap-2 p-4 pt-0">
		{#each items as item}
			<button
				class={cn(
					"hover:bg-accent flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all",
					$applicationStore.selected === item.id && "bg-muted"
				)}
				on:click={() => applicationStore.setApplication(item.id)}
			>
				<!-- Name & Date -->
				<div class="flex w-full flex-col gap-1">
					<div class="flex items-center">
						<div class="flex items-center gap-2">
							<div class="font-semibold">
								{item.name} {item.surname}
							</div>
							{#if !item.read}
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
							{formatTimeAgo(new Date(item.dateSubmitted))}
						</div>
					</div>
				</div>

				<!-- Motivation preview -->
				<div class="text-muted-foreground line-clamp-2 text-xs">
					{item.motivation?.substring(0, 150)}...
				</div>

				<!-- Badges for Province and Experience -->
				<div class="flex flex-wrap gap-2 mt-1">
					<Badge variant={getBadgeVariant(item.province)}>{item.province}</Badge>
					<Badge variant="secondary">{item.experience} yrs exp</Badge>
				</div>
			</button>
		{/each}
	</div>
</ScrollArea>
