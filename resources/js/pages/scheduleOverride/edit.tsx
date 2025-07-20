import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Room, ScheduleOverride } from '@/types';
import { ScheduleOverrideForm } from '@/types/form';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Overrides', href: '/overrides' },
    { title: 'Edit', href: '/overrides/edit' },
];

export default function Edit({
    scheduleOverride,
    rooms,
}: {
    scheduleOverride: ScheduleOverride;
    rooms: Room[];
}) {
    const { errors } = usePage().props;
    const { data, setData, processing, put } = useForm<Partial<ScheduleOverrideForm>>({
        id: scheduleOverride.id,
        date: scheduleOverride.date,
        time_start: scheduleOverride.time_start,
        time_end: scheduleOverride.time_end,
        is_open: scheduleOverride.is_open,
        note: scheduleOverride.note,
        rooms: scheduleOverride.rooms.map((room) => room.id),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('overrides.update', { override: scheduleOverride.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Overrides - Edit" />
            <div className="p-4">
                <Form
                    data={data}
                    setData={setData}
                    processing={processing}
                    errors={errors}
                    submit={submit}
                    rooms={rooms}
                />
            </div>
        </AppLayout>
    );
}
