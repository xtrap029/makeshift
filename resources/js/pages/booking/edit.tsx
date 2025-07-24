import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Booking, BreadcrumbItem, Layout, Room } from '@/types';
import { BookingForm } from '@/types/form';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bookings', href: '/bookings' },
    { title: 'Edit', href: '/bookings/edit' },
];

export default function Create({
    booking,
    rooms,
    layouts,
}: {
    booking: Booking;
    rooms: Room[];
    layouts: Layout[];
}) {
    const { data, setData, put, processing, errors } = useForm<Partial<BookingForm>>({
        id: booking.id,
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        customer_phone: booking.customer_phone,
        room_id: booking.room?.id,
        layout_id: booking.layout?.id,
        note: booking.note,
        qty: booking.qty,
        start_date: booking.start_date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        status: booking.status,
        expires_at: booking.expires_at,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('bookings.update', { booking: booking.id }));
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
                    rooms={rooms}
                    layouts={layouts}
                />
            </div>
        </AppLayout>
    );
}
