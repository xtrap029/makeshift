import { Head, router, useForm } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import { Wysiwyg } from '@/components/custom/wysiwyg';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { LegalAppearanceForm } from '@/types/form';
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
        title: 'Website',
        href: '',
    },
    {
        title: 'Legal',
        href: '/settings/legal',
    },
];

export default function Appearance({ legalAppearance }: { legalAppearance: LegalAppearanceForm }) {
    const { data, setData, processing } = useForm<LegalAppearanceForm>({
        legalTerms: legalAppearance.legalTerms,
        legalPrivacy: legalAppearance.legalPrivacy,
        legalRules: legalAppearance.legalRules,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        router.post(route('settings.website.legal.update'), {
            _method: 'put',
            ...data,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Website appearance settings" />

            <SettingsLayout>
                <form onSubmit={submit} className="space-y-6">
                    <HeadingSmall
                        title="Display"
                        description="Update your website's legal settings"
                    />
                    <div className="grid gap-2">
                        <Label htmlFor="legalTerms">Terms & Conditions</Label>
                        <Wysiwyg
                            content={data.legalTerms}
                            onChange={(content) => setData('legalTerms', content)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="legalPrivacy">Privacy Policy</Label>
                        <Wysiwyg
                            content={data.legalPrivacy}
                            onChange={(content) => setData('legalPrivacy', content)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="legalRules">House Rules</Label>
                        <Wysiwyg
                            content={data.legalRules}
                            onChange={(content) => setData('legalRules', content)}
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
