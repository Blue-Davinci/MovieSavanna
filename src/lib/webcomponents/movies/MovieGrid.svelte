<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import MovieCard from './MovieCard.svelte';
	import { clientTMDB } from '$lib/api/client-tmdb.js';
	import type { Movie, TMDBResponse } from '$lib/types/movie.js';

	// Props
	let {
		title = 'Popular Movies',
		searchQuery = '',
		showSearch = true,
		initialMovies = undefined
	}: {
		title?: string;
		searchQuery?: string;
		showSearch?: boolean;
		initialMovies?: TMDBResponse<Movie>;
	} = $props();

	// State
	let movies = $state<Movie[]>(initialMovies?.results || []);
	let loading = $state(!initialMovies);
	let error = $state<string | null>(null);
	let currentPage = $state(initialMovies?.page || 1);
	let totalPages = $state(initialMovies?.total_pages || 1);
	let totalResults = $state(initialMovies?.total_results || 0);
	let searchTimeout: ReturnType<typeof setTimeout>;
	let localSearchQuery = $state(searchQuery);

	// Derived state
	let isSearching = $derived(localSearchQuery.trim().length > 0);
	let displayTitle = $derived(isSearching ? `Search Results for "${localSearchQuery}"` : title);

	// Fetch movies
	async function fetchMovies(page: number = 1, query: string = '') {
		loading = true;
		error = null;

		try {
			const data: TMDBResponse<Movie> = query.trim()
				? await clientTMDB.searchMovies(query, page)
				: await clientTMDB.getPopularMovies(page);

			movies = data.results;
			currentPage = data.page;
			totalPages = data.total_pages;
			totalResults = data.total_results;

			console.log(`✅ Loaded ${movies.length} movies (page ${currentPage}/${totalPages})`);
		} catch (err) {
			console.error('Failed to fetch movies:', err);
			error = err instanceof Error ? err.message : 'Failed to load movies';
			movies = [];
		} finally {
			loading = false;
		}
	}

	// Handle search with debouncing
	function handleSearch(event: Event) {
		const target = event.target as HTMLInputElement;
		localSearchQuery = target.value;

		// Clear existing timeout
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		// Debounce search
		searchTimeout = setTimeout(() => {
			currentPage = 1; // Reset to first page
			fetchMovies(1, localSearchQuery);
		}, 300);
	}

	// Handle pagination
	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages && page !== currentPage) {
			currentPage = page;
			fetchMovies(page, localSearchQuery);

			// Scroll to top
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	// Clear search
	function clearSearch() {
		localSearchQuery = '';
		currentPage = 1;
		fetchMovies(1, '');
	}
	// Initialize
	onMount(() => {
		// Only fetch if we don't have initial data
		if (!initialMovies) {
			fetchMovies(1, localSearchQuery);
		}
	});

	// Cleanup
	onDestroy(() => {
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}
	});
</script>

<section class="py-8">
	<div class="container mx-auto px-4">
		<!-- Header -->
		<div class="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
			<div class="mb-4 lg:mb-0">
				<h2 class="mb-2 text-3xl font-bold text-white md:text-4xl">
					{displayTitle}
				</h2>
				{#if totalResults > 0}
					<p class="text-gray-400">
						{totalResults.toLocaleString()} movies found
						{#if isSearching}• Page {currentPage} of {totalPages}{/if}
					</p>
				{/if}
			</div>

			<!-- Search Bar -->
			{#if showSearch}
				<div class="relative w-full max-w-md lg:w-auto">
					<input
						type="text"
						placeholder="Search movies..."
						value={localSearchQuery}
						oninput={handleSearch}
						class="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 pr-10 pl-12 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					{#if localSearchQuery}
						<button
							onclick={clearSearch}
							class="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-white"
							aria-label="Clear search"
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
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Error State -->
		{#if error}
			<div class="mb-8 rounded-lg border border-red-700 bg-red-900/20 p-6">
				<div class="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-3 h-6 w-6 text-red-400"
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
					<div>
						<h3 class="font-semibold text-red-400">Error Loading Movies</h3>
						<p class="text-red-300">{error}</p>
					</div>
				</div>
				<button
					onclick={() => fetchMovies(currentPage, localSearchQuery)}
					class="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
				>
					Try Again
				</button>
			</div>
		{/if}

		<!-- No Results -->
		{#if !loading && !error && movies.length === 0}
			<div class="py-16 text-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mx-auto mb-4 h-24 w-24 text-gray-600"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<h3 class="mb-2 text-2xl font-bold text-gray-400">
					{isSearching ? 'No Movies Found' : 'No Movies Available'}
				</h3>
				<p class="mb-6 text-gray-500">
					{isSearching
						? `No movies match "${localSearchQuery}". Try a different search term.`
						: 'There are no movies to display at the moment.'}
				</p>
				{#if isSearching}
					<button
						onclick={clearSearch}
						class="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
					>
						Browse Popular Movies
					</button>
				{/if}
			</div>
		{/if}

		<!-- Movies Grid -->
		{#if loading || movies.length > 0}
			<div
				class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6"
			>
				{#if loading}
					<!-- ✅ FIXED: Loading skeletons with proper empty movie object -->
					{#each Array(18) as _, index}
						<MovieCard
							movie={{
								id: index,
								title: '',
								overview: '',
								poster_path: null,
								backdrop_path: null,
								release_date: '',
								vote_average: 0,
								vote_count: 0,
								genre_ids: [],
								adult: false,
								original_language: '',
								original_title: '',
								popularity: 0,
								video: false
							} as Movie}
							loading={true}
						/>
					{/each}
				{:else}
					<!-- Movie cards -->
					{#each movies as movie (movie.id)}
						<MovieCard {movie} />
					{/each}
				{/if}
			</div>
		{/if}

		<!-- Pagination -->
		{#if !loading && !error && movies.length > 0 && totalPages > 1}
			<div class="mt-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
				<!-- Page info -->
				<div class="text-gray-400">
					Page {currentPage} of {totalPages}
				</div>

				<!-- Pagination controls -->
				<div class="flex items-center space-x-2">
					<!-- Previous button -->
					<button
						onclick={() => goToPage(currentPage - 1)}
						disabled={currentPage <= 1}
						class="rounded-lg bg-slate-800 px-4 py-2 text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Previous
					</button>

					<!-- Page numbers -->
					<div class="flex items-center space-x-1">
						{#each Array(Math.min(5, totalPages)) as _, i}
							{@const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i}
							{#if pageNum <= totalPages}
								<button
									onclick={() => goToPage(pageNum)}
									class="h-10 w-10 rounded-lg transition-colors"
									class:bg-blue-600={pageNum === currentPage}
									class:text-white={pageNum === currentPage}
									class:bg-slate-800={pageNum !== currentPage}
									class:text-gray-300={pageNum !== currentPage}
									class:hover:bg-slate-700={pageNum !== currentPage}
								>
									{pageNum}
								</button>
							{/if}
						{/each}
					</div>

					<!-- Next button -->
					<button
						onclick={() => goToPage(currentPage + 1)}
						disabled={currentPage >= totalPages}
						class="rounded-lg bg-slate-800 px-4 py-2 text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Next
					</button>
				</div>
			</div>
		{/if}
	</div>
</section>
