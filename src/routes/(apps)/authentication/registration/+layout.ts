import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getAuth } from 'firebase/auth';

export const load: LayoutLoad = async () => {
	const auth = getAuth();
	const user = auth.currentUser;

	if (!user) {
		throw redirect(302, '/authentication/registration');
	}

	return {};
};
