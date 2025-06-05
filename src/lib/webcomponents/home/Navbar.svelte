<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  
  // Correct $state() rune syntax
  let scrolled = $state(false);
  let mobileMenuOpen = $state(false);
  let isLoggingOut = $state(false);
  
  // Props from parent (layout)
  let { isAuthenticated = false, user = null } = $props();
  
  console.log("Navbar isAuthenticated:", isAuthenticated, "User:", user);
  
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

  // Enhanced logout function
  const handleLogout: SubmitFunction = () => {
    console.log("Logging out...");
  };

  // Get user initials for avatar
  function getUserInitials(user: any): string {
    if (user?.user_metadata?.first_name) {
      const firstName = user.user_metadata.first_name[0];
      const lastName = user.user_metadata?.last_name?.[0] || '';
      return (firstName + lastName).toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  }

  // Get user display name
  function getUserDisplayName(user: any): string {
    if (user?.user_metadata?.first_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata?.last_name || ''}`.trim();
    }
    return user?.email?.split('@')[0] || 'User';
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
      {#if isAuthenticated}
        <a href="/dashboard" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium">Dashboard</a>
        <a href="/favorites" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium">Favorites</a>
      {/if}
      <a href="/about" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium">About</a>
    </nav>
    
    <!-- Desktop Auth Section -->
    <div class="hidden lg:flex items-center space-x-4">
      {#if isAuthenticated}
        <!-- Authenticated User UI -->
        <div class="flex items-center space-x-3">
          <!-- User Avatar & Info -->
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span class="text-white font-semibold text-sm">
                {getUserInitials(user)}
              </span>
            </div>
            <div class="hidden xl:block">
              <p class="text-white font-medium text-sm">
                {getUserDisplayName(user)}
              </p>
              {#if user?.email}
                <p class="text-gray-400 text-xs">{user.email}</p>
              {/if}
            </div>
          </div>

          <!-- Logout Form -->
          <form 
            method="POST" 
            action="/logout"
            use:enhance={handleLogout}
            class="inline-block"
          >
            <button
              type="submit"
              disabled={isLoggingOut}
              class="flex items-center space-x-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sign out"
            >
              {#if isLoggingOut}
                <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="hidden xl:inline">Signing Out...</span>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span class="hidden xl:inline">Sign Out</span>
              {/if}
            </button>
          </form>
        </div>
      {:else}
        <!-- Non-authenticated User UI -->
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
      {/if}
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
          <a href="/" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium py-2 border-b border-white/10" onclick={() => mobileMenuOpen = false}>Home</a>
          <a href="/movies" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium py-2 border-b border-white/10" onclick={() => mobileMenuOpen = false}>Movies</a>
          {#if isAuthenticated}
            <a href="/dashboard" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium py-2 border-b border-white/10" onclick={() => mobileMenuOpen = false}>Dashboard</a>
            <a href="/favorites" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium py-2 border-b border-white/10" onclick={() => mobileMenuOpen = false}>Favorites</a>
          {/if}
          <a href="/about" class="text-white/90 hover:text-blue-400 transition-colors duration-300 font-medium py-2" onclick={() => mobileMenuOpen = false}>About</a>
        </nav>
        
        <!-- Mobile Auth Section -->
        <div class="pt-4 border-t border-white/10">
          {#if isAuthenticated}
            <!-- Mobile Authenticated User UI -->
            <div class="space-y-4">
              <!-- User Info -->
              <div class="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-semibold">
                    {getUserInitials(user)}
                  </span>
                </div>
                <div class="flex-1">
                  <p class="text-white font-medium">
                    {getUserDisplayName(user)}
                  </p>
                  {#if user?.email}
                    <p class="text-gray-400 text-sm truncate">{user.email}</p>
                  {/if}
                </div>
              </div>

              <!-- Mobile Logout Form -->
              <form 
                method="POST" 
                action="/logout"
                use:enhance={handleLogout}
                class="w-full"
              >
                <button
                  type="submit"
                  disabled={isLoggingOut}
                  class="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-600/80 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {#if isLoggingOut}
                    <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing Out...</span>
                  {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  {/if}
                </button>
              </form>
            </div>
          {:else}
            <!-- Mobile Non-authenticated User UI -->
            <div class="flex flex-col space-y-3">
              <a 
                href="/login" 
                class="text-center text-white/90 hover:text-white font-medium py-3 px-4 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300"
                onclick={() => mobileMenuOpen = false}
              >
                Sign In
              </a>
              <a 
                href="/signup" 
                class="text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                onclick={() => mobileMenuOpen = false}
              >
                Sign Up
              </a>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</header>