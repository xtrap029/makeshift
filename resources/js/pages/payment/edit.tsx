import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Booking, BreadcrumbItem, Payment, PaymentProvider } from '@/types';
import { PaymentForm } from '@/types/form';
import dayjs from 'dayjs';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Payments', href: '/payments' },
    { title: 'Edit', href: '/payments/edit' },
];

export default function Edit({
    payment,
    bookings,
    payment_providers,
}: {
    payment: Payment;
    bookings: Booking[];
    payment_providers: PaymentProvider[];
}) {
    const { errors } = usePage().props;
    const { data, setData, processing } = useForm<Partial<PaymentForm>>({
        id: payment.id,
        booking_id: payment.booking.id,
        payment_provider_id: payment.payment_provider.id,
        note: payment.note,
        reference_number: payment.reference_number,
        amount: payment.amount,
        amount_paid: payment.amount_paid,
        paid_at: payment.paid_at ? dayjs(payment.paid_at).format('YYYY-MM-DDTHH:mm') : '',
        attachment: null,
        attachment_name: payment.attachment || null,
        with_attachment: payment.attachment ? true : false,
        status: payment.status,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        router.post(route('payments.update', { payment: payment.id }), {
            _method: 'put',
            ...data,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments - Edit" />
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
