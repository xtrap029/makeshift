import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaymentProviderForm } from '@/types/form';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Payment Providers', href: '/payment-providers' },
    { title: 'Create', href: '/payment-providers/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<Partial<PaymentProviderForm>>({
        name: '',
        description: '',
        is_manual: false,
        is_active: true,
        is_default: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('paymentProviders.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Providers - Create" />
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
