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
    
    // Filter states
    let showFilters = $state(false);
    let sortBy = $state<'popularity' | 'rating' | 'release_date' | 'title'>('popularity');
    let sortOrder = $state<'desc' | 'asc'>('desc');
    let minRating = $state(0);
    let releaseYear = $state<number | null>(null);

    // Derived state
    let isSearching = $derived(localSearchQuery.trim().length > 0);
    let hasFilters = $derived(minRating > 0 || releaseYear !== null || sortBy !== 'popularity');
    let displayTitle = $derived(
        isSearching ? `Search Results for "${localSearchQuery}"` : 
        hasFilters ? `${title} (Filtered)` : title
    );

    // Sort and filter movies client-side with proper typing
    let filteredMovies = $derived.by(() => {
        let result = [...movies];

        // Apply rating filter
        if (minRating > 0) {
            result = result.filter(movie => movie.vote_average >= minRating);
        }

        // Apply year filter
        if (releaseYear) {
            result = result.filter(movie => {
                if (!movie.release_date) return false;
                return new Date(movie.release_date).getFullYear() === releaseYear;
            });
        }

        // Apply sorting wdsith proper type handling
        result.sort((a, b) => {
            switch (sortBy) {
                case 'rating': {
                    const aRating = a.vote_average;
                    const bRating = b.vote_average;
                    return sortOrder === 'desc' ? bRating - aRating : aRating - bRating;
                }
                case 'release_date': {
                    const aDate = new Date(a.release_date || '1900-01-01').getTime();
                    const bDate = new Date(b.release_date || '1900-01-01').getTime();
                    return sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
                }
                case 'title': {
                    const aTitle = a.title.toLowerCase();
                    const bTitle = b.title.toLowerCase();
                    return sortOrder === 'desc' ? bTitle.localeCompare(aTitle) : aTitle.localeCompare(bTitle);
                }
                default: { // popularity
                    const aPopularity = a.popularity;
                    const bPopularity = b.popularity;
                    return sortOrder === 'desc' ? bPopularity - aPopularity : aPopularity - bPopularity;
                }
            }
        });

        return result;
    });

    // Fetch movies (unchanged)
    async function fetchMovies(page: number = 1, query: string = '') {
        loading = true;
        error = null;

        try {
            console.log(`🎬 Fetching movies: page=${page}, query="${query}"`);
            
            const data: TMDBResponse<Movie> = query.trim()
                ? await clientTMDB.searchMovies(query, page)
                : await clientTMDB.getPopularMovies(page);

            if (!data || !Array.isArray(data.results)) {
                throw new Error('Invalid response format from API');
            }

            movies = data.results;
            currentPage = data.page;
            totalPages = data.total_pages;
            totalResults = data.total_results;

            console.log(`Loaded ${movies.length} movies (page ${currentPage}/${totalPages})`);
        } catch (err) {
            console.error('Failed to fetch movies:', err);
            
            if (err instanceof Error) {
                error = err.message;
            } else {
                error = 'Failed to load movies. Please try again.';
            }
            
            movies = [];
        } finally {
            loading = false;
        }
    }

    // Handle search with debouncing (unchanged)
    function handleSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        localSearchQuery = target.value;

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        searchTimeout = setTimeout(() => {
            currentPage = 1;
            fetchMovies(1, localSearchQuery);
        }, 300);
    }

    // Handle pagination (unchanged)
    function goToPage(page: number) {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            currentPage = page;
            fetchMovies(page, localSearchQuery);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Clear search (unchanged)
    function clearSearch() {
        localSearchQuery = '';
        currentPage = 1;
        fetchMovies(1, '');
    }

    // Clear all filters
    function clearFilters() {
        sortBy = 'popularity';
        sortOrder = 'desc';
        minRating = 0;
        releaseYear = null;
        showFilters = false;
    }

    // Get current year for year filter
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

    // Initialize (unchanged)
    onMount(() => {
        if (!initialMovies) {
            fetchMovies(1, localSearchQuery);
        }
    });

    // Cleanup (unchanged)
    onDestroy(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
    });
