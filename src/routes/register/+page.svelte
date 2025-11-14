<script lang="ts">
	import SignupForm from '$lib/components/signup-form.svelte';
	import { page } from '$app/stores';
	
	$: form = $page.form;
</script>

<div class="flex items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-sm">
		<SignupForm {form} />
	</div>
</div>
