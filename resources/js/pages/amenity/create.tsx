import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { AmenityForm } from '@/types/form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Amenities', href: '/amenities' },
    { title: 'Create', href: '/amenities/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<Partial<AmenityForm>>({
        name: '',
        description: '',
        icon: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('amenities.store'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Amenities - Create" />
            <div className="p-4">
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-6 grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Name"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="col-span-6 grid gap-2">
                            <Label htmlFor="icon">
                                <a
                                    href="https://lucide.dev/icons/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    Icon Key
                                </a>
                            </Label>
                            <Input
                                id="icon"
                                type="text"
                                value={data.icon}
                                onChange={(e) => setData('icon', e.target.value)}
                                disabled={processing}
                                placeholder="e.g. 'book-open'"
                            />
                            <InputError message={errors.icon} className="mt-2" />
                        </div>
                        <div className="col-span-12 grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                type="text"
                                required
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                disabled={processing}
                                placeholder="Description"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Create
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/amenities">Cancel</Link>
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
