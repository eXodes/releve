<script lang="ts">
    import ResetPasswordForm from "$features/authentication/components/reset-password-form.svelte";
    import Link from "$client/components/shared/link.svelte";
</script>

<svelte:head>
    <title>Reset Password</title>
</svelte:head>

<h2 class="mt-6 text-3xl font-extrabold text-gray-900">Reset your password</h2>

<p class="mt-2 text-sm text-gray-600">Enter your new password below.</p>

<div class="mt-8">
    <ResetPasswordForm />

    <div class="mt-4 text-center text-sm">
        <Link href="/sign-in">Already have an account?</Link>
    </div>
</div>
