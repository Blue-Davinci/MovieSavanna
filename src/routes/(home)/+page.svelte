<script lang="ts">
  import { onMount } from 'svelte';
  import PricingPlans from '$lib/webcomponents/home/PricingPlans.svelte';
  import MovieCategories from '$lib/webcomponents/home/MovieCategories.svelte';
  import Features from '$lib/webcomponents/home/Features.svelte';
  import Footer from '$lib/webcomponents/home/Footer.svelte';
  
  // Hero section state
  let currentSlide = $state(0);
  let data = $props();
  let userInformation = data.data.userInformation;
  console.log("Home page data:", data.data);
  
  let slides = $state([
    {
      id: 1,
      title: "Let's Make Your Own Cinema",
      subtitle: "You can still enjoy the latest movies and other movies online and at a lower price",
      image: "https://images.pexels.com/photos/4048182/pexels-photo-4048182.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "Movie scene with dramatic lighting"
    },
    {
      id: 2,
      title: "Discover New Worlds",
      subtitle: "Stream thousands of movies from the comfort of your home",
      image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "Person watching a movie"
    },
    {
      id: 3,
      title: "Cinema-Quality Experience",
      subtitle: "The best streaming quality with 4K and HDR support",
      image: "https://images.pexels.com/photos/2335046/pexels-photo-2335046.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "Cinema experience"
    }
  ]);
  
  // Featured movies section state
  interface Movie {
    id: number;
    title: string;
    image: string;
    year: number;
    rating: number;
    duration: string;
    genre: string;
  }
  
  let activeFilter = $state('all');
  let movies = $state<Movie[]>([
    {
      id: 1,
      title: "The Last Frontier",
      image: "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=1600",
      year: 2023,
      rating: 8.5,
      duration: "2h 15m",
      genre: "action"
    },
    {
      id: 2,
      title: "Dark Waters",
      image: "https://images.pexels.com/photos/4666754/pexels-photo-4666754.jpeg?auto=compress&cs=tinysrgb&w=1600",
      year: 2023,
      rating: 7.8,
      duration: "1h 58m",
      genre: "thriller"
    },
    {
      id: 3,
      title: "City of Dreams",
      image: "https://images.pexels.com/photos/3945317/pexels-photo-3945317.jpeg?auto=compress&cs=tinysrgb&w=1600",
      year: 2022,
      rating: 8.2,
      duration: "2h 10m",
      genre: "drama"
    },
    {
      id: 4,
      title: "The Highlands",
      image: "https://images.pexels.com/photos/2272854/pexels-photo-2272854.jpeg?auto=compress&cs=tinysrgb&w=1600",
      year: 2022,
      rating: 7.9,
      duration: "2h 5m",
      genre: "adventure"
    },
    {
      id: 5,
      title: "Cosmic Journey",
      image: "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1600",
      year: 2023,
      rating: 8.8,
      duration: "2h 30m",
      genre: "action"
    },
    {
      id: 6,
      title: "Silent Echo",
      image: "https://images.pexels.com/photos/2889942/pexels-photo-2889942.jpeg?auto=compress&cs=tinysrgb&w=1600",
      year: 2022,
      rating: 7.6,
      duration: "1h 45m",
      genre: "thriller"
    }
  ]);
  
  // Derived states
  let current = $derived(slides[currentSlide]);
  let filteredMovies = $derived(
    activeFilter === 'all' 
      ? movies 
      : movies.filter(movie => movie.genre === activeFilter)
  );
  
  // Hero section functions
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  }
  
  // Featured movies functions
  function setFilter(filter: string) {
    activeFilter = filter;
  }
  
  onMount(() => {
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  });
</script>

