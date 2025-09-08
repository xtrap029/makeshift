import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile appearance settings',
        href: '/settings/website/appearance',
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Display"
                        description="Update your account's display settings"
                    />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
