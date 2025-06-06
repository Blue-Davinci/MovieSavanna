<script lang="ts">
	import { goto } from '$app/navigation';

	interface Plan {
		id: string;
		name: string;
		price: number;
		description: string;
		features: string[];
		isPopular: boolean;
		period: string;
		originalPrice?: number;
	}

	// Demo mode - keeps pricing visible but disables purchase
	let isDemoMode = $state(true); // Set to false when payment is implemented

	let plans = $state<Plan[]>([
		{
			id: 'basic',
			name: 'Basic Plan',
			price: 9.99,
			originalPrice: 12.99,
			description: 'Perfect for casual movie watching',
			features: [
				'Unlimited Movies & TV Shows',
				'Watch on 1 Device',
				'No Ads',
				'25 Download Slots',
				'10 TV Channels',
				'Standard HD Quality'
			],
			isPopular: false,
			period: 'month'
		},
		{
			id: 'standard',
			name: 'Standard Plan',
			price: 14.99,
			originalPrice: 19.99,
			description: 'Perfect for movie enthusiasts',
			features: [
				'Unlimited Movies & TV Shows',
				'Watch on 2 Devices',
				'No Ads',
				'75 Download Slots',
				'20 TV Channels',
				'Full HD Quality',
				'Offline Viewing',
				'Email Support'
			],
			isPopular: true,
			period: 'month'
		},
		{
			id: 'premium',
			name: 'Premium Plan',
			price: 19.99,
			originalPrice: 24.99,
			description: 'The ultimate cinema experience',
			features: [
				'Unlimited Movies & TV Shows',
				'Watch on 4 Devices',
				'No Ads',
				'Unlimited Downloads',
				'50+ TV Channels',
				'4K + HDR Quality',
				'Multiple User Profiles',
				'Priority Support',
				'Early Access to New Releases'
			],
			isPopular: false,
			period: 'month'
		}
	]);

	let selectedPlan = $state<string | null>(null);

	function selectPlan(planId: string) {
		if (isDemoMode) {
			alert(
				'💼 Payment integration is currently in development. Feel free to explore the full app functionality with demo access!'
			);
			goto('/dashboard');
			return;
		}

		selectedPlan = planId;
		$inspect('Selected plan:', planId);
		// Future: redirect to checkout
		// goto(`/checkout/${planId}`);
	}
</script>

