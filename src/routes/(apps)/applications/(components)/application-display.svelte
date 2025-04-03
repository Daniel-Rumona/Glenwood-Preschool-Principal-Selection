<script lang="ts">
	import { DateFormatter } from "@internationalized/date";
	import type { Application } from "../data.js";
	import { applications } from "../data.js";
	import { doc, updateDoc } from "firebase/firestore";
	import { db } from "$lib/firebase";

	import * as Icons from "../icons.js";
	import * as Avatar from "$lib/components/ui/avatar/index";
	import { Button, buttonVariants } from "$lib/components/ui/button/index";
	import { Dialog, DialogContent, DialogTitle } from "$lib/components/ui/dialog";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
	import { Separator } from "$lib/components/ui/separator/index";
	import * as Tooltip from "$lib/components/ui/tooltip/index";

	export let application: Application | null = null;
	let showModal = false;

	const fullFormatter = new DateFormatter("en-US", {
		dateStyle: "medium",
		timeStyle: "medium"
	});
	async function updateStatus(status: 'Accepted' | 'Rejected') {
		if (!application) return;

		try {
			await updateDoc(doc(db, `Users/${application.userId}/Applications/${application.id}`), {
				status
			});

			// Update local store
			application.status = status;
			applications.update(apps =>
				apps.map(item => item.id === application.id ? { ...item, status } : item)
			);
		} catch (err) {
			console.error('❌ Failed to update status:', err);
		}
	}

	async function toggleArchive() {
		if (!application) return;
		const newValue = !application.archived;

		await updateDoc(doc(db, `Users/${application.userId}/Applications/${application.id}`), {
			archived: newValue
		});

		application.archived = newValue;
		applications.update(list =>
			list.map(item => item.id === application.id ? { ...item, archived: newValue } : item)
		);
	}

	async function toggleStar() {
		if (!application) return;
		const newValue = !application.starred;

		await updateDoc(doc(db, `Users/${application.userId}/Applications/${application.id}`), {
			starred: newValue
		});

		application.starred = newValue;
		applications.update(list =>
			list.map(item => item.id === application.id ? { ...item, starred: newValue } : item)
		);
	}
</script>

