<script lang="ts">
	import { onMount } from 'svelte';
	import RecommendationSection from '$lib/webcomponents/recommendations/RecommendationSection.svelte';
	import { recommendationService } from '$lib/services/recommendations.js';
	import { goto } from '$app/navigation';
	import { favoritesService } from '$lib/api/favorites.js';
	import FavoriteButton from '$lib/webcomponents/favorites/FavoriteButton.svelte';
	import type { PageData } from './$types';
	import type { UserFavorite } from '$lib/types/favorites.js';
	import type { Movie } from '$lib/types/movie.js';

	let { data }: { data: PageData } = $props();

	// State
	let favorites = $state<UserFavorite[]>(data.favorites);
	let loading = $state(false);
	let error = $state<string | null>(data.error || null);

	// Recommendation state
	let recommendations = $state<Movie[]>([]);
	let recommendationsLoading = $state(false);

	onMount(() => {
		if (favorites.length > 0) {
			loadRecommendations();
		}
	});

	// Watch for favorites changes
	$effect(() => {
		loadRecommendations();
	});

	// Refresh favorites
	async function refreshFavorites() {
		try {
			loading = true;
			error = null;
			favorites = await favoritesService.getFavorites();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to refresh favorites';
		} finally {
			loading = false;
		}
	}

	async function loadRecommendations() {
		if (favorites.length === 0) {
			recommendations = [];
			return;
		}

		try {
			recommendationsLoading = true;
			recommendations = await recommendationService.getRecommendationsFromFavorites(favorites);
		} catch (err) {
			console.error('Failed to load recommendations:', err);
		} finally {
			recommendationsLoading = false;
		}
	}

	// Handle favorite removal
	function handleFavoriteToggle() {
		// Refresh the list when a favorite is removed
		refreshFavorites();
	}

	// Navigate to movie detail
	function goToMovie(movieId: number) {
		goto(`/dashboard/${movieId}`);
	}

	// Handle keyboard navigation
	function handleKeydown(event: KeyboardEvent, movieId: number) {
		if (event.key === 'Enter') {
			goToMovie(movieId);
		}
	}

	// Format date
	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>My Favorites - MovieSavanna</title>
	<meta name="description" content="Your favorite movies collection on MovieSavanna" />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-24 pb-8">
	<div class="container mx-auto px-4">
		<div class="mb-8 text-center">
			<h1 class="mb-4 text-4xl font-bold text-white md:text-5xl">
				My <span class="text-red-500">♥</span> Favorites
			</h1>
			<p class="mx-auto max-w-2xl text-lg leading-relaxed text-gray-400">
				Your curated collection of favorite movies. Click on any movie to view details.
			</p>
		</div>

		<!-- Stats -->
		<div class="flex items-center justify-center gap-8 text-center">
			<div>
				<div class="text-3xl font-bold text-red-400">{favorites.length}</div>
				<div class="text-gray-400">Movies</div>
			</div>
			<div>
				<div class="text-3xl font-bold text-blue-400">
					{favorites.length > 0
						? (
								favorites.reduce((sum, fav) => sum + (fav.movie_rating || 0), 0) / favorites.length
							).toFixed(1)
						: '0.0'}
				</div>
				<div class="text-gray-400">Avg Rating</div>
			</div>
		</div>
	</div>
</section>

