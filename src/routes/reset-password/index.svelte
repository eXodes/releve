<script lang="ts">
    import AuthLayout from "$components/layouts/auth-layout.svelte";
    import ResetPassword from "$features/authentication/components/reset-password.svelte";
    import Link from "$components/shared/link.svelte";
</script>

<svelte:head>
    <title>Reset Password</title>
</svelte:head>

<AuthLayout>
    <svelte:fragment slot="title">Reset your password</svelte:fragment>

    <svelte:fragment slot="subtext">Enter your new password below.</svelte:fragment>

    <ResetPassword />

    <div class="mt-4 text-center text-sm">
        <Link href="/sign-in">Already have an account?</Link>
    </div>
</AuthLayout>
