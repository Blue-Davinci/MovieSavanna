<script lang="ts">
  import { onMount } from 'svelte';
  import type { MovieDetails, MovieVideos } from '$lib/types/movie.js';
  
  interface Props {
    movie: MovieDetails;
    videos: MovieVideos;
    onGoBack?: () => void;
  }
  
  let { movie, videos, onGoBack }: Props = $props();
  
  // Get main trailer
  let mainTrailer = $derived(
    videos.results.find(video => 
      video.type === 'Trailer' && video.site === 'YouTube' && video.official
    ) || videos.results.find(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    )
  );
  
  // Format runtime
  function formatRuntime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }
  
  // Format release year
  let releaseYear = $derived(
    movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'
  );
  
  // Format vote average
  let votePercentage = $derived(Math.round(movie.vote_average * 10));
  
  // Handle play trailer
  function playTrailer() {
    if (mainTrailer) {
      window.open(`https://www.youtube.com/watch?v=${mainTrailer.key}`, '_blank');
    }
  }
</script>

<div class="relative">
  <!-- Backdrop Image -->
  {#if movie.backdrop_path}
    <div class="absolute inset-0 z-0">
      <img
        src="https://image.tmdb.org/t/p/w1280{movie.backdrop_path}"
        alt={movie.title}
        class="w-full h-full object-cover"
        loading="eager"
      />
      <!-- Dark overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/40"></div>
    </div>
  {/if}
  
  {#if onGoBack}
    <div class="absolute top-6 left-6 z-20">
      <button
        onclick={onGoBack}
        class="flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg"
        aria-label="Back to dashboard"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="font-medium text-sm">Back</span>
      </button>
    </div>
  {/if}
  
  <!-- Content -->
  <div class="relative z-10 container mx-auto px-4 py-16 lg:py-24">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
      <!-- Poster -->
      <div class="flex justify-center lg:justify-start">
        {#if movie.poster_path}
          <img
            src="https://image.tmdb.org/t/p/w500{movie.poster_path}"
            alt={movie.title}
            class="w-64 lg:w-80 rounded-lg shadow-2xl ring-1 ring-white/10"
            loading="eager"
          />
        {:else}
          <div class="w-64 lg:w-80 aspect-[2/3] bg-slate-800 rounded-lg flex items-center justify-center">
            <span class="text-gray-400 text-lg">No Image</span>
          </div>
        {/if}
      </div>
      
      <!-- Movie Info -->
      <div class="lg:col-span-2 text-center lg:text-left">
        <h1 class="text-4xl lg:text-6xl font-bold text-white mb-4">
          {movie.title}
        </h1>
        
        {#if movie.tagline}
          <p class="text-xl text-blue-300 italic mb-6">
            "{movie.tagline}"
          </p>
        {/if}
        
        <!-- Movie Metadata -->
        <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6 text-gray-300">
          <span class="flex items-center gap-2">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
            </svg>
            {releaseYear}
          </span>
          
          {#if movie.runtime}
            <span class="flex items-center gap-2">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              {formatRuntime(movie.runtime)}
            </span>
          {/if}
          
          <!-- Rating -->
          <span class="flex items-center gap-2">
            <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {movie.vote_average.toFixed(1)} ({votePercentage}%)
          </span>
        </div>
        
        <!-- Genres -->
        {#if movie.genres?.length > 0}
          <div class="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
            {#each movie.genres as genre}
              <span class="px-3 py-1 bg-slate-700/50 text-gray-300 rounded-full text-sm">
                {genre.name}
              </span>
            {/each}
          </div>
        {/if}
        
        <!-- Overview -->
        {#if movie.overview}
          <p class="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl">
            {movie.overview}
          </p>
        {/if}
        
        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-4 justify-center lg:justify-start">
          {#if mainTrailer}
            <button
              onclick={playTrailer}
              class="flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
              Watch Trailer
            </button>
          {/if}
          
          <button class="flex items-center gap-3 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Add to Favorites
          </button>
        </div>
      </div>
    </div>
  </div>
</div>