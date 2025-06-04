<script lang="ts">
  interface Feature {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
  }
  
  // Use correct Svelte 5 $state syntax
  let features = $state<Feature[]>([
    {
      id: "official",
      title: "Official Movies",
      description: "We provide new films that are ready to be shown in cinemas on this platform with licensed content",
      icon: "🎬",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "choice",
      title: "Best Choice",
      description: "The best choice for all circles and every need for films that are curated and ready to stream",
      icon: "⭐",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      id: "stream",
      title: "4K HD Streaming",
      description: "We provide the best streaming quality with 4K, HDR support and adaptive bitrate for your enjoyment",
      icon: "📺",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "download",
      title: "Offline Download",
      description: "Download your favorite movies and watch them offline whenever you want, anywhere you go",
      icon: "📱",
      color: "from-green-500 to-green-600"
    }
  ]);
  
  let isVisible = $state(false);
  
  function handleFeatureClick(featureId: string) {
    console.log('Feature clicked:', featureId);
    // Add feature interaction logic here
  }
</script>

<section class="py-20 bg-slate-950">
  <div class="container mx-auto px-4">
    <!-- Section Header -->
    <div class="text-center max-w-4xl mx-auto mb-16">
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
        Best Features That 
        <span class="text-blue-500">Won't Disappoint</span>
      </h2>
      <p class="text-gray-400 text-lg leading-relaxed">
        Experience cinema like never before with our cutting-edge platform designed for movie lovers who demand the best.
      </p>
    </div>
    
    <!-- Features Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
      {#each features as feature, index}
        <div 
          class="group cursor-pointer"
          onclick={() => handleFeatureClick(feature.id)}
          role="button"
          tabindex="0"
          onkeydown={(e) => e.key === 'Enter' && handleFeatureClick(feature.id)}
        >
          <div class="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 transition-all duration-500 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2 h-full">
            <!-- Icon Container -->
            <div class="mb-6 relative">
              <div class={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                {feature.icon}
              </div>
              <!-- Glow Effect -->
              <div class={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}></div>
            </div>
            
            <!-- Content -->
            <h3 class="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
              {feature.title}
            </h3>
            <p class="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
              {feature.description}
            </p>
            
            <!-- Hover Arrow -->
            <div class="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div class="flex items-center text-blue-400">
                <span class="text-sm font-medium mr-2">Learn More</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Featured Content Section -->
    <div class="bg-slate-900/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      <div class="grid grid-cols-1 lg:grid-cols-2">
        <!-- Content Side -->
        <div class="p-8 md:p-12 flex flex-col justify-center">
          <div class="mb-6">
            <span class="inline-block bg-blue-500/20 text-blue-400 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              🌟 Premium Experience
            </span>
            <h3 class="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              Watch Anywhere, 
              <span class="text-blue-500">Anytime</span>
            </h3>
            <p class="text-gray-400 text-lg leading-relaxed mb-8">
              Enjoy your favorite movies and TV shows on your phone, tablet, laptop, or TV. 
              Stream on multiple devices simultaneously, and download titles to watch offline 
              with our advanced sync technology.
            </p>
          </div>
          
          <!-- Features List -->
          <div class="space-y-4 mb-8">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 text-blue-400">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="text-gray-300">Cross-platform compatibility</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 text-blue-400">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="text-gray-300">Multiple device streaming</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 text-blue-400">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span class="text-gray-300">Offline download & sync</span>
            </div>
          </div>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <a 
              href="/signup" 
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
            >
              Start Watching Now
            </a>
            <a 
              href="/demo" 
              class="border border-slate-600 text-slate-300 hover:border-blue-500 hover:text-blue-400 font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-center"
            >
              Watch Demo
            </a>
          </div>
        </div>
        
        <!-- Image Side -->
        <div class="relative h-64 lg:h-auto min-h-[400px]">
          <img 
            src="https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=1600" 
            alt="Woman watching movie on tablet" 
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-transparent to-transparent lg:hidden"></div>
          
          <!-- Floating Elements -->
          <div class="absolute top-6 right-6 bg-white/20 backdrop-blur-sm rounded-xl p-4 transform transition-all duration-300 hover:scale-105">
            <div class="text-white text-sm font-semibold">📱 Mobile Ready</div>
          </div>
          
          <div class="absolute bottom-6 left-6 bg-white/20 backdrop-blur-sm rounded-xl p-4 transform transition-all duration-300 hover:scale-105">
            <div class="text-white text-sm font-semibold">🔄 Auto Sync</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Stats Section -->
    <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div class="text-center">
        <div class="text-3xl md:text-4xl font-bold text-blue-500 mb-2">99.9%</div>
        <div class="text-gray-400">Uptime</div>
      </div>
      <div class="text-center">
        <div class="text-3xl md:text-4xl font-bold text-blue-500 mb-2">4K</div>
        <div class="text-gray-400">Ultra HD</div>
      </div>
      <div class="text-center">
        <div class="text-3xl md:text-4xl font-bold text-blue-500 mb-2">10+</div>
        <div class="text-gray-400">Devices</div>
      </div>
      <div class="text-center">
        <div class="text-3xl md:text-4xl font-bold text-blue-500 mb-2">24/7</div>
        <div class="text-gray-400">Support</div>
      </div>
    </div>
  </div>
</section>