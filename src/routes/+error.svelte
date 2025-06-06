<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	// Get error details from page store (Svelte 5 reactive syntax)
	let status = $derived($page.status || 500);
	let message = $derived($page.error?.message || 'Something went wrong');

	// Error type detection
	let errorType = $derived(getErrorType(status));

	function getErrorType(status: number) {
		if (status === 404) return 'not-found';
		if (status >= 500) return 'server-error';
		if (status >= 400) return 'client-error';
		return 'unknown';
	}

	function getErrorTitle(status: number) {
		switch (status) {
			case 404:
				return 'Page Not Found';
			case 403:
				return 'Access Forbidden';
			case 500:
				return 'Server Error';
			case 503:
				return 'Service Unavailable';
			default:
				return 'Oops! Something went wrong';
		}
	}

	function getErrorDescription(status: number) {
		switch (status) {
			case 404:
				return "The page you're looking for seems to have wandered off into the movie wilderness.";
			case 403:
				return "You don't have permission to access this content. Maybe try logging in?";
			case 500:
				return "Our servers are having a moment. We're working to fix it right away.";
			case 503:
				return "MovieSavanna is temporarily unavailable. We'll be back shortly!";
			default:
				return "Don't worry, our technical crew is working to resolve this issue.";
		}
	}

	function handleGoHome() {
		goto('/');
	}

	function handleGoBack() {
		if (typeof window !== 'undefined') {
			window.history.back();
		}
	}

	function handleTryAgain() {
		if (typeof window !== 'undefined') {
			window.location.reload();
		}
	}
</script>

<svelte:head>
	<title>Error {status} - MovieSavanna</title>
	<meta
		name="description"
		content="Oops! Something went wrong on MovieSavanna. We're working to fix it."
	/>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<!-- Background Effects -->
<div class="fixed inset-0 overflow-hidden bg-slate-950">
	<!-- Animated Background -->
	<div class="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>

	<!-- Floating Particles -->
	<div
		class="absolute top-20 left-20 h-96 w-96 animate-pulse rounded-full bg-blue-500/5 blur-3xl"
	></div>
	<div
		class="absolute right-20 bottom-20 h-96 w-96 animate-pulse rounded-full bg-yellow-500/5 blur-3xl"
		style="animation-delay: 2s;"
	></div>
	<div
		class="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-red-500/5 blur-3xl"
		style="animation-delay: 4s;"
	></div>

	<!-- Movie Reel Pattern -->
	<div class="absolute inset-0 opacity-5">
		<div class="absolute top-10 left-10 h-8 w-8 rounded-full border-2 border-white"></div>
		<div class="absolute top-32 right-20 h-6 w-6 rounded-full border-2 border-white"></div>
		<div class="absolute bottom-20 left-32 h-4 w-4 rounded-full border-2 border-white"></div>
		<div class="absolute right-10 bottom-32 h-10 w-10 rounded-full border-2 border-white"></div>
	</div>
</div>

