<script lang="ts">
	import { onMount } from 'svelte';

	const currentYear = new Date().getFullYear();

	// Newsletter subscription state
	let email = $state('');
	let isSubscribing = $state(false);
	let subscriptionMessage = $state('');

	// Social media links
	const socialLinks = [
		{
			name: 'Twitter',
			url: '#',
			icon: 'twitter',
			hoverColor: 'hover:text-blue-400'
		},
		{
			name: 'Instagram',
			url: '#',
			icon: 'instagram',
			hoverColor: 'hover:text-pink-400'
		},
		{
			name: 'Facebook',
			url: '#',
			icon: 'facebook',
			hoverColor: 'hover:text-blue-500'
		},
		{
			name: 'YouTube',
			url: '#',
			icon: 'youtube',
			hoverColor: 'hover:text-red-500'
		}
	];

	// Quick links
	const quickLinks = [
		{ name: 'Home', url: '/' },
		{ name: 'Movies', url: '/movies' },
		{ name: 'TV Shows', url: '/tv-shows' },
		{ name: 'Categories', url: '/categories' },
		{ name: 'Pricing', url: '/pricing' },
		{ name: 'About Us', url: '/about' }
	];

	// Category links
	const categoryLinks = [
		{ name: 'Action', url: '/category/action' },
		{ name: 'Comedy', url: '/category/comedy' },
		{ name: 'Drama', url: '/category/drama' },
		{ name: 'Horror', url: '/category/horror' },
		{ name: 'Romance', url: '/category/romance' },
		{ name: 'Thriller', url: '/category/thriller' }
	];

	// Legal links
	const legalLinks = [
		{ name: 'Terms of Service', url: '/terms' },
		{ name: 'Privacy Policy', url: '/privacy' },
		{ name: 'Cookie Policy', url: '/cookies' },
		{ name: 'FAQ', url: '/faq' }
	];

	async function handleNewsletterSubmit(e: Event) {
		e.preventDefault();

		if (!email || !email.includes('@')) {
			subscriptionMessage = 'Please enter a valid email address';
			return;
		}

		isSubscribing = true;

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		subscriptionMessage = 'Thank you for subscribing!';
		email = '';
		isSubscribing = false;

		// Clear message after 3 seconds
		setTimeout(() => {
			subscriptionMessage = '';
		}, 3000);
	}
</script>

