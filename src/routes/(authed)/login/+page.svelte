<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { enhancedLoginSchema } from '$lib/schemas/schema';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fly, fade } from 'svelte/transition';

	let { data } = $props();
	let redirectionPage = $page.url.searchParams.get('redirectTo') ?? '/dashboard';
	let showPassword = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(enhancedLoginSchema),
		dataType: 'json',
		onUpdated({ form }) {
			// The message is accessed via $message, not form.message
			if (form.message.success) {
				if (form.message.success) {
					let name = `${$message.data.first_name} ${$message.data.last_name}`;
					let welcomeMessage = `${$message.message} Welcome back, ${name}!`;
					goto(redirectionPage);
				} else if (!form.message.success && form.message.message === 'activation_required') {
					const activationMessage =
						'Oops! Looks like your account needs a little magic to get started. Activate it now to unlock all the awesomeness!';
					goto(`/activation?message=${encodeURIComponent(activationMessage)}`);
				} else if (!form.message.success && form.message.message === 'mfa_required') {
					const email = $message?.email || '';
					const token = $message?.token || '';
					goto(`/login/verify?token=${token}&email=${email}&redirectTo=${redirectionPage}`);
				}
			}
		}
	});

	const { form: formData, enhance, message, delayed, errors } = form;

	function handleBack() {
		goto('/');
	}

	// OAuth Social Login Function - Temporarily Disabled
	// TODO: Re-enable when OAuth providers are configured
	/*
	function handleSocialLogin(provider: string) {
		// Implement social login logic
	}
	*/
</script>

