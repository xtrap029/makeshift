import { Head, router, useForm } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { EmailMailingForm } from '@/types/form';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Settings', href: '' },
    { title: 'Email', href: '' },
    { title: 'Mailing Configuration', href: '/settings/email/mailing' },
];

export default function Mailing({ mailingSettings }: { mailingSettings: EmailMailingForm }) {
    const { data, setData, processing } = useForm<EmailMailingForm>({
        bcc: mailingSettings.bcc,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        router.post(route('settings.email.mailing.update'), {
            _method: 'put',
            ...data,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mailing configuration settings" />

            <SettingsLayout>
                <form onSubmit={submit} className="space-y-6">
                    <HeadingSmall
                        title="Mailing Configuration"
                        description="Update your email's mailing settings"
                    />
                    <div className="grid gap-2">
                        <Label htmlFor="bcc">BCC</Label>
                        <Input
                            id="bcc"
                            type="text"
                            value={data.bcc ?? ''}
                            onChange={(e) => setData('bcc', e.target.value)}
                            disabled={processing}
                            placeholder="email1@example.com, email2@example.com"
                        />
                        <p className="text-muted-foreground text-xs">
                            Separate multiple email addresses with a comma. These will be BCC'd on all outgoing emails.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save</Button>
                    </div>
                </form>
            </SettingsLayout>
        </AppLayout>
    );
}
