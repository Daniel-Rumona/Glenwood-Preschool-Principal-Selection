<script lang="ts">
	export let current = 1;
	export let steps: string[] = [];
	export let shrink = false;
</script>

<div class="flex items-center justify-center overflow-x-auto gap-4 py-1">
	{#each steps as step, i}
		<div class="flex flex-col items-center text-xs font-medium min-w-[40px]">
			<!-- Step Circle -->
			<div class={
				'rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-white text-xs sm:text-sm font-bold ' +
				(i + 1 < current
					? 'bg-green-600'
					: i + 1 === current
					? 'bg-blue-600'
					: 'bg-gray-400')
			}>
				{i + 1}
			</div>
			
			<!-- Always rendered, just faded/hidden on shrink -->
			<div
				class="mt-1 text-center whitespace-nowrap transition-all duration-200 origin-top"
				class:opacity-0={shrink}
				class:scale-0={shrink}
				class:opacity-100={!shrink}
				class:scale-100={!shrink}
			>
				{step}
			</div>
		</div>

		{#if i < steps.length - 1}
			<div class="w-6 h-0.5 bg-white/20 sm:w-10 md:w-20"></div>
		{/if}
	{/each}
</div>
