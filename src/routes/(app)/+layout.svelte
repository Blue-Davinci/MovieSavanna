<script lang="ts">
	import DashboardNav from '$lib/webcomponents/dashboard/DashboardNav.svelte';
	let { children, data } = $props();
	let isAuthenticated = $state(data.userInformation?.isAuthenticated || false);
	let user = $state(data.userInformation?.user || null);
</script>

{#if user}
	<DashboardNav {user} />
{/if}
{@render children()}
