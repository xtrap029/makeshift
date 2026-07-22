import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SourceForm } from '@/types/form';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Sources', href: '/sources' },
    { title: 'Create', href: '/sources/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<Partial<SourceForm>>({
        name: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('sources.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sources - Create" />
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
