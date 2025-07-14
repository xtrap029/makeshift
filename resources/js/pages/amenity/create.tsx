import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { AmenityForm } from '@/types/form';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Amenities', href: '/amenities' },
    { title: 'Create', href: '/amenities/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<Partial<AmenityForm>>({
        name: '',
        description: '',
        icon: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('amenities.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Amenities - Create" />
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
