import { writable } from "svelte/store";
import { type Application, applications } from "./data.js";

type ApplicationStore = {
	selected: Application["id"] | null;
};

function createApplicationStore() {
	const store = writable<ApplicationStore>({ selected: applications[0].id });

	return {
		subscribe: store.subscribe,
		setApplication: (id: Application["id"]) => {
			store.update((store) => ({ ...store, selected: id }));
		},
	};
}

export const applicationStore = createApplicationStore();
