<script lang="ts">
	import { DateFormatter, getDayOfWeek, getLocalTimeZone, now } from "@internationalized/date";

	import type { Application } from "../data.js";
	import * as Icons from "../icons.js";
	import * as Avatar from "$lib/components/ui/avatar/index";
	import { Button, buttonVariants } from "$lib/components/ui/button/index";
	import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog"; // or whatever modal lib you use
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";

	import { Separator } from "$lib/components/ui/separator/index";

	import * as Tooltip from "$lib/components/ui/tooltip/index";

	export let application: Application | null = null;
	let showModal = false;
	const fullFormatter = new DateFormatter("en-US", {
		dateStyle: "medium",
		timeStyle: "medium",
	});

</script>

<div class="flex h-full flex-col">
	<div class="mb-1 flex items-center p-2">
		<div class="flex items-center gap-2">
			<Tooltip.Root openDelay={0} group>
				<Tooltip.Trigger
					id="archive_tooltip"
					class={buttonVariants({ variant: "ghost", size: "icon" })}
					disabled={!application}
				>
					<Icons.Archive class="size-4" />
					<span class="sr-only">Archive</span>
				</Tooltip.Trigger>
				<Tooltip.Content>Archive</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root openDelay={0} group>
				<Tooltip.Trigger
					id="move_to_trash_tooltip"
					class={buttonVariants({ variant: "ghost", size: "icon" })}
					disabled={!application}
				>
					<Icons.Trash2 class="size-4" />
					<span class="sr-only">Move to trash</span>
				</Tooltip.Trigger>
				<Tooltip.Content>Move to trash</Tooltip.Content>
			</Tooltip.Root>
		</div>

		<Separator orientation="vertical" class="mx-2 h-6" />
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				id="more_options_dropdown"
				class={buttonVariants({ variant: "ghost", size: "icon" })}
				disabled={!application}
			>
				<Icons.EllipsisVertical class="size-4" />
				<span class="sr-only">More</span>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item>Mark as unread</DropdownMenu.Item>
				<DropdownMenu.Item>Star Application</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	<Separator />
	{#if application}
		<div class="flex h-full flex-1 flex-col overflow-hidden">
			<div class="flex items-start p-4">
				<div class="flex items-start gap-4 text-sm">
					<Avatar.Root>
						<Avatar.Image src={application.uploads?.profilePicture} alt={application.name} />
						<Avatar.Fallback>
							{application.name
								.split(" ")
								.map((chunk) => chunk[0])
								.join("")}
						</Avatar.Fallback>
					</Avatar.Root>
					<div class="grid gap-1">
						<div class="font-semibold">
							{application.name} {application.surname}
						</div>
						<div class="text-xs text-muted-foreground">
							{application.email}
						</div>
						<div class="text-xs text-muted-foreground">
							Applied on {fullFormatter.format(new Date(application.dateSubmitted))}
						</div>
					</div>
				</div>
			</div>

			<Separator />

			<div class="flex-1 overflow-y-auto whitespace-pre-wrap p-4 text-sm space-y-6">

				<!-- Basic Info -->
				<div class="grid md:grid-cols-2 gap-4">
					<p><strong>ID Number:</strong> {application.idNumber}</p>
					<p><strong>Gender:</strong> {application.gender}</p>
					<p><strong>Race:</strong> {application.race}</p>
					<p><strong>Province:</strong> {application.province}</p>
					<p><strong>Postal Code:</strong> {application.postalCode}</p>
					<p><strong>Address:</strong> {application.address}</p>
					<p><strong>Religion:</strong> {application.religion}</p>
				</div>

				<!-- Qualifications -->
				<div>
					<h4 class="font-semibold text-sm mb-1">Qualifications</h4>
					<ul class="list-disc list-inside">
						{#each application.qualifications as q}
							<li>{q}</li>
						{/each}
					</ul>
				</div>

				<!-- Work History -->
				<div>
					<h4 class="font-semibold text-sm mb-1">Work History</h4>
					<ul class="list-disc list-inside">
						{#each application.workHistory as job}
							<li>{job}</li>
						{/each}
					</ul>
				</div>

				<!-- Motivation -->
				<div>
					<h4 class="font-semibold text-sm mb-1">Motivation</h4>
					<p class="text-muted-foreground">{application.motivation}</p>
				</div>

				<!-- Achievements -->
				<div>
					<h4 class="font-semibold text-sm mb-1">Achievements</h4>
					<p class="text-muted-foreground">{application.achievements}</p>
				</div>

				<!-- Leadership Style -->
				{#if application.uploads?.leadershipStyle}
					<div>
						<h4 class="font-semibold text-sm mb-1">Leadership Style</h4>
						<p>{application.uploads.leadershipStyle}</p>
					</div>
				{/if}

				<!-- Documents -->
				<div>
					<h4 class="font-semibold text-sm mb-1">Documents</h4>
					<ul class="list-disc list-inside text-blue-400 text-sm space-y-1">
						{#each Object.entries(application.uploads || {}) as [label, url] (label)}
							{#if url && label !== 'profilePicture' && label !== 'leadershipStyle'}
								<li>
									<a href={url} target="_blank" class="underline capitalize">
										{label}
									</a>
								</li>
							{/if}
						{/each}
					</ul>
				</div>
			</div>

			<Separator class="mt-auto" />
			<!-- Inline AI Summary -->
			<div class="border rounded-md p-4 bg-muted/50 mt-4">
				<p class="font-medium text-sm mb-1">🧠 Quant AI Recommendation</p>
				<div class="text-sm mb-2">
					✅ <strong>Recommended</strong> &middot; <span class="text-muted-foreground">Score: 87</span>
				</div>
				<Button size="sm" variant="outline" on:click={() => showModal = true}>
					View Justification
				</Button>
			</div>

			{#if showModal}
				<Dialog bind:open={showModal}>
					<DialogContent class="max-w-lg">
						<DialogTitle>Quant AI Justification</DialogTitle>
						<p class="text-sm leading-relaxed mt-2">
							This candidate scored high based on leadership impact, qualification diversity,
							and alignment with institutional goals. Experience as Deputy Principal and M.Ed
							focuses were weighted strongly. Recommendation generated based on criteria match rate: 92%.
						</p>

						<div class="mt-4 flex justify-end">
							<Button size="sm" variant="secondary" on:click={() => showModal = false}>Close</Button>
						</div>
					</DialogContent>
				</Dialog>
			{/if}

		</div>
	{:else}
		<div class="text-muted-foreground p-8 text-center">No application selected</div>
	{/if}

</div>
