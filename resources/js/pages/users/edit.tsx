import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import Header from '@/components/custom/page/header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { UserForm } from '@/types/form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/users' },
    { title: 'Edit', href: '/users/edit' },
];

export default function Create({ user }: { user: User }) {
    const { data, setData, put, processing, errors } = useForm<Partial<UserForm>>({
        name: user.name,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('users.update', { user: user.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users - Edit" />
            <div className="p-4">
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <Header title="Edit User" />
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input id="email" value={user.email} disabled autoComplete="email" />
                        </div>

                        <div className="grid gap-2">
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
                                placeholder="Full name"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Password"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Password confirmation</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirm password"
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Save
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/users">Cancel</Link>
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
