import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Layout } from '@/types';
import { LayoutForm } from '@/types/form';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Layouts', href: '/layouts' },
    { title: 'Edit', href: '/layouts/edit' },
];

export default function Create({ layout }: { layout: Layout }) {
    const { data, setData, put, processing, errors } = useForm<Partial<LayoutForm>>({
        name: layout.name,
        description: layout.description,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('layouts.update', { layout: layout.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Layouts - Edit" />
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
