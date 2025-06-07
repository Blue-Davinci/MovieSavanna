<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	// Privacy policy sections data
	const privacySections = [
		{
			id: 'information-collection',
			title: 'Information We Collect',
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			content: `
				<h4 class="text-lg font-semibold text-white mb-3">Personal Information</h4>
				<p class="text-gray-300 mb-4">When you create a MovieSavanna account, we collect information such as your name, email address, phone number (optional), and password. This information is essential for account creation, authentication, and personalized service delivery.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Usage Information</h4>
				<p class="text-gray-300 mb-4">We automatically collect information about how you interact with our service, including movies watched, search queries, viewing preferences, device information, IP address, browser type, and operating system. This helps us improve our recommendation algorithms and service quality.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Payment Information</h4>
				<p class="text-gray-300">For subscription services, we collect billing information through secure, PCI-compliant payment processors. We do not store complete credit card information on our servers.</p>
			`
		},
		{
			id: 'information-use',
			title: 'How We Use Your Information',
			icon: 'M13 10V3L4 14h7v7l9-11h-7z',
			content: `
				<h4 class="text-lg font-semibold text-white mb-3">Service Provision</h4>
				<p class="text-gray-300 mb-4">Your information enables us to provide personalized movie recommendations, maintain your watchlist, sync viewing progress across devices, and deliver content tailored to your preferences.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Communication</h4>
				<p class="text-gray-300 mb-4">We use your contact information to send account-related notifications, service updates, security alerts, and promotional content (with your consent).</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Analytics & Improvement</h4>
				<p class="text-gray-300">We analyze usage patterns to enhance our service, fix bugs, develop new features, and improve overall user experience while maintaining privacy.</p>
			`
		},
		{
			id: 'information-sharing',
			title: 'Information Sharing & Disclosure',
			icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
			content: `
				<h4 class="text-lg font-semibold text-white mb-3">Third-Party Service Providers</h4>
				<p class="text-gray-300 mb-4">We share information with trusted partners who help operate our service, including payment processors, content delivery networks, analytics providers, and customer support platforms. These partners are bound by strict confidentiality agreements.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Legal Requirements</h4>
				<p class="text-gray-300 mb-4">We may disclose information when required by law, court order, or to protect our rights, property, and users' safety.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Business Transfers</h4>
				<p class="text-gray-300">In case of merger, acquisition, or sale of assets, user information may be transferred as part of the business transaction, with appropriate notice to users.</p>
			`
		},
		{
			id: 'data-security',
			title: 'Data Security & Protection',
			icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
			content: `
				<h4 class="text-lg font-semibold text-white mb-3">Encryption & Security</h4>
				<p class="text-gray-300 mb-4">We implement industry-standard security measures including SSL/TLS encryption, secure data centers, regular security audits, and access controls to protect your personal information.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Data Retention</h4>
				<p class="text-gray-300 mb-4">We retain personal information only as long as necessary to provide services, comply with legal obligations, and resolve disputes. Account data is deleted within 30 days of account closure.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Incident Response</h4>
				<p class="text-gray-300">In case of a data breach, we have procedures in place to assess, contain, and notify affected users and authorities as required by law.</p>
			`
		},
		{
			id: 'user-rights',
			title: 'Your Rights & Choices',
			icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
			content: `
				<h4 class="text-lg font-semibold text-white mb-3">Access & Control</h4>
				<p class="text-gray-300 mb-4">You have the right to access, update, correct, or delete your personal information through your account settings. You can also request a copy of your data or restrict certain processing activities.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Communication Preferences</h4>
				<p class="text-gray-300 mb-4">You can control email notifications, marketing communications, and other preferences through your account settings or by contacting our support team.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Account Deletion</h4>
				<p class="text-gray-300">You may delete your account at any time through account settings. Upon deletion, we will remove your personal information in accordance with our retention policies.</p>
			`
		},
		{
			id: 'cookies-tracking',
			title: 'Cookies & Tracking Technologies',
			icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
			content: `
				<h4 class="text-lg font-semibold text-white mb-3">Essential Cookies</h4>
				<p class="text-gray-300 mb-4">We use essential cookies to maintain your session, remember your preferences, and ensure proper website functionality. These cookies are necessary for the service to work properly.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Analytics Cookies</h4>
				<p class="text-gray-300 mb-4">With your consent, we use analytics cookies to understand how users interact with our service, identify popular content, and improve user experience.</p>
				
				<h4 class="text-lg font-semibold text-white mb-3">Cookie Management</h4>
				<p class="text-gray-300">You can manage cookie preferences through your browser settings or our cookie preference center. Note that disabling certain cookies may affect service functionality.</p>
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
	<title>Privacy Policy - MovieSavanna</title>
	<meta
		name="description"
		content="Learn how MovieSavanna protects your privacy, handles your data, and respects your rights. Our comprehensive privacy policy explains our data practices in detail."
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
				class="absolute top-20 left-20 h-72 w-72 animate-pulse rounded-full bg-blue-500 mix-blend-multiply blur-xl filter"
			></div>
			<div
				class="absolute right-20 bottom-20 h-96 w-96 animate-pulse rounded-full bg-purple-500 mix-blend-multiply blur-xl filter"
				style="animation-delay: 2s"
			></div>
			<div
				class="absolute left-1/2 top-1/2 h-80 w-80 animate-pulse rounded-full bg-emerald-500 mix-blend-multiply blur-xl filter"
				style="animation-delay: 4s"
			></div>
		</div>

		<div class="relative z-10 container mx-auto px-4 py-16">
			{#if mounted}
				<div class="mx-auto max-w-4xl text-center" in:fade={{ duration: 800, delay: 200 }}>
					<!-- Privacy Icon -->
					<div
						class="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"
						in:fly={{ y: -30, duration: 600, delay: 400 }}
					>
						<svg
							class="h-10 w-10 text-blue-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
					</div>

					<h1
						class="mb-6 text-5xl font-bold text-white md:text-6xl"
						in:fly={{ y: 30, duration: 600, delay: 600 }}
					>
						Privacy
						<span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
							>Policy</span
						>
					</h1>

					<p
						class="mb-8 text-xl leading-relaxed text-gray-300 md:text-2xl"
						in:fly={{ y: 30, duration: 600, delay: 800 }}
					>
						Your privacy matters to us. Learn how we collect, use, and protect your information to
						provide you with the best movie streaming experience.
					</p>

					<div
						class="text-lg text-gray-400"
						in:fly={{ y: 30, duration: 600, delay: 1000 }}
					>
						<p class="mb-2">Last updated: December 2024</p>
						<p>Effective date: December 1, 2024</p>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- Table of Contents -->
	<section class="bg-slate-950 py-12">
		<div class="container mx-auto px-4">
			{#if mounted}
				<div
					class="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-sm"
					in:fade={{ duration: 800, delay: 1200 }}
				>
					<h2 class="mb-6 text-2xl font-bold text-white">Table of Contents</h2>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						{#each privacySections as section, index}
							<button
								onclick={() => scrollToSection(section.id)}
								class="group flex items-center gap-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-left transition-all duration-300 hover:border-blue-500 hover:bg-slate-800"
								in:fly={{ x: -30, duration: 400, delay: 1400 + index * 100 }}
							>
								<div
									class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 transition-colors group-hover:bg-blue-600/30"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d={section.icon}
										/>
									</svg>
								</div>
								<span class="font-medium text-white transition-colors group-hover:text-blue-300"
									>{section.title}</span
								>
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- Privacy Policy Content -->
	<section class="bg-slate-950 py-16">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-4xl">
				{#if mounted}
					{#each privacySections as section, index}
						<div
							id={section.id}
							class="mb-16 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-sm"
							in:fade={{ duration: 800, delay: 200 + index * 100 }}
						>
							<div class="mb-6 flex items-center gap-4">
								<div
									class="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20"
								>
									<svg
										class="h-6 w-6 text-blue-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d={section.icon}
										/>
									</svg>
								</div>
								<h2 class="text-3xl font-bold text-white">{section.title}</h2>
							</div>
							<div class="space-y-4">
								{@html section.content}
							</div>
						</div>
					{/each}
				{/if}

				<!-- Contact Section -->
				{#if mounted}
					<div
						class="rounded-2xl border border-slate-800 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-8 backdrop-blur-sm"
						in:fade={{ duration: 800, delay: 1000 }}
					>
						<div class="text-center">
							<h2 class="mb-4 text-3xl font-bold text-white">Questions About Privacy?</h2>
							<p class="mb-6 text-lg text-gray-300">
								If you have any questions about this Privacy Policy or our data practices, please
								don't hesitate to contact us.
							</p>
							<div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
								<a
									href="mailto:privacy@moviesavanna.com"
									class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700"
								>
									<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
									Contact Privacy Team
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
		</div>
	</section>
	<!-- Back to Top Button -->
	<div class="fixed bottom-8 right-8 z-50">
		<button
			onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:scale-110"
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
