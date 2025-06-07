<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';

	// Animation state
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	}); // Team member
	const team = [
		{
			name: 'Blue Davinci',
			role: 'Founder & Creator',
			image: 'https://avatars.githubusercontent.com/u/52623427?v=4',
			bio: 'Full-stack developer passionate about creating innovative streaming experiences.',
			github: 'https://github.com/Blue-Davinci'
		}
	];
	// Stats
	const stats = [
		{ number: '5K+', label: 'Movies Available', icon: '🎬' },
		{ number: '20+', label: 'Active Users', icon: '👥' },
		{ number: '99%', label: 'Uptime', icon: '⚡' },
		{ number: '5+', label: 'Countries', icon: '🌍' }
	];

	// Values
	const values = [
		{
			title: 'Innovation',
			description: 'We continuously push boundaries to deliver cutting-edge streaming technology.',
			icon: '🚀'
		},
		{
			title: 'Accessibility',
			description: 'Great movies should be accessible to everyone, everywhere, at any time.',
			icon: '🌟'
		},
		{
			title: 'Quality',
			description: 'We never compromise on quality - from content curation to user experience.',
			icon: '💎'
		},
		{
			title: 'Community',
			description: 'Building a global community of movie lovers who share our passion.',
			icon: '❤️'
		}
	];
</script>

<svelte:head>
	<title>About Us - MovieSavanna</title>
	<meta
		name="description"
		content="Learn about MovieSavanna's mission to bring the best movies and streaming experience to millions of users worldwide."
	/>
	<meta property="og:title" content="About MovieSavanna" />
	<meta
		property="og:description"
		content="Discover our story, meet our team, and learn about our mission to revolutionize movie streaming."
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
				class="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-cyan-500/50 mix-blend-multiply blur-xl filter"
				style="animation-delay: 4s"
			></div>
		</div>

		<div class="relative z-10 container mx-auto px-4">
			{#if mounted}
				<div class="text-center" in:fly={{ y: 50, duration: 800, delay: 200 }}>
					<h1 class="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
						About <span
							class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
							>MovieSavanna</span
						>
					</h1>
					<p class="mx-auto max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">
						Revolutionizing the way you discover, watch, and experience movies with cutting-edge
						technology and an unparalleled collection.
					</p>
				</div>
			{/if}
		</div>
	</section>

	<!-- Story Section -->
	<section class="bg-slate-950 py-20">
		<div class="container mx-auto px-4">
			{#if mounted}
				<div
					class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2"
					in:fly={{ y: 50, duration: 800, delay: 400 }}
				>
					<!-- Content -->
					<div class="space-y-6">
						<div
							class="inline-flex items-center rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400"
						>
							Our Story
						</div>
						<h2 class="text-4xl font-bold text-white md:text-5xl">
							Bringing Cinema to Your
							<span class="text-blue-400">Fingertips</span>
						</h2>
						<div class="space-y-4 text-lg leading-relaxed text-gray-300">
							<p>
								Founded in 2024, MovieSavanna is a modern streaming platform that brings together
								the best of cinema with cutting-edge technology.
							</p>
							<p>
								Built with passion by developers who love movies, we're creating a community where
								film enthusiasts can discover, share, and celebrate great cinema.
							</p>
						</div>
					</div>

					<!-- Image -->
					<div class="relative">
						<div class="overflow-hidden rounded-2xl shadow-2xl">
							<img
								src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800"
								alt="MovieSavanna team at work"
								class="h-96 w-full object-cover"
								loading="lazy"
							/>
						</div>
						<!-- Floating elements -->
						<div
							class="absolute -top-6 -left-6 rounded-xl border border-blue-500/20 bg-blue-600/20 p-6 backdrop-blur-sm"
						>
							<div class="mb-2 text-3xl">🎬</div>
							<div class="text-sm font-semibold text-white">Since 2024</div>
						</div>
						<div
							class="absolute -right-6 -bottom-6 rounded-xl border border-purple-500/20 bg-purple-600/20 p-6 backdrop-blur-sm"
						>
							<div class="mb-2 text-3xl">🌍</div>
							<div class="text-sm font-semibold text-white">Global Reach</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- Stats Section -->
	<section class="bg-gradient-to-b from-slate-950 to-slate-900 py-20">
		<div class="container mx-auto px-4">
			{#if mounted}
				<div class="mb-16 text-center" in:fade={{ duration: 800, delay: 600 }}>
					<h2 class="mb-4 text-4xl font-bold text-white md:text-5xl">
						MovieSavanna by the Numbers
					</h2>
					<p class="mx-auto max-w-2xl text-xl text-gray-400">
						Our growth speaks to the trust and love our community has for what we do.
					</p>
				</div>

				<div
					class="grid grid-cols-2 gap-6 md:grid-cols-4"
					in:fly={{ y: 50, duration: 800, delay: 800 }}
				>
					{#each stats as stat, index}
						<div
							class="transform rounded-2xl border border-slate-700/50 bg-slate-900/50 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-slate-800/50"
						>
							<div class="mb-4 text-4xl">{stat.icon}</div>
							<div class="mb-2 text-3xl font-bold text-blue-400 md:text-4xl">{stat.number}</div>
							<div class="font-medium text-gray-400">{stat.label}</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</section>

	<!-- Values Section -->
	<section class="bg-slate-950 py-20">
		<div class="container mx-auto px-4">
			{#if mounted}
				<div class="mb-16 text-center" in:fade={{ duration: 800, delay: 1000 }}>
					<div
						class="mb-6 inline-flex items-center rounded-full bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-400"
					>
						Our Values
					</div>
					<h2 class="mb-4 text-4xl font-bold text-white md:text-5xl">What Drives Us Forward</h2>
					<p class="mx-auto max-w-2xl text-xl text-gray-400">
						Our core values guide every decision we make and every feature we build.
					</p>
				</div>

				<div
					class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
					in:fly={{ y: 50, duration: 800, delay: 1200 }}
				>
					{#each values as value, index}
						<div
							class="group transform rounded-2xl border border-slate-700/50 bg-slate-900/50 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-slate-800/50 hover:shadow-2xl"
						>
							<div
								class="mb-6 transform text-4xl transition-transform duration-300 group-hover:scale-110"
							>
								{value.icon}
							</div>
							<h3 class="mb-4 text-xl font-bold text-white">{value.title}</h3>
							<p class="leading-relaxed text-gray-400">{value.description}</p>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</section>

	<!-- Team Section -->
	<section class="bg-gradient-to-b from-slate-950 to-slate-900 py-20">
		<div class="container mx-auto px-4">
			{#if mounted}
				<div class="mb-16 text-center" in:fade={{ duration: 800, delay: 1400 }}>
					<div
						class="mb-6 inline-flex items-center rounded-full bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400"
					>
						Meet the Creator
					</div>
					<h2 class="mb-4 text-4xl font-bold text-white md:text-5xl">
						The Mind Behind MovieSavanna
					</h2>
					<p class="mx-auto max-w-2xl text-xl text-gray-400">
						Passionate developer bringing innovative streaming experiences to life.
					</p>
				</div>
				<div class="flex justify-center" in:fly={{ y: 50, duration: 800, delay: 1600 }}>
					{#each team as member, index}
						<div class="group max-w-sm text-center">
							<div class="relative mx-auto mb-8 w-80 overflow-hidden rounded-3xl sm:w-72 md:w-80">
								<img
									src={member.image}
									alt={member.name}
									class="h-80 w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
									loading="lazy"
								/>
								<!-- Overlay on hover -->
								<div
									class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100"
								>
									<div class="absolute right-6 bottom-6 left-6">
										<p class="mb-4 text-base font-medium text-white/95">{member.bio}</p>
										{#if member.github}
											<a
												href={member.github}
												target="_blank"
												rel="noopener noreferrer"
												class="inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-600/20 px-4 py-2 text-sm text-blue-300 backdrop-blur-sm transition-all duration-300 hover:bg-blue-600/30 hover:text-blue-200"
											>
												<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
													<path
														d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
													/>
												</svg>
												View GitHub
											</a>
										{/if}
									</div>
								</div>
								<!-- Decorative ring around image -->
								<div
									class="absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
								></div>
							</div>
							<div class="space-y-3">
								<h3 class="text-2xl font-bold text-white">{member.name}</h3>
								<p class="text-lg font-semibold text-blue-400">{member.role}</p>
								<div
									class="mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
								></div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</section>

	<!-- Mission Section -->
	<section class="bg-slate-950 py-20">
		<div class="container mx-auto px-4">
			{#if mounted}
				<div class="mx-auto max-w-4xl text-center" in:fly={{ y: 50, duration: 800, delay: 1800 }}>
					<div
						class="mb-8 inline-flex items-center rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-medium text-yellow-400"
					>
						Our Mission
					</div>
					<h2 class="mb-8 text-4xl font-bold text-white md:text-5xl">
						Building the Future of Streaming
					</h2>
					<div class="mb-12 space-y-6 text-xl leading-relaxed text-gray-300">
						<p>
							At MovieSavanna, we believe great entertainment should be accessible to everyone.
							We're building a platform that connects people with the stories that move and inspire
							them.
						</p>
					</div>

					<!-- CTA Section -->
					<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<a
							href="/movies"
							class="inline-flex transform items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							Explore Movies
						</a>
						<a
							href="/dashboard"
							class="inline-flex transform items-center gap-2 rounded-lg border border-slate-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-slate-800"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
								/>
							</svg>
							Your Dashboard
						</a>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- Contact Section -->
	<section class="bg-gradient-to-b from-slate-950 to-slate-900 py-20">
		<div class="container mx-auto px-4">
			{#if mounted}
				<div class="mx-auto max-w-3xl" in:fade={{ duration: 800, delay: 2000 }}>
					<div class="mb-12 text-center">
						<h2 class="mb-4 text-4xl font-bold text-white md:text-5xl">Get in Touch</h2>
						<p class="text-xl text-gray-400">
							Have questions, suggestions, or just want to say hello? We'd love to hear from you.
						</p>
					</div>

					<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
						<div
							class="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 text-center backdrop-blur-sm"
						>
							<div
								class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20"
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
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<h3 class="mb-2 text-lg font-semibold text-white">Email Us</h3>
							<p class="text-gray-400">hello@moviesavanna.com</p>
						</div>

						<div
							class="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 text-center backdrop-blur-sm"
						>
							<div
								class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20"
							>
								<svg
									class="h-6 w-6 text-green-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
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
							<h3 class="mb-2 text-lg font-semibold text-white">Visit Us</h3>
							<p class="text-gray-400">Nairobi, Kenya</p>
						</div>

						<div
							class="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 text-center backdrop-blur-sm"
						>
							<div
								class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20"
							>
								<svg
									class="h-6 w-6 text-purple-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
									/>
								</svg>
							</div>
							<h3 class="mb-2 text-lg font-semibold text-white">Follow Us</h3>
							<p class="text-gray-400">@moviesavanna</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</section>
</div>
