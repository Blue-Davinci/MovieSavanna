<script lang="ts">
  import type { MovieVideos as MovieVideosType } from '$lib/types/movie.js';
  
  interface Props {
    videos: MovieVideosType;
  }
  
  let { videos }: Props = $props();
  
  // Filter and organize videos
  let trailers = $derived(
    videos.results.filter(video => video.type === 'Trailer' && video.site === 'YouTube')
  );
  
  let teasers = $derived(
    videos.results.filter(video => video.type === 'Teaser' && video.site === 'YouTube')
  );
  
  let clips = $derived(
    videos.results.filter(video => video.type === 'Clip' && video.site === 'YouTube')
  );
  
  let featurettes = $derived(
    videos.results.filter(video => video.type === 'Featurette' && video.site === 'YouTube')
  );
  
  // Get YouTube thumbnail URL
  function getYouTubeThumbnail(key: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'medium'): string {
    return `https://img.youtube.com/vi/${key}/${quality}default.jpg`;
  }
  
  // Handle video play
  function playVideo(videoKey: string) {
    window.open(`https://www.youtube.com/watch?v=${videoKey}`, '_blank');
  }
  
  // Format video duration or size
  function getVideoInfo(video: any): string {
    if (video.size) {
      return `${video.size}p`;
    }
    return 'HD';
  }
  
  // ✅ ADDED: Keyboard event handler
  function handleKeydown(event: KeyboardEvent, videoKey: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      playVideo(videoKey);
    }
  }
</script>

{#if videos.results.length > 0}
  <div class="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
    <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
      <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      Videos & Trailers
    </h2>
    
    <div class="space-y-8">
      <!-- Trailers -->
      {#if trailers.length > 0}
        <div>
          <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
            Trailers ({trailers.length})
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each trailers as video}
              <button
                class="group cursor-pointer text-left w-full"
                onclick={() => playVideo(video.key)}
                onkeydown={(e) => handleKeydown(e, video.key)}
                aria-label="Play trailer: {video.name}"
              >
                <div class="relative overflow-hidden rounded-lg bg-slate-800">
                  <img
                    src={getYouTubeThumbnail(video.key, 'medium')}
                    alt={video.name}
                    class="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  <!-- Play overlay -->
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="bg-red-600 rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <svg class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Video info badge -->
                  <div class="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                    {getVideoInfo(video)}
                  </div>
                  
                  {#if video.official}
                    <div class="absolute top-3 left-3 bg-green-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                      Official
                    </div>
                  {/if}
                </div>
                
                <div class="mt-3">
                  <h4 class="text-white font-medium line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {video.name}
                  </h4>
                  <p class="text-gray-400 text-sm mt-1">
                    {new Date(video.published_at).toLocaleDateString()}
                  </p>
                </div>
              </button>
            {/each}
          </div>
        </div>
      {/if}
      
      <!-- Teasers -->
      {#if teasers.length > 0}
        <div>
          <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a1 1 0 00-1 1v14a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1m-1 0V2" />
            </svg>
            Teasers ({teasers.length})
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            {#each teasers as video}
              <button
                class="group cursor-pointer text-left w-full"
                onclick={() => playVideo(video.key)}
                onkeydown={(e) => handleKeydown(e, video.key)}
                aria-label="Play teaser: {video.name}"
              >
                <div class="relative overflow-hidden rounded-lg bg-slate-800">
                  <img
                    src={getYouTubeThumbnail(video.key)}
                    alt={video.name}
                    class="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  <!-- Play overlay -->
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="bg-blue-600 rounded-full p-3">
                      <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div class="mt-2">
                  <h4 class="text-white text-sm font-medium line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {video.name}
                  </h4>
                </div>
              </button>
            {/each}
          </div>
        </div>
      {/if}
      
      <!-- Clips & Featurettes -->
      {#if clips.length > 0 || featurettes.length > 0}
        <div>
          <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Behind the Scenes
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each [...clips, ...featurettes] as video}
              <button
                class="group cursor-pointer text-left w-full"
                onclick={() => playVideo(video.key)}
                onkeydown={(e) => handleKeydown(e, video.key)}
                aria-label="Play {video.type.toLowerCase()}: {video.name}"
              >
                <div class="relative overflow-hidden rounded-lg bg-slate-800">
                  <img
                    src={getYouTubeThumbnail(video.key)}
                    alt={video.name}
                    class="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  <!-- Play overlay -->
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="bg-purple-600 rounded-full p-3">
                      <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Video type badge -->
                  <div class="absolute top-2 left-2 bg-purple-600/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                    {video.type}
                  </div>
                </div>
                
                <div class="mt-2">
                  <h4 class="text-white text-sm font-medium line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {video.name}
                  </h4>
                </div>
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{:else}
  <div class="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 text-center">
    <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
    <h3 class="text-lg font-medium text-gray-400 mb-2">No Videos Available</h3>
    <p class="text-gray-500">No trailers or videos found for this movie.</p>
  </div>
{/if}

<style>
  .line-clamp-2 {
    display: -webkit-box;
    display: -moz-box;
    display: box;
    -webkit-line-clamp: 2;
    -moz-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    -moz-box-orient: vertical;
    box-orient: vertical;
    overflow: hidden;
  }
</style>