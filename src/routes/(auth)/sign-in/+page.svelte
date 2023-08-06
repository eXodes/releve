<script lang="ts">
    import SignInForm from "$features/authentication/components/sign-in-form.svelte";
    import Link from "$client/components/shared/link.svelte";
</script>

<svelte:head>
    <title>Sign In</title>
</svelte:head>

<h2 class="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>

<p class="mt-2 text-sm text-gray-600">
    Or
    <Link href="/sign-up">sign up for a free account</Link>
</p>

<div class="mt-8">
    <SignInForm />

    <div class="mt-4 text-center text-sm">
        <Link href="/forgot-password">Forgot your password?</Link>
    </div>
</div>
