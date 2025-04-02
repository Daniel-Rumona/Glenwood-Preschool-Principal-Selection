// src/routes/applications/+page.ts
import { loadApplications, loadAccounts, applications, accounts } from './data';

export async function load() {
	await loadApplications();
	await loadAccounts();

	return {
		applications,
		accounts,
		layout: [440, 655],      // you can customize or fetch this dynamically
		collapsed: false         // same here
	};
}
