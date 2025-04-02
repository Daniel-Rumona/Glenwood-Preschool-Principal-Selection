<script lang="ts">
	import { onMount } from "svelte";
	import Search from "lucide-svelte/icons/search";
	import { applicationStore } from "../store.js";
	import { applications, loadApplications } from "../data.js";
	import ApplicationDisplay from "./application-display.svelte";
	import ApplicationList from "./application-list.svelte";
	import { Input } from "$lib/components/ui/input/index.js";
	import * as Resizable from "$lib/components/ui/resizable/index.js";
	import { Separator } from "$lib/components/ui/select/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import { writable } from "svelte/store";
	import { doc, updateDoc, getDocs, collection } from 'firebase/firestore';
	import { db } from '$lib/firebase';

	let defaultLayout = [440, 655];
	let loading = writable(true);

	onMount(async () => {
		await loadApplications();
		loading.set(false);
	});

	async function handleSelect(app) {
		applicationStore.setApplication(app.id);

		// 🔄 If unread, mark as read in Firestore + local
		if (!app.read) {
			// 🔍 Find the right user's doc path
			const usersSnapshot = await getDocs(collection(db, "Users"));
			for (const userDoc of usersSnapshot.docs) {
				try {
					const appRef = doc(db, `Users/${userDoc.id}/Applications/${app.id}`);
					await updateDoc(appRef, { read: true });

					// Update local store
					applications.update(list =>
						list.map(item => item.id === app.id ? { ...item, read: true } : item)
					);
					break; // ✅ Stop after successful update
				} catch (e) {
					// ignore invalid user/app path
				}
			}
		}
	}

	function onLayoutChange(sizes: number[]) {
		document.cookie = `PaneForge:layout=${JSON.stringify(sizes)}`;
	}
</script>

<!-- 👇 Debug log -->
{#if !$loading}
	{@const appList = $applications}
	{@html `<script>console.log("📦 Applications loaded:", ${JSON.stringify(appList)})</script>`}
{/if}

<div class="hidden md:block">
	<Resizable.PaneGroup
		direction="horizontal"
		{onLayoutChange}
		class="h-full max-h-[800px] items-stretch"
	>
		<Resizable.Pane defaultSize={defaultLayout[0]} minSize={30}>
			<Tabs.Root value="all">
				<div class="flex items-center px-4 py-2">
					<h1 class="text-xl font-bold">Applications</h1>
					<Tabs.List class="ml-auto">
						<Tabs.Trigger value="all" class="text-zinc-600 dark:text-zinc-200">All</Tabs.Trigger>
						<Tabs.Trigger value="archived" class="text-zinc-600 dark:text-zinc-200">Archived</Tabs.Trigger>
						<Tabs.Trigger value="stared" class="text-zinc-600 dark:text-zinc-200">Stared</Tabs.Trigger>
						<Tabs.Trigger value="unread" class="text-zinc-600 dark:text-zinc-200">Unread</Tabs.Trigger>
					</Tabs.List>
				</div>

				<Separator />

				<div class="bg-background/95 supports-[backdrop-filter]:bg-background/60 p-4 backdrop-blur">
					<form>
						<div class="relative">
							<Search class="text-muted-foreground absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%]" />
							<Input placeholder="Search" class="pl-8" />
						</div>
					</form>
				</div>

				{#if $loading}
					<p class="text-center p-4 text-muted-foreground text-sm">Loading applications...</p>
				{:else}
					<Tabs.Content value="all" class="m-0">
						{#if $applications.length > 0}
							<ApplicationList items={$applications} onSelect={handleSelect} />
						{:else}
							<p class="text-center p-4 text-muted-foreground text-sm">No applications found.</p>
						{/if}
					</Tabs.Content>

					<Tabs.Content value="archived" class="m-0">
						{@const archivedApps = $applications.filter(item => item.archived)}
						{#if archivedApps.length > 0}
							<ApplicationList items={archivedApps} onSelect={handleSelect} />
						{:else}
							<p class="text-center p-4 text-muted-foreground text-sm">No archived applications.</p>
						{/if}
					</Tabs.Content>


					<Tabs.Content value="stared" class="m-0">
						{@const staredApps = $applications.filter(item => item.starred)}
						{#if staredApps.length > 0}
							<ApplicationList items={staredApps} onSelect={handleSelect} />
						{:else}
							<p class="text-center p-4 text-muted-foreground text-sm">No stared applications.</p>
						{/if}
					</Tabs.Content>
					<Tabs.Content value="unread" class="m-0">
						{@const unreadApps = $applications.filter(item => !item.read)}
						{#if unreadApps.length > 0}
							<ApplicationList items={unreadApps} onSelect={handleSelect} />
						{:else}
							<p class="text-center p-4 text-muted-foreground text-sm">No unread applications.</p>
						{/if}
					</Tabs.Content>
				{/if}
			</Tabs.Root>
		</Resizable.Pane>

		<Resizable.Handle withHandle />

		<Resizable.Pane defaultSize={defaultLayout[1]}>
			<ApplicationDisplay
				application={$applications.find(item => item.id === $applicationStore.selected) || null}
			/>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
