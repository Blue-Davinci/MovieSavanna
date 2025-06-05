<script lang="ts">
  interface Props {
    title?: string;
    message: string;
    showRetry?: boolean;
    showGoBack?: boolean;
    onRetry?: () => void;
    onGoBack?: () => void;
  }
  
  let { 
    title = "Something went wrong",
    message,
    showRetry = false,
    showGoBack = false,
    onRetry,
    onGoBack
  }: Props = $props();
</script>

<div class="min-h-screen flex items-center justify-center bg-slate-950 px-4">
  <div class="text-center max-w-md">
    <!-- Error Icon -->
    <div class="mb-6">
      <svg 
        class="mx-auto h-24 w-24 text-red-400" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="1.5" 
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" 
        />
      </svg>
    </div>
    
    <!-- Error Content -->
    <h1 class="text-2xl font-bold text-white mb-4">
      {title}
    </h1>
    
    <p class="text-gray-400 mb-8 text-lg">
      {message}
    </p>
    
    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      {#if showRetry && onRetry}
        <button
          onclick={onRetry}
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          Try Again
        </button>
      {/if}
      
      {#if showGoBack && onGoBack}
        <button
          onclick={onGoBack}
          class="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          ← Back to Movies
        </button>
      {/if}
    </div>
  </div>
</div>