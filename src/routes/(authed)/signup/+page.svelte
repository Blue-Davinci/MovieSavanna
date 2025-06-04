<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { signupSchema } from '$lib/schemas/schema';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { fly, fade } from 'svelte/transition';

  let { data } = $props();
  let redirectionPage = $page.url.searchParams.get('redirectTo') ?? '/login';
  let showPassword = $state(false);
  let showConfirmPassword = $state(false);

  const form = superForm(data.form, {
    validators: zodClient(signupSchema),
    dataType: 'json',
    onUpdated({ form }) {
      console.log('Signup form updated:', form);
      
      if (form.message?.success) {
        if (form.message.message === 'verification_required') {
          const verificationMessage = 'Welcome aboard! 🎉 We\'ve sent a verification email to your inbox. Please check your email to activate your account.';
          console.log('Email verification required:', verificationMessage);
          goto(`/verify-email?email=${encodeURIComponent(form.message.data?.email || '')}&message=${encodeURIComponent(verificationMessage)}`);
        } else {
          // Direct signup success (no email verification required)
          const welcomeMessage = `${form.message.message} Get ready to discover amazing movies!`;
          console.log('Signup successful, redirecting to:', redirectionPage, 'Message:', welcomeMessage);
          goto(redirectionPage);
        }
      } else {
        console.log('Signup Error:', form.message?.message);
      }
    }
  });

  const { form: formData, enhance, message, delayed, errors } = form;

  // Password strength checker
  function checkPasswordStrength(password: string) {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    return { score, checks }; // ✅ RETURN the value instead of setting state
  }

  // Reactive password strength checking
  let passwordStrength = $derived(
    $formData.password 
      ? checkPasswordStrength($formData.password)
      : { score: 0, checks: { length: false, lowercase: false, uppercase: false, number: false } }
  );

  function handleBack() {
    goto('/');
  }

  function handleSocialSignup(provider: string) {
    console.log(`Sign up with ${provider}`);
    // TODO: Implement social signup logic
  }

  function getPasswordStrengthColor(score: number) {
    if (score === 0) return 'bg-gray-600';
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  function getPasswordStrengthText(score: number) {
    if (score === 0) return 'Enter password';
    if (score <= 1) return 'Weak';
    if (score <= 2) return 'Fair';
    if (score <= 3) return 'Good';
    return 'Strong';
  }
</script>

<svelte:head>
  <title>Join MovieSavanna - Create Your Account</title>
  <meta name="description" content="Join MovieSavanna today and get unlimited access to thousands of movies and TV shows in stunning 4K quality." />
</svelte:head>

<div class="min-h-screen flex bg-slate-950 relative overflow-hidden" transition:fly|global={{ y: -200, duration: 300 }}>
  <!-- Background Animation -->
  <div class="absolute inset-0 opacity-10">
    <div class="absolute top-20 left-20 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
    <div class="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
    <div class="absolute bottom-20 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
  </div>

  <!-- Left Panel - Hero Section -->
  <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
    <div class="absolute inset-0">
      <img
        src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1600"
        alt="Join MovieSavanna community"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/70 to-slate-950/90"></div>
    </div>
    
    <!-- Hero Content -->
    <div class="relative z-10 flex flex-col justify-center p-12 text-white">
      <div class="space-y-8">
        <div>
          <h2 class="text-5xl font-bold mb-6 leading-tight">
            Join the
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Movie Revolution
            </span>
          </h2>
          <p class="text-xl text-gray-300 leading-relaxed mb-8">
            Become part of the MovieSavanna family and unlock unlimited entertainment. Create your account in seconds and start your cinematic journey today.
          </p>
        </div>
        
        <!-- Features Grid -->
        <div class="grid grid-cols-1 gap-6">
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div class="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-white">Instant Access</h3>
              <p class="text-gray-300 text-sm">Start watching immediately after signup</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div class="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-white">Personalized Experience</h3>
              <p class="text-gray-300 text-sm">AI-powered recommendations just for you</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div class="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-white">Secure & Private</h3>
              <p class="text-gray-300 text-sm">Your data is protected with enterprise security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Right Panel - Signup Form -->
  <div class="flex flex-col w-full lg:w-1/2 relative" in:fade={{ duration: 300 }}>
    <!-- Back Button -->
    <div class="absolute top-8 left-8 z-10">
      <button
        onclick={handleBack}
        aria-label="Go back to home page"
        class="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-all duration-300 bg-slate-900/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-700 hover:border-emerald-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>
    </div>

    <!-- Signup Form Container -->
    <div class="flex-1 flex items-center justify-center p-8 pt-24">
      <div class="w-full max-w-md">
        <!-- Signup Card -->
        <div class="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700 shadow-2xl">
          
          <!-- Header -->
          <div class="text-center mb-8">
            <a href="/" aria-label="MovieSavanna home page" class="inline-flex items-center mb-6 group">
              <span class="text-emerald-500 font-bold text-3xl mr-1 group-hover:text-emerald-400 transition-colors">Movie</span>
              <span class="text-white font-bold text-3xl group-hover:text-gray-200 transition-colors">Savanna</span>
            </a>
            
            <h1 class="text-3xl font-bold text-white mb-2">Create Your Account</h1>
            <p class="text-gray-400">Join thousands of movie enthusiasts today</p>
          </div>

          <!-- Error Message Display -->
          {#if $message && !$message.success}
            <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6" transition:fade>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-red-400 text-sm">{$message.message}</span>
              </div>
            </div>
          {/if}

          <!-- Signup Form -->
          <form method="POST" use:enhance class="space-y-6">
            <!-- Name Fields Row -->
            <div class="grid grid-cols-2 gap-4">
              <!-- First Name -->
              <div class="space-y-2">
                <label for="firstName" class="block text-sm font-medium text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  bind:value={$formData.firstName}
                  placeholder="John"
                  class="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 backdrop-blur-sm"
                  class:border-red-500={$errors.firstName}
                  class:focus:ring-red-500={$errors.firstName}
                />
                {#if $errors.firstName}
                  <p class="text-sm text-red-400" transition:fade>{$errors.firstName}</p>
                {/if}
              </div>

              <!-- Last Name -->
              <div class="space-y-2">
                <label for="lastName" class="block text-sm font-medium text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  bind:value={$formData.lastName}
                  placeholder="Doe"
                  class="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 backdrop-blur-sm"
                  class:border-red-500={$errors.lastName}
                  class:focus:ring-red-500={$errors.lastName}
                />
                {#if $errors.lastName}
                  <p class="text-sm text-red-400" transition:fade>{$errors.lastName}</p>
                {/if}
              </div>
            </div>

            <!-- Email Field -->
            <div class="space-y-2">
              <label for="email" class="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div class="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  bind:value={$formData.email}
                  placeholder="john.doe@example.com"
                  class="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 backdrop-blur-sm"
                  class:border-red-500={$errors.email}
                  class:focus:ring-red-500={$errors.email}
                />
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
              {#if $errors.email}
                <p class="text-sm text-red-400" transition:fade>{$errors.email}</p>
              {/if}
            </div>

            <!-- Phone Field (Optional) -->
            <div class="space-y-2">
              <label for="phone" class="block text-sm font-medium text-gray-300">
                Phone Number <span class="text-gray-500 text-xs">(Optional)</span>
              </label>
              <div class="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  bind:value={$formData.phone}
                  placeholder="+1 (555) 123-4567"
                  class="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 backdrop-blur-sm"
                  class:border-red-500={$errors.phone}
                  class:focus:ring-red-500={$errors.phone}
                />
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
              {#if $errors.phone}
                <p class="text-sm text-red-400" transition:fade>{$errors.phone}</p>
              {/if}
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div class="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  bind:value={$formData.password}
                  placeholder="Create a strong password"
                  class="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 backdrop-blur-sm pr-12"
                  class:border-red-500={$errors.password}
                  class:focus:ring-red-500={$errors.password}
                />
                <button
                  type="button"
                  onclick={() => showPassword = !showPassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {#if showPassword}
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  {/if}
                </button>
              </div>
              
              <!-- Password Strength Indicator -->
              {#if $formData.password}
                <div class="space-y-2" transition:fade>
                  <div class="flex items-center gap-2">
                    <div class="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        class="h-full transition-all duration-300 {getPasswordStrengthColor(passwordStrength.score)}"
                        style="width: {(passwordStrength.score / 4) * 100}%"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-400">{getPasswordStrengthText(passwordStrength.score)}</span>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="flex items-center gap-1 {passwordStrength.checks.length ? 'text-green-400' : 'text-gray-500'}">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      8+ characters
                    </div>
                    <div class="flex items-center gap-1 {passwordStrength.checks.uppercase ? 'text-green-400' : 'text-gray-500'}">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      Uppercase
                    </div>
                    <div class="flex items-center gap-1 {passwordStrength.checks.lowercase ? 'text-green-400' : 'text-gray-500'}">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      Lowercase
                    </div>
                    <div class="flex items-center gap-1 {passwordStrength.checks.number ? 'text-green-400' : 'text-gray-500'}">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      Number
                    </div>
                  </div>
                </div>
              {/if}
              
              {#if $errors.password}
                <p class="text-sm text-red-400" transition:fade>{$errors.password}</p>
              {/if}
            </div>

            <!-- Confirm Password Field -->
            <div class="space-y-2">
              <label for="confirmPassword" class="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div class="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  bind:value={$formData.confirmPassword}
                  placeholder="Confirm your password"
                  class="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 backdrop-blur-sm pr-12"
                  class:border-red-500={$errors.confirmPassword}
                  class:focus:ring-red-500={$errors.confirmPassword}
                />
                <button
                  type="button"
                  onclick={() => showConfirmPassword = !showConfirmPassword}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {#if showConfirmPassword}
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  {/if}
                </button>
              </div>
              {#if $errors.confirmPassword}
                <p class="text-sm text-red-400" transition:fade>{$errors.confirmPassword}</p>
              {/if}
            </div>

            <!-- Terms and Conditions -->
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    bind:checked={$formData.termsAccepted}
                    class="w-4 h-4 text-emerald-600 bg-slate-800 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                    class:border-red-500={$errors.termsAccepted}
                  />
                </div>
                <label for="termsAccepted" class="ml-3 text-sm text-gray-300">
                  I agree to the 
                  <a href="/terms" class="text-emerald-400 hover:text-emerald-300 transition-colors">Terms of Service</a>
                  and 
                  <a href="/privacy" class="text-emerald-400 hover:text-emerald-300 transition-colors">Privacy Policy</a>
                </label>
              </div>
              {#if $errors.termsAccepted}
                <p class="text-sm text-red-400" transition:fade>{$errors.termsAccepted}</p>
              {/if}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              disabled={$delayed}
              class="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none shadow-lg disabled:shadow-none"
            >
              {#if $delayed}
                <div class="flex items-center justify-center">
                  <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating your account...
                </div>
              {:else}
                <span class="flex items-center justify-center gap-2">
                  Create Account
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              {/if}
            </button>
          </form>

          <!-- Social Signup Divider -->
          <div class="my-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-slate-600"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-slate-900 text-gray-400">Or sign up with</span>
              </div>
            </div>
          </div>

          <!-- Social Signup Buttons -->
          <div class="grid grid-cols-3 gap-3 mb-6">
            <button
              type="button"
              onclick={() => handleSocialSignup('google')}
              aria-label="Sign up with Google"
              class="flex justify-center items-center px-4 py-3 border border-slate-600 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>

            <button
              type="button"
              onclick={() => handleSocialSignup('facebook')}
              aria-label="Sign up with Facebook"
              class="flex justify-center items-center px-4 py-3 border border-slate-600 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>

            <button
              type="button"
              onclick={() => handleSocialSignup('apple')}
              aria-label="Sign up with Apple"
              class="flex justify-center items-center px-4 py-3 border border-slate-600 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </button>
          </div>

          <!-- Login Link -->
          <p class="text-center text-gray-400">
            Already have an account?
            <a href="/login" class="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-center text-sm text-gray-500 p-8">
      <p>&copy; 2024 MovieSavanna. All rights reserved.</p>
      <div class="flex justify-center space-x-4 mt-2">
        <a href="/terms" class="text-emerald-400 hover:text-emerald-300 transition-colors">Terms</a>
        <span>•</span>
        <a href="/privacy" class="text-emerald-400 hover:text-emerald-300 transition-colors">Privacy</a>
        <span>•</span>
        <a href="/help" class="text-emerald-400 hover:text-emerald-300 transition-colors">Help</a>
      </div>
    </footer>
  </div>
</div>

<style>
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
</style>