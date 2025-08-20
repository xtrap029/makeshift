import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Room } from '@/types';
import { ScheduleOverrideForm } from '@/types/form';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Overrides', href: '/overrides' },
    { title: 'Create', href: '/overrides/create' },
];

export default function Create({ rooms }: { rooms: Room[] }) {
    const { data, setData, post, processing, errors } = useForm<ScheduleOverrideForm>({
        date: '',
        is_open: false,
        note: '',
        rooms: [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('overrides.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Overrides - Create" />
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
