import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Source } from '@/types';
import { SourceForm } from '@/types/form';
import Form from './form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Sources', href: '/sources' },
    { title: 'Edit', href: '/sources/edit' },
];

export default function Create({ source }: { source: Source }) {
    const { data, setData, put, processing, errors } = useForm<Partial<SourceForm>>({
        name: source.name,
        description: source.description || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('sources.update', { source: source.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sources - Edit" />
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
