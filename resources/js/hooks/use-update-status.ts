import { useForm } from '@inertiajs/react';

type StatusPayload = {
    status: string;
    cancel_reason?: string;
    notify?: boolean;
    expires_at?: string;
};

export function useUpdateStatus(status: string, cancelReason?: string) {
    const form = useForm<StatusPayload>({
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
            /** Skip the browser confirm — for callers that already asked via a dialog. */
            skipConfirm?: boolean;
            /** Extra fields sent with the status (e.g. pending's notify / expires_at). */
            data?: Pick<StatusPayload, 'notify' | 'expires_at'>;
            onSuccess?: () => void;
            onError?: () => void;
        };
    }) => {
        if (status !== 'canceled') {
            if (!options.skipConfirm) {
                const confirmMsg =
                    options.confirmMessage ||
                    `Are you sure you want to update the status of ${label}?`;
                if (!confirm(confirmMsg)) return;
            }
        } else {
            form.data.cancel_reason = cancelReason;
        }

        form.transform((data) => ({ ...data, ...options.data }));

        form.put(route('bookings.updateStatus', { id }), {
            preserveScroll: true,
            // Dialog-driven callers keep their open dialog (and inline errors) on a
            // validation failure; on success state resets as before.
            preserveState: options.skipConfirm ? 'errors' : false,
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
