<script lang="ts">
  interface Plan {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    isPopular: boolean;
    period: string;
    originalPrice?: number;
  }
  
  // Use correct Svelte 5 $state syntax
  let plans = $state<Plan[]>([
    {
      id: "basic",
      name: "Basic Plan",
      price: 9.99,
      originalPrice: 12.99,
      description: "Perfect for casual movie watching",
      features: [
        "Unlimited Movies & TV Shows",
        "Watch on 1 Device",
        "No Ads",
        "25 Download Slots",
        "10 TV Channels",
        "Standard HD Quality"
      ],
      isPopular: false,
      period: "month"
    },
    {
      id: "standard",
      name: "Standard Plan",
      price: 14.99,
      originalPrice: 19.99,
      description: "Perfect for movie enthusiasts",
      features: [
        "Unlimited Movies & TV Shows",
        "Watch on 2 Devices",
        "No Ads",
        "75 Download Slots",
        "20 TV Channels",
        "Full HD Quality",
        "Offline Viewing",
        "Email Support"
      ],
      isPopular: true,
      period: "month"
    },
    {
      id: "premium",
      name: "Premium Plan",
      price: 19.99,
      originalPrice: 24.99,
      description: "The ultimate cinema experience",
      features: [
        "Unlimited Movies & TV Shows",
        "Watch on 4 Devices",
        "No Ads",
        "Unlimited Downloads",
        "50+ TV Channels",
        "4K + HDR Quality",
        "Multiple User Profiles",
        "Priority Support",
        "Early Access to New Releases"
      ],
      isPopular: false,
      period: "month"
    }
  ]);
  
  let selectedPlan = $state<string | null>(null);
  
  function selectPlan(planId: string) {
    selectedPlan = planId;
    // Handle plan selection logic here
    console.log('Selected plan:', planId);
  }
</script>

<section class="py-20 bg-slate-950">
  <div class="container mx-auto px-4">
    <!-- Section Header -->
    <div class="text-center max-w-4xl mx-auto mb-16">
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
        Choose The Plan That 
        <span class="text-blue-500">Suits You</span>
      </h2>
      <p class="text-gray-400 text-lg leading-relaxed">
        We present 3 flexible packages that you can choose to start watching various movies 
        at affordable prices and according to your needs.
      </p>
    </div>
    
    <!-- Pricing Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {#each plans as plan}
        <div 
          class="relative bg-slate-900 rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
          class:ring-2={plan.isPopular}
          class:ring-blue-500={plan.isPopular}
          class:shadow-2xl={plan.isPopular}
          class:shadow-blue-500={plan.isPopular}
        >
          <!-- Popular Badge -->
          {#if plan.isPopular}
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                🔥 Most Popular
              </div>
            </div>
          {/if}
          
          <!-- Card Content -->
          <div class="p-8">
            <!-- Plan Header -->
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p class="text-gray-400 mb-6">{plan.description}</p>
              
              <!-- Pricing -->
              <div class="flex items-center justify-center gap-2 mb-2">
                {#if plan.originalPrice}
                  <span class="text-gray-500 line-through text-lg">${plan.originalPrice}</span>
                {/if}
                <span class="text-4xl md:text-5xl font-bold text-white">${plan.price}</span>
                <span class="text-gray-400 text-lg">/{plan.period}</span>
              </div>
              
              {#if plan.originalPrice}
                <div class="inline-block bg-green-500/20 text-green-400 text-sm font-medium px-3 py-1 rounded-full">
                  Save ${(plan.originalPrice - plan.price).toFixed(2)}/month
                </div>
              {/if}
            </div>
            
            <!-- Features List -->
            <div class="space-y-4 mb-8">
              {#each plan.features as feature}
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-gray-300 leading-relaxed">{feature}</span>
                </div>
              {/each}
            </div>
            
            <!-- CTA Button -->
            <button 
              class="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4"
              class:bg-blue-600={plan.isPopular}
              class:hover:bg-blue-700={plan.isPopular}
              class:text-white={plan.isPopular}
              class:shadow-lg={plan.isPopular}
              class:focus:ring-blue-500={plan.isPopular}
              class:border-2={!plan.isPopular}
              class:border-blue-500={!plan.isPopular}
              class:text-blue-500={!plan.isPopular}
              class:hover:bg-blue-500={!plan.isPopular}
              class:hover:text-white={!plan.isPopular}
              class:focus:ring-blue-500-30={!plan.isPopular}
              onclick={() => selectPlan(plan.id)}
            >
              {plan.isPopular ? 'Get Started Now' : 'Choose Plan'}
            </button>
            
            <!-- Money Back Guarantee -->
            <p class="text-center text-gray-500 text-sm mt-4">
              30-day money-back guarantee
            </p>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Additional Info -->
    <div class="mt-16 text-center">
      <div class="inline-flex items-center gap-2 bg-slate-800/50 rounded-full px-6 py-3 backdrop-blur-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span class="text-gray-300">All plans include SSL security and 24/7 customer support</span>
      </div>
    </div>
    
    <!-- FAQ Link -->
    <div class="mt-8 text-center">
      <a href="/faq" class="text-blue-400 hover:text-blue-300 transition-colors duration-300">
        Have questions? Check our FAQ →
      </a>
    </div>
  </div>
</section>