<script lang="ts">
	import Navbar from '$lib/webcomponents/home/Navbar.svelte';

	let { data, children } = $props();
</script>

<Navbar
	isAuthenticated={data?.userInformation.isAuthenticated || false}
	user={data?.userInformation.user || null}
/>
{@render children()}