<!-- Favorites Content -->
<section class="min-h-screen bg-slate-950 py-8">
	<div class="container mx-auto px-4">
		<!-- Header with Actions -->
		<div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<h2 class="text-2xl font-bold text-white">
					{favorites.length > 0
						? `${favorites.length} Favorite${favorites.length === 1 ? '' : 's'}`
						: 'No Favorites Yet'}
				</h2>
				{#if favorites.length > 0}
					<p class="mt-1 text-gray-400">
						Added between {formatDate(favorites[favorites.length - 1]?.created_at)} and {formatDate(
							favorites[0]?.created_at
						)}
					</p>
				{/if}
			</div>

			<div class="flex gap-3">
				<button
					onclick={refreshFavorites}
					disabled={loading}
					class="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-white transition-colors hover:bg-slate-600 disabled:opacity-50"
				>
					<svg
						class="h-4 w-4"
						class:animate-spin={loading}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
					Refresh
				</button>

				<button
					onclick={() => goto('/dashboard')}
					class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						/>
					</svg>
					Discover More
				</button>
			</div>
		</div>

		<!-- Error State -->
		{#if error}
			<div class="mb-8 rounded-lg border border-red-700 bg-red-900/20 p-6">
				<div class="flex items-center">
					<svg
						class="mr-3 h-6 w-6 text-red-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<div>
						<h3 class="font-semibold text-red-400">Error Loading Favorites</h3>
						<p class="text-red-300">{error}</p>
					</div>
				</div>
				<button
					onclick={refreshFavorites}
					class="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
				>
					Try Again
				</button>
			</div>
		{/if}

		<!-- Empty State -->
		{#if !loading && !error && favorites.length === 0}
			<div class="py-16 text-center">
				<svg
					class="mx-auto mb-6 h-24 w-24 text-gray-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
					/>
				</svg>
				<h3 class="mb-4 text-2xl font-bold text-gray-400">No Favorites Yet</h3>
				<p class="mx-auto mb-8 max-w-md text-gray-500">
					Start exploring movies and click the heart icon to add them to your favorites collection.
				</p>
				<button
					onclick={() => goto('/dashboard')}
					class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					Discover Movies
				</button>
			</div>
		{/if}

		<!-- Favorites Grid -->
		{#if favorites.length > 0}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each favorites as favorite}
					<div
						class="group overflow-hidden rounded-lg border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
					>
						<!-- Movie Poster -->
						<div class="relative">
							<button
								onclick={() => goToMovie(favorite.movie_id)}
								onkeydown={(e) => handleKeydown(e, favorite.movie_id)}
								class="block w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
							>
								{#if favorite.movie_poster}
									<img
										src="https://image.tmdb.org/t/p/w500{favorite.movie_poster}"
										alt={favorite.movie_title}
										class="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
										loading="lazy"
									/>
								{:else}
									<div
										class="flex h-64 w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800"
									>
										<svg
											class="h-16 w-16 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a1 1 0 00-1 1v14a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1m-1 0V2"
											/>
										</svg>
									</div>
								{/if}
							</button>

							<!-- Favorite Button Overlay -->
							<div class="absolute top-3 right-3">
								<FavoriteButton
									movie={{
										id: favorite.movie_id,
										title: favorite.movie_title,
										poster_path: favorite.movie_poster,
										release_date: favorite.movie_release_date || '',
										vote_average: favorite.movie_rating || 0,
										// Default values for required Movie fields
										overview: '',
										backdrop_path: null,
										vote_count: 0,
										genre_ids: [],
										adult: false,
										original_language: '',
										original_title: favorite.movie_title,
										popularity: 0,
										video: false
									}}
									size="md"
									variant="overlay"
								/>
							</div>

							<!-- Rating Badge -->
							{#if favorite.movie_rating}
								<div
									class="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-sm font-bold text-white backdrop-blur-sm"
								>
									⭐ {favorite.movie_rating.toFixed(1)}
								</div>
							{/if}
						</div>

						<!-- Movie Info -->
						<div class="p-4">
							<h3 class="mb-2 line-clamp-2 text-lg font-bold text-white">
								{favorite.movie_title}
							</h3>

							<div class="mb-3 flex items-center justify-between text-sm text-gray-400">
								<span>
									{favorite.movie_release_date
										? new Date(favorite.movie_release_date).getFullYear()
										: 'TBA'}
								</span>
								<span>Added {formatDate(favorite.created_at)}</span>
							</div>

							<button
								onclick={() => goToMovie(favorite.movie_id)}
								class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
								View Details
							</button>
						</div>
					</div>
				{/each}
			</div>
			{#if recommendations.length > 0 || recommendationsLoading}
				<div class="mt-16 border-t border-slate-800 pt-8">
					<RecommendationSection
						title="You Might Also Like"
						subtitle="Based on your favorite movies and viewing preferences"
						movies={recommendations}
						loading={recommendationsLoading}
					/>
				</div>
			{/if}
		{/if}
	</div>
</section>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		display: -moz-box;
		display: box;
		-webkit-line-clamp: 2;
		-moz-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		-moz-box-orient: vertical;
		box-orient: vertical;
		overflow: hidden;
	}
</style>
