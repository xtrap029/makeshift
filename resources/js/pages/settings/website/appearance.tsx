import { Head, router, useForm } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { WebsiteAppearanceForm } from '@/types/form';
import { FormEventHandler, useState } from 'react';

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
        title: 'Appearance',
        href: '/settings/appearance',
    },
];

export default function Appearance({
    websiteAppearance,
}: {
    websiteAppearance: WebsiteAppearanceForm;
}) {
    const [logoPreview, setLogoPreview] = useState('/logo.png');
    const [faviconPreview, setFaviconPreview] = useState('/favicon.ico');

    const { data, setData, processing } = useForm<WebsiteAppearanceForm>({
        logo: null,
        favicon: null,
        siteDescription: websiteAppearance.siteDescription,
        siteEmail: websiteAppearance.siteEmail,
        sitePhone: websiteAppearance.sitePhone,
        siteAddress: websiteAppearance.siteAddress,
        siteGoogleMap: websiteAppearance.siteGoogleMap,
        homeYoutubeText: websiteAppearance.homeYoutubeText,
        homeYoutubeLink: websiteAppearance.homeYoutubeLink,
        homeMapText: websiteAppearance.homeMapText,
        homeMapLink: websiteAppearance.homeMapLink,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        router.post(route('settings.website.appearance.update'), {
            _method: 'put',
            ...data,
        });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('favicon', file);
            setFaviconPreview(URL.createObjectURL(file));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Website appearance settings" />

            <SettingsLayout>
                <form onSubmit={submit} className="space-y-6">
                    <HeadingSmall
                        title="Display"
                        description="Update your website's display settings"
                    />
                    <div className="flex gap-4">
                        <div className="grid w-full gap-2">
                            <Label htmlFor="logo">Logo</Label>
                            <Input
                                id="logo"
                                type="file"
                                onChange={handleLogoChange}
                                disabled={processing}
                                accept="image/png"
                            />
                        </div>
                        <img
                            src={logoPreview}
                            alt="Logo"
                            className="h-15 w-15 rounded-md object-contain shadow-md"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="grid w-full gap-2">
                            <Label htmlFor="favicon">Favicon</Label>
                            <Input
                                id="favicon"
                                type="file"
                                onChange={handleFaviconChange}
                                disabled={processing}
                                accept="image/ico"
                            />
                        </div>
                        <img
                            src={faviconPreview}
                            alt="Favicon"
                            className="h-15 w-15 rounded-md object-contain shadow-md"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="siteDescription">Site Description</Label>
                        <Input
                            id="siteDescription"
                            type="text"
                            value={data.siteDescription}
                            onChange={(e) => setData('siteDescription', e.target.value)}
                            disabled={processing}
                            placeholder="Site Description"
                            maxLength={30}
                        />
                    </div>
                    <br />
                    <HeadingSmall title="Home Page" description="Update Home page appearance" />
                    <div className="grid gap-2">
                        <Label htmlFor="homeYoutubeText">Youtube Text</Label>
                        <Input
                            id="homeYoutubeText"
                            type="text"
                            value={data.homeYoutubeText}
                            onChange={(e) => setData('homeYoutubeText', e.target.value)}
                            disabled={processing}
                            placeholder="Youtube Text"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="homeYoutubeText">Youtube ID</Label>
                        <Input
                            id="homeYoutubeLink"
                            type="text"
                            value={data.homeYoutubeLink}
                            onChange={(e) => setData('homeYoutubeLink', e.target.value)}
                            disabled={processing}
                            placeholder="Youtube Link"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="homeMapText">Google Map Text</Label>
                        <Input
                            id="homeMapText"
                            type="text"
                            value={data.homeMapText}
                            onChange={(e) => setData('homeMapText', e.target.value)}
                            disabled={processing}
                            placeholder="Map Text"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="homeMapLink">Google Map</Label>
                        <Input
                            id="homeMapLink"
                            type="text"
                            value={data.homeMapLink}
                            onChange={(e) => setData('homeMapLink', e.target.value)}
                            disabled={processing}
                            placeholder="Map Link"
                        />
                    </div>
                    <br />
                    <HeadingSmall
                        title="Contact Page"
                        description="Update Contact Us page appearance"
                    />
                    <div className="grid gap-2">
                        <Label htmlFor="siteEmail">Email</Label>
                        <Input
                            id="siteEmail"
                            type="email"
                            value={data.siteEmail}
                            onChange={(e) => setData('siteEmail', e.target.value)}
                            disabled={processing}
                            placeholder="Site Email"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="sitePhone">Phone</Label>
                        <Input
                            id="sitePhone"
                            type="text"
                            value={data.sitePhone}
                            onChange={(e) => setData('sitePhone', e.target.value)}
                            disabled={processing}
                            placeholder="Site Phone"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="siteAddress">Address</Label>
                        <Input
                            id="siteAddress"
                            type="text"
                            value={data.siteAddress}
                            onChange={(e) => setData('siteAddress', e.target.value)}
                            disabled={processing}
                            placeholder="Office Address"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="siteGoogleMap">Google Map</Label>
                        <Input
                            id="siteGoogleMap"
                            type="text"
                            value={data.siteGoogleMap}
                            onChange={(e) => setData('siteGoogleMap', e.target.value)}
                            disabled={processing}
                            placeholder="Office Google Map"
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