</script>
<!-- ToDo: Make mini- components of this entire block-->
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
                        {isSearching || hasFilters ? filteredMovies.length : totalResults.toLocaleString()} movies 
                        {#if isSearching || hasFilters}shown{:else}found{/if}
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

        <!-- Filters Section -->
        <div class="mb-6">
            <!-- Filter Toggle -->
            <div class="flex items-center justify-between mb-4">
                <button
                    onclick={() => showFilters = !showFilters}
                    class="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                    </svg>
                    Filters & Sort
                    {#if hasFilters}
                        <span class="bg-blue-600 text-xs px-2 py-1 rounded-full">Active</span>
                    {/if}
                </button>

                {#if hasFilters}
                    <button
                        onclick={clearFilters}
                        class="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Clear all filters
                    </button>
                {/if}
            </div>

            <!-- Filters Panel -->
{#if showFilters}
    <div class="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Sort By -->
            <div>
                <label for="sort-by-select" class="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                <select 
                    id="sort-by-select"
                    bind:value={sortBy}
                    class="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="popularity">Popularity</option>
                    <option value="rating">Rating</option>
                    <option value="release_date">Release Date</option>
                    <option value="title">Title</option>
                </select>
            </div>

            <!-- Sort Order -->
            <div>
                <label for="sort-order-select" class="block text-sm font-medium text-gray-300 mb-2">Order</label>
                <select 
                    id="sort-order-select"
                    bind:value={sortOrder}
                    class="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="desc">
                        {sortBy === 'title' ? 'Z → A' : 'High → Low'}
                    </option>
                    <option value="asc">
                        {sortBy === 'title' ? 'A → Z' : 'Low → High'}
                    </option>
                </select>
            </div>

            <!-- Minimum Rating -->
            <div>
                <label for="min-rating-slider" class="block text-sm font-medium text-gray-300 mb-2">
                    Min Rating: {minRating === 0 ? 'Any' : minRating}+
                </label>
                <input 
                    id="min-rating-slider"
                    type="range"
                    min="0"
                    max="9"
                    step="1"
                    bind:value={minRating}
                    class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                    aria-label="Minimum rating filter from 0 to 9"
                />
                <div class="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Any</span>
                    <span>9+</span>
                </div>
            </div>

            <!-- Release Year -->
            <div>
                <label for="release-year-select" class="block text-sm font-medium text-gray-300 mb-2">Release Year</label>
                <select 
                    id="release-year-select"
                    bind:value={releaseYear}
                    class="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value={null}>Any Year</option>
                    {#each yearOptions as year}
                        <option value={year}>{year}</option>
                    {/each}
                </select>
            </div>
        </div>
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
        {#if !loading && !error && filteredMovies.length === 0}
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
                    {isSearching || hasFilters ? 'No Movies Found' : 'No Movies Available'}
                </h3>
                <p class="mb-6 text-gray-500">
                    {isSearching
                        ? `No movies match "${localSearchQuery}".`
                        : hasFilters 
                        ? 'No movies match your current filters.'
                        : 'There are no movies to display at the moment.'}
                </p>
                {#if isSearching || hasFilters}
                    <div class="flex gap-4 justify-center">
                        {#if isSearching}
                            <button
                                onclick={clearSearch}
                                class="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
                            >
                                Clear Search
                            </button>
                        {/if}
                        {#if hasFilters}
                            <button
                                onclick={clearFilters}
                                class="rounded-lg bg-slate-600 px-6 py-3 text-white transition-colors hover:bg-slate-700"
                            >
                                Clear Filters
                            </button>
                        {/if}
                    </div>
                {/if}
            </div>
        {/if}

        <!-- Movies Grid -->
        {#if loading || filteredMovies.length > 0}
            <div
                class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6"
            >
                {#if loading}
                    <!-- Loading skeletons -->
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
                    <!-- Movie cards - now using filtered results -->
                    {#each filteredMovies as movie (movie.id)}
                        <MovieCard {movie} />
                    {/each}
                {/if}
            </div>
        {/if}

        <!-- Pagination -->
        {#if !loading && !error && movies.length > 0 && totalPages > 1 && !hasFilters}
            <div class="mt-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div class="text-gray-400">
                    Page {currentPage} of {totalPages}
                </div>

                <div class="flex items-center space-x-2">
                    <button
                        onclick={() => goToPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                        class="rounded-lg bg-slate-800 px-4 py-2 text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Previous
                    </button>

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

<style>
    /* Custom slider styling */
    .slider::-webkit-slider-thumb {
        appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        border: 2px solid #1e293b;
    }

    .slider::-moz-range-thumb {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        border: 2px solid #1e293b;
    }
</style>