<script lang="ts">
    import AuthLayout from "$client/components/layouts/auth-layout.svelte";
    import Link from "$client/components/shared/link.svelte";
    import SignInForm from "$features/authentication/components/sign-in-form.svelte";
</script>

<svelte:head>
    <title>Sign In</title>
</svelte:head>

<AuthLayout>
    <svelte:fragment slot="title">Sign in to your account</svelte:fragment>

    <svelte:fragment slot="subtext">
        Or
        <Link href="/sign-up">sign up for a free account</Link>
    </svelte:fragment>

    <SignInForm />

    <div class="mt-4 text-center text-sm">
        <Link href="/forgot-password">Forgot your password?</Link>
    </div>
</AuthLayout>
