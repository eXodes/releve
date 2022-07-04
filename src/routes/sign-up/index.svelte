<script lang="ts">
    import AuthLayout from "$components/layouts/auth-layout.svelte";
    import SignUp from "$features/authentication/components/sign-up.svelte";
    import Link from "$components/shared/link.svelte";
</script>

<svelte:head>
    <title>Sign Up</title>
</svelte:head>

<AuthLayout>
    <svelte:fragment slot="title">Register a free account</svelte:fragment>

    <svelte:fragment slot="subtext">
        Or
        <Link href="/sign-in">sign in to your account</Link>
    </svelte:fragment>

    <SignUp />

    <div class="mt-4 text-center text-sm">
        <Link href="/forgot-password">Forgot your password?</Link>
    </div>
</AuthLayout>
