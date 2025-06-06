<script lang="ts">
	import MovieGrid from '$lib/webcomponents/movies/MovieGrid.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Dashboard - MovieSavanna</title>
	<meta
		name="description"
		content="Discover and explore thousands of movies on your personal dashboard"
	/>
</svelte:head>

<!-- Hero Section (ToDo: Break this up too) -->
<section class="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-24 pb-8">
	<div class="container mx-auto px-4">
		<div class="mb-8 text-center">
			<h1 class="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
				Discover <span class="text-blue-500">Movie</span> Savanna
			</h1>
			<p class="mx-auto max-w-3xl text-lg leading-relaxed text-gray-400 md:text-xl">
				Explore thousands of movies, search for your favorites, and discover new gems. Your personal
				cinema experience starts here.
			</p>
		</div>

		<!-- Quick Stats (ToDo: We can break this up) -->
		<div class="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
			<div class="rounded-lg bg-slate-800/50 p-4 text-center backdrop-blur-sm">
				<div class="mb-1 text-2xl font-bold text-blue-400 md:text-3xl">1M+</div>
				<div class="text-sm text-gray-400">Movies</div>
			</div>
			<div class="rounded-lg bg-slate-800/50 p-4 text-center backdrop-blur-sm">
				<div class="mb-1 text-2xl font-bold text-green-400 md:text-3xl">HD</div>
				<div class="text-sm text-gray-400">Quality</div>
			</div>
			<div class="rounded-lg bg-slate-800/50 p-4 text-center backdrop-blur-sm">
				<div class="mb-1 text-2xl font-bold text-purple-400 md:text-3xl">24/7</div>
				<div class="text-sm text-gray-400">Available</div>
			</div>
			<div class="rounded-lg bg-slate-800/50 p-4 text-center backdrop-blur-sm">
				<div class="mb-1 text-2xl font-bold text-yellow-400 md:text-3xl">Free</div>
				<div class="text-sm text-gray-400">Browsing</div>
			</div>
		</div>
	</div>
</section>

<!-- Movie Grid Section -->
<section class="bg-slate-950">
	<MovieGrid title="Popular Movies" showSearch={true} initialMovies={data.popularMovies} />
</section>
