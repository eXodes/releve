<script lang="ts">
    import Link from "$client/components/shared/link.svelte";
    import ForgotPasswordForm from "$features/authentication/components/forgot-password-form.svelte";
</script>

<svelte:head>
    <title>Forgot Password</title>
</svelte:head>

<h2 class="mt-6 text-3xl font-extrabold text-gray-900">Forgot your password</h2>

<p class="mt-2 text-sm text-gray-600">
    Enter your email address and we'll send you a link to reset your password.
</p>

<div class="mt-8">
    <ForgotPasswordForm />

    <div class="mt-4 text-center text-sm">
        <Link href="/sign-in">Already have an account?</Link>
    </div>
</div>
