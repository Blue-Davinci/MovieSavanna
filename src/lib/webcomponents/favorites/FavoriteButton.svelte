<script lang="ts">
  import { onMount } from 'svelte';
  import { favoritesService } from '$lib/api/favorites.js';
  import type { Movie } from '$lib/types/movie.js';
  
  interface Props {
    movie: Movie;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    variant?: 'overlay' | 'inline';
  }
  
  let { 
    movie, 
    size = 'md', 
    showLabel = false, 
    variant = 'overlay' 
  }: Props = $props();
  
  // State
  let isFavorited = $state(false);
  let loading = $state(false);
  let error = $state<string | null>(null);
  
  // Size variants
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-10 h-10'
  };
  
  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };
  
  // Check favorite status on mount
  onMount(async () => {
    try {
      isFavorited = await favoritesService.isFavorited(movie.id);
    } catch (err) {
      console.error('Failed to check favorite status:', err);
    }
  });
  
  // Toggle favorite 
  async function toggleFavorite(event: Event) {
    // top all event propagation fisst
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();
    
    if (loading) return;
    
    loading = true;
    error = null;
    
    try {
      const favoriteData = {
        movie_id: movie.id,
        movie_title: movie.title,
        movie_poster: movie.poster_path,
        movie_release_date: movie.release_date,
        movie_rating: movie.vote_average
      };
      
      const newStatus = await favoritesService.toggleFavorite(favoriteData);
      isFavorited = newStatus;
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to update favorite';
      console.error('Toggle favorite error:', err);
    } finally {
      loading = false;
    }
  }
  
  // Handle keyboard eventas
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      toggleFavorite(event);
    }
  }
</script>


<button
  onclick={toggleFavorite}
  onkeydown={handleKeydown}
  disabled={loading}
  class="group relative transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-full z-10"
  class:cursor-not-allowed={loading}
  aria-label={isFavorited ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
  title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
>
  <!-- Overlay variant (for movie cards) -->
  {#if variant === 'overlay'}
    <div 
      class="bg-black/60 backdrop-blur-sm rounded-full transition-all duration-200 group-hover:bg-black/80 {buttonSizeClasses[size]}"
      class:animate-pulse={loading}
    >
      <svg 
        class="transition-all duration-200 {sizeClasses[size]}"
        class:text-red-500={isFavorited}
        class:fill-current={isFavorited}
        class:text-white={!isFavorited}
        class:group-hover:text-red-400={!isFavorited}
        class:scale-110={isFavorited}
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
    </div>
  
  <!-- Inline variant (for detail pages) -->
  {:else}
    <div 
      class="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
      class:animate-pulse={loading}
      class:bg-red-600={isFavorited}
      class:hover:bg-red-700={isFavorited}
    >
      <svg 
        class="transition-all duration-200 {sizeClasses[size]}"
        class:text-white={true}
        class:scale-110={isFavorited}
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      
      {#if showLabel}
        <span class="text-sm font-medium text-white">
          {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
        </span>
      {/if}
    </div>
  {/if}
  
  <!-- Loading spinner overlay -->
  {#if loading}
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  {/if}
</button>

<!-- Error toast (simple) -->
{#if error}
  <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow-lg z-50">
    {error}
  </div>
{/if}