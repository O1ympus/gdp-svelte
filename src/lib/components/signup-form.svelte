<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { ComponentProps } from 'svelte';
	import {
		Field,
		FieldDescription,
		FieldError,
		FieldGroup,
		FieldLabel
	} from '$lib/components/ui/field';
	
	let {
		form,
		...restProps
	}: {
		form?: {
			data?: { username?: string; email?: string };
			errors?: Record<string, string[]>;
			error?: string;
			success?: boolean;
		};
	} & ComponentProps<typeof Card.Root> = $props();
	
	const formData = $derived(form?.data || {});
	const errors = $derived(form?.errors || {});
	const generalError = $derived(form?.error);
	const success = $derived(form?.success);
</script>
<Card.Root {...restProps}>
	<Card.Header>
		<Card.Title>Create an account</Card.Title>
		<Card.Description>Enter your information below to create your account</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if success}
			<div class="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
				Account created successfully! You can now <a href="/login" class="underline">sign in</a>.
			</div>
		{/if}
		
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
		
		<form method="POST">
			<FieldGroup>
				<Field>
					<FieldLabel for="name">Username</FieldLabel>
					<Input
						id="name"
						type="text"
						placeholder="johndoe"
						name="username"
						value={formData.username || ''}
						required
					/>
					{#if errors.username}
						<FieldError>
							{errors.username[0]}
						</FieldError>
					{/if}
				</Field>
				<Field>
					<FieldLabel for="email">Email</FieldLabel>
					<Input
						id="email"
						type="email"
						placeholder="m@example.com"
						name="email"
						value={formData.email || ''}
						required
					/>
					{#if errors.email}
						<FieldError>
							{errors.email[0]}
						</FieldError>
					{:else}
						<FieldDescription>
							We'll use this to contact you. We will not share your email with anyone
							else.
						</FieldDescription>
					{/if}
				</Field>
				<Field>
					<FieldLabel for="password">Password</FieldLabel>
					<Input id="password" type="password" name="password" required />
					{#if errors.password}
						<FieldError>
							{errors.password[0]}
						</FieldError>
					{:else}
						<FieldDescription>Must be at least 8 characters long.</FieldDescription>
					{/if}
				</Field>
				<Field>
					<FieldLabel for="confirm-password">Confirm Password</FieldLabel>
					<Input id="confirm-password" type="password" name="confirm-password" required />
					{#if errors.confirmPassword}
						<FieldError>
							{errors.confirmPassword[0]}
						</FieldError>
					{:else}
						<FieldDescription>Please confirm your password.</FieldDescription>
					{/if}
				</Field>
				<FieldGroup>
					<Field>
						<Button type="submit">Create Account</Button>
						<FieldDescription class="px-6 text-center">
							Already have an account? <a href='/login'>Sign in</a>
						</FieldDescription>
					</Field>
				</FieldGroup>
			</FieldGroup>
		</form>
	</Card.Content>
</Card.Root>
