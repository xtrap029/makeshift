import { useForm } from '@inertiajs/react';

export function useUpdateStatus(status: string, cancelReason?: string) {
    const form = useForm<{ status: string; cancel_reason?: string }>({
        status: status,
    });

    const updateStatus = ({
        id,
        label,
        options = {},
    }: {
        id: number | string;
        label: string;
        options?: {
            confirmMessage?: string;
            onSuccess?: () => void;
            onError?: () => void;
        };
    }) => {
        if (status !== 'canceled') {
            const confirmMsg =
                options.confirmMessage || `Are you sure you want to update the status of ${label}?`;
            if (!confirm(confirmMsg)) return;
        } else {
            form.data.cancel_reason = cancelReason;
        }

        form.put(route('bookings.updateStatus', { id }), {
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
