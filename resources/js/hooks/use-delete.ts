import { useForm } from '@inertiajs/react';

export function useDelete() {
    const form = useForm({});

    const destroy = (
        routeName: string,
        id: number | string,
        label: string,
        options: {
            confirmMessage?: string;
            onSuccess?: () => void;
            onError?: () => void;
        } = {}
    ) => {
        const confirmMsg = options.confirmMessage || `Are you sure you want to delete ${label}?`;

        if (!confirm(confirmMsg)) return;

        form.delete(route(routeName, { id }), {
            preserveScroll: true,
            preserveState: false,
            onSuccess: options.onSuccess,
            onError: options.onError,
        });
    };

    return {
        destroy,
        processing: form.processing,
        errors: form.errors,
    };
}
