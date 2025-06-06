<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Movie } from '$lib/types/movie.js';
	import FavoriteButton from '$lib/webcomponents/favorites/FavoriteButton.svelte';

	interface Props {
		title: string;
		movies: Movie[];
		loading?: boolean;
		subtitle?: string;
	}

	let { title, movies, loading = false, subtitle }: Props = $props();

	function goToMovie(movieId: number) {
		goto(`/dashboard/${movieId}`);
	}

	function formatYear(dateString: string): string {
		if (!dateString) return 'TBA';
		return new Date(dateString).getFullYear().toString();
	}

	function formatRating(rating: number): string {
		return rating > 0 ? rating.toFixed(1) : 'N/A';
	}
</script>

<section class="py-8">
	<div class="container mx-auto px-4">
		<!-- Section Header -->
		<div class="mb-6 flex items-center justify-between">
			<div>
				<h2 class="flex items-center gap-3 text-2xl font-bold text-white">
					<span class="text-yellow-400">✨</span>
					{title}
				</h2>
				{#if subtitle}
					<p class="mt-1 text-sm text-gray-400">{subtitle}</p>
				{:else}
					<p class="mt-1 text-sm text-gray-400">
						{loading ? 'Loading recommendations...' : `${movies.length} personalized suggestions`}
					</p>
				{/if}
			</div>

			{#if movies.length > 0}
				<div class="hidden items-center gap-2 text-sm text-gray-400 sm:flex">
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
					AI Powered
				</div>
			{/if}
		</div>

		<!-- Loading State -->
		{#if loading}
			<div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
				{#each Array(6) as _}
					<div class="animate-pulse">
						<div class="mb-3 h-64 rounded-lg bg-slate-700"></div>
						<div class="mb-2 h-4 rounded bg-slate-700"></div>
						<div class="h-3 w-2/3 rounded bg-slate-700"></div>
					</div>
				{/each}
			</div>
		{:else if movies.length > 0}
			<!-- Movies Grid -->
			<div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
				{#each movies as movie}
					<div class="group relative">
						<!-- Movie Card -->
						<button
							onclick={() => goToMovie(movie.id)}
							class="w-full rounded-lg text-left transition-all duration-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
						>
							<div
								class="relative overflow-hidden rounded-lg bg-slate-800 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-yellow-400/20"
							>
								{#if movie.poster_path}
									<img
										src="https://image.tmdb.org/t/p/w300{movie.poster_path}"
										alt={movie.title}
										class="h-64 w-full object-cover"
										loading="lazy"
									/>
								{:else}
									<div
										class="flex h-64 w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800"
									>
										<svg
											class="h-12 w-12 text-gray-400"
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

								<!-- Rating Badge -->
								{#if movie.vote_average > 0}
									<div
										class="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/80 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm"
									>
										<span class="text-yellow-400">⭐</span>
										{formatRating(movie.vote_average)}
									</div>
								{/if}

								<!-- ✅ FIX: Mobile-first Favorite Button -->
								<div class="recommendation-favorite-button absolute top-2 right-2">
									<FavoriteButton {movie} size="sm" variant="overlay" />
								</div>

								<!-- Hover Overlay -->
								<div
									class="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/80 via-transparent to-transparent pb-4 opacity-0 transition-all duration-300 group-hover:opacity-100"
								>
									<div class="flex items-center gap-2 text-sm font-medium text-white">
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
									</div>
								</div>
							</div>

							<!-- Movie Info -->
							<div class="mt-3">
								<h3
									class="mb-1 line-clamp-2 text-sm font-medium text-white transition-colors group-hover:text-yellow-400"
								>
									{movie.title}
								</h3>
								<p class="text-xs text-gray-400">
									{formatYear(movie.release_date)}
								</p>
							</div>
						</button>
					</div>
				{/each}
			</div>

			<!-- View More Button -->
			<div class="mt-8 text-center">
				<button
					onclick={() => goto('/dashboard')}
					class="inline-flex transform items-center gap-2 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-500 px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:from-yellow-500 hover:to-yellow-400"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					Discover More Movies
				</button>
			</div>
		{:else}
			<!-- Empty State -->
			<div class="py-12 text-center">
				<div
					class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800"
				>
					<svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
				<p class="mb-4 text-gray-400">No recommendations available at the moment.</p>
				<button
					onclick={() => goto('/dashboard')}
					class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
				>
					Explore Movies
				</button>
			</div>
		{/if}
	</div>
</section>

<style>
	/* Mobile-first responsive favorite button for recommendations */
	.recommendation-favorite-button {
		/* Always visible on mobile (default) */
		opacity: 1;
		transition: opacity 0.3s ease;
	}

	/* Desktop: semi-transparent by default, full opacity on hover */
	@media (min-width: 768px) {
		.recommendation-favorite-button {
			opacity: 0.8;
		}

		.group:hover .recommendation-favorite-button {
			opacity: 1;
		}
	}

	.line-clamp-2 {
		/* Modern standard property */
		line-clamp: 2;

		/* WebKit prefix for older browsers */
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;

		/* Fallback properties */
		overflow: hidden;
		text-overflow: ellipsis;
		display: -moz-box;
		display: box;
	}
</style>
