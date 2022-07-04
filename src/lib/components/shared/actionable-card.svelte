<div class="shadow sm:rounded-md">
    <div class="space-y-6 bg-white py-6 px-4 sm:rounded-md sm:p-6">
        <slot />
    </div>

    <div class="flex items-center justify-end gap-4 bg-gray-50 px-4 py-3 text-right sm:px-6">
        <slot name="action" />
    </div>
</div>
