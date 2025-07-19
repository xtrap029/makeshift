import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Layout, Room } from '@/types';
import { BookingForm } from '@/types/form';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bookings', href: '/bookings' },
    { title: 'Create', href: '/bookings/create' },
];

export default function Create({ rooms, layouts }: { rooms: Room[]; layouts: Layout[] }) {
    const { data, setData, post, processing, errors } = useForm<Partial<BookingForm>>({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        room_id: undefined,
        layout_id: undefined,
        note: '',
        qty: 1,
        start_date: '',
        start_time: '',
        end_time: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('bookings.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bookings - Create" />
            <div className="p-4">
                <Form
                    data={data}
                    setData={setData}
                    processing={processing}
                    errors={errors}
                    submit={submit}
                    rooms={rooms}
                    layouts={layouts}
                />
            </div>
        </AppLayout>
    );
}
