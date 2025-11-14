<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.ts';
	import { Input } from '$lib/components/ui/input/index.ts';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.ts';
	import {
		Field,
		FieldDescription,
		FieldError,
		FieldGroup,
		FieldLabel
	} from '$lib/components/ui/field/index.ts';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	
	const id = $props.id();

	let {
		form,
	}: {
		form?: {
			data?: { username?: string; email?: string };
			errors?: Record<string, string[]>;
			error?: string;
			success?: boolean;
		};
	} = $props();
	
	const formData = $derived(form?.data || {});
	const errors = $derived(form?.errors || {});
	const generalError = $derived(form?.error);
</script>
<Card class="mx-auto w-full max-w-sm">
	<CardHeader>
		<CardTitle class="text-2xl">Login</CardTitle>
		<CardDescription>Enter your email below to login to your account</CardDescription>
	</CardHeader>
	<CardContent>
		<form
			method="POST"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'redirect') {
						toast.success('Login successful!', {
							description: 'Welcome back!'
						});
					} else if (result.type === 'failure') {
						toast.error('Login failed', {
							description: 'Please check your credentials and try again.'
						});
					}
					await update();
				};
			}}
		>
			<FieldGroup>
				{#if generalError}
					<div class="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
						{generalError}
					</div>
				{/if}
				
				{#if errors._errors}
					<div class="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
						{#each errors._errors as error (error)}
							<p>{error}</p>
						{/each}
					</div>
				{/if}
				<Field>
					<FieldLabel for="email-{id}">Email</FieldLabel>
					<Input
						id="email-{id}"
						type="email"
						placeholder="m@example.com"
						name="email"
						value={formData.email}
						required
					/>
					{#if errors.email}
						<FieldError>
							{errors.email[0]}
						</FieldError>
					{/if}
				</Field>
				<Field>
					<div class="flex items-center">
						<FieldLabel for="password-{id}">Password</FieldLabel>
					</div>
					<Input id="password-{id}" type="password" name="password" required />
					{#if errors.password}
						<FieldError>
							{errors.password[0]}
						</FieldError>
					{/if}
				</Field>
				<Field>
					<Button type="submit" class="w-full">Login</Button>
					<FieldDescription class="text-center">
						Don't have an account? <a href='/register'>Sign up</a>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	</CardContent>
</Card>
