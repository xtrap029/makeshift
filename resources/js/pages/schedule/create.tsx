import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ScheduleForm } from '@/types/form';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Schedules', href: '/schedules' },
    { title: 'Create', href: '/schedules/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<Partial<ScheduleForm>>({
        name: '',
        is_active: true,
        max_day: 0,
        max_date: new Date().toISOString().split('T')[0],
        sun_start: '',
        sun_end: '',
        mon_start: '',
        mon_end: '',
        tue_start: '',
        tue_end: '',
        wed_start: '',
        wed_end: '',
        thu_start: '',
        thu_end: '',
        fri_start: '',
        fri_end: '',
        sat_start: '',
        sat_end: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('schedules.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedules - Create" />
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
