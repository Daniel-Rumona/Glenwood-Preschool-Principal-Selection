<script lang="ts">
	import { toast } from '$lib/stores/toast';
</script>

{#if $toast}
	<div
		class="fixed top-5 right-5 z-50 px-4 py-2 rounded text-white text-sm shadow-lg
			{ $toast.type === 'error' ? 'bg-red-600' : $toast.type === 'success' ? 'bg-green-600' : 'bg-blue-600' }"
	>
		{$toast.message}
	</div>
{/if}
