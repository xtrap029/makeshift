import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { LayoutForm } from '@/types/form';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Layouts', href: '/layouts' },
    { title: 'Create', href: '/layouts/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<Partial<LayoutForm>>({
        name: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('layouts.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Layouts - Create" />
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
