<script lang="ts">
    import AuthLayout from "$client/components/layouts/auth-layout.svelte";
    import Link from "$client/components/shared/link.svelte";
    import ForgotPasswordForm from "$features/authentication/components/forgot-password-form.svelte";
</script>

<svelte:head>
    <title>Forgot Password</title>
</svelte:head>

<AuthLayout>
    <svelte:fragment slot="title">Forgot your password?</svelte:fragment>

    <svelte:fragment slot="subtext">
        Enter your email address and we'll send you a link to reset your password.
    </svelte:fragment>

    <ForgotPasswordForm />

    <div class="mt-4 text-center text-sm">
        <Link href="/sign-in">Already have an account?</Link>
    </div>
</AuthLayout>