<footer class="relative overflow-hidden bg-slate-950 pt-20 pb-6">
	<!-- Background decoration -->
	<div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950 to-slate-900/50"></div>
	<div
		class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
	></div>

	<div class="relative z-10 container mx-auto px-4">
		<!-- Main footer content -->
		<div class="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
			<!-- Brand section -->
			<div class="lg:col-span-1">
				<a href="/" class="group mb-6 flex items-center">
					<span
						class="mr-1 text-2xl font-bold text-blue-500 transition-colors group-hover:text-blue-400"
						>Movie</span
					>
					<span class="text-2xl font-bold text-white transition-colors group-hover:text-gray-200"
						>Savanna</span
					>
				</a>

				<p class="mb-6 leading-relaxed text-gray-400">
					Your ultimate destination for the best movies and TV shows. Experience cinema like never
					before with 4K streaming, offline downloads, and unlimited entertainment.
				</p>

				<!-- Social media links -->
				<div class="flex space-x-4">
					{#each socialLinks as social}
						<a
							href={social.url}
							class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-gray-400 {social.hoverColor} transition-all duration-300 hover:scale-110 hover:bg-slate-700"
							aria-label={social.name}
						>
							{#if social.icon === 'twitter'}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
									/>
								</svg>
							{:else if social.icon === 'instagram'}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
									/>
								</svg>
							{:else if social.icon === 'facebook'}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"
									/>
								</svg>
							{:else if social.icon === 'youtube'}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
									/>
								</svg>
							{/if}
						</a>
					{/each}
				</div>
			</div>

			<!-- Quick Links -->
			<div>
				<h4 class="mb-6 text-lg font-bold text-white">Quick Links</h4>
				<ul class="space-y-3">
					{#each quickLinks as link}
						<li>
							<a
								href={link.url}
								class="inline-block transform text-gray-400 transition-colors duration-300 hover:translate-x-1 hover:text-blue-400"
							>
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Categories -->
			<div>
				<h4 class="mb-6 text-lg font-bold text-white">Categories</h4>
				<ul class="space-y-3">
					{#each categoryLinks as link}
						<li>
							<a
								href={link.url}
								class="inline-block transform text-gray-400 transition-colors duration-300 hover:translate-x-1 hover:text-blue-400"
							>
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Contact & Newsletter -->
			<div>
				<h4 class="mb-6 text-lg font-bold text-white">Contact & Newsletter</h4>

				<!-- Contact info -->
				<div class="mb-6 space-y-4">
					<div class="flex items-start gap-3">
						<div class="mt-1 h-5 w-5 text-blue-400">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</div>
						<span class="text-sm text-gray-400">254 Movie Lane, Nairobi City, Kenya</span>
					</div>

					<div class="flex items-start gap-3">
						<div class="mt-1 h-5 w-5 text-blue-400">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<a
							href="mailto:info@moviesavanna.com"
							class="text-sm text-gray-400 transition-colors hover:text-blue-400"
						>
							info@moviesavanna.com
						</a>
					</div>

					<div class="flex items-start gap-3">
						<div class="mt-1 h-5 w-5 text-blue-400">
							<svg
								xmlns="http://www.w3.org/2000/svg"
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
						<a
							href="tel:+15551234567"
							class="text-sm text-gray-400 transition-colors hover:text-blue-400"
						>
							+ (254) 712-009000
						</a>
					</div>
				</div>

				<!-- Newsletter subscription -->
				<div>
					<h5 class="mb-3 font-semibold text-white">Stay Updated</h5>
					<form onsubmit={handleNewsletterSubmit} class="space-y-3">
						<div class="relative">
							<input
								type="email"
								bind:value={email}
								placeholder="Enter your email"
								class="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-gray-400 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
								disabled={isSubscribing}
							/>
							<button
								type="submit"
								class="absolute top-1/2 right-2 -translate-y-1/2 transform rounded-md bg-blue-600 p-2 text-white transition-all duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-800"
								disabled={isSubscribing}
							>
								{#if isSubscribing}
									<div
										class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
									></div>
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
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
								{/if}
							</button>
						</div>

						{#if subscriptionMessage}
							<p
								class="text-sm"
								class:text-green-400={subscriptionMessage.includes('Thank')}
								class:text-red-400={!subscriptionMessage.includes('Thank')}
							>
								{subscriptionMessage}
							</p>
						{/if}
					</form>
				</div>
			</div>
		</div>

		<!-- Bottom section -->
		<div class="border-t border-slate-800 pt-8">
			<div class="flex flex-col items-center justify-between gap-6 lg:flex-row">
				<!-- Copyright -->
				<p class="text-sm text-gray-400">
					© {currentYear} MovieSavanna. All rights reserved. Made with ❤️ for movie lovers.
				</p>

				<!-- Legal links -->
				<div class="flex flex-wrap justify-center gap-6">
					{#each legalLinks as link}
						<a
							href={link.url}
							class="text-sm text-gray-400 transition-colors duration-300 hover:text-blue-400"
						>
							{link.name}
						</a>
					{/each}
				</div>
			</div>

			<!-- Additional info -->
			<div class="mt-6 border-t border-slate-800/50 pt-6 text-center">
				<div class="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
					<span class="flex items-center gap-2">
						<div class="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
						All systems operational
					</span>
					<span>🔒 SSL Secured</span>
					<span>📱 Mobile Optimized</span>
					<span>🌍 Available Worldwide</span>
				</div>
			</div>
		</div>
	</div>
</footer>
