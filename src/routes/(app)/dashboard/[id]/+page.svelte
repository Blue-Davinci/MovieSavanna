<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import MoviesHero from '$lib/webcomponents/movies/MoviesHero.svelte';
	import MovieDetails from '$lib/webcomponents/movies/MovieDetails.svelte';
	import MovieCast from '$lib/webcomponents/movies/MovieCast.svelte';
	import MovieVideos from '$lib/webcomponents/movies/MovieVideos.svelte';
	import ErrorState from '$lib/webcomponents/general/ErrorState.svelte';
	import LoadingSpinner from '$lib/webcomponents/general/LoadingSpinner.svelte';

	let { data } = $props();

	// Handle navigation back
	function goBack() {
		goto('/dashboard');
	}

	// Handle retry
	function retry() {
		window.location.reload();
	}
</script>

<svelte:head>
	{#if data.movieDetails}
		<title>{data.movieDetails.title} - MovieSavanna</title>
		<meta name="description" content={data.movieDetails.overview} />
		<meta property="og:title" content={data.movieDetails.title} />
		<meta property="og:description" content={data.movieDetails.overview} />
		{#if data.movieDetails.backdrop_path}
			<meta
				property="og:image"
				content="https://image.tmdb.org/t/p/w1280{data.movieDetails.backdrop_path}"
			/>
		{/if}
	{:else}
		<title>Movie Details - MovieSavanna</title>
	{/if}
</svelte:head>

<div class="min-h-screen bg-slate-950">
	{#if data.error}
		<!-- Error State -->
		<ErrorState
			title="Oops! Something went wrong"
			message={data.error}
			showRetry={true}
			showGoBack={true}
			onRetry={retry}
			onGoBack={goBack}
		/>
	{:else if data.movieDetails}
		<!-- Movie Content -->
		<div class="movie-detail-container">
			<!-- Hero Section with Integrated Back Button -->
			<MoviesHero movie={data.movieDetails} videos={data.movieVideos} onGoBack={goBack} />

			<!-- Main Content -->
			<div class="container mx-auto px-4 py-8">
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
					<!-- Main Details -->
					<div class="space-y-8 lg:col-span-2">
						<MovieDetails movie={data.movieDetails} />

						<MovieVideos videos={data.movieVideos} />
					</div>

					<!-- Sidebar -->
					<div class="space-y-8">
						<MovieCast credits={data.movieCredits} />
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Loading State -->
		<LoadingSpinner />
	{/if}
</div>

<style>
	.movie-detail-container {
		background: linear-gradient(
			to bottom,
			rgba(2, 6, 23, 0.8) 0%,
			rgba(15, 23, 42, 0.95) 50%,
			rgb(2, 6, 23) 100%
		);
	}
</style>
