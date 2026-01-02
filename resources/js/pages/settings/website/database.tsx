import { Head, router, useForm } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { DatabaseSettingsForm } from '@/types/form';
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
        title: 'Database',
        href: '/settings/website/database',
    },
];

export default function Database({ databaseSettings }: { databaseSettings: DatabaseSettingsForm }) {
    const { data, setData, processing } = useForm<DatabaseSettingsForm>({
        backupLimit: databaseSettings.backupLimit,
        backupFrequency: databaseSettings.backupFrequency,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        router.post(route('settings.website.database.update'), {
            _method: 'put',
            ...data,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Website database settings" />

            <SettingsLayout>
                <form onSubmit={submit} className="space-y-6">
                    <HeadingSmall
                        title="Database"
                        description="Update your website's database settings"
                    />
                    <div className="grid gap-2">
                        <Label htmlFor="backupLimit">Backup Limit</Label>
                        <Input
                            type="number"
                            value={data.backupLimit}
                            onChange={(e) => setData('backupLimit', parseInt(e.target.value))}
                            min={1}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="backupFrequency">Backup Frequency</Label>
                        <Select
                            value={data.backupFrequency}
                            onValueChange={(value) => setData('backupFrequency', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="every_12_hours">Every 12 Hours</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="every_two_days">Every Two Days</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="biweekly">Biweekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save</Button>
                    </div>
                </form>
            </SettingsLayout>
        </AppLayout>
    );
}
