<script lang="ts">
  import MovieGrid from "$lib/webcomponents/movies/MovieGrid.svelte";
  import type { PageData } from './$types';
  
  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Dashboard - MovieSavanna</title>
  <meta name="description" content="Discover and explore thousands of movies on your personal dashboard" />
</svelte:head>

<!-- Hero Section (ToDo: Break this up too) -->
<section class="pt-24 pb-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
  <div class="container mx-auto px-4">
    <div class="text-center mb-8">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
        Discover <span class="text-blue-500">Movie</span> Savanna
      </h1>
      <p class="text-gray-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
        Explore thousands of movies, search for your favorites, and discover new gems. 
        Your personal cinema experience starts here.
      </p>
    </div>
    
    <!-- Quick Stats (ToDo: We can break this up) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
      <div class="text-center p-4 bg-slate-800/50 rounded-lg backdrop-blur-sm">
        <div class="text-2xl md:text-3xl font-bold text-blue-400 mb-1">1M+</div>
        <div class="text-gray-400 text-sm">Movies</div>
      </div>
      <div class="text-center p-4 bg-slate-800/50 rounded-lg backdrop-blur-sm">
        <div class="text-2xl md:text-3xl font-bold text-green-400 mb-1">HD</div>
        <div class="text-gray-400 text-sm">Quality</div>
      </div>
      <div class="text-center p-4 bg-slate-800/50 rounded-lg backdrop-blur-sm">
        <div class="text-2xl md:text-3xl font-bold text-purple-400 mb-1">24/7</div>
        <div class="text-gray-400 text-sm">Available</div>
      </div>
      <div class="text-center p-4 bg-slate-800/50 rounded-lg backdrop-blur-sm">
        <div class="text-2xl md:text-3xl font-bold text-yellow-400 mb-1">Free</div>
        <div class="text-gray-400 text-sm">Browsing</div>
      </div>
    </div>
  </div>
</section>

<!-- Movie Grid Section -->
<section class="bg-slate-950">
  <MovieGrid 
    title="Popular Movies" 
    showSearch={true}
    initialMovies={data.popularMovies}
  />
</section>