<!-- Main Container -->
<div class="relative flex min-h-screen flex-col text-white">
	<!-- Header -->
	<header class="relative z-10 p-6 lg:p-8">
		<div class="flex items-center">
			<a href="/" class="group flex items-center transition-all duration-300 hover:scale-105">
				<!-- Movie Camera Icon -->
				<div
					class="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-yellow-500 shadow-lg"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 text-white"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 011 1v4a1 1 0 01-1 1h-1l-2 8H7l-2-8H4a1 1 0 01-1-1V5a1 1 0 011-1h3z"
						/>
						<circle cx="12" cy="11" r="3" />
					</svg>
				</div>
				<div class="flex flex-col">
					<span class="text-xl font-bold text-blue-400">Movie</span>
					<span class="-mt-1 text-xl font-bold text-yellow-400">Savanna</span>
				</div>
			</a>
		</div>
	</header>

	<!-- Main Content -->
	<main class="flex flex-1 items-center justify-center p-6 lg:p-8">
		<div class="mx-auto max-w-4xl text-center">
			<!-- Error Card -->
			<div
				class="transform rounded-3xl border border-slate-700/50 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-105 lg:p-12"
			>
				<!-- Error Icon/Animation -->
				<div class="mb-8">
					<div class="relative inline-block">
						<!-- Dynamic Error Icon based on status -->
						<div class="relative mx-auto mb-6 h-32 w-32">
							{#if errorType === 'not-found'}
								<!-- 404 Film Reel Icon -->
								<div
									class="flex h-full w-full animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 shadow-2xl"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-16 w-16 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</div>
							{:else if errorType === 'server-error'}
								<!-- 500 Server Error Icon -->
								<div
									class="flex h-full w-full animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-2xl"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-16 w-16 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
							{:else}
								<!-- Generic Error Icon -->
								<div
									class="flex h-full w-full animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-2xl"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-16 w-16 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
										/>
									</svg>
								</div>
							{/if}

							<!-- Floating dots around the icon -->
							<div
								class="absolute -top-2 -right-2 h-4 w-4 animate-ping rounded-full bg-blue-400"
							></div>
							<div
								class="absolute -bottom-2 -left-2 h-3 w-3 animate-ping rounded-full bg-yellow-400"
								style="animation-delay: 1s;"
							></div>
						</div>
					</div>
				</div>

				<!-- Error Code -->
				<div class="mb-6">
					<h1
						class="mb-4 bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400 bg-clip-text text-8xl leading-none font-black text-transparent lg:text-9xl"
					>
						{status}
					</h1>
					<div
						class="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-yellow-500"
					></div>
				</div>

				<!-- Error Message -->
				<div class="mb-8 space-y-4">
					<h2 class="mb-4 text-2xl font-bold text-white lg:text-3xl">
						{getErrorTitle(status)}
					</h2>
					<p class="mx-auto max-w-2xl text-lg leading-relaxed text-gray-300">
						{getErrorDescription(status)}
					</p>
					{#if message && message !== 'Something went wrong'}
						<p class="mx-auto max-w-xl text-sm text-gray-400 italic">
							"{message}"
						</p>
					{/if}
					<div
						class="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-2 h-4 w-4 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span class="text-sm text-gray-400">Don't worry, we're on it!</span>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="space-y-4 lg:flex lg:justify-center lg:space-y-0 lg:space-x-4">
					<!-- Primary Action -->
					<button
						onclick={handleGoHome}
						class="group inline-flex transform items-center rounded-xl bg-gradient-to-r from-blue-600 to-yellow-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-yellow-700 hover:shadow-xl"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							/>
						</svg>
						Back to Home
					</button>

					<!-- Secondary Actions -->
					<button
						onclick={handleGoBack}
						class="group inline-flex transform items-center rounded-xl border border-slate-600 bg-slate-800/50 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:border-slate-500 hover:bg-slate-700/50"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						Go Back
					</button>

					{#if errorType === 'server-error'}
						<button
							onclick={handleTryAgain}
							class="group inline-flex transform items-center rounded-xl border border-slate-600 bg-slate-800/50 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:border-slate-500 hover:bg-slate-700/50"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-5 w-5 transition-transform group-hover:rotate-180"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							Try Again
						</button>
					{/if}
				</div>

				<!-- Help Section -->
				<div class="mt-8 border-t border-slate-700/50 pt-6">
					<p class="mb-4 text-sm text-gray-400">Still having trouble? We're here to help!</p>
					<div class="flex flex-wrap justify-center gap-4 text-sm">
						<a
							href="/dashboard"
							class="flex items-center text-blue-400 transition-colors hover:text-blue-300"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-1 h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
								/>
							</svg>
							Dashboard
						</a>
						<span class="text-slate-600">•</span>
						<a
							href="/dashboard/favorites"
							class="flex items-center text-blue-400 transition-colors hover:text-blue-300"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-1 h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
								/>
							</svg>
							Favorites
						</a>
						<span class="text-slate-600">•</span>
						<a
							href="/"
							class="flex items-center text-blue-400 transition-colors hover:text-blue-300"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-1 h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Help
						</a>
					</div>
				</div>
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer class="relative z-10 p-6 lg:p-8">
		<div class="text-center">
			<p class="text-sm text-gray-400">&copy; 2024 MovieSavanna. All rights reserved.</p>
			<div class="mt-4 flex justify-center space-x-6 text-sm">
				<a href="/" class="text-gray-400 transition-colors hover:text-blue-400">Home</a>
				<a href="/dashboard" class="text-gray-400 transition-colors hover:text-blue-400"
					>Dashboard</a
				>
				<a href="/dashboard/favorites" class="text-gray-400 transition-colors hover:text-blue-400"
					>Favorites</a
				>
			</div>
		</div>
	</footer>
</div>

<style>
	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
		}
	}
</style>
