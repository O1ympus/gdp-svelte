<script lang="ts">
	import LoginForm from '$lib/components/login-form.svelte';
	import { page } from '$app/stores';
	
	$: form = $page.form;
</script>

<div class="flex w-full items-center justify-center px-4 pt-20">
	<LoginForm {form} />
</div>