<div class="flex h-full flex-col">
	<!-- Toolbar -->
	<div class="mb-1 flex items-center p-2">
		<div class="flex items-center gap-2">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })} disabled={!application}>
					<Icons.Archive class="size-4" />
					<span class="sr-only">Archive</span>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item on:click={toggleArchive()}>
						{application?.archived ? 'Unarchive' : 'Archive'} application
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>


			<Tooltip.Root>
				<Tooltip.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })} disabled={!application}>
					<Icons.Trash2 class="size-4" />
					<span class="sr-only">Delete</span>
				</Tooltip.Trigger>
				<Tooltip.Content>Delete</Tooltip.Content>
			</Tooltip.Root>
		</div>

		<Separator orientation="vertical" class="mx-2 h-6" />

		<DropdownMenu.Root>
			<DropdownMenu.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })} disabled={!application}>
				<Icons.EllipsisVertical class="size-4" />
				<span class="sr-only">More</span>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Item on:click={toggleStar}>
					{application?.starred ? 'Unstar' : 'Star'} application
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<Separator />

	{#if application}
		<div class="flex h-full flex-1 flex-col overflow-hidden">
			<!-- Header -->
			<div class="flex items-start p-4">
				<div class="flex items-start gap-4 text-sm">
					<Avatar.Root>
						<Avatar.Image src={application.uploads?.profilePicture} alt={application.name} />
						<Avatar.Fallback>
							{(application.name ?? "U")
								.split(" ")
								.map((chunk) => chunk[0])
								.join("")}
						</Avatar.Fallback>
					</Avatar.Root>
					<div class="grid gap-1">
						<div class="font-semibold">{application.name} {application.surname}</div>
						<div class="text-xs text-muted-foreground">{application.email}</div>
						{#if application.dateSubmitted}
							<div class="text-xs text-muted-foreground">
								Applied on {fullFormatter.format(new Date(application.dateSubmitted))}
							</div>
						{:else}
							<span class="italic text-muted-foreground">Date not available</span>
						{/if}
					</div>
				</div>
			</div>
<div class="border rounded-md p-4 bg-muted/50 mt-4">
				<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
					<!-- Left side: Recommendation text -->
					<div>
						<p class="font-medium text-sm mb-1">🧠 Quant AI Recommendation</p>
						<div class="text-sm">
							{#if application.aiRecommendation}
								{#if application.aiRecommendation.toLowerCase() === 'hire'}
									✅ <strong>Recommended</strong>
								{:else}
									❌ <strong>Not Recommended</strong>
								{/if}
							{:else}
								<span class="italic text-muted-foreground">No recommendation</span>
							{/if}
							{#if application.aiScore}
								&middot; <span class="text-muted-foreground">Score: {application.aiScore}</span>
							{/if}
						</div>
						{#if application.status}
							<p class="text-xs mt-1" class:text-green-600={application.status === 'Accepted'} class:text-red-500={application.status === 'Rejected'}>
								Status: <strong>{application.status}</strong>
							</p>
						{/if}
					</div>

					<!-- Right side: Action buttons -->
					<div class="flex gap-2 mt-1 md:mt-0">
						<Button
							size="sm"
							variant="default"
							on:click={() => updateStatus('Accepted')}
							disabled={application.status === 'Accepted'}
						>
							✅ Accept
						</Button>
						<Button
							size="sm"
							variant="destructive"
							on:click={() => updateStatus('Rejected')}
							disabled={application.status === 'Rejected'}
						>
							❌ Reject
						</Button>
					</div>
				</div>

				<!-- Justification button and optional status -->
				<div class="mt-3 flex items-center justify-between">
					<Button size="sm" variant="outline" on:click={() => (showModal = true)}>
						View Justification
					</Button>
				</div>
			</div>

			<Separator />

			<!-- Scrollable body -->
			<div class="flex-1 overflow-y-auto whitespace-pre-wrap p-4 text-sm space-y-6">
				<div class="grid md:grid-cols-2 gap-4">
					<p><strong>ID Number:</strong> {application.idNumber}</p>
					<p><strong>Gender:</strong> {application.gender}</p>
					<p><strong>Race:</strong> {application.race}</p>
					<p><strong>Province:</strong> {application.province}</p>
					<p><strong>Postal Code:</strong> {application.postalCode}</p>
					<p><strong>Address:</strong> {application.address}</p>
					<p><strong>Religion:</strong> {application.religion}</p>
				</div>

				{#if application.qualifications?.length}
					<div>
						<h4 class="font-semibold text-sm mb-1">Qualifications</h4>
						<ul class="list-disc list-inside">
							{#each application.qualifications as q}
								<li>{q}</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if application.workHistory?.length}
					<div>
						<h4 class="font-semibold text-sm mb-1">Work History</h4>
						<ul class="list-disc list-inside">
							{#each application.workHistory as job}
								<li>{job}</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if application.motivation}
					<div>
						<h4 class="font-semibold text-sm mb-1">Motivation</h4>
						<p class="text-muted-foreground">{application.motivation}</p>
					</div>
				{/if}

				{#if application.achievements}
					<div>
						<h4 class="font-semibold text-sm mb-1">Achievements</h4>
						<p class="text-muted-foreground">{application.achievements}</p>
					</div>
				{/if}

				{#if application.uploads?.leadershipStyle}
					<div>
						<h4 class="font-semibold text-sm mb-1">Leadership Style</h4>
						<p>{application.uploads.leadershipStyle}</p>
					</div>
				{/if}

				{#if application.uploads}
					<div>
						<h4 class="font-semibold text-sm mb-1">Documents</h4>
						<ul class="list-disc list-inside text-blue-400 text-sm space-y-1">
							{#each Object.entries(application.uploads) as [label, url]}
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
				{/if}
			</div>

			<!-- AI summary footer -->
			<Separator class="mt-auto" />
			
			{#if showModal}
				<Dialog bind:open={showModal}>
					<DialogContent class="max-w-lg">
						<DialogTitle>Quant AI Justification</DialogTitle>

						{#if application.aiJustification}
							<p class="text-sm leading-relaxed mt-2">{application.aiJustification}</p>
						{:else if application.aiResponse?.justification}
							<p class="text-sm leading-relaxed mt-2">{application.aiResponse.justification}</p>
						{:else}
							<p class="text-sm italic text-muted-foreground mt-2">No justification provided.</p>
						{/if}

						<div class="mt-4 flex justify-end">
							<Button size="sm" variant="secondary" on:click={() => (showModal = false)}>Close</Button>
						</div>
					</DialogContent>
				</Dialog>
			{/if}

		</div>
	{:else}
		<div class="text-muted-foreground p-8 text-center">No application selected</div>
	{/if}
</div>
