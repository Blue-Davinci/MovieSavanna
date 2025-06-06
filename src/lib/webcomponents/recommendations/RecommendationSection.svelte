<script lang="ts">
  import { goto } from '$app/navigation';
  import type { Movie } from '$lib/types/movie.js';
  import FavoriteButton from '$lib/webcomponents/favorites/FavoriteButton.svelte';

  interface Props {
    title: string;
    movies: Movie[];
    loading?: boolean;
    subtitle?: string;
  }

  let { title, movies, loading = false, subtitle }: Props = $props();

  function goToMovie(movieId: number) {
    goto(`/dashboard/${movieId}`);
  }

  function formatYear(dateString: string): string {
    if (!dateString) return 'TBA';
    return new Date(dateString).getFullYear().toString();
  }

  function formatRating(rating: number): string {
    return rating > 0 ? rating.toFixed(1) : 'N/A';
  }
</script>

<section class="py-8">
  <div class="container mx-auto px-4">
    <!-- Section Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-white flex items-center gap-3">
          <span class="text-yellow-400">✨</span>
          {title}
        </h2>
        {#if subtitle}
          <p class="text-gray-400 text-sm mt-1">{subtitle}</p>
        {:else}
          <p class="text-gray-400 text-sm mt-1">
            {loading ? 'Loading recommendations...' : `${movies.length} personalized suggestions`}
          </p>
        {/if}
      </div>
      
      {#if movies.length > 0}
        <div class="hidden sm:flex items-center gap-2 text-sm text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI Powered
        </div>
      {/if}
    </div>

    <!-- Loading State -->
    {#if loading}
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {#each Array(6) as _}
          <div class="animate-pulse">
            <div class="bg-slate-700 h-64 rounded-lg mb-3"></div>
            <div class="bg-slate-700 h-4 rounded mb-2"></div>
            <div class="bg-slate-700 h-3 rounded w-2/3"></div>
          </div>
        {/each}
      </div>
    {:else if movies.length > 0}
      <!-- Movies Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {#each movies as movie}
          <div class="group relative">
            <!-- Movie Card -->
            <button
              onclick={() => goToMovie(movie.id)}
              class="w-full text-left focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg transition-all duration-300"
            >
              <div class="relative overflow-hidden rounded-lg bg-slate-800 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-yellow-400/20">
                {#if movie.poster_path}
                  <img
                    src="https://image.tmdb.org/t/p/w300{movie.poster_path}"
                    alt={movie.title}
                    class="w-full h-64 object-cover"
                    loading="lazy"
                  />
                {:else}
                  <div class="w-full h-64 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a1 1 0 00-1 1v14a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1m-1 0V2" />
                    </svg>
                  </div>
                {/if}
                
                <!-- Rating Badge -->
                {#if movie.vote_average > 0}
                  <div class="absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <span class="text-yellow-400">⭐</span>
                    {formatRating(movie.vote_average)}
                  </div>
                {/if}
                
                <!-- Favorite Button -->
                <div class="absolute top-2 right-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  <FavoriteButton {movie} size="sm" variant="overlay" />
                </div>
                
                <!-- Hover Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                  <div class="flex items-center gap-2 text-white text-sm font-medium">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </div>
                </div>
              </div>
              
              <!-- Movie Info -->
              <div class="mt-3">
                <h3 class="text-white font-medium text-sm line-clamp-2 mb-1 group-hover:text-yellow-400 transition-colors">
                  {movie.title}
                </h3>
                <p class="text-gray-400 text-xs">
                  {formatYear(movie.release_date)}
                </p>
              </div>
            </button>
          </div>
        {/each}
      </div>
      
      <!-- View More Button -->
      <div class="text-center mt-8">
        <button
          onclick={() => goto('/dashboard')}
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Discover More Movies
        </button>
      </div>
    {:else}
      <!-- Empty State -->
      <div class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p class="text-gray-400 mb-4">No recommendations available at the moment.</p>
        <button
          onclick={() => goto('/dashboard')}
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Explore Movies
        </button>
      </div>
    {/if}
  </div>
</section>

<style>
.line-clamp-2 {
  /* Modern standard property */
  line-clamp: 2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  
  /* Fallback properties */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -moz-box;
  display: box;
}
</style>