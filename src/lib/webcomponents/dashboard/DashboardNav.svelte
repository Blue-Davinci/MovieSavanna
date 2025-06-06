<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  
  //  AppUser interface for type safety
  interface AppUser {
    id: string;
    email: string | undefined;
    emailConfirmed: boolean;
    avatar: string | null;
    user_metadata?: {
      first_name?: string;
      last_name?: string;
    };
  }
  
  // State
  let scrolled = $state(false);
  let mobileMenuOpen = $state(false);
  let isLoggingOut = $state(false);
  
  let { user = null } = $props<{ user: AppUser | null }>();
  console.log('>>cUser Information:', user);
  
  // Current route for active states
  let currentPath = $derived($page.url.pathname);
  
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
    isLoggingOut = true;
    return async ({ update }) => {
      await update();
      isLoggingOut = false;
    };
  };

  function getUserInitials(user: AppUser | null): string {
    if (!user) return 'U';
    
    if (user?.user_metadata?.first_name) {
      const firstName = user.user_metadata.first_name[0];
      const lastName = user.user_metadata?.last_name?.[0] || '';
      return (firstName + lastName).toUpperCase();
    }
    
    return user.email?.[0]?.toUpperCase() || 'U';
  }


  function getUserDisplayName(user: AppUser | null): string {
    if (!user) return 'User';
    
    // First check for user_metadata (though we don't use this now)
    if (user.user_metadata?.first_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata?.last_name || ''}`.trim();
    }
    
    if (user.email) {
      const emailPrefix = user.email.split('@')[0];
      
      // If email has dots, assume it's "first.last" format
      if (emailPrefix.includes('.')) {
        const parts = emailPrefix.split('.');
        return parts
          .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
      }
      
      // Otherwise, just capitalize the first letter
      return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    }
    
    // Fallback to generic name
    return 'User';
  }

  // Check if route is active
  function isActiveRoute(route: string): boolean {
    if (route === '/dashboard' && currentPath === '/dashboard') return true;
    if (route !== '/dashboard' && currentPath.startsWith(route)) return true;
    return false;
  }

  // Navigation items
  const navItems = [
    {
      href: '/dashboard',
      label: 'Discover',
      icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
    },
    {
      href: '/dashboard/favorites',
      label: 'Favorites',
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
    }
  ];
</script>

<header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" 
        class:bg-slate-900-95={scrolled} 
        class:backdrop-blur-md={scrolled} 
        class:shadow-lg={scrolled}
        class:bg-slate-900-50={!scrolled}>
  <div class="container mx-auto px-4 py-4 flex items-center justify-between">
    <!-- Logo -->
    <div class="flex items-center">
      <a href="/dashboard" class="flex items-center group">
        <span class="text-blue-500 font-bold text-2xl mr-1 group-hover:text-blue-400 transition-colors">Movie</span>
        <span class="text-white font-bold text-2xl group-hover:text-gray-200 transition-colors">Savanna</span>
      </a>
    </div>
    
    <!-- Desktop Navigation -->
    <nav class="hidden md:flex items-center space-x-6">
      {#each navItems as item}
        <a 
          href={item.href}
          class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200"
          class:text-blue-400={isActiveRoute(item.href)}
          class:bg-blue-500-10={isActiveRoute(item.href)}
          class:text-white-90={!isActiveRoute(item.href)}
          class:hover:text-blue-400={!isActiveRoute(item.href)}
          class:hover:bg-white-5={!isActiveRoute(item.href)}
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
          </svg>
          {item.label}
        </a>
      {/each}
    </nav>
    
    <!-- Desktop User Section -->
    <div class="hidden md:flex items-center space-x-4">
      <!-- User Avatar & Info -->
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center ring-2 ring-blue-500/20">
          <span class="text-white font-semibold text-sm">
            {getUserInitials(user)}
          </span>
        </div>
        <div class="hidden lg:block">
          <p class="text-white font-medium text-sm">
            {getUserDisplayName(user)}
          </p>
          {#if user?.email}
            <p class="text-gray-400 text-xs truncate max-w-32">{user.email}</p>
          {/if}
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex items-center space-x-2">
        <!-- Home Link -->
        <a
          href="/"
          class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          title="Back to Home"
          aria-label="Back to Home"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </a>

        <!-- Logout Button -->
        <form 
          method="POST" 
          action="/logout"
          use:enhance={handleLogout}
          class="inline-block"
        >
          <button
            type="submit"
            disabled={isLoggingOut}
            class="flex items-center space-x-2 px-3 py-2 bg-red-600/80 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            title="Sign out"
          >
            {#if isLoggingOut}
              <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            {/if}
            <span class="hidden xl:inline">
              {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
            </span>
          </button>
        </form>
      </div>
    </div>
    
    <!-- Mobile Menu Button -->
    <button 
      class="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300" 
      onclick={toggleMobileMenu}
      aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
      aria-expanded={mobileMenuOpen}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" 
           class="w-6 h-6 transition-transform duration-300" 
           class:rotate-90={mobileMenuOpen}>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
      </svg>
    </button>
  </div>
  
  <!-- Mobile Menu -->
  {#if mobileMenuOpen}
    <div class="md:hidden bg-slate-900/98 backdrop-blur-md border-t border-white/10 shadow-2xl">
      <div class="container mx-auto px-4 py-6">
        <!-- Mobile Navigation Links -->
        <nav class="flex flex-col space-y-3 mb-6">
          {#each navItems as item}
            <a 
              href={item.href}
              class="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200"
              class:text-blue-400={isActiveRoute(item.href)}
              class:bg-blue-500-10={isActiveRoute(item.href)}
              class:text-white-90={!isActiveRoute(item.href)}
              class:hover:text-blue-400={!isActiveRoute(item.href)}
              class:hover:bg-white-5={!isActiveRoute(item.href)}
              onclick={() => mobileMenuOpen = false}
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
              </svg>
              {item.label}
            </a>
          {/each}
          
          <!-- Mobile Home Link -->
          <a 
            href="/"
            class="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-white/90 hover:text-blue-400 hover:bg-white/5 transition-all duration-200 border-t border-white/10 mt-3 pt-6"
            onclick={() => mobileMenuOpen = false}
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </a>
        </nav>
        
        <!-- Mobile User Section -->
        <div class="pt-4 border-t border-white/10">
          <!-- User Info -->
          <div class="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-lg mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center ring-2 ring-blue-500/20">
              <span class="text-white font-semibold">
                {getUserInitials(user)}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white font-medium truncate">
                {getUserDisplayName(user)}
              </p>
              {#if user?.email}
                <p class="text-gray-400 text-sm truncate">{user.email}</p>
              {/if}
            </div>
          </div>

          <!-- Mobile Logout -->
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
      </div>
    </div>
  {/if}
</header>