<section class="bg-slate-950 py-20">
	<div class="container mx-auto px-4">
		<!-- Section Header -->
		<div class="mx-auto mb-16 max-w-4xl text-center">
			{#if isDemoMode}
				<div
					class="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"
						/>
					</svg>
					Payment System In Development
				</div>
			{/if}

			<h2 class="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
				Choose The Plan That
				<span class="text-blue-500">Suits You</span>
			</h2>
			<p class="text-lg leading-relaxed text-gray-400">
				{#if isDemoMode}
					Explore our planned pricing structure below. Currently offering full access for portfolio
					demonstration.
				{:else}
					We present 3 flexible packages that you can choose to start watching various movies at
					affordable prices and according to your needs.
				{/if}
			</p>
		</div>

		<!-- Pricing Cards -->
		<div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each plans as plan}
				<div
					class="relative transform overflow-hidden rounded-2xl bg-slate-900 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
					class:ring-2={plan.isPopular}
					class:ring-blue-500={plan.isPopular}
					class:shadow-2xl={plan.isPopular}
					class:shadow-blue-500={plan.isPopular}
				>
					{#if isDemoMode}
						<div class="absolute top-4 right-4 z-10">
							<div
								class="rounded border border-blue-500/30 bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-300 backdrop-blur-sm"
							>
								Dev Mode
							</div>
						</div>
					{/if}

					<!-- Popular Badge -->
					{#if plan.isPopular}
						<div class="absolute -top-4 left-1/2 z-10 -translate-x-1/2 transform">
							<div
								class="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 text-sm font-bold text-white shadow-lg"
							>
								🔥 Most Popular
							</div>
						</div>
					{/if}

					<!-- Card Content -->
					<div class="p-8">
						<!-- Plan Header -->
						<div class="mb-8 text-center">
							<h3 class="mb-2 text-2xl font-bold text-white">{plan.name}</h3>
							<p class="mb-6 text-gray-400">{plan.description}</p>

							<!-- Pricing -->
							<div class="mb-2 flex items-center justify-center gap-2">
								{#if plan.originalPrice}
									<span class="text-lg text-gray-500 line-through">${plan.originalPrice}</span>
								{/if}
								<span class="text-4xl font-bold text-white md:text-5xl">${plan.price}</span>
								<span class="text-lg text-gray-400">/{plan.period}</span>
							</div>

							{#if plan.originalPrice}
								<div
									class="inline-block rounded-full bg-green-500/20 px-3 py-1 text-sm font-medium text-green-400"
								>
									Save ${(plan.originalPrice - plan.price).toFixed(2)}/month
								</div>
							{/if}
						</div>

						<!-- Features List -->
						<div class="mb-8 space-y-4">
							{#each plan.features as feature}
								<div class="flex items-start gap-3">
									<div
										class="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-3 w-3 text-blue-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="3"
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
									<span class="leading-relaxed text-gray-300">{feature}</span>
								</div>
							{/each}
						</div>

						<!-- CTA Button - Consolidated attributes -->
						<button
							class="relative w-full transform overflow-hidden rounded-xl py-4 text-lg font-semibold transition-all duration-300 focus:ring-4 focus:outline-none"
							class:bg-blue-600={plan.isPopular && !isDemoMode}
							class:hover:bg-blue-700={plan.isPopular && !isDemoMode}
							class:text-white={(plan.isPopular && !isDemoMode) || isDemoMode}
							class:shadow-lg={plan.isPopular && !isDemoMode}
							class:focus:ring-blue-500={plan.isPopular && !isDemoMode}
							class:border-2={(!plan.isPopular && !isDemoMode) || isDemoMode}
							class:border-blue-500={!plan.isPopular && !isDemoMode}
							class:border-gray-500={isDemoMode}
							class:text-blue-500={!plan.isPopular && !isDemoMode && !isDemoMode}
							class:hover:bg-blue-500={!plan.isPopular && !isDemoMode}
							class:hover:text-white={(!plan.isPopular && !isDemoMode) || isDemoMode}
							class:hover:scale-105={!isDemoMode}
							class:bg-gray-600={isDemoMode}
							class:text-gray-300={isDemoMode}
							class:hover:bg-gray-500={isDemoMode}
							class:cursor-pointer={true}
							onclick={() => selectPlan(plan.id)}
						>
							{#if isDemoMode}
								<span class="flex items-center justify-center gap-2">
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
									View Demo Features
								</span>
							{:else}
								{plan.isPopular ? 'Get Started Now' : 'Choose Plan'}
							{/if}
						</button>

						<p class="mt-4 text-center text-sm text-gray-500">
							{#if isDemoMode}
								<span class="flex items-center justify-center gap-1">
									<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/>
									</svg>
									Payment integration in development
								</span>
							{:else}
								30-day money-back guarantee
							{/if}
						</p>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-16 text-center">
			{#if isDemoMode}
				<div class="space-y-4">
					<div
						class="inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/50 px-6 py-3 backdrop-blur-sm"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-blue-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span class="text-gray-300"
							>Pricing structure designed • Payment gateway ready for integration</span
						>
					</div>

					<div
						class="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-6 py-3 backdrop-blur-sm"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 text-green-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
						<span class="text-green-300">Portfolio Demo: Explore all features with full access</span
						>
					</div>
				</div>
			{:else}
				<div
					class="inline-flex items-center gap-2 rounded-full bg-slate-800/50 px-6 py-3 backdrop-blur-sm"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-green-500"
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
					<span class="text-gray-300">All plans include SSL security and 24/7 customer support</span
					>
				</div>
			{/if}
		</div>

		<!-- FAQ Link -->
		<div class="mt-8 text-center">
			<a href="/faq" class="text-blue-400 transition-colors duration-300 hover:text-blue-300">
				Have questions? Check our FAQ →
			</a>
		</div>
	</div>
</section>
