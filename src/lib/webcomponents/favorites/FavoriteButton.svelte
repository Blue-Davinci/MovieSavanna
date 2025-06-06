<script lang="ts">
	import { onMount } from 'svelte';
	import { favoritesService } from '$lib/api/favorites.js';
	import type { Movie } from '$lib/types/movie.js';

	interface Props {
		movie: Movie;
		size?: 'sm' | 'md' | 'lg';
		showLabel?: boolean;
		variant?: 'overlay' | 'inline';
		onfavoriteToggle?: () => void;
	}

	let {
		movie,
		size = 'md',
		showLabel = false,
		variant = 'overlay',
		onfavoriteToggle
	}: Props = $props();

	// State
	let isFavorited = $state(false);
	let loading = $state(false);
	let error = $state<string | null>(null);

	// Larger touch targets for mobile
	const sizeClasses = {
		sm: 'w-5 h-5',
		md: 'w-6 h-6',
		lg: 'w-8 h-8'
	};

	const buttonSizeClasses = {
		sm: 'p-2', // Minimum 44px touch target
		md: 'p-2.5', // Better touch area
		lg: 'p-3'
	};

	// Check favorite status on mount
	onMount(async () => {
		try {
			isFavorited = await favoritesService.isFavorited(movie.id);
		} catch (err) {
			console.error('Failed to check favorite status:', err);
		}
	});

	// Better mobile touch handling
	async function toggleFavorite(event: Event) {
		// Prevent all event propagation first
		event.stopPropagation();
		event.stopImmediatePropagation();
		event.preventDefault();

		if (loading) return;

		loading = true;
		error = null;

		try {
			const favoriteData = {
				movie_id: movie.id,
				movie_title: movie.title,
				movie_poster: movie.poster_path,
				movie_release_date: movie.release_date,
				movie_rating: movie.vote_average
			};

			const newStatus = await favoritesService.toggleFavorite(favoriteData);
			isFavorited = newStatus;

			// Call parent callback if provided
			if (onfavoriteToggle) {
				onfavoriteToggle();
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to update favorite';
			console.error('Toggle favorite error:', err);
		} finally {
			loading = false;
		}
	}

	// Handle keyboard events
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
			toggleFavorite(event);
		}
	}

	// Touch event handlers for mobile
	function handleTouchStart(event: TouchEvent) {
		event.stopPropagation();
	}

	function handleTouchEnd(event: TouchEvent) {
		event.preventDefault();
		event.stopPropagation();
		toggleFavorite(event);
	}
</script>

<button
	onclick={toggleFavorite}
	onkeydown={handleKeydown}
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	disabled={loading}
	class="group relative z-20 rounded-full transition-all duration-200 select-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none"
	class:cursor-not-allowed={loading}
	aria-label={isFavorited
		? `Remove ${movie.title} from favorites`
		: `Add ${movie.title} to favorites`}
	title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
	style="touch-action: manipulation; min-width: 44px; min-height: 44px;"
>
	<!-- Overlay variant (for movie cards) -->
	{#if variant === 'overlay'}
		<div
			class="rounded-full bg-black/70 backdrop-blur-sm transition-all duration-200 group-hover:bg-black/90 group-active:bg-black/90 {buttonSizeClasses[
				size
			]} flex items-center justify-center"
			class:animate-pulse={loading}
			class:bg-red-600-90={isFavorited}
			class:group-hover:bg-red-700-90={isFavorited}
			class:group-active:bg-red-700-90={isFavorited}
		>
			<svg
				class="transition-all duration-200 {sizeClasses[size]}"
				class:text-red-400={isFavorited}
				class:fill-current={isFavorited}
				class:text-white={!isFavorited}
				class:group-hover:text-red-300={!isFavorited}
				class:group-active:text-red-300={!isFavorited}
				class:scale-110={isFavorited}
				fill={isFavorited ? 'currentColor' : 'none'}
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
				/>
			</svg>
		</div>

		<!-- Inline variant (for detail pages) -->
	{:else}
		<div
			class="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-3 transition-colors hover:bg-slate-600 active:bg-slate-600"
			class:animate-pulse={loading}
			class:bg-red-600={isFavorited}
			class:hover:bg-red-700={isFavorited}
			class:active:bg-red-700={isFavorited}
		>
			<svg
				class="transition-all duration-200 {sizeClasses[size]}"
				class:text-white={true}
				class:scale-110={isFavorited}
				fill={isFavorited ? 'currentColor' : 'none'}
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
				/>
			</svg>

			{#if showLabel}
				<span class="text-sm font-medium text-white">
					{isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
				</span>
			{/if}
		</div>
	{/if}

	<!-- Loading spinner overlay -->
	{#if loading}
		<div class="absolute inset-0 flex items-center justify-center">
			<div
				class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
			></div>
		</div>
	{/if}
</button>

<!-- Error toast (simple) -->
{#if error}
	<div
		class="absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 transform rounded bg-red-600 px-2 py-1 text-xs text-white shadow-lg"
	>
		{error}
	</div>
{/if}
