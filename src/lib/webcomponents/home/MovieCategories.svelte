<script lang="ts">
	interface Category {
		id: string;
		name: string;
		count: string;
		image: string;
		color: string;
		icon?: string;
	}

	// Use correct Svelte 5 $state syntax
	let categories = $state<Category[]>([
		{
			id: 'action',
			name: 'Action',
			count: '1,300+ Movies',
			image:
				'https://images.pexels.com/photos/4841820/pexels-photo-4841820.jpeg?auto=compress&cs=tinysrgb&w=1600',
			color: 'from-red-600/90 to-red-900/60',
			icon: '💥'
		},
		{
			id: 'fantasy',
			name: 'Fantasy',
			count: '800+ Movies',
			image:
				'https://images.pexels.com/photos/3400050/pexels-photo-3400050.jpeg?auto=compress&cs=tinysrgb&w=1600',
			color: 'from-blue-600/90 to-blue-900/60',
			icon: '🌟'
		},
		{
			id: 'comedy',
			name: 'Comedy',
			count: '1,000+ Movies',
			image:
				'https://images.pexels.com/photos/7991486/pexels-photo-7991486.jpeg?auto=compress&cs=tinysrgb&w=1600',
			color: 'from-yellow-600/90 to-yellow-900/60',
			icon: '😂'
		},
		{
			id: 'drama',
			name: 'Drama',
			count: '1,500+ Movies',
			image:
				'https://images.pexels.com/photos/8107206/pexels-photo-8107206.jpeg?auto=compress&cs=tinysrgb&w=1600',
			color: 'from-purple-600/90 to-purple-900/60',
			icon: '🎭'
		}
	]);

	let secondRowCategories = $state<Category[]>([
		{
			id: 'mystery',
			name: 'Mystery',
			count: '500+ Movies',
			image:
				'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1600',
			color: 'from-green-600/90 to-green-900/60',
			icon: '🔍'
		},
		{
			id: 'romance',
			name: 'Romance',
			count: '900+ Movies',
			image:
				'https://images.pexels.com/photos/5231334/pexels-photo-5231334.jpeg?auto=compress&cs=tinysrgb&w=1600',
			color: 'from-pink-600/90 to-pink-900/60',
			icon: '💕'
		},
		{
			id: 'horror',
			name: 'Horror',
			count: '750+ Movies',
			image:
				'https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg?auto=compress&cs=tinysrgb&w=1600',
			color: 'from-slate-600/90 to-slate-900/60',
			icon: '👻'
		},
		{
			id: 'thriller',
			name: 'Thriller',
			count: '650+ Movies',
			image:
				'https://images.pexels.com/photos/5662857/pexels-photo-5662857.jpeg?auto=compress&cs=tinysrgb&w=1600',
			color: 'from-orange-600/90 to-orange-900/60',
			icon: '⚡'
		}
	]);

	// Combine all categories for easier management
	let allCategories = $derived([...categories, ...secondRowCategories]);

	function handleCategoryClick(categoryId: string) {
		$inspect('Selected category:', categoryId);
		// Add navigation logic here
	}
</script>

