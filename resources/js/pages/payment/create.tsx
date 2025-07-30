import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Booking, BreadcrumbItem, PaymentProvider } from '@/types';
import { PaymentForm } from '@/types/form';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Payments', href: '/payments' },
    { title: 'Create', href: '/payments/create' },
];

export default function Create({
    bookings,
    payment_providers,
    booking_id,
}: {
    bookings: Booking[];
    payment_providers: PaymentProvider[];
    booking_id: string;
}) {
    const { data, setData, post, processing, errors } = useForm<Partial<PaymentForm>>({
        booking_id: booking_id ? parseInt(booking_id) : null,
        payment_provider_id: payment_providers.find((p) => p.is_default)?.id || undefined,
        note: '',
        reference_number: '',
        amount: 0,
        amount_paid: 0,
        paid_at: '',
        attachment: null,
        with_attachment: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('payments.store'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments - Create" />
            <div className="p-4">
                <Form
                    data={data}
                    setData={setData}
                    processing={processing}
                    errors={errors}
                    bookings={bookings}
                    payment_providers={payment_providers}
                    submit={submit}
                />
            </div>
        </AppLayout>
    );
}
