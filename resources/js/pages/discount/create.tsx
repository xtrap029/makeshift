import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Room } from '@/types';
import { DiscountForm } from '@/types/form';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Discounts', href: '/discounts' },
    { title: 'Create', href: '/discounts/create' },
];

export default function Create({ rooms }: { rooms: Room[] }) {
    const { data, setData, post, processing, errors } = useForm<DiscountForm>({
        name: '',
        description: '',
        type: 1,
        value: 0,
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
        post(route('discounts.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Discounts - Create" />
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
