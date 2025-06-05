<script lang="ts">
  import type { MovieDetails as MovieDetailsType } from '$lib/types/movie.js';
  
  interface Props {
    movie: MovieDetailsType;
  }
  
  let { movie }: Props = $props();
  
  // Format currency
  function formatCurrency(amount: number): string {
    if (amount === 0) return 'Not disclosed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  // Format date
  function formatDate(dateString: string): string {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Format runtime
  function formatRuntime(minutes: number): string {
    if (minutes === 0) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }
</script>

<div class="space-y-6">
  <!-- Movie Details Section -->
  <div class="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
    <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
      <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Movie Details
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Basic Info -->
      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Original Title</h3>
          <p class="text-white text-lg">{movie.original_title}</p>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Release Date</h3>
          <p class="text-white text-lg">{formatDate(movie.release_date)}</p>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Runtime</h3>
          <p class="text-white text-lg">{formatRuntime(movie.runtime)}</p>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Status</h3>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            {movie.status === 'Released' ? 'bg-green-100 text-green-800' : 
             movie.status === 'In Production' ? 'bg-blue-100 text-blue-800' :
             movie.status === 'Post Production' ? 'bg-yellow-100 text-yellow-800' :
             'bg-gray-100 text-gray-800'}">
            {movie.status}
          </span>
        </div>
      </div>
      
      <!-- Financial & Rating Info -->
      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Budget</h3>
          <p class="text-white text-lg">{formatCurrency(movie.budget)}</p>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Revenue</h3>
          <p class="text-white text-lg">{formatCurrency(movie.revenue)}</p>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Rating</h3>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1">
              <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="text-white text-lg font-medium">{movie.vote_average.toFixed(1)}</span>
            </div>
            <span class="text-gray-400">({movie.vote_count.toLocaleString()} votes)</span>
          </div>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Popularity</h3>
          <p class="text-white text-lg">{movie.popularity.toFixed(0)}</p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Production Companies -->
  {#if movie.production_companies?.length > 0}
    <div class="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
      <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-3">
        <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Production Companies
      </h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each movie.production_companies as company}
          <div class="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
            {#if company.logo_path}
              <img
                src="https://image.tmdb.org/t/p/w92{company.logo_path}"
                alt={company.name}
                class="w-12 h-12 object-contain bg-white rounded p-1"
              />
            {:else}
              <div class="w-12 h-12 bg-slate-700 rounded flex items-center justify-center">
                <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            {/if}
            <div>
              <p class="text-white font-medium text-sm">{company.name}</p>
              <p class="text-gray-400 text-xs">{company.origin_country}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Languages & Countries -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Spoken Languages -->
    {#if movie.spoken_languages?.length > 0}
      <div class="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          Languages
        </h3>
        
        <div class="space-y-2">
          {#each movie.spoken_languages as language}
            <div class="flex justify-between items-center p-2 bg-slate-800/30 rounded">
              <span class="text-white">{language.english_name}</span>
              <span class="text-gray-400 text-sm uppercase">{language.iso_639_1}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    <!-- Production Countries -->
    {#if movie.production_countries?.length > 0}
      <div class="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Countries
        </h3>
        
        <div class="space-y-2">
          {#each movie.production_countries as country}
            <div class="flex justify-between items-center p-2 bg-slate-800/30 rounded">
              <span class="text-white">{country.name}</span>
              <span class="text-gray-400 text-sm uppercase">{country.iso_3166_1}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
  
  <!-- External Links -->
  <div class="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
    <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-3">
      <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
      External Links
    </h3>
    
    <div class="flex flex-wrap gap-4">
      {#if movie.homepage}
        <a
          href={movie.homepage}
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Official Website
        </a>
      {/if}
      
      {#if movie.imdb_id}
        <a
          href="https://www.imdb.com/title/{movie.imdb_id}"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
        >
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.31 9.588v4.824h-1.019V9.588h1.019zm-2.796 0v4.824H10.5V9.588h1.014zm7.056 0v4.824h-1.566l-.63-1.898-.63 1.898h-1.566V9.588h1.05v3.412l.798-2.412h.696l.798 2.412V9.588h1.05zm-10.395 0v4.824H6.141V9.588h2.034z"/>
          </svg>
          IMDb
        </a>
      {/if}
    </div>
  </div>
</div>