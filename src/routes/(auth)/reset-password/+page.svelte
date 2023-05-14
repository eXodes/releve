<script lang="ts">
    import AuthLayout from "$client/components/layouts/auth-layout.svelte";
    import Link from "$client/components/shared/link.svelte";
    import ResetPasswordForm from "$features/authentication/components/reset-password-form.svelte";
</script>

<svelte:head>
    <title>Reset Password</title>
</svelte:head>

<AuthLayout>
    <svelte:fragment slot="title">Reset your password</svelte:fragment>

    <svelte:fragment slot="subtext">Enter your new password below.</svelte:fragment>

    <ResetPasswordForm />

    <div class="mt-4 text-center text-sm">
        <Link href="/sign-in">Already have an account?</Link>
    </div>
</AuthLayout>