<svelte:head>
	<title>Sign In - MovieSavanna</title>
	<meta
		name="description"
		content="Sign in to your MovieSavanna account to access unlimited movies and TV shows."
	/>
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
			class="animation-delay-4000 absolute bottom-20 left-40 h-72 w-72 animate-pulse rounded-full bg-pink-500 mix-blend-multiply blur-xl filter"
		></div>
	</div>

	<!-- Left Panel - Hero Section -->
	<div class="relative hidden overflow-hidden lg:flex lg:w-1/2">
		<div class="absolute inset-0">
			<img
				src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1600"
				alt="Cinema experience"
				class="h-full w-full object-cover"
			/>
			<div
				class="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/70 to-slate-950/90"
			></div>
		</div>

		<!-- Hero Content -->
		<div class="relative z-10 flex flex-col justify-center p-12 text-white">
			<div class="space-y-8">
				<div>
					<h2 class="mb-6 text-5xl leading-tight font-bold">
						Welcome to Your
						<span
							class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
						>
							Movie Savanna
						</span>
					</h2>
					<p class="mb-8 text-xl leading-relaxed text-gray-300">
						Stream unlimited movies and TV shows in stunning 4K quality. Your entertainment journey
						continues here with personalized recommendations just for you.
					</p>
				</div>

				<!-- Features Grid -->
				<div class="grid grid-cols-1 gap-6">
					<div
						class="flex items-center gap-4 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
					>
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-blue-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<div>
							<h3 class="font-semibold text-white">Unlimited Streaming</h3>
							<p class="text-sm text-gray-300">Access thousands of movies and shows</p>
						</div>
					</div>

					<div
						class="flex items-center gap-4 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
					>
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-purple-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<div>
							<h3 class="font-semibold text-white">4K Ultra HD</h3>
							<p class="text-sm text-gray-300">Crystal clear quality on any device</p>
						</div>
					</div>

					<div
						class="flex items-center gap-4 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
					>
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-green-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
						</div>
						<div>
							<h3 class="font-semibold text-white">Offline Downloads</h3>
							<p class="text-sm text-gray-300">Watch anywhere, even without internet</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Right Panel - Login Form -->
	<div class="relative flex w-full flex-col lg:w-1/2" in:fade={{ duration: 300 }}>
		<!-- Back Button -->
		<div class="absolute top-8 left-8 z-10">
			<button
				onclick={handleBack}
				aria-label="Go back to home page"
				class="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:border-blue-500 hover:text-blue-400"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
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
				Back to Home
			</button>
		</div>

		<!-- Login Form Container -->
		<div class="flex flex-1 items-center justify-center p-8 pt-24">
			<div class="w-full max-w-md">
				<!-- Login Card -->
				<div
					class="rounded-2xl border border-slate-700 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl"
				>
					<!-- Header -->
					<div class="mb-8 text-center">
						<a
							href="/"
							aria-label="MovieSavanna home page"
							class="group mb-6 inline-flex items-center"
						>
							<span
								class="mr-1 text-3xl font-bold text-blue-500 transition-colors group-hover:text-blue-400"
								>Movie</span
							>
							<span
								class="text-3xl font-bold text-white transition-colors group-hover:text-gray-200"
								>Savanna</span
							>
						</a>

						<h1 class="mb-2 text-3xl font-bold text-white">Welcome Back!</h1>
						<p class="text-gray-400">Sign in to continue your movie journey</p>
					</div>

					<!-- Error Message Display -->
					{#if $message && !$message.success}
						<div class="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4" transition:fade>
							<div class="flex items-center gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 text-red-400"
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
								<span class="text-sm text-red-400">{$message.message}</span>
							</div>
						</div>
					{/if}

					<!-- Login Form -->
					<form method="POST" use:enhance class="space-y-6">
						<!-- Email Field -->
						<div class="space-y-2">
							<label for="email" class="block text-sm font-medium text-gray-300">
								Email Address
							</label>
							<div class="relative">
								<input
									type="email"
									id="email"
									name="email"
									bind:value={$formData.email}
									placeholder="your.email@example.com"
									class="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
									class:border-red-500={$errors.email}
									class:focus:ring-red-500={$errors.email}
								/>
								<div class="absolute top-1/2 right-3 -translate-y-1/2 transform">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 text-gray-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
										/>
									</svg>
								</div>
							</div>
							{#if $errors.email}
								<p class="text-sm text-red-400" transition:fade>{$errors.email}</p>
							{/if}
						</div>

						<!-- Password Field -->
						<div class="space-y-2">
							<label for="password" class="block text-sm font-medium text-gray-300">
								Password
							</label>
							<div class="relative">
								<input
									type={showPassword ? 'text' : 'password'}
									id="password"
									name="password"
									bind:value={$formData.password}
									placeholder="Enter your password"
									class="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 pr-12 text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
									class:border-red-500={$errors.password}
									class:focus:ring-red-500={$errors.password}
								/>
								<button
									type="button"
									onclick={() => (showPassword = !showPassword)}
									aria-label={showPassword ? 'Hide password' : 'Show password'}
									class="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 transition-colors hover:text-gray-300"
								>
									{#if showPassword}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
											/>
										</svg>
									{:else}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										</svg>
									{/if}
								</button>
							</div>
							{#if $errors.password}
								<p class="text-sm text-red-400" transition:fade>{$errors.password}</p>
							{/if}
						</div>

						<!-- Remember Me & Forgot Password -->
						<div class="flex items-center justify-between">
							<div class="flex items-center">
								<input
									type="checkbox"
									id="rememberMe"
									name="rememberMe"
									bind:checked={$formData.rememberMe}
									class="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
								/>
								<label for="rememberMe" class="ml-2 text-sm text-gray-300"> Remember me </label>
							</div>
							<a
								href="/forgot-password"
								class="text-sm text-blue-400 transition-colors hover:text-blue-300"
							>
								Forgot password?
							</a>
						</div>

						<!-- Submit Button -->
						<button
							type="submit"
							disabled={$delayed}
							class="w-full transform rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 disabled:transform-none disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700 disabled:shadow-none"
						>
							{#if $delayed}
								<div class="flex items-center justify-center">
									<div
										class="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
									></div>
									Signing you in...
								</div>
							{:else}
								<span class="flex items-center justify-center gap-2">
									Sign In
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M14 5l7 7m0 0l-7 7m7-7H3"
										/>
									</svg>
								</span>
							{/if}
						</button>
					</form>

					<!-- OAuth Login Section - Temporarily Disabled -->
					<!-- TODO: Re-enable when OAuth providers are configured -->

					<!-- Sign Up Link -->
					<p class="text-center text-gray-400">
						Don't have an account?
						<a
							href="/signup"
							class="font-medium text-blue-400 transition-colors hover:text-blue-300"
						>
							Create one now
						</a>
					</p>
				</div>
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
