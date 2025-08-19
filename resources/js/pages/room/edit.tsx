import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Amenity, BreadcrumbItem, Layout, Room, Schedule } from '@/types';
import { RoomForm } from '@/types/form';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rooms', href: '/rooms' },
    { title: 'Edit', href: '/rooms/edit' },
];

export default function Edit({
    room,
    amenities,
    layouts,
    schedules,
}: {
    room: Room;
    amenities: Amenity[];
    layouts: Layout[];
    schedules: Schedule[];
}) {
    const { errors } = usePage().props;
    const { data, setData, processing } = useForm<RoomForm>({
        id: room.id,
        name: room.name ?? '',
        price: room.price ?? 0,
        is_active: room.is_active ?? true,
        description: room.description ?? '',
        is_private: room.is_private ?? false,
        sqm: room.sqm ?? 0,
        qty: room.qty ?? 1,
        cap: room.cap ?? 1,
        schedule_id: room.schedule?.id ?? 0,
        amenities: room.amenities?.map((a) => a.id) ?? [],
        layouts: room.layouts?.map((l) => l.id) ?? [],
        image: null,
        image_name: room.image?.name ?? null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        router.post(route('rooms.update', { room: room.id }), {
            _method: 'put',
            ...data,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rooms - Edit" />
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
