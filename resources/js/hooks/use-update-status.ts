import { useForm } from '@inertiajs/react';

export function useUpdateStatus(status: string) {
    const form = useForm<{ status: string }>({
        status: status,
    });

    const updateStatus = ({
        routeName,
        id,
        label,
        options = {},
    }: {
        routeName: string;
        id: number | string;
        label: string;
        options?: {
            confirmMessage?: string;
            onSuccess?: () => void;
            onError?: () => void;
        };
    }) => {
        const confirmMsg =
            options.confirmMessage || `Are you sure you want to update the status of ${label}?`;

        if (!confirm(confirmMsg)) return;

        form.put(route(routeName, { id }), {
            preserveScroll: true,
            preserveState: false,
            onSuccess: options.onSuccess,
            onError: options.onError,
        });
    };

    return {
        updateStatus,
        processing: form.processing,
        errors: form.errors,
    };
}