<section class="bg-slate-950 py-20">
	<div class="container mx-auto px-4">
		<!-- Section Header -->
		<div class="mb-16 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
			<div class="max-w-2xl">
				<h2 class="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
					Choose The Type Of Film
					<span class="text-blue-500">You Love</span>
				</h2>
				<p class="text-lg leading-relaxed text-gray-400">
					Explore our vast collection across multiple genres. From heart-pounding action to
					tear-jerking dramas, find exactly what you're in the mood for.
				</p>
			</div>

			<a
				href="/categories"
				class="flex transform items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold whitespace-nowrap text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700"
			>
				View All Categories
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					class="h-5 w-5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 8l4 4m0 0l-4 4m4-4H3"
					/>
				</svg>
			</a>
		</div>

		<!-- First Row Categories -->
		<div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each categories as category}
				<a
					href={`/category/${category.id}`}
					class="group cursor-pointer"
					onclick={() => handleCategoryClick(category.id)}
				>
					<div
						class="relative aspect-[4/3] transform overflow-hidden rounded-2xl bg-slate-900 shadow-lg transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl"
					>
						<!-- Background Image -->
						<img
							src={category.image}
							alt={category.name}
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
							loading="lazy"
						/>

						<!-- Gradient Overlay -->
						<div
							class={`absolute inset-0 bg-gradient-to-t ${category.color} transition-opacity duration-300 group-hover:opacity-90`}
						></div>

						<!-- Content Overlay -->
						<div class="absolute inset-0 flex flex-col justify-between p-6">
							<!-- Icon -->
							<div class="flex justify-end">
								<div
									class="flex h-12 w-12 transform items-center justify-center rounded-full bg-white/20 text-2xl backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30"
								>
									{category.icon}
								</div>
							</div>

							<!-- Category Info -->
							<div
								class="translate-y-2 transform transition-all duration-300 group-hover:translate-y-0"
							>
								<h3
									class="mb-2 transform text-2xl font-bold text-white transition-all duration-300"
								>
									{category.name}
								</h3>
								<p class="transform font-medium text-white/90 transition-all delay-75 duration-300">
									{category.count}
								</p>

								<!-- Hover Arrow -->
								<div
									class="mt-3 opacity-0 transition-all delay-100 duration-300 group-hover:opacity-100"
								>
									<div class="flex items-center text-white/90">
										<span class="mr-2 text-sm font-medium">Explore</span>
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

						<!-- Shine Effect on Hover -->
						<div
							class="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
						>
							<div
								class="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
							></div>
						</div>
					</div>
				</a>
			{/each}
		</div>

		<!-- Second Row Categories -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each secondRowCategories as category}
				<a
					href={`/category/${category.id}`}
					class="group cursor-pointer"
					onclick={() => handleCategoryClick(category.id)}
				>
					<div
						class="relative aspect-[4/3] transform overflow-hidden rounded-2xl bg-slate-900 shadow-lg transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl"
					>
						<!-- Background Image -->
						<img
							src={category.image}
							alt={category.name}
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
							loading="lazy"
						/>

						<!-- Gradient Overlay -->
						<div
							class={`absolute inset-0 bg-gradient-to-t ${category.color} transition-opacity duration-300 group-hover:opacity-90`}
						></div>

						<!-- Content Overlay -->
						<div class="absolute inset-0 flex flex-col justify-between p-6">
							<!-- Icon -->
							<div class="flex justify-end">
								<div
									class="flex h-12 w-12 transform items-center justify-center rounded-full bg-white/20 text-2xl backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30"
								>
									{category.icon}
								</div>
							</div>

							<!-- Category Info -->
							<div
								class="translate-y-2 transform transition-all duration-300 group-hover:translate-y-0"
							>
								<h3
									class="mb-2 transform text-2xl font-bold text-white transition-all duration-300"
								>
									{category.name}
								</h3>
								<p class="transform font-medium text-white/90 transition-all delay-75 duration-300">
									{category.count}
								</p>

								<!-- Hover Arrow -->
								<div
									class="mt-3 opacity-0 transition-all delay-100 duration-300 group-hover:opacity-100"
								>
									<div class="flex items-center text-white/90">
										<span class="mr-2 text-sm font-medium">Explore</span>
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

						<!-- Shine Effect on Hover -->
						<div
							class="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
						>
							<div
								class="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
							></div>
						</div>
					</div>
				</a>
			{/each}
		</div>

		<!-- Stats Section -->
		<div class="mt-16 rounded-2xl bg-slate-900/50 p-8 backdrop-blur-sm">
			<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
				<div class="text-center">
					<div class="mb-2 text-3xl font-bold text-blue-500">8+</div>
					<div class="text-gray-400">Movie Categories</div>
				</div>
				<div class="text-center">
					<div class="mb-2 text-3xl font-bold text-blue-500">6,000+</div>
					<div class="text-gray-400">Total Movies</div>
				</div>
				<div class="text-center">
					<div class="mb-2 text-3xl font-bold text-blue-500">4K</div>
					<div class="text-gray-400">Ultra HD Quality</div>
				</div>
				<div class="text-center">
					<div class="mb-2 text-3xl font-bold text-blue-500">24/7</div>
					<div class="text-gray-400">New Releases</div>
				</div>
			</div>
		</div>
	</div>
</section>
