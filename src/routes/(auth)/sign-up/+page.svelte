<script lang="ts">
    import SignUpForm from "$features/authentication/components/sign-up-form.svelte";
    import Link from "$client/components/shared/link.svelte";
</script>

<svelte:head>
    <title>Sign Up</title>
</svelte:head>

<h2 class="mt-6 text-3xl font-extrabold text-gray-900">Register a free account</h2>

<p class="mt-2 text-sm text-gray-600">
    Or
    <Link href="/sign-in">sign in to your account</Link>
</p>

<div class="mt-8">
    <SignUpForm />

    <div class="mt-4 text-center text-sm">
        <Link href="/forgot-password">Forgot your password?</Link>
    </div>
</div>
