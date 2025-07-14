import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaymentProvider } from '@/types';
import { PaymentProviderForm } from '@/types/form';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Payment Providers', href: '/payment-providers' },
    { title: 'Edit', href: '/payment-providers/edit' },
];

export default function Create({ paymentProvider }: { paymentProvider: PaymentProvider }) {
    const { data, setData, put, processing, errors } = useForm<Partial<PaymentProviderForm>>({
        name: paymentProvider.name,
        description: paymentProvider.description,
        is_manual: paymentProvider.is_manual,
        is_active: paymentProvider.is_active,
        is_default: paymentProvider.is_default,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('paymentProviders.update', { payment_provider: paymentProvider.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Providers - Edit" />
            <div className="p-4">
                <Form
                    data={data}
                    setData={setData}
                    processing={processing}
                    errors={errors}
                    submit={submit}
                />
            </div>
        </AppLayout>
    );
}
