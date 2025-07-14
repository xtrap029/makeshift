import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Amenity, BreadcrumbItem } from '@/types';
import { AmenityForm } from '@/types/form';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Amenities', href: '/amenities' },
    { title: 'Edit', href: '/amenities/edit' },
];

export default function Create({ amenity }: { amenity: Amenity }) {
    const { data, setData, put, processing, errors } = useForm<Partial<AmenityForm>>({
        name: amenity.name,
        description: amenity.description,
        icon: amenity.icon,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('amenities.update', { amenity: amenity.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Amenities - Edit" />
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
