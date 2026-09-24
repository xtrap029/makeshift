import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Room } from '@/types';
import { VoucherForm } from '@/types/form';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Vouchers', href: '/vouchers' },
    { title: 'Create', href: '/vouchers/create' },
];

export default function Create({ rooms }: { rooms: Room[] }) {
    const { data, setData, post, processing, errors } = useForm<VoucherForm>({
        name: '',
        description: '',
        type: 1,
        value: 0,
        min_hours: '',
        min_spend: '',
        book_from: '',
        book_to: '',
        reserve_from: '',
        reserve_to: '',
        priority: 0,
        is_active: true,
        rooms: [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('vouchers.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vouchers - Create" />
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
