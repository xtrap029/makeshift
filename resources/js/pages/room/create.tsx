import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Amenity, BreadcrumbItem, Layout, Schedule } from '@/types';
import { RoomForm } from '@/types/form';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rooms', href: '/rooms' },
    { title: 'Create', href: '/rooms/create' },
];

export default function Create({
    amenities,
    layouts,
    schedules,
}: {
    amenities: Amenity[];
    layouts: Layout[];
    schedules: Schedule[];
}) {
    const { data, setData, post, processing, errors } = useForm<Partial<RoomForm>>({
        name: '',
        price: 0,
        is_active: true,
        description: '',
        is_private: true,
        sqm: 0,
        qty: 0,
        cap: 0,
        schedule_id: undefined,
        amenities: [],
        layouts: [],
        image: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('rooms.store'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rooms - Create" />
            <div className="p-4">
                <Form
                    data={data}
                    setData={setData}
                    processing={processing}
                    errors={errors}
                    amenities={amenities}
                    layouts={layouts}
                    schedules={schedules}
                    submit={submit}
                />
            </div>
        </AppLayout>
    );
}
