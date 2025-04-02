// src/lib/data.ts

import { writable } from "svelte/store";
import { collection, getDocs } from "firebase/firestore";
import { db } from "$lib/firebase";
import type { ComponentType } from "svelte";
import type { Icon } from "lucide-svelte";
import Vercel from "./(components)/icons/vercel.svelte";
import Gmail from "./(components)/icons/gmail.svelte";
import ICloud from "./(components)/icons/icloud.svelte";

// --- Types ---
export type Application = {
	id: string;
	name: string;
	surname: string;
	email: string;
	userId: string;
	idNumber: string;
	gender: string;
	race: string;
	religion: string;
	province: string;
	address: string;
	postalCode: string;
	qualifications: string[];
	experience: string;
	workHistory: string[];
	motivation: string;
	achievements: string;
	uploads: Record<string, string>;
	dateSubmitted: string; // Firestore timestamp converted to string
	read: boolean;
	archived: boolean;
	starred: boolean;
};

export type Account = {
	label: string;
	email: string;
	icon: ComponentType<Icon>;
};

// --- Reactive Stores ---
export const applications = writable<Application[]>([]);
export const accounts = writable<Account[]>([]);

// --- Load Applications from Firestore ---
export const loadApplications = async () => {
	const usersSnapshot = await getDocs(collection(db, "Users"));
	const appList: Application[] = [];

	for (const userDoc of usersSnapshot.docs) {
		const userId = userDoc.id;
		const email = userDoc.data().userEmail ?? "unknown@example.com";

		const appsSnapshot = await getDocs(collection(db, `Users/${userId}/Applications`));
		for (const appDoc of appsSnapshot.docs) {
			const app = appDoc.data();

			appList.push({
				...app,
				id: appDoc.id,
				email,
				userId,
				read: app.read ?? false,
				archived: app.archived ?? false,
				starred: app.starred ?? false,
				dateSubmitted: app.dateSubmitted?.toDate().toISOString()
			});
		}
	}

	applications.set(appList);
};

// --- Load Accounts from Firestore ---
export const loadAccounts = async () => {
	const usersSnapshot = await getDocs(collection(db, "Users"));
	const accList: Account[] = [];

	usersSnapshot.forEach((doc) => {
		const user = doc.data();
		accList.push({
			label: user.fullName || "Unnamed",
			email: user.userEmail || "unknown@example.com",
			icon: Gmail // you could add logic to select icon here
		});
	});

	accounts.set(accList);
};
