<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signupSchema } from '$lib/schemas/schema';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fly, fade } from 'svelte/transition';

	let { data } = $props();
	let redirectionPage = $page.url.searchParams.get('redirectTo') ?? '/login';
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(signupSchema),
		dataType: 'json',
		onUpdated({ form }) {
			//('Signup form updated:', form);

			if (form.message?.success) {
				if (form.message.message === 'verification_required') {
					const verificationMessage =
						"Welcome aboard! 🎉 We've sent a verification email to your inbox. Please check your email to activate your account.";
					goto(
						`/verify-email?email=${encodeURIComponent(form.message.data?.email || '')}&message=${encodeURIComponent(verificationMessage)}`
					);
				} else {
					// Direct signup success (no email verification required)
					const welcomeMessage = `${form.message.message} Get ready to discover amazing movies!`;
					goto(redirectionPage);
				}
			} else {
				console.log('Signup Error:', form.message?.message);
			}
		}
	});

	const { form: formData, enhance, message, delayed, errors } = form;

	// Password strength checker
	function checkPasswordStrength(password: string) {
		const checks = {
			length: password.length >= 8,
			lowercase: /[a-z]/.test(password),
			uppercase: /[A-Z]/.test(password),
			number: /\d/.test(password)
		};

		const score = Object.values(checks).filter(Boolean).length;
		return { score, checks };
	}

	// Reactive password strength checking
	let passwordStrength = $derived(
		$formData.password
			? checkPasswordStrength($formData.password)
			: { score: 0, checks: { length: false, lowercase: false, uppercase: false, number: false } }
	);

	function handleBack() {
		goto('/');
	}

	// OAuth Social Signup Function - Temporarily Disabled
	// TODO: Re-enable when OAuth providers are configured
	/*
	function handleSocialSignup(provider: string) {
		// TODO: Implement social signup logic
	}
	*/

	function getPasswordStrengthColor(score: number) {
		if (score === 0) return 'bg-gray-600';
		if (score <= 1) return 'bg-red-500';
		if (score <= 2) return 'bg-orange-500';
		if (score <= 3) return 'bg-yellow-500';
		return 'bg-green-500';
	}

	function getPasswordStrengthText(score: number) {
		if (score === 0) return 'Enter password';
		if (score <= 1) return 'Weak';
		if (score <= 2) return 'Fair';
		if (score <= 3) return 'Good';
		return 'Strong';
	}
</script>

<svelte:head>
	<title>Join MovieSavanna - Create Your Account</title>
	<meta
		name="description"
		content="Join MovieSavanna today and get unlimited access to thousands of movies and TV shows in stunning 4K quality."
	/>
</svelte:head>

<div
	class="relative flex min-h-screen overflow-hidden bg-slate-950"
	transition:fly|global={{ y: -200, duration: 300 }}
