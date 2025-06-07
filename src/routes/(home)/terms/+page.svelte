<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	// Terms of service sections data
	const termsSections = [
		{
			id: 'acceptance-terms',
			title: 'Acceptance of Terms',
			icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
			content: `
				<h4 class="text-lg font-semibold text-white mb-3">Agreement to Terms</h4>
				<p class="text-gray-300 mb-4">By accessing and using MovieSavanna, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Updates to Terms</h4>
				<p class="text-gray-300 mb-4">MovieSavanna reserves the right to update these Terms of Service at any time without prior notice. Users will be notified of significant changes via email or through the platform. Continued use of the service after changes constitutes acceptance of the new terms.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Effective Date</h4>
				<p class="text-gray-300">These terms are effective as of January 1, 2024, and remain in effect until modified or terminated by MovieSavanna.</p>
			`
		},
		{
			id: 'service-description',
			title: 'Service Description',
			icon: 'M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h3zM9 4h6V2H9v2zm8 13V9H7v8h10z',
			content: `
				<h4 class="text-lg font-semibold text-white mb-3">Platform Overview</h4>
				<p class="text-gray-300 mb-4">MovieSavanna is a comprehensive movie discovery and streaming platform that provides users with personalized recommendations, watchlists, reviews, and access to a vast library of films and TV shows from various genres and eras.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Service Features</h4>
				<p class="text-gray-300 mb-4">Our service includes movie browsing, personalized recommendations, user reviews and ratings, watchlist management, streaming capabilities, social features, and mobile/web access across multiple devices.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Service Availability</h4>
				<p class="text-gray-300">While we strive for 24/7 availability, MovieSavanna may be temporarily unavailable due to maintenance, technical issues, or circumstances beyond our control. We will provide advance notice when possible.</p>
			`
		},
		{
			id: 'user-accounts',
			title: 'User Accounts & Registration',
			icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
			content: `
				<h4 class="text-lg font-semibold text-white mb-3">Account Creation</h4>
				<p class="text-gray-300 mb-4">To access premium features, you must create an account by providing accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Account Security</h4>
				<p class="text-gray-300 mb-4">You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use of your account or any security breaches. Use strong passwords and enable two-factor authentication when available.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Account Termination</h4>
				<p class="text-gray-300">We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose security risks to our platform or other users.</p>
			`
		},
		{
			id: 'acceptable-use',
			title: 'Acceptable Use Policy',
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			content: `
				<h4 class="text-lg font-semibold text-white mb-3">Permitted Use</h4>
				<p class="text-gray-300 mb-4">MovieSavanna is for personal, non-commercial use. You may stream content, create watchlists, write reviews, and engage with other users in accordance with community guidelines and applicable laws.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Prohibited Activities</h4>
				<p class="text-gray-300 mb-4">You may not: share account credentials, attempt to circumvent security measures, distribute pirated content, engage in harassment or hate speech, use automated tools to scrape data, or violate intellectual property rights.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Content Guidelines</h4>
				<p class="text-gray-300">User-generated content (reviews, comments) must be respectful, honest, and relevant. We reserve the right to remove content that violates our community standards or these terms.</p>
			`
		},
		{
			id: 'intellectual-property',
			title: 'Intellectual Property Rights',
			icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
			content: `
				<h4 class="text-lg font-semibold text-white mb-3">Platform Content</h4>
				<p class="text-gray-300 mb-4">All content provided on MovieSavanna, including movies, TV shows, images, text, graphics, logos, and software, is protected by copyright, trademark, and other intellectual property laws.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Licensed Content</h4>
				<p class="text-gray-300 mb-4">We license content from various studios and distributors. Your access is limited to personal viewing and is subject to the licensing agreements we have in place. Content availability may vary by region and time.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">User Content</h4>
				<p class="text-gray-300">By submitting reviews, ratings, or other content, you grant MovieSavanna a non-exclusive, royalty-free license to use, modify, and display your content in connection with our service.</p>
			`
		},
		{
			id: 'payment-subscription',
			title: 'Payment & Subscription Terms',
			icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
			content: `
				<h4 class="text-lg font-semibold text-white mb-3">Subscription Plans</h4>
				<p class="text-gray-300 mb-4">MovieSavanna offers various subscription tiers with different features and pricing. All prices are clearly displayed and include applicable taxes. Free accounts have limited access to content and features.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Billing & Renewals</h4>
				<p class="text-gray-300 mb-4">Subscriptions automatically renew unless cancelled before the next billing cycle. We will charge your payment method on file. You're responsible for maintaining valid payment information.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Cancellation & Refunds</h4>
				<p class="text-gray-300">You may cancel your subscription at any time through account settings. Cancellations take effect at the end of the current billing period. Refunds are generally not provided for partial months, except as required by law.</p>
			`
		},
		{
			id: 'privacy-data',
			title: 'Privacy & Data Protection',
			icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
			content: `
				<h4 class="text-lg font-semibold text-white mb-3">Privacy Commitment</h4>
				<p class="text-gray-300 mb-4">Your privacy is important to us. Our data collection, use, and protection practices are detailed in our Privacy Policy, which is incorporated into these terms by reference.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Data Usage</h4>
				<p class="text-gray-300 mb-4">We collect and use data to provide personalized recommendations, improve our service, and enhance user experience. You can control many privacy settings through your account preferences.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Third-Party Integration</h4>
				<p class="text-gray-300">Some features may integrate with third-party services. These integrations are subject to the privacy policies and terms of those third-party providers.</p>
			`
		},
		{
			id: 'disclaimers-limitations',
			title: 'Disclaimers & Limitations',
			icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
			content: `
				<h4 class="text-lg font-semibold text-white mb-3">Service Disclaimer</h4>
				<p class="text-gray-300 mb-4">MovieSavanna is provided "as is" without warranties of any kind. We do not guarantee uninterrupted service, error-free operation, or that the service will meet your specific requirements.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Content Accuracy</h4>
				<p class="text-gray-300 mb-4">While we strive for accuracy, we cannot guarantee that all movie information, ratings, or descriptions are completely accurate or up-to-date. User reviews and ratings reflect individual opinions.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Limitation of Liability</h4>
				<p class="text-gray-300">MovieSavanna's liability is limited to the maximum extent permitted by law. We are not liable for indirect, incidental, or consequential damages arising from your use of the service.</p>
			`
		}
	];

	function scrollToSection(sectionId: string) {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<svelte:head>
	<title>Terms of Service - MovieSavanna</title>
	<meta
		name="description"
		content="Read MovieSavanna's Terms of Service to understand your rights and responsibilities when using our movie streaming and discovery platform."
	/>
</svelte:head>

<!-- Background -->
<div class="min-h-screen bg-slate-950">
	<!-- Hero Section -->
	<section
		class="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-24 pb-16"
	>
		<!-- Background Animation -->
		<div class="absolute inset-0 opacity-20">
			<div
				class="absolute top-20 left-20 h-72 w-72 animate-pulse rounded-full bg-emerald-500 mix-blend-multiply blur-xl filter"
			></div>
			<div
				class="absolute right-20 bottom-20 h-96 w-96 animate-pulse rounded-full bg-blue-500 mix-blend-multiply blur-xl filter"
				style="animation-delay: 2s"
			></div>
			<div
				class="absolute left-1/2 top-1/2 h-80 w-80 animate-pulse rounded-full bg-purple-500 mix-blend-multiply blur-xl filter"
				style="animation-delay: 4s"
			></div>
		</div>

		<div class="relative z-10 container mx-auto px-4 py-16">
			{#if mounted}
				<div class="mx-auto max-w-4xl text-center" in:fade={{ duration: 800, delay: 200 }}>
					<!-- Terms Icon -->
					<div
						class="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600/20 to-blue-600/20 backdrop-blur-sm"
						in:fly={{ y: -30, duration: 600, delay: 400 }}
					>
						<svg
							class="h-10 w-10 text-emerald-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>

					<!-- Title -->
					<h1
						class="mb-6 text-5xl font-bold text-white md:text-6xl"
						in:fly={{ y: 30, duration: 600, delay: 600 }}
					>
						Terms of <span class="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Service</span>
					</h1>

					<!-- Subtitle -->
					<p
						class="mx-auto mb-8 max-w-2xl text-xl text-gray-300"
						in:fly={{ y: 30, duration: 600, delay: 800 }}
					>
						Understanding your rights and responsibilities when using MovieSavanna. Please read these terms carefully before using our service.
					</p>

					<!-- Last Updated -->
					<div
						class="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-600/10 px-4 py-2 text-sm text-emerald-300"
						in:fly={{ y: 30, duration: 600, delay: 1000 }}
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						Last updated: January 1, 2024
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- Main Content -->
	<section class="relative py-16">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-6xl">
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
					<!-- Table of Contents (Sticky Sidebar) -->
					<div class="lg:col-span-1">
						<div class="sticky top-8">
							{#if mounted}
								<div
									class="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-sm"
									in:fly={{ x: -30, duration: 600, delay: 1200 }}
								>
									<h3 class="mb-4 text-lg font-semibold text-white">Table of Contents</h3>
									<nav class="space-y-2">
										{#each termsSections as section, index}
											<button
												onclick={() => scrollToSection(section.id)}
												class="flex w-full items-center gap-3 rounded-lg p-3 text-left text-sm text-gray-300 transition-all duration-200 hover:bg-slate-700/50 hover:text-white"
												in:fly={{ x: -20, duration: 400, delay: 1400 + index * 100 }}
											>
												<svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={section.icon} />
												</svg>
												<span class="truncate">{section.title}</span>
											</button>
										{/each}
									</nav>
								</div>
							{/if}
						</div>
					</div>

					<!-- Terms Sections -->
					<div class="lg:col-span-3">
						<div class="space-y-8">
							{#if mounted}
								{#each termsSections as section, index}
									<div
										id={section.id}
										class="rounded-xl border border-slate-700/50 bg-slate-800/30 p-8 backdrop-blur-sm"
										in:fly={{ y: 50, duration: 600, delay: 1400 + index * 200 }}
									>
										<!-- Section Header -->
										<div class="mb-6 flex items-center gap-4">
											<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600/20 to-blue-600/20">
												<svg class="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={section.icon} />
												</svg>
											</div>
											<h2 class="text-2xl font-bold text-white">{section.title}</h2>
										</div>

										<!-- Section Content -->
										<div class="prose prose-invert max-w-none">
											{@html section.content}
										</div>
									</div>
								{/each}
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Contact Section -->
	<section class="border-t border-slate-700/50 py-16">
		<div class="container mx-auto px-4">
			{#if mounted}
				<div
					class="mx-auto max-w-4xl rounded-xl border border-slate-700/50 bg-slate-800/30 p-8 backdrop-blur-sm"
					in:fly={{ y: 30, duration: 600, delay: 2400 }}
				>
					<div class="text-center">
						<h2 class="mb-4 text-2xl font-bold text-white">Questions About Our Terms?</h2>
						<p class="mb-6 text-gray-300">
							If you have any questions about these Terms of Service, please don't hesitate to contact our legal team.
						</p>
						<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
							<a
								href="mailto:legal@moviesavanna.com"
								class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-emerald-700"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								Email Legal Team
							</a>
							<a
								href="/help"
								class="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-slate-800"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								Help Center
							</a>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</section>
	<!-- Back to Top Button -->
	<div class="fixed bottom-8 right-8 z-50">
		<button
			onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-all duration-300 hover:bg-emerald-700 hover:scale-110"
			title="Back to top"
			aria-label="Back to top"
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M5 10l7-7m0 0l7 7m-7-7v18"
				/>
			</svg>
		</button>
	</div>
</div>
