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

	$inspect(isAuthenticated, user);

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
		$inspect('Logging out...');
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

<header
	class="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
	class:bg-slate-900-95={scrolled}
	class:backdrop-blur-md={scrolled}
	class:shadow-lg={scrolled}
>
	<div class="container mx-auto flex items-center justify-between px-4 py-4">
		<!-- Logo -->
		<div class="flex items-center">
			<a href="/" class="group flex items-center">
				<span
					class="mr-1 text-2xl font-bold text-blue-500 transition-colors group-hover:text-blue-400"
					>Movie</span
				>
				<span class="text-2xl font-bold text-white transition-colors group-hover:text-gray-200"
					>Savanna</span
				>
			</a>
		</div>

		<!-- Desktop Navigation -->
		<nav class="hidden items-center space-x-8 lg:flex">
			<a
				href="/"
				class="font-medium text-white/90 transition-colors duration-300 hover:text-blue-400">Home</a
			>
			<a
				href="/movies"
				class="font-medium text-white/90 transition-colors duration-300 hover:text-blue-400"
				>Movies</a
			>
			{#if isAuthenticated}
				<a
					href="/dashboard"
					class="font-medium text-white/90 transition-colors duration-300 hover:text-blue-400"
					>Dashboard</a
				>
				<a
					href="/favorites"
					class="font-medium text-white/90 transition-colors duration-300 hover:text-blue-400"
					>Favorites</a
				>
			{/if}
			<a
				href="/about"
				class="font-medium text-white/90 transition-colors duration-300 hover:text-blue-400"
				>About</a
			>
		</nav>

		<!-- Desktop Auth Section -->
		<div class="hidden items-center space-x-4 lg:flex">
			{#if isAuthenticated}
				<!-- Authenticated User UI -->
				<div class="flex items-center space-x-3">
					<!-- User Avatar & Info -->
					<div class="flex items-center space-x-3">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500"
						>
							<span class="text-sm font-semibold text-white">
								{getUserInitials(user)}
							</span>
						</div>
						<div class="hidden xl:block">
							<p class="text-sm font-medium text-white">
								{getUserDisplayName(user)}
							</p>
							{#if user?.email}
								<p class="text-xs text-gray-400">{user.email}</p>
							{/if}
						</div>
					</div>

					<!-- Logout Form -->
					<form method="POST" action="/logout" use:enhance={handleLogout} class="inline-block">
						<button
							type="submit"
							disabled={isLoggingOut}
							class="flex items-center space-x-2 rounded-lg bg-red-600/80 px-4 py-2 font-medium text-white transition-all duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
							title="Sign out"
						>
							{#if isLoggingOut}
								<svg
									class="h-4 w-4 animate-spin"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								<span class="hidden xl:inline">Signing Out...</span>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
									/>
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
					class="rounded-lg px-4 py-2 font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-white"
				>
					Sign In
				</a>
				<a
					href="/signup"
					class="transform rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl"
				>
					Sign Up
				</a>
			{/if}
		</div>

		<!-- Mobile Menu Button -->
		<button
			class="rounded-lg p-2 text-white transition-all duration-300 hover:bg-white/10 lg:hidden"
			onclick={toggleMobileMenu}
			aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
			aria-expanded={mobileMenuOpen}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				class="h-6 w-6 transition-transform duration-300"
				class:rotate-90={mobileMenuOpen}
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
				/>
			</svg>
		</button>
	</div>

	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<div class="border-t border-white/10 bg-slate-900/98 shadow-2xl backdrop-blur-md lg:hidden">
			<div class="container mx-auto px-4 py-6">
				<!-- Mobile Navigation Links -->
				<nav class="mb-6 flex flex-col space-y-4">
					<a
						href="/"
						class="border-b border-white/10 py-2 font-medium text-white/90 transition-colors duration-300 hover:text-blue-400"
						onclick={() => (mobileMenuOpen = false)}>Home</a
					>
					<a
						href="/movies"
						class="border-b border-white/10 py-2 font-medium text-white/90 transition-colors duration-300 hover:text-blue-400"
						onclick={() => (mobileMenuOpen = false)}>Movies</a
					>
					{#if isAuthenticated}
						<a
							href="/dashboard"
							class="border-b border-white/10 py-2 font-medium text-white/90 transition-colors duration-300 hover:text-blue-400"
							onclick={() => (mobileMenuOpen = false)}>Dashboard</a
						>
						<a
							href="/favorites"
							class="border-b border-white/10 py-2 font-medium text-white/90 transition-colors duration-300 hover:text-blue-400"
							onclick={() => (mobileMenuOpen = false)}>Favorites</a
						>
					{/if}
					<a
						href="/about"
						class="py-2 font-medium text-white/90 transition-colors duration-300 hover:text-blue-400"
						onclick={() => (mobileMenuOpen = false)}>About</a
					>
				</nav>

				<!-- Mobile Auth Section -->
				<div class="border-t border-white/10 pt-4">
					{#if isAuthenticated}
						<!-- Mobile Authenticated User UI -->
						<div class="space-y-4">
							<!-- User Info -->
							<div class="flex items-center space-x-3 rounded-lg bg-slate-800/50 p-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500"
								>
									<span class="font-semibold text-white">
										{getUserInitials(user)}
									</span>
								</div>
								<div class="flex-1">
									<p class="font-medium text-white">
										{getUserDisplayName(user)}
									</p>
									{#if user?.email}
										<p class="truncate text-sm text-gray-400">{user.email}</p>
									{/if}
								</div>
							</div>

							<!-- Mobile Logout Form -->
							<form method="POST" action="/logout" use:enhance={handleLogout} class="w-full">
								<button
									type="submit"
									disabled={isLoggingOut}
									class="flex w-full items-center justify-center space-x-2 rounded-lg bg-red-600/80 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{#if isLoggingOut}
										<svg
											class="h-4 w-4 animate-spin"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												stroke-width="4"
											></circle>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										<span>Signing Out...</span>
									{:else}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
											/>
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
								class="rounded-lg border border-white/20 px-4 py-3 text-center font-medium text-white/90 transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
								onclick={() => (mobileMenuOpen = false)}
							>
								Sign In
							</a>
							<a
								href="/signup"
								class="transform rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700"
								onclick={() => (mobileMenuOpen = false)}
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