>
	<!-- Background Animation -->
	<div class="absolute inset-0 opacity-10">
		<div
			class="absolute top-20 left-20 h-72 w-72 animate-pulse rounded-full bg-emerald-500 mix-blend-multiply blur-xl filter"
		></div>
		<div
			class="animation-delay-2000 absolute top-40 right-20 h-72 w-72 animate-pulse rounded-full bg-cyan-500 mix-blend-multiply blur-xl filter"
		></div>
		<div
			class="animation-delay-4000 absolute bottom-20 left-40 h-72 w-72 animate-pulse rounded-full bg-indigo-500 mix-blend-multiply blur-xl filter"
		></div>
	</div>

	<!-- Left Panel - Hero Section -->
	<div class="relative hidden overflow-hidden lg:flex lg:w-1/2">
		<div class="absolute inset-0">
			<img
				src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1600"
				alt="Join MovieSavanna community"
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
						Join the
						<span
							class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
						>
							Movie Revolution
						</span>
					</h2>
					<p class="mb-8 text-xl leading-relaxed text-gray-300">
						Become part of the MovieSavanna family and unlock unlimited entertainment. Create your
						account in seconds and start your cinematic journey today.
					</p>
				</div>

				<!-- Features Grid -->
				<div class="grid grid-cols-1 gap-6">
					<div
						class="flex items-center gap-4 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
					>
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-emerald-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div>
							<h3 class="font-semibold text-white">Instant Access</h3>
							<p class="text-sm text-gray-300">Start watching immediately after signup</p>
						</div>
					</div>

					<div
						class="flex items-center gap-4 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
					>
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-cyan-400"
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
						</div>
						<div>
							<h3 class="font-semibold text-white">Personalized Experience</h3>
							<p class="text-sm text-gray-300">AI-powered recommendations just for you</p>
						</div>
					</div>

					<div
						class="flex items-center gap-4 rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
					>
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-indigo-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
								/>
							</svg>
						</div>
						<div>
							<h3 class="font-semibold text-white">Secure & Private</h3>
							<p class="text-sm text-gray-300">Your data is protected with enterprise security</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Right Panel - Signup Form -->
	<div class="relative flex w-full flex-col lg:w-1/2" in:fade={{ duration: 300 }}>
		<!-- Back Button -->
		<div class="absolute top-8 left-8 z-10">
			<button
				onclick={handleBack}
				aria-label="Go back to home page"
				class="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-gray-400 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500 hover:text-emerald-400"
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

		<!-- Signup Form Container -->
		<div class="flex flex-1 items-center justify-center p-8 pt-24">
			<div class="w-full max-w-md">
				<!-- Signup Card -->
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
								class="mr-1 text-3xl font-bold text-emerald-500 transition-colors group-hover:text-emerald-400"
								>Movie</span
							>
							<span
								class="text-3xl font-bold text-white transition-colors group-hover:text-gray-200"
								>Savanna</span
							>
						</a>

						<h1 class="mb-2 text-3xl font-bold text-white">Create Your Account</h1>
						<p class="text-gray-400">Join thousands of movie enthusiasts today</p>
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

					<!-- Signup Form -->
					<form method="POST" use:enhance class="space-y-6">
						<!-- Name Fields Row -->
						<div class="grid grid-cols-2 gap-4">
							<!-- First Name -->
							<div class="space-y-2">
								<label for="firstName" class="block text-sm font-medium text-gray-300">
									First Name
								</label>
								<input
									type="text"
									id="firstName"
									name="firstName"
									bind:value={$formData.firstName}
									placeholder="John"
									class="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none"
									class:border-red-500={$errors.firstName}
									class:focus:ring-red-500={$errors.firstName}
								/>
								{#if $errors.firstName}
									<p class="text-sm text-red-400" transition:fade>{$errors.firstName}</p>
								{/if}
							</div>

							<!-- Last Name -->
							<div class="space-y-2">
								<label for="lastName" class="block text-sm font-medium text-gray-300">
									Last Name
								</label>
								<input
									type="text"
									id="lastName"
									name="lastName"
									bind:value={$formData.lastName}
									placeholder="Doe"
									class="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none"
									class:border-red-500={$errors.lastName}
									class:focus:ring-red-500={$errors.lastName}
								/>
								{#if $errors.lastName}
									<p class="text-sm text-red-400" transition:fade>{$errors.lastName}</p>
								{/if}
							</div>
						</div>

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
									placeholder="john.doe@example.com"
									class="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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

						<!-- Phone Field (Optional) -->
						<div class="space-y-2">
							<label for="phone" class="block text-sm font-medium text-gray-300">
								Phone Number <span class="text-xs text-gray-500">(Optional)</span>
							</label>
							<div class="relative">
								<input
									type="tel"
									id="phone"
									name="phone"
									bind:value={$formData.phone}
									placeholder="+1 (555) 123-4567"
									class="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none"
									class:border-red-500={$errors.phone}
									class:focus:ring-red-500={$errors.phone}
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
											d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
										/>
									</svg>
								</div>
							</div>
							{#if $errors.phone}
								<p class="text-sm text-red-400" transition:fade>{$errors.phone}</p>
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
									placeholder="Create a strong password"
									class="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 pr-12 text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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

							<!-- Password Strength Indicator -->
							{#if $formData.password}
								<div class="space-y-2" transition:fade>
									<div class="flex items-center gap-2">
										<div class="h-2 flex-1 overflow-hidden rounded-full bg-gray-700">
											<div
												class="h-full transition-all duration-300 {getPasswordStrengthColor(
													passwordStrength.score
												)}"
												style="width: {(passwordStrength.score / 4) * 100}%"
											></div>
										</div>
										<span class="text-xs text-gray-400"
											>{getPasswordStrengthText(passwordStrength.score)}</span
										>
									</div>

									<div class="grid grid-cols-2 gap-2 text-xs">
										<div
											class="flex items-center gap-1 {passwordStrength.checks.length
												? 'text-green-400'
												: 'text-gray-500'}"
										>
											<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clip-rule="evenodd"
												/>
											</svg>
											8+ characters
										</div>
										<div
											class="flex items-center gap-1 {passwordStrength.checks.uppercase
												? 'text-green-400'
												: 'text-gray-500'}"
										>
											<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clip-rule="evenodd"
												/>
											</svg>
											Uppercase
										</div>
										<div
											class="flex items-center gap-1 {passwordStrength.checks.lowercase
												? 'text-green-400'
												: 'text-gray-500'}"
										>
											<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clip-rule="evenodd"
												/>
											</svg>
											Lowercase
										</div>
										<div
											class="flex items-center gap-1 {passwordStrength.checks.number
												? 'text-green-400'
												: 'text-gray-500'}"
										>
											<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clip-rule="evenodd"
												/>
											</svg>
											Number
										</div>
									</div>
								</div>
							{/if}

							{#if $errors.password}
								<p class="text-sm text-red-400" transition:fade>{$errors.password}</p>
							{/if}
						</div>

						<!-- Confirm Password Field -->
						<div class="space-y-2">
							<label for="confirmPassword" class="block text-sm font-medium text-gray-300">
								Confirm Password
							</label>
							<div class="relative">
								<input
									type={showConfirmPassword ? 'text' : 'password'}
									id="confirmPassword"
									name="confirmPassword"
									bind:value={$formData.confirmPassword}
									placeholder="Confirm your password"
									class="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-3 pr-12 text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none"
									class:border-red-500={$errors.confirmPassword}
									class:focus:ring-red-500={$errors.confirmPassword}
								/>
								<button
									type="button"
									onclick={() => (showConfirmPassword = !showConfirmPassword)}
									aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
									class="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 transition-colors hover:text-gray-300"
								>
									{#if showConfirmPassword}
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
							{#if $errors.confirmPassword}
								<p class="text-sm text-red-400" transition:fade>{$errors.confirmPassword}</p>
							{/if}
						</div>

						<!-- Terms and Conditions -->
						<div class="space-y-4">
							<div class="flex items-start">
								<div class="flex h-5 items-center">
									<input
										type="checkbox"
										id="termsAccepted"
										name="termsAccepted"
										bind:checked={$formData.termsAccepted}
										class="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
										class:border-red-500={$errors.termsAccepted}
									/>
								</div>
								<label for="termsAccepted" class="ml-3 text-sm text-gray-300">
									I agree to the
									<a href="/terms" class="text-emerald-400 transition-colors hover:text-emerald-300"
										>Terms of Service</a
									>
									and
									<a
										href="/privacy"
										class="text-emerald-400 transition-colors hover:text-emerald-300"
										>Privacy Policy</a
									>
								</label>
							</div>
							{#if $errors.termsAccepted}
								<p class="text-sm text-red-400" transition:fade>{$errors.termsAccepted}</p>
							{/if}
						</div>

						<!-- Submit Button -->
						<button
							type="submit"
							disabled={$delayed}
							class="w-full transform rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-emerald-700 hover:to-cyan-700 disabled:transform-none disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700 disabled:shadow-none"
						>
							{#if $delayed}
								<div class="flex items-center justify-center">
									<div
										class="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
									></div>
									Creating your account...
								</div>
							{:else}
								<span class="flex items-center justify-center gap-2">
									Create Account
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

					<!-- OAuth Signup Section - Temporarily Disabled -->
					<!-- TODO: Re-enable when OAuth providers are configured -->

					<!-- Login Link -->
					<p class="text-center text-gray-400">
						Already have an account?
						<a
							href="/login"
							class="font-medium text-emerald-400 transition-colors hover:text-emerald-300"
						>
							Sign in here
						</a>
					</p>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<footer class="p-8 text-center text-sm text-gray-500">
			<p>&copy; 2024 MovieSavanna. All rights reserved.</p>
			<div class="mt-2 flex justify-center space-x-4">
				<a href="/terms" class="text-emerald-400 transition-colors hover:text-emerald-300">Terms</a>
				<span>•</span>
				<a href="/privacy" class="text-emerald-400 transition-colors hover:text-emerald-300"
					>Privacy</a
				>
				<span>•</span>
				<a href="/help" class="text-emerald-400 transition-colors hover:text-emerald-300">Help</a>
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
