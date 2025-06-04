<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  // Correct $state() rune syntax
  let scrolled = $state(false);
  let mobileMenuOpen = $state(false);
  
  onMount(() => {
    if (!browser) return;
    
    const handleScroll = () => {
      scrolled = window.scrollY > 20;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
</script>

<header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" class:bg-slate-900-95={scrolled} class:backdrop-blur-md={scrolled} class:shadow-lg={scrolled}>
  <div class="container mx-auto px-4 py-4 flex items-center justify-between">
    <!-- Logo -->
    <div class="flex items-center">
      <a href="/" class="flex items-center group">
        <span class="text-blue-500 font-bold text-2xl mr-1 group-hover:text-blue-400 transition-colors">Movie</span>
        <span class="text-white font-bold text-2xl group-hover:text-gray-200 transition-colors">Savanna</span>
      </a>
    </div>
    
    <!-- Desktop Navigation -->
    <nav class="hidden lg:flex items-center space-x-8">
      <a href="/" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium">Home</a>
      <a href="/movies" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium">Movies</a>
      <a href="/categories" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium">Categories</a>
      <a href="/pricing" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium">Pricing</a>
      <a href="/about" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium">About</a>
    </nav>
    
    <!-- Desktop Auth Buttons -->
    <div class="hidden lg:flex items-center space-x-4">
      <a 
        href="/login" 
        class="text-white/90 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
      >
        Sign In
      </a>
      <a 
        href="/signup" 
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        Sign Up
      </a>
    </div>
    
    <!-- Mobile Menu Button -->
    <button 
      class="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300" 
      onclick={toggleMobileMenu}
      aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
      aria-expanded={mobileMenuOpen}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6 transition-transform duration-300" class:rotate-90={mobileMenuOpen}>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
      </svg>
    </button>
  </div>
  
  <!-- Mobile Menu -->
  {#if mobileMenuOpen}
    <div class="lg:hidden bg-slate-900/98 backdrop-blur-md border-t border-white/10 shadow-2xl">
      <div class="container mx-auto px-4 py-6">
        <!-- Mobile Navigation Links -->
        <nav class="flex flex-col space-y-4 mb-6">
          <a href="/" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium py-2 border-b border-white/10">Home</a>
          <a href="/movies" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium py-2 border-b border-white/10">Movies</a>
          <a href="/categories" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium py-2 border-b border-white/10">Categories</a>
          <a href="/pricing" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium py-2 border-b border-white/10">Pricing</a>
          <a href="/about" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium py-2">About</a>
        </nav>
        
        <!-- Mobile Auth Buttons -->
        <div class="flex flex-col space-y-3 pt-4 border-t border-white/10">
          <a 
            href="/signin" 
            class="text-center text-white/90 hover:text-white font-medium py-3 px-4 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300"
          >
            Sign In
          </a>
          <a 
            href="/signup" 
            class="text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  {/if}
</header>