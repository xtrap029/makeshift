import Header from '@/components/custom/page/header';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Schedule } from '@/types';
import { ScheduleForm } from '@/types/form';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Schedules', href: '/schedules' },
    { title: 'Edit', href: '/schedules/edit' },
];

export default function Edit({ schedule }: { schedule: Schedule }) {
    const { errors } = usePage().props;
    const { data, setData, processing, put } = useForm<Partial<ScheduleForm>>({
        name: schedule.name,
        is_active: schedule.is_active,
        max_day: schedule.max_day,
        max_date: schedule.max_date,
        sun_start: schedule.sun_start || '',
        sun_end: schedule.sun_end || '',
        mon_start: schedule.mon_start || '',
        mon_end: schedule.mon_end || '',
        tue_start: schedule.tue_start || '',
        tue_end: schedule.tue_end || '',
        wed_start: schedule.wed_start || '',
        wed_end: schedule.wed_end || '',
        thu_start: schedule.thu_start || '',
        thu_end: schedule.thu_end || '',
        fri_start: schedule.fri_start || '',
        fri_end: schedule.fri_end || '',
        sat_start: schedule.sat_start || '',
        sat_end: schedule.sat_end || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('schedules.update', { schedule: schedule.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedules - Edit" />
            <div className="p-4">
                <Header title="Edit Schedule" />
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
