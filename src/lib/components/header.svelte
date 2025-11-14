<script lang="ts">
	import { user } from '$lib/stores/user';
	import ModeToggle from '$lib/components/mode-toggle.svelte';
	import cn from 'classnames';
	import { match } from 'path-to-regexp';
	import { page } from '$app/stores';
	
	$: navLinks = $user
		? [
			{ href: '/', label: "Home" },
			{ href: '/countries', label: "Countries" },
			{ href: '/compare', label: "Compare" },
			{ href: '/saved', label: "Saved" },
			{ href: '/logout', label: "Logout" },
		]
		: [
			{ href: '/', label: "Home" },
			{ href: '/countries', label: "Countries" },
			{ href: '/compare', label: "Compare" },
			{ href: '/login', label: "Login" },
			{ href: '/register', label: "Register" },
		];
	
	$: currentPath = $page.url.pathname;
</script>

<header class="shadow p-4 mb-4">
	<div class="container mx-auto flex justify-between items-center">
		<a href='/' class="text-xl font-bold">GDP App</a>
		
		<div class="flex items-center gap-6">
			{#if $user}
				<span class="text-gray-700 dark:text-gray-300">Welcome, <strong>{$user.username}</strong></span>
			{/if}
			<nav>
				<ul class="flex gap-6">
					{#each navLinks as link (link.href)}
						<li>
							<a href={link.href} class={cn(
								{
									'dark:text-gray-300': !!match(link.href)(currentPath)
								},
									"text-gray-700 hover:text-gray-900 dark:hover:text-gray-300 dark:text-[#626262] transition-colors duration-300"
								)}
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
			<ModeToggle />
		</div>
	</div>
</header>
