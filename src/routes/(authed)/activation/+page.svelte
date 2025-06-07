<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { activationSchema } from '$lib/schemas/schema';
	import { goto } from '$app/navigation';
	import { fly, fade, scale } from 'svelte/transition';
	import { onMount } from 'svelte';

	let { data } = $props();
	let mounted = $state(false);
	let autoActivating = $state(!!data.autoActivationCode && !data.activationResult);
	let showResendForm = $state(false);
	let resendLoading = $state(false);
	let resendMessage = $state('');
	let resendError = $state('');

	onMount(() => {
		mounted = true;
		window.scrollTo(0, 0);
		
		// If we have an auto-activation code and no result yet, show loading for a bit
		if (data.autoActivationCode && !data.activationResult) {
			autoActivating = true;
			// Show loading for at least 1.5 seconds for better UX
			setTimeout(() => {
				autoActivating = false;
			}, 1500);
		}
	});

	const form = superForm(data.form, {
		validators: zodClient(activationSchema),
		dataType: 'json',
		onUpdated({ form }) {
			console.log('Activation form updated:', form);
			autoActivating = false;
		}
	});

	const { form: formData, enhance, message, delayed, errors } = form;

	function handleBack() {
		goto('/login');
	}
	
	function proceedToLogin() {
		goto('/login');
	}

	async function handleResendActivation() {
		if (resendLoading) return;

		resendLoading = true;
		resendError = '';
		resendMessage = '';

		try {
			const response = await fetch('/activation', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					'/resend': ''
				})
			});

			const result = await response.json();

			if (result.success) {
				resendMessage = result.message || 'Activation email sent successfully!';
				showResendForm = false;
			} else {
				resendError = result.error || 'Failed to resend activation email.';
			}
		} catch (error) {
			resendError = 'Network error. Please try again.';
		} finally {
			resendLoading = false;
		}
	}	// Determine the current state for UI display
	const currentState = $derived.by(() => {
		// Show loading when auto-activating
		if (autoActivating) return 'auto-activating';
		
		// Check if we have a successful activation result (after loading is done)
		if (!autoActivating && data.activationResult?.success) return 'confirmed';
		
		// Check for errors
		if ($errors.code && $errors.code.length > 0) return 'error';
		
		// Check if we had an auto-activation attempt that failed
		if (data.autoActivationCode && data.activationResult && !data.activationResult.success) return 'error';
		
		return 'manual';
	});

	// Get the appropriate icon for the current state
	function getStateIcon(state: string) {
		switch (state) {
			case 'auto-activating':
				return '⏳';
			case 'confirmed':
				return '✅';
			case 'error':
				return '❌';
			default:
				return '📧';
		}
	}
</script>

<svelte:head>
	<title>{data.meta?.title || 'Account Activation - MovieSavanna'}</title>
	<meta
		name="description"
		content={data.meta?.description || 'Activate your MovieSavanna account'}
	/>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div
	class="relative flex min-h-screen overflow-hidden bg-slate-950"
	transition:fly|global={{ y: -200, duration: 300 }}
