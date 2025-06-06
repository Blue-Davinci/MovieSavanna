<script lang="ts">
	import type { MovieCredits } from '$lib/types/movie.js';

	interface Props {
		credits: MovieCredits;
	}

	let { credits }: Props = $props();

	// Get main cast (top 10)
	let mainCast = $derived(credits.cast.slice(0, 10));

	// Get key crew members
	let keyCrewMembers = $derived(
		credits.crew.filter((member) =>
			[
				'Director',
				'Producer',
				'Executive Producer',
				'Screenplay',
				'Writer',
				'Cinematography',
				'Music'
			].includes(member.job)
		)
	);

	// Group crew by department
	let crewByDepartment = $derived(
		keyCrewMembers.reduce(
			(acc, member) => {
				if (!acc[member.department]) {
					acc[member.department] = [];
				}
				acc[member.department].push(member);
				return acc;
			},
			{} as Record<string, typeof keyCrewMembers>
		)
	);
</script>

<div class="space-y-6">
	<!-- Cast Section -->
	{#if mainCast.length > 0}
		<div class="rounded-xl border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-sm">
			<h2 class="mb-6 flex items-center gap-3 text-2xl font-bold text-white">
				<svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
					/>
				</svg>
				Main Cast
			</h2>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{#each mainCast as castMember}
					<div
						class="flex items-center gap-4 rounded-lg bg-slate-800/50 p-4 transition-colors hover:bg-slate-800/70"
					>
						<!-- Profile Image -->
						<div class="flex-shrink-0">
							{#if castMember.profile_path}
								<img
									src="https://image.tmdb.org/t/p/w185{castMember.profile_path}"
									alt={castMember.name}
									class="h-16 w-16 rounded-full object-cover ring-2 ring-slate-600"
									loading="lazy"
								/>
							{:else}
								<div
									class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-700 ring-2 ring-slate-600"
								>
									<svg
										class="h-8 w-8 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								</div>
							{/if}
						</div>

						<!-- Cast Info -->
						<div class="min-w-0 flex-1">
							<h3 class="truncate font-medium text-white">{castMember.name}</h3>
							<p class="truncate text-sm text-gray-400">as {castMember.character}</p>
							{#if castMember.known_for_department}
								<p class="text-xs text-gray-500">{castMember.known_for_department}</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			{#if credits.cast.length > 10}
				<div class="mt-4 text-center">
					<p class="text-sm text-gray-400">
						Showing {mainCast.length} of {credits.cast.length} cast members
					</p>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Crew Section -->
	{#if Object.keys(crewByDepartment).length > 0}
		<div class="rounded-xl border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-sm">
			<h2 class="mb-6 flex items-center gap-3 text-2xl font-bold text-white">
				<svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0V5a1 1 0 00-1-1H9a1 1 0 00-1 1v1M4 15s1-1 4-1 5 2 8 2 4-1 4-1"
					/>
				</svg>
				Key Crew
			</h2>

			<div class="space-y-6">
				{#each Object.entries(crewByDepartment) as [department, members]}
					<div>
						<h3 class="mb-3 border-b border-slate-700 pb-2 text-lg font-semibold text-white">
							{department}
						</h3>

						<div class="grid grid-cols-1 gap-3">
							{#each members as crewMember}
								<div class="flex items-center gap-4 rounded-lg bg-slate-800/30 p-3">
									<!-- Profile Image -->
									<div class="flex-shrink-0">
										{#if crewMember.profile_path}
											<img
												src="https://image.tmdb.org/t/p/w185{crewMember.profile_path}"
												alt={crewMember.name}
												class="h-12 w-12 rounded-full object-cover ring-1 ring-slate-600"
												loading="lazy"
											/>
										{:else}
											<div
												class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 ring-1 ring-slate-600"
											>
												<svg
													class="h-6 w-6 text-gray-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
													/>
												</svg>
											</div>
										{/if}
									</div>

									<!-- Crew Info -->
									<div class="min-w-0 flex-1">
										<h4 class="truncate font-medium text-white">{crewMember.name}</h4>
										<p class="text-sm text-gray-400">{crewMember.job}</p>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
