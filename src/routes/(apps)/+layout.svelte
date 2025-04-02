<script lang="ts">
	import '../../app.css';
	import { SiteHeader } from '$lib/components/ui/index';
	import { ModeWatcher } from 'mode-watcher';
	import { page } from '$app/stores';

	// Define routes where the header should be hidden
	const hiddenRoutes = ['/', '/application-status', '/authentication/sign-in', '/authentication/registration', '/authentication/registration/details',
		'/authentication/registration/experience', '/authentication/registration/uploads',
		'/authentication/registration/review', '/authentication/registration/submit', '/authentication/forgot-password'];
</script>

<ModeWatcher />

{#if !hiddenRoutes.includes($page.url.pathname)}
	<SiteHeader />
{/if}

<div class="bg-background relative flex min-h-screen flex-col" id="page" data-vaul-drawer-wrapper>
	<slot />
</div>
