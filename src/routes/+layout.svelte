<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/header.svelte';
	import Breadcrumb from '$lib/components/breadcrumb.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<div class="min-h-screen h-fit dark:bg-[#0A0A0A]">
	<Header />
	<main class="container mx-auto mb-8">
		<Breadcrumb />
		<slot />
	</main>
	<Toaster />
</div>
