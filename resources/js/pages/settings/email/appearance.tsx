import { Head, router, useForm } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { EmailAppearanceForm } from '@/types/form';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Settings',
        href: '',
    },
    {
        title: 'Email',
        href: '',
    },
    {
        title: 'Appearance',
        href: '/settings/appearance',
    },
];

export default function Appearance({ emailAppearance }: { emailAppearance: EmailAppearanceForm }) {
    const { data, setData, processing } = useForm<EmailAppearanceForm>({
        bankAccount: emailAppearance.bankAccount,
        supportLink: emailAppearance.supportLink,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        router.post(route('settings.email.appearance.update'), {
            _method: 'put',
            ...data,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Email appearance settings" />

            <SettingsLayout>
                <form onSubmit={submit} className="space-y-6">
                    <HeadingSmall
                        title="General Template"
                        description="Update your email's general template settings"
                    />
                    <div className="grid gap-2">
                        <Label htmlFor="supportLink">Support Link</Label>
                        <Input
                            id="supportLink"
                            type="text"
                            value={data.supportLink}
                            onChange={(e) => setData('supportLink', e.target.value)}
                            disabled={processing}
                            placeholder="Support Link"
                        />
                    </div>
                    <br />
                    <HeadingSmall
                        title="Pending Template"
                        description="Update your email's pending mail template settings"
                    />
                    <div className="grid gap-2">
                        <Label htmlFor="bankAccount">Bank Account</Label>
                        <Input
                            id="bankAccount"
                            type="text"
                            value={data.bankAccount}
                            onChange={(e) => setData('bankAccount', e.target.value)}
                            disabled={processing}
                            placeholder="Bank Account"
                            maxLength={30}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save</Button>
                    </div>
                </form>
            </SettingsLayout>
        </AppLayout>
    );
}
