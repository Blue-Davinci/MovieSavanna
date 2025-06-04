<script lang="ts">
  interface Category {
    id: string;
    name: string;
    count: string;
    image: string;
    color: string;
    icon?: string;
  }
  
  // Use correct Svelte 5 $state syntax
  let categories = $state<Category[]>([
    {
      id: "action",
      name: "Action",
      count: "1,300+ Movies",
      image: "https://images.pexels.com/photos/4841820/pexels-photo-4841820.jpeg?auto=compress&cs=tinysrgb&w=1600",
      color: "from-red-600/90 to-red-900/60",
      icon: "💥"
    },
    {
      id: "fantasy",
      name: "Fantasy",
      count: "800+ Movies",
      image: "https://images.pexels.com/photos/3400050/pexels-photo-3400050.jpeg?auto=compress&cs=tinysrgb&w=1600",
      color: "from-blue-600/90 to-blue-900/60",
      icon: "🌟"
    },
    {
      id: "comedy",
      name: "Comedy",
      count: "1,000+ Movies",
      image: "https://images.pexels.com/photos/7991486/pexels-photo-7991486.jpeg?auto=compress&cs=tinysrgb&w=1600",
      color: "from-yellow-600/90 to-yellow-900/60",
      icon: "😂"
    },
    {
      id: "drama",
      name: "Drama",
      count: "1,500+ Movies",
      image: "https://images.pexels.com/photos/8107206/pexels-photo-8107206.jpeg?auto=compress&cs=tinysrgb&w=1600",
      color: "from-purple-600/90 to-purple-900/60",
      icon: "🎭"
    }
  ]);
  
  let secondRowCategories = $state<Category[]>([
    {
      id: "mystery",
      name: "Mystery",
      count: "500+ Movies",
      image: "https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1600",
      color: "from-green-600/90 to-green-900/60",
      icon: "🔍"
    },
    {
      id: "romance",
      name: "Romance",
      count: "900+ Movies",
      image: "https://images.pexels.com/photos/5231334/pexels-photo-5231334.jpeg?auto=compress&cs=tinysrgb&w=1600",
      color: "from-pink-600/90 to-pink-900/60",
      icon: "💕"
    },
    {
      id: "horror",
      name: "Horror",
      count: "750+ Movies",
      image: "https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg?auto=compress&cs=tinysrgb&w=1600",
      color: "from-slate-600/90 to-slate-900/60",
      icon: "👻"
    },
    {
      id: "thriller",
      name: "Thriller",
      count: "650+ Movies",
      image: "https://images.pexels.com/photos/5662857/pexels-photo-5662857.jpeg?auto=compress&cs=tinysrgb&w=1600",
      color: "from-orange-600/90 to-orange-900/60",
      icon: "⚡"
    }
  ]);
  
  // Combine all categories for easier management
  let allCategories = $derived([...categories, ...secondRowCategories]);
  
  function handleCategoryClick(categoryId: string) {
    console.log('Selected category:', categoryId);
    // Add navigation logic here
  }
</script>

<section class="py-20 bg-slate-950">
  <div class="container mx-auto px-4">
    <!-- Section Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-6">
      <div class="max-w-2xl">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          Choose The Type Of Film 
          <span class="text-blue-500">You Love</span>
        </h2>
        <p class="text-gray-400 text-lg leading-relaxed">
          Explore our vast collection across multiple genres. From heart-pounding action to 
          tear-jerking dramas, find exactly what you're in the mood for.
        </p>
      </div>
      
      <a 
        href="/categories" 
        class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
      >
        View All Categories
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
    
    <!-- First Row Categories -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {#each categories as category}
        <a 
          href={`/category/${category.id}`} 
          class="group cursor-pointer"
          onclick={() => handleCategoryClick(category.id)}
        >
          <div class="relative overflow-hidden rounded-2xl aspect-[4/3] bg-slate-900 shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
            <!-- Background Image -->
            <img 
              src={category.image} 
              alt={category.name} 
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            
            <!-- Gradient Overlay -->
            <div class={`absolute inset-0 bg-gradient-to-t ${category.color} transition-opacity duration-300 group-hover:opacity-90`}></div>
            
            <!-- Content Overlay -->
            <div class="absolute inset-0 flex flex-col justify-between p-6">
              <!-- Icon -->
              <div class="flex justify-end">
                <div class="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  {category.icon}
                </div>
              </div>
              
              <!-- Category Info -->
              <div class="transform transition-all duration-300 group-hover:translate-y-0 translate-y-2">
                <h3 class="text-2xl font-bold text-white mb-2 transform transition-all duration-300">
                  {category.name}
                </h3>
                <p class="text-white/90 font-medium transform transition-all duration-300 delay-75">
                  {category.count}
                </p>
                
                <!-- Hover Arrow -->
                <div class="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                  <div class="flex items-center text-white/90">
                    <span class="text-sm font-medium mr-2">Explore</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Shine Effect on Hover -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </div>
        </a>
      {/each}
    </div>
    
    <!-- Second Row Categories -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each secondRowCategories as category}
        <a 
          href={`/category/${category.id}`} 
          class="group cursor-pointer"
          onclick={() => handleCategoryClick(category.id)}
        >
          <div class="relative overflow-hidden rounded-2xl aspect-[4/3] bg-slate-900 shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
            <!-- Background Image -->
            <img 
              src={category.image} 
              alt={category.name} 
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            
            <!-- Gradient Overlay -->
            <div class={`absolute inset-0 bg-gradient-to-t ${category.color} transition-opacity duration-300 group-hover:opacity-90`}></div>
            
            <!-- Content Overlay -->
            <div class="absolute inset-0 flex flex-col justify-between p-6">
              <!-- Icon -->
              <div class="flex justify-end">
                <div class="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  {category.icon}
                </div>
              </div>
              
              <!-- Category Info -->
              <div class="transform transition-all duration-300 group-hover:translate-y-0 translate-y-2">
                <h3 class="text-2xl font-bold text-white mb-2 transform transition-all duration-300">
                  {category.name}
                </h3>
                <p class="text-white/90 font-medium transform transition-all duration-300 delay-75">
                  {category.count}
                </p>
                
                <!-- Hover Arrow -->
                <div class="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                  <div class="flex items-center text-white/90">
                    <span class="text-sm font-medium mr-2">Explore</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Shine Effect on Hover -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </div>
        </a>
      {/each}
    </div>
    
    <!-- Stats Section -->
    <div class="mt-16 bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-500 mb-2">8+</div>
          <div class="text-gray-400">Movie Categories</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-500 mb-2">6,000+</div>
          <div class="text-gray-400">Total Movies</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-500 mb-2">4K</div>
          <div class="text-gray-400">Ultra HD Quality</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-500 mb-2">24/7</div>
          <div class="text-gray-400">New Releases</div>
        </div>
      </div>
    </div>
  </div>
</section>