>
	<!-- Background Animation -->
	<div class="absolute inset-0 opacity-10">
		<div
			class="absolute top-20 left-20 h-72 w-72 animate-pulse rounded-full bg-blue-500 mix-blend-multiply blur-xl filter"
		></div>
		<div
			class="animation-delay-2000 absolute top-40 right-20 h-72 w-72 animate-pulse rounded-full bg-purple-500 mix-blend-multiply blur-xl filter"
		></div>
		<div
			class="animation-delay-4000 absolute bottom-20 left-40 h-72 w-72 animate-pulse rounded-full bg-cyan-500 mix-blend-multiply blur-xl filter"
		></div>
	</div>

	<!-- Main Content -->
	<div class="relative flex w-full flex-col" in:fade={{ duration: 300 }}>
		<!-- Back Button -->
		<div class="absolute top-8 left-8 z-10">
			<button
				onclick={handleBack}
				aria-label="Go back to login"
				class="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:border-blue-500 hover:text-blue-400"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Back to Login
			</button>
		</div>

		<!-- Activation Container -->
		<div class="flex flex-1 items-center justify-center p-8 pt-24">
			<div class="w-full max-w-md">
				{#if mounted}
					<div
						class="rounded-2xl border border-slate-700 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl"
						in:scale={{ duration: 300, delay: 100 }}
					>
						<!-- Status Header -->
						<div class="mb-8 text-center">
							<div class="mb-4 text-6xl" in:scale={{ duration: 500, delay: 200 }}>
								{getStateIcon(currentState)}
							</div>

							{#if currentState === 'auto-activating'}
								<h1
									class="mb-2 text-2xl font-bold text-white"
									in:fly={{ y: 20, duration: 300, delay: 300 }}
								>
									Verifying Your Email...
								</h1>
								<p class="mb-4 text-gray-400" in:fly={{ y: 20, duration: 300, delay: 400 }}>
									Please wait while we confirm your account activation.
								</p>
								<!-- Enhanced loading animation -->
								<div class="mt-6 flex flex-col items-center" in:fly={{ y: 20, duration: 300, delay: 500 }}>
									<!-- Spinner -->
									<div class="relative mb-4">
										<div class="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-blue-400"></div>
										<div class="absolute inset-0 h-12 w-12 animate-pulse rounded-full border-4 border-transparent border-t-blue-300/50"></div>
									</div>
									<!-- Progress dots -->
									<div class="flex space-x-2">
										<div class="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]"></div>
										<div class="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]"></div>
										<div class="h-2 w-2 animate-bounce rounded-full bg-blue-400"></div>
									</div>
									<p class="mt-3 text-xs text-gray-500 animate-pulse">This may take a few seconds...</p>
								</div>
							{:else if currentState === 'confirmed'}
								<h1
									class="mb-2 text-2xl font-bold text-emerald-400"
									in:fly={{ y: 20, duration: 300, delay: 300 }}
								>
									Email Verified Successfully!
								</h1>
								<p class="mb-6 text-gray-400" in:fly={{ y: 20, duration: 300, delay: 400 }}>
									{data.activationResult?.message || 'Your email has been confirmed and your account is now activated.'}
								</p>
								<button
									onclick={proceedToLogin}
									class="w-full transform rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-emerald-700"
									in:fly={{ y: 20, duration: 300, delay: 500 }}
								>
									<div class="flex items-center justify-center gap-2">
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
											/>
										</svg>
										Continue to Login
									</div>
								</button>
							{:else if currentState === 'error'}
								<h1
									class="mb-2 text-2xl font-bold text-red-400"
									in:fly={{ y: 20, duration: 300, delay: 300 }}
								>
									Activation Failed
								</h1>
								<p class="mb-6 text-gray-400" in:fly={{ y: 20, duration: 300, delay: 400 }}>
									{$errors.code?.[0] || 'There was an issue activating your account.'}
								</p>
							{:else}
								<h1
									class="mb-2 text-2xl font-bold text-white"
									in:fly={{ y: 20, duration: 300, delay: 300 }}
								>
									Activate Your Account
								</h1>
								<p class="mb-6 text-gray-400" in:fly={{ y: 20, duration: 300, delay: 400 }}>
									{data.message || 'Enter your activation code to verify your account.'}
								</p>
							{/if}
						</div>

						<!-- Manual Activation Form -->
						{#if currentState === 'manual' || currentState === 'error'}
							<form
								method="POST"
								action="?/activate"
								use:enhance
								in:fly={{ y: 20, duration: 300, delay: 500 }}
							>
								<div class="space-y-4">
									<div>
										<label for="code" class="mb-2 block text-sm font-medium text-gray-300">
											Activation Code
										</label>
										<input
											id="code"
											name="code"
											type="text"
											bind:value={$formData.code}
											placeholder="Enter your activation code"
											class="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
											class:border-red-500={$errors.code}
											class:focus:border-red-500={$errors.code}
										/>
										{#if $errors.code}
											<p class="mt-2 text-sm text-red-400" in:fly={{ y: 10, duration: 200 }}>
												{$errors.code[0]}
											</p>
										{/if}
									</div>

									<button
										type="submit"
										disabled={$delayed}
										class="w-full transform rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
									>
										{#if $delayed}
											<div class="flex items-center justify-center gap-2">
												<div
													class="h-4 w-4 animate-spin rounded-full border-b-2 border-white"
												></div>
												Activating...
											</div>
										{:else}
											Activate Account
										{/if}
									</button>
								</div>
							</form>

							<!-- Resend Activation Section -->
							<div
								class="mt-8 border-t border-slate-700 pt-6"
								in:fly={{ y: 20, duration: 300, delay: 600 }}
							>
								{#if !showResendForm}
									<div class="text-center">
										<p class="mb-3 text-sm text-gray-400">Didn't receive the activation email?</p>
										<button
											onclick={() => (showResendForm = true)}
											class="text-sm text-blue-400 underline transition-colors hover:text-blue-300"
										>
											Resend activation email
										</button>
									</div>
								{:else}
									<div class="space-y-4">
										<p class="text-center text-sm text-gray-400">
											We'll send a new activation email to your registered email address.
										</p>

										{#if resendMessage}
											<div
												class="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3"
												in:scale={{ duration: 200 }}
											>
												<p class="text-center text-sm text-emerald-400">{resendMessage}</p>
											</div>
										{/if}

										{#if resendError}
											<div
												class="rounded-lg border border-red-500/20 bg-red-500/10 p-3"
												in:scale={{ duration: 200 }}
											>
												<p class="text-center text-sm text-red-400">{resendError}</p>
											</div>
										{/if}

										<div class="flex gap-2">
											<button
												onclick={() => (showResendForm = false)}
												class="flex-1 rounded-lg border border-slate-600 px-4 py-2 text-sm text-gray-400 transition-all duration-300 hover:border-slate-500 hover:text-gray-300"
											>
												Cancel
											</button>
											<button
												onclick={handleResendActivation}
												disabled={resendLoading}
												class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 disabled:opacity-50"
											>
												{#if resendLoading}
													<div class="flex items-center justify-center gap-2">
														<div
															class="h-3 w-3 animate-spin rounded-full border-b-2 border-white"
														></div>
														Sending...
													</div>
												{:else}
													Resend Email
												{/if}
											</button>
										</div>
									</div>
								{/if}
							</div>
						{/if}

						<!-- Help Section -->
						<div
							class="mt-8 border-t border-slate-700 pt-6 text-center"
							in:fly={{ y: 20, duration: 300, delay: 700 }}
						>
							<p class="mb-2 text-sm text-gray-400">Need help with activation?</p>
							<div class="flex justify-center space-x-4 text-sm">
								<a href="/help" class="text-blue-400 transition-colors hover:text-blue-300">
									Help Center
								</a>
								<span class="text-gray-600">•</span>
								<a href="/contact" class="text-blue-400 transition-colors hover:text-blue-300">
									Contact Support
								</a>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Footer -->
		<footer class="p-8 text-center text-sm text-gray-500">
			<p>&copy; 2024 MovieSavanna. All rights reserved.</p>
			<div class="mt-2 flex justify-center space-x-4">
				<a href="/terms" class="text-blue-400 transition-colors hover:text-blue-300">Terms</a>
				<span>•</span>
				<a href="/privacy" class="text-blue-400 transition-colors hover:text-blue-300">Privacy</a>
				<span>•</span>
				<a href="/help" class="text-blue-400 transition-colors hover:text-blue-300">Help</a>
			</div>
		</footer>
	</div>
</div>

<style>
	.animation-delay-2000 {
		animation-delay: 2s;
	}
	.animation-delay-4000 {
		animation-delay: 4s;
	}
</style>
