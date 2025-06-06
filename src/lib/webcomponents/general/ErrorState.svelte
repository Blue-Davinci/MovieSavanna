<script lang="ts">
	interface Props {
		title?: string;
		message: string;
		showRetry?: boolean;
		showGoBack?: boolean;
		onRetry?: () => void;
		onGoBack?: () => void;
	}

	let {
		title = 'Something went wrong',
		message,
		showRetry = false,
		showGoBack = false,
		onRetry,
		onGoBack
	}: Props = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-slate-950 px-4">
	<div class="max-w-md text-center">
		<!-- Error Icon -->
		<div class="mb-6">
			<svg
				class="mx-auto h-24 w-24 text-red-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
					d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
				/>
			</svg>
		</div>

		<!-- Error Content -->
		<h1 class="mb-4 text-2xl font-bold text-white">
			{title}
		</h1>

		<p class="mb-8 text-lg text-gray-400">
			{message}
		</p>

		<!-- Action Buttons -->
		<div class="flex flex-col justify-center gap-4 sm:flex-row">
			{#if showRetry && onRetry}
				<button
					onclick={onRetry}
					class="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 focus:outline-none"
				>
					Try Again
				</button>
			{/if}

			{#if showGoBack && onGoBack}
				<button
					onclick={onGoBack}
					class="rounded-lg bg-slate-700 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-600 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950 focus:outline-none"
				>
					← Back to Movies
				</button>
			{/if}
		</div>
	</div>
</div>
