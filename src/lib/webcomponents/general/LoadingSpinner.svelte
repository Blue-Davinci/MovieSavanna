<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg' | 'xl';
		message?: string;
		fullScreen?: boolean;
	}

	let { size = 'lg', message = 'Loading...', fullScreen = true }: Props = $props();

	const sizeClasses = {
		sm: 'h-6 w-6',
		md: 'h-8 w-8',
		lg: 'h-12 w-12',
		xl: 'h-16 w-16'
	};
</script>

<div class="{fullScreen ? 'min-h-screen' : ''} flex items-center justify-center bg-slate-950 px-4">
	<div class="text-center">
		<!-- Spinning Circle -->
		<div class="mb-4">
			<div
				class="inline-block animate-spin rounded-full border-4 border-slate-600 border-t-blue-500 {sizeClasses[
					size
				]}"
			></div>
		</div>

		<!-- Loading Message -->
		{#if message}
			<p class="animate-pulse text-lg font-medium text-gray-400">
				{message}
			</p>
		{/if}
	</div>
</div>
