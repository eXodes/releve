<script lang="ts">
    import AuthLayout from "$components/layouts/auth-layout.svelte";
    import SignIn from "$features/authentication/components/sign-in.svelte";
    import Link from "$components/shared/link.svelte";
</script>

<svelte:head>
    <title>Sign In</title>
</svelte:head>

<AuthLayout>
    <svelte:fragment slot="title">Sign in to your account</svelte:fragment>

    <svelte:fragment slot="subtext">
        Or
        <Link href="/sign-up">register a free account</Link>
    </svelte:fragment>

    <SignIn />

    <div class="mt-4 text-center text-sm">
        <Link href="/forgot-password">Forgot your password?</Link>
    </div>
</AuthLayout>
