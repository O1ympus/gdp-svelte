<script lang="ts">
	import { Toaster, type ToasterProps } from 'svelte-sonner';
	import { mode } from 'mode-watcher';
	
	let { ...restProps }: ToasterProps = $props();
</script>

<Toaster
	theme={mode.current}
	class="toaster group bg-[#151515]"
	style="--normal-bg: var(--color-popover); --normal-text: var(--color-popover-foreground); --normal-border: var(--color-border);"
	{...restProps}
/>