<!-- Hero Section -->
<section class="relative h-screen flex items-center justify-start overflow-hidden">
  <div class="absolute inset-0 z-0">
    {#each slides as slide, i}
      <div 
        class="absolute inset-0 transition-opacity duration-1000 bg-cover bg-center" 
        style="background-image: url('{slide.image}'); opacity: {i === currentSlide ? '1' : '0'};"
        aria-hidden={i !== currentSlide}
      >
        <div class="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/60"></div>
      </div>
    {/each}
  </div>
  
  <div class="container mx-auto px-4 relative z-10 pt-32 md:pt-0">
    <div class="max-w-2xl">
      <p class="text-blue-400 font-medium mb-2">Welcome</p>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight">{current.title}</h1>
      <p class="text-lg text-gray-300 mb-8">{current.subtitle}</p>
      
      <div class="flex flex-wrap gap-4">
        <a href="/plans" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
          Show Plan
        </a>
        <a href="/start" class="border border-white/50 text-white hover:bg-white hover:text-slate-900 font-semibold py-3 px-6 rounded-lg transition-all duration-300 backdrop-blur-sm">
          Get Started
        </a>
      </div>
      
      <div class="mt-8 flex items-center">
        <div class="bg-slate-800/80 backdrop-blur-sm p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6 text-white">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span class="ml-3 text-white">Watching Now</span>
      </div>
    </div>
  </div>
  
  <!-- Slide indicators -->
  <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
    {#each slides as _, i}
      <button 
        class="w-3 h-3 rounded-full transition-all duration-300" 
        class:bg-blue-500={i === currentSlide} 
        class:bg-white-30={i !== currentSlide}
        onclick={() => currentSlide = i}
        aria-label={`Go to slide ${i + 1}`}
      ></button>
    {/each}
  </div>
  
  <!-- Navigation buttons -->
  <button 
    class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-slate-800/50 hover:bg-slate-800/80 p-3 rounded-full z-10 text-white transition-all duration-300"
    onclick={prevSlide}
    aria-label="Previous slide"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
  
  <button 
    class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-slate-800/50 hover:bg-slate-800/80 p-3 rounded-full z-10 text-white transition-all duration-300"
    onclick={nextSlide}
    aria-label="Next slide"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>
</section>

<!-- Featured Movies Section -->
<section class="py-20 bg-slate-950">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Featured Movies</h2>
      <p class="text-gray-400 max-w-2xl mx-auto">Discover the latest blockbusters and critically acclaimed films in our curated collection</p>
    </div>
    
    <!-- Filter buttons -->
    <div class="flex flex-wrap justify-center gap-4 mb-12">
      {#each ['all', 'action', 'drama', 'thriller', 'adventure'] as filter}
        <button 
          class="px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105" 
          class:bg-blue-600={activeFilter === filter} 
          class:text-white={activeFilter === filter}
          class:shadow-lg={activeFilter === filter}
          class:bg-slate-800={activeFilter !== filter}
          class:text-gray-300={activeFilter !== filter}
          class:hover:bg-slate-700={activeFilter !== filter}
          onclick={() => setFilter(filter)}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      {/each}
    </div>
    
    <!-- Movies grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each filteredMovies as movie}
        <div class="bg-slate-900 rounded-lg overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div class="relative overflow-hidden aspect-[2/3]">
            <img 
              src={movie.image} 
              alt={movie.title} 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70"></div>
            
            <!-- Rating badge -->
            <div class="absolute top-3 right-3 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
              ⭐ {movie.rating}
            </div>
            
            <!-- Movie info overlay -->
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h3 class="text-xl font-bold text-white mb-2 line-clamp-2">{movie.title}</h3>
              <div class="flex items-center text-sm text-gray-300 mb-2">
                <span>{movie.year}</span>
                <span class="mx-2">•</span>
                <span>{movie.duration}</span>
                <span class="mx-2">•</span>
                <span class="capitalize bg-slate-700 px-2 py-1 rounded text-xs">{movie.genre}</span>
              </div>
            </div>
            
            <!-- Hover overlay with play button -->
            <div class="absolute inset-0 bg-slate-900/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <button 
                class="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg"
                aria-label={`Play ${movie.title}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- View all movies button -->
    <div class="mt-16 text-center">
      <a 
        href="/movies" 
        class="inline-flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
      >
        View All Movies
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
  </div>
</section>

<PricingPlans />
<MovieCategories />
<Features />
<Footer />