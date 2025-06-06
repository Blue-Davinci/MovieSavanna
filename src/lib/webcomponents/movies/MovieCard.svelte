<script lang="ts">
	import { goto } from '$app/navigation';
	import FavoriteButton from '../favorites/FavoriteButton.svelte';
	import { clientTMDB } from '$lib/api/client-tmdb.js';
	import type { Movie } from '$lib/types/movie.js';

	let { movie, loading = false }: { movie: Movie; loading?: boolean } = $props();
	// Get formatted image URLs (only if not loading)
	const posterUrl = loading ? null : clientTMDB.getImageUrl(movie?.poster_path, 'w342');
	const backdropUrl = loading ? null : clientTMDB.getImageUrl(movie?.backdrop_path, 'w780');

	// Format release year (with null check)
	const releaseYear =
		loading || !movie?.release_date ? 'TBA' : new Date(movie.release_date).getFullYear();

	// Format rating (with null check)
	const rating = loading || !movie?.vote_average ? 'N/A' : movie.vote_average.toFixed(1);

	// Safe truncate overview with null check
	const truncatedOverview =
		loading || !movie?.overview
			? ''
			: movie.overview.length > 120
				? movie.overview.substring(0, 120) + '...'
				: movie.overview;

	// Handle image load error
	let imageError = $state(false);

	function handleImageError() {
		imageError = true;
	}

	function handleMovieClick() {
		// Don't handle clicks during loading
		if (loading || !movie?.id) return;

		// Will navigate to movie detail page later
		console.log('Navigate to movie:', movie.id);
		goto(`/dashboard/${movie.id}`);
	}
</script>

<div
	class="group transform overflow-hidden rounded-lg bg-slate-900 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
	class:animate-pulse={loading}
	class:cursor-pointer={!loading}
	onclick={handleMovieClick}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && handleMovieClick()}
>
	{#if loading}
		<!-- Loading skeleton -->
		<div class="aspect-[2/3] animate-pulse bg-slate-800"></div>
		<div class="space-y-3 p-4">
			<div class="h-4 animate-pulse rounded bg-slate-700"></div>
			<div class="h-3 w-3/4 animate-pulse rounded bg-slate-700"></div>
			<div class="h-3 w-1/2 animate-pulse rounded bg-slate-700"></div>
		</div>
	{:else}
		<!-- Movie poster -->
		<div class="relative aspect-[2/3] overflow-hidden">
			{#if posterUrl && !imageError}
				<img
					src={posterUrl}
					alt={movie?.title || 'Movie poster'}
					class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
					loading="lazy"
					onerror={handleImageError}
				/>
			{:else}
				<!-- Fallback image -->
				<div
					class="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800"
				>
					<div class="text-center text-slate-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mx-auto mb-2 h-16 w-16"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a1 1 0 00-1 1v14a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1m-1 0V2"
							/>
						</svg>
						<p class="text-sm font-medium">No Image</p>
					</div>
				</div>
			{/if}

			<!-- ✅ FIX: Mobile-first favorite button with CSS media queries -->
			<div class="favorite-button-container absolute top-3 left-3">
				<FavoriteButton {movie} size="md" variant="overlay" />
			</div>

			<!-- Rating badge -->
			<div
				class="absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-sm font-bold text-white shadow-lg backdrop-blur-sm"
			>
				⭐ {rating}
			</div>

			<!-- Hover overlay with play button -->
			<div
				class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-all duration-300 group-hover:opacity-100"
			>
				<button
					class="translate-y-4 transform rounded-full bg-blue-600 p-4 text-white shadow-lg transition-all duration-300 group-hover:translate-y-0 hover:bg-blue-700"
					aria-label={`View details for ${movie?.title || 'this movie'}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
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
				</button>
			</div>
		</div>

		<!-- Movie info -->
		<div class="p-4">
			<h3
				class="mb-2 line-clamp-2 text-lg font-bold text-white transition-colors group-hover:text-blue-400"
			>
				{movie?.title || 'Untitled Movie'}
			</h3>

			<div class="mb-3 flex items-center text-sm text-gray-400">
				<span>{releaseYear}</span>
				<span class="mx-2">•</span>
				<span>{movie?.vote_count || 0} votes</span>
			</div>

			{#if truncatedOverview}
				<p class="line-clamp-3 text-sm leading-relaxed text-gray-300">
					{truncatedOverview}
				</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Mobile-first responsive favorite button visibility */
	.favorite-button-container {
		/* Always visible on mobile (default) */
		opacity: 1;
		transition: opacity 0.3s ease;
	}

	/* Desktop: hide by default, show on hover */
	@media (min-width: 768px) {
		.favorite-button-container {
			opacity: 0;
		}

		.group:hover .favorite-button-container {
			opacity: 1;
		}
	}

	.line-clamp-2 {
		/* Modern standard property */
		line-clamp: 2;

		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;

		/* Fallback properties */
		overflow: hidden;
		text-overflow: ellipsis;
		display: -moz-box;
		display: box;
	}

	.line-clamp-3 {
		line-clamp: 3;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
