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

<header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" class:bg-dark-900-95={scrolled} class:backdrop-blur-md={scrolled}>
  <div class="container-custom py-4 flex items-center justify-between">
    <div class="flex items-center">
      <a href="/" class="flex items-center">
        <span class="text-secondary-500 font-bold text-2xl mr-1">Movie</span>
        <span class="text-white font-bold text-2xl">Savanna</span>
      </a>
    </div>
    
    <nav class="hidden md:flex items-center space-x-8">
      <a href="/" class="text-white hover:text-primary-400 transition-colors">Home</a>
      <a href="/movies" class="text-white hover:text-primary-400 transition-colors">Movies</a>
      <a href="/categories" class="text-white hover:text-primary-400 transition-colors">Categories</a>
      <a href="/pricing" class="text-white hover:text-primary-400 transition-colors">Pricing</a>
      <a href="/about" class="text-white hover:text-primary-400 transition-colors">About</a>
    </nav>
    
    <div class="hidden md:flex items-center space-x-4">
      <a href="/signin" class="text-white hover:text-primary-400 transition-colors">Sign In</a>
      <a href="/signup" class="btn-primary">Sign Up</a>
    </div>
    
    <button 
      class="md:hidden text-white" 
      onclick={toggleMobileMenu}
      aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
      aria-expanded={mobileMenuOpen}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
      </svg>
    </button>
  </div>
  
  {#if mobileMenuOpen}
    <div class="md:hidden bg-dark-900/95 backdrop-blur-md">
      <div class="container-custom py-4 flex flex-col space-y-4">
        <a href="/" class="text-white hover:text-primary-400 transition-colors">Home</a>
        <a href="/movies" class="text-white hover:text-primary-400 transition-colors">Movies</a>
        <a href="/categories" class="text-white hover:text-primary-400 transition-colors">Categories</a>
        <a href="/pricing" class="text-white hover:text-primary-400 transition-colors">Pricing</a>
        <a href="/about" class="text-white hover:text-primary-400 transition-colors">About</a>
        <div class="flex flex-col space-y-2 pt-2 border-t border-white/10">
          <a href="/signin" class="text-white hover:text-primary-400 transition-colors">Sign In</a>
          <a href="/signup" class="btn-primary text-center">Sign Up</a>
        </div>
      </div>
    </div>
  {/if}
</header>