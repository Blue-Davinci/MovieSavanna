<script lang="ts">
	interface Feature {
		id: string;
		title: string;
		description: string;
		icon: string;
		color: string;
	}

	// Use correct Svelte 5 $state syntax
	let features = $state<Feature[]>([
		{
			id: 'official',
			title: 'Official Movies',
			description:
				'We provide new films that are ready to be shown in cinemas on this platform with licensed content',
			icon: '🎬',
			color: 'from-blue-500 to-blue-600'
		},
		{
			id: 'choice',
			title: 'Best Choice',
			description:
				'The best choice for all circles and every need for films that are curated and ready to stream',
			icon: '⭐',
			color: 'from-yellow-500 to-yellow-600'
		},
		{
			id: 'stream',
			title: '4K HD Streaming',
			description:
				'We provide the best streaming quality with 4K, HDR support and adaptive bitrate for your enjoyment',
			icon: '📺',
			color: 'from-purple-500 to-purple-600'
		},
		{
			id: 'download',
			title: 'Offline Download',
			description:
				'Download your favorite movies and watch them offline whenever you want, anywhere you go',
			icon: '📱',
			color: 'from-green-500 to-green-600'
		}
	]);

	let isVisible = $state(false);

	function handleFeatureClick(featureId: string) {
		$inspect('Feature clicked:', featureId);
		// ToDo: Add feature interaction logic here
	}
</script>

<section class="bg-slate-950 py-20">
	<div class="container mx-auto px-4">
		<!-- Section Header -->
		<div class="mx-auto mb-16 max-w-4xl text-center">
			<h2 class="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
				Best Features That
				<span class="text-blue-500">Won't Disappoint</span>
			</h2>
			<p class="text-lg leading-relaxed text-gray-400">
				Experience cinema like never before with our cutting-edge platform designed for movie lovers
				who demand the best.
			</p>
		</div>

		<!-- Features Grid -->
		<div class="mb-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
			{#each features as feature, index}
				<div
					class="group cursor-pointer"
					onclick={() => handleFeatureClick(feature.id)}
					role="button"
					tabindex="0"
					onkeydown={(e) => e.key === 'Enter' && handleFeatureClick(feature.id)}
				>
					<div
						class="h-full transform rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10"
					>
						<!-- Icon Container -->
						<div class="relative mb-6">
							<div
								class={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.color} flex transform items-center justify-center text-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
							>
								{feature.icon}
							</div>
							<!-- Glow Effect -->
							<div
								class={`absolute inset-0 h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20`}
							></div>
						</div>

						<!-- Content -->
						<h3
							class="mb-4 text-xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400"
						>
							{feature.title}
						</h3>
						<p
							class="leading-relaxed text-gray-400 transition-colors duration-300 group-hover:text-gray-300"
						>
							{feature.description}
						</p>

						<!-- Hover Arrow -->
						<div
							class="mt-6 translate-y-2 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
						>
							<div class="flex items-center text-blue-400">
								<span class="mr-2 text-sm font-medium">Learn More</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									class="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 8l4 4m0 0l-4 4m4-4H3"
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Featured Content Section -->
		<div
			class="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 shadow-2xl backdrop-blur-sm"
		>
			<div class="grid grid-cols-1 lg:grid-cols-2">
				<!-- Content Side -->
				<div class="flex flex-col justify-center p-8 md:p-12">
					<div class="mb-6">
						<span
							class="mb-4 inline-block rounded-full bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-400"
						>
							🌟 Premium Experience
						</span>
						<h3 class="mb-4 text-2xl leading-tight font-bold text-white md:text-3xl lg:text-4xl">
							Watch Anywhere,
							<span class="text-blue-500">Anytime</span>
						</h3>
						<p class="mb-8 text-lg leading-relaxed text-gray-400">
							Enjoy your favorite movies and TV shows on your phone, tablet, laptop, or TV. Stream
							on multiple devices simultaneously, and download titles to watch offline with our
							advanced sync technology.
						</p>
					</div>

					<!-- Features List -->
					<div class="mb-8 space-y-4">
						<div class="flex items-center gap-3">
							<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									class="h-4 w-4 text-blue-400"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<span class="text-gray-300">Cross-platform compatibility</span>
						</div>
						<div class="flex items-center gap-3">
							<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									class="h-4 w-4 text-blue-400"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<span class="text-gray-300">Multiple device streaming</span>
						</div>
						<div class="flex items-center gap-3">
							<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									class="h-4 w-4 text-blue-400"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<span class="text-gray-300">Offline download & sync</span>
						</div>
					</div>

					<!-- CTA Buttons -->
					<div class="flex flex-col gap-4 sm:flex-row">
						<a
							href="/signup"
							class="transform rounded-xl bg-blue-600 px-8 py-4 text-center font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700"
						>
							Start Watching Now
						</a>
						<a
							href="/demo"
							class="rounded-xl border border-slate-600 px-8 py-4 text-center font-semibold text-slate-300 transition-all duration-300 hover:border-blue-500 hover:text-blue-400"
						>
							Watch Demo
						</a>
					</div>
				</div>

				<!-- Image Side -->
				<div class="relative h-64 min-h-[400px] lg:h-auto">
					<img
						src="https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=1600"
						alt="Woman watching movie on tablet"
						class="h-full w-full object-cover"
						loading="lazy"
					/>
					<!-- Gradient Overlay -->
					<div
						class="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-transparent to-transparent lg:hidden"
					></div>

					<!-- Floating Elements -->
					<div
						class="absolute top-6 right-6 transform rounded-xl bg-white/20 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105"
					>
						<div class="text-sm font-semibold text-white">📱 Mobile Ready</div>
					</div>

					<div
						class="absolute bottom-6 left-6 transform rounded-xl bg-white/20 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105"
					>
						<div class="text-sm font-semibold text-white">🔄 Auto Sync</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Stats Section -->
		<div class="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
			<div class="text-center">
				<div class="mb-2 text-3xl font-bold text-blue-500 md:text-4xl">99.9%</div>
				<div class="text-gray-400">Uptime</div>
			</div>
			<div class="text-center">
				<div class="mb-2 text-3xl font-bold text-blue-500 md:text-4xl">4K</div>
				<div class="text-gray-400">Ultra HD</div>
			</div>
			<div class="text-center">
				<div class="mb-2 text-3xl font-bold text-blue-500 md:text-4xl">10+</div>
				<div class="text-gray-400">Devices</div>
			</div>
			<div class="text-center">
				<div class="mb-2 text-3xl font-bold text-blue-500 md:text-4xl">24/7</div>
				<div class="text-gray-400">Support</div>
			</div>
		</div>
	</div>
</section>
