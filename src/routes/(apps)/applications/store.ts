import { writable } from "svelte/store";
import type { Application } from "./data.js";

type ApplicationStore = {
	selected: Application["id"] | null;
	applications: Application[];
};

function createApplicationStore() {
	const store = writable<ApplicationStore>({
		selected: null,
		applications: [],
	});

	return {
		subscribe: store.subscribe,
		setApplication: (id: Application["id"]) =>
			store.update((s) => ({ ...s, selected: id })),
		setApplications: (apps: Application[]) =>
			store.update((s) => ({
				applications: apps,
				selected: apps[0]?.id ?? null,
			})),
	};
}

export const applicationStore = createApplicationStore();
