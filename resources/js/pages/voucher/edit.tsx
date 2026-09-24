import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Voucher, Room } from '@/types';
import { VoucherForm } from '@/types/form';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Vouchers', href: '/vouchers' },
    { title: 'Edit', href: '/vouchers/edit' },
];

export default function Edit({ voucher, rooms }: { voucher: Voucher; rooms: Room[] }) {
    const { data, setData, put, processing, errors } = useForm<VoucherForm>({
        id: voucher.id,
        name: voucher.name,
        description: voucher.description ?? '',
        type: voucher.type,
        value: voucher.value,
        min_hours: voucher.min_hours ?? '',
        min_spend: voucher.min_spend ?? '',
        book_from: voucher.book_from,
        book_to: voucher.book_to,
        reserve_from: voucher.reserve_from,
        reserve_to: voucher.reserve_to,
        priority: voucher.priority,
        is_active: voucher.is_active,
        rooms: voucher.rooms?.map((room) => room.id) ?? [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('vouchers.update', { voucher: voucher.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vouchers - Edit" />
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
