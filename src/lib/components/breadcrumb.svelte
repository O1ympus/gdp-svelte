<script lang="ts">
	import {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbPage,
		BreadcrumbSeparator
	} from '$lib/components/ui/breadcrumb/index.ts';
	import { SlashIcon } from '@lucide/svelte';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	
	const segments = derived(page, ($page) => {
		const parts = $page.url.pathname.split('/').filter(Boolean);
		
		return parts.map((part, i) => {
			const decoded = decodeURIComponent(part);
			const name = decoded
				.split(' ')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');
			
			return {
				name,
				href: '/' + parts.slice(0, i + 1).join('/')
			};
		});
	});
</script>

{#if $segments.length > 0}
	<Breadcrumb class="mb-4" aria-label="Breadcrumb">
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink class="text-base dark:text-[#A1A1A1]" href="/">Home</BreadcrumbLink>
			</BreadcrumbItem>
			
			{#each $segments as { name, href }, i (href)}
				<BreadcrumbSeparator><SlashIcon class=" dark:text-[#A1A1A1]" /></BreadcrumbSeparator>
				
				{#if i === $segments.length - 1}
					<BreadcrumbItem><BreadcrumbPage class="text-base">{name}</BreadcrumbPage></BreadcrumbItem>
				{:else}
					<BreadcrumbItem><BreadcrumbLink href={href} class="text-base dark:text-[#A1A1A1]">{name}</BreadcrumbLink></BreadcrumbItem>
				{/if}
			{/each}
		</BreadcrumbList>
	</Breadcrumb>
{/if}
