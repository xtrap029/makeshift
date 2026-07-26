import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Discount, Room } from '@/types';
import { DiscountForm } from '@/types/form';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Discounts', href: '/discounts' },
    { title: 'Edit', href: '/discounts/edit' },
];

export default function Edit({ discount, rooms }: { discount: Discount; rooms: Room[] }) {
    const { data, setData, put, processing, errors } = useForm<DiscountForm>({
        id: discount.id,
        name: discount.name,
        description: discount.description ?? '',
        type: discount.type,
        value: discount.value,
        book_from: discount.book_from,
        book_to: discount.book_to,
        reserve_from: discount.reserve_from,
        reserve_to: discount.reserve_to,
        priority: discount.priority,
        is_active: discount.is_active,
        rooms: discount.rooms?.map((room) => room.id) ?? [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('discounts.update', { discount: discount.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Discounts - Edit" />
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
