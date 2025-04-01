<script lang="ts">
	import Search from "lucide-svelte/icons/search";
	import { primaryRoutes } from "../config.js";
	import { applicationStore } from "../store.js";
	import type { Account, Application } from "../data.js";
	import AccountSwitcher from "./account-switcher.svelte";
	import ApplicationDisplay from "./application-display.svelte";
	import ApplicationList from "./application-list.svelte";
	import Nav from "./nav.svelte";
	import { cn } from "$lib/utils.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import * as Resizable from "$lib/components/ui/resizable/index.js";
	import { Separator } from "$lib/components/ui/select/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";


	export let applications: Application[];
	export let defaultLayout = [440, 655];



	function onLayoutChange(sizes: number[]) {
		document.cookie = `PaneForge:layout=${JSON.stringify(sizes)}`;
	}

</script>


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
						<Tabs.Trigger value="all" class="text-zinc-600 dark:text-zinc-200">
							All
						</Tabs.Trigger>
						<Tabs.Trigger value="archived" class="text-zinc-600 dark:text-zinc-200">
							Archived
						</Tabs.Trigger>
						<Tabs.Trigger value="stared" class="text-zinc-600 dark:text-zinc-200">
							Stared
						</Tabs.Trigger>
						<Tabs.Trigger value="unread" class="text-zinc-600 dark:text-zinc-200">
							Unread
						</Tabs.Trigger>
					</Tabs.List>
				</div>
				<Separator />
				<div
					class="bg-background/95 supports-[backdrop-filter]:bg-background/60 p-4 backdrop-blur"
				>
					<form>
						<div class="relative">
							<Search
								class="text-muted-foreground absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%]"
							/>
							<Input placeholder="Search" class="pl-8" />
						</div>
					</form>
				</div>
				<Tabs.Content value="all" class="m-0">
					<ApplicationList items={applications} />
				</Tabs.Content>
				<Tabs.Content value="unread" class="m-0">
					<ApplicationList items={applications.filter((item) => !item.read)} />
				</Tabs.Content>
			</Tabs.Root>
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={defaultLayout[1]}>
			<ApplicationDisplay application={applications.find((item) => item.id === $applicationStore.selected) || null} />